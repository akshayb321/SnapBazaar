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
    brand: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },

    image: [
      {
        type: String,
        required: true,
      },
    ],

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
