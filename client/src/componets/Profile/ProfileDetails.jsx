import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import { useAuth } from "../../context/AuthContext.jsx";
import "./ProfileSidebar.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ProfileDetails() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Unified to 'phone'
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  // Track context via 'user.phone'
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:8000/api/auth/profileInfo",
        {
          name: formData.name,
          phone: formData.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTimeout(() => {
        setLoading(false);

        if (response.data.success) {
          toast.success(response.data.message || "Profile updated!");
        }
      }, 500);
    } catch (error) {
      setLoading(false);

      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="profile-details">
      <div className="profile-details-header">
        <h2>My Profile</h2>
        <button
          className="change-password"
          onClick={() => navigate("/changePass")}
        >
          CHANGE PASSWORD
        </button>
      </div>
      <div className="profile-divider"></div>

      <div className="profile-row">
        <TextField
          label="Full Name"
          name="name"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          value={user?.email || ""}
          InputProps={{ readOnly: true }}
        />
      </div>

      <div className="profile-row phone-row">
        <MuiTelInput
          label="Phone Number"
          variant="outlined"
          fullWidth
          value={formData.phone}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              phone: value,
            }))
          }
          defaultCountry="IN"
        />
      </div>

      <button
        className="update-profile"
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <i className="fa-solid fa-spinner fa-spin search-loader"></i>
        ) : null}

        {loading ? "UPDATING..." : "UPDATE PROFILE"}
      </button>
    </div>
  );
}

export default ProfileDetails;
