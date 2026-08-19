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

  return (
    <>
      {/* Overlay */}
      <div
        className={`category-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <aside className={`category-sidebar ${isOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="category-logo">
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784701614/logo.png"
            alt="Logo"
          />
        </div>

        {/* Heading */}
        <div className="category-heading">
          <h2>Shop By Categories</h2>

          <button className="category-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Categories */}
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
        </div>
      </aside>
    </>
  );
}

export default CategorySidebar;
