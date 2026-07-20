import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import router from "./routes/authRoutes.js";
import cartRouter from "./routes/cartRoutes.js";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server is running on port : ${PORT}`);
});

app.use("/api/auth", router);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRouter);
