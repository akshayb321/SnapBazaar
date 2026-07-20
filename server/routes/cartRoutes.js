import express from "express";
import {
  addToCart,
  getCart,
  removeItem,
  updateQuantity,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", addToCart);
router.post("/update", updateQuantity);
router.post("/remove", removeItem);
router.get("/:userId", getCart);

export default router;
