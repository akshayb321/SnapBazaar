import express from "express";

import {
  login,
  sendSignupOtp,
  verifySignupOtp,
  completeSignup,
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
} from "../controllers/authController.js";

import {
  getMe,
  updateProfileImage,
  updateProfile,
} from "../controllers/profileController.js";

import {
  addAddress,
  getAddresses,
  deleteAddress,
  updateAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";

import {
  signupValidation,
  completeSignupValidation,
  loginValidation,
  passwordValidation,
  emailValidation,
} from "../middlewares/authValidation.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Login

router.post("/login", loginValidation, login);

// Signup

router.post("/send-signup-otp", signupValidation, sendSignupOtp);

router.post("/verify-signup-otp", verifySignupOtp);

router.post("/complete-signup", completeSignupValidation, completeSignup);

// Reset Password

router.post("/send-reset-otp", emailValidation, sendResetOtp);

router.post("/verify-reset-otp", verifyResetOtp);

router.post("/reset-password", passwordValidation, resetPassword);

// Profile

router.get("/me", authMiddleware, getMe);

router.put("/profile-image", authMiddleware, updateProfileImage);

router.put("/profileInfo", authMiddleware, updateProfile);

// Address

router.post("/address", authMiddleware, addAddress);

router.get("/address", authMiddleware, getAddresses);

router.put("/address/:addressId", authMiddleware, updateAddress);

router.delete("/address/:addressId", authMiddleware, deleteAddress);

router.put("/address/:addressId/default", authMiddleware, setDefaultAddress);

export default router;
