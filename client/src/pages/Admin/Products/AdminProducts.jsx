import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../config/api.js";
import "./AdminProducts.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/api/products`);

      setProducts(response.data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      const adminToken = localStorage.getItem("adminToken");

      const response = await axios.delete(
        `${API_URL}/api/products/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      setProducts((prev) =>
        prev.filter((product) => product._id !== productId),
      );

      toast.success(response.data.message);
    } catch (error) {
      console.error("Failed to delete product:", error);

      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="admin-products">
      <div className="admin-products-heading">
        <div>
          <h2>Products</h2>
          <p>Manage your SnapBazaar products</p>
        </div>

        <button
          className="admin-add-product-btn"
          onClick={() => navigate("/admin/products/add")}
        >
          <i className="fa-solid fa-plus"></i>
          Add Product
        </button>
      </div>

      <div className="admin-products-count">{products.length} Products</div>

      <div className="admin-products-card">
        {loading ? (
          <div className="admin-products-empty">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="admin-products-empty">
            <i className="fa-solid fa-box-open"></i>
            <h4>No products found</h4>
            <p>Products added to SnapBazaar will appear here.</p>
          </div>
        ) : (
          <div className="admin-products-table-wrapper">
            <table className="admin-products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Tag</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="admin-product-info">
                        <div className="admin-product-image">
                          <img src={product.image?.[0]} alt={product.title} />
                        </div>

                        <div>
                          <strong>{product.title}</strong>
                        </div>
                      </div>
                    </td>

                    <td>{product.brand}</td>

                    <td>{product.category}</td>

                    <td>₹{Number(product.price).toLocaleString("en-IN")}</td>

                    <td>
                      <span className="admin-product-stock">
                        {product.stock}
                      </span>
                    </td>

                    <td>
                      <span className="admin-product-tag">{product.tag}</span>
                    </td>

                    <td>
                      <div className="admin-product-actions">
                        <button
                          className="admin-edit-product-btn"
                          onClick={() =>
                            navigate(`/admin/products/edit/${product._id}`)
                          }
                          title="Edit Product"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>

                        <button
                          className="admin-delete-product-btn"
                          onClick={() => handleDelete(product._id)}
                          title="Delete Product"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
