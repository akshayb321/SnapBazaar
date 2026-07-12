import React from 'react'
import "./Home.css"
import { useLocation, useNavigate } from 'react-router-dom'

function Home() {

    const navigate =useNavigate();
    const location =useLocation();
     //just for functional check
    
     const logoutFunction =()=>{
    navigate("/");
  }
  return (
    <div className='home'>
        <img src="https://png.pngtree.com/png-vector/20250922/ourmid/pngtree-cute-robot-waving-hello-friendly-png-image_17543901.webp" alt="" />
        <h2>Hi {location.state.name}</h2>
        <button  onClick={logoutFunction}>Logout</button>
    </div>
  )
}

export default Home