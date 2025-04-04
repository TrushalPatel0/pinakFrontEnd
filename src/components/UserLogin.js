import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { backendurl } from './backend_url';

const UserLogin = () => {
  const urll = backendurl();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_email: "",
    user_password: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${urll}user_login/`, formData);
      setMessage(response.data.message);
      navigate('/banks/');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setMessage("");
    }
  };

 

  return (
    <div className="container mt-5">
      <div className="mb-2 flex justify-center items-center">
            <img
              src="/static/pinak enterprise gujrati logo_page-0001.jpg"
              alt="Logo"
              className="w-40 rounded-full"
            />
    </div>
      <h3 className="text-center">User Login</h3>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="mb-3">
          <label htmlFor="user_email" className="form-label">Email:</label>
          <input
            type="email"
            name="user_email"
            value={formData.user_email}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="user_password" className="form-label">Password:</label>
          <input
            type="password"
            name="user_password"
            value={formData.user_password}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
   
  );
};

export default UserLogin;