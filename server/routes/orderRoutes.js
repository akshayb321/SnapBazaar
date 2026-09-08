import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createOrder);

router.get("/my-orders", authMiddleware, getMyOrders);

router.get("/:id", authMiddleware, getOrderById);

router.patch("/:id/cancel", authMiddleware, cancelOrder);

export default router;
