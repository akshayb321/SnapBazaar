import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "../../Auth/Auth.css";
import API_URL from "../../../config/api.js";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");

  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOtpChange = (value) => {
    setOtp(value);

    if (otpError) {
      setOtpError("");
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/api/admin/auth/send-otp`, {
        email: formData.email,
        password: formData.password,
      });

      setOtpSent(true);
      setOtp("");
      setOtpError("");
      setResendTimer(60);

      toast.success(response.data.message || "OTP sent successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send admin OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError("Please enter the complete OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/admin/auth/verify-otp`,
        {
          email: formData.email,
          otp,
        },
      );

      localStorage.setItem("adminToken", response.data.jwtToken);

      toast.success(response.data.message || "Admin login successful");

      navigate("/admin/dashboard");
    } catch (error) {
      setOtpError(
        error.response?.data?.message || "Invalid OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/api/admin/auth/send-otp`, {
        email: formData.email,
        password: formData.password,
      });

      setOtp("");
      setOtpError("");
      setResendTimer(60);

      toast.success(response.data.message || "New OTP sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
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
              alt="SnapBazaar Admin"
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
                <i className="fa-solid fa-user-shield"></i>
                ADMIN PORTAL
              </span>

              <h1>
                Manage everything,
                <br />
                <span>in one place.</span>
              </h1>

              <p>
                Securely manage products, orders and <br />
                your SnapBazaar store.
              </p>
            </div>
          </div>

          <div className="auth-left-features">
            <div className="auth-left-feature">
              <div className="auth-feature-icon">
                <i className="fa-solid fa-shield-halved"></i>
              </div>

              <div>
                <h4>Secure Access</h4>
                <p>Protected admin login</p>
              </div>
            </div>

            <div className="auth-left-feature">
              <div className="auth-feature-icon">
                <i className="fa-solid fa-box"></i>
              </div>

              <div>
                <h4>Manage Products</h4>
                <p>Control your store</p>
              </div>
            </div>

            <div className="auth-left-feature">
              <div className="auth-feature-icon">
                <i className="fa-solid fa-chart-line"></i>
              </div>

              <div>
                <h4>Track Orders</h4>
                <p>Manage everything</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card signup-card">
            <div className="auth-header">
              <h1>Admin Login</h1>
              <p>Sign in to manage your SnapBazaar store.</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (!otpSent) {
                  handleSendOtp();
                } else {
                  handleVerifyOtp();
                }
              }}
            >
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
                  disabled={otpSent}
                />
              </div>

              {!otpSent && (
                <>
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

                  <button
                    type="button"
                    className="auth-submit-btn"
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        Sending OTP
                      </>
                    ) : (
                      <>
                        Continue
                        <i className="fa-solid fa-arrow-right"></i>
                      </>
                    )}
                  </button>

                  <div className="auth-bottom">
                    <p>
                      Not an admin? <Link to="/login">User Login</Link>
                    </p>
                  </div>
                </>
              )}

              {otpSent && (
                <div
                  className={`signup-otp-section ${
                    otpError ? "otp-error" : ""
                  }`}
                >
                  <div className="otp-heading">
                    <div className="otp-title">
                      <div className="otp-title-icon">
                        <i className="fa-solid fa-user-shield"></i>
                      </div>

                      <div>
                        <h3>Verify admin login</h3>
                        <p>Enter the 6-digit OTP sent to your email</p>
                      </div>
                    </div>

                    <span className="otp-email">{formData.email}</span>
                  </div>

                  <div className="otp-input-wrapper">
                    <MuiOtpInput
                      value={otp}
                      onChange={handleOtpChange}
                      length={6}
                    />
                  </div>

                  {otpError && (
                    <p className="otp-error-message">
                      <i className="fa-solid fa-circle-exclamation"></i>
                      {otpError}
                    </p>
                  )}

                  <button
                    type="button"
                    className="auth-submit-btn"
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6 || loading}
                  >
                    {loading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        Verifying
                      </>
                    ) : (
                      <>
                        Login to Dashboard
                        <i className="fa-solid fa-arrow-right"></i>
                      </>
                    )}
                  </button>

                  <div className="otp-resend">
                    {resendTimer > 0 ? (
                      <p>Resend OTP in {resendTimer}s</p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
