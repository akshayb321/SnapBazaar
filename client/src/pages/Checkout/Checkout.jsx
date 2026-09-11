import React, { useState } from "react";
import "./Checkout.css";
import AddressContainer from "../../componets/Address/AddressContainer";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import API_URL from "../../config/api.js";

function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const products = cart?.items || [];

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const totalItemsCount = products.reduce(
    (total, item) => total + (item.quantity || 0),
    0,
  );

  const subtotal = products.reduce(
    (total, item) =>
      total + (item.productId?.price || 0) * (item.quantity || 0),
    0,
  );

  const deliveryCharge = 0;
  const totalAmount = subtotal + deliveryCharge;

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(true));
        existingScript.addEventListener("error", () => resolve(false));
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (products.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    if (loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to place your order.");
      navigate("/login");
      return;
    }

    const shippingAddress = {
      fullName: selectedAddress.fullName || "",
      mobile: selectedAddress.phone || "",
      address: selectedAddress.addressLine || "",
      city: selectedAddress.city || "",
      state: selectedAddress.state || "",
      pincode: selectedAddress.pincode || "",
    };

    if (!shippingAddress.fullName) {
      toast.error("Please provide your full name.");
      return;
    }

    if (!shippingAddress.mobile) {
      toast.error("Please provide your mobile number.");
      return;
    }

    if (!shippingAddress.address) {
      toast.error("Please provide your delivery address.");
      return;
    }

    if (!shippingAddress.city) {
      toast.error("Please provide your city.");
      return;
    }

    if (!shippingAddress.state) {
      toast.error("Please provide your state.");
      return;
    }

    if (!shippingAddress.pincode) {
      toast.error("Please provide your pincode.");
      return;
    }

    try {
      setLoading(true);

      if (paymentMethod === "COD") {
        const response = await axios.post(
          `${API_URL}/api/order/create`,
          {
            items: products,
            shippingAddress,
            paymentMethod: "COD",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.data?.success) {
          toast.error(response.data?.message || "Failed to place order.");
          return;
        }

        await clearCart();

        setOrderSuccess(true);

        toast.success("Order placed successfully!");

        return;
      }

      if (paymentMethod === "RAZORPAY") {
        const isLoaded = await loadRazorpay();

        if (!isLoaded) {
          toast.error(
            "Razorpay failed to load. Please check your internet connection.",
          );
          return;
        }

        const response = await axios.post(
          `${API_URL}/api/order/create`,
          {
            items: products,
            shippingAddress,
            paymentMethod: "RAZORPAY",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.data?.success) {
          toast.error(
            response.data?.message || "Failed to create payment order.",
          );
          return;
        }

        const razorpayData = response.data?.razorpay;

        if (
          !razorpayData?.keyId ||
          !razorpayData?.orderId ||
          !razorpayData?.amount ||
          !razorpayData?.currency
        ) {
          toast.error("Invalid Razorpay order details.");
          return;
        }

        const options = {
          key: razorpayData.keyId,
          amount: razorpayData.amount,
          currency: razorpayData.currency,
          name: "SnapBazaar",
          description: "Order Payment",
          order_id: razorpayData.orderId,

          prefill: {
            name: selectedAddress.fullName || user?.name || "",
            email: user?.email || "",
            contact: selectedAddress.phone || "",
          },

          notes: {
            orderId: response.data.order?._id || "",
          },

          theme: {
            color: "#2563EB",
          },

          handler: async function (paymentResponse) {
            try {
              const verifyResponse = await axios.post(
                `${API_URL}/api/order/verify-payment`,
                {
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              if (!verifyResponse.data?.success) {
                toast.error(
                  verifyResponse.data?.message ||
                    "Payment verification failed.",
                );
                return;
              }

              await clearCart();

              setOrderSuccess(true);

              toast.success("Payment successful!");
            } catch (error) {
              console.error(
                "Payment verification error:",
                error.response?.data || error.message,
              );

              toast.error(
                error.response?.data?.message || "Payment verification failed.",
              );
            } finally {
              setLoading(false);
            }
          },

          modal: {
            ondismiss: function () {
              setLoading(false);
              toast.error("Payment cancelled.");
            },
          },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.on("payment.failed", function (response) {
          console.error("Razorpay Payment Failed:", response.error);

          setLoading(false);

          toast.error(
            response.error?.description || "Payment failed. Please try again.",
          );
        });

        razorpay.open();

        return;
      }
    } catch (error) {
      console.error(
        "Place order error:",
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      if (paymentMethod === "COD") {
        setLoading(false);
      }
    }
  };

  if (orderSuccess) {
    return (
      <div className="order-success-page">
        <div className="order-success-container">
          <div className="order-success-card">
            <div className="success-icon">
              <img
                src="https://res.cloudinary.com/jwqnivpq/image/upload/v1788499159/checked_1.png"
                alt="Order Success"
              />
            </div>

            <h1>Your order is placed</h1>

            <p className="success-message">Thank you for shopping with us.</p>

            <p className="email-message">
              Order details sent to your email <strong>{user?.email}</strong>
            </p>

            <div className="success-actions">
              <button
                type="button"
                className="view-orders-btn"
                onClick={() => navigate("/orders")}
              >
                VIEW MY ORDERS
              </button>

              <button
                type="button"
                className="back-home-btn"
                onClick={() => navigate("/home")}
              >
                BACK TO HOME
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="checkout-main-container">
        <div className="checkout-left">
          <div className="checkout-card address-card">
            <div className="checkout-section-header">
              <div className="section-header-left">
                <div className="section-icon">
                  <i className="fa-solid fa-location-dot"></i>
                </div>

                <div>
                  <h2>Delivery Address</h2>
                  <p>Select your preferred delivery address</p>
                </div>
              </div>

              <button
                type="button"
                className="checkout-add-address-btn"
                onClick={() => setShowAddress(true)}
              >
                <span>+</span>
                Add Address
              </button>
            </div>

            <AddressContainer
              mode="checkout"
              showAddress={showAddress}
              setShowAddress={setShowAddress}
              onAddressSelect={setSelectedAddress}
            />
          </div>

          <div className="checkout-card payment-card">
            <div className="checkout-section-header">
              <div className="checkout-section-payment">
                <div className="section-icon">
                  <i className="fa-solid fa-credit-card"></i>
                </div>

                <div>
                  <h2>Payment Method</h2>
                  <p>Choose how you want to pay</p>
                </div>
              </div>
            </div>

            <div className="payment-options">
              <label
                className={`payment-option ${
                  paymentMethod === "COD" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <span className="custom-radio"></span>

                <div className="payment-icon cod-icon">
                  <i className="fa-solid fa-money-bill-wave"></i>
                </div>

                <div className="payment-info">
                  <h3>Cash on Delivery</h3>
                  <p>Pay when your order is delivered</p>
                </div>
              </label>

              <label
                className={`payment-option ${
                  paymentMethod === "RAZORPAY" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="RAZORPAY"
                  checked={paymentMethod === "RAZORPAY"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <span className="custom-radio"></span>

                <div className="payment-icon online-icon">
                  <i className="fa-solid fa-credit-card"></i>
                </div>

                <div className="payment-info">
                  <h3>Online Payment</h3>
                  <p>UPI, Credit Card, Debit Card & Net Banking</p>
                </div>
              </label>
            </div>

            {paymentMethod === "RAZORPAY" && (
              <div className="razorpay-info">
                <div className="razorpay-logo">Razorpay</div>

                <div>
                  <strong>Secure Online Payment</strong>

                  <p>
                    Your payment will be securely processed through Razorpay.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="checkout-right">
          <div className="checkout-card order-summary">
            <div className="summary-heading">
              <div className="summary-title">
                <div className="summary-icon">
                  <i className="fa-solid fa-bag-shopping"></i>
                </div>

                <div>
                  <h2>Order Summary</h2>

                  <p>
                    {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
            </div>

            <div className="checkout-products">
              {products.map((item) => {
                const product = item.productId;
                const quantity = item.quantity || 0;
                const price = product?.price || 0;
                const itemTotal = price * quantity;

                return (
                  <div className="checkout-product" key={item._id}>
                    <div className="checkout-product-image">
                      <img
                        src={product?.image?.[0]}
                        alt={product?.title || "Product"}
                      />
                    </div>

                    <div className="checkout-product-info">
                      <h3>{product?.title || "Product"}</h3>

                      <div className="checkout-product-meta">
                        <span>Qty: {quantity}</span>

                        <strong>₹{itemTotal.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="summary-divider"></div>

            <div className="price-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="price-row">
              <span>Delivery Charges</span>
              <span className="free">FREE</span>
            </div>

            <div className="summary-divider"></div>

            <div className="total-row">
              <span>Total Amount</span>
              <strong>₹{totalAmount.toLocaleString("en-IN")}</strong>
            </div>

            <button
              type="button"
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin search-loader"></i>
                  <span>
                    {paymentMethod === "RAZORPAY"
                      ? "Opening Payment..."
                      : "Processing..."}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {paymentMethod === "RAZORPAY"
                      ? "Proceed to Payment"
                      : "Place Order"}
                  </span>

                  <i className="fa-solid fa-arrow-right"></i>
                </>
              )}
            </button>

            <div className="secure-checkout">
              <i className="fa-solid fa-lock"></i>
              <span>Secure & encrypted checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
