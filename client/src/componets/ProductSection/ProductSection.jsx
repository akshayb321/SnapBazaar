import React, { useState } from "react";
import "./ProductSection.css";
import Button from "../Button/Button";

function ProductSection({
  title,
  products,
  showCategories = false,
  categories = [],
  selectedCategory,
  setSelectedCategory,
}) {
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((item) => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  return (
    <section className="product-section">
      <div className="section-header">
        <h2>{title}</h2>

        {showCategories && (
          <div className="section-categories">
            {categories.map((item) => (
              <button
                key={item}
                className={selectedCategory === item ? "active" : ""}
                onClick={() => setSelectedCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        <Button
          text={"View All"}
          className="view-all-btn"
          icon2={"fa-solid fa-arrow-right"}
        />
      </div>

      <div className="product-grid">
        {products.slice(0, 6).map((product) => (
          <div className="product-card" key={product._id}>
            {/* Discount */}
            <span className="discount">-{product.discount || 20}%</span>

            {/* Wishlist */}
            <button
              className={`wishlist-btn ${
                wishlist.includes(product._id) ? "active" : ""
              }`}
              onClick={() => toggleWishlist(product._id)}
            >
              <i
                className={
                  wishlist.includes(product._id)
                    ? "fa-solid fa-heart"
                    : "fa-regular fa-heart"
                }
              ></i>
            </button>

            {/* Images */}
            <div className="product-image">
              <img
                src={product.image[0]}
                alt={product.title}
                className="main-image"
              />

              <img
                src={product.image[1]}
                alt={product.title}
                className="hover-image"
              />
            </div>

            {/* Product Info */}
            <div className="product-info">
              <p className="company">{product.brand || "SNAPBAZAAR"}</p>

              <h3>
                {product.title.length > 19
                  ? `${product.title.substring(0, 19)}...`
                  : product.title}
              </h3>

              <div className="rating-box">
                <span className="rating">★★★★☆</span>
                <span className="rating-count">(142)</span>
              </div>

              <div className="price-box">
                <span className="new-price">₹{product.price}</span>

                <span className="old-price">
                  ₹{product.oldPrice || product.price + 400}
                </span>
              </div>

              <Button
                text={"Add To Cart"}
                icon={"fa-solid fa-cart-shopping"}
                className={"Pro-cart-btn"}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductSection;
