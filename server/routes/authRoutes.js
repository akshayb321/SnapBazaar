import express from "express";
import { login,signUp } from "../controllers/authController.js";
import { signupValidation ,loginValidation } from "../middlewares/authValidation.js";

const route =express.Router();

route.post("/login",loginValidation,login);
route.post("/signup",signupValidation,signUp);

export default route;


