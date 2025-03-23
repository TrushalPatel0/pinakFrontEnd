import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { backendurl } from '../backend_url';


function Office_kharch_types({fetchdata}) {
    const urll = backendurl();
    const modalRef = useRef();
    const [formData, setFormData] = useState({
        office_kharch_type_id: "",
        office_kharch_type_name: "",
      });

       // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for Add/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${urll}insert_update_office_kharch_types/`,
        formData
      );
      if (response.status === 200) {
        fetchdata()
        resetForm();
        closeModal();
      } else {
        alert("Failed to save Office Kharch types.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error occurred while Office Kharch types.");
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

  // Reset the form state
  const resetForm = () => {
    setFormData({
        office_kharch_type_id: "",
        office_kharch_type_name: "",
    });
  };

  return (
    <>
    <button type="button" className="btn btn-sm ms-2 btn-primary" style={{fontSize:'10px'}} onClick={openModal}>Add Office Kharch type
    </button>
    <div
        className="modal fade"
        id="office_kharch_types"
        tabIndex="-1"
        aria-labelledby="office_kharch_typeslabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog typesmodel">
          <div className="modal-content typesmodel">
            <div className="modal-header">
              <h5 className="modal-title" id="office_kharch_typeslabel">
                {formData.office_kharch_type_id ? "Edit Office Kharch Types" : "Add Office Kharch Types"}
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
                 <div className="mb-3">
                  <label className="form-label">Office Kharch Type Name:</label>
                  <input
                    type="text"
                    name="office_kharch_type_name"
                    value={formData.office_kharch_type_name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-sm mt-2 btn-primary">
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      </div></>
  )
}
export default Office_kharch_types