import { React, useEffect, useState } from 'react';
import axios from 'axios';
import { backendurl } from './backend_url';
import { useOffice, OfficeSelection } from './Context/ContextDataShare';

export default function OfficeReport() {
  const {officeExpenseID} = useOffice()
  const url = backendurl();
  const [officeReportData, setOfficeReportData] = useState(null);

  useEffect(() => {
    const fetchOfficeReport = async () => {
      try {
        const response = await axios.get(`${url}office_kharch_khatu?office_kharch_id=${officeExpenseID}`);
        console.log("Fetched Office Report:", response.data);
        setOfficeReportData(response.data);
      } catch (error) {
        console.error("Error fetching cash report:", error);
      }
    };
    fetchOfficeReport();
  }, [officeExpenseID]);

  const reportArray = 
    officeReportData && Array.isArray(officeReportData.data)
      ? officeReportData.data
      : []; 

  return (
    <div>
      
      <OfficeSelection />
      <div className='card mt-4 reportbackground p-4'>
        <div className="mb-2 flex justify-center items-center">
          <img
            src="/static/pinak enterprise gujrati logo_page-0001.jpg"
            alt="Logo"
            className="w-20 rounded-full"
          />
        </div>

        <div className="">
          <div className="">
            <div className="borderr reporttitle font-bold">
              Office Kharch Data
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">S.N</th>
                    <th className="border px-4 py-2">Sender Person</th>
                    <th className="border px-4 py-2">Receiver Person</th>
                    <th className="border px-4 py-2">Pay Type</th>
                    <th className="border px-4 py-2">Money Date</th>
                    <th className="border px-4 py-2">Money Amount</th>
                    <th className="border px-4 py-2">Payment Details</th>
                    <th className="border px-4 py-2">Machine Name</th>
                    <th className="border px-4 py-2">Machine Number Plate</th>
                    <th className="border px-4 py-2">Project Name</th>
                    <th className="border px-4 py-2">Office Kharch Type</th>
                  </tr>
                </thead>
                <tbody>
                  {reportArray.length > 0 ? (
                    reportArray.map((item, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{item.sender_person_id__person_name}</td>
                        <td className="border px-4 py-2">{item.receiver_person_id__person_name}</td>
                        <td className="border px-4 py-2">{item.pay_type_id__pay_type_name}</td>
                        <td className="border px-4 py-2">{item.money_date}</td>
                        <td className="border px-4 py-2">₹{item.money_amount}</td>
                        <td className="border px-4 py-2">{item.money_payment_details || '-'}</td>
                        <td className="border px-4 py-2">{item.machine_id__machine_name || '-'}</td>
                        <td className="border px-4 py-2">{item.machine_id__machine_number_plate || '-'}</td>
                        <td className="border px-4 py-2">{item.project_id__project_name || '-'}</td>
                        <td className="border px-4 py-2">{item.office_kharch_id__office_kharch_type_name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="border px-4 py-2 text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="11">
                      <span className="font-bold text-base text-green-800">
                        Total Amount: ₹{officeReportData?.total || 0}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
