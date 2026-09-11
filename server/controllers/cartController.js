import Cart from "../models/cart.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
      userCart = new Cart({
        userId,
        items: [{ productId, quantity: 1 }],
      });
    } else {
      const item = userCart.items.find(
        (i) => i.productId.toString() === productId,
      );
      if (item) {
        item.quantity += 1;
      } else {
        userCart.items.push({
          productId,
          quantity: 1,
        });
      }
    }
    await userCart.save();
    res.status(200).json({
      success: true,
      message: "Product added to cart",
      userCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeItem = async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId } = req.body;
    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    } else {
      userCart.items = userCart.items.filter(
        (i) => i.productId.toString() !== productId,
      );
    }
    await userCart.save();
    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      userCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId, quantity } = req.body;
    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    } else {
      const item = userCart.items.find(
        (i) => i.productId.toString() === productId,
      );
      if (item) {
        item.quantity = quantity;
      } else {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }
    }
    await userCart.save();
    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      userCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let userCart = await Cart.findOne({ userId }).populate("items.productId");

    if (!userCart) {
      userCart = new Cart({
        userId,
        items: [],
      });
      await userCart.save();
    }
    res.status(200).json({
      success: true,
      userCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("Clear Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};
