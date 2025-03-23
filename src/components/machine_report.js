import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendurl } from './backend_url';


const MachineReport = () => {
      const urll = backendurl();
    const [machineData, setMachineData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMachineData = async () => {
            try {
                const response = await axios.get(`${urll}machine_report/`); // Adjust the URL as needed
                setMachineData(response.data.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMachineData();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error fetching data: {error.message}</div>;
    }

    return (
        <div className="machine-report">
            <h3 className="text-2xl font-bold mb-3">Machine Report</h3>
            {machineData.length === 0 ? (
                <p>No machine data available.</p>
            ) : (
                <>
                    {machineData.map((machine, index) => (
                        <div key={index} className="card mb-3">
                            <h5 className="text-xl font-semibold">{machine.machine_info.machine_name}({machine.machine_info.machine_number_plate})</h5>
                            <div className='grid grid-cols-2 md:grid-cols-4 md:gap-2 mb-4'>
                                <div><strong>Register Date:</strong> {machine.machine_info.machine_register_date}</div>
                                <div><strong>Owner:</strong> {machine.machine_info.machine_owner}</div>
                                <div><strong>machine_types_name:</strong> {machine.machine_info.machine_types_name}</div>
                                <div><strong>Buy Price:</strong> {machine.machine_info.machine_buy_price}</div>
                                <div><strong>Buy Date:</strong> {machine.machine_info.machine_buy_date}</div>
                                <div><strong>machine_details:</strong> {machine.machine_info.machine_details}</div>
                            </div>

                            {machine.projectwisedata.length > 0 && (
                                <div className='card mb-3 px-4'>
                                    {machine.projectwisedata.map((projectData, projectIndex) => (
                                        <div key={projectIndex}>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <tbody>
                                                        <tr>
                                                            <td><strong>Project Name:</strong> {projectData.project_info.project_name}</td>
                                                            <td><strong>Project Amount:</strong> {projectData.project_info.project_amount}</td>
                                                            <td><strong>Project Location:</strong> {projectData.project_info.project_location}</td>
                                                            <td><strong>Project Owner:</strong> {projectData.project_info.project_owner_name}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            {projectData.project_machine_data && (
                                                <div>
                                                    <div className="table-responsive">
                                                        <table className='table'>
                                                            <thead>
                                                                <tr>
                                                                    <th>Date</th>
                                                                    <th>Work Type</th>
                                                                    <th>Work Number</th>
                                                                    <th>price</th>
                                                                    <th>total Price</th>
                                                                    <th>details</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {projectData.project_machine_data.map((data, dataIndex) => (
                                                                    <tr key={dataIndex}>
                                                                        <td>{data.project_machine_date}</td>
                                                                        <td>{data.work_type_id__work_type_name}</td>
                                                                        <td>{data.project_machine_data_work_number}</td>
                                                                        <td>{data.project_machine_data_work_price}</td>
                                                                        <td>{data.project_machine_data_total_amount}</td>
                                                                        <td>{data.project_machine_data_work_details}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default MachineReport;