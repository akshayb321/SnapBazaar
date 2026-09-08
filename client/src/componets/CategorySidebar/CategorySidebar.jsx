import React from "react";
import "./CategorySidebar.css";
import { useFilter } from "../../context/FilterContext";
import { useNavigate } from "react-router-dom";

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

function CategorySidebar({ isOpen, onClose }) {
  const { setCategory } = useFilter();
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    setCategory(category);
    onClose();
    navigate("/products");
  };

  const handleAboutClick = () => {
    onClose();
    navigate("/about");
  };

  return (
    <>
      <div
        className={`category-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      ></div>

      <aside className={`category-sidebar ${isOpen ? "open" : ""}`}>
        <div className="category-logo">
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784701614/logo.png"
            alt="Logo"
          />
        </div>

        <div className="category-heading">
          <h2>Shop By Categories</h2>

          <button className="category-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="sidebar-list">
          {categories.map((category) => (
            <div
              className="category-item"
              key={category}
              onClick={() => handleCategoryClick(category)}
            >
              <span>{category}</span>
            </div>
          ))}

          <div className="about-sidebar-item" onClick={handleAboutClick}>
            <div className="about-sidebar-icon">
              <i className="fa-solid fa-user"></i>
            </div>

            <div className="about-sidebar-content">
              <span>About Us</span>
              <small>Meet the developer</small>
            </div>

            <i className="fa-solid fa-arrow-right about-sidebar-arrow"></i>
          </div>
        </div>
      </aside>
    </>
  );
}

export default CategorySidebar;
