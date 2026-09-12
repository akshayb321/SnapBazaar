import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "../../componets/Profile/ProfileSidebar";
import "./Orders.css";
import API_URL from "../../config/api.js";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cancelModal, setCancelModal] = useState({
    open: false,
    orderId: null,
  });

  const [cancelReason, setCancelReason] = useState("");

  const navigate = useNavigate();

  // Redirect if user is not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to view your orders.");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view your orders");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/api/order/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Fetch Orders Error:", error);

        const message =
          error.response?.data?.message || "Failed to load your orders";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getExpectedDate = (createdAt) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 7);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getOrderDate = (createdAt) => {
    return new Date(createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatStatus = (status) => {
    return status
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const canCancel = (status) => {
    return ["PLACED", "CONFIRMED"].includes(status);
  };

  const openCancelModal = (orderId) => {
    setCancelReason("");

    setCancelModal({
      open: true,
      orderId,
    });
  };

  const closeCancelModal = () => {
    setCancelModal({
      open: false,
      orderId: null,
    });

    setCancelReason("");
  };

  const cancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${API_URL}/api/order/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? response.data.order : order,
        ),
      );

      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Cancel Order Error:", error);

      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const handleConfirmCancellation = () => {
    if (!cancelReason) {
      toast.error("Please select a reason");
      return;
    }

    cancelOrder(cancelModal.orderId);
    closeCancelModal();
  };

  return (
    <div className="profile-page">
      <ProfileSidebar />

      <div className="order-container">
        <div className="orders-heading">
          <div>
            <h1>My Orders</h1>
            <p>Track and manage your recent orders</p>
          </div>

          {!loading && !error && orders.length > 0 && (
            <span className="orders-count">
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </span>
          )}
        </div>

        {loading && (
          <div className="orders-state">
            <div className="order-loader"></div>
            <p>Loading your orders...</p>
          </div>
        )}

        {!loading && error && (
          <div className="orders-state">
            <div className="state-icon">!</div>
            <h3>Unable to load orders</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="orders-state">
            <div className="state-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Your placed orders will appear here.</p>
          </div>
        )}

        {!loading &&
          !error &&
          orders.length > 0 &&
          orders.map((order) => {
            const status = order.orderStatus || "PLACED";
            const cancelled = status === "CANCELLED";
            const delivered = status === "DELIVERED";

            return (
              <div className="order-card" key={order._id}>
                <div className="order-top">
                  <div className="order-info">
                    <div className="order-id">
                      <span>ORDER ID</span>
                      <strong>{order._id}</strong>
                    </div>

                    <div className="order-date">
                      <span>ORDERED ON</span>
                      <strong>{getOrderDate(order.createdAt)}</strong>
                    </div>

                    <div className="delivery-info">
                      <span>
                        {delivered ? "DELIVERED ON" : "EXPECTED DELIVERY"}
                      </span>

                      <strong>
                        {delivered
                          ? getOrderDate(order.updatedAt || order.createdAt)
                          : cancelled
                            ? "Order cancelled"
                            : getExpectedDate(order.createdAt)}
                      </strong>
                    </div>
                  </div>

                  <div className="order-actions">
                    <span
                      className={`order-status ${
                        cancelled ? "cancelled" : ""
                      } ${delivered ? "delivered" : ""}`}
                    >
                      <span className="status-dot"></span>
                      {formatStatus(status)}
                    </span>

                    {canCancel(status) && (
                      <button
                        className="cancel-order-btn"
                        onClick={() => openCancelModal(order._id)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                <div className="order-products">
                  {order.items?.map((item, index) => (
                    <div
                      className="order-product"
                      key={`${order._id}-${index}`}
                    >
                      <div className="order-product-image">
                        <img src={item.image} alt={item.title} />
                      </div>

                      <div className="product-details">
                        <h3>{item.title}</h3>

                        <div className="product-meta">
                          <span>₹{item.price}</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>

                      <div className="product-total">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-bottom">
                  <div className="payment-info">
                    <span>PAYMENT</span>
                    <strong>{order.paymentMethod}</strong>
                  </div>

                  <div className="order-total">
                    <span>ORDER TOTAL</span>
                    <strong>₹{order.totalAmount}</strong>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {cancelModal.open && (
        <div className="cancel-modal-overlay" onClick={closeCancelModal}>
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="cancel-modal-close"
              onClick={closeCancelModal}
              aria-label="Close"
            >
              ×
            </button>

            <div className="cancel-modal-icon">?</div>

            <h2>Cancel this order?</h2>

            <p className="cancel-modal-text">
              Please tell us why you want to cancel this order.
            </p>

            <div className="cancel-reasons">
              {[
                "Changed my mind",
                "Found a better price",
                "Ordered by mistake",
                "Delivery is taking too long",
                "Product is no longer needed",
                "Other",
              ].map((reason) => (
                <label
                  className={`cancel-reason ${
                    cancelReason === reason ? "selected" : ""
                  }`}
                  key={reason}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={cancelReason === reason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />

                  <span className="cancel-radio"></span>

                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="cancel-modal-actions">
              <button className="keep-order-btn" onClick={closeCancelModal}>
                Keep Order
              </button>

              <button
                className="confirm-cancel-btn"
                onClick={handleConfirmCancellation}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
