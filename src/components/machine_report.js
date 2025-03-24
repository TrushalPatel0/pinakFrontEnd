import { React, useState, useEffect } from 'react'
import axios from 'axios'
import { backendurl } from './backend_url'
import { useMachine, MachineSelection } from './Context/ContextDataShare'

export default function Machine_report() {
    const {machineID} = useMachine()

    const url = backendurl()
    const [machineReportData, setMachineReportData] = useState([]);
    const [projectwisemachineReportData, setprojectwisemachineReportData] = useState([]);


    useEffect(() => {
        const fetchMachineReport = async () => {
            try {
                const response = await axios.get(`${url}machine_report/?machine_id=${machineID}`)
                setMachineReportData(response.data.data)
                setprojectwisemachineReportData(response.data.data.projectwisedata)
            }
            catch (error) {
                console.log(error)
            }
        }
        fetchMachineReport();
    }, [machineID])

    return (
        <div>
            <MachineSelection />
            <div className='card mt-4 reportbackground p-4'>
                <div className="mb-3 flex justify-center items-center">
                    <img
                        src="/static/pinak enterprise gujrati logo_page-0001.jpg"
                        alt="Logo"
                        className="w-20 rounded-full"
                    />
                </div>

                <div className='grid grid-cols-2 md:grid-cols-5 gap-3 mb-3'>
                    <div className="font-semibold text-gray-800 rounded-lg shadow-md px-4 py-2 border border-blue-500">
                        Machine Name: {machineReportData?.machine_info?.machine_name}
                    </div>

                    <div className="font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md border border-blue-500">
                        Plate Number: {machineReportData?.machine_info?.machine_number_plate}
                    </div>

                    <div className="font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md border border-blue-500">
                        Machine Own: {machineReportData?.machine_info?.machine_own}
                    </div>

                    <div className="font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md border border-blue-500">
                        Owner Name: {machineReportData?.machine_info?.machine_owner}
                    </div>

                    <div className="font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md border border-blue-500">
                        Owner Contact: {machineReportData?.machine_info?.Owner_contact}
                    </div>
                </div>

                <div className='grid grid-cols-3 md:grid-cols-5 mb-3 gap-3'>
                    <div className="font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md border border-blue-500">
                        Register Date: {machineReportData?.machine_info?.machine_register_date}
                    </div>

                    <div className="font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md border border-blue-500">
                        Type Name: {machineReportData?.machine_info?.machine_types_name}
                    </div>

                    <div className="font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md border border-blue-500">
                        Buy Date: {machineReportData?.machine_info?.machine_buy_date}
                    </div>

                    <div className="font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md border border-blue-500">
                        Buy Price: {machineReportData?.machine_info?.machine_buy_price}
                    </div>
                    <div className="font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md border border-blue-500">
                        Details: {machineReportData?.machine_info?.machine_details}
                    </div>
                </div>



                {projectwisemachineReportData?.length > 0 && (
                    projectwisemachineReportData.map((project, index) => (
                        <div key={index} className="mt-1">
                            <div className="grid grid-cols-8 gap-1">
                                <div className="col-span-2 md:col-span-1 border flex items-center justify-center font-semibold border-r-0" style={{ backgroundColor: '#CFE2FF' }}>{project.project_info.project_name}</div>
                                <div className="col-span-6 md:col-span-7">
                                    {project.project_machine_data.length > 0 && (
                                        <div className="table-responsive">
                                            <table className="table mb-1">
                                                <thead className="table-primary">
                                                    <tr>
                                                        <th>project_machine_date</th>
                                                        <th>work_type_id__work_type_name</th>
                                                        <th>project_machine_data_work_number</th>
                                                        <th>project_machine_data_work_price</th>
                                                        <th>project_machine_data_total_amount</th>
                                                        <th>project_machine_data_work_details</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {project.project_machine_data.map((item, i) => (
                                                        <tr key={i}>
                                                            <td>{item.project_machine_date}</td>
                                                            <td>{item.work_type_id__work_type_name}</td>
                                                            <td>{item.project_machine_data_work_number}</td>
                                                            <td>{item.project_machine_data_work_price}</td>
                                                            <td>{item.project_machine_data_total_amount}</td>
                                                            <td>{item.project_machine_data_work_details}</td>
                                                        </tr>
                                                    ))}
                                                    <tr className="font-bold bg-gray-200">
                                                        <td colSpan="6" className="text-right">Total Machine Amount: {project.project_machine_data_total || "N/A"}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {project.maintenance_data.length > 0 && (
                                        <div className="table-responsive">
                                            <table className="table mb-1">
                                                <thead className="table-primary">
                                                    <tr>
                                                        <th>Maintenance Amount</th>
                                                        <th>Maintenance Date</th>
                                                        <th>Paid By</th>
                                                        <th>Amount Paid</th>
                                                        <th>Maintenance Type</th>
                                                        <th>Person Name</th>
                                                        <th>Driver Name</th>
                                                        <th>Details</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {project.maintenance_data.map((item, i) => (
                                                        <tr key={i}>
                                                            <td>{item.machine_maintenance_amount || "N/A"}</td>
                                                            <td>{item.machine_maintenance_date || "N/A"}</td>
                                                            <td>{item.machine_maintenance_amount_paid_by || "N/A"}</td>
                                                            <td>{item.machine_maintenance_amount_paid ? "Yes" : "No"}</td>
                                                            <td>{item.machine_maintenance_types_id__maintenance_type_name || "N/A"}</td>
                                                            <td>{item.machine_maintenance_person_id__person_name || "N/A"}</td>
                                                            <td>{item.machine_maintenance_driver_id__person_name || "N/A"}</td>
                                                            <td>{item.machine_maintenance_details || "N/A"}</td>
                                                        </tr>
                                                    ))}
                                                    <tr className="font-bold bg-gray-200">
                                                        <td colSpan="8" className="text-right">Total Maintenance Amount: {project.machine_maramat_data_total || "N/A"}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )))}




                {machineReportData?.other_maintenance_data?.length > 0 && (
                    <div className="mt-2">
                        <div className="">
                            <div className="borderr reporttitle font-bold">Other Maintenance Datas</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N</th>
                                            <th>Maintenance Amount</th>
                                            <th>Maintenance Date</th>
                                            <th>Paid By</th>
                                            <th>Amount Paid</th>
                                            <th>Maintenance Type</th>
                                            <th>Person Name</th>
                                            <th>Driver Name</th>
                                            <th>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {machineReportData?.other_maintenance_data.map((detail, index) => (
                                            <tr key={index}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.machine_maintenance_amount || "N/A"}</td>
                                                <td>{detail.machine_maintenance_date || "N/A"}</td>
                                                <td>{detail.machine_maintenance_amount_paid_by || "N/A"}</td>
                                                <td>{detail.machine_maintenance_amount_paid ? "Yes" : "No"}</td>
                                                <td>{detail.machine_maintenance_types_id__maintenance_type_name || "N/A"}</td>
                                                <td>{detail.machine_maintenance_person_id__person_name || "N/A"}</td>
                                                <td>{detail.machine_maintenance_driver_id__person_name || "N/A"}</td>
                                                <td>{detail.machine_maintenance_details || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="7">
                                                <span className="font-bold text-base text-green-800">Total Maintenance Data:  <i className="fa-solid fa-indian-rupee-sign"></i>{machineReportData.other_maintenance_data_total}
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
    )
}
