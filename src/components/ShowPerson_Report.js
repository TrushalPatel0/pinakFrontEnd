import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendurl } from './backend_url';
import { useUser, UserSelection } from "./Context/ContextDataShare";

export default function ShowPerson_Report() {
    const { userId } = useUser();
    const url = backendurl();
    const [personReportData, setPersonReportData] = useState(null);

    useEffect(() => {
        const fetchShowPersonReport = async () => {
            try {
                const response = await axios.get(`${url}show_person_report/?person_id=${userId}`);
                console.log("Person Report Data: ", response.data.data);
                setPersonReportData(response.data.data);
            } catch (error) {
                console.error("Error fetching person report:", error);
            }
        };
        fetchShowPersonReport();
    }, [userId]);
    return (
        <div>
            <UserSelection />
            <div className='card mt-4 reportbackground p-4'>
                <div className="mb-2 flex justify-center items-center">
                    <img
                        src="/static/pinak enterprise gujrati logo_page-0001.jpg"
                        alt="Logo"
                        className="w-20 rounded-full"
                    />
                </div>

                <div className='grid grid-cols-2 md:grid-cols-4 mb-4 mt-4'>
                    <div className="text-lg font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md w-fit border border-blue-500">
                        Person Name: {personReportData?.person_data?.person_name}
                    </div>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-4 mb-3 gap-2'>
                    <div className={`card font-semibold ${parseFloat(personReportData?.person_details_data?.person_aapididhel_rakam_total) > 0 ? "text-success" : "text-danger"}`}>
                        person_aapididhel_rakam_total : <span><i class="fa-solid fa-indian-rupee-sign"></i> {personReportData?.person_details_data?.person_aapididhel_rakam_total}</span>
                    </div>



                    <div className={`card font-semibold ${parseFloat(personReportData?.person_details_data?.levani_baki_rakam) > 0 ? "text-success" : "text-danger"}`}>levani_baki_rakam : <span><i class="fa-solid fa-indian-rupee-sign"></i>  {personReportData?.person_details_data?.levani_baki_rakam}</span></div>

                    <div className={`card font-semibold ${parseFloat(personReportData?.person_details_data?.aapvani_baki_rakam) > 0 ? "text-success" : "text-danger"}`}>aapvani_baki_rakam : <span><i class="fa-solid fa-indian-rupee-sign"></i> {personReportData?.person_details_data?.aapvani_baki_rakam}</span></div>


                    <div className={`card font-semibold ${parseFloat(personReportData?.person_details_data?.final_rakam) > 0 ? "text-success" : "text-danger"}`}>final_rakam : <span><i class="fa-solid fa-indian-rupee-sign"></i> {personReportData?.person_details_data?.final_rakam}</span></div>
                </div>

                {personReportData?.person_details_data?.amount_from_project_day_detail_data?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">amount_from_project_day_detail_data</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>ક્રમ </th>
                                            <th>તારીખ</th>
                                            <th>મશીન નામ</th>
                                            <th>કામ ના પ્રકાર</th>
                                            <th>ટાયર</th>
                                            <th>કામ</th>
                                            <th>ભાવ</th>
                                            <th>કુલ ભાવ</th>
                                            <th>project_day_detail_details</th>
                                            <th>project_id_id</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {personReportData.person_details_data.amount_from_project_day_detail_data.map((detail, index) => (
                                            <tr key={detail.project_day_detail_id}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.proejct_day_detail_date || "N/A"}</td>
                                                <td>{detail.project_day_detail_machine_id_id || "N/A"}</td>
                                                <td>{detail.project_day_detail_work_type_id || "N/A"}</td>
                                                <td>{detail.project_day_detail_total_tyres}</td>
                                                <td>{detail.project_day_detail_work_no || "N/A"}</td>
                                                <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_day_detail_price || "N/A"}</td>
                                                <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_day_detail_total_price || "N/A"}</td>
                                                <td> {detail.project_day_detail_details || "N/A"}</td>
                                                <td> {detail.project_id_id || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="7">
                                                <span className="font-bold text-base text-green-800">
                                                    કુલ રકમ :{' '}
                                                    <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {personReportData.person_details_data.amount_from_project_day_detail_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}


                {personReportData?.person_details_data?.amount_to_discount_project_owner_data?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">amount_to_discount_project_owner_data</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N </th>
                                            <th>project_discount </th>
                                            <th>project_name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {personReportData.person_details_data.amount_to_discount_project_owner_data.map((detail, index) => (
                                            <tr key={detail.project_day_detail_id}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.project_discount || "N/A"}</td>
                                                <td>{detail.project_name || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="7">
                                                <span className="font-bold text-base text-green-800">
                                                    કુલ રકમ :{' '}
                                                    <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {personReportData.person_details_data.amount_to_discount_project_owner_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}

                {personReportData?.person_details_data?.amount_from_bhagidari_in_project?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">amount_from_bhagidari_in_project</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N</th>
                                            <th>project_investor_amount </th>
                                            <th>project_name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {personReportData.person_details_data.amount_from_bhagidari_in_project.map((detail, index) => (
                                            <tr key={detail.project_day_detail_id}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.project_investor_amount || "N/A"}</td>
                                                <td>{detail.project_name || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="7">
                                                <span className="font-bold text-base text-green-800">
                                                    કુલ રકમ :{' '}
                                                    <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {personReportData.person_details_data.amount_from_bhagidari_in_project_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}


                {personReportData?.person_details_data?.amount_to_bhagidari_in_project_data?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">amount_to_bhagidari_in_project_data</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N</th>
                                            <th>mudirokan_amt </th>
                                            <th>project_name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {personReportData.person_details_data.amount_to_bhagidari_in_project_data.map((detail, index) => (
                                            <tr key={detail.project_day_detail_id}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.mudirokan_amt || "N/A"}</td>
                                                <td>{detail.project_name || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="7">
                                                <span className="font-bold text-base text-green-800">
                                                    કુલ રકમ :{' '}
                                                    <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {personReportData.person_details_data.amount_to_bhagidari_in_project_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}


                {personReportData?.person_details_data?.amount_to_dalali_in_project_data?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">amount_to_dalali_in_project_data</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N</th>
                                            <th>dalali_amt </th>
                                            <th>project_name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {personReportData.person_details_data.amount_to_dalali_in_project_data.map((detail, index) => (
                                            <tr key={detail.project_day_detail_id}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.dalali_amt || "N/A"}</td>
                                                <td>{detail.project_name || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="7">
                                                <span className="font-bold text-base text-green-800">
                                                    કુલ રકમ :{' '}
                                                    <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {personReportData.person_details_data.amount_to_dalali_in_project_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}


                {personReportData?.person_details_data?.amount_from_maintenance_machine_owner_data?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">amount_from_maintenance_machine_owner_data</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N</th>
                                            <th>machine_maintenance_id </th>
                                            <th>machine_machine_id_id</th>
                                            <th>machine_maintenance_amount</th>
                                            <th>machine_maintenance_date</th>
                                            <th>machine_maintenance_amount_paid_by</th>
                                            <th>machine_maintenance_amount_paid</th>
                                            <th>machine_maintenance_types_id_id</th>
                                            <th>machine_maintenance_details</th>
                                            <th>machine_maintenance_driver_id_id</th>
                                            <th>machine_maintenance_person_id_id</th>
                                            <th>project_id_id</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {personReportData.person_details_data.amount_from_maintenance_machine_owner_data.map((detail, index) => (
                                            <tr key={detail.project_day_detail_id}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.machine_maintenance_id || "N/A"}</td>
                                                <td>{detail.machine_machine_id_id || "N/A"}</td>
                                                <td>{detail.machine_maintenance_amount || "N/A"}</td>
                                                <td>{detail.machine_maintenance_date || "N/A"}</td>
                                                <td>{detail.machine_maintenance_amount_paid_by || "N/A"}</td>
                                                <td>{detail.machine_maintenance_amount_paid || "N/A"}</td>
                                                <td>{detail.machine_maintenance_types_id_id || "N/A"}</td>
                                                <td>{detail.machine_maintenance_details || "N/A"}</td>
                                                <td>{detail.machine_maintenance_driver_id_id || "N/A"}</td>
                                                <td>{detail.machine_maintenance_person_id_id || "N/A"}</td>
                                                <td>{detail.project_id_id || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="7">
                                                <span className="font-bold text-base text-green-800">
                                                    કુલ રકમ :{' '}
                                                    <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {personReportData.person_details_data.amount_from_maintenance_machine_owner_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}

                {personReportData?.person_details_data?.amount_to_rent_machine_owner_data?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">amount_to_rent_machine_owner_data</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N</th>
                                            <th>project_machine_data_id </th>
                                            <th>project_machine_date</th>
                                            <th>machine_project_id_id</th>
                                            <th>work_type_id_id</th>
                                            <th>project_machine_data_work_number</th>
                                            <th>project_machine_data_work_price</th>
                                            <th>project_machine_data_km</th>
                                            <th>project_machine_data_total_amount</th>
                                            <th>project_machine_data_work_details</th>
                                            <th>project_machine_data_more_details</th>
                                            <th>project_id_id</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {personReportData.person_details_data.amount_to_rent_machine_owner_data.map((detail, index) => (
                                            <tr key={detail.project_day_detail_id}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.project_machine_data_id || "N/A"}</td>
                                                <td>{detail.project_machine_date || "N/A"}</td>
                                                <td>{detail.machine_project_id_id || "N/A"}</td>
                                                <td>{detail.work_type_id_id || "N/A"}</td>
                                                <td>{detail.project_machine_data_work_number || "N/A"}</td>
                                                <td>{detail.project_machine_data_work_price || "N/A"}</td>
                                                <td>{detail.project_machine_data_km || "N/A"}</td>
                                                <td>{detail.project_machine_data_total_amount || "N/A"}</td>
                                                <td>{detail.project_machine_data_work_details || "N/A"}</td>
                                                <td>{detail.project_machine_data_more_details || "N/A"}</td>
                                                <td>{detail.project_id_id || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="7">
                                                <span className="font-bold text-base text-green-800">
                                                    કુલ રકમ :{' '}
                                                    <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {personReportData.person_details_data.amount_to_rent_machine_owner_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}

                {personReportData?.person_details_data?.amount_from_machine_owner_in_project_person_data?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">amount_from_machine_owner_in_project_person_data</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N</th>
                                            <th>project_person_id </th>
                                            <th>person_id_id</th>
                                            <th>project_person_date</th>
                                            <th>work_type_id_id</th>
                                            <th>project_machine_data_id_id</th>
                                            <th>project_person_work_num</th>
                                            <th>project_person_price</th>
                                            <th>project_person_total_price</th>
                                            <th>project_person_paid_by</th>
                                            <th>project_person_payment_details</th>
                                            <th>project_person_more_details</th>
                                            <th>project_id_id</th>
                                            <th>bank_id_id</th>
                                            <th>person_payment_mode</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {personReportData.person_details_data.amount_from_machine_owner_in_project_person_data.map((detail, index) => (
                                            <tr key={detail.project_day_detail_id}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.project_person_id || "N/A"}</td>
                                                <td>{detail.person_id_id || "N/A"}</td>
                                                <td>{detail.project_person_date || "N/A"}</td>
                                                <td>{detail.work_type_id_id || "N/A"}</td>
                                                <td>{detail.project_machine_data_id_id || "N/A"}</td>
                                                <td>{detail.project_person_work_num || "N/A"}</td>
                                                <td>{detail.project_person_price || "N/A"}</td>
                                                <td>{detail.project_person_total_price || "N/A"}</td>
                                                <td>{detail.project_person_paid_by || "N/A"}</td>
                                                <td>{detail.project_person_payment_details || "N/A"}</td>
                                                <td>{detail.project_person_more_details || "N/A"}</td>
                                                <td>{detail.project_id_id || "N/A"}</td>
                                                <td>{detail.bank_id_id || "N/A"}</td>
                                                <td>{detail.person_payment_mode || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="7">
                                                <span className="font-bold text-base text-green-800">
                                                    કુલ રકમ :{' '}
                                                    <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {personReportData.person_details_data.amount_from_machine_owner_in_project_person_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}

                {personReportData?.person_details_data?.person_aapididhel_rakam_data?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">person_aapididhel_rakam_data</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N</th>
                                            <th>money_id </th>
                                            <th>sender_person_id_id</th>
                                            <th>receiver_person_id_id</th>
                                            <th>pay_type_id_id</th>
                                            <th>money_payment_mode</th>
                                            <th>money_amount</th>
                                            <th>money_date</th>
                                            <th>sender_bank_id_id</th>
                                            <th>money_sender_cheque_no</th>
                                            <th>receiver_bank_id_id</th>
                                            <th>money_payment_details</th>
                                            <th>machine_id_id</th>
                                            <th>project_id_id</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {personReportData.person_details_data.person_aapididhel_rakam_data.map((detail, index) => (
                                            <tr key={detail.project_day_detail_id}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.money_id || "N/A"}</td>
                                                <td>{detail.sender_person_id_id || "N/A"}</td>
                                                <td>{detail.receiver_person_id_id || "N/A"}</td>
                                                <td>{detail.pay_type_id_id || "N/A"}</td>
                                                <td>{detail.money_payment_mode || "N/A"}</td>
                                                <td>{detail.money_amount || "N/A"}</td>
                                                <td>{detail.money_date || "N/A"}</td>
                                                <td>{detail.sender_bank_id_id || "N/A"}</td>
                                                <td>{detail.money_sender_cheque_no || "N/A"}</td>
                                                <td>{detail.receiver_bank_id_id || "N/A"}</td>
                                                <td>{detail.money_payment_details || "N/A"}</td>
                                                <td>{detail.machine_id_id || "N/A"}</td>
                                                <td>{detail.project_id_id || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="7">
                                                <span className="font-bold text-base text-green-800">
                                                    કુલ રકમ :{' '}
                                                    <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {personReportData.person_details_data.person_aapididhel_rakam_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}


                {personReportData?.person_details_data?.amount_to_maintenance_person_data?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">amount_to_maintenance_person_data</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N</th>
                                            <th>machine_maintenance_id</th>
                                            <th>machine_machine_id_id</th>
                                            <th>machine_maintenance_amount</th>
                                            <th>machine_maintenance_date</th>
                                            <th>machine_maintenance_amount_paid_by</th>
                                            <th>machine_maintenance_amount_paid</th>
                                            <th>machine_maintenance_types_id_id</th>
                                            <th>machine_maintenance_details</th>
                                            <th>machine_maintenance_driver_id_id</th>
                                            <th>machine_maintenance_person_id_id</th>
                                            <th>project_id_id</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {personReportData.person_details_data.amount_to_maintenance_person_data.map((detail, index) => (
                                            <tr key={detail.project_day_detail_id}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.machine_maintenance_id || "N/A"}</td>
                                                <td>{detail.machine_machine_id_id || "N/A"}</td>
                                                <td>{detail.machine_maintenance_amount || "N/A"}</td>
                                                <td>{detail.machine_maintenance_date || "N/A"}</td>
                                                <td>{detail.machine_maintenance_amount_paid_by || "N/A"}</td>
                                                <td>{detail.machine_maintenance_amount_paid ? "Paid" : "Not Paid"}</td>
                                                <td>{detail.machine_maintenance_types_id_id || "N/A"}</td>
                                                <td>{detail.machine_maintenance_details || "N/A"}</td>
                                                <td>{detail.machine_maintenance_driver_id_id || "N/A"}</td>
                                                <td>{detail.machine_maintenance_person_id_id || "N/A"}</td>
                                                <td>{detail.project_id_id || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="7">
                                                <span className="font-bold text-base text-green-800">
                                                    કુલ રકમ :{' '}
                                                    <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {personReportData.person_details_data.amount_to_maintenance_person_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}

                {personReportData?.person_details_data?.amount_to_material_person_data?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">amount_to_material_person_data</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N</th>
                                            <th>material_id</th>
                                            <th>material_type_id_id</th>
                                            <th>material_owner_id</th>
                                            <th>material_status</th>
                                            <th>material_buy_date</th>
                                            <th>material_buy_location</th>
                                            <th>material_work_type_id</th>
                                            <th>material_work_no</th>
                                            <th>material_price</th>
                                            <th>material_total_price</th>
                                            <th>material_is_agent</th>
                                            <th>material_agent_person_id</th>
                                            <th>material_agent_name</th>
                                            <th>material_agent_contact</th>
                                            <th>material_agent_price_choice</th>
                                            <th>material_agent_percentage</th>
                                            <th>material_agent_amount</th>
                                            <th>material_final_amount</th>
                                            <th>material_details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {personReportData.person_details_data.amount_to_material_person_data.map((detail, index) => (
                                            <tr key={detail.project_day_detail_id}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.material_id || "N/A"}</td>
                                                <td>{detail.material_type_id_id || "N/A"}</td>
                                                <td>{detail.material_owner_id || "N/A"}</td>
                                                <td>{detail.material_status ? "Active" : "Inactive"}</td>
                                                <td>{detail.material_buy_date || "N/A"}</td>
                                                <td>{detail.material_buy_location || "N/A"}</td>
                                                <td>{detail.material_work_type_id || "N/A"}</td>
                                                <td>{detail.material_work_no || "N/A"}</td>
                                                <td>{detail.material_price || "N/A"}</td>
                                                <td>{detail.material_total_price || "N/A"}</td>
                                                <td>{detail.material_is_agent ? "Yes" : "No"}</td>
                                                <td>{detail.material_agent_person_id || "N/A"}</td>
                                                <td>{detail.material_agent_name || "N/A"}</td>
                                                <td>{detail.material_agent_contact || "N/A"}</td>
                                                <td>{detail.material_agent_price_choice || "N/A"}</td>
                                                <td>{detail.material_agent_percentage || "N/A"}</td>
                                                <td>{detail.material_agent_amount || "N/A"}</td>
                                                <td>{detail.material_final_amount || "N/A"}</td>
                                                <td>{detail.material_details || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="7">
                                                <span className="font-bold text-base text-green-800">
                                                    કુલ રકમ :{' '}
                                                    <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {personReportData.person_details_data.amount_to_material_person_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}


                {personReportData?.person_details_data?.amount_to_driverEmployee_data?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">amount_to_driverEmployee_data</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N</th>
                                            <th>salary_id</th>
                                            <th>salary_date</th>
                                            <th>salary_amount</th>
                                            <th>salary_working_days</th>
                                            <th>salary_details</th>
                                            <th>person_id_id</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {personReportData.person_details_data.amount_to_driverEmployee_data.map((detail, index) => (
                                            <tr key={detail.project_day_detail_id}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.salary_id || "N/A"}</td>
                                                <td>{detail.salary_date || "N/A"}</td>
                                                <td>{detail.salary_amount || "N/A"}</td>
                                                <td>{detail.salary_working_days ? "Active" : "Inactive"}</td>
                                                <td>{detail.salary_details || "N/A"}</td>
                                                <td>{detail.person_id_id || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="7">
                                                <span className="font-bold text-base text-green-800">
                                                    કુલ રકમ :{' '}
                                                    <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {personReportData.person_details_data.amount_to_driverEmployee_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}

                {personReportData?.person_details_data?.amount_to_dalali_in_material_data?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">amount_to_dalali_in_material_data</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N</th>
                                            <th>material_id</th>
                                            <th>material_type_id_id</th>
                                            <th>material_owner_id</th>
                                            <th>material_status</th>
                                            <th>material_buy_date</th>
                                            <th>material_buy_location</th>
                                            <th>material_work_type_id</th>
                                            <th>material_work_no</th>
                                            <th>material_price</th>
                                            <th>material_total_price</th>
                                            <th>material_is_agent</th>
                                            <th>material_agent_person_id</th>
                                            <th>material_agent_name</th>
                                            <th>material_agent_contact</th>
                                            <th>material_agent_price_choice</th>
                                            <th>material_agent_percentage</th>
                                            <th>material_agent_amount</th>
                                            <th>material_final_amount</th>
                                            <th>material_details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {personReportData.person_details_data.amount_to_dalali_in_material_data.map((detail, index) => (
                                            <tr key={detail.project_day_detail_id}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.material_id || "N/A"}</td>
                                                <td>{detail.material_type_id_id || "N/A"}</td>
                                                <td>{detail.material_owner_id || "N/A"}</td>
                                                <td>{detail.material_status ? "Active" : "Inactive"}</td>
                                                <td>{detail.material_buy_date || "N/A"}</td>
                                                <td>{detail.material_buy_location || "N/A"}</td>
                                                <td>{detail.material_work_type_id || "N/A"}</td>
                                                <td>{detail.material_work_no || "N/A"}</td>
                                                <td>{detail.material_price || "N/A"}</td>
                                                <td>{detail.material_total_price || "N/A"}</td>
                                                <td>{detail.material_is_agent ? "Yes" : "No"}</td>
                                                <td>{detail.material_agent_person_id || "N/A"}</td>
                                                <td>{detail.material_agent_name || "N/A"}</td>
                                                <td>{detail.material_agent_contact || "N/A"}</td>
                                                <td>{detail.material_agent_price_choice || "N/A"}</td>
                                                <td>{detail.material_agent_percentage || "N/A"}</td>
                                                <td>{detail.material_agent_amount || "N/A"}</td>
                                                <td>{detail.material_final_amount || "N/A"}</td>
                                                <td>{detail.material_details || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="7">
                                                <span className="font-bold text-base text-green-800">
                                                    કુલ રકમ :{' '}
                                                    <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {personReportData.person_details_data.amount_to_dalali_in_material_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}

                {personReportData?.person_details_data?.person_chukvel_rakam_data?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">person_chukvel_rakam_data</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N</th>
                                            <th>money_id</th>
                                            <th>sender_person_id_id</th>
                                            <th>receiver_person_id_id</th>
                                            <th>pay_type_id_id</th>
                                            <th>money_payment_mode</th>
                                            <th>money_amount</th>
                                            <th>money_date</th>
                                            <th>sender_bank_id_id</th>
                                            <th>money_sender_cheque_no</th>
                                            <th>receiver_bank_id_id</th>
                                            <th>money_payment_details</th>
                                            <th>machine_id_id</th>
                                            <th>project_id_id</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {personReportData.person_details_data.person_chukvel_rakam_data.map((detail, index) => (
                                            <tr key={detail.project_day_detail_id}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.money_id || "N/A"}</td>
                                                <td>{detail.sender_person_id_id || "N/A"}</td>
                                                <td>{detail.receiver_person_id_id || "N/A"}</td>
                                                <td>{detail.pay_type_id_id || "N/A"}</td>
                                                <td>{detail.money_payment_mode || "N/A"}</td>
                                                <td>{detail.money_amount || "N/A"}</td>
                                                <td>{detail.money_date || "N/A"}</td>
                                                <td>{detail.sender_bank_id_id || "N/A"}</td>
                                                <td>{detail.money_sender_cheque_no || "N/A"}</td>
                                                <td>{detail.receiver_bank_id_id || "N/A"}</td>
                                                <td>{detail.money_payment_details || "N/A"}</td>
                                                <td>{detail.machine_id_id || "N/A"}</td>
                                                <td>{detail.project_id_id || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="7">
                                                <span className="font-bold text-base text-green-800">
                                                    કુલ રકમ :{' '}
                                                    <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {personReportData.person_details_data.person_chukvel_rakam_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}


            </div>
        </div>
    );
}