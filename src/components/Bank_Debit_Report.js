import { React, useState, useEffect } from 'react'
import { backendurl } from './backend_url'
import axios from 'axios'

export default function Bank_Debit_Report() {
    const url = backendurl()
    const [bankDebitData, setbankDebitData] = useState([])

    useEffect(() => {
        const fetchbankDebitData = async () => {
            const response = await axios.get(`${url}bank_debit_report/?bank_id=${1}`)
            setbankDebitData(response.data.data)
        }
        fetchbankDebitData();
    }, [])

    return (
        <div>
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
                        Bank Name: {bankDebitData?.bank_datails?.bank_name}
                    </div>

                    <div className="font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md border border-blue-500">
                        Branch: {bankDebitData?.bank_datails?.bank_branch}
                    </div>

                    <div className="font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md border border-blue-500">
                        Acc Num: {bankDebitData?.bank_datails?.bank_account_number}
                    </div>

                    <div className="font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md border border-blue-500">
                        IFSC code: {bankDebitData?.bank_datails?.bank_ifsc_code}
                    </div>

                    <div className="font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md border border-blue-500">
                        Acc Holder: {bankDebitData?.bank_datails?.bank_account_holder}
                    </div>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-5 gap-3 mb-3'>
                    <div className="font-semibold text-gray-800 rounded-lg shadow-md px-4 py-2 border border-blue-500">
                        Initial Amt: {bankDebitData?.bank_datails?.bank_initial_amount}
                    </div>

                    <div className="font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md border border-blue-500">
                        Bank Status: {bankDebitData?.bank_datails?.bank_open_closed}
                    </div>

                    <div className="font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md border border-blue-500">
                        Person: {bankDebitData?.bank_datails?.bank_person_name}
                    </div>

                    <div className="font-semibold text-gray-800 px-4 py-2 rounded-lg shadow-md border border-blue-500">
                        Balance: <i className="fa-solid fa-indian-rupee-sign"></i>{bankDebitData?.bank_datails?.current_balance}
                    </div>

                </div>


                {bankDebitData?.project_expense_data?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">Project Expense Name</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N </th>
                                            <th>Expense Name </th>
                                            <th>Project Name</th>
                                            <th>Date</th>
                                            <th>Amount</th>
                                            <th>Desc</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bankDebitData.project_expense_data.map((detail, index) => (
                                            <tr key={index}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.project_expense_name || "N/A"}</td>
                                                <td>{detail.project_id__project_name || "N/A"}</td>
                                                <td>{detail.project_expense_date || "N/A"}</td>
                                                <td>{detail.project_expense_amount || "N/A"}</td>
                                                <td>{detail.project_expense_desc || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="7">
                                                <span className="font-bold text-base text-green-800">
                                                    Total Amount: <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {bankDebitData.project_expense_data_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}

                {bankDebitData?.bank_cash_trasfer_data?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">Bank Cash Transfer</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N </th>
                                            <th>Credit/Debit </th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Deatils</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bankDebitData.bank_cash_trasfer_data.map((detail, index) => (
                                            <tr key={index}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.credit_debit || "N/A"}</td>
                                                <td>{detail.amount || "N/A"}</td>
                                                <td>{detail.date || "N/A"}</td>
                                                <td>{detail.details || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="7">
                                                <span className="font-bold text-base text-green-800">
                                                    Total Amount: <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {bankDebitData.bank_cash_trasfer_data_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}


                {bankDebitData?.money_credit_into_bank?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">Money Credit Into Bank</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N </th>
                                            <th>Sender Person Name </th>
                                            <th>Receiver Person Name</th>
                                            <th>Pay Type Name</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Payment Details</th>
                                            <th>Machine Name</th>
                                            <th>Machine Plate Number</th>
                                            <th>Project Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bankDebitData.money_credit_into_bank.map((detail, index) => (
                                            <tr key={index}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.sender_person_id__person_name || "N/A"}</td>
                                                <td>{detail.receiver_person_id__person_name || "N/A"}</td>
                                                <td>{detail.pay_type_id__pay_type_name || "N/A"}</td>
                                                <td>{detail.money_amount || "N/A"}</td>
                                                <td>{detail.money_date || "N/A"}</td>
                                                <td>{detail.money_payment_details || "N/A"}</td>
                                                <td>{detail.machine_id__machine_name || "N/A"}</td>
                                                <td>{detail.machine_id__machine_number_plate || "N/A"}</td>
                                                <td>{detail.project_id__project_name || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="10">
                                                <span className="font-bold text-base text-green-800">
                                                    Total Amount: <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {bankDebitData.money_credit_into_bank_total}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>)}
                
                {bankDebitData?.project_person_data_trasactions?.length > 0 && (
                    <div className="">
                        <div className="">
                            <div className="borderr reporttitle font-bold">Project Person Transaction</div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N </th>
                                            <th>Person Name </th>
                                            <th>Contact</th>
                                            <th>Date</th>
                                            <th>Work Type</th>
                                            <th>Machine Name</th>
                                            <th>Machine Number Plate</th>
                                            <th>Work Num</th>
                                            <th>Person Price</th>
                                            <th>Person Total Price</th>
                                            <th>Paid by</th>
                                            <th>Payment Detail</th>
                                            <th>Project Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bankDebitData.project_person_data_trasactions.map((detail, index) => (
                                            <tr key={index}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.person_id__person_name || "N/A"}</td>
                                                <td>{detail.person_id__person_contact_number || "N/A"}</td>
                                                <td>{detail.project_person_date || "N/A"}</td>
                                                <td>{detail.work_type_id__work_type_name || "N/A"}</td>
                                                <td>{detail.project_machine_data_id__machine_name || "N/A"}</td>
                                                <td>{detail.project_machine_data_id__machine_number_plate || "N/A"}</td>
                                                <td>{detail.project_person_work_num || "N/A"}</td>
                                                <td>{detail.project_person_price || "N/A"}</td>
                                                <td>{detail.project_person_total_price || "N/A"}</td>
                                                <td>{detail.project_person_paid_by || "N/A"}</td>
                                                <td>{detail.project_person_payment_details || "N/A"}</td>
                                                <td>{detail.project_id__project_name || "N/A"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="13">
                                                <span className="font-bold text-base text-green-800">
                                                    Total Amount: <i className="fa-solid fa-indian-rupee-sign"></i>
                                                    {bankDebitData.project_person_data_trasactions_total}
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
