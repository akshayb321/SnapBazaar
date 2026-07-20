import express from "express";
import { login, signUp, getMe } from "../controllers/authController.js";
import {
  signupValidation,
  loginValidation,
} from "../middlewares/authValidation.js";

import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signUp);
router.get("/me", authMiddleware, getMe);

export default router;
