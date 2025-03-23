import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { backendurl } from './backend_url';


const Machine_Rent = () => {
      const urll = backendurl();
    const [machinesDetails, setMachinesDetails] = useState([]);
    const [machine_rented_work_type, setmachine_rented_work_type] = useState([]);
    const [Machine_Rent_data, setMachine_Rent_data] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const modalrentedRef = useRef();
    const deletemodel = useRef();
    const [delid, setdelid] = useState("");
    const [Messages, setMessages] = useState('');

    const machineoptions = machinesDetails.map((machine) => ({
            value: machine.machine_id,
            label: machine.machine_name +' ('+ machine.machine_number_plate + ')',
    }));

    const [formData, setFormData] = useState({
        machine_rent_id: '',
        machine_rent_machine_id:'',
        machine_rented_work_type: '',
        machine_rented_work_price: '',
        machine_km: '',
        rent_start_date:'',
        rent_end_date:'',
    });

   

    const handleMachineChange = (selectedOption) => {
        setFormData({
            ...formData,
            machine_rent_machine_id: selectedOption ? selectedOption.value : "",
        });
    };




    // Fetch machine details
    const fetchRentedMachines = async () => {
        try {
            const response = await axios.get(`${urll}show_machine_rent/`);
            setMachine_Rent_data(response.data.data || []);
            setMachinesDetails(response.data.machinedata || []);
            setmachine_rented_work_type(response.data.work_types_data)
            setTitle(response.data.title);
            setLoading(false);
        } catch (err) {
            setError('Failed to load Machines details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentedMachines();
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
                `${urll}insert_update_machine_rent/`,
                formData
            );
            if (response.status === 200) {
                fetchRentedMachines();
                resetForm();
                closeModal();
            } else {
                alert('Failed to save Rented Machine details.');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error occurred while saving Rented Machine details.');
        }
    };


    // Close the modal
    const closeModal = () => {
        const modalInstance = Modal.getInstance(modalrentedRef.current);
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    // Open the modal
    const openModal = () => {
        const modalInstance = new Modal(modalrentedRef.current);
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
                `${urll}insert_update_machine_rent/?getdata_id=${id}`
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
                `${urll}delete_machine_rent/?rentedmachine_id=${id}`
            );
            setMessages(response.data.message)
            closedeleteModal();
        } catch (err) {
            setError("Failed to delete Rented Machine data")
        }
    }

    // Reset the form state
    const resetForm = () => {
        setFormData({
        machine_rent_id: '',
        machine_rent_machine_id:'',
        machine_rented_work_type: '',
        machine_rented_work_price: '',
        machine_km: '',
        rent_start_date:'',
        rent_end_date:'',
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
                <h5 className="text-1xl font-extrabold text-black-600 decoration-dashed tracking-wide">ભાડેથી મશીન ડેટા</h5>
                <div className="d-flex align-items-center mb-3 mt-3">
                    <button
                        type="button"
                        className="btn btn-sm btn-primary ms-2"
                        onClick={openModal}
                        style={{ height: "30px" }} // Adjust the height as needed
                    >ભાડેથી મશીન ઉમેરો</button>
                </div>

                <div className="card">
                <div className="table-responsive">
                    <table className="table table-hover">

                        <thead>
                            <tr>
                                <th>મશીન ક્રમ</th>
                                <th>મશીન</th>
                                <th>મશીન લાવ્યા ની તારીખ</th>
                                <th>કામ પ્રકાર</th>
                                <th>ભાવ</th>
                                <th>મશીન રિટર્ન કર્યા ની તારીખ</th>
                                <th>rent_amount</th>
                                <th>અપડેટ</th>
                                <th>ડિલીટ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Machine_Rent_data.length > 0 ? (
                                Machine_Rent_data.map((y,index) => (
                                    <tr key={y.machine_rent_id}>
                                        <td>{index+1}</td>
                                        <td>{y.machine_rent_machine_id__machine_name || "N/A"} ({y.machine_rent_machine_id__machine_number_plate || "N/A"} - {y.machine_rent_machine_id__machine_types_id__machine_type_name})</td>
                                        <td>{y.rent_start_date}</td>
                                        <td>{y.machine_rented_work_type__work_type_name || "N/A"}</td>
                                        <td>{y.machine_rented_work_price || "N/A"}</td>
                                        <td>{y.rent_end_date}</td>
                                        <td>{y.rent_amount}</td>
                                        <td>
                                            <i
                                                className="fa-regular fa-pen-to-square"
                                                onClick={() => editDetailsGetData(y.machine_rent_id)}
                                            ></i>
                                        </td>
                                        <td>
                                            <i className="fa-regular fa-trash-can" onClick={() => opendeleteModal(y.machine_rent_id)}></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="18">ડેટા અવેલેબલ નથી. </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                </div>
             
            </div>
            
            {/* Modal for Add/Edit Machine */}
            <div
                className="modal fade"
                id="machineRentedModal"
                tabIndex="-1"
                aria-labelledby="machineRentedModal"
                aria-hidden="true"
                ref={modalrentedRef}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="machineRentedModal">
                                {formData.machine_rent_id ? 'એડિટ મશીન' : 'મશીન ઉમેરો'}
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

                                <Select
                                        options={machineoptions}
                                        value={machineoptions.find((option) => option.value === formData.machine_rent_machine_id)}
                                        onChange={handleMachineChange}
                                        placeholder="મશીન સિલેક્ટ કરો*"
                                        isSearchable
                                        isClearable
                                        className="react-select-container mb-3"
                                        classNamePrefix="react-select"
                                    />


                                    <div className='mb-3'>
                                        <div className='form-label'>મશીન લાવ્યા ની તારીખ</div>
                                    <input
                                        type="date"
                                        name="rent_start_date"
                                        value={formData.rent_start_date}
                                        onChange={handleChange}
                                        className='form-control'
                                    />
                                </div>

                                <div className='mb-3'>
                                        <div className='form-label'>મશીન રિટર્ન કર્યા ની તારીખ</div>
                                    <input
                                        type="date"
                                        name="rent_end_date"
                                        value={formData.rent_end_date}
                                        onChange={handleChange}
                                        className='form-control'
                                    />
                                </div>

                                

                                    <>
                                        <div className='grid grid-cols-3 gap-2 mb-3'>
                                            <div className=''>
                                                <select name="machine_rented_work_type" value={formData.machine_rented_work_type} onChange={handleChange} className='form-select'>
                                                    <option value="">કામ પ્રકાર</option>
                                                    {machine_rented_work_type.length > 0 ? (
                                                        machine_rented_work_type.map((x) => (
                                                            <option key={x.work_type_id} value={x.work_type_id}>
                                                                {x.work_type_name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <></>
                                                    )}
                                                </select>
                                            </div>
                                            <div className=''>
                                                <input
                                                    type="number"
                                                    name="machine_rented_work_price"
                                                    value={formData.machine_rented_work_price}
                                                    onChange={handleChange}
                                                    className='form-control'
                                                    placeholder='ભાવ'
                                                />
                                            </div>
                                        </div>
                                    </>
                            



                              


{/* 
                                <div className='mb-3'>
                                    <textarea
                                        className='form-control'
                                        name="machine_details"
                                        value={formData.machine_details}
                                        onChange={handleChange}
                                    ></textarea>
                                </div> */}

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
                                Delete Rented-Machine Data
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

export default Machine_Rent;