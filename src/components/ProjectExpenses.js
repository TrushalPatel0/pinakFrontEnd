import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import { backendurl } from './backend_url';


const ProjectExpenses = ({ project_id }) => {
      const urll = backendurl();
    const [projectExpenses, setprojectExpenses] = useState([]);
    const [projectData, setprojectData] = useState([]);
    const [bankData, setbankData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const modalRef = useRef();
    const deletemodel = useRef();
    const [delid, setdelid] = useState("");
    const [Messages, setMessages] = useState('');



    const [formData, setFormData] = useState({
        project_expense_id: "",
        project_expense_name: "",
        project_id: project_id,
        project_expense_date: "",
        project_expense_amount: "",
        project_payment_mode: "",
        bank_id: "",
        project_expense_desc: "",
    });




    // Fetch machine details
    const fetchProjectExpenses = async () => {
        try {
            const response = await axios.get(`${urll}show_project_expense/?project_id=${project_id}`);
            setprojectExpenses(response.data.data || []);
            setprojectData(response.data.projects_data || []);
            setTotalAmount(response.data.total_amount || 0);
            setbankData(response.data.banks_data || []);
            setTitle(response.data.title);
            setLoading(false);
        } catch (err) {
            setError('Failed to load project expense details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectExpenses();
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
                `${urll}insert_update_project_expense/?proj_id=${project_id}`,
                formData
            );
            if (response.status === 200) {
                setMessages(response.data.message)
                fetchProjectExpenses(); // Reload data
                resetForm();
                closeModal();
            } else {
                alert('Failed to save Project Expense.');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error occurred while saving Project Expense.');
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
                `${urll}insert_update_project_expense/?getdata_id=${id}`
            );
            setFormData(response.data.data);
            openModal()
        } catch (err) {
            setError('Failed to load Project Expense');
        }
    };

    const deleteData = async (id) => {
        try {
            const response = await axios.get(
                `${urll}delete_project_expense/?project_expense_id=${id}`
            );
            setMessages(response.data.message)
            fetchProjectExpenses();
            closedeleteModal();
        } catch (err) {
            setError("Failed to delete project expense")
        }
    }

    // Reset the form state
    const resetForm = () => {
        setFormData({
            project_expense_id: "",
            project_expense_name: "",
            project_id: "",
            project_expense_date: "",
            project_expense_amount: "",
            project_payment_mode: "",
            bank_id: "",
            project_expense_desc: "",
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
                <div className="d-flex align-items-center mb-3">
                    <button
                        type="button"
                        className="btn btn-sm btn-primary ms-2"
                        onClick={openModal}
                        style={{ height: "30px" }} // Adjust the height as needed
                    >સરેરાસ ખર્ચ ઉમેરો</button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 mt-1">
                    <div className="card">
                        <h6 className='mb-2'>સરેરાસ ખર્ચ</h6>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>ક્રમ</th>
                                        <th>ખર્ચ નામ</th>
                                        <th>પ્રોજેક્ટ નામ</th>
                                        <th>તારીખ</th>
                                        <th>કિમત</th>
                                        <th>કેશ/બૅંક</th>
                                        <th>બૅંક નામ</th>
                                        <th>ટિપ્પણી</th>
                                        <th>અપડેટ</th>
                                        <th>ડિલીટ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projectExpenses.length > 0 ? (
                                        projectExpenses.map((y, index) => (
                                            <tr key={y.project_expense_id}>
                                                <td>{index + 1}</td>
                                                <td>{y.project_expense_name || "N/A"}</td>
                                                <td>{y.project_id__project_name || "N/A"}</td>
                                                <td>{y.project_expense_date || "N/A"}</td>
                                                <td><i class="fa-solid fa-indian-rupee-sign"></i> {y.project_expense_amount || "N/A"}</td>
                                                <td>{y.project_payment_mode || "N/A"}</td>
                                                <td>{y.bank_id__bank_name || "N/A"}</td>
                                                <td>{y.project_expense_desc || "N/A"}</td>

                                                <td>
                                                    <i
                                                        className="fa-regular fa-pen-to-square"
                                                        onClick={() => editDetailsGetData(y.project_expense_id)}
                                                    ></i>
                                                </td>
                                                <td>
                                                    <i className="fa-regular fa-trash-can" onClick={() => opendeleteModal(y.project_expense_id)}></i>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10">ડેટા આવેલેબલ નથી.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className='font-semibold text-base text-green-800' >ટોટલ રકમ: <i class="fa-solid fa-indian-rupee-sign"></i>{totalAmount}</div>

                        </div>
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
                                {formData.project_expense_id ? 'Edit Project-Expense' : 'Add Project-Expense'}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>

                                <div className='mb-3'>
                                    <input
                                        type="text"
                                        name="project_expense_name"
                                        value={formData.project_expense_name}
                                        onChange={handleChange}
                                        placeholder='પ્રોજેક્ટ ખર્ચ નામ'
                                        className='form-control'
                                    />
                                </div>

                                
                                
                                {formData.project_expense_id && (
                                <div className='mb-3'>
                                    <label>તારીખ: </label>
                                    <input
                                        type="date"
                                        name="project_expense_date"
                                        value={formData.project_expense_date}
                                        onChange={handleChange}
                                        className='form-control'
                                    />
                                </div>
                                )}

                                <div className='mb-3'>
                                    <input
                                        type="text"
                                        name="project_expense_amount"
                                        value={formData.project_expense_amount}
                                        onChange={handleChange}
                                        placeholder='ખર્ચ રકમ'
                                        className='form-control'
                                    />
                                </div>

                                <div className='mb-3'>
                                    <select name="project_payment_mode" value={formData.project_payment_mode} onChange={handleChange} className='form-select'>
                                        <option value="">ખર્ચ મેથડ</option>
                                        <option value="Cash">કેશ</option>
                                        <option value="Bank">બૅંક</option>
                                    </select>
                                </div>

                                {formData.project_payment_mode === 'Bank' && (
                                <div className='mb-3'>
                                    <select name="bank_id" value={formData.bank_id} onChange={handleChange} className='form-select'>
                                        <option value="">બૅંક</option>
                                        {bankData.length > 0 ? (
                                            bankData.map((bank) => (
                                                <option key={bank.bank_id} value={bank.bank_id}>
                                                    {bank.bank_name}
                                                </option>
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                    </select>
                                </div>
                                )}

                                <div className='mb-3'>
                                    <textarea
                                        className='form-control'
                                        name="project_expense_desc"
                                        value={formData.project_expense_desc}
                                        onChange={handleChange}
                                        placeholder='ખર્ચ વિગત'
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn btn-sm btn-primary">
                                    Submit
                                </button>

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
                                Delete Company-Machine Data
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

export default ProjectExpenses;