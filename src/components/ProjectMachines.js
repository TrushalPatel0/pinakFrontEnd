import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';
import Select from 'react-select';
import Maintenance_types_insert from './insert_update/maintenance_types_insert';
import Person_insert from './insert_update/person_insert';
import Machine_insert from './insert_update/machine_insert';
import Work_types_insert from './insert_update/work_types_insert';
import { backendurl } from './backend_url';




const ProjectMachines = ({project_id}) => {
    const urll = backendurl();
    const [ProjectMachineData, setProjectMachineData] = useState([]);
    const [MachineMaintenanceData, setMachineMaintenanceData] = useState([]);
    const [maintenanceTotalAmount, setmaintenanceTotalAmount] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [WorkTypeData, setWorkTypeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState("");
    const modalRef = useRef();
    const maintenancemodalRef = useRef();
    const deletemodel = useRef();
    const [delid, setdelid] = useState("");
    const [Messages, setMessages] = useState('');


    const [maintenanceTypes, setMaintenanceTypes] = useState([]);
    const [machineData, setmachineData] = useState([]);
    const [personData, setpersonData] = useState([]);
    const [driverpersonData, setdriverpersonData] = useState([]);
    const [repairpersonData, setrepairpersonData] = useState([]);
    const [projectData, setprojectData] = useState([]);

    const [formData, setFormData] = useState({
        project_machine_data_id: "",
        project_machine_date: "",
        machine_project_id: "",
        work_type_id: "",
        project_machine_data_work_number: "",
        project_machine_data_work_price: "",
        project_machine_data_total_amount: "",
        project_machine_data_work_details: "",
        project_machine_data_more_details: "",
        project_machine_data_km:"",
        project_id: project_id

    });

    const machineoptions = machineData.map((machine) => ({
        value: machine.machine_id,
        label: `${machine.machine_name} (${machine.machine_number_plate})`
      }));
    
    const handleMachineChange = (selectedOption) => {
        setmaintenanceformData({
          ...maintenanceformData,
          machine_machine_id: selectedOption ? selectedOption.value : "",
        });
    };

    

    const projectmachineoptions = machineData.map((machine) => ({
        value: machine.machine_id,
        label: `${machine.machine_name} (${machine.machine_number_plate})`
      }));

    const handleProjectMachineChange = (selectedOption) => {
        
        setFormData({
        ...formData,
        machine_project_id: selectedOption ? selectedOption.value : "",
    });
    };
    
    const driverpersonoptions = driverpersonData.map((x) => ({
        value: x.person_id,
        label: x.person_name,
    }));
    
    const repairpersonoptions = repairpersonData.map((x) => ({
        value: x.person_id,
        label: x.person_name,
    }));
    
    
    const handleDriverPersonChange = (selectedOption) => {
        setmaintenanceformData({
        ...maintenanceformData,
        machine_maintenance_driver_id: selectedOption ? selectedOption.value : "",
    });
    };
    
    const handleRepairPersonChange = (selectedOption) => {
        setmaintenanceformData({
        ...maintenanceformData,
        machine_maintenance_person_id: selectedOption ? selectedOption.value : "",
    });
    };

    const [maintenanceformData, setmaintenanceformData] = useState({
        machine_maintenance_id: '',
        machine_machine_id: '',
        machine_maintenance_amount: '',
        machine_maintenance_date: '',
        machine_maintenance_amount_paid: false,
        machine_maintenance_amount_paid_by: '',
        machine_maintenance_types_id: '',
        machine_maintenance_details: '',
        machine_maintenance_driver_id: '',
        machine_maintenance_person_id: '',
        project_id: project_id,
      });


    const resetmaintenanceForm = () => {
        setmaintenanceformData({
        machine_maintenance_id: '',
        machine_machine_id: '',
        machine_maintenance_amount: '',
        machine_maintenance_date: '',
        machine_maintenance_amount_paid: false,
        machine_maintenance_amount_paid_by: '',
        machine_maintenance_types_id: '',
        machine_maintenance_details: '',
        machine_maintenance_driver_id: '',
        machine_maintenance_person_id: '',
        project_id: project_id,
    });
    };

    const openMaintenanceModal = () => {
        const modalInstance = new Modal(maintenancemodalRef.current);
        modalInstance.show();
    };

    const closeMaintenanceModal = () => {
        const modalInstance = Modal.getInstance(maintenancemodalRef.current);
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    const handlemaintenanceChange = (e) => {
        const { name, value, type, checked } = e.target;
        setmaintenanceformData((prevData) => ({
          ...prevData,
          [name]: type === 'checkbox' ? checked : value,

        }));
      };

    const handlemaintenanSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(
            `${urll}insert_update_machine_maintenance/?project_id=${project_id}`,
            maintenanceformData
          );
          if (response.status === 200) {
            fetchProjectMachines();
            resetmaintenanceForm();
            closeMaintenanceModal();
          } else {
            alert('Failed to save maintenance details.');
          }
        } catch (err) {
          alert('Error occurred while saving machine details.');
        }
    
      };

        // Fetch data for editing a specific machine
  const editMaintenanceGetData = async (id) => {
    try {
      const response = await axios.get(
        `${urll}insert_update_machine_maintenance/?getdata_id=${id}`
      );
      console.log(response.data.data)
      setmaintenanceformData(response.data.data);
      openMaintenanceModal()
    } catch (err) {
      setError('Failed to load Machine Maintenance details');
    }
  };

  const deleteMaintenanceData = async (id) => {
    try {
      const response = await axios.delete(
        `${urll}delete_machine_maintenance/?machine_maintenance_id=${id}`
      );
      setMessages(response.data.message)
      fetchProjectMachines();
      closeMaintenanceModal();
    } catch (err) {
      setError("Failed to Delete Document type data")
    }
  }



//   =====================================================================================================

    const fetchProjectMachines = async () => {
        try {
            const response = await axios.get(`${urll}show_project_machine/?project_id=${project_id}`);
            setProjectMachineData(response.data.data || []);
            setTotalAmount(response.data.total_amount || 0);
            setWorkTypeData(response.data.work_types_data || []);


            setMachineMaintenanceData(response.data.machine_maintenance_data || []);
            setmaintenanceTotalAmount(response.data.maintenance_total_amount)
            setMaintenanceTypes(response.data.maintenance_types_data || []);
            setmachineData(response.data.machines_data || []);
            setpersonData(response.data.persons_data || []);
            setdriverpersonData(response.data.driver_persons_data || []);
            setrepairpersonData(response.data.repair_persons_data || []);
            setprojectData(response.data.projects_data || []);
            setTitle(response.data.title)
            setLoading(false);
        } catch (err) {
            setError('Failed to load project machine details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectMachines();
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
                `${urll}insert_update_project_machine/?proj_id=${project_id}`,
                formData
            );
            if (response.data.status === 'success') {
                alert(response.data.message);
                fetchProjectMachines();
                resetForm();
                closeModal();
                
            } else {
                alert('Failed to save project machine data.');
            }
        } catch (err) {
            alert('Error occurred while saving project machine data.');
        }
    };

    const editProjectMachine = async (id) => {
        try {
            const response = await axios.get(
                `${urll}insert_update_project_machine/?getdata_id=${id}`
            );
            const ProjectMachineData = response.data.data;
            setFormData({
                ...ProjectMachineData,
                project_id: project_id // Ensure project_id is set here
            });
            openModal();
        } catch (err) {
            alert('Failed to load project machine data');
        }
    };

    const resetForm = () => {
        setFormData({
            project_machine_data_id: "",
            project_machine_date: "",
            machine_project_id: null,
            work_type_id: "",
            project_machine_data_work_number: "",
            project_machine_data_work_price: "",
            project_machine_data_total_amount: "",
            project_machine_data_work_details: "",
            project_machine_data_more_details: "",
            project_machine_data_km:"",
            project_id: project_id
            
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
                `${urll}delete_project_machine/?project_machine_data_id=${id}`
            );
            setMessages(response.data.message)
            fetchProjectMachines();
            closedeleteModal();
        } catch (err) {
            setError("Failed to delete project machine data")
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
                    પ્રોજેક્ટ મશીન ડેટા ઉમેરો
                </button>
                <button
                    type="button"
                    className="btn btn-sm mb-1 mt-3 btn-primary ms-2"
                    onClick={openMaintenanceModal}
                >
                    મશીન મરામત ઉમેરો
                </button>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-3">
                <div className="card">
                    <h6 className='mb-2'>પ્રોજેક્ટ મશીન ડેટા</h6>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ક્રમ</th>
                                <th>તારીખ</th>
                                <th>મશીન નામ</th>
                                <th>કામ પ્રકાર</th>
                                <th>કામ</th>
                                <th>કિલોમીટર</th>
                                <th>ભાવ</th>
                                <th>કુલ ભાવ</th>
                                <th>કામ ની વિગત</th>
                                <th>બીજી વિગત</th>
                                <th>અપડેટ</th>
                                <th>ડિલીટ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ProjectMachineData.length > 0 ? (
                                ProjectMachineData.map((detail, index) => (
                                    <tr key={detail.project_machine_data_id}>
                                        <td>{index + 1 || "N/A"}</td>
                                        <td>{detail.project_machine_date || "N/A"}</td>
                                        <td>
                                            {detail.machine_project_id__machine_name || "N/A"} {detail.machine_project_id__machine_number_plate}
                                        </td>
                                        <td>
                                            {detail.work_type_id__work_type_name || "N/A"}
                                        </td>
                                        <td>{detail.project_machine_data_work_number || "N/A"}</td>
                                        <td>{detail.project_machine_data_km || "N/A"}</td>
                                        <td><i class="fa-solid fa-indian-rupee-sign"></i> {detail.project_machine_data_work_price || "N/A"}</td>
                                        <td><i class="fa-solid fa-indian-rupee-sign"></i> {detail.project_machine_data_total_amount || "N/A"}</td>
                                        <td>{detail.project_machine_data_work_details || "N/A"}</td>
                                        <td>{detail.project_machine_data_more_details || "N/A"}</td>
                                        <td>
                                            <i
                                                className="fa-regular fa-pen-to-square"
                                                onClick={() => editProjectMachine(detail.project_machine_data_id)}
                                            ></i>
                                        </td>
                                        <td>
                                            <i
                                                className="fa-regular fa-trash-can"
                                                onClick={() => openDeleteModal(detail.project_machine_data_id)}
                                            ></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: "center" }}>
                                        ડેટા અવાઈલેબેલ નથી.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className='font-semibold text-base text-green-800'>ટોટલ કિમત: <i class="fa-solid fa-indian-rupee-sign"></i>{totalAmount}</div>
                    </div>
                </div>

                <div className="card">
                <h6 className='mb-2'>મશીન મરામત ડેટા</h6>
                <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ક્રમ</th>
                <th>મશીન નામ</th>
                <th>મરામત પ્રકાર</th>
                <th>મરામત કિમત</th>
                <th>મરામત તારીખ</th>
                <th>રોકડું</th>
                <th>ખર્ચ કરનાર</th>
                <th>મરામત વ્યક્તિ</th>
                <th>ડ્રાઇવર</th>
                <th>વિગત</th>
                <th>Update</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {MachineMaintenanceData.length > 0 ? (
                MachineMaintenanceData.map((maintenance, index) => (
                  <tr key={maintenance.machine_maintenance_id}>
                    <td>{index + 1}</td>
                    <td>{maintenance.machine_machine_id__machine_name} {maintenance.machine_machine_id__machine_number_plate} - {maintenance.machine_machine_id__machine_types_id__machine_type_name}</td>
                    <td>{maintenance.machine_maintenance_types_id__maintenance_type_name || "N/A"}</td>
                    <td><i class="fa-solid fa-indian-rupee-sign"></i> {maintenance.machine_maintenance_amount || "N/A"}</td>
                    <td>{maintenance.machine_maintenance_date || "N/A"}</td>
                    <td>{maintenance.machine_maintenance_amount_paid ? "Yes" : "No"}</td>
                    <td>{maintenance.machine_maintenance_amount_paid_by || "N/A"}</td>
                    <td>{maintenance.machine_maintenance_person_id__person_name || "N/A"} [{maintenance.machine_maintenance_person_id__person_contact_number}]</td>
                    <td>{maintenance.machine_maintenance_driver_id__person_name || "N/A"} [{maintenance.machine_maintenance_driver_id__person_contact_number}]</td>
                    <td>{maintenance.machine_maintenance_details || "N/A"}</td>
                    <td><i className="fa-regular fa-pen-to-square" onClick={() => editMaintenanceGetData(maintenance.machine_maintenance_id)}></i></td>
                    <td><i class="fa-regular fa-trash-can" onClick={() => deleteMaintenanceData(maintenance.machine_maintenance_id)}></i></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center" }}>
                    ડેટા આવેલેબલ નથી.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className='font-semibold text-base text-green-800'>કુલ મરામત ખર્ચ : <i class="fa-solid fa-indian-rupee-sign"></i>{maintenanceTotalAmount}</div>
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
                                {formData.project_machine_data_id ? 'એડિટ મશીન ડેટા' : 'મશીન ડેટા ઉમેરો'}
                            </h5>
                            <Machine_insert fetchdata={fetchProjectMachines} />
                            <Work_types_insert fetchdata={fetchProjectMachines} />
                            <button
                                type="button"
                                className="btn-close"
                                onClick={closeModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                {formData.project_machine_data_id && (
                                <div className="mb-3">
                                    <label htmlFor="workNoInput" className="form-label">તારીખ</label>
                                    <input
                                        type="date"
                                        name="project_machine_date"
                                        value={formData.project_machine_date}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                )}

                                <Select
                                    options={projectmachineoptions}
                                    value={projectmachineoptions.find(option => option.value === formData.machine_project_id) || null}
                                    onChange={handleProjectMachineChange}
                                    placeholder="મશીન સિલેક્ટ કરો*"
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
                                
                                <div className="grid grid-cols-3 gap-2">
                                <div className="mb-3">
                                    <input
                                        id="priceInput"
                                        type="text"
                                        name="project_machine_data_work_number"
                                        value={formData.project_machine_data_work_number}
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
                                        name="project_machine_data_work_price"
                                        value={formData.project_machine_data_work_price}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="ભાવ*"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        id="KM"
                                        type="text"
                                        name="project_machine_data_km"
                                        value={formData.project_machine_data_km}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="કિલોમીટર*"
                                        required
                                    />
                                </div>

                                </div>
                                
                              

                                {/* Details Textarea */}
                                <div className="mb-3">
                                    <label htmlFor="detailsTextarea" className="form-label">વિગત</label>
                                    <textarea
                                        id="detailsTextarea"
                                        name="project_machine_data_work_details"
                                        value={formData.project_machine_data_work_details}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="વિગત"
                                    ></textarea>
                                </div>

                                {/* Details Textarea */}
                                <div className="mb-3">
                                    <label htmlFor="detailsTextarea" className="form-label">ટિપ્પણી</label>
                                    <textarea
                                        id="detailsTextarea"
                                        name="project_machine_data_more_details"
                                        value={formData.project_machine_data_more_details}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="ટિપ્પણી"
                                    ></textarea>
                                </div>

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





        <div
        className="modal fade"
        id="maintenanceModal"
        tabIndex="-1"
        aria-labelledby="maintenanceModalLabel"
        aria-hidden="true"
        ref={maintenancemodalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="maintenanceModalLabel">
                {maintenanceformData.machine_maintenance_id ? 'એડિટ મરામત' : 'મરામત ઉમેરો'}
              </h5>
              <Maintenance_types_insert fetchdata={fetchProjectMachines} />
              <Person_insert fetchdata={fetchProjectMachines} />
              <Machine_insert fetchdata={fetchProjectMachines} />

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handlemaintenanSubmit}>

                <Select
                  options={machineoptions}
                  value={machineoptions.find((option) => option.value === maintenanceformData.machine_machine_id) || null}
                  onChange={handleMachineChange}
                  placeholder="મશીન*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />


                <div className="mb-3">
                  <label className="form-label">મરામત પ્રકાર:</label>
                  <select
                    name="machine_maintenance_types_id"
                    value={maintenanceformData.machine_maintenance_types_id}
                    onChange={handlemaintenanceChange}
                    className="form-select"
                    required
                  >
                    <option value="">સિલેક્ટ મરામત પ્રકાર</option>
                    {maintenanceTypes.map((type) => (
                      <option key={type.maintenance_type_id} value={type.maintenance_type_id}>
                        {type.maintenance_type_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">મરામત કિમત:</label>
                  <input
                    type="text"
                    name="machine_maintenance_amount"
                    value={maintenanceformData.machine_maintenance_amount}
                    onChange={handlemaintenanceChange}
                    className="form-control"
                  />
                </div>

                {formData.machine_maintenance_id && (
                <div className="mb-3">
                  <label className="form-label">મરામત તારીખ:</label>
                  <input
                    type="date"
                    name="machine_maintenance_date"
                    value={maintenanceformData.machine_maintenance_date}
                    onChange={handlemaintenanceChange}
                    className="form-control"
                  />
                </div>
                )}

                <div className="">
                  <input
                    type="checkbox"
                    name="machine_maintenance_amount_paid"
                    checked={maintenanceformData.machine_maintenance_amount_paid}
                    onChange={handlemaintenanceChange}
                    className="form-check-input"
                    id="machine_maintenance_amount_paid"
                  />
                  <label className="form-label ms-2" for="machine_maintenance_amount_paid">રોકડું કરેલ છે? :</label>
                </div>

                <div className="mb-3">
                  <label className="form-label">ખર્ચ કરનાર:</label>
                  <select
                    name="machine_maintenance_amount_paid_by"
                    onChange={handlemaintenanceChange}
                    className="form-select"
                    value={maintenanceformData.machine_maintenance_amount_paid_by}
                    required
                  >
                    <option value="">ખર્ચ કરનાર</option>
                    <option value="Project_Owner">પ્રોજેક્ટ માલિક</option>
                    <option value="machine_owner">મશીન માલિક</option>
                    <option value="Pinak_Enterprise">પિનાક એન્ટરપ્રાઇજ</option>
                    <option value="office">ઓફિસ</option>
                  </select>
                </div>

                {maintenanceformData.machine_maintenance_amount_paid_by!== 'office' &&(
                <Select
                  options={repairpersonoptions}
                  value={repairpersonoptions.find((option) => option.value === maintenanceformData.machine_maintenance_person_id) || null}
                  onChange={handleRepairPersonChange}
                  placeholder="સમારકામ કરનાર વ્યક્તિ*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />
            )}

                <Select
                  options={driverpersonoptions}
                  value={driverpersonoptions.find((option) => option.value === maintenanceformData.machine_maintenance_driver_id) || null}
                  onChange={handleDriverPersonChange}
                  placeholder="ડ્રાઇવર*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />

                <div className="mb-3">
                  <label className="form-label">વિગત:</label>
                  <textarea
                    name="machine_maintenance_details"
                    value={maintenanceformData.machine_maintenance_details}
                    onChange={handlemaintenanceChange}
                    className="form-control"
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

        </>
    );
};

export default ProjectMachines;
