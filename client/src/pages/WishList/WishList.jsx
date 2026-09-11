import React, { useEffect } from "react";
import ProductSection2 from "../../componets/ProductSection2/ProductSection2";
import ProfileSidebar from "../../componets/Profile/ProfileSidebar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function WishList() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to view your wishlist.");
      navigate("/login");
    }
  }, [navigate]);

  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  return (
    <div className="profile-page">
      <ProfileSidebar />
      <ProductSection2 type="wishlist" />
    </div>
  );
}

export default WishList;
