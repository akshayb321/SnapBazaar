import Wishlist from "../models/wishlist.js";

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    let userWishlist = await Wishlist.findOne({ userId });
    if (!userWishlist) {
      userWishlist = new Wishlist({
        userId,
        items: [{ productId }],
      });

      await userWishlist.save();

      return res.status(200).json({
        success: true,
        message: "Product added to wishlist",
        userWishlist,
      });
    } else {
      const item = userWishlist.items.find(
        (i) => i.productId.toString() === productId,
      );
      if (item) {
        return res.status(400).json({
          success: false,
          message: "Product already in wishlist",
        });
      }
      userWishlist.items.push({
        productId,
      });

      await userWishlist.save();
      res.status(200).json({
        success: true,
        message: "Product added to wishlist",
        userWishlist,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const removeWishlistItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    const userWishlist = await Wishlist.findOne({ userId });
    if (!userWishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    } else {
      userWishlist.items = userWishlist.items.filter(
        (i) => i.productId.toString() !== productId,
      );
    }
    await userWishlist.save();
    res.status(200).json({
      message: "Item removed from wishlist",
      success: true,
      userWishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const userWishlist = await Wishlist.findOne({ userId }).populate(
      "items.productId",
    );
    if (!userWishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }
    res.status(200).json({
      userWishlist,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
