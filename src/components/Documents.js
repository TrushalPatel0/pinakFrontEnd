import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { Link } from "react-router-dom";
import { backendurl } from './backend_url';
import Select from "react-select";
import { useUser, UserSelection, useMachine, MachineSelection, useProject, ProjectSelection } from "./Context/ContextDataShare";


const Documents = () => {
  const { userId } = useUser();
  const { machineID } = useMachine();
  const { projectID } = useProject();
  const url = backendurl();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState("");
  const [formData, setFormData] = useState({
    document_id: "",
    document_name: "",
    document_unique_code: "",
    document_file: null,
    document_type_id: "",
    person_id: "",
    machine_id: "",
    project_id: "",
  });
  const [document_types, setdocument_types] = useState([])


  const [personsList, setPersonsList] = useState([]);
  const [machinesList, setmachinesList] = useState([]);
  const [projectList, setProjectList] = useState([]);

  const modalRef = useRef();
  const deleteModalRef = useRef();
  const [deleteId, setDeleteId] = useState("");

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${url}/show_documents/?person_id=${userId}&machine_id=${machineID}&project_id=${projectID}`);
      setDocuments(response.data.data);
      setdocument_types(response.data.document_types)
      setLoading(false);
    } catch (err) {
      setError("Failed to load documents.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [userId, machineID, projectID]);


  useEffect(() => {
    const fetchPersonList = async () => {
      const response = await axios.get(`${url}persons_list`)
      setPersonsList(response.data.data)
    }
    fetchPersonList()
  }, [])


  useEffect(() => {
    const fetchMachinesList = async () => {
      const response = await axios.get(`${url}machines_list`)
      setmachinesList(response.data.data)
    }
    fetchMachinesList()
  }, [])

  useEffect(() => {
    const fetchProjectList = async () => {
      const response = await axios.get(`${url}project_list`)
      setProjectList(response.data.data)
    }
    fetchProjectList()
  }, [])

  useEffect(() => {
    if (messages) {
      const timer = setTimeout(() => setMessages(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,  // Handle file input properly
    }));
  };

  const personsoptions = personsList.map((x) => ({
    value: x.person_id,
    label: `${x.person_name} (${x.person_contact_number})`,
  }));


  const machinesoptions = machinesList.map((x) => ({
    value: x.machine_id,
    label: `${x.machine_name} (${x.machine_number_plate})`,
  }));

  const projectsoptions = projectList.map((x) => ({
    value: x.project_id,
    label: x.project_name
  }));

  const handlePersonChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      person_id: selectedOption ? selectedOption.value : "", // Update person_id here
    }));
  };

  const handleMachineChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      machine_id: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleProjectChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      project_id: selectedOption ? selectedOption.value : "",
    }));
  };

  // Handle form submit for adding/updating document
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.document_id ? "put" : "post";
    const document_url = formData.document_id
      ? `${url}insert_update_documents/?pk=${formData.document_id}`
      : `${url}insert_update_documents/`;

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    const response = await axios({
      method,
      url: document_url,
      data: formDataToSend,
      headers: { "Content-Type": "multipart/form-data" },
    });
    setMessages(response.data.message)
    fetchDocuments();
    resetForm();
    closeModal();
  };

  // Open modal for adding/editing
  const openModal = (doc = null) => {
    if (doc) setFormData(doc);
    const modalInstance = new Modal(modalRef.current);
    modalInstance.show();
  };

  const closeModal = () => {
    const modalInstance = Modal.getInstance(modalRef.current);
    if (modalInstance) modalInstance.hide();
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    const modalInstance = new Modal(deleteModalRef.current);
    modalInstance.show();
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${url}delete_document/?document_id=${deleteId}/`);
      setMessages(response.data.message);
      fetchDocuments();
      closeDeleteModal();
    } catch (err) {
      setError("Failed to delete document.");
    }
  };

  const closeDeleteModal = () => {
    const modalInstance = Modal.getInstance(deleteModalRef.current);
    if (modalInstance) modalInstance.hide();
  };

  const resetForm = () => {
    setFormData({
      document_id: "",
      document_name: "",
      document_unique_code: "",
      document_file: null,
      document_type_id: "",
      person_id: "",
      machine_id: "",
      project_id: "",
    });
  };

  return (
    <div className="">
      {messages && <div className="alert alert-success">{messages}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <h5 className="text-1xl font-extrabold text-black-600 decoration-dashed tracking-wide">DOCUMENTS DATA</h5>
      <div className="flex justify-start gap-3">
      <button
        className="btn btn-primary mb-3 mt-3"
        onClick={() => openModal()}
      >
        Add Document
      </button>

      <UserSelection />
      <MachineSelection />
      <ProjectSelection />
      </div>

      {/* Documents Table */}
      <div className='card reportbackground'>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Unique Code</th>
                <th>Date</th>
                <th>File</th>
                <th>Person Name</th>
                <th>Machine Name</th>
                <th>Project Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.document_id}>
                  <td>{doc.document_id}</td>
                  <td>{doc.document_name}</td>
                  <td>{doc.document_unique_code}</td>
                  <td>{doc.document_date}</td>
                  <td><Link to={`${url}media/${doc.document_file}`}>Open</Link></td>
                  <td>{doc.person_id__person_name || "NaN"}</td>
                  <td>{doc.machine_id__machine_name || "NaN"}</td>
                  <td>{doc.project_id__project_name || "NaN"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => openDeleteModal(doc.document_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      <div
        className="modal fade"
        ref={modalRef}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {formData.document_id ? "Edit Document" : "Add Document"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    name="document_name"
                    value={formData.document_name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className='mb-3'>
                  <select name="document_type_id" value={formData.document_type_id} onChange={handleChange} className='form-select'>
                    <option value="">Document Type</option>
                    {document_types.length > 0 && (
                      document_types.map((x) => (
                        <option value={x.document_type_id}>{x.document_type_name}</option>
                      )))}
                  </select>
                </div>
                <div className="mb-3">
                  <label>Unique Code</label>
                  <input
                    type="text"
                    name="document_unique_code"
                    value={formData.document_unique_code}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <Select
                  options={personsoptions}
                  value={personsoptions.find((person) => person.value === formData.person_id)}
                  onChange={(handlePersonChange)}
                  placeholder="Select Person*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />

                <Select
                  options={machinesoptions}
                  value={machinesoptions.find((machine) => machine.value === formData.machine_id)}
                  onChange={(handleMachineChange)}
                  placeholder="Select Machine*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />

                <Select
                  options={projectsoptions}
                  value={projectsoptions.find((project) => project.value === formData.project_id)}
                  onChange={(handleProjectChange)}
                  placeholder="Select Project*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />

                <div className="mb-3">
                  <label>Upload File</label>
                  <input
                    type="file"
                    name="document_file"
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <button type="submit" className="btn btn-success">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div
        className="modal fade"
        ref={deleteModalRef}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button type="button" className="btn-close"></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this document?</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
