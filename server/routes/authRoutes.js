import express from "express";
import { login,signUp } from "../controllers/authController";

const router =express.Router();

router.post("/login",login);
router.get("/signup",signUp);

export default router;


