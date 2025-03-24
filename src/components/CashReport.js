import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendurl } from './backend_url';

export default function CashReport() {
    const url = backendurl();
    const [cashReportData, setCashReportData] = useState(null);

    useEffect(() => {
        const fetchCashReport = async () => {
            try {
                const response = await axios.get(`${url}show_cash_report`);
                console.log("Cash Report Data: ", response.data.total_javak);
                setCashReportData(response.data.data);
            } catch (error) {
                console.error("Error fetching cash report:", error);
            }
        };
        fetchCashReport();
    }, []);

    if (!cashReportData) return <div className="text-center text-lg font-semibold">Loading...</div>;

    return (
        <div className='card mt-4 reportbackground p-4'>
            <div className="mb-2 flex justify-center items-center">
                <img
                    src="/static/pinak enterprise gujrati logo_page-0001.jpg"
                    alt="Logo"
                    className="w-20 rounded-full"
                />
            </div>

            <div className='flex justify-start gap-3 mt-4 ms-4'>
                <div className="text-lg font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md w-fit border border-blue-500">
                    Initial Amount:  ₹{cashReportData.initial_amount}
                </div>
                <div className="text-lg font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md w-fit border border-blue-500">
                    Credit/Debit Money:  ₹{cashReportData.avak_javak_rokad}
                </div>
                <div className="text-lg font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md w-fit border border-blue-500">
                    Final Balance:  ₹{cashReportData.final_Balance}
                </div>
            </div>

            <div className="container mx-auto p-6">

                <div className="">
                    <div className="">
                        <div className="font-bold bg-green-500 text-white py-2 px-1">Credit Transactions</div>
                        <div className='table-responsive'></div>
                        <table className="w-full border-collapse border rounded-lg shadow-md">
                            <thead>
                                <tr className="bg-green-300">
                                    <th className="border p-2">Bank Name</th>
                                    <th className="border p-2">Amount</th>
                                    <th className="border p-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cashReportData.credit_in_bank_data.map((item, index) => (
                                    <tr key={index} className="bg-green-300">
                                        <td className="border p-2">{item.bank_id__bank_name}</td>
                                        <td className="border p-2">₹{item.amount}</td>
                                        <td className="border p-2">{item.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-3">
                    <div className="">
                        <div className="font-bold bg-red-500 text-white py-2 px-1">Debit Transactions</div>
                        <div className='table-responsive'>
                            <table className="w-full border-collapse border rounded-lg shadow-md">
                                <thead>
                                    <tr className="bg-red-200">
                                        <th className="border p-2">Bank Name</th>
                                        <th className="border p-2">Amount</th>
                                        <th className="border p-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cashReportData.debit_in_bank_data.map((item, index) => (
                                        <tr key={index} className="bg-red-200">
                                            <td className="border p-2">{item.bank_id__bank_name}</td>
                                            <td className="border p-2">₹{item.amount}</td>
                                            <td className="border p-2">{item.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>



                <div className="mt-3">
                    <div className="">
                        <div className="borderr reporttitle font-bold">Total Maintenance Amount Data</div>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2">S.N</th>
                                        <th className="border px-4 py-2">Date</th>
                                        <th className="border px-4 py-2">Amount</th>
                                        <th className="border px-4 py-2">Paid By</th>
                                        <th className="border px-4 py-2">Paid</th>
                                        <th className="border px-4 py-2">Maintenance Type</th>
                                        <th className="border px-4 py-2">Person</th>
                                        <th className="border px-4 py-2">Driver</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cashReportData.total_maintenance_amount_data.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border px-4 py-2">{index + 1 || "N/A"}</td>
                                            <td className="border px-4 py-2">{item.machine_maintenance_date}</td>
                                            <td className="border px-4 py-2">{item.machine_maintenance_amount}</td>
                                            <td className="border px-4 py-2">{item.machine_maintenance_amount_paid_by}</td>
                                            <td className="border px-4 py-2">{item.machine_maintenance_amount_paid ? "Yes" : "No"}</td>
                                            <td className="border px-4 py-2">{item.machine_maintenance_types_id__maintenance_type_name}</td>
                                            <td className="border px-4 py-2">{item.machine_maintenance_person_id__person_name || "-"}</td>
                                            <td className="border px-4 py-2">{item.machine_maintenance_driver_id__person_name || "-"}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="8">
                                            <span className="font-bold text-base text-green-800">
                                                Total Amount: ₹{cashReportData.total_maintenance_amount}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>


                <div className="">
                    <div className="">
                        <div className="borderr reporttitle font-bold">
                            Project Person Rokad Pay Data
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2">S.N</th>
                                        <th className="border px-4 py-2">Person Name</th>
                                        <th className="border px-4 py-2">Person ID</th>
                                        <th className="border px-4 py-2">Contact Number</th>
                                        <th className="border px-4 py-2">Work Type</th>
                                        <th className="border px-4 py-2">Work Num</th>
                                        <th className="border px-4 py-2">Price</th>
                                        <th className="border px-4 py-2">Total Price</th>
                                        <th className="border px-4 py-2">Paid By</th>
                                        <th className="border px-4 py-2">Project Name</th>
                                        <th className="border px-4 py-2">Project Owner</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cashReportData.projectperson_rokad_pay_data.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border px-4 py-2">{index + 1}</td>
                                            <td className="border px-4 py-2">{item.person_id__person_name || "-"}</td>
                                            <td className="border px-4 py-2">{item.person_id__person_id || "-"}</td>
                                            <td className="border px-4 py-2">{item.person_id__person_contact_number || "-"}</td>
                                            <td className="border px-4 py-2">{item.work_type_id__work_type_name}</td>
                                            <td className="border px-4 py-2">{item.project_person_work_num}</td>
                                            <td className="border px-4 py-2">₹{item.project_person_price}</td>
                                            <td className="border px-4 py-2">₹{item.project_person_total_price}</td>
                                            <td className="border px-4 py-2">{item.project_person_paid_by}</td>
                                            <td className="border px-4 py-2">{item.project_id__project_name}</td>
                                            <td className="border px-4 py-2">{item.project_id__project_owner_name__person_name}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="11">
                                            <span className="font-bold text-base text-green-800">
                                                Total Amount: ₹{cashReportData.projectperson_rokad_pay_total}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

    <div className="">
      <div className="">
        <div className="borderr reporttitle font-bold">
          Project Person Rokad Pay Expense
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th className="border px-4 py-2">S.N</th>
                <th className="border px-4 py-2">Expense Name</th>
                <th className="border px-4 py-2">Project Name</th>
                <th className="border px-4 py-2">Expense Date</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Payment Mode</th>
                <th className="border px-4 py-2">Bank Name</th>
                <th className="border px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {cashReportData.projectExpense_rokad_pay_data.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{item.project_expense_name}</td>
                  <td className="border px-4 py-2">{item.project_id__project_name}</td>
                  <td className="border px-4 py-2">{item.project_expense_date}</td>
                  <td className="border px-4 py-2">₹{item.project_expense_amount}</td>
                  <td className="border px-4 py-2">{item.project_payment_mode}</td>
                  <td className="border px-4 py-2">{item.bank_id__bank_name || '-'}</td>
                  <td className="border px-4 py-2">{item.project_expense_desc}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="8">
                  <span className="font-bold text-base text-green-800">
                    Total Amount: ₹{cashReportData.projectExpense_rokad_pay_total}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>


    <div className="">
  <div className="">
    <div className="borderr reporttitle font-bold">
      Avak In Rokad Data
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
          </tr>
        </thead>
        <tbody>
          {cashReportData.avak_in_rokad_data.map((item, index) => (
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
              <td className="border px-4 py-2">{item.project_id__project_name}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="10">
              <span className="font-bold text-base text-green-800">
                Total Amount: ₹{cashReportData.total_aavak}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<div className="">
  <div className="">
    <div className="borderr reporttitle font-bold">
      Javak In Rokad Data
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
          </tr>
        </thead>
        <tbody>
          {cashReportData.javak_in_rokad_data.map((item, index) => (
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
            </tr>
          ))}
          <tr>
            <td colSpan="10">
              <span className="font-bold text-base text-green-800">
                Total Amount: ₹{cashReportData.total_javak}
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