import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json({
      message: "User registered successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }
    const isPassMatch = await bcrypt.compare(password, existingUser.password);
    if (!isPassMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const jwtToken = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRETE,
      { expiresIn: "24h" },
    );
    return res.status(200).json({
      success: true,
      message: "Login successfully.",
      jwtToken,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

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

    // 1. Destructure 'phone' directly from the frontend request body
    const { name, phone } = req.body;

    const updateData = {};
    if (name) updateData.name = name;

    // 2. Map directly to your new Mongoose field key 'phone'
    // Checking for undefined allows clear actions (like setting to empty string)
    if (phone !== undefined) updateData.phone = phone;

    // 3. Perform the update operation in the database
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

    // 4. Validate user existence FIRST before returning a 200 status code
    if (!updatedProfile) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // 5. Safely return successful data payload to your Axios caller
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

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      country,
      addressType,
      customType,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // First address automatically becomes default
    const isDefault = user.addresses.length === 0;

    user.addresses.push({
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      country: country || "India",
      addressType: addressType || "Home",
      customType: addressType === "Other" ? customType : "",
      isDefault,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add address",
      error: error.message,
    });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("addresses");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
      error: error.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    const wasDefault = address.isDefault;

    // Remove address
    user.addresses.pull(req.params.addressId);

    // If deleted address was default,
    // make first remaining address default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses.forEach((address, index) => {
        address.isDefault = index === 0;
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete address",
      error: error.message,
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      country,
      addressType,
      customType,
    } = req.body;

    address.fullName = fullName;
    address.phone = phone;
    address.addressLine = addressLine;
    address.city = city;
    address.state = state;
    address.pincode = pincode;

    if (country !== undefined) {
      address.country = country;
    }

    if (addressType !== undefined) {
      address.addressType = addressType;
    }

    // Only keep customType when Other is selected
    if (addressType === "Other") {
      address.customType = customType || "";
    } else {
      address.customType = "";
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update address",
      error: error.message,
    });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    // Make every address non-default
    user.addresses.forEach((address) => {
      address.isDefault = false;
    });

    // Make selected address default
    address.isDefault = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to set default address",
      error: error.message,
    });
  }
};
