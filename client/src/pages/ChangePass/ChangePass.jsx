import React from "react";
import ProfileSidebar from "../../componets/Profile/ProfileSidebar";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ChangePass() {
  const navigate = useNavigate();
  return (
    <div className="profile-page">
      <ProfileSidebar />
      <div className="profile-details">
        <div className="profile-details-header">
          <h2>Change Password</h2>
          <button
            className="change-password"
            onClick={() => navigate("/profile")}
          >
            BACK
          </button>
        </div>
        <div className="profile-divider"></div>
        <div className="profile-row phone-row">
          <TextField
            label="Old Password"
            name="Password"
            variant="outlined"
            fullWidth
          />
        </div>

        <div className="profile-row">
          <TextField
            label="New Password"
            name="Password"
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Confirm password"
            type="password"
            variant="outlined"
            fullWidth
          />
        </div>

        <button className="update-profile">CHANGE PASSWORD</button>
      </div>
    </div>
  );
}

export default ChangePass;
