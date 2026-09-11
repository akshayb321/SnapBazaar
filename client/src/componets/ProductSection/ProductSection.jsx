import React from "react";
import "./ProductSection.css";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import API_URL from "../../config/api.js";

function ProductSection({
  title,
  products,
  showCategories = false,
  categories = [],
  selectedCategory,
  setSelectedCategory,
  limit,
  showViewAll,
  className,
}) {
  const navigate = useNavigate();
  const { fetchCart } = useCart();
  const { wishlist, fetchWishlist } = useWishlist();

  const handleWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to add items to your wishlist.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/wishlist/add`,
        {
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchWishlist();

      toast.success(response.data.message);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  const isWishlisted = (productId) => {
    return wishlist?.items?.some((item) => item.productId._id === productId);
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to add items to your cart.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/cart/add`,
        {
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchCart();

      toast.success(response.data.message);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <section className={`product-section ${className || ""}`}>
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

        {showViewAll && (
          <Button
            text="View All"
            className="view-all-btn"
            icon2="fa-solid fa-arrow-right"
            onClick={() => navigate("/products")}
          />
        )}
      </div>

      <div className="product-grid">
        {products.slice(0, limit).map((product) => (
          <div className="product-card" key={product._id}>
            <span className="discount">-{product.discount || 20}%</span>

            <button
              className={`wishlist-btn ${
                isWishlisted(product._id) ? "active" : ""
              }`}
              onClick={() => handleWishlist(product._id)}
            >
              <i
                className={
                  isWishlisted(product._id)
                    ? "fa-solid fa-heart"
                    : "fa-regular fa-heart"
                }
              ></i>
            </button>

            <div
              className="product-image"
              onClick={() => navigate(`/product/${product._id}`)}
            >
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
                text="Add To Cart"
                icon="fa-solid fa-cart-shopping"
                className="Pro-cart-btn"
                onClick={() => handleAddToCart(product._id)}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductSection;
