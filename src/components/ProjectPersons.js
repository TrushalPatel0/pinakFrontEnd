import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';
import Select from 'react-select';
import Person_insert from './insert_update/person_insert';
import Work_types_insert from './insert_update/work_types_insert';
import { backendurl } from './backend_url';


const ProjectPersons = ({project_id}) => {
      const urll = backendurl();
    
    const [ProjectPersonData, setProjectPersonData] = useState([]);
    const [PersonData, setPersonData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [WorkTypeData, setWorkTypeData] = useState([]);
    const [ProjectMachineData, setProjectMachineData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState("");
    const modalRef = useRef();
    const deletemodel = useRef();
    const [delid, setdelid] = useState("");
    const [Messages, setMessages] = useState('');
    const [bankData, setBanksData] = useState([]);

    const [formData, setFormData] = useState({
        project_person_id: "",
        person_id: "",
        project_person_date: "",
        work_type_id: "",
        project_machine_data_id: "",
        project_person_work_num: "",
        project_person_price: "",
        project_person_total_price: "",
        project_person_paid_by: "",
        project_person_payment_details: "",
        project_person_more_details: "",
        person_payment_mode:"",
        bank_id:"",
        project_id: project_id
    });

    const personoptions = PersonData.map((x) => ({
        value: x.person_id,
        label: `${x.person_name} (${x.person_contact_number})`,
    }));
    
    
    const handlePersonChange = (selectedOption) => {
        setFormData({
        ...formData,
        person_id: selectedOption ? selectedOption.value : "",
    });
    };


    const fetchProjectPersons = async () => {
        try {
            const response = await axios.get(`${urll}show_project_person/?project_id=${project_id}`);
            setProjectPersonData(response.data.data || []);
            setPersonData(response.data.persons_data || []);
            setTotalAmount(response.data.total_amount || 0);
            setWorkTypeData(response.data.work_types_data || []);
            setProjectMachineData(response.data.project_machine_data || []);
            setBanksData(response.data.bankData || []);
            setTitle(response.data.title)
            setLoading(false);
        } catch (err) {
            setError('Failed to load project person details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectPersons();
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${urll}insert_update_project_person/?proj_id=${project_id}`,
                formData
            );
            if (response.status === 200) {
                alert(response.data.message);
                fetchProjectPersons();
                resetForm();
                closeModal();
            } else {
                alert('Failed to save project person data.');
            }
        } catch (err) {
            alert('Error occurred while saving project person data.');
        }
    };

    const editProjectPerson = async (id) => {
        try {
            const response = await axios.get(
                `${urll}insert_update_project_person/?getdata_id=${id}`
            );
            setFormData(response.data.data);
            const ProjectPersonData = response.data.data;
            setFormData({
                ...ProjectPersonData,
                project_id: project_id // Ensure project_id is set here
            });
            openModal();
        } catch (err) {
            alert('Failed to load project person data');
        }
    };

    const resetForm = () => {
        setFormData({
            project_person_id: "",
            person_id: "",
            project_person_date: "",
            work_type_id: "",
            project_machine_data_id: "",
            project_person_work_num: "",
            project_person_price: "",
            project_person_total_price: "",
            project_person_paid_by: "",
            project_person_payment_details: "",
            project_person_more_details: "",
            person_payment_mode:"",
            bank_id:"",
            
        });
    };

    const openModal = () => {
        const modalInstance = new Modal(modalRef.current);
        modalInstance.show();
    };

    const closeModal = () => {
        const modalInstance = Modal.getInstance(modalRef.current);
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    const closedeleteModal = () => {
        const modalInstance = Modal.getInstance(deletemodel.current);
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    const openDeleteModal = (id) => {
        const modalInstance = new Modal(deletemodel.current);
        setdelid(id);
        modalInstance.show();

    };

    const deleteData = async (id) => {
        try {
            const response = await axios.delete(
                `${urll}delete_project_person/?project_person_id=${id}`
            );
            setMessages(response.data.message)
            fetchProjectPersons();
            closedeleteModal();
        } catch (err) {
            setError("Failed to delete project person data")
        }
    }

    // Show loading message while data is being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    // Show error message if fetching data failed
    if (error) {
        return <div>{error}</div>;
    }

    // Render the materials table
    return (
        <>
            <div>
                {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
                <button
                    type="button"
                    className="btn btn-sm mb-1 mt-3 btn-primary"
                    onClick={openModal}
                >
                    ડ્રાઇવર/વ્યક્તિ ઉમેરો
                </button>
                <div class="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 mt-1">
                <div className="card">
                    <h6 className='mb-2'>પ્રોજેક્ટ વ્યક્તિ ડેટા</h6>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ક્રમ</th>
                                <th>તારીખ</th>
                                <th>વ્યક્તિ</th>
                                <th>મશીન નામ</th>
                                <th>કામ પ્રકાર</th>
                                <th>કામ</th>
                                <th>ભાવ</th>
                                <th>ટોટલ ભાવ</th>
                                <th>ખર્ચ કરનાર</th>
                                <th>પેમેન્ટ મોડ</th>
                                <th>બૅંક</th>
                                <th>વિગત</th>
                                <th>અપડેટ</th>
                                <th>ડિલીટ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ProjectPersonData.length > 0 ? (
                                ProjectPersonData.map((detail, index) => (
                                    <tr key={detail.project_person_id}>
                                        <td>{index + 1 || "N/A"}</td>
                                        <td>{detail.project_person_date || "N/A"}</td>
                                        <td>
                                            {detail.person_id__person_name || "N/A"} {detail.person_id__person_contact_number}</td>
                                        <td>
                                            {detail.project_machine_data_id__machine_name || "N/A"} {detail.project_machine_data_id__machine_number_plate}
                                        </td>
                                        <td>
                                            {detail.work_type_id__work_type_name || "N/A"}
                                        </td>
                                        <td>{detail.project_person_work_num || "N/A"}</td>
                                        <td><i class="fa-solid fa-indian-rupee-sign"></i> {detail.project_person_price || "N/A"}</td>
                                        <td><i class="fa-solid fa-indian-rupee-sign"></i> {detail.project_person_total_price || "N/A"}</td>
                                        <td>{detail.project_person_paid_by || "N/A"}</td>
                                        <td>{detail.person_payment_mode || "N/A"}</td>
                                        <td>{detail.bank_id__bank_name || "N/A"}</td>
                                        <td>{detail.project_person_payment_details || "N/A"}</td>
                                        <td>
                                            <i
                                                className="fa-regular fa-pen-to-square"
                                                onClick={() => editProjectPerson(detail.project_person_id)}
                                            ></i>
                                        </td>
                                        <td>
                                            <i
                                                className="fa-regular fa-trash-can"
                                                onClick={() => openDeleteModal(detail.project_person_id)}
                                            ></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="13" style={{ textAlign: "center" }}>
                                        ડેટા આવેલેબલ નથી. 
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className='font-semibold text-base text-green-800' >ટોટલ રકમ: <i class="fa-solid fa-indian-rupee-sign"></i>{totalAmount}</div>
                    </div>
                </div>
                </div>
            </div>
            <div
                className="modal fade"
                id="materialModal"
                tabIndex="-1"
                ref={modalRef}
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {formData.project_person_id ? 'Edit Project-Person' : 'Add Project-Person'}
                            </h5>
                            <Person_insert fetchdata={fetchProjectPersons} />
                            <Work_types_insert fetchdata={fetchProjectPersons} />
                            <button
                                type="button"
                                className="btn-close"
                                onClick={closeModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                {formData.project_person_id && (
                                <div className="mb-3">
                                    <label htmlFor="workNoInput" className="form-label">તારીખ</label>
                                    <input
                                        type="date"
                                        name="project_person_date"
                                        value={formData.project_person_date}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                )}

                                <Select
                                    options={personoptions}
                                    value={personoptions.find((option) => option.value === formData.person_id) || null}
                                    onChange={handlePersonChange}
                                    placeholder="વ્યક્તિ*"
                                    isSearchable
                                    isClearable
                                    className="react-select-container mb-3"
                                    classNamePrefix="react-select"
                                />

                                <div className="mb-3">
                                    <select
                                        name="work_type_id"
                                        value={formData.work_type_id}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">કામ પ્રકાર*</option>
                                        {WorkTypeData.map((type) => (
                                            <option
                                                key={type.work_type_id}
                                                value={type.work_type_id}
                                            >
                                                {type.work_type_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <select
                                        name="project_machine_data_id"
                                        value={formData.project_machine_data_id}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">મશીન</option>
                                        {ProjectMachineData.map((type) => (
                                            <option
                                                key={type.machine_id}
                                                value={type.machine_id}
                                            >
                                                {type.machine_name} ({type.machine_number_plate})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <input
                                        id="workNoInput"
                                        type="text"
                                        name="project_person_work_num"
                                        value={formData.project_person_work_num}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="કામ*"
                                        required
                                    />
                                </div>

                                {/* Price Field */}
                                <div className="mb-3">
                                    <input
                                        id="priceInput"
                                        type="text"
                                        name="project_person_price"
                                        value={formData.project_person_price}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="ભાવ*"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                <select
                                    name="project_person_paid_by"
                                    value={formData.project_person_paid_by}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">ખર્ચ કરનાર*</option>
                                    <option value="Project_Owner">પ્રોજેક્ટ માલિક</option>
                                    <option value="Pinak">પિનાક એન્ટરપ્રાઇજ</option>
                                    <option value="machine_owner">મશીન માલિક</option>
                                </select>
                            </div>

                            <div className='mb-3'>
                                    <select name="person_payment_mode" value={formData.person_payment_mode} onChange={handleChange} className='form-select'>
                                        <option value="">ખર્ચ મેથડ</option>
                                        <option value="Cash">કેશ</option>
                                        <option value="Bank">બૅંક</option>
                                    </select>
                                </div>

                                {formData.person_payment_mode === 'Bank' && (
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


                                {/* Details Textarea */}
                                <div className="mb-3">
                                    <label htmlFor="detailsTextarea" className="form-label"></label>
                                    <textarea
                                        id="detailsTextarea"
                                        name="project_person_payment_details"
                                        value={formData.project_person_payment_details}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="વિગત"
                                    ></textarea>
                                </div>


                                {/* Details Textarea */}
                                {/* <div className="mb-3">
                                    <label htmlFor="detailsTextarea" className="form-label">More Details</label>
                                    <textarea
                                        id="detailsTextarea"
                                        name="project_person_more_details"
                                        value={formData.project_person_more_details}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter more details (optional)"
                                    ></textarea>
                                </div> */}

                                {/* Submit Button */}
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">
                                        Submit
                                    </button>
                                </div>

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
                                Delete Material Data
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

export default ProjectPersons;
