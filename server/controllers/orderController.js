import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import sendEmail from "../utils/email/sendEmail.js";
import { orderEmailTemplate } from "../utils/email/emailTemplates.js";

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
