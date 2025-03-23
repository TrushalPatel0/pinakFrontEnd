import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendurl } from './backend_url';


const PersonReport = () => {
      const urll = backendurl();
    const [personData, setPersonData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPersonData = async () => {
            try {
                const response = await axios.get(`${urll}person_report/`); // Adjust the URL as needed
                setPersonData(response.data.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonData();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error fetching data: {error.message}</div>;
    }

    return (
        <div className="person-report">
            <h3 className="text-2xl font-bold mb-3">Person Report</h3>
            {personData.length === 0 ? (
                <p>No person data available.</p>
            ) : (
                <>
                    {personData.map((person, index) => (
                        <div key={index} className="card mb-3 p-4 border rounded shadow">
                            <h5 className="text-xl font-semibold">
                                {person.person_info?.person_name} ({person.person_info?.person_contact_number})
                            </h5>
                            <div className='grid grid-cols-2 md:grid-cols-4 md:gap-2 mb-4'>
                                <div><strong>Register Date:</strong> {person.person_info?.person_register_date}</div>
                                {person.person_info.person_salary && (<div><strong>Salary:</strong> {person.person_info?.person_salary}</div>)}
                            </div>

                            {/* Project-wise data */}
                            {person.projectwisedata?.length > 0 && (
                                <div className='card mb-3 px-4'>
                                    <h6 className="text-lg font-semibold">Projects</h6>
                                    {person.projectwisedata.map((projectData, projectIndex) => (
                                        <div key={projectIndex} className="mb-2">
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <tbody>
                                                        <tr>
                                                            <td><strong>Project Name:</strong> {projectData.project_info?.project_name}</td>
                                                            <td><strong>Project Amount:</strong> {projectData.project_info?.project_amount}</td>
                                                            <td><strong>Project Location:</strong> {projectData.project_info?.project_location}</td>
                                                            <td><strong>Project Owner:</strong> {projectData.project_info?.project_owner_name}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Project person data */}
                                            {projectData.project_person_data?.length > 0 && (
                                                <div>
                                                    <div className="table-responsive">
                                                        <table className='table'>
                                                            <thead>
                                                                <tr>
                                                                    <th>Work Type</th>
                                                                    <th>Work Number</th>
                                                                    <th>Price</th>
                                                                    <th>Total Price</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {projectData.project_person_data.map((data, dataIndex) => (
                                                                    <tr key={dataIndex}>
                                                                        <td>{data.work_type_id__work_type_name}</td>
                                                                        <td>{data.project_person_work_num}</td>
                                                                        <td>{data.project_person_price}</td>
                                                                        <td>{data.project_person_total_price}</td>
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

                            {/* Maintenance data */}
                            {person.maintenance_data?.length > 0 && (
                                <div className='card mb-3 px-4'>
                                    <h6 className="text-lg font-semibold">Maintenance Data</h6>
                                    {person.maintenance_data.map((maintenance, maintenanceIndex) => (
                                        <div key={maintenanceIndex}>
                                            <div className="table-responsive">
                                                <table className='table'>
                                                    <tbody>
                                                        <tr>
                                                            <td><strong>મશીન નામ:</strong> {maintenance.machine_machine_name}</td>
                                                            <td><strong>મરામત અમાઉન્ટ:</strong> {maintenance.machine_maintenance_amount}</td>
                                                            <td><strong>મરામત તારીખ:</strong> {maintenance .machine_maintenance_date}</td>
                                                            <td><strong>મરામત પ્રકાર:</strong> {maintenance.machine_maintenance_types_name}</td>
                                                            <td><strong>મરામત વિગત :</strong> {maintenance.machine_maintenance_details}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
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

export default PersonReport;