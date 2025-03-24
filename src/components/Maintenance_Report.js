import { React, useState, useEffect } from 'react'
import { backendurl } from './backend_url';
import axios from 'axios';

export default function Maintenance_Report() {
    const url = backendurl()
    const [maintenanceData, setMaintenanceData] = useState([]);
    useEffect(() => {
        const fetchMaintenanceReport = async () => {
            try {
                const response = await axios.get(`${url}maintenance_report`);
                setMaintenanceData(response.data);
            } catch (error) {
                console.error("Error fetching maintenance report:", error);
            }
        };
        fetchMaintenanceReport();
    }, []);
    return (
        <div>
            <div className='card mt-4 reportbackground p-4'>
                <div className="mb-2 flex justify-center items-center">
                    <img
                        src="/static/pinak enterprise gujrati logo_page-0001.jpg"
                        alt="Logo"
                        className="w-20 rounded-full"
                    />
                </div>




                {maintenanceData?.data?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">Maintenance Data</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N</th>
                                            <th>Maintenance Amount</th>
                                            <th>Machine Name</th>
                                            <th>Number Plate</th>
                                            <th>Maintenance Date</th>
                                            <th>Paid By</th>
                                            <th>Paid</th>
                                            <th>Maintenance Type</th>
                                            <th>Details</th>
                                            <th>Maintenance Person</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {maintenanceData.data.map((detail, index) => (
                                            <tr key={detail.project_day_detail_id}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.machine_maintenance_amount ?? "N/A"}</td>
                                                <td>{detail.machine_machine_id__machine_name ?? "N/A"}</td>
                                                <td>{detail.machine_machine_id__machine_number_plate ?? "N/A"}</td>
                                                <td>{detail.machine_maintenance_date ?? "N/A"}</td>
                                                <td>{detail.machine_maintenance_amount_paid_by ?? "N/A"}</td>
                                                <td>{detail.machine_maintenance_amount_paid ? "Yes" : "No"}</td>
                                                <td>{detail.machine_maintenance_types_id__maintenance_type_name ?? "N/A"}</td>
                                                <td>{detail.machine_maintenance_details || "No Details"}</td>
                                                <td>{detail.machine_maintenance_person_id__person_name ?? "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="10">
                                                <span className="font-bold text-base text-green-800">
                                                    Total Amount <i className="fa-solid fa-indian-rupee-sign"></i>{maintenanceData.maintenance_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}

                
    <div className='card mt-3'>
    <div className="grid grid-cols-2 gap-4">
        <div>
          <h6 className="font-bold mb-2">Maintenance Categorical Data</h6>
          <div className="gap-2 border p-2" style={{maxHeight: "300px", overflow: "auto"}}>
            {maintenanceData?.maintenance_categorical_data?.map((item, index) => (
              <div key={index} className="flex justify-between border-b p-2" style={{maxHeight: "100px", overflow: "auto"}}>
                <span>{item.category_name}</span>
                <span>{item.total}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h6 className="font-bold mb-2">Machine Wise Maintenance Data</h6>
          <div className="gap-2 border p-2" style={{maxHeight: "300px", overflow: "auto"}}>
            {maintenanceData?.machine_wise_maintenance_data?.map((item, index) => (
              <div key={index} className="flex justify-between border-b p-2" >
                <span>{item.machine_name}</span>
                <span>{item.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
        
            
            </div>

        </div>
    )
}
