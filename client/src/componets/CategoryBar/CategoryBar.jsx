import React from "react";
import "./CategoryBar.css";
import Button from "../Button/Button";
import { useFilter } from "../../context/FilterContext";
import { useNavigate } from "react-router-dom";
import CategorySidebar from "../CategorySidebar/CategorySidebar";

function CategoryBar({ isCategoryOpen, setIsCategoryOpen }) {
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
    <>
      <div className="category-bar">
        <div onClick={() => setIsCategoryOpen(true)}>
          <Button text="SHOP BY CATEGORIES" icon="fa-solid fa-bars" />
        </div>

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

        <div className="about-category-link" onClick={() => navigate("/about")}>
          <i className="fa-regular fa-user"></i>
          <span>About Us</span>
        </div>
      </div>

      <CategorySidebar
        isOpen={isCategoryOpen}
        onClose={() => setIsCategoryOpen(false)}
      />
    </>
  );
}

export default CategoryBar;
