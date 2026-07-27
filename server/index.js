import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import authRouter from "./routes/authRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import WishlistRouter from "./routes/wishlistRoutes.js";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server is running on port : ${PORT}`);
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", WishlistRouter);
