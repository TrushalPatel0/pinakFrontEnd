import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import Select from "react-select";
import { backendurl } from "../backend_url";

const DateUserContext = createContext();

// Context Provider
export const DateUserProvider = ({ children }) => {
  const url = backendurl()
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userId, setUserId] = useState(1);
  const [personsList, setPersonsList] = useState([]);

  const [machinesList, setmachinesList] = useState([]);
  const [machineID, setMachineID] = useState(1);

  // Dummy user data for react-select
  const users = personsList.map((person) => ({
    value: person.person_id,
    label: person.person_name
  }))

  const machines = machinesList.map((machine) => ({
    value: machine.machine_id,
    label: machine.machine_name + ' ' + machine.machine_number_plate
  }))
  
  


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



  return (
    <DateUserContext.Provider value={{ startDate, setStartDate, endDate, setEndDate, userId, setUserId, users, machineID,
    setMachineID,
      machines }}>
      {children}
    </DateUserContext.Provider>
  );
};

// Custom hook to use context
export const useDate = () => useContext(DateUserContext);
export const useUser = () => useContext(DateUserContext);
export const useMachine = () => useContext(DateUserContext);

// DateUserSelection Component
export const DateSelection = () => {
  const { startDate, setStartDate, endDate, setEndDate } = useDate();

  return (
    <div style={{ padding: "10px", maxWidth: "400px", margin: "auto" }}>
      <h2>Select Date</h2>
      
      {/* Start Date */}
      <label>Start Date:</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "10px", padding: "5px" }}
      />

      {/* End Date */}
      <label>End Date:</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "10px", padding: "5px" }}
      />
    </div>
  );
};


export const UserSelection = () => {
  const { userId, setUserId, users } = useUser();

    return (
      <div style={{ padding: "10px", maxWidth: "300px"}}>  
        {/* User Selection */}
        <label>Select User:</label>
        <Select
          options={users}
          value={users.find((user) => user.value === userId)}
          onChange={(selectedOption) => setUserId(selectedOption.value)}
        />
      </div>
    );
  };


export const MachineSelection = () => {
  const { machineID, setMachineID, machines } = useMachine();

  return (
    <div style={{ padding: "10px", maxWidth: "300px" }}>
      <label>Select Machine:</label>
      <Select
        options={machines}
        value={machines.find((machine) => machine.value === machineID)}
        onChange={(selectedOption) => setMachineID(selectedOption.value)}
      />
    </div>
  );
};