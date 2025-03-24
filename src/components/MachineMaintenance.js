import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';
import Maintenance_types_insert from './insert_update/maintenance_types_insert';
import Person_insert from './insert_update/person_insert';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { backendurl } from './backend_url';


const MachineMaintenance = () => {
  const urll = backendurl();
  const [machineMaintenance, setMachineMaintenance] = useState([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [machineData, setmachineData] = useState([]);
  const [personData, setpersonData] = useState([]);
  const [driverpersonData, setdriverpersonData] = useState([]);
  const [repairpersonData, setrepairpersonData] = useState([]);
  const [projectData, setprojectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const modalRef = useRef();
  const deletemodel = useRef();
  const [delid, setdelid] = useState("");
  const [Messages, setMessages] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const machineoptions = machineData.map((machine) => ({
    value: machine.machine_id,
    label: `${machine.machine_name} (${machine.machine_number_plate})`,
  }));

  const handleMachineChange = (selectedOption) => {
    setFormData({
      ...formData,
      machine_machine_id: selectedOption ? selectedOption.value : "",
    });
  };

  const driverpersonoptions = driverpersonData.map((x) => ({
    value: x.person_id,
    label: `${x.person_name} (${x.person_contact_number})`,
  }));

  const repairpersonoptions = repairpersonData.map((x) => ({
    value: x.person_id,
    label: `${x.person_name} (${x.person_contact_number})`,
  }));


  const handleDriverPersonChange = (selectedOption) => {
    setFormData({
      ...formData,
      machine_maintenance_driver_id: selectedOption ? selectedOption.value : "",
    });
  };

  const handleRepairPersonChange = (selectedOption) => {
    setFormData({
      ...formData,
      machine_maintenance_person_id: selectedOption ? selectedOption.value : "",
    });
  };

  const projectoptions = projectData.map((x) => ({
    value: x.project_id,
    label: x.project_name,
  }));

  const handleProjectChange = (selectedOption) => {
    setFormData({
      ...formData,
      project_id: selectedOption ? selectedOption.value : "",
    });
  };


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  // Filter data based on search term
  const filter_machineMaintenance = machineMaintenance.filter((item) => {

    const matchesSearchTerm =
      (item?.machine_machine_id__machine_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.machine_machine_id__machine_number_plate?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.machine_machine_id__machine_types_id__machine_type_name?.toString().includes(searchTerm)) ||
      (item?.machine_maintenance_amount?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.machine_maintenance_date?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.machine_maintenance_amount_paid_by?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.machine_maintenance_driver_id__person_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.machine_maintenance_person_id__person_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.machine_maintenance_person_id__person_contact_number?.toLowerCase().includes(searchTerm.toLowerCase()));
    (item?.machine_maintenance_types_id__maintenance_type_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    (item?.project_id__project_name?.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearchTerm;
  });


  const [formData, setFormData] = useState({
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
    project_id: '',
  });

  const fetchMaintenanceDetails = async () => {
    try {
      const response = await axios.get(`${urll}show_machine_maintenance/`);
      setMachineMaintenance(response.data.data || []);
      setMaintenanceTypes(response.data.maintenance_types_data || []);
      setmachineData(response.data.machines_data || []);
      setpersonData(response.data.persons_data || []);
      setdriverpersonData(response.data.driver_persons_data || []);
      setrepairpersonData(response.data.repair_persons_data || []);
      setprojectData(response.data.projects_data || []);
      setTitle(response.data.title);
      setLoading(false);
    } catch (err) {
      setError('Failed to load maintenance details.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceDetails();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  useEffect(() => {
    if (Messages) {
      const timer = setTimeout(() => {
        setMessages('');  // Clear success message after 3 seconds
      }, 3000);  // 3000 milliseconds = 3 seconds

      // Cleanup the timer if the component is unmounted or successMessage changes
      return () => clearTimeout(timer);
    }
  }, [Messages]);

  // Handle form submission for Add/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {


      const response = await axios.post(
        `${urll}insert_update_machine_maintenance/`,
        formData
      );
      if (response.status === 200) {
        fetchMaintenanceDetails(); // Reload data
        resetForm();
        closeModal();
      } else {
        alert('Failed to save maintenance details.');
      }
    } catch (err) {
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
        `${urll}insert_update_machine_maintenance/?getdata_id=${id}`
      );
      setFormData(response.data.data);
      openModal()
    } catch (err) {
      setError('Failed to load machine Maintenance details');
    }
  };

  const deleteData = async (id) => {
    try {
      const response = await axios.delete(
        `${urll}delete_machine_maintenance/?machine_maintenance_id=${id}`
      );
      setMessages(response.data.message)
      fetchMaintenanceDetails();
      closedeleteModal();
    } catch (err) {
      setError("Failed to delete document type data")
    }
  }

  const resetForm = () => {
    setFormData({
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
      project_id: '',
    });
  };



  // Show loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if fetching data failed
  if (error) {
    return <div>{error}</div>;
  }

  // Render the machine maintenance table
  return (
    <>
      <div>
        {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
        <h5 className="text-1xl font-extrabold text-black-600 decoration-dashed tracking-wide">મશીન મરામત</h5> {/* Display the title */}
        <div className="d-flex align-items-center mb-3 mt-3">
          <Link to="/maintenance-types"><img
            src="/static/icons/troubleshooting.png"
            alt="User Icon"
            style={{ height: "30px", width: "auto" }} // Ensure consistent height
          /></Link>
          <button
            type="button"
            className="btn btn-sm btn-primary ms-2"
            onClick={openModal}
            style={{ height: "30px" }} // Adjust the height as needed
          >મરામત ઉમેરો</button>
          <div className="input-group" style={{ height: "30px", width: "auto" }}>
            <input type="text" class="form-control ms-2" style={{ height: "30px", width: "100px" }} placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2" value={searchTerm} onChange={handleSearchChange} />
            <button className="btn btn-sm btn-outline-primary d-flex align-items-center" type="button" id="button-addon2" style={{ height: "30px", width: "auto" }}><i class="fa-solid fa-magnifying-glass"></i></button>
          </div>
        </div>
        <div className='card mt-4 reportbackground'>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ક્રમ	</th>
                <th>મશીન</th>
                <th>મરામત કિમત</th>
                <th>મરામત તારીખ</th>
                <th>પ્રોજેક્ટ</th>
                <th>રોકડે કરેલ છે?</th>
                <th>ખર્ચ કરનાર</th>
                <th>મરામત કરનાર વ્યક્તિ</th>
                <th>ડ્રાઇવર</th>
                <th>વિગત</th>
                <th>મરામત પ્રકાર</th>
                <th>અપડેટ</th>
                <th>ડિલીટ</th>
              </tr>
            </thead>
            <tbody>
              {filter_machineMaintenance.length > 0 ? (
                filter_machineMaintenance.map((maintenance, index) => (
                  <tr key={maintenance.machine_maintenance_id}>
                    <td>{index + 1}</td>
                    <td>{maintenance.machine_machine_id__machine_name} - {maintenance.machine_machine_id__machine_number_plate}  [{maintenance.machine_machine_id__machine_types_id__machine_type_name}]</td>
                    <td>{maintenance.machine_maintenance_amount || "N/A"}</td>
                    <td>{maintenance.machine_maintenance_date || "N/A"}</td>
                    <td>{maintenance.project_id__project_name || "N/A"}</td>
                    <td>{maintenance.machine_maintenance_amount_paid ? "Yes" : "No"}</td>
                    <td>{maintenance.machine_maintenance_amount_paid_by || "N/A"}</td>
                    <td>{maintenance.machine_maintenance_person_id__person_name || "N/A"} [{maintenance.machine_maintenance_person_id__person_contact_number}]</td>
                    <td>{maintenance.machine_maintenance_driver_id__person_name || "N/A"} [{maintenance.machine_maintenance_driver_id__person_contact_number}]</td>
                    <td>{maintenance.machine_maintenance_details || "N/A"}</td>
                    <td>{maintenance.machine_maintenance_types_id__maintenance_type_name || "N/A"}</td>
                    <td><i className="fa-regular fa-pen-to-square" onClick={() => editDetailsGetData(maintenance.machine_maintenance_id)}></i></td>
                    <td><i class="fa-regular fa-trash-can" onClick={() => opendeleteModal(maintenance.machine_maintenance_id)}></i></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center" }}>
                    ડેટા અવઈલેબલ નથી..
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>
      {/* Modal for Add/Edit Maintenance */}
      <div
        className="modal fade"
        id="maintenanceModal"
        tabIndex="-1"
        aria-labelledby="maintenanceModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="maintenanceModalLabel">
                {formData.machine_maintenance_id ? 'એડિટ મરામત ડેટા' : 'મરામત ડેટા ઉમેરો'}
              </h5>

              <Maintenance_types_insert fetchdata={fetchMaintenanceDetails} />
              <Person_insert fetchdata={fetchMaintenanceDetails} />

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
                  value={machineoptions.find((option) => option.value === formData.machine_machine_id) || null}
                  onChange={handleMachineChange}
                  placeholder="મશીન સિલેક્ટ કરો*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />


                <div className="mb-3">
                  <label className="form-label">મરામત પ્રકાર:</label>
                  <select
                    name="machine_maintenance_types_id"
                    value={formData.machine_maintenance_types_id}
                    onChange={handleChange}
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
                  <label className="form-label">મરામત અમાઉન્ટ:</label>
                  <input
                    type="text"
                    name="machine_maintenance_amount"
                    value={formData.machine_maintenance_amount}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                {formData.machine_maintenance_id && (
                <div className="mb-3">
                  <label className="form-label">મરામત તારીખ:</label>
                  <input
                    type="date"
                    name="machine_maintenance_date"
                    value={formData.machine_maintenance_date}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                )}

                <div className="">
                  <input
                    type="checkbox"
                    name="machine_maintenance_amount_paid"
                    checked={formData.machine_maintenance_amount_paid}
                    onChange={handleChange}
                    className="form-check-input"
                    id="machine_maintenance_amount_paid"
                  />
                  <label className="form-label ms-2" for="machine_maintenance_amount_paid">રોકડું કરો છો? :</label>
                </div>

                <div className="mb-3">
                  <label className="form-label">ખર્ચ કરનાર:</label>
                  <select
                    name="machine_maintenance_amount_paid_by"
                    value={formData.machine_maintenance_amount_paid_by}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Project_Owner">પ્રોજેક્ટ માલિક</option>
                    <option value="machine_owner">મશીન માલિક</option>
                    <option value="Pinak_Enterprise">પિનાક એન્ટરપ્રાઇજ</option>
                    <option value="office">ઓફિસ ખર્ચ</option>
                  </select>
                </div>


                <Select
                  options={repairpersonoptions}
                  value={repairpersonoptions.find((option) => option.value === formData.machine_maintenance_person_id) || null}
                  onChange={handleRepairPersonChange}
                  placeholder="રેપઈર કરનાર વ્યક્તિ સિલેક્ટ કરો*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />

                <Select
                  options={driverpersonoptions}
                  value={driverpersonoptions.find((option) => option.value === formData.machine_maintenance_driver_id) || null}
                  onChange={handleDriverPersonChange}
                  placeholder="ડ્રાઇવર સિલેક્ટ કરો*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />

                <Select
                  options={projectoptions}
                  value={projectoptions.find((option) => option.value === formData.project_id) || null}
                  onChange={handleProjectChange}
                  placeholder="પ્રોજેક્ટ"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />



                <div className="mb-3">
                  <label className="form-label">વિગત:</label>
                  <textarea
                    name="machine_maintenance_details"
                    value={formData.machine_maintenance_details}
                    onChange={handleChange}
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
                Delete Machine-Maintenance Data
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

export default MachineMaintenance;
