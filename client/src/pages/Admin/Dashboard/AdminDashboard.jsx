import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../config/api.js";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");

        const response = await axios.get(`${API_URL}/api/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");

        const response = await axios.get(`${API_URL}/api/admin/recent-orders`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        setRecentOrders(response.data.data);
      } catch (error) {
        console.error("Failed to fetch recent orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-heading">
        <div>
          <span className="admin-dashboard-eyebrow">OVERVIEW</span>
          <h2>Dashboard</h2>
          <p>Monitor your SnapBazaar store performance</p>
        </div>

        <div className="admin-dashboard-heading-actions">
          <button
            className="admin-dashboard-action-btn"
            onClick={() => navigate("/admin/products/add")}
          >
            <i className="fa-solid fa-plus"></i>
            Add Product
          </button>

          <button
            className="admin-dashboard-orders-btn"
            onClick={() => navigate("/admin/orders")}
          >
            <i className="fa-solid fa-cart-shopping"></i>
            View Orders
          </button>
        </div>
      </div>

      <div className="admin-dashboard-stats">
        <div className="admin-dashboard-stat-card products-card">
          <div className="admin-stat-card-top">
            <div className="admin-stat-icon">
              <i className="fa-solid fa-box"></i>
            </div>

            <span className="admin-stat-card-label">PRODUCTS</span>
          </div>

          <div className="admin-stat-card-content">
            <h3>{loading ? "..." : stats.totalProducts}</h3>
            <p>Total products in store</p>
          </div>
        </div>

        <div className="admin-dashboard-stat-card orders-card">
          <div className="admin-stat-card-top">
            <div className="admin-stat-icon">
              <i className="fa-solid fa-cart-shopping"></i>
            </div>

            <span className="admin-stat-card-label">ORDERS</span>
          </div>

          <div className="admin-stat-card-content">
            <h3>{loading ? "..." : stats.totalOrders}</h3>
            <p>Total orders received</p>
          </div>
        </div>

        <div className="admin-dashboard-stat-card revenue-card">
          <div className="admin-stat-card-top">
            <div className="admin-stat-icon">
              <i className="fa-solid fa-indian-rupee-sign"></i>
            </div>

            <span className="admin-stat-card-label">REVENUE</span>
          </div>

          <div className="admin-stat-card-content">
            <h3>
              {loading
                ? "..."
                : `₹${Number(stats.totalRevenue).toLocaleString("en-IN")}`}
            </h3>
            <p>Total store revenue</p>
          </div>
        </div>

        <div className="admin-dashboard-stat-card pending-card">
          <div className="admin-stat-card-top">
            <div className="admin-stat-icon">
              <i className="fa-solid fa-clock"></i>
            </div>

            <span className="admin-stat-card-label">PENDING</span>
          </div>

          <div className="admin-stat-card-content">
            <h3>{loading ? "..." : stats.pendingOrders}</h3>
            <p>Orders awaiting action</p>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-quick-section">
        <div className="admin-dashboard-section-title">
          <div>
            <h3>Quick Actions</h3>
            <p>Manage your store quickly</p>
          </div>
        </div>

        <div className="admin-quick-actions">
          <button
            className="admin-quick-action"
            onClick={() => navigate("/admin/products/add")}
          >
            <div className="admin-quick-action-icon">
              <i className="fa-solid fa-box"></i>
            </div>

            <div>
              <strong>Add Product</strong>
              <span>Add a new product to store</span>
            </div>

            <i className="fa-solid fa-arrow-right"></i>
          </button>

          <button
            className="admin-quick-action"
            onClick={() => navigate("/admin/products")}
          >
            <div className="admin-quick-action-icon">
              <i className="fa-solid fa-boxes-stacked"></i>
            </div>

            <div>
              <strong>Manage Products</strong>
              <span>View and edit products</span>
            </div>

            <i className="fa-solid fa-arrow-right"></i>
          </button>

          <button
            className="admin-quick-action"
            onClick={() => navigate("/admin/orders")}
          >
            <div className="admin-quick-action-icon">
              <i className="fa-solid fa-receipt"></i>
            </div>

            <div>
              <strong>Manage Orders</strong>
              <span>View customer orders</span>
            </div>

            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <div className="admin-dashboard-section recent-orders-section">
        <div className="admin-section-header">
          <div>
            <span className="admin-section-eyebrow">LATEST ACTIVITY</span>
            <h3>Recent Orders</h3>
            <p>Latest orders from your customers</p>
          </div>

          <button
            className="admin-view-all-btn"
            onClick={() => navigate("/admin/orders")}
          >
            View All
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        {ordersLoading ? (
          <div className="admin-empty-dashboard">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <p>Loading recent orders...</p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="admin-empty-dashboard">
            <div className="admin-empty-order-icon">
              <i className="fa-solid fa-cart-shopping"></i>
            </div>

            <h4>No orders yet</h4>
            <p>Recent customer orders will appear here.</p>
          </div>
        ) : (
          <div className="admin-recent-orders-table-wrapper">
            <table className="admin-recent-orders-table">
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER</th>
                  <th>DATE</th>
                  <th>AMOUNT</th>
                  <th>PAYMENT</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <strong className="admin-order-id">
                        #{order._id.slice(-6).toUpperCase()}
                      </strong>
                    </td>

                    <td>
                      <div className="admin-order-customer">
                        <div className="admin-customer-avatar">
                          <i className="fa-solid fa-user"></i>
                        </div>

                        <div>
                          <strong>{order.userId?.name || "Unknown"}</strong>

                          <span>{order.userId?.email || "-"}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="admin-order-date">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>

                    <td>
                      <strong className="admin-order-amount">
                        ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                      </strong>
                    </td>

                    <td>
                      <span className="admin-payment-method">
                        {order.paymentMethod}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-order-status admin-status-${order.orderStatus
                          .toLowerCase()
                          .replaceAll("_", "-")}`}
                      >
                        <span className="admin-status-dot"></span>
                        {order.orderStatus.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td>
                      <button
                        className="admin-order-view-btn"
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        title="View Order"
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      </button>
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

export default AdminDashboard;
