import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import { backendurl } from './backend_url';
import Select from 'react-select';


const MaterialOwners = () => {
    const urll = backendurl();
    const [materialOwners, setMaterialOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const modalRef = useRef();
    const deleteModalRef = useRef();
    const [deleteId, setDeleteId] = useState("");
    const [messages, setMessages] = useState('');
    const [personsdata, setpersonsdata] = useState([]);
    const [formData, setFormData] = useState({
        Material_Owner_id: '',
        person_id: '',
        status: true,
        location: '',
        details: '',
    });


    const personoptions = personsdata.map((x) => ({
        value: x.person_id,
        label: `${x.person_name} (${x.person_contact_number})`,
      }));

    const handlePersonChange = (selectedOption) => {
        setFormData({
          ...formData,
          person_id: selectedOption ? selectedOption.value : "",
        });
      };

    const fetchMaterialOwners = async () => {
        try {
            const response = await axios.get(`${urll}material_owner_list`);
            setMaterialOwners(response.data.data || []);
            setpersonsdata(response.data.persons_data || []);
            setLoading(false);
        } catch (err) {
            setError('Failed to load material owners');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterialOwners();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (formData.Material_Owner_id) {
                response = await axios.post(`http://localhost:8000/material_owner_update/?pk=${formData.Material_Owner_id}`, formData);
            } else {
                response = await axios.post(`http://127.0.0.1:8000/material_owner_list/`, formData);
            }

            if (response.data.success) {
                setMessages('Material owner saved successfully!');
                fetchMaterialOwners();
                resetForm();
                closeModal();
            } else {
                alert('Failed to save material owner.');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error occurred while saving material owner.');
        }
    };

    const closeModal = () => {
        resetForm();
        const modalInstance = Modal.getInstance(modalRef.current);
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    const openModal = () => {
         // Reset form when opening modal
        const modalInstance = new Modal(modalRef.current);
        modalInstance.show();
    };

    const openDeleteModal = (id) => {
        setDeleteId(id);
        const modalInstance = new Modal(deleteModalRef.current);
        modalInstance.show();
    };

    const deleteData = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/material_owner_update/?pk=${id}`);
            if (response.data.success) {
                setMessages('Material owner deleted successfully!');
                fetchMaterialOwners();
                closeDeleteModal();
            } else {
                alert('Failed to delete material owner.');
            }
        } catch (err) {
            setError("Failed to delete material owner");
        }
    };

    const closeDeleteModal = () => {
        const modalInstance = Modal.getInstance(deleteModalRef.current);
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    const resetForm = () => {
        setFormData({
            Material_Owner_id: '',
            person_id: '',
            status: true,
            location: '',
            details: '',
        });
    };

    const editownerdata = (owner) => {
        setFormData({
            Material_Owner_id: owner.Material_Owner_id || '',
            person_id: owner.material_owner_person_id__person_name || '',  // Ensure correct key
            status: owner.Material_Owner_status || false, // Ensure status is a boolean
            location: owner.Material_Owner_location || '',
            details: owner.Material_Owner_details || '',
        });
        openModal();
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
                {messages && <div className="alert alert-success">{messages}</div>}
                <h5 className="text-1xl font-extrabold text-black-600 decoration-dashed tracking-wide">મટિરિયલ માલિક</h5>
                <button type="button" className="btn btn-sm btn-primary" onClick={openModal}>
                મટિરિયલ માલિક ઉમેરો
                </button>

                <div className="table-responsive mt-3">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Person Name</th>
                                <th>Status</th>
                                <th>Location</th>
                                <th>Details</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materialOwners.length > 0 ? (
                                materialOwners.map((owner) => (
                                    <tr key={owner.Material_Owner_id}>
                                        <td>{owner.Material_Owner_id}</td>
                                        <td>{owner.material_owner_person_id__person_name}</td>
                                        <td>{owner.Material_Owner_status ? 'Active' : 'Inactive'}</td>
                                        <td>{owner.Material_Owner_location}</td>
                                        <td>{owner.Material_Owner_details}</td>
                                        <td>
                                        <i
                                            className="fa-regular fa-pen-to-square"
                                            onClick={() => editownerdata(owner)}
                                        ></i>
                                           
                                        </td>
                                        <td>
                                        <i
                                                className="fa-regular fa-trash-can"
                                                onClick={() => openDeleteModal(owner.Material_Owner_id)}
                                            ></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No material owners available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Add/Edit Material Owner */}
            <div className="modal fade" ref={modalRef}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{formData.Material_Owner_id ? 'Edit Material Owner' : 'Add Material Owner'}</h5>
                            <button type="button" className="btn-close" onClick={closeModal}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                            <Select
                  options={personoptions}
                  value={personoptions.find((option) => option.value === formData.person_id)}
                  onChange={handlePersonChange}
                  placeholder="વ્યક્તિ*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Location"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <textarea
                                        name="details"
                                        value={formData.details}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Details"
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="status"
                                            checked={formData.status}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label">Active</label>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <div className="modal fade" ref={deleteModalRef}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Delete Material Owner</h5>
                            <button type="button" className="btn-close" onClick={closeDeleteModal}></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this material owner?
                            <div className="mt-2">
                                <button type="button" className="btn btn-danger" onClick={() => deleteData(deleteId)}>Delete</button>
                                <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MaterialOwners;