import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../config/api.js";
import "./AdminOrders.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");

        const response = await axios.get(`${API_URL}/api/admin/orders`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        setOrders(response.data.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);

      const adminToken = localStorage.getItem("adminToken");

      const response = await axios.patch(
        `${API_URL}/api/admin/orders/${orderId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: response.data.data.orderStatus,
              }
            : order,
        ),
      );

      toast.success("Order status updated");
    } catch (error) {
      console.error("Failed to update order status:", error);

      toast.error(
        error.response?.data?.message || "Failed to update order status",
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="admin-orders">
      <div className="admin-orders-heading">
        <div>
          <h2>Orders</h2>
          <p>Manage customer orders</p>
        </div>

        <div className="admin-orders-count">
          <i className="fa-solid fa-cart-shopping"></i>
          <span>{orders.length}</span>
          Orders
        </div>
      </div>

      <div className="admin-orders-card">
        {loading ? (
          <div className="admin-orders-empty">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="admin-orders-empty">
            <div className="admin-orders-empty-icon">
              <i className="fa-solid fa-cart-shopping"></i>
            </div>
            <h4>No orders found</h4>
            <p>Customer orders will appear here.</p>
          </div>
        ) : (
          <div className="admin-orders-table-wrapper">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>View</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  const itemCount = order.items.reduce(
                    (total, item) => total + item.quantity,
                    0,
                  );

                  const statusClass = order.orderStatus
                    .toLowerCase()
                    .replaceAll("_", "-");

                  return (
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

                          <div className="admin-customer-info">
                            <strong>{order.userId?.name || "Unknown"}</strong>
                            <span>{order.userId?.email || "-"}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="admin-order-items">
                          <i className="fa-solid fa-box"></i>
                          {itemCount}
                        </span>
                      </td>

                      <td>
                        <strong className="admin-order-amount">
                          ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`admin-payment-method admin-payment-${order.paymentMethod
                            .toLowerCase()
                            .replaceAll(" ", "-")}`}
                        >
                          {order.paymentMethod}
                        </span>
                      </td>

                      <td>
                        <select
                          className={`admin-order-status-select admin-status-${statusClass}`}
                          value={order.orderStatus}
                          disabled={updatingOrderId === order._id}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                        >
                          <option value="PLACED">Placed</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="OUT_FOR_DELIVERY">
                            Out For Delivery
                          </option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>

                      <td>
                        <span className="admin-order-date">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </td>

                      <td>
                        <button
                          className="admin-view-order-btn"
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                          title="View Order"
                        >
                          <i className="fa-regular fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
