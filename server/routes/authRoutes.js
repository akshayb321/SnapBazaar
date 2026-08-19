import express from "express";

import {
  login,
  signUp,
  getMe,
  updateProfileImage,
  updateProfile,
  addAddress,
  getAddresses,
  deleteAddress,
  updateAddress,
  setDefaultAddress,
} from "../controllers/authController.js";

import {
  signupValidation,
  loginValidation,
} from "../middlewares/authValidation.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginValidation, login);

router.post("/signup", signupValidation, signUp);

router.get("/me", authMiddleware, getMe);

router.put("/profile-image", authMiddleware, updateProfileImage);

router.put("/profileInfo", authMiddleware, updateProfile);

// Address routes
router.post("/address", authMiddleware, addAddress);

router.get("/address", authMiddleware, getAddresses);

router.put("/address/:addressId", authMiddleware, updateAddress);

router.delete("/address/:addressId", authMiddleware, deleteAddress);

router.put("/address/:addressId/default", authMiddleware, setDefaultAddress);

export default router;
