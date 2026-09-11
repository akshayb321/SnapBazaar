import Product from "../models/product.js";
import cloudinary from "../config/cloudinary.js";

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const { search, category, tag } = req.query;
    let filter = {};
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }
    if (category) {
      filter.category = category;
    }

    if (tag && tag !== "none") {
      filter.tag = tag;
    }
    const products = await Product.find(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Single Product
// ==============================
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Product
export const addProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    const folderMap = {
      Fashion: "Fashion",
      Bags: "Bags",
      Footwear: "footwear",
      Groceries: "Groceries",
      Wellness: "Wellness",
      Beauty: "beauty",
      Electronics: "Electronics",
      Jewellery: "jewellery",
    };

    const categoryFolder = folderMap[req.body.category];

    if (!categoryFolder) {
      return res.status(400).json({
        success: false,
        message: "Invalid product category",
      });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `Products/${categoryFolder}`,
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        uploadStream.end(file.buffer);
      });

      imageUrls.push(result.secure_url);
    }

    const product = await Product.create({
      title: req.body.title,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      discount: req.body.discount,
      brand: req.body.brand,
      description: req.body.description,
      image: imageUrls,
      category: req.body.category,
      stock: req.body.stock,
      tag: req.body.tag,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product",
    });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
