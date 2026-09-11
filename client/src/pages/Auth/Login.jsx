import React, { useState } from "react";
import axios from "axios";
import { TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";
import API_URL from "../../config/api.js";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitData = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", response.data.jwtToken);

      setUser(response.data.user);

      toast.success(response.data.message || "Login successful");

      navigate("/home", {
        state: response.data,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-layout">
        <div className="auth-left">
          <div className="auth-illustration">
            <img
              src="https://res.cloudinary.com/jwqnivpq/image/upload/v1788805106/ChatGPT_Image_Sep_7_2026_11_48_27_PM.png"
              alt="SnapBazaar Shopping"
            />
          </div>

          <div className="auth-left-overlay"></div>

          <div className="auth-left-top">
            <div className="auth-left-brand">
              <div className="auth-left-brand-icon">
                <i className="fa-solid fa-bag-shopping"></i>
              </div>

              <div>
                <h2>
                  Snap<span>Bazaar</span>
                </h2>

                <p>Smart Shopping. Better Deals.</p>
              </div>
            </div>

            <div className="auth-left-heading">
              <span className="auth-eyebrow">
                <i className="fa-solid fa-bolt"></i>
                WELCOME BACK TO SNAPBAZAAR
              </span>

              <h1>
                Your shopping,
                <br />
                <span>starts here.</span>
              </h1>

              <p>
                Sign in to explore amazing products, discover great deals and
                continue your shopping journey.
              </p>
            </div>
          </div>

          <div className="auth-left-features">
            <div className="auth-left-feature">
              <div className="auth-feature-icon">
                <i className="fa-solid fa-shield-halved"></i>
              </div>

              <div>
                <h4>Secure Shopping</h4>
                <p>Safe & trusted</p>
              </div>
            </div>

            <div className="auth-left-feature">
              <div className="auth-feature-icon">
                <i className="fa-solid fa-truck-fast"></i>
              </div>

              <div>
                <h4>Fast Delivery</h4>
                <p>Quick & reliable</p>
              </div>
            </div>

            <div className="auth-left-feature">
              <div className="auth-feature-icon">
                <i className="fa-solid fa-tags"></i>
              </div>

              <div>
                <h4>Best Deals</h4>
                <p>More value</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card login-card">
            <div className="auth-header">
              <h1>Welcome Back!</h1>

              <p>Login to your account and continue shopping.</p>
            </div>

            <form onSubmit={submitData}>
              <div className="auth-input-group">
                <TextField
                  required
                  type="email"
                  label={
                    <>
                      <i className="fa-solid fa-envelope"></i>
                      Email Address
                    </>
                  }
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="auth-input-group password-input-group">
                <TextField
                  required
                  type={showPassword ? "text" : "password"}
                  label={
                    <>
                      <i className="fa-solid fa-lock"></i>
                      Password
                    </>
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <i
                    className={`fa-solid ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>

              <div className="auth-forgot">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Logging in
                  </>
                ) : (
                  <>
                    Login
                    <i className="fa-solid fa-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            <div className="auth-bottom">
              <p>
                Don't have an account? <Link to="/signup">Sign up</Link>
              </p>
            </div>

            <div className="admin-login-section">
              <div className="admin-login-divider">
                <span>or</span>
              </div>

              <Link to="/admin/login" className="admin-login-link">
                <i className="fa-solid fa-user-shield"></i>
                Admin Login
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
