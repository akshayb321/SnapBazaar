import React, { useEffect, useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import axios from "axios";
import toast from "react-hot-toast";
import "./AddressContainer.css";

function Address() {
  const API_URL = "http://localhost:8000/api/auth";

  const [showAddress, setShowAddress] = useState(false);
  const [menuIndex, setMenuIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "Home",
    customType: "",
  });

  // =========================
  // GET ADDRESSES
  // =========================

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error(
        "Failed to fetch addresses:",
        error.response?.data || error.message,
      );
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,

      ...(name === "addressType" && value !== "Other"
        ? { customType: "" }
        : {}),
    }));
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
      addressType: "Home",
      customType: "",
    });

    setEditIndex(null);
    setShowAddress(false);
    setMenuIndex(null);
  };

  // =========================
  // ADD / UPDATE ADDRESS
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // UPDATE
      if (editIndex !== null) {
        const addressId = addresses[editIndex]._id;

        const response = await axios.put(
          `${API_URL}/address/${addressId}`,
          formData,
          config,
        );

        setAddresses(response.data.addresses);

        setTimeout(() => {
          setLoading(false);

          if (response.data.success) {
            toast.success("Address updated successfully");
          }

          resetForm();
        }, 500);

        return;
      }

      // ADD
      const response = await axios.post(`${API_URL}/address`, formData, config);

      setAddresses(response.data.addresses);

      setTimeout(() => {
        setLoading(false);

        if (response.data.success) {
          toast.success("Address added successfully");
        }

        resetForm();
      }, 500);
    } catch (error) {
      setLoading(false);

      console.error(
        "Address save failed:",
        error.response?.data || error.message,
      );

      toast.error(error.response?.data?.message || "Failed to save address");
    }
  };
  // =========================
  // EDIT ADDRESS
  // =========================

  const handleEdit = (index) => {
    const selectedAddress = addresses[index];

    setFormData({
      fullName: selectedAddress.fullName || "",
      phone: selectedAddress.phone || "",
      addressLine: selectedAddress.addressLine || "",
      city: selectedAddress.city || "",
      state: selectedAddress.state || "",
      pincode: selectedAddress.pincode || "",
      addressType: selectedAddress.addressType || "Home",
      customType: selectedAddress.customType || "",
    });

    setEditIndex(index);
    setShowAddress(true);
    setMenuIndex(null);
  };

  // =========================
  // DELETE ADDRESS
  // =========================

  const handleDelete = async (index) => {
    try {
      const token = localStorage.getItem("token");
      const addressId = addresses[index]._id;

      const response = await axios.delete(`${API_URL}/address/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAddresses(response.data.addresses);
      setMenuIndex(null);

      toast.success("Address deleted successfully");
    } catch (error) {
      console.error(
        "Delete address failed:",
        error.response?.data || error.message,
      );

      toast.error(error.response?.data?.message || "Failed to delete address");
    }
  };

  // =========================
  // SET DEFAULT ADDRESS
  // =========================

  const handleSetDefault = async (index) => {
    try {
      const token = localStorage.getItem("token");
      const addressId = addresses[index]._id;

      const response = await axios.put(
        `${API_URL}/address/${addressId}/default`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAddresses(response.data.addresses);
      setMenuIndex(null);

      toast.success("Default address updated");
    } catch (error) {
      console.error(
        "Set default failed:",
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message || "Failed to set default address",
      );
    }
  };

  return (
    <div className="address-container">
      <h2>Address</h2>

      {/* Add Address */}

      {!showAddress && (
        <button
          type="button"
          className="add-address-box"
          onClick={() => {
            setShowAddress(true);
            setEditIndex(null);
          }}
        >
          <span>+</span>
          Add Address
        </button>
      )}

      {/* Address Form */}

      {showAddress && (
        <form className="address-form" onSubmit={handleSubmit}>
          <div className="form-title">
            <h3>{editIndex !== null ? "Edit Address" : "Add New Address"}</h3>
          </div>

          <div className="form-row">
            <TextField
              fullWidth
              size="small"
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <MuiTelInput
              fullWidth
              size="small"
              label="Phone Number"
              value={formData.phone}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  phone: value,
                }))
              }
              defaultCountry="IN"
              required
            />
          </div>

          <TextField
            fullWidth
            size="small"
            label="Address"
            name="addressLine"
            value={formData.addressLine}
            onChange={handleChange}
            required
          />

          <div className="form-row">
            <TextField
              fullWidth
              size="small"
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              size="small"
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              size="small"
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </div>

          {/* Address Type */}

          <div className="address-type-section">
            <TextField
              select
              fullWidth
              size="small"
              label="Address Type"
              name="addressType"
              value={formData.addressType}
              onChange={handleChange}
              required
            >
              <MenuItem value="Home">Home</MenuItem>
              <MenuItem value="Office">Office</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            {formData.addressType === "Other" && (
              <TextField
                fullWidth
                size="small"
                label="Enter Address Type"
                name="customType"
                value={formData.customType}
                onChange={handleChange}
                className="other-type-input"
              />
            )}
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
              disabled={loading}
            >
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin search-loader"></i>
              ) : null}

              {loading
                ? editIndex !== null
                  ? "UPDATING..."
                  : "SAVING..."
                : editIndex !== null
                  ? "Update Address"
                  : "Save Address"}
            </button>
          </div>
        </form>
      )}

      {/* Saved Addresses */}

      <div className="saved-addresses">
        {addresses.map((address, index) => (
          <div className="address-card" key={address._id}>
            <div className="address-card-top">
              <div className="address-labels">
                <span className="address-label">
                  {address.addressType === "Other"
                    ? address.customType || "Other"
                    : address.addressType}
                </span>

                {address.isDefault && (
                  <span className="default-label">Default</span>
                )}
              </div>

              {/* Three Dots */}

              <div className="address-menu-wrapper">
                <button
                  type="button"
                  className={`more-btn ${menuIndex === index ? "active" : ""}`}
                  onClick={() =>
                    setMenuIndex(menuIndex === index ? null : index)
                  }
                >
                  ⋮
                </button>

                {menuIndex === index && (
                  <div className="AddressMenu">
                    <button
                      type="button"
                      className="menu-item"
                      onClick={() => handleEdit(index)}
                    >
                      <span>
                        <i className="fa-solid fa-pen-to-square"></i>
                      </span>
                      Edit
                    </button>

                    <button
                      type="button"
                      className="menu-item"
                      onClick={() => handleDelete(index)}
                    >
                      <span>
                        <i className="fa-solid fa-trash"></i>
                      </span>
                      Delete
                    </button>

                    {!address.isDefault && (
                      <button
                        type="button"
                        className="menu-item default-menu-item"
                        onClick={() => handleSetDefault(index)}
                      >
                        <span>✓</span>
                        Set as Default
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="address-info">
              <div className="address-name-phone">
                <strong>{address.fullName}</strong>
                <span>{address.phone}</span>
              </div>

              <p>
                {address.addressLine}, {address.city}, {address.state}{" "}
                {address.pincode}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Address;
