import React from "react";
import "./Special2.css";
import { useFilter } from "../../../context/FilterContext.jsx";
import { useNavigate } from "react-router-dom";

function Special2() {
  const navigate = useNavigate();
  const { setCategory } = useFilter();
  return (
    <div className="Main-container">
      <div
        className="sub-container"
        onClick={() => {
          setCategory("Electronics");
          navigate("/products");
        }}
      >
        <img
          src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784656370/offer2.webp"
          alt=""
        />
      </div>
      <div
        className="sub-container"
        onClick={() => {
          setCategory("Fashion");
          navigate("/products");
        }}
      >
        <img
          src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784656370/offer3.webp"
          alt=""
        />
      </div>
      <div
        className="sub-container"
        onClick={() => {
          setCategory("Groceries");
          navigate("/products");
        }}
      >
        <img
          src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784656370/offer1.webp"
          alt=""
        />
      </div>
      <div
        className="sub-container"
        onClick={() => {
          setCategory("Groceries");
          navigate("/products");
        }}
      >
        <img
          src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784656371/offer4.jpg"
          alt=""
        />
      </div>
    </div>
  );
}

export default Special2;
