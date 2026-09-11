import express from "express";
import {
  getDashboardStats,
  getRecentOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, adminMiddleware, getDashboardStats);
router.get("/recent-orders", authMiddleware, adminMiddleware, getRecentOrders);
router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);
router.get("/orders/:id", authMiddleware, adminMiddleware, getOrderById);
router.patch(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus,
);

export default router;
