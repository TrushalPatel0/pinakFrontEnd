import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { backendurl } from '../backend_url';


function Pay_types_insert({fetchdata}) {
    const urll = backendurl();
    const modalRef = useRef();
    const [formData, setFormData] = useState({
        pay_type_id: "",
        pay_type_name: "",
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
        `${urll}insert_update_pay_type/`,
        formData
      );
      if (response.status === 200) {
        fetchdata()
        resetForm();
        closeModal();
      } else {
        alert("Failed to save pay type.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error occurred while saving pay type.");
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
        pay_type_id: "",
        pay_type_name: "",
    });
  };

  return (
    <>
    <button type="button" className="btn btn-sm ms-2 btn-primary" onClick={openModal}>Add Pay Type
    </button>
    <div
        className="modal fade"
        id="payTypeModal"
        tabIndex="-1"
        aria-labelledby="payTypeModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog typesmodel">
          <div className="modal-content typesmodel">
            <div className="modal-header">
              <h5 className="modal-title" id="payTypeModalLabel">
                {formData.pay_type_id ? "Edit Pay Type" : "Add Pay Type"}
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
                  <label className="form-label">Pay Type Name:</label>
                  <input
                    type="text"
                    name="pay_type_name"
                    value={formData.pay_type_name}
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
export default Pay_types_insert