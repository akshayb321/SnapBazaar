import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    addresses: [
      {
        fullName: {
          type: String,
          trim: true,
        },

        phone: {
          type: String,
          trim: true,
        },

        addressLine: {
          type: String,
          trim: true,
        },

        city: {
          type: String,
          trim: true,
        },

        state: {
          type: String,
          trim: true,
        },

        pincode: {
          type: String,
          trim: true,
        },

        country: {
          type: String,
          default: "India",
          trim: true,
        },

        // Home / Office / Other
        addressType: {
          type: String,
          enum: ["Home", "Office", "Other"],
          default: "Home",
        },

        // Only used when addressType is Other
        customType: {
          type: String,
          default: "",
          trim: true,
        },

        // Default delivery address
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
