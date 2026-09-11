import React, { useEffect, useRef, useState } from "react";

import "./Navbar.css";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../Button/Button.jsx";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useFilter } from "../../context/FilterContext.jsx";

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);

  const { user, logout } = useAuth();
  const { search, setSearch } = useFilter();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Profile section + menu ko track karega
  const profileRef = useRef(null);

  // ================= SEARCH =================
  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    setLoading(true);

    setTimeout(() => {
      navigate("/products");
      setLoading(false);
    }, 1000);
  };

  // ================= OUTSIDE CLICK =================
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // ================= LOGOUT =================
  const handleLogout = () => {
    setShowMenu(false);
    logout();
    navigate("/login");
  };

  // ================= CART =================
  const { cart } = useCart();

  const cartCount = cart
    ? cart.items.reduce((total, item) => {
        return total + item.quantity;
      }, 0)
    : 0;

  // ================= WISHLIST =================
  const { wishlist } = useWishlist();

  const wishlistCount = wishlist && wishlist.items ? wishlist.items.length : 0;

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="navbar__logo">
        <img
          src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784701614/logo.png"
          alt="SnapBazzar"
        />
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="navbar__search">
        <input
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? (
            <i className="fa-solid fa-spinner fa-spin navbar-loader"></i>
          ) : (
            <i className="fa-solid fa-magnifying-glass"></i>
          )}
        </button>
      </form>

      {/* Actions */}
      <div className="navbar__actions">
        {/* USER + PROFILE MENU */}
        {user ? (
          <div ref={profileRef}>
            {/* User Data */}
            <button
              className="userData"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <div className="userIcon">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="User Profile" />
                ) : (
                  <i className="fa-regular fa-user"></i>
                )}
              </div>

              <div className="userText">
                <p>{user.name}</p>
                <span>{user.email}</span>
              </div>
            </button>

            {/* Profile Menu */}
            {showMenu && (
              <div className="profileMenu">
                <Button
                  text="My Account"
                  icon="fa-regular fa-user"
                  onClick={() => {
                    navigate("/profile");
                    setShowMenu(false);
                  }}
                />

                <Button
                  text="Address"
                  icon="fa-solid fa-location-dot"
                  onClick={() => {
                    navigate("/address");
                    setShowMenu(false);
                  }}
                />

                <Button
                  text="Orders"
                  icon="fa-regular fa-clipboard"
                  onClick={() => {
                    navigate("/orders");
                    setShowMenu(false);
                  }}
                />

                <Button
                  text="My List"
                  icon="fa-regular fa-heart"
                  onClick={() => {
                    navigate("/wishlist");
                    setShowMenu(false);
                  }}
                />

                <Button
                  text="Logout"
                  icon="fa-solid fa-arrow-right-from-bracket"
                  onClick={handleLogout}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="auth">
            <button className="login-btn" onClick={() => navigate("/login")}>
              <span>Login</span>
            </button>

            <p>|</p>

            <button
              className="Register-btn"
              onClick={() => navigate("/signup")}
            >
              <span>Register</span>
            </button>
          </div>
        )}

        {/* Wishlist & Cart */}
        <div className="btn">
          <button className="icon-btn" onClick={() => navigate("/wishlist")}>
            <i className="fa-regular fa-heart"></i>

            {wishlistCount ? (
              <span className="cart-count">{wishlistCount}</span>
            ) : null}
          </button>

          <button
            className="icon-btn cart-btn"
            onClick={() => navigate("/cart")}
          >
            <i className="fa-solid fa-cart-shopping"></i>

            {cartCount ? <span className="cart-count">{cartCount}</span> : null}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
