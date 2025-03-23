import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';
import Machine_insert from './insert_update/machine_insert';
import Work_types_insert from './insert_update/work_types_insert';
import Select from 'react-select';
import { backendurl } from './backend_url';


const ProjectDayDetails = ({project_id}) => {
      const urll = backendurl();
    const [ProjectDayDetailsData, setProjectDayDetailsData] = useState([]);
    const [MachineData, setMachineData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [WorkTypeData, setWorkTypeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState("");
    const modalRef = useRef();
    const deletemodel = useRef();
    const [delid, setdelid] = useState("");
    const [Messages, setMessages] = useState('');
    const [short_day_detail_data, setshort_day_detail_data] = useState('');

    const [formData, setFormData] = useState({
        project_day_detail_id: "",
        proejct_day_detail_date: "",
        project_day_detail_machine_id: "",
        project_day_detail_work_type: "",
        project_day_detail_work_no: "",
        project_day_detail_price: "",
        project_day_detail_total_price: 0,
        project_day_detail_total_tyres : "",
        project_day_detail_details: "",
        project_id: project_id
    });

    const resetForm = () => {
        setFormData({
            project_day_detail_id: "",
            proejct_day_detail_date: "",
            project_day_detail_machine_id: "",
            project_day_detail_work_type: "",
            project_day_detail_work_no: "",
            project_day_detail_total_tyres: "",
            project_day_detail_price: "",
            project_day_detail_total_price: "",
            project_day_detail_details: "",
        });
    };

    const machineoptions = MachineData.map((machine) => ({
        value: machine.machine_id,
        label: `${machine.machine_name} (${machine.machine_number_plate})`,
      }));
    
    const handleMachineChange = (selectedOption) => {
        setFormData({
          ...formData,
          project_day_detail_machine_id: selectedOption ? selectedOption.value : "", // Set value
        });
    };


    const fetchProjectDayDetails = async () => {
        try {
            const response = await axios.get(`${urll}show_project_day_details/?project_id=${project_id}`);
            setProjectDayDetailsData(response.data.data || []);
            setMachineData(response.data.machines_data || []);
            setTotalAmount(response.data.total_amount || 0);
            setWorkTypeData(response.data.work_types_data || []);
            setshort_day_detail_data(response.data.short_day_detail_data || []);
            setTitle(response.data.title)
            setLoading(false);
        } catch (err) {
            setError('Failed to load project day details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectDayDetails();
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
                `${urll}insert_update_project_day_detail/?proj_id=${project_id}`,
                formData
            );
            if (response.status === 200) {
                alert(response.data.message);
                fetchProjectDayDetails();
                resetForm();
                closeModal();
            } else {
                alert('Failed to save project day details.');
            }
        } catch (err) {
            alert('Error occurred while saving project day details.');
        }
    };

    const editProjectDayDetail = async (id) => {
        try {
            const response = await axios.get(
                `${urll}insert_update_project_day_detail/?getdata_id=${id}`
            );
            const ProjectDayDetailsData = response.data.data;
            setFormData({
                ...ProjectDayDetailsData,
                project_id: project_id // Ensure project_id is set here
            });
            openModal();
        } catch (err) {
            alert('Failed to load project day details');
        }
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
        resetForm();

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

    const deleteData = async (id) => {
        try {
            const response = await axios.delete(
                `${urll}delete_project_day_detail/?project_day_detail_id=${id}`
            );
            setMessages(response.data.message)
            fetchProjectDayDetails();
            closedeleteModal();
        } catch (err) {
            setError("Failed to delete project material data")
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
                    દિવસ ડીટેલ ડેટા ઉમેરો
                </button>

                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 mt-1">
                <div className="col-span-3 card">
                    <h6 className='mb-2'>દિવસ ડીટેલ ડેટા</h6>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ક્રમ</th>
                                <th>તારીખ</th>
                                <th>મશીન નામ</th>
                                <th>કામ પ્રકાર</th>
                                <th>કામ</th>
                                <th>ટાયર</th>
                                <th>ભાવ</th>
                                <th>કુલ ભાવ</th>
                                <th>વિગત</th>
                                <th>અપડેટ</th>
                                <th>ડિલીટ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ProjectDayDetailsData.length > 0 ? (
                                ProjectDayDetailsData.map((detail, index) => (
                                    <tr key={detail.project_day_detail_id}>
                                        <td>{index + 1 || "N/A"}</td>
                                        <td>{detail.proejct_day_detail_date || "N/A"}</td>
                                        <td>{detail.project_day_detail_machine_id__machine_name || "N/A"} {detail.project_day_detail_machine_id__machine_number_plate}</td>
                                        <td>{detail.project_day_detail_work_type__work_type_name || "N/A"}</td>
                                        <td>{detail.project_day_detail_work_no || "N/A"}</td>
                                        <td>{detail.project_day_detail_total_tyres==='10-Tyres' && (<>10 ટાયર</>)} {detail.project_day_detail_total_tyres==='12-Tyres' && (<>12 ટાયર</>)} {detail.project_day_detail_total_tyres==='અન્ય' && (<>અન્ય</>)}</td>
                                        <td><i class="fa-solid fa-indian-rupee-sign"></i> {detail.project_day_detail_price || "N/A"}</td>
                                        <td><i class="fa-solid fa-indian-rupee-sign"></i> {detail.project_day_detail_total_price || "N/A"}</td>
                                        <td>{detail.project_day_detail_details || "N/A"}</td>
                                        <td>
                                            <i
                                                className="fa-regular fa-pen-to-square"
                                                onClick={() => editProjectDayDetail(detail.project_day_detail_id)}
                                            ></i>
                                        </td>
                                        <td>
                                            <i
                                                className="fa-regular fa-trash-can"
                                                onClick={() => opendeleteModal(detail.project_day_detail_id)}
                                            ></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" style={{ textAlign: "center" }}>
                                     ડેટા અવાઈલેબેલ નથી.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className='font-semibold text-base text-green-800'>ટોટલ રકમ: <i class="fa-solid fa-indian-rupee-sign"></i>{totalAmount}</div>
                    </div>
                </div>

                <div className="col-span-1 card" style={{maxHeight:'450px', overflow:'auto',fontSize:'14px'}}>
            
                        <div className="">
                        {short_day_detail_data.length > 0 ? (
    short_day_detail_data.map((detail) => (
        <>
            <div className="alert alert-primary p-1 mb-0 text-center font-semibold">{detail.work_type_name || "N/A"}</div>
            <div className="grid grid-cols-3 gap-2">
                    <div className="card p-1">10 ટાયર</div>
                    <div className="card p-1">12 ટાયર</div>
                    <div className="card p-1">અન્ય</div>
                    </div>
            {detail.data.map((x, index) => (
                <>
                <div className="grid grid-cols-3 gap-2">
                    <>
                    
                    <div className="card p-1">{x.tyre === '10-Tyres' && (<>{x.work_no || "N/A"}</>) || 0}</div>
                    <div className="card p-1">{x.tyre === '12-Tyres' && (<>{x.work_no || "N/A"}</>) || 0}</div>
                    <div className="card p-1">{x.tyre === 'અન્ય' && (<>{x.work_no || "N/A"}</>) || 0}</div>
                    
                    </>
               
                </div>
                </>
            ))}

<div key={detail.work_type_id} className="grid grid-cols-3 gap-2">
            <span className="card p-1 alert alert-success">10 T - {detail.tyre_10_total || "0"}</span>
            <span className="card p-1 alert alert-success">12 T - {detail.tyre_12_total || "0"}</span>
            <span className="card p-1 alert alert-success">અન્ય - {detail.total_on_any_tyre || "0"}</span>
            
        </div> 
        <div key={detail.work_type_id} className="grid grid-cols-3 gap-2">
            <span className="card p-1 alert alert-success">કુલ - {detail.tyre_10_total_amount || "0"}</span>
            <span className="card p-1 alert alert-success">કુલ - {detail.tyre_12_total_amount || "0"}</span>
            <span className="card p-1 alert alert-success">કુલ - {detail.tyre_any_total_amount || "0"}</span>
          
        </div> 
        
        </>
    ))
) : (
    <></>
)}
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
                                {formData.project_day_detail_id ? 'Edit Project-Day-Detail' : 'Add Project-Day-Detail'}
                            </h5>
                            <Machine_insert fetchdata={fetchProjectDayDetails} />
                            <Work_types_insert fetchdata={fetchProjectDayDetails} />
                            <button
                                type="button"
                                className="btn-close"
                                onClick={closeModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                            {formData.project_day_detail_id && (
                            <div className="mb-3">
                                <label htmlFor="workNoInput" className="form-label">તારીખ</label>
                                    <input
                                        type="date"
                                        name="proejct_day_detail_date"
                                        value={formData.proejct_day_detail_date}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                )}

                                <Select
                                options={machineoptions}
                                value={
                                    machineoptions.find((option) => option.value === formData.project_day_detail_machine_id) || null
                                }                                onChange={handleMachineChange}
                                placeholder="સિલેક્ટ મશીન*"
                                isSearchable
                                isClearable
                                className="react-select-container mb-3"
                                classNamePrefix="react-select"
                                />

                                <div className="mb-3">
                                    <select
                                        name="project_day_detail_work_type"
                                        value={formData.project_day_detail_work_type}
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
                                    <input
                                        id="workNoInput"
                                        type="text"
                                        name="project_day_detail_work_no"
                                        value={formData.project_day_detail_work_no}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="કામ*"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <select
                                        name="project_day_detail_total_tyres"
                                        value={formData.project_day_detail_total_tyres}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">ટાયર*</option>
                                        <option value="10-Tyres">10-ટાયર </option>
                                        <option value="12-Tyres">12-ટાયર</option>
                                        <option value="અન્ય">અન્ય</option>
                                    </select>
                                    </div>

                                <div className="mb-3">
                                    <input
                                        id="priceInput"
                                        type="text"
                                        name="project_day_detail_price"
                                        value={formData.project_day_detail_price}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="ભાવ*"
                                        required
                                    />
                                </div>


                                <div className="mb-3">
                                    {/* <label htmlFor="detailsTextarea" className="form-label">વિગત</label> */}
                                    <textarea
                                        id="detailsTextarea"
                                        name="project_day_detail_details"
                                        value={formData.project_day_detail_details}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="વિગત ભરો"
                                    ></textarea>
                                </div>

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

export default ProjectDayDetails;
