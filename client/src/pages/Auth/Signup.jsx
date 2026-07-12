import React, { useState } from 'react'
import "./Auth.css"
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from "axios";



function Signup() {
  const navigate =useNavigate();

  const [formData,setFormData] =useState({
    name:"",
    email:"",
    password:""
  });

  const handleChange=(e)=>{
const {name,value} =e.target;

    setFormData((prev)=>({
      ...prev,
      [name]:value,
    }))
  }

  const submitData=async(e)=>{
    e.preventDefault();

    try {
      const response =await axios.post("http://localhost:8000/api/auth/signup", {
        name:formData.name,
        email:formData.email,
        password:formData.password
      });
      toast.success(response.data.message);
      navigate("/login");
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    
  }

  return (

    <div className="login-page">
    <div className="container">
      <form onSubmit={submitData}>
      <h2>SIGN-UP</h2>
      <div className="inp">
        <label htmlFor="name">Name:</label>
      
        <input type="text" name="name" id="name" placeholder="Enter name" value={formData.name} onChange={handleChange}/>
      </div>
      <div className="inp">
        <label htmlFor="email">Email:</label>
        <input type="text" name="email" id="email" placeholder="Enter email" value={formData.email} onChange={handleChange}/>
      </div>
      <div className="inp">
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" id="password" placeholder="Enter password" value={formData.password} onChange={handleChange}/>
      </div>
      <div className="inp">
        <button type='submit'>SignUp</button>
      </div>
      <div className="signupLink">
        <p>Already have an account?</p>
      <Link to="/login" className='link'>Login here</Link>
      </div>
      </form>

    </div>
    </div>
  )
}

export default Signup