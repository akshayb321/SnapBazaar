import express from "express";

import {
  sendAdminOtp,
  verifyAdminOtp,
  getAdminProfile,
} from "../controllers/adminAuthController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/send-otp", sendAdminOtp);
router.post("/verify-otp", verifyAdminOtp);
router.get("/me", authMiddleware, adminMiddleware, getAdminProfile);
export default router;
