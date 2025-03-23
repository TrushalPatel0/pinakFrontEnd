import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendurl } from './backend_url';

const OverallReport = () => {
      const urll = backendurl();
    
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [kulkharch, setkulkharch] = useState(0);
    const [nafo_nuksan, setnafo_nuksan] = useState(0);
    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const response = await axios.get(`${urll}overall_report/`); // Adjust the URL as needed
                setReportData(response.data);
                const kulkharch = 
    parseFloat(response.data.totals.total_salary?.total_salary || 0) +
    parseFloat(response.data.totals.total_maintenance?.total_maintenance || 0) +
    parseFloat(response.data.totals.total_machine_rent?.total_rent || 0) +
    parseFloat(response.data.totals.total_person_price?.total_person_price || 0) +
    parseFloat(response.data.totals.total_material_amount?.total_material || 0);
                setkulkharch(kulkharch);
                setnafo_nuksan(parseFloat(response.data.totals.total_project_amount.total_project || 0) - kulkharch)

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReportData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data: {error.message}</div>;

    const {
        salary_data,
        machine_rent_data,
        Machine_Maintenance_data,
        Project_data,
        material_data,
        person_data,
        money_debit_data,
        money_credit_data,
        totals,
    } = reportData;

    return (
        <div className="">
            <h3 className='mb-3'>Overall Report</h3>
            <div className='mb-3 grid grid-cols-2 md:grid-cols-6 gap-2'>
                <div className='card'>કુલ પગાર : {totals.total_salary.total_salary}</div>
                <div className='card'>કુલ મરામત ખર્ચ: {totals.total_maintenance.total_maintenance}</div>
                <div className='card'>કુલ મશીન ભાડું: {totals.total_machine_rent.total_rent}</div>
                <div className='card'>કુલ વ્યક્તિ ખર્ચ: {totals.total_person_price.total_person_price}</div>
                <div className='card'>કુલ મટિરિયલ ખર્ચ: {totals.total_material_amount.total_material}</div>
                <div className='card'>કુલ પ્રોજેક્ટ રકમ : {totals.total_project_amount.total_project}</div>
                <div className='card'>કુલ જાવક: {totals.total_money_debit.total_debit}</div>
                <div className='card'>કુલ આવક: {totals.total_money_credit.total_credit}</div>
                <div className='card bg-success text-white'>કુલ કમાણી રકમ: {totals.total_project_amount.total_project}</div> 
                <div className='card bg-danger text-white'>કુલ ખર્ચ: {kulkharch}</div>  
                {nafo_nuksan > 0 ? (
                    <div className='card bg-success text-white'>નફો : {nafo_nuksan}</div>
                ) : (
                    <div className='card bg-danger text-white'>નુકસાન : {nafo_nuksan*-1}</div>
                )}
                
                
            </div>
            
            <div className="table-responsive card mb-3">
            <h5>પગાર ખર્ચ</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>તારીખ</th>
                            <th>રકમ</th>
                            <th>કામ કરેલ દિવસ</th>
                            <th>વિગત</th>
                            <th>વ્યક્તિ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salary_data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.salary_date}</td>
                                <td>{item.salary_amount}</td>
                                <td>{item.salary_working_days}</td>
                                <td>{item.salary_details}</td>
                                <td>{item.person_id__person_name} | PHN: {item.person_id__person_contact_number}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h6>કુલ પગાર : {totals.total_salary.total_salary}</h6>
            </div>

            <div className="table-responsive card mb-3">
            <h5>ભાડેથી મશીન ખર્ચ</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>મશીન</th>
                            <th>કામ ના પ્રકાર</th>
                            <th>ભાવ</th>
                            <th>કુલ ભાડું</th>
                        </tr>
                    </thead>
                    <tbody>
                        {machine_rent_data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.machine_rent_machine_id__machine_name} ({item.machine_rent_machine_id__machine_number_plate})</td>
                                <td>{item.machine_rented_work_type__work_type_name}</td>
                                <td>{item.machine_rented_work_price}</td>
                                <td>{item.rent_amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h6>કુલ મશીન ભાડું: {totals.total_machine_rent.total_rent}</h6>
            </div>

            
            <div className="table-responsive card mb-3">
            <h5>મશીન મરામત ખર્ચ</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>મશીન</th>
                            <th>રકમ</th>
                            <th>તારીખ</th>
                            <th>વ્યક્તિ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Machine_Maintenance_data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.machine_machine_id__machine_name} ({item.machine_machine_id__machine_number_plate})</td>
                                <td>{item.machine_maintenance_amount}</td>
                                <td>{item.machine_maintenance_date}</td>
                                <td>{item.machine_maintenance_person_id__person_name} | PHN : {item.machine_maintenance_person_id__person_contact_number}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h6>કુલ મરામત ખર્ચ: {totals.total_maintenance.total_maintenance}</h6>
            </div>

            
            <div className="table-responsive card mb-3">
            <h5>પ્રોજેક્ટસ</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>પ્રોજેક્ટ નામ</th>
                            <th>પ્લેસ</th>
                            <th>રકમ</th>
                            <th>સ્ટેટસ</th>
                            <th>માલિક</th>
                           
                        </tr>
                    </thead>
                    <tbody>
                        {Project_data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.project_name}</td>
                                <td>{item.project_location}</td>
                                <td>{item.project_amount}</td>
                                <td>{item.project_status}</td>
                                <td>{item.project_owner_name__person_name} | PHN : {item.project_owner_name__person_contact_number}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h6>કુલ પ્રોજેક્ટ રકમ : {totals.total_project_amount.total_project}</h6>
            </div>

            
            <div className="table-responsive card mb-3">
            <h5>મટિરિયલ ખર્ચ</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>તારીખ</th>
                            <th>મટિરિયલ માલિક</th>
                            <th>રકમ</th>
                            <th>વિગત</th>
                        </tr>
                    </thead>
                    <tbody>
                        {material_data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.project_material_date}</td>
                                <td>{item.project_material_material_id__material_owner__person_name}{item.project_material_material_id__material_owner__person_contact_number}</td>
                                <td>{item.project_material_total_amount}</td>
                                <td>{item.project_material_material_id__material_details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h6>કુલ મટિરિયલ ખર્ચ: {totals.total_material_amount.total_material}</h6>
            </div>

            
            <div className="table-responsive card mb-3">
            <h5>ભથ્થું/વ્યક્તિ ખર્ચ</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>વ્યક્તિ</th>
                            <th>કામ પ્રકાર</th>
                            <th>કામ</th>
                            <th>ભાવ</th>
                            <th>કુલ ભાવ</th>
                            <th>ખર્ચ કરનાર</th>
                            <th>પ્રોજેક્ટ નામ</th>
                            <th>પ્રોજેક્ટ માલિક</th>
                        </tr>
                    </thead>
                    <tbody>
                        {person_data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.person_id__person_name} | PHN : {item.person_id__person_contact_number}</td>
                                <td>{item.work_type_id__work_type_name}</td>
                                <td>{item.project_person_work_num}</td>
                                <td>{item.project_person_price}</td>
                                <td>{item.project_person_total_price}</td>
                                <td>{item.project_person_paid_by}</td>
                                <td>{item.project_id__project_name}</td>
                                <td>{item.project_id__project_owner_name__person_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h6>કુલ વ્યક્તિ ખર્ચ: {totals.total_person_price.total_person_price}</h6>
            </div>

            
            <div className="table-responsive card mb-3">
            <h5>ચૂકવેલ/જાવક રકમ</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>વ્યક્તિ</th>
                            <th>ખર્ચ પ્રકાર</th>
                            <th>ખર્ચ મોડ</th>
                            <th>રકમ</th>
                            <th>તારીખ</th>
                            <th>બૅંક નામ</th>
                            <th>વિગત</th>
                            <th>મશીન</th>
                            <th>પ્રોજેક્ટ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {money_debit_data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.receiver_person_id__person_name} | PHN : {item.receiver_person_id__person_contact_number}</td>
                                <td>{item.pay_type_id__pay_type_name}</td>
                                <td>{item.money_payment_mode}</td>
                                <td>{item.money_amount}</td>
                                <td>{item.money_date}</td>
                                <td>{item.sender_bank_id__bank_name}</td>
                                <td>{item.money_payment_details}</td>
                                <td>{item.machine_id__machine_name}({item.machine_id__machine_number_plate})</td>
                                <td>{item.project_id__project_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h6>કુલ ચૂકવેલ રકમ: {totals.total_money_debit.total_debit}</h6>
            </div>

            
            <div className="table-responsive card mb-3">
            <h5>આવક રકમ</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>વ્યક્તિ</th>
                            <th>ખર્ચ પ્રકાર</th>
                            <th>ખર્ચ મોડ</th>
                            <th>રકમ</th>
                            <th>તારીખ</th>
                            <th>બૅંક નામ</th>
                            <th>વિગત</th>
                            <th>મશીન</th>
                            <th>પ્રોજેક્ટ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {money_credit_data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.sender_person_id__person_name} -     
                                {item.sender_person_id__person_contact_number}</td>
                                <td>{item.pay_type_id__pay_type_name}</td>
                                <td>{item.money_payment_mode}</td>
                                <td>{item.money_amount}</td>
                                <td>{item.money_date}</td>
                                <td>{item.sender_bank_id__bank_name}</td>
                                <td>{item.money_payment_details}</td>
                                <td>{item.machine_id__machine_name} ({item.machine_id__machine_number_plate})</td>
                                <td>{item.project_id__project_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h6>કુલ આવક: {totals.total_money_credit.total_credit}</h6>
            </div>
        </div>
    );
};

export default OverallReport;