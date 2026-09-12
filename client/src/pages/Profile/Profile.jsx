import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ProfileSidebar from "../../componets/Profile/ProfileSidebar";
import ProfileDetails from "../../componets/Profile/ProfileDetails";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to view your profile.");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="profile-page">
      <ProfileSidebar />
      <ProfileDetails />
    </div>
  );
}

export default Profile;
