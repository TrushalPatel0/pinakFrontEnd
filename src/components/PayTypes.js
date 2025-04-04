import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { backendurl } from './backend_url';

const PayTypes = () => {
  const urll = backendurl();
  const [payTypes, setPayTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // To store the title from the API response
  const modalRef = useRef();
  const deletemodel = useRef();
  const [delid,setdelid] = useState("");
  const [Messages, setMessages] = useState('');

  const [formData, setFormData] = useState({
    pay_type_id: "",
    pay_type_name: "",
  });

  // Fetch pay types from API
  const fetchPayTypes = async () => {
    try {
      const response = await axios.get(`${urll}show_pay_types/`);
      setPayTypes(response.data.data || []);
      setTitle(response.data.title);
      setLoading(false);
    } catch (err) {
      setError("Failed to load pay types data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayTypes();
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
        alert("Pay type saved successfully!");
        fetchPayTypes(); // Reload data
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

  // Fetch data for editing a specific pay type
  const editDetailsGetData = async (id) => {
    try {
      const response = await axios.get(
        `${urll}insert_update_pay_type/?getdata_id=${id}`
      );
      setFormData(response.data.data);
      openModal();
    } catch (err) {
      setError("Failed to load pay type details");
    }
  };

  const deleteData = async (id) => {
    try{
      const response = await axios.delete(
        `${urll}delete_pay_type/?pay_type_id=${id}`
      );
      setMessages(response.data.message)
      fetchPayTypes();
      closedeleteModal();
    } catch (err){
      setError("Failed to delete document type data")
    }
  }

  // Reset the form state
  const resetForm = () => {
    setFormData({
      pay_type_id: "",
      pay_type_name: "",
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

  // Render the pay types table
  return (
    <>
      <div>
      {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
        <h1>{title}</h1> {/* Display the title */}
        <button type="button" className="btn btn-primary" onClick={openModal}>
          Add Pay Type
        </button>
        <table
          border="1"
          style={{ width: "100%", textAlign: "left", marginTop: "20px" }}
        >
          <thead>
            <tr>
              <th>Pay Type ID</th>
              <th>Pay Type Name</th>
              <th>Update</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {payTypes.length > 0 ? (
              payTypes.map((payType) => (
                <tr key={payType.pay_type_id}>
                  <td>{payType.pay_type_id || "N/A"}</td>
                  <td>{payType.pay_type_name || "N/A"}</td>
                  <td>
                    <i
                      className="fa-regular fa-pen-to-square"
                      onClick={() => editDetailsGetData(payType.pay_type_id)}
                    ></i>
                  </td>
                  <td><i class="fa-regular fa-trash-can" onClick={() => opendeleteModal(payType.pay_type_id)}></i></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No pay types available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Pay Type */}
      <div
        className="modal fade"
        id="payTypeModal"
        tabIndex="-1"
        aria-labelledby="payTypeModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
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
                  <input
                    type="text"
                    name="pay_type_name"
                    value={formData.pay_type_name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Pay Type Name*"
                    required
                  />
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
                Delete Pay-Type Data
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              are you sure You want to delete this data?<br/>
            
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

export default PayTypes;