import React from "react";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./ProfileSidebar.css";
import axios from "axios";

function ProfileSidebar() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "snapbazaar_profile");

      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/jwqnivpq/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const cloudinaryData = await cloudinaryResponse.json();

      const imageUrl = cloudinaryData.secure_url;

      console.log("Cloudinary URL:", imageUrl);

      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:8000/api/auth/profile-image",
        {
          profileImage: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUser(response.data.user);
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to update profile details:");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="ProfileSidebar">
      <div className="sidebar-1">
        <div className="profile-image">
          <img
            src={
              user?.profileImage ||
              "https://res.cloudinary.com/jwqnivpq/image/upload/v1786802584/user.png"
            }
            alt="user"
          />
          <label htmlFor="profileImage" className="upload-overlay">
            <div className="upload-icon">
              <img
                src="https://res.cloudinary.com/jwqnivpq/image/upload/v1786802920/upload_1.png"
                alt="upload icon"
              />
            </div>
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </div>

        <div className="profile-info">
          <p>{user.name}</p>
          <span>{user.email}</span>
        </div>
      </div>
      <div className="sidebar-2">
        <Button
          text={"My Account"}
          icon={"fa-regular fa-user"}
          className="profile-btn"
          onClick={() => {
            navigate("/profile");
          }}
        />
        <Button
          text={"Address"}
          icon={"fa-solid fa-location-dot"}
          onClick={() => {
            navigate("/address");
          }}
        />
        <Button
          text={"Orders"}
          icon={"fa-regular fa-clipboard"}
          onClick={() => {
            navigate("/orders");
          }}
        />
        <Button
          text={"My List"}
          icon={"fa-regular fa-heart"}
          onClick={() => {
            navigate("/wishlist");
          }}
        />
        <Button
          text={"Logout"}
          icon={"fa-solid fa-arrow-right-from-bracket"}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}

export default ProfileSidebar;
