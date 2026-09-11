import React, { useEffect, useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import axios from "axios";
import toast from "react-hot-toast";
import "./AddressContainer.css";
import API_URL from "../../config/api.js";

function AddressContainer({
  mode = "address",

  showAddress: checkoutShowAddress,
  setShowAddress: setCheckoutShowAddress,

  onAddressSelect,
}) {
  const isCheckout = mode === "checkout";

  const [localShowAddress, setLocalShowAddress] = useState(false);

  const [menuIndex, setMenuIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const [addresses, setAddresses] = useState([]);

  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [loading, setLoading] = useState(false);

  const showAddress = isCheckout ? checkoutShowAddress : localShowAddress;

  const setShowAddress = isCheckout
    ? setCheckoutShowAddress
    : setLocalShowAddress;

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

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/api/auth/address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedAddresses = response.data.addresses || [];

      setAddresses(fetchedAddresses);

      if (isCheckout && fetchedAddresses.length > 0) {
        const defaultAddress =
          fetchedAddresses.find((address) => address.isDefault) ||
          fetchedAddresses[0];

        setSelectedAddressId(defaultAddress._id);

        if (onAddressSelect) {
          onAddressSelect(defaultAddress);
        }
      }
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

      if (editIndex !== null) {
        const addressId = addresses[editIndex]._id;

        const response = await axios.put(
          `${API_URL}/api/auth/address/${addressId}`,
          formData,
          config,
        );

        const updatedAddresses = response.data.addresses || [];

        setAddresses(updatedAddresses);

        if (isCheckout) {
          const updatedAddress = updatedAddresses.find(
            (address) => address._id === addressId,
          );

          if (updatedAddress) {
            setSelectedAddressId(updatedAddress._id);

            if (onAddressSelect) {
              onAddressSelect(updatedAddress);
            }
          }
        }

        setTimeout(() => {
          setLoading(false);

          if (response.data.success) {
            toast.success("Address updated successfully");
          }

          resetForm();
        }, 500);

        return;
      }

      const response = await axios.post(
        `${API_URL}/api/auth/address`,
        formData,
        config,
      );

      const updatedAddresses = response.data.addresses || [];

      setAddresses(updatedAddresses);

      if (isCheckout && updatedAddresses.length > 0) {
        const newAddress = updatedAddresses[updatedAddresses.length - 1];

        setSelectedAddressId(newAddress._id);

        if (onAddressSelect) {
          onAddressSelect(newAddress);
        }
      }

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

  const handleDelete = async (index) => {
    try {
      const token = localStorage.getItem("token");

      const addressId = addresses[index]._id;

      const response = await axios.delete(
        `${API_URL}/api/auth/address/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedAddresses = response.data.addresses || [];

      setAddresses(updatedAddresses);

      setMenuIndex(null);

      if (selectedAddressId === addressId) {
        if (updatedAddresses.length > 0) {
          const nextAddress =
            updatedAddresses.find((address) => address.isDefault) ||
            updatedAddresses[0];

          setSelectedAddressId(nextAddress._id);

          if (onAddressSelect) {
            onAddressSelect(nextAddress);
          }
        } else {
          setSelectedAddressId(null);

          if (onAddressSelect) {
            onAddressSelect(null);
          }
        }
      }

      toast.success("Address deleted successfully");
    } catch (error) {
      console.error(
        "Delete address failed:",
        error.response?.data || error.message,
      );

      toast.error(error.response?.data?.message || "Failed to delete address");
    }
  };

  const handleSetDefault = async (index) => {
    try {
      const token = localStorage.getItem("token");

      const addressId = addresses[index]._id;

      const response = await axios.put(
        `${API_URL}/api/auth/address/${addressId}/default`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedAddresses = response.data.addresses || [];

      setAddresses(updatedAddresses);

      setMenuIndex(null);

      if (isCheckout) {
        const defaultAddress = updatedAddresses.find(
          (address) => address._id === addressId,
        );

        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);

          if (onAddressSelect) {
            onAddressSelect(defaultAddress);
          }
        }
      }

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

  const handleSelectAddress = (address) => {
    if (!isCheckout) return;

    setSelectedAddressId(address._id);

    if (onAddressSelect) {
      onAddressSelect(address);
    }
  };

  const addressForm = (
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
          {loading && (
            <i className="fa-solid fa-spinner fa-spin search-loader"></i>
          )}

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
  );

  if (isCheckout) {
    return (
      <div className="checkout-address-container">
        {showAddress && addressForm}

        {!showAddress && (
          <div className="checkout-address-list">
            {addresses.length === 0 ? (
              <div className="no-address-message">
                <i className="fa-solid fa-location-dot"></i>

                <h3>No saved address</h3>

                <p>Add a delivery address to continue</p>
              </div>
            ) : (
              addresses.map((address) => {
                const isSelected = selectedAddressId === address._id;

                return (
                  <div
                    key={address._id}
                    className={`checkout-address-card ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => handleSelectAddress(address)}
                  >
                    <div className="checkout-address-radio">
                      <div
                        className={`address-radio ${
                          isSelected ? "active" : ""
                        }`}
                      >
                        {isSelected && <span></span>}
                      </div>
                    </div>

                    <div className="checkout-address-content">
                      <div className="checkout-address-top">
                        <div className="checkout-address-labels">
                          <span className="checkout-address-type">
                            {address.addressType === "Other"
                              ? address.customType || "Other"
                              : address.addressType}
                          </span>

                          {address.isDefault && (
                            <span className="checkout-default-label">
                              DEFAULT
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="checkout-name-phone">
                        <strong>{address.fullName}</strong>

                        <span>{address.phone}</span>
                      </div>

                      <div className="checkout-address-info">
                        <p>
                          {address.addressLine}, {address.city}, {address.state}{" "}
                          {address.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="address-container">
      <h2>Address</h2>

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

      {showAddress && addressForm}

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

export default AddressContainer;
