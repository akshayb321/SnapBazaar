import React from "react";
import ProductSection2 from "../../componets/ProductSection2/ProductSection2";
import ProfileSidebar from "../../componets/Profile/ProfileSidebar";

function WishList() {
  return (
    <div className="profile-page">
      <ProfileSidebar />
      <ProductSection2 type="wishlist" />
    </div>
  );
}

export default WishList;
