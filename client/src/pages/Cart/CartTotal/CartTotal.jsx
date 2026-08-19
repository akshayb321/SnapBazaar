import React from "react";
import "../../../componets/ProductSection2/ProductSection2";
import { useCart } from "../../../context/CartContext";

import "./CartTotal.css";

function CartTotal() {
  const { cart } = useCart();

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

      <button className="placeOrder">
        <i className="fa-solid fa-bag-shopping"></i>
        <p>PLACE ORDER</p>
      </button>
    </div>
  );
}

export default CartTotal;
