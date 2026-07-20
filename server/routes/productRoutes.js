import express from "express";

import {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts);

router.get("/:id", getSingleProduct);

router.post("/add", addProduct);

router.put("/update/:id", updateProduct);

router.delete("/delete/:id", deleteProduct);

export default router;
