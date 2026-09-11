import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import API_URL from "../../../config/api.js";
import "./AdminProductAdd.css";

function AdminAddProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    oldPrice: "",
    discount: "",
    brand: "",
    description: "",
    category: "",
    stock: "",
    tag: "none",
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      try {
        setFetchingProduct(true);

        const response = await axios.get(`${API_URL}/api/products/${id}`);

        const product = response.data.product;

        setFormData({
          title: product.title || "",
          price: product.price || "",
          oldPrice: product.oldPrice || "",
          discount: product.discount || "",
          brand: product.brand || "",
          description: product.description || "",
          category: product.category || "",
          stock: product.stock ?? "",
          tag: product.tag || "none",
        });

        setExistingImages(product.image || []);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
        navigate("/admin/products");
      } finally {
        setFetchingProduct(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (existingImages.length + images.length + selectedFiles.length > 5) {
      toast.error("You can have maximum 5 images");
      return;
    }

    const validImages = selectedFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} must be less than 5MB`);
        return false;
      }

      return true;
    });

    setImages((prev) => [...prev, ...validImages]);

    e.target.value = "";
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (existingImages.length + images.length === 0) {
      toast.error("Please select at least one product image");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("price", formData.price);

      if (formData.oldPrice !== "") {
        data.append("oldPrice", formData.oldPrice);
      }

      if (formData.discount !== "") {
        data.append("discount", formData.discount);
      }

      data.append("brand", formData.brand);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      data.append("tag", formData.tag);

      data.append("existingImages", JSON.stringify(existingImages));

      images.forEach((image) => {
        data.append("images", image);
      });

      const adminToken = localStorage.getItem("adminToken");

      const response = isEditMode
        ? await axios.put(`${API_URL}/api/products/update/${id}`, data, {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          })
        : await axios.post(`${API_URL}/api/products/add`, data, {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          });

      toast.success(response.data.message);
      navigate("/admin/products");
    } catch (error) {
      console.error(
        isEditMode ? "Failed to update product:" : "Failed to add product:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          (isEditMode ? "Failed to update product" : "Failed to add product"),
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProduct) {
    return (
      <div className="admin-add-product">
        <div className="admin-products-empty">
          <i className="fa-solid fa-spinner fa-spin"></i>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-add-product">
      <div className="admin-add-product-heading">
        <div>
          <button
            className="admin-back-products-btn"
            onClick={() => navigate("/admin/products")}
          >
            <i className="fa-solid fa-arrow-left"></i>
            Back to Products
          </button>

          <h2>{isEditMode ? "Edit Product" : "Add Product"}</h2>

          <p>
            {isEditMode
              ? "Update your SnapBazaar product"
              : "Add a new product to your SnapBazaar store"}
          </p>
        </div>
      </div>

      <form className="admin-add-product-form" onSubmit={handleSubmit}>
        <div className="admin-product-form-card">
          <div className="admin-product-form-section">
            <h3>Product Information</h3>

            <div className="admin-product-form-grid">
              <div className="admin-form-group">
                <label>Product Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter product title"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Enter brand name"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Old Price</label>
                <input
                  type="number"
                  name="oldPrice"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  placeholder="Enter old price"
                  min="0"
                />
              </div>

              <div className="admin-form-group">
                <label>Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="Enter discount"
                  min="0"
                  max="100"
                />
              </div>

              <div className="admin-form-group">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Enter stock quantity"
                  min="0"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Bags">Bags</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Jewellery">Jewellery</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Tag</label>
                <select name="tag" value={formData.tag} onChange={handleChange}>
                  <option value="none">None</option>
                  <option value="popular">Popular</option>
                  <option value="latest">Latest</option>
                  <option value="featured">Featured</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group admin-full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="5"
                required
              ></textarea>
            </div>
          </div>

          <div className="admin-product-form-section">
            <h3>Product Images</h3>

            <label className="admin-image-upload-box">
              <i className="fa-solid fa-cloud-arrow-up"></i>

              <strong>Click to upload images</strong>

              <span>PNG, JPG, JPEG • Maximum 5 images • 5MB each</span>

              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageChange}
              />
            </label>

            {(existingImages.length > 0 || images.length > 0) && (
              <div className="admin-product-image-preview">
                {existingImages.map((image, index) => (
                  <div
                    className="admin-preview-image"
                    key={`existing-${index}`}
                  >
                    <img src={image} alt={`Product ${index + 1}`} />

                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>

                    {index === 0 && images.length === 0 && (
                      <span className="admin-main-image-label">Main Image</span>
                    )}
                  </div>
                ))}

                {images.map((image, index) => (
                  <div className="admin-preview-image" key={`new-${index}`}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New Product ${index + 1}`}
                    />

                    <button type="button" onClick={() => removeNewImage(index)}>
                      <i className="fa-solid fa-xmark"></i>
                    </button>

                    {existingImages.length === 0 && index === 0 && (
                      <span className="admin-main-image-label">Main Image</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-product-form-actions">
            <button
              type="button"
              className="admin-cancel-product-btn"
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-save-product-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <i
                    className={
                      isEditMode ? "fa-solid fa-check" : "fa-solid fa-plus"
                    }
                  ></i>

                  {isEditMode ? "Update Product" : "Add Product"}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminAddProduct;
