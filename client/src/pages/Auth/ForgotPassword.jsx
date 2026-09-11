import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./Auth.css";
import API_URL from "../../config/api.js";

function ForgotPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");

  const [resendTimer, setResendTimer] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

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

    if (name === "password") {
      setPasswordError("");
    }

    if (name === "confirmPassword") {
      setConfirmPasswordError("");
    }
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

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/api/auth/send-reset-otp`, {
        email: formData.email,
      });

      setOtpSent(true);
      setOtp("");
      setOtpError("");
      setResendTimer(60);

      toast.success(response.data.message || "OTP sent successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
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
        `${API_URL}/api/auth/verify-reset-otp`,
        {
          email: formData.email,
          otp,
        },
      );

      setOtpVerified(true);
      setOtpError("");

      toast.success(response.data.message || "Email verified");
    } catch (error) {
      setOtpVerified(false);

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

      const response = await axios.post(`${API_URL}/api/auth/send-reset-otp`, {
        email: formData.email,
      });

      setOtp("");
      setOtpError("");
      setResendTimer(60);

      toast.success(response.data.message || "New OTP sent");
    } catch (error) {
      setOtpError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      setOtpError("Please verify your email first");
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
        email: formData.email,
        password: formData.password,
      });

      toast.success(response.data.message || "Password reset successfully");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
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
              alt="SnapBazaar Forgot Password"
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
                <i className="fa-solid fa-shield-halved"></i>
                ACCOUNT RECOVERY
              </span>

              <h1>
                Forgot your password?
                <br />
                <span>We've got you.</span>
              </h1>

              <p>
                Verify your email and create a new password to get back into
                your SnapBazaar account.
              </p>
            </div>
          </div>

          <div className="auth-left-features">
            <div className="auth-left-feature">
              <div className="auth-feature-icon">
                <i className="fa-solid fa-shield-halved"></i>
              </div>

              <div>
                <h4>Secure Recovery</h4>
                <p>Safe & protected</p>
              </div>
            </div>

            <div className="auth-left-feature">
              <div className="auth-feature-icon">
                <i className="fa-solid fa-envelope"></i>
              </div>

              <div>
                <h4>Email Verification</h4>
                <p>Quick & secure</p>
              </div>
            </div>

            <div className="auth-left-feature">
              <div className="auth-feature-icon">
                <i className="fa-solid fa-lock"></i>
              </div>

              <div>
                <h4>New Password</h4>
                <p>Stay protected</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card signup-card">
            <div className="auth-header">
              <h1>Forgot Password?</h1>
              <p>Verify your email to reset your password.</p>
            </div>

            <form onSubmit={handleResetPassword}>
              <div className="auth-input-group">
                <div className="email-input-group">
                  <TextField
                    required
                    type="email"
                    className={otpVerified ? "email-verified-input" : ""}
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

                  {otpVerified && (
                    <div className="verified-badge">
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              </div>

              {!otpSent && (
                <button
                  type="button"
                  className="auth-submit-btn verify-email-btn"
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
                      Send OTP
                      <i className="fa-solid fa-arrow-right"></i>
                    </>
                  )}
                </button>
              )}

              {otpSent && !otpVerified && (
                <div
                  className={`signup-otp-section ${
                    otpError ? "otp-error" : ""
                  }`}
                >
                  <div className="otp-heading">
                    <div className="otp-title">
                      <div className="otp-title-icon">
                        <i className="fa-solid fa-shield-halved"></i>
                      </div>

                      <div>
                        <h3>Verify your email</h3>
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
                        Verify OTP
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

              {otpVerified && (
                <>
                  <div className="auth-input-group password-input-group">
                    <TextField
                      required
                      type={showPassword ? "text" : "password"}
                      label={
                        <>
                          <i className="fa-solid fa-lock"></i>
                          New Password
                        </>
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      error={!!passwordError}
                      helperText={passwordError}
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

                  <div className="auth-input-group password-input-group">
                    <TextField
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      label={
                        <>
                          <i className="fa-solid fa-lock"></i>
                          Confirm Password
                        </>
                      }
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={!!confirmPasswordError}
                      helperText={confirmPasswordError}
                    />

                    <button
                      type="button"
                      className="password-eye-btn"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      <i
                        className={`fa-solid ${
                          showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        Resetting Password
                      </>
                    ) : (
                      <>
                        Reset Password
                        <i className="fa-solid fa-arrow-right"></i>
                      </>
                    )}
                  </button>
                </>
              )}
            </form>

            <div className="auth-bottom">
              <p>
                Remember your password? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
