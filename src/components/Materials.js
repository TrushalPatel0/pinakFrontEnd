import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';
import Material_types_insert from './insert_update/material_types_insert';
import Person_insert from './insert_update/person_insert';
import Work_types_insert from './insert_update/work_types_insert';
import Select from 'react-select';
import { backendurl } from './backend_url';
import ManageMaterialOwners from "./material_owner";


import { Link } from 'react-router-dom';

const Materials = () => {
    const urll = backendurl();
  const [materials, setMaterials] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [Persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // State to store the title
  const modalRef = useRef();
  const deletemodel = useRef();
  const [delid, setdelid] = useState("");
  const [Messages, setMessages] = useState('');
  const [workTypes, setWorkTypes] = useState([]);

  const personoptions = Persons.map((x) => ({
    value: x.person_id,
    label: `${x.person_name} (${x.person_contact_number})`,
  }));

  const handlePersonChange = (selectedOption) => {
    setFormData({
      ...formData,
      material_owner: selectedOption ? selectedOption.value : "",
    });
  };


  const [formData, setFormData] = useState({
    'material_id': '',
    'material_type_id': "",
    'material_owner': "",
    'material_status': true,
    'material_buy_date': "",
    'material_buy_location': "",
    'material_work_type': "",
    'material_work_no': "",
    'material_price': "",
    'material_total_price': "",
    'material_is_agent': false,
    'material_agent_person': null,
    'material_agent_name': "",
    'material_agent_contact': "",
    'material_agent_price_choice': "",
    'material_agent_percentage': "",
    'material_agent_amount': "",
    'material_final_amount': "",
    'material_details': "",

  });


  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${urll}show_materials/`);
      setMaterials(response.data.data || []);
      setMaterialTypes(response.data.material_types_data || []);
      setPersons(response.data.perons || []);
      setWorkTypes(response.data.work_types_data || []);
      setTitle(response.data.title)
      setLoading(false);
    } catch (err) {
      setError('Failed to load material details');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
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
        `${urll}insert_update_material/`,
        formData
      );
      if (response.status === 200) {
        alert(response.data.message);
        fetchMaterials();
        resetForm();
        closeModal();
      } else {
        alert('Failed to save material details.');
      }
    } catch (err) {
      alert('Error occurred while saving material details.');
    }
  };

  const editMaterial = async (id) => {
    try {
      const response = await axios.get(
        `${urll}insert_update_material/?getdata_id=${id}`
      );
      setFormData(response.data.data);
      openModal();
    } catch (err) {
      alert('Failed to load material details');
    }
  };

  const resetForm = () => {
    setFormData({
      'material_id': '',
      'material_type_id': "",
      'material_owner': "",
      'material_status': true,
      'material_buy_date': "",
      'material_buy_location': "",
      'material_work_type': "",
      'material_work_no': "",
      'material_price': "",
      'material_total_price': "",
      'material_is_agent': false,
      'material_agent_person': null,
      'material_agent_name': "",
      'material_agent_contact': "",
      'material_agent_price_choice': "",
      'material_agent_percentage': "",
      'material_agent_amount': "",
      'material_final_amount': "",
      'material_details': "",
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

  const opendeleteModal = (id) => {
    const modalInstance = new Modal(deletemodel.current);
    setdelid(id);
    modalInstance.show();

  };

  const deleteData = async (id) => {
    try {
      const response = await axios.delete(
        `${urll}delete_material/?material_id=${id}`
      );
      setMessages(response.data.message)
      fetchMaterials();
      closedeleteModal();
    } catch (err) {
      setError("Failed to delete document type data")
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

      <ManageMaterialOwners />
      <hr/>
      <div>
        {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
        <h5 className="text-1xl font-extrabold text-black-600 decoration-dashed tracking-wide">મટિરિયલ ડેટા</h5>
        <div className="d-flex align-items-center mb-3 mt-3">
          <Link to="/material-types"><img
            src="/static/icons/material_type.png"
            alt="User Icon"
            style={{ height: "30px", width: "auto" }} // Ensure consistent height
          /></Link>
          <button
            type="button"
            className="btn btn-sm btn-primary ms-2"
            onClick={openModal}
            style={{ height: "30px" }} // Adjust the height as needed
          >
            મટિરિયલ ઉમેરો
          </button>

          <div className="input-group" style={{ height: "30px", width: "auto" }}>
            <input type="text" class="form-control ms-2" style={{ height: "30px", width: "100px" }} placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2" />
            <button className="btn btn-sm btn-outline-primary d-flex align-items-center" type="button" id="button-addon2" style={{ height: "30px", width: "auto" }}><i class="fa-solid fa-magnifying-glass"></i></button>
          </div>

        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ક્રમ</th>
                <th>મટિરિયલ પ્રકાર</th>
                <th>મટિરિયલ માલિક નું નામ</th>
                <th>ખરીદ તારીખ</th>
                <th>કામ પ્રકાર</th>
                <th>દલાલ છે?</th>
                <th>દલાલ નામ</th>
                <th>દલાલ પેમેન્ટ મોડ</th>
                <th>દલાલ ટકાવારી</th>
                <th>વિગત</th>
                <th>અપડેટ</th>
                <th>ડિલીટ</th>
              </tr>
            </thead>
            <tbody>
              {materials.length > 0 ? (
                materials.map((material, index) => (
                  <tr key={material.material_id}>
                    <td>{index + 1 || "N/A"}</td>
                    <td>{material.material_type_id__material_type_name || "N/A"}</td>
                    <td>{material.material_owner__person_name || "N/A"}</td>
                    <td>{material.material_buy_date || "N/A"}</td>
                    <td>{material.material_work_type__work_type_name || "N/A"}</td>
                    <td>{material.material_is_agent ? "Yes" : "No"}</td>
                    <td>{material.material_agent_name || "N/A"} [{material.material_agent_contact}]</td>
                    <td>{material.material_agent_price_choice || "N/A"}</td>
                    <td>{material.material_agent_percentage || "N/A"}</td>
                    <td>{material.material_details || "N/A"}</td>
                    <td>
                      <i
                        className="fa-regular fa-pen-to-square"
                        onClick={() => editMaterial(material.material_id)}
                      ></i>
                    </td>
                    <td>
                      <i
                        className="fa-regular fa-trash-can"
                        onClick={() => opendeleteModal(material.material_id)}
                      ></i>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="21" style={{ textAlign: "center" }}>
                    ડેટા અવઈલેબલ નથી. 
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                {formData.material_id ? 'એડિટ મટિરિયલ' : 'મટિરિયલ ઉમેરો'}
              </h5>

              <Material_types_insert fetchdata={fetchMaterials} />
              <Person_insert fetchdata={fetchMaterials} />
              <Work_types_insert fetchdata={fetchMaterials} />

              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <select
                    name="material_type_id"
                    value={formData.material_type_id}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">મટિરિયલ પ્રકાર*</option>
                    {materialTypes.map((type) => (
                      <option key={type.material_type_id} value={type.material_type_id}>
                        {type.material_type_name}
                      </option>
                    ))}
                  </select>
                </div>

                <Select
                  options={personoptions}
                  value={personoptions.find((option) => option.value === formData.material_owner)}
                  onChange={handlePersonChange}
                  placeholder="વ્યક્તિ*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />

            

                <div className="mb-3">
                  <label>ખરીદ તારીખ:</label>
                  <input
                    type="date"
                    name="material_buy_date"
                    value={formData.material_buy_date}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>


                <div className="mb-3">
                  <select
                    name="material_work_type"
                    value={formData.material_work_type}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">કામ પ્રકાર*</option>
                    {workTypes.map((work) => (
                      <option key={work.work_type_id} value={work.work_type_id}>
                        {work.work_type_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    name="material_work_no"
                    value={formData.material_work_no}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="કામ*"
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    name="material_price"
                    value={formData.material_price}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="ભાવ*"
                    required
                  />
                </div>


                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      onChange={(e) =>
                        handleChange({
                          target: { name: "material_is_agent", value: e.target.checked },
                        })
                      }
                      checked={formData.material_is_agent}
                      name="material_is_agent"
                      type="checkbox"
                      id="isAgent"
                    />
                    <label className="form-check-label" htmlFor="isAgent">
                      દલાલ છે?
                    </label>
                  </div>
                </div>


                {formData.material_is_agent === true && (
                  <>
                    
                    <div className="mb-3">
                      <select name="material_agent_person"
                        value={formData.material_agent_person} onChange={handleChange} className="form-select">
                        <option value=''>દલાલ નું નામ</option>
                        {Persons.map((pers) => (
                      <option key={pers.person_id} value={pers.person_id}>
                        {pers.person_name} ({pers.person_contact_number})
                      </option>
                    ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <select name="material_agent_price_choice"
                        value={formData.material_agent_price_choice} onChange={handleChange} className="form-select">
                        <option value=''>દલાલ પેમેન્ટ મેથડ</option>
                        <option value='Discount'>ટકાવારી પર</option>
                        <option value='Fixed_Amount'>ફિક્સ્ડ રકમ પર</option>
                      </select>
                    </div>

                    {formData.material_agent_price_choice === 'Discount' && (
                      <div className="mb-3">
                        <input
                          type="number"
                          name="material_agent_percentage"
                          value={formData.material_agent_percentage}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="દલાલ ટકાવારી"
                        />
                      </div>
                    )}

                    {formData.material_agent_price_choice === 'Fixed_Amount' && (
                      <div className="mb-3">
                        <input
                          type="text"
                          name="material_agent_amount"
                          value={formData.material_agent_amount}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="રકમ"
                        />
                      </div>
                    )}
                  </>
                )}



                <div className="mb-3">
                  <textarea
                    name="material_details"
                    value={formData.material_details}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="વિગત"
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

export default Materials;
