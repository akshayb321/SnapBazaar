import React, { useState } from "react";
import ProfileSidebar from "../../componets/Profile/ProfileSidebar";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ChangePass() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
        <div className="profile-row ">
          <TextField
            label="Old Password"
            name="Password"
            variant="outlined"
            fullWidth
          />
          <TextField
            label="New Password"
            name="Password"
            variant="outlined"
            fullWidth
          />
        </div>

        <div className="profile-row phone-row">
          <TextField
            label="Confirm password"
            type="password"
            variant="outlined"
            fullWidth
          />
        </div>

        <button
          className="update-profile"
          onClick={() => {
            setLoading(true);

            setTimeout(() => {
              setLoading(false);
              navigate("/changePass");
            }, 500);
          }}
          disabled={loading}
        >
          {loading ? (
            <i className="fa-solid fa-spinner fa-spin search-loader"></i>
          ) : null}

          {loading ? "LOADING..." : "CHANGE PASSWORD"}
        </button>
      </div>
    </div>
  );
}

export default ChangePass;
