import crypto from "crypto";
import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import sendEmail from "../utils/email/sendEmail.js";
import { orderEmailTemplate } from "../utils/email/emailTemplates.js";
import razorpay from "../config/razorpay.js";

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products found",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }

    if (!["COD", "RAZORPAY"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const productIds = items.map((item) => {
      return typeof item.productId === "object"
        ? item.productId._id
        : item.productId;
    });

    const products = await Product.find({
      _id: { $in: productIds },
    });

    const productMap = new Map(
      products.map((product) => [product._id.toString(), product]),
    );

    const orderItems = items.map((item) => {
      const productId =
        typeof item.productId === "object"
          ? item.productId._id
          : item.productId;

      const product = productMap.get(productId.toString());

      if (!product) {
        throw new Error("One or more products were not found");
      }

      if (!item.quantity || item.quantity < 1) {
        throw new Error("Invalid product quantity");
      }

      return {
        productId: product._id,
        title: product.title,
        image: product.image?.[0] || "",
        price: product.price,
        quantity: item.quantity,
      };
    });

    const subtotal = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const deliveryCharge = 0;
    const totalAmount = subtotal + deliveryCharge;

    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      shippingAddress,
      subtotal,
      deliveryCharge,
      totalAmount,
      paymentMethod,
      paymentStatus: "PENDING",
      orderStatus: "PLACED",
    });

    if (paymentMethod === "RAZORPAY") {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: order._id.toString(),
      });

      order.razorpayOrderId = razorpayOrder.id;

      await order.save();

      return res.status(201).json({
        success: true,
        message: "Razorpay order created successfully",
        order,
        razorpay: {
          keyId: process.env.RAZORPAY_KEY_ID,
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
      });
    }

    const user = await User.findById(req.user.id).select("name email");

    if (user?.email) {
      try {
        const emailHtml = orderEmailTemplate({
          order,
          user,
        });

        await sendEmail(
          user.email,
          `Order Confirmed - #${order._id}`,
          emailHtml,
        );
      } catch (emailError) {
        console.error("Order Email Error:", emailError);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment details are missing",
      });
    }

    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      order.paymentStatus = "FAILED";

      await order.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    order.paymentStatus = "PAID";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    await order.save();

    const user = await User.findById(req.user.id).select("name email");

    if (user?.email) {
      try {
        const emailHtml = orderEmailTemplate({
          order,
          user,
        });

        await sendEmail(
          user.email,
          `Order Confirmed - #${order._id}`,
          emailHtml,
        );
      } catch (emailError) {
        console.error("Order Email Error:", emailError);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error("Razorpay Verification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!["PLACED", "CONFIRMED"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "This order cannot be cancelled",
      });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        $set: {
          orderStatus: "CANCELLED",
        },
      },
      {
        returnDocument: "after",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};
