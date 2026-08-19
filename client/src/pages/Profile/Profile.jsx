import React from "react";
import ProfileSidebar from "../../componets/Profile/ProfileSidebar";
import ProfileDetails from "../../componets/Profile/ProfileDetails";
import "./Profile.css";

function Profile() {
  return (
    <div className="profile-page">
      <ProfileSidebar />
      <ProfileDetails />
    </div>
  );
}

export default Profile;
