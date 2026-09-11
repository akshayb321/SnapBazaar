import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import API_URL from "../../../config/api.js";
import "./AdminOrderDetails.css";

function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");

        const response = await axios.get(`${API_URL}/api/admin/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        setOrder(response.data.data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);

      const adminToken = localStorage.getItem("adminToken");

      const response = await axios.patch(
        `${API_URL}/api/admin/orders/${id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      setOrder((prevOrder) => ({
        ...prevOrder,
        orderStatus: response.data.data.orderStatus,
      }));

      toast.success("Order status updated");
    } catch (error) {
      console.error("Failed to update order status:", error);

      toast.error(
        error.response?.data?.message || "Failed to update order status",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-order-details-state">
        <i className="fa-solid fa-spinner fa-spin"></i>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="admin-order-details-state">
        <div className="admin-order-state-icon">
          <i className="fa-solid fa-circle-exclamation"></i>
        </div>
        <h4>Order not found</h4>
        <p>The order you're looking for could not be found.</p>
        <button onClick={() => navigate("/admin/orders")}>
          <i className="fa-solid fa-arrow-left"></i>
          Back to Orders
        </button>
      </div>
    );
  }

  const statusClass = order.orderStatus.toLowerCase().replaceAll("_", "-");

  const totalItems = order.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <div className="admin-order-details">
      <div className="admin-order-details-heading">
        <div className="admin-order-heading-left">
          <button
            className="admin-back-orders-btn"
            onClick={() => navigate("/admin/orders")}
          >
            <i className="fa-solid fa-arrow-left"></i>
            Back to Orders
          </button>

          <div className="admin-order-title-row">
            <div>
              <span className="admin-order-heading-label">ORDER DETAILS</span>
              <h2>#{order._id.slice(-6).toUpperCase()}</h2>
              <p>
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="admin-order-status-wrapper">
          <span>Status</span>

          <select
            className={`admin-order-details-status-select admin-status-${statusClass}`}
            value={order.orderStatus}
            disabled={updatingStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="PLACED">Placed</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="admin-order-overview">
        <div className="admin-overview-item">
          <div className="admin-overview-icon">
            <i className="fa-solid fa-box"></i>
          </div>

          <div>
            <span>Items</span>
            <strong>{totalItems}</strong>
          </div>
        </div>

        <div className="admin-overview-item">
          <div className="admin-overview-icon">
            <i className="fa-solid fa-indian-rupee-sign"></i>
          </div>

          <div>
            <span>Total Amount</span>
            <strong>
              ₹{Number(order.totalAmount).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="admin-overview-item">
          <div className="admin-overview-icon">
            <i className="fa-solid fa-credit-card"></i>
          </div>

          <div>
            <span>Payment</span>
            <strong>{order.paymentMethod}</strong>
          </div>
        </div>

        <div className="admin-overview-item">
          <div className="admin-overview-icon">
            <i className="fa-solid fa-calendar"></i>
          </div>

          <div>
            <span>Order Date</span>
            <strong>
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </strong>
          </div>
        </div>
      </div>

      <div className="admin-order-details-grid">
        <div className="admin-order-details-main">
          <div className="admin-order-details-card">
            <div className="admin-details-card-header">
              <div>
                <span>ORDER</span>
                <h3>Ordered Items</h3>
                <p>{order.items.length} product(s) in this order</p>
              </div>
            </div>

            <div className="admin-ordered-items">
              {order.items.map((item) => (
                <div className="admin-ordered-item" key={item.productId}>
                  <div className="admin-ordered-item-image">
                    <img src={item.image} alt={item.title} />
                  </div>

                  <div className="admin-ordered-item-info">
                    <h4>{item.title}</h4>

                    <div className="admin-item-meta">
                      <span>Qty: {item.quantity}</span>
                      <span>₹{item.price.toLocaleString("en-IN")} each</span>
                    </div>
                  </div>

                  <div className="admin-ordered-item-total">
                    <span>Total</span>
                    <strong>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-order-details-card">
            <div className="admin-details-card-header">
              <div>
                <span>DELIVERY</span>
                <h3>Shipping Address</h3>
                <p>Customer delivery information</p>
              </div>
            </div>

            <div className="admin-shipping-address">
              <div className="admin-address-icon">
                <i className="fa-solid fa-location-dot"></i>
              </div>

              <div className="admin-address-content">
                <h4>{order.shippingAddress.fullName}</h4>

                <p>
                  <i className="fa-solid fa-phone"></i>
                  {order.shippingAddress.mobile}
                </p>

                <p>{order.shippingAddress.address}</p>

                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-order-details-side">
          <div className="admin-order-details-card">
            <div className="admin-details-card-header">
              <div>
                <span>CUSTOMER</span>
                <h3>Customer Information</h3>
              </div>
            </div>

            <div className="admin-customer-details">
              <div className="admin-customer-icon">
                <i className="fa-solid fa-user"></i>
              </div>

              <div>
                <h4>{order.userId?.name || "Unknown"}</h4>
                <p>{order.userId?.email || "-"}</p>
              </div>
            </div>
          </div>

          <div className="admin-order-details-card">
            <div className="admin-details-card-header">
              <div>
                <span>PAYMENT</span>
                <h3>Payment Information</h3>
              </div>
            </div>

            <div className="admin-payment-details">
              <div>
                <span>Method</span>
                <strong>{order.paymentMethod}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong
                  className={`admin-payment-status admin-payment-${order.paymentStatus
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                >
                  {order.paymentStatus}
                </strong>
              </div>
            </div>
          </div>

          <div className="admin-order-details-card">
            <div className="admin-details-card-header">
              <div>
                <span>SUMMARY</span>
                <h3>Order Summary</h3>
              </div>
            </div>

            <div className="admin-order-summary">
              <div>
                <span>Subtotal</span>
                <strong>
                  ₹{Number(order.subtotal).toLocaleString("en-IN")}
                </strong>
              </div>

              <div>
                <span>Delivery Charge</span>
                <strong>
                  ₹{Number(order.deliveryCharge).toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="admin-summary-divider"></div>

              <div className="admin-summary-total">
                <span>Total Amount</span>
                <strong>
                  ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetails;
