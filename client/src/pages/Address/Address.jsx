import React from "react";
import ProfileSidebar from "../../componets/Profile/ProfileSidebar";
import AddressContainer from "../../componets/Address/AddressContainer";

function Address() {
  return (
    <div className="profile-page">
      <ProfileSidebar />
      <AddressContainer />
    </div>
  );
}

export default Address;
