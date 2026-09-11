import React, { useEffect } from "react";
import "./Cart.css";
import ProductSection2 from "../../componets/ProductSection2/ProductSection2";
import CartTotal from "./CartTotal/CartTotal";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Cart() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to view your cart.");
      navigate("/login");
    }
  }, [navigate]);

  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  return (
    <div className="cart-page">
      <ProductSection2 type="cart" />
      <CartTotal />
    </div>
  );
}

export default Cart;
