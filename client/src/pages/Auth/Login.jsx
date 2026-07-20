import React, { useState } from "react";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate("");
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
      );
      //save token in local storage

      localStorage.setItem("token", response.data.jwtToken);
      setUser(response.data.user);

      toast.success(response.data.message);
      navigate("/home", { state: response.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <form onSubmit={submitData}>
          <h2>LOGIN</h2>

          <div className="inp">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="inp">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="inp">
            <button type="submit">Login</button>
          </div>
          <div className="signupLink">
            <p>Dont have an account?</p>
            <Link to="/signup" className="link">
              Signup here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
