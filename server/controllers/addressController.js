import User from "../models/user.js";

// Add Address

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

// Get Addresses

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

// Delete Address

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

    user.addresses.pull(req.params.addressId);

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

// Update Address

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

// Set Default Address

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

    user.addresses.forEach((address) => {
      address.isDefault = false;
    });

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
