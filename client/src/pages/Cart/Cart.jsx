import React from "react";
import "./Cart.css";
import ProductSection2 from "../../componets/ProductSection2/ProductSection2";
import CartTotal from "./CartTotal/CartTotal";

function Cart() {
  return (
    <div className="cart-page">
      <ProductSection2 type="cart" />
      <CartTotal />
    </div>
  );
}

export default Cart;
