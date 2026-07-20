import React, { useState } from "react";
import "./CategoryBar.css";
import Button from "../Button/Button";

function CategoryBar() {
  return (
    <div className="category-bar">
      <Button text="SHOP BY CATEGORIES" icon="fa-solid fa-bars" />

      <ul className="category-list">
        <li>Home</li>
        <li>Fashion</li>
        <li>Bags</li>
        <li>Footwear</li>
        <li>Groceries</li>
        <li>Wellness</li>
        <li>Jewellery</li>
        <li>Beauty</li>
        <li>Electronics</li>
      </ul>

      <div className="delivery">
        <i className="fa-solid fa-plane"></i>
        <span>Free International Delivery</span>
      </div>
    </div>
  );
}

export default CategoryBar;
