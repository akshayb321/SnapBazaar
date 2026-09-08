import User from "../models/user.js";

export const getMe = async (req, res) => {
  try {
    const id = req.user.id;

    const existingUser = await User.findById(id).select("-password");

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Please login again",
      });
    }

    return res.status(200).json({
      success: true,
      user: existingUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    const { profileImage } = req.body;

    if (!profileImage) {
      return res.status(400).json({
        message: "Profile image is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        profileImage: profileImage,
      },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile image updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile image",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, phone } = req.body;

    const updateData = {};

    if (name) updateData.name = name;

    if (phone !== undefined) updateData.phone = phone;

    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!updatedProfile) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};
