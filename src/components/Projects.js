import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';
import { Link } from 'react-router-dom';
import Project_types_insert from './insert_update/project_types_insert';
import Person_insert from './insert_update/person_insert';
import Select from 'react-select';
import { backendurl } from './backend_url';



const Projects = () => {
    const urll = backendurl();
  
  const [projects, setProjects] = useState([]);
  const [agentPersons, setagentPersons] = useState([]);
  const [investorPersons, setinvestorPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // To store the title from API response
  const [projectTypes, setprojectTypes] = useState([]);
  const [persons, setpersons] = useState([]);
  const modalRef = useRef();
  const deletemodel = useRef();
  const [delid, setdelid] = useState("");
  const [Messages, setMessages] = useState('');
  const [searchTerm, setSearchTerm] = useState('');


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  // Filter data based on search term
  const filter_projects = projects.filter((item) => {

    const matchesSearchTerm =
      (item?.project_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.project_start_date?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.project_end_date?.toString().includes(searchTerm)) ||
      (item?.project_amount?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.person_address?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.project_owner_name__person_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.project_owner_name__person_contact_number?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.project_status?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.project_types_id__project_type_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.project_cgst?.toLowerCase().includes(searchTerm.toLowerCase()));
    (item?.project_sgst?.toLowerCase().includes(searchTerm.toLowerCase()));
    (item?.project_tax?.toLowerCase().includes(searchTerm.toLowerCase()));
    (item?.project_discount?.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearchTerm;
  });



  const [formData, setformData] = useState({
    project_id: "",
    project_name: "",
    project_start_date: "",
    project_end_date: "",
    project_amount: "",
    project_location: "",
    project_types_id: "",
    project_status: "",
    project_owner_name: "",
    project_cgst: "",
    project_sgst: "",
    project_tax: "",
    project_discount: "",
    project_agent: false,
    project_agent_id: "",
    project_agent_type: "",
    project_agent_percentage: "",
    project_agent_fixed_amount: "",
    project_investor: false,
    project_investor_id: "",
    project_investor_type: "",
    project_investor_percentage: "",
    project_investor_amount: "",
  })

  const projecttypesoptions = projectTypes.map((type) => ({
    value: type.project_type_id,
    label: type.project_type_name,
  }));

  const personsoptions = persons.map((pers) => ({
    value: pers.person_id,
    label: `${pers.person_name} (${pers.person_contact_number})`,
  }));

  const agentoptions = agentPersons.map((agent) => ({
    value: agent.person_id,
    label: `${agent.person_name} (${agent.person_contact_number})`,
  }))

  const investoroptions = investorPersons.map((investor) => ({
    value: investor.person_id,
    label: `${investor.person_name} (${investor.person_contact_number})`,
  }))

  // Fetch machine details
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${urll}show_projects/`);
      setProjects(response.data.data || []);
      setagentPersons(response.data.agent_persons || []);
      setinvestorPersons(response.data.agent_persons || []);
      setprojectTypes(response.data.project_types_data || []);
      setpersons(response.data.persons_data || []);
      setTitle(response.data.title);
      setLoading(false);
    } catch (err) {
      setError('Failed to load project details');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
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
    setformData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleProjectTypeChange = (selectedOption) => {
    setformData({
      ...formData,
      project_types_id: selectedOption ? selectedOption.value : "",
    });
  };

  const handleOwnerChange = (selectedOption) => {
    setformData({
      ...formData,
      project_owner_name: selectedOption ? selectedOption.value : "",
    });
  };

  const handleAgentChange = (selectedOption) => {
    setformData({
      ...formData,
      project_agent_id: selectedOption ? selectedOption.value : "",
    })
  }


  const handleInvestorChange = (selectedOption) => {
    setformData({
      ...formData,
      project_investor_id: selectedOption ? selectedOption.value : "",
    })
  }

  // Handle form submission for Add/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${urll}insert_update_project/`,
        formData
      );
      if (response.status === 200) {
        alert('Project details saved successfully!');
        fetchProjects(); // Reload data
        resetForm();
        closeModal();
      } else {
        alert('Failed to save project details.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error occurred while saving project details.');
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
        `${urll}insert_update_project/?getdata_id=${id}`
      );
      setformData(response.data.data);
      setprojectTypes(response.data.project_types_data || []);
      openModal()
    } catch (err) {
      setError('Failed to load project details');
    }
  };

  const deleteData = async (id) => {
    try {
      const response = await axios.delete(
        `${urll}delete_project/?project_id=${id}`
      );
      setMessages(response.data.message)
      fetchProjects();
      closedeleteModal();
    } catch (err) {
      setError("Failed to delete project data")
    }
  }


  // Reset the form state
  const resetForm = () => {
    setformData({
      project_id: "",
      project_name: "",
      project_start_date: "",
      project_end_date: "",
      project_amount: "",
      project_location: "",
      project_types_id: "",
      project_status: "",
      project_owner_name: "",
      project_cgst: "",
      project_sgst: "",
      project_tax: "",
      project_discount: "",
      project_agent: false,
      project_agent_id: "",
      project_agent_type: "",
      project_agent_percentage: "",
      project_agent_fixed_amount: "",
      project_investor: false,
    project_investor_id: "",
    project_investor_type: "",
    project_investor_percentage: null,
    project_investor_amount: "",
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

  // Render the projects table
  return (
    <>
      <div>
        {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
        <h5 className="text-1xl font-extrabold text-black-600 decoration-dashed tracking-wide">પ્રોજેક્ટ્સ</h5> {/* Display the title */}
        <div className="d-flex align-items-center mb-3 mt-3">
          <Link to="/work-types"><img
            src="/static/icons/wrench.png"
            alt="User Icon"
            style={{ height: "30px", width: "auto" }} // Ensure consistent height
          /></Link>

          <Link to="/project-types"><img
            src="/static/icons/projecttype2.png"
            alt="User Icon"
            style={{ height: "30px", width: "auto" }} // Ensure consistent height
          /></Link>
          <button
            type="button"
            className="btn btn-sm btn-primary ms-2"
            onClick={openModal}
            style={{ height: "30px" }} // Adjust the height as needed
          >
            નવો પ્રોજેક્ટ બનાવો
          </button>

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
                <th>ક્રમ</th>
                <th>પ્રોજેક્ટ નામ</th>
                
                <th>કિમત</th>
                <th>લોકેશન</th>
                <th>પ્રોજેક્ટ પ્રકાર</th>
                
                <th>કસ્ટમર નામ</th>  
                <th>શરૂઆત તારીખ</th>
                <th>આખરી તારીખ</th> 
                <th>સ્ટેટસ</th>    
                <th>અપડેટ</th>
                <th>ડિલીટ</th>
              </tr>
            </thead>
            <tbody>
              {filter_projects.length > 0 ? (
                filter_projects.map((project, index) => (
                  <tr key={project.project_id}>
                    <td>{index + 1}</td>
                    <td><Link to={`/project/${project.project_id}`}>{project.project_name || "N/A"}</Link></td>
                    
                    <td>{project.project_amount || "N/A"}</td>
                    <td>{project.project_location || "N/A"}</td>
                    <td>{project.project_types_id__project_type_name || "N/A"}</td>
                    <td>{project.project_owner_name__person_name || "N/A"} - {project.project_owner_name__person_contact_number || "N/A"}</td>
                    <td>{project.project_start_date || "N/A"}</td>
                    <td>{project.project_end_date || "N/A"}</td>
                    <td>{project.project_status || "N/A"}</td>
                  
                    <td>
                      <i
                        className="fa-regular fa-pen-to-square"
                        onClick={() => editDetailsGetData(project.project_id)}
                      ></i>
                    </td>
                    <td>
                      <i
                        className="fa-regular fa-trash-can"
                        onClick={() => opendeleteModal(project.project_id)}
                      ></i>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16" style={{ textAlign: "center" }}>
                    પ્રોજેક્ટ ડેટા અવઈલેબલ નથી.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>
      {/* Modal for Add/Edit Project */}
      <div
        className="modal fade"
        id="projectModal"
        tabIndex="-1"
        aria-labelledby="projectModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="projectModalLabel">
                {formData.project_id ? 'એડિટ પ્રોજેક્ટ' : 'નવો પ્રોજેક્ટ'}
              </h5>

              <Project_types_insert fetchdata={fetchProjects} />
              <Person_insert fetchdata={fetchProjects} />
              

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <input
                    type="text"
                    name="project_name"
                    value={formData.project_name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="પ્રોજેક્ટ નામ*"
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    name="project_amount"
                    value={formData.project_amount}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="કિમત"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    name="project_location"
                    value={formData.project_location}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="લોકેશન*"
                    required
                  />
                </div>

                <div className="mb-3">
                  <Select
                    options={projecttypesoptions}
                    value={projecttypesoptions.find((option) => option.value === formData.project_types_id) || null}
                    onChange={handleProjectTypeChange}
                    placeholder="પ્રોજેક્ટ પ્રકાર*"
                    isSearchable
                    isClearable
                    className="react-select-container mb-3"
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="mb-3">
                  <select
                    name="project_status"
                    value={formData.project_status}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">પ્રોજેક્ટ સ્ટેટસ*</option>
                    <option value="Ongoing">ચાલુ પ્રોજેક્ટ છે</option>
                    <option value="Closed">પ્રોજેક્ટ બંધ થયેલ છે</option>
                  </select>
                </div>

                <Select
                  options={personsoptions}
                  value={personsoptions.find((option) => option.value === formData.project_owner_name) || null}
                  onChange={handleOwnerChange}
                  placeholder="પ્રોજેક્ટ માલિક નામ*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />
                {formData.project_id && (
                  <>
                    <div className="mb-3">
                      <label>શરૂઆત તારીખ:</label>
                      <input
                        type="date"
                        name="project_start_date"
                        value={formData.project_start_date}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="mb-3">
                      <label>આખરી તારીખ:</label>
                      <input
                        type="date"
                        name="project_end_date"
                        value={formData.project_end_date}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="End Date"
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="text"
                        name="project_cgst"
                        value={formData.project_cgst}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="CGST"
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="text"
                        name="project_sgst"
                        value={formData.project_sgst}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="SGST"
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="text"
                        name="project_discount"
                        value={formData.project_discount}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="ડિસ્કાઉન્ટ"
                      />
                    </div>
                  </>
                )}



                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      onChange={(e) =>
                        handleChange({
                          target: { name: "project_agent", value: e.target.checked },
                        })
                      }
                      checked={formData.project_agent}
                      name="project_agent"
                      type="checkbox"
                      id="isAgent"
                    />
                    <label className="form-check-label" htmlFor="isAgent">
                      દલાલી આપવાની છે?
                    </label>
                  </div>
                </div>

                {formData.project_agent === true && (
                  <>
                    <Select
                      options={agentoptions}
                      value={agentoptions.find((option) => option.value === formData.project_agent_id) || null}
                      onChange={handleAgentChange}
                      placeholder="Select Agent"
                      isSearchable
                      isClearable
                      className="react-select-container mb-3"
                      classNamePrefix="react-select" />

                    <div className="mb-3">
                      <select name="project_agent_type"
                        value={formData.project_agent_type} onChange={handleChange} className="form-select">
                        <option>દલાલી અમાઉન્ટ ટાઇપ</option>
                        <option value='Percentage'>ટકાવારી પર</option>
                        <option value='Fixed'>ફિક્સ્ડ રકમ પર</option>
                      </select>
                    </div>
                  </>
                )}

                {formData.project_agent_type === 'Percentage' && (
                  <div className="mb-3">
                    <input
                      type="number"
                      name="project_agent_percentage"
                      value={formData.project_agent_percentage}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="દલાલી(ટકાવારી પર)"
                    />
                  </div>
                )}

                {formData.project_agent_type === 'Fixed' && (
                  <div className="mb-3">
                    <input
                      type="text"
                      name="project_agent_fixed_amount"
                      value={formData.project_agent_fixed_amount}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="દલાલી(અમાઉન્ટ)"
                    />
                  </div>
                )}







<div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      onChange={(e) =>
                        handleChange({
                          target: { name: "project_investor", value: e.target.checked },
                        })
                      }
                      checked={formData.project_investor}
                      name="project_investor"
                      type="checkbox"
                      id="isinvestor"
                    />
                    <label className="form-check-label" htmlFor="isinvestor">
                      પ્રોજેક્ટ માં મૂડીરોકાનકાર છે?
                    </label>
                  </div>
                </div>

                {formData.project_investor === true && (
                  <>
                    <Select
                      options={investoroptions}
                      value={investoroptions.find((option) => option.value === formData.project_investor_id) || null}
                      onChange={handleInvestorChange}
                      placeholder="Select investor"
                      isSearchable
                      isClearable
                      className="react-select-container mb-3"
                      classNamePrefix="react-select" />

                    <div className="mb-3">
                    <input
                      type="number"
                      name="project_investor_percentage"
                      value={formData.project_investor_percentage}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="ટકાવારી(percentage)"
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="text"
                      name="project_investor_amount"
                      value={formData.project_investor_amount}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="મૂડીરોકાણ રકમ"
                    />
                  </div>

                  </>
                )}

              


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
                Delete Project Data
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

export default Projects;