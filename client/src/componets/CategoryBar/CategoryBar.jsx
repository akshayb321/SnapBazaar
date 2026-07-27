import React, { useState } from "react";
import "./CategoryBar.css";
import Button from "../Button/Button";

function CategoryBar() {
  return (
    <div className="category-bar">
      <Button text="SHOP BY CATEGORIES" icon="fa-solid fa-bars" />

      <ul className="category-list">
        <li>
          <a href="/home">Home</a>
        </li>
        <li>
          <a href="#">Fashion</a>
        </li>
        <li>
          <a href="#">Bags</a>
        </li>
        <li>
          <a href="#">Footwear</a>
        </li>
        <li>
          <a href="#">Groceries</a>
        </li>
        <li>
          <a href="#">Wellness</a>
        </li>
        <li>
          <a href="#">Jewellery</a>
        </li>
        <li>
          <a href="#">Beauty</a>
        </li>
        <li>
          <a href="#">Electronics</a>
        </li>
      </ul>

      <div className="delivery">
        <i className="fa-solid fa-plane"></i>
        <span>Free International Delivery</span>
      </div>
    </div>
  );
}

export default CategoryBar;
