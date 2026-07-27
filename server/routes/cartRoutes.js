import express from "express";
import {
  addToCart,
  getCart,
  removeItem,
  updateQuantity,
} from "../controllers/cartController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.post("/update", authMiddleware, updateQuantity);
router.post("/remove", authMiddleware, removeItem);
router.get("/", authMiddleware, getCart);

export default router;
