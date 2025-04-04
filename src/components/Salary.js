import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import Person_insert from "./insert_update/person_insert";
import Select from 'react-select';
import { backendurl } from './backend_url';



const Salary = () => {
  const urll = backendurl();

  const [Salary, setSalary] = useState([]);
  const [TotalSalaryAmount, setTotalSalaryAmount] = useState([]);
  const [worktypes, setworktypes] = useState([]);
  const [MoneyTransaction, setMoneyTransaction] = useState([]);
  const [TotalAmount, setTotalAmount] = useState(0);
  const [PersonsData, setPersonsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const modalRef = useRef();
  const deletemodel = useRef();
  const [delid, setdelid] = useState("");
  const [Messages, setMessages] = useState("");


  // ====================================filter person in salary ============================================
  const [ReceiverPersonId, setReceiverPersonId] = useState({ person_id: '' });
  const handleReceiverChange = async (selectedOption) => {
    const newReceiverId = selectedOption ? selectedOption.value : "";
    setReceiverPersonId({ person_id: newReceiverId }); // Update the state

    try {
      fetchSalary(newReceiverId)
    } catch (error) {
      console.error("Error fetching money debit/credit data:", error);
    }
  };
  const receiver_options = [
    { value: "null", label: "વ્યક્તિ" },
    ...PersonsData.map((type) => ({
      value: type.person_id,
      label: `${type.person_name} (${type.person_contact_number})`,
    })),
  ];

  // ====================================End filter person in salary ============================================

  const personsoptions = PersonsData.map((x) => ({
    value: x.person_id,
    label: `${x.person_name} (${x.person_contact_number})`,
  }));




  const handlePersonChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      person_id: selectedOption ? selectedOption.value : "", // Update person_id here
    }));
  };

  useEffect(() => {
    const total = MoneyTransaction.reduce(
      (sum, transaction) => sum + parseFloat(transaction.money_amount || 0),
      0
    );
    setTotalAmount(total);
  }, [MoneyTransaction]);

  useEffect(() => {
    const total = Salary.reduce(
      (sum, sal) => sum + parseFloat(sal.salary_amount || 0),
      0

    );
    setTotalSalaryAmount(total);
  }, [Salary]);


  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    salary_id: "",
    salary_date: "",
    salary_amount: "",
    salary_working_days: "",
    salary_details: "",
    person_id: "",
    work_type: "",
  });

  // Fetch machine details
  const fetchSalary = async (person_id = null) => {
    try {
      const response = await axios.get(`${urll}show_salary/?person_id=${person_id}`);
      setSalary(response.data.data || []);
      setworktypes(response.data.worktypes || []);
      setMoneyTransaction(response.data.money_data || []);
      console.log(response.data.money_data)
      setPersonsData(response.data.persons_data || []);
      setTitle(response.data.title);
      setLoading(false);
    } catch (err) {
      setError("Failed to load machine details");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary();
  }, []);

  useEffect(() => {
    if (Messages) {
      const timer = setTimeout(() => {
        setMessages(""); // Clear success message after 3 seconds
      }, 3000); // 3000 milliseconds = 3 seconds

      // Cleanup the timer if the component is unmounted or successMessage changes
      return () => clearTimeout(timer);
    }
  }, [Messages]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission for Add/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${urll}insert_update_salary/`,
        formData
      );
      if (response.status === 200) {
        alert("Salary details saved successfully!");
        fetchSalary(); // Reload data
        closeModal();
        resetForm();
      } else {
        alert("Failed to save salary details.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error occurred while saving salary details.");
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
        `${urll}insert_update_salary/?getdata_id=${id}`
      );
      setFormData(response.data.data);
      openModal();
    } catch (err) {
      setError("Failed to load salary details");
    }
  };

  const deleteData = async (id) => {
    try {
      const response = await axios.delete(
        `${urll}delete_salary/?salary_id=${id}`
      );
      setMessages(response.data.message);
      fetchSalary();
      closedeleteModal();
    } catch (err) {
      setError("Failed to delete document type data");
    }
  };

  const resetForm = () => {
    setFormData({
      salary_id: "",
      salary_date: "",
      salary_amount: "",
      salary_working_days: "",
      salary_details: "",
      person_id: "", // Reset person_id
      work_type: "",
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
        {Messages && (
          <div
            class="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            {Messages}
          </div>
        )}
        <h5 className="text-1xl font-extrabold text-black-600 decoration-dashed tracking-wide">
          સેલરી ડિટેલ્સ
        </h5>

        <button
          type="button"
          className="btn btn-sm mb-3 btn-primary mt-2"
          onClick={openModal}
        >
          સેલરી ઊમેરો
        </button>

        <div className="w-100 md:w-25 mb-3"><Select
          options={receiver_options}
          value={receiver_options.find((option) => option.value === ReceiverPersonId.person_id) || null}
          onChange={handleReceiverChange}
          placeholder="વ્યક્તિ"
          isSearchable
          isClearable
          className="react-select-container"
          classNamePrefix="react-select"
        /></div>
        <div className="grid grid-cols-2 md:grid-cols-6  gap-3 mb-3">

          <div className="card cardbg3">
            <div className="text-yellow-500 font-bold">ટોટલ આપવાનો પગાર</div>
            <div className="text-yellow-500 font-bold"><i class="fa-solid fa-indian-rupee-sign"></i> {TotalSalaryAmount}</div>
          </div>

          <div className="card cardbg3">
            <div className="text-green-500 font-bold">ટોટલ ચૂકવેલ પગાર</div>
            <div className="text-green-500 font-bold"><i class="fa-solid fa-indian-rupee-sign"></i> {TotalAmount}</div>
          </div>

          <div className="card cardbg3">
            <div className="text-red-500 font-bold">ટોટલ ચુકવણી રકમ</div>
            <div className="text-red-500 font-bold"><i class="fa-solid fa-indian-rupee-sign"></i> {TotalSalaryAmount - TotalAmount}</div>
          </div>


        </div>




        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-3">
          <div className="card">
            <h6>ચૂકવવાનો પગાર</h6>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ક્રમ</th>
                    <th>નામ</th>
                    <th>તારીખ</th>
                    <th>દિવસ</th>
                    <th>ચૂકવવાનો પગાર</th>
                    <th>પગાર</th>
                    <th>ડીટેલ</th>
                    <th>અપડેટ</th>
                    <th>ડિલીટ</th>
                  </tr>
                </thead>
                <tbody>
                  {Salary.length > 0 ? (
                    Salary.map((salary, index) => (
                      <tr key={salary.salary_id}>
                        <td>{index + 1}</td>
                        <td>{salary.person_id__person_name || "N/A"} [{salary.person_id__person_contact_number}]</td>
                        <td>{salary.salary_date || "N/A"}</td>
                        <td>{salary.salary_working_days || "N/A"}</td>
                        <td>{salary.salary_amount || "N/A"}</td>
                        <td>{salary.person_id__person_salary || "N/A"}</td>
                        <td>{salary.salary_details || "N/A"}</td>
                        <td>
                          <i
                            className="fa-regular fa-pen-to-square"
                            onClick={() => editDetailsGetData(salary.salary_id)}
                          ></i>
                        </td>
                        <td>
                          <i
                            class="fa-regular fa-trash-can"
                            onClick={() => opendeleteModal(salary.salary_id)}
                          ></i>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">ડેટા અવાઈલેબલ નથી..</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>


          <div className="card">
            <h6>ચૂકવેલ પગાર</h6>
            <div className="table-responsive">

              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ક્રમ</th>
                    <th>નામ</th>
                    <th>તારીખ</th>
                    <th>અમાઉન્ટ</th>
                    <th>મોડ</th>
                    <th>ડીટેલ</th>
                  </tr>
                </thead>
                <tbody>
                  {MoneyTransaction.length > 0 ? (
                    MoneyTransaction.map((x, index) => (
                      <tr key={x.money_id}>
                        <td>{index + 1}</td>
                        <td>{x.receiver_person_id__person_name || "N/A"} [{x.receiver_person_id__person_contact_number}]</td>
                        <td>{x.money_date || "N/A"}</td>
                        <td>{x.money_amount || "N/A"}</td>
                        <td>{x.money_payment_mode || "N/A"}</td>
                        <td>{x.money_payment_details || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">ડેટા અવાઈલેબલ નથી. </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>


      </div>

      {/* Modal for Add/Edit Machine */}
      <div
        className="modal fade"
        id="machineModal"
        tabIndex="-1"
        aria-labelledby="machineModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="machineModalLabel">
                {formData.machine_id ? "એડિટ કરો" : "સેલરી ઉમેરો"}
              </h5>
              <Person_insert fetchdata={fetchSalary} persontype='employee' />
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
                  options={personsoptions}
                  value={personsoptions.find((option) => option.value === formData.person_id) || null}
                  onChange={handlePersonChange}
                  placeholder="Select Person*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />

                <div className="grid grid-cols-2 gap-2">
                  <div className="mb-3">
                    <select
                      name="work_type"
                      value={formData.work_type}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">સિલેક્ટ કામ ના પ્રકાર*</option>
                      <option value="Fixed_Salary">ફિક્સ્ડ પગાર</option>
                      {worktypes.map((type) => (
                        <option
                          key={type.work_type_id}
                          value={type.work_type_id}
                        >
                          {type.work_type_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.work_type !== 'Fixed_Salary' && (
                    <div className="mb-3">
                      <input
                        type="number"
                        name="salary_amount"
                        value={formData.salary_amount}
                        onChange={handleChange}
                        placeholder="પગાર રકમ"
                        className="form-control"
                      />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    name="salary_working_days"
                    value={formData.salary_working_days}
                    onChange={handleChange}
                    placeholder="ભરેલા દિવસ"
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="date"
                    name="salary_date"
                    value={formData.salary_date}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    name="salary_details"
                    value={formData.salary_details}
                    onChange={handleChange}
                    placeholder="ડીટેલ"
                    className="form-control"
                  />
                </div>
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
                Delete Salary Data
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              are you sure You want to delete this data?
              <br />
              <div className="mt-2">
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => deleteData(delid)}
                >
                  Delete
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-primary ms-2"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Salary;
