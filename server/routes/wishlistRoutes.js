import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeWishlistItem,
} from "../controllers/wishlistController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getWishlist);
router.post("/add", authMiddleware, addToWishlist);
router.post("/remove", authMiddleware, removeWishlistItem);

export default router;
