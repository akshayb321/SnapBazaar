import React, { useState } from "react";
import "./CategoryBar.css";
import Button from "../Button/Button";
import { useFilter } from "../../context/FilterContext";
import { useNavigate } from "react-router-dom";

function CategoryBar() {
  const { setCategory } = useFilter();
  const navigate = useNavigate();
  const categories = [
    "Fashion",
    "Bags",
    "Footwear",
    "Groceries",
    "Wellness",
    "Jewellery",
    "Beauty",
    "Electronics",
  ];
  return (
    <div className="category-bar">
      <Button text="SHOP BY CATEGORIES" icon="fa-solid fa-bars" />

      <ul className="category-list">
        <li
          onClick={() => {
            setCategory("All");
            navigate("/home");
          }}
        >
          Home
        </li>
        {categories.map((category) => (
          <li
            key={category}
            onClick={() => {
              setCategory(category);
              navigate("/products");
            }}
          >
            {category}
          </li>
        ))}
      </ul>

      <div className="delivery">
        <i className="fa-solid fa-plane"></i>
        <span>Free International Delivery</span>
      </div>
    </div>
  );
}

export default CategoryBar;
