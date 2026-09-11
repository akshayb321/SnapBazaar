import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  verifyRazorpayPayment,
} from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createOrder);
router.post("/verify-payment", authMiddleware, verifyRazorpayPayment);

router.get("/my-orders", authMiddleware, getMyOrders);

router.get("/:id", authMiddleware, getOrderById);

router.patch("/:id/cancel", authMiddleware, cancelOrder);

export default router;
