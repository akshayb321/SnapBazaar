import React from "react";
import "./Special.css";

function Special() {
  return (
    <div className="Main-container">
      <div className="special">
        <div className="first">
          <i className="fa-solid fa-truck"></i>
          <p>FREE SHIPPING</p>
        </div>
        <div className="sec">
          <p>Free Delivery Now On Your First Order and over ₹499</p>
        </div>
        <div className="last">- Only ₹499*</div>
      </div>
    </div>
  );
}

export default Special;
