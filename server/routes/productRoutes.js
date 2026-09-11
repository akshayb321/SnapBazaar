import express from "express";

import {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

router.post(
  "/add",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 5),
  addProduct,
);

router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 5),
  updateProduct,
);

router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
