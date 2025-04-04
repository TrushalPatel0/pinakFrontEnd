import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import Select from 'react-select';
import Person_types_insert from './insert_update/person_types_insert';
import Bank_insert from './insert_update/bank_insert';
import Pay_types_insert from './insert_update/pay_types_insert';
import { backendurl } from './backend_url';
import Office_kharch_types from './insert_update/office_kharch_types';

import { Link } from 'react-router-dom';

const MoneyCreditDebit = () => {
      const urll = backendurl();
    const [MoneyCreditDebit, setMoneyCreditDebit] = useState([]);
    const [MoneyCredit, setMoneyCredit] = useState([]);
    const [TotalCredit, setTotalCredit] = useState([]);
    const [TotalDebit, setTotalDebit] = useState([]);
    const [MoneyDebit, setMoneyDebit] = useState([]);
    const [PersonData, setPersonData] = useState([]);
    const [PayTypeData, setPayTypeData] = useState([]);
    const [OfficeKharchtypesData, setOfficeKharchtypesData] = useState([]);
    const [MachineData, setMachineData] = useState([]);
    const [ProjectData, setProjectData] = useState([]);
    const [BankData, setBankData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const modalRef = useRef();
    const deletemodel = useRef();
    const [delid, setdelid] = useState("");
    const [Messages, setMessages] = useState('');
    const [SenderPersonId, setSenderPersonId] = useState({ person_id: '' });
    const [ReceiverPersonId, setReceiverPersonId] = useState({ person_id: '' });
    const [PayTypeId, setPayTypeId] = useState({ pay_type_id: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    // Form state for Add/Edit
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const total = MoneyCredit.reduce(
          (sum, x) => sum + parseFloat(x.money_amount || 0),
          0
        );
        setTotalCredit(total);
      }, [MoneyCredit]);

      useEffect(() => {
        const total = MoneyDebit.reduce(
          (sum, x) => sum + parseFloat(x.money_amount || 0),
          0
        );
        setTotalDebit(total);
      }, [MoneyDebit]);


    // Filter data based on search term
    const Filter_MoneyCreditDebit = MoneyCreditDebit.filter((item) => {

    const itemDate = new Date(item?.money_date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const matchesSearchTerm =
            (item?.sender_person_id__person_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item?.receiver_person_id__person_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item?.money_amount?.toString().includes(searchTerm)) ||
            (item?.pay_type_id__pay_type_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item?.money_payment_mode?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item?.money_date?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item?.sender_bank_id__bank_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item?.money_sender_cheque_no?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item?.receiver_bank_id__bank_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item?.money_payment_details?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item?.machine_id__machine_name?.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesDateRange =
            (!start || itemDate >= start) && (!end || itemDate <= end); // Check date range
    
        return matchesSearchTerm && matchesDateRange;
    });



    const [formData, setFormData] = useState({
        money_id: '',
        sender_person_id: '',
        receiver_person_id: '',
        pay_type_id: '',
        money_payment_mode: '',
        money_amount: '',
        money_date: '',
        sender_bank_id: '',
        money_sender_cheque_no: '',
        receiver_bank_id: '',
        money_payment_details: '',
        machine_id: '',
        project_id: '',
        office_kharch_type_id:'',
    });

    const personoptions = PersonData.map((x) => ({
        value: x.person_id,
        label: `${x.person_name} (${x.person_contact_number})`,
      }));
    
    const handleSenderPersonChange = (selectedOption) => {
    setFormData({
        ...formData,
        sender_person_id: selectedOption ? selectedOption.value : "",
    });
    };

    const projectoptions = ProjectData.map((x) => ({
        value: x.project_id,
        label: x.project_name,
      }));
    
    const handleProjectChange = (selectedOption) => {
    setFormData({
        ...formData,
        project_id: selectedOption ? selectedOption.value : "",
    });
    };

    const machineoptions = MachineData.map((x) => ({
        value: x.machine_id,
        label: `${x.machine_name} (${x.machine_number_plate})`,
      }));
    
    const handleMachineChange = (selectedOption) => {
    setFormData({
        ...formData,
        machine_id: selectedOption ? selectedOption.value : "",
    });
    };


    const handleReceiverPersonChange = (selectedOption) => {
    setFormData({
        ...formData,
        receiver_person_id: selectedOption ? selectedOption.value : "",
    });
    };

    const sender_options = [
        { value: "", label: "પૈસા આપનાર" },
        ...PersonData.map((type) => ({
            value: type.person_id,
            label: type.person_name,
        })),
    ];

    const receiver_options = [
        { value: "", label: "પૈસા લેનાર" },
        ...PersonData.map((type) => ({
            value: type.person_id,
            label: type.person_name,
        })),
    ];

    const pay_options = [
        { value: "", label: "ખર્ચ પ્રકાર" },
        ...PayTypeData.map((type) => ({
            value: type.pay_type_id,
            label: type.pay_type_name,
        })),
    ];

    const handleSenderChange = async (selectedOption) => {
        const newSenderId = selectedOption ? selectedOption.value : "";
        setSenderPersonId({ person_id: newSenderId }); // Update the state

        try {
            const response = await axios.get(`${urll}show_money_debit_credit/?sender_id=${newSenderId}&receiver_id=${ReceiverPersonId.person_id}`);
            setMoneyCreditDebit(response.data.data || []);
        } catch (error) {
            console.error("Error fetching money debit/credit data:", error);
        }
    };

    const handleReceiverChange = async (selectedOption) => {
        const newReceiverId = selectedOption ? selectedOption.value : "";
        setReceiverPersonId({ person_id: newReceiverId }); // Update the state

        try {
            const response = await axios.get(`${urll}show_money_debit_credit/?receiver_id=${newReceiverId}&sender_id=${SenderPersonId.person_id}`);
            setMoneyCreditDebit(response.data.data || []);
        } catch (error) {
            console.error("Error fetching money debit/credit data:", error);
        }
    };

    const handlePaymentChange = async (selectedOption) => {
        const newPaymentId = selectedOption ? selectedOption.value : "";
        setPayTypeId({ pay_type_id: newPaymentId }); // Update the state

        try {
            const response = await axios.get(`${urll}show_money_debit_credit/?pay_type_id=${newPaymentId}`);
            setMoneyCreditDebit(response.data.data || []);
        } catch (error) {
            console.error("Error fetching money debit/credit data:", error);
        }
    };


    // Fetch machine details
    const fetchMoneyCreditDebit = async () => {
        try {
            const response = await axios.get(`${urll}show_money_debit_credit/`);
            setMoneyCreditDebit(response.data.data || []);
            setMoneyCredit(response.data.money_credit_data || []);
            setMoneyDebit(response.data.money_debit_data || []);
            setPersonData(response.data.persons_data || []);
            setPayTypeData(response.data.pay_types_data || []);
            setOfficeKharchtypesData(response.data.OfficeKharchtypesData || []);
            setMachineData(response.data.machines_data || []);
            setProjectData(response.data.projects_data || []);
            setBankData(response.data.banks_data || []);
            setTitle(response.data.title);
            setLoading(false);
        } catch (err) {
            setError('Failed to load machine details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMoneyCreditDebit();
    }, []);

    useEffect(() => {
        if (Messages) {
            const timer = setTimeout(() => {
                setMessages('');  // Clear success message after 3 seconds
            }, 3000);  // 3000 milliseconds = 3 seconds

            // Cleanup the timer if the component is unmounted or successMessage changes
            return () => clearTimeout(timer);
        }
    }, [Messages]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle form submission for Add/Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${urll}insert_update_money_debit_credit/`,
                formData
            );
            if (response.status === 200) {
                alert('Money Credit Debit details saved successfully!');
                fetchMoneyCreditDebit(); // Reload data
                resetForm();
                closeModal();
            } else {
                alert('Failed to save money credit debit details.');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error occurred while saving machine details.');
        }
    };


    // Close the modal
    const closeModal = () => {
        const modalInstance = Modal.getInstance(modalRef.current);
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    // Open the modal
    const openModal = () => {
        const modalInstance = new Modal(modalRef.current);
        modalInstance.show();
    };

    const closedeleteModal = () => {
        const modalInstance = Modal.getInstance(deletemodel.current);
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    const opendeleteModal = (id) => {
        const modalInstance = new Modal(deletemodel.current);
        setdelid(id);
        modalInstance.show();

    };

    // Fetch data for editing a specific machine
    const editDetailsGetData = async (id) => {
        try {
            const response = await axios.get(
                `${urll}insert_update_money_debit_credit/?getdata_id=${id}`
            );
            setFormData(response.data.data);
            
            openModal()
        } catch (err) {
            setError('Failed to load machine details');
        }
    };


    const deleteData = async (id) => {
        try {
            const response = await axios.delete(
                `${urll}delete_money_debit_credit/?money_id=${id}`
            );
            setMessages(response.data.message)
            fetchMoneyCreditDebit();
            closedeleteModal();
        } catch (err) {
            setError("Failed to delete document type data")
        }
    }

    // Reset the form state
    const resetForm = () => {
        setFormData({
            money_id: '',
            sender_person_id: '',
            receiver_person_id: '',
            pay_type_id: '',
            office_kharch_type_id: '',
            money_payment_mode: '',
            money_amount: '',
            money_date: '',
            sender_bank_id: '',
            money_sender_cheque_no: '',
            receiver_bank_id: '',
            money_payment_details: '',
            machine_id: '',
            project_id: '',
        });
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div>
                {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
                <h5 className="text-1xl font-extrabold text-black-600 decoration-dashed tracking-wide">આવક/જાવક</h5>

                <div className="d-flex align-items-center mb-3 mt-3">
                    <Link to="/pay-types"><img
                        src="/static/icons/payment_type.png"
                        alt="User Icon"
                        style={{ height: "30px", width: "auto" }} // Ensure consistent height
                    /></Link>
                    <button
                        type="button"
                        className="btn btn-sm btn-primary ms-2"
                        onClick={openModal}
                        style={{ height: "30px" }} // Adjust the height as needed
                    >
                        આવક/જાવક ઉમેરો
                    </button>

                    <div className="input-group" style={{ height: "30px", width: "auto" }}>
                        <input type="text" class="form-control ms-2" style={{ height: "30px", width: "100px" }} placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2" value={searchTerm} onChange={handleSearchChange} />
                        <button className="btn btn-sm btn-outline-primary d-flex align-items-center" type="button" id="button-addon2" style={{ height: "30px", width: "auto" }}><i class="fa-solid fa-magnifying-glass"></i></button>
                    </div>



                </div>


                <div className='grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 mb-3'>
                    <Select
                        options={sender_options}
                        value={sender_options.find((option) => option.value === SenderPersonId.person_id) || null}
                        onChange={handleSenderChange}
                        placeholder="પૈસા આપનાર"
                        isSearchable
                        isClearable
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={{ width: "200px" }}
                    />

                    <Select
                        options={receiver_options}
                        value={receiver_options.find((option) => option.value === ReceiverPersonId.person_id) || null}
                        onChange={handleReceiverChange}
                        placeholder="પૈસા લેનાર"
                        isSearchable
                        isClearable
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />

                    <Select
                        options={pay_options}
                        value={pay_options.find((option) => option.value === PayTypeId.pay_type_id) || null}
                        onChange={handlePaymentChange}
                        placeholder="પેમેન્ટ પ્રકાર"
                        isSearchable
                        isClearable
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />

                    <input type='date' name='startdate' onChange={(e) => setStartDate(e.target.value)} className='form-control' />
                    <input type='date' name='enddate' onChange={(e) => setEndDate(e.target.value)} className='form-control' />
                </div>

                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ક્રમ</th>
                                <th>પૈસા આપનાર</th>
                                <th>પૈસા લેનાર</th>
                                <th>રકમ</th>
                                <th>પેમેન્ટ પ્રકાર</th>
                                <th>પેમેન્ટ મોડ</th>
                                <th>તારીખ</th>
                                <th>આપનાર બૅંક નામ</th>
                                <th>આપનાર ચેક</th>
                                <th>પૈસા લેનાર બૅંક ડીટેલસ</th>
                                <th>ટિપ્પણી</th>
                                <th>મશીન</th>
                                <th>પ્રોજેક્ટ</th>
                                <th>અપડેટ</th>
                                <th>ડિલીટ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Filter_MoneyCreditDebit.length > 0 ? (
                                Filter_MoneyCreditDebit.map((y, index) => (
                                    <tr key={y.money_id}>
                                        <td>{index + 1 || "N/A"}</td>
                                        <td>{y.sender_person_id__person_name || "N/A"} [{y.sender_person_id__person_contact_number}]</td>
                                        <td>{y.receiver_person_id__person_name || "N/A"} [{y.receiver_person_id__person_contact_number}]</td>
                                        <td><i class="fa-solid fa-indian-rupee-sign"></i>{y.money_amount || "N/A"}</td>
                                        <td>{y.pay_type_id__pay_type_name || "N/A"}</td>
                                        <td>{y.money_payment_mode || "N/A"}</td>
                                        <td>{y.money_date || "N/A"}</td>
                                        <td>{y.sender_bank_id__bank_name || "N/A"}</td>
                                        <td>{y.money_sender_cheque_no || "N/A"}</td>
                                        <td>{y.receiver_bank_id__bank_name || "N/A"}</td>
                                        <td>{y.money_payment_details || "N/A"}</td>
                                        <td>{y.machine_id__machine_name || "N/A"} [{y.machine_id__machine_number_plate}]</td>
                                        <td>{y.project_id__project_name || "N/A"}</td>
                                        <td>
                                            <i
                                                className="fa-regular fa-pen-to-square"
                                                onClick={() => editDetailsGetData(y.money_id)}
                                            ></i>
                                        </td>
                                        <td>
                                            <i className="fa-regular fa-trash-can" onClick={() => opendeleteModal(y.money_id)}></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="18">No money transaction details available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-3">
                <div className="card">
                    <h5 className='mb-2 text-center'>આવક</h5>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>S.N</th>
                                    <th>Sender</th>
                                    <th>Receiver</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Mode</th>
                                    <th>Date</th>
                                    <th>Sender Bank</th>
                                    <th>Receiver Bank</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MoneyDebit.length > 0 ? (
                                    MoneyDebit.map((x, index) => (
                                        <tr key={x.money_id}>
                                            <td>{index + 1}</td>
                                            <td>{x.sender_person_id__person_name || "N/A"} [{x.sender_person_id__person_contact_number}]</td>
                                            <td>{x.receiver_person_id__person_name || "N/A"} [{x.receiver_person_id__person_contact_number}]</td>
                                            <td>{x.pay_type_id__pay_type_name || "N/A"}</td>
                                            <td><i class="fa-solid fa-indian-rupee-sign"></i>{x.money_amount || "N/A"}</td>
                                            <td>{x.money_payment_mode || "N/A"}</td>
                                            <td>{x.money_date || "N/A"}</td>
                                            <td>{x.sender_bank_id__bank_name || "N/A"}</td>
                                            <td>{x.receiver_bank_id__bank_name || "N/A"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No debit details available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className='font-semibold text-base'>Total Credit: <i class="fa-solid fa-indian-rupee-sign"></i>{TotalDebit}</div>

                    </div>
                </div>


                <div className="card">
                    <h5 className='mb-2 text-center'>જાવક</h5>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>S.N</th>
                                    <th>Sender</th>
                                    <th>Receiver</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Mode</th>
                                    <th>Date</th>
                                    <th>Sender Bank</th>
                                    <th>Receiver Bank</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MoneyCredit.length > 0 ? (
                                    MoneyCredit.map((credit, index) => (
                                        <tr key={credit.money_id}>
                                            <td>{index + 1}</td>
                                            <td>{credit.sender_person_id__person_name || "N/A"} [{credit.sender_person_id__person_contact_number}]</td>
                                            <td>{credit.receiver_person_id__person_name || "N/A"} [{credit.receiver_person_id__person_contact_number}]</td>
                                            <td>{credit.pay_type_id__pay_type_name || "N/A"}</td>
                                            <td><i class="fa-solid fa-indian-rupee-sign"></i> {credit.money_amount || "N/A"}</td>
                                            <td>{credit.money_payment_mode || "N/A"}</td>
                                            <td>{credit.money_date || "N/A"}</td>
                                            <td>{credit.sender_bank_id__bank_name || "N/A"}</td>
                                            <td>{credit.receiver_bank_id__bank_name || "N/A"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No credit details available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className='font-semibold text-base'>Total Debit: <i class="fa-solid fa-indian-rupee-sign"></i>{TotalCredit}</div>

                    </div>
                </div>


            </div>

            {/* Modal for Add/Edit Machine */}
            <div
                className="modal fade"
                id="machineModal"
                tabIndex="-1"
                aria-labelledby="machineModalLabel"
                aria-hidden="true"
                ref={modalRef}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="machineModalLabel">
                                {formData.money_id ? 'Edit Money Debit/Credit' : 'Add Money Debit/Credit'}
                            </h5>
                            
                            <Person_types_insert fetchdata={fetchMoneyCreditDebit} />
                            <Pay_types_insert fetchdata={fetchMoneyCreditDebit} />
                            <Office_kharch_types fetchdata={fetchMoneyCreditDebit} />
                            <Bank_insert fetchdata={fetchMoneyCreditDebit} />

                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>

                <Select
                  options={personoptions}
                  value={personoptions.find((option) => option.value === formData.sender_person_id) || null}
                  onChange={handleSenderPersonChange}
                  placeholder="Select Sender-Person*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />

                <Select
                  options={personoptions}
                  value={personoptions.find((option) => option.value === formData.receiver_person_id) || null}
                  onChange={handleReceiverPersonChange}
                  placeholder="Select Receiver-Person*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />

                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="money_amount"
                                        value={formData.money_amount}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Amount*"
                                        required
                                    />
                                </div>


                                <div className="mb-3">
                                    <select
                                        name="money_payment_mode"
                                        value={formData.money_payment_mode}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >   <option value="">Select Payment Mode</option>
                                        <option value="CASH">CASH</option>
                                        <option value="BANK">BANK</option>
                                    </select>
                                </div>


                                <div className="mb-3">
                                    <select name="pay_type_id" value={formData.pay_type_id} onChange={handleChange} className="form-select" required>
                                        <option value="">Select Pay Type</option>
                                        {PayTypeData.length > 0 ? (
                                            PayTypeData.map((x) => (
                                                <option key={x.pay_type_id} value={x.pay_type_id}>
                                                    {x.pay_type_name}
                                                </option>
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                    </select>
                                </div>

                                {formData.pay_type_id == 5 && (

                                        <div className="mb-3">
                                        <select name="office_kharch_type_id" value={formData.office_kharch_type_id} onChange={handleChange} className="form-select" required>
                                            <option value="">Select Office kharch Type</option>
                                            {OfficeKharchtypesData.length > 0 ? (
                                                OfficeKharchtypesData.map((x) => (
                                                    <option key={x.office_kharch_type_id} value={x.office_kharch_type_id}>
                                                        {x.office_kharch_type_name}
                                                    </option>
                                                ))
                                            ) : (
                                                <></>
                                            )}
                                        </select>
                                        </div>

                                )}        
                                


                                <div className="mb-3">
                                    <input
                                        type="date"
                                        name="money_date"
                                        value={formData.money_date}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                {formData.money_payment_mode === "BANK" && (
                                    <>
                                        <div className="mb-3">
                                            <select name="sender_bank_id" value={formData.sender_bank_id} onChange={handleChange} className="form-select">
                                                <option value="">Select Sender-Bank</option>
                                                {BankData.length > 0 ? (
                                                    BankData.map((x) => (
                                                        <option key={x.bank_id} value={x.bank_id}>
                                                            {x.bank_name}-{x.bank_account_number}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <></>
                                                )}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <input
                                                type="text"
                                                name="money_sender_cheque_no"
                                                value={formData.money_sender_cheque_no}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Sender Cheque No."
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <select name="receiver_bank_id" value={formData.receiver_bank_id} onChange={handleChange} className="form-select">
                                                <option value="">Select Receiver-Bank</option>
                                                {BankData.length > 0 ? (
                                                    BankData.map((x) => (
                                                        <option key={x.bank_id} value={x.bank_id}>
                                                            {x.bank_name}-{x.bank_account_number}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <></>
                                                )}
                                            </select>
                                        </div>
                                    </>
                                )}

                                <div className="mb-3">
                                    <textarea
                                        name="money_payment_details"
                                        value={formData.money_payment_details}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Payment Details"
                                    />
                                </div>

                                <Select
                                options={machineoptions}
                                value={machineoptions.find((option) => option.value === formData.machine_id) || null}
                                onChange={handleMachineChange}
                                placeholder="Select Machine"
                                isSearchable
                                isClearable
                                className="react-select-container mb-3"
                                classNamePrefix="react-select"
                                />

                                <Select
                                options={projectoptions}
                                value={projectoptions.find((option) => option.value === formData.project_id) || null}
                                onChange={handleProjectChange}
                                placeholder="Select Project"
                                isSearchable
                                isClearable
                                className="react-select-container mb-3"
                                classNamePrefix="react-select"
                                />

                                <button type="submit" className="btn btn-sm btn-primary">Submit</button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
            {/* delete Model confirmation */}
            <div
                className="modal fade"
                id="Modal"
                tabIndex="-1"
                aria-labelledby="ModalLabel"
                aria-hidden="true"
                ref={deletemodel}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="ModalLabel">
                                Delete Money Credit/Debit Data
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            are you sure You want to delete this data?<br />

                            <div className="mt-2">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={() => deleteData(delid)}
                                >Delete</button>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary ms-2"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                >Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MoneyCreditDebit;