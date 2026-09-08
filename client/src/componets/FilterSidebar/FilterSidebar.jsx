import React from "react";
import "./FilterSidebar.css";

function FilterSidebar({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  price,
  setPrice,
  rating,
  setRating,
  clearFilters,
}) {
  return (
    <aside className="filter-sidebar">
      {/* =========================
          HEADER
      ========================= */}

      <div className="filter-header">
        <h3>Filters</h3>

        <button
          type="button"
          className="clear-filter-btn"
          onClick={clearFilters}
        >
          Clear
        </button>
      </div>

      {/* =========================
          CATEGORY
      ========================= */}

      <div className="filter-section">
        <h4>Category</h4>

        {categories.map((item) => (
          <label className="filter-option" key={item}>
            <input
              type="checkbox"
              checked={selectedCategory === item}
              onChange={(e) => {
                setSelectedCategory(e.target.checked ? item : "");
              }}
            />

            <span>{item}</span>
          </label>
        ))}
      </div>

      {/* =========================
          PRICE
      ========================= */}

      <div className="filter-section">
        <h4>Price Range</h4>

        <div className="price-values">
          <span>₹0</span>
          <span>₹{price}</span>
        </div>

        <input
          type="range"
          min="0"
          max="100000"
          step="500"
          value={price}
          onChange={(e) => {
            setPrice(Number(e.target.value));
          }}
          className="price-slider"
        />
      </div>

      {/* =========================
          RATING
      ========================= */}

      <div className="filter-section">
        <h4>Rating</h4>

        {/* 1 STAR */}

        <label className="filter-option">
          <input
            type="checkbox"
            checked={rating === "1"}
            onChange={(e) => {
              setRating(e.target.checked ? "1" : "");
            }}
          />

          <span>
            <span className="rating-stars">★</span>

            <span className="rating-text"> 1 Star</span>
          </span>
        </label>

        {/* 2 STARS */}

        <label className="filter-option">
          <input
            type="checkbox"
            checked={rating === "2"}
            onChange={(e) => {
              setRating(e.target.checked ? "2" : "");
            }}
          />

          <span>
            <span className="rating-stars">★★</span>

            <span className="rating-text"> 2 Stars</span>
          </span>
        </label>

        {/* 3 STARS */}

        <label className="filter-option">
          <input
            type="checkbox"
            checked={rating === "3"}
            onChange={(e) => {
              setRating(e.target.checked ? "3" : "");
            }}
          />

          <span>
            <span className="rating-stars">★★★</span>

            <span className="rating-text"> 3 Stars</span>
          </span>
        </label>

        {/* 4 STARS */}

        <label className="filter-option">
          <input
            type="checkbox"
            checked={rating === "4"}
            onChange={(e) => {
              setRating(e.target.checked ? "4" : "");
            }}
          />

          <span>
            <span className="rating-stars">★★★★</span>

            <span className="rating-text"> 4 Stars & above</span>
          </span>
        </label>

        {/* 5 STARS */}

        <label className="filter-option">
          <input
            type="checkbox"
            checked={rating === "5"}
            onChange={(e) => {
              setRating(e.target.checked ? "5" : "");
            }}
          />

          <span>
            <span className="rating-stars">★★★★★</span>

            <span className="rating-text"> 5 Stars</span>
          </span>
        </label>
      </div>
    </aside>
  );
}

export default FilterSidebar;
