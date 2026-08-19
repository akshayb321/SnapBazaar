import React, { useState } from "react";
import "../../../componets/ProductSection2/ProductSection2";
import { useCart } from "../../../context/CartContext";

import "./CartTotal.css";
import { useNavigate } from "react-router-dom";

function CartTotal() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const totalItemsCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const totalOriginalPrice =
    cart?.items?.reduce((acc, item) => {
      return acc + (item.productId?.oldPrice || 0) * item.quantity;
    }, 0) || 0;

  const totalDiscountedPrice =
    cart?.items?.reduce((acc, item) => {
      return acc + (item.productId?.price || 0) * item.quantity;
    }, 0) || 0;

  const totalDiscountAmount = totalOriginalPrice - totalDiscountedPrice;

  if (!cart || cart.items.length === 0) return null;

  return (
    <div className="cart-total">
      <div className="cart-total-top">
        <p>PRICE DETAILS</p>
      </div>

      <div className="cart-total-mid">
        <div className="total-price">
          <p>Price ({totalItemsCount} items)</p>
          <p>₹{totalOriginalPrice}</p>
        </div>

        <div className="delivery-charges">
          <p>Discount</p>
          <p className="discount-green">-₹{totalDiscountAmount}</p>
        </div>

        <div className="delivery-charges">
          <p>Delivery Charges</p>
          <p>Free</p>
        </div>
      </div>

      <div className="total-amount">
        <p>Total Amount</p>
        <p>₹{totalDiscountedPrice}</p>
      </div>

      <button
        className="placeOrder"
        onClick={() => {
          setLoading(true);
          setTimeout(() => {
            navigate("/checkout");
            setLoading(false);
          }, 1000);
        }}
      >
        {loading ? (
          <i className="fa-solid fa-spinner fa-spin search-loader"></i>
        ) : (
          <i className="fa-solid fa-bag-shopping"></i>
        )}

        <p>CHECKOUT</p>
      </button>
    </div>
  );
}

export default CartTotal;
