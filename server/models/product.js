import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    oldPrice: {
      type: Number,
    },

    discount: {
      type: Number,
    },

    rating: {
      type: Number,
      default: 0,
    },

    image1: {
      type: String,
      required: true,
    },
    image2: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },
    tag: {
      type: String,
      enum: ["popular", "latest", "featured", "none"],
      default: "none",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
