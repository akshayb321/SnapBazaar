import React, { useState } from "react";
import "./ProductSection2.css";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ProductSection2({ type }) {
  const { cart, fetchCart } = useCart();
  const { wishlist, fetchWishlist } = useWishlist();

  const [showDropdown, setShowDropdown] = useState(null);
  const navigate = useNavigate();

  // Cart ya Wishlist select karo
  const data = type === "cart" ? cart : wishlist;
  const products = data?.items || [];

  const totalItemsCount =
    type === "cart"
      ? products.reduce((acc, item) => acc + item.quantity, 0)
      : products.length;

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8000/api/cart/update",
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchCart();
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const url =
        type === "cart"
          ? "http://localhost:8000/api/cart/remove"
          : "http://localhost:8000/api/wishlist/remove";

      const response = await axios.post(
        url,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (type === "cart") {
        await fetchCart();
      } else {
        await fetchWishlist();
      }

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      {products.length > 0 ? (
        <div className="main-cart-cointainer">
          <div className="top-cart-cantainer">
            <p>{type === "cart" ? "Your Cart" : "Your Wishlist"}</p>

            <span>
              There are {totalItemsCount} products in your{" "}
              {type === "cart" ? "cart" : "wishlist"}
            </span>
          </div>

          {products.map((product) => (
            <div className="productCart-cointainer" key={product._id}>
              <div
                className="cart-product-img"
                onClick={() => navigate(`/product/${product.productId?._id}`)}
              >
                <img src={product.productId?.image?.[0]} alt="" />
              </div>

              <div className="cart-product-info">
                <p>{product.productId?.brand}</p>

                <div
                  className="description"
                  onClick={() => navigate(`/product/${product.productId?._id}`)}
                >
                  <p>{product.productId?.description}</p>
                </div>

                <div className="cart-rating">
                  <p className="rating1">{product.productId?.rating}</p>
                  <p className="rating">★</p>
                </div>

                {/* Quantity sirf Cart me */}
                {type === "cart" && (
                  <div className="cart-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        setShowDropdown(
                          showDropdown === product._id ? null : product._id,
                        )
                      }
                    >
                      Qty: {product.quantity}
                      <span className="dropdown-icon">⏷</span>
                    </button>

                    {showDropdown === product._id && (
                      <div className="quantity-dropdown">
                        {[...Array(10)].map((_, index) => (
                          <div
                            key={index + 1}
                            className="quantity-item"
                            onClick={() => {
                              handleUpdateQuantity(
                                product.productId?._id,
                                index + 1,
                              );
                              setShowDropdown(null);
                            }}
                          >
                            {index + 1}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="cart-price-section">
                  <p>₹{product.productId?.oldPrice}</p>
                  <p>₹{product.productId?.price}</p>
                  <p>{product.productId?.discount}% OFF</p>
                </div>
              </div>

              <div
                className="remove"
                onClick={() => handleRemoveItem(product.productId?._id)}
              >
                <i className="fa-solid fa-x"></i>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-cart-page">
          <img
            src={
              type === "cart"
                ? "https://res.cloudinary.com/jwqnivpq/image/upload/v1785258745/empty-cart.png"
                : "https://res.cloudinary.com/jwqnivpq/image/upload/v1785334679/wishlist_1.png"
            }
            alt={type === "cart" ? "Empty Cart" : "Empty Wishlist"}
          />

          <h3>Your {type === "cart" ? "Cart" : "Wishlist"} is empty</h3>

          <button onClick={() => navigate("/home")} className="ShopNow-btn">
            Shop Now
          </button>
        </div>
      )}
    </>
  );
}

export default ProductSection2;
