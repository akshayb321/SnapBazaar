import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../Button/Button.jsx";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useFilter } from "../../context/FilterContext.jsx";
import toast from "react-hot-toast";

function Navbar({ onMenuClick }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const { user, logout } = useAuth();
  const { search, setSearch } = useFilter();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const profileRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    setLoading(true);

    setTimeout(() => {
      navigate("/products");
      setLoading(false);
      setShowMobileSearch(false);
    }, 1000);
  };

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

  const handleLogout = () => {
    setShowMenu(false);
    logout();
    navigate("/login");
  };

  const handleWishlistClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to view your wishlist.");
      navigate("/login");
      return;
    }

    navigate("/wishlist");
  };

  const handleCartClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to view your cart.");
      navigate("/login");
      return;
    }

    navigate("/cart");
  };

  const { cart } = useCart();

  const cartCount = cart
    ? cart.items.reduce((total, item) => {
        return total + item.quantity;
      }, 0)
    : 0;

  const { wishlist } = useWishlist();

  const wishlistCount = wishlist && wishlist.items ? wishlist.items.length : 0;

  return (
    <header className="navbar">
      {/* Menu Button */}
      <button className="mobile-menu-btn" onClick={onMenuClick}>
        <i className="fa-solid fa-bars"></i>
      </button>

      {/* Logo */}
      {!showMobileSearch && (
        <div className="navbar__logo">
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784701614/logo.png"
            alt="SnapBazzar"
          />
        </div>
      )}

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className={`navbar__search ${
          showMobileSearch ? "mobile-search-active" : ""
        }`}
      >
        <input
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus={showMobileSearch}
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
        {user ? (
          <div ref={profileRef}>
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
          <button
            className="icon-btn wishlist-btn"
            onClick={handleWishlistClick}
          >
            <i className="fa-regular fa-heart"></i>

            {wishlistCount ? (
              <span className="cart-count">{wishlistCount}</span>
            ) : null}
          </button>

          <button className="icon-btn cart-btn" onClick={handleCartClick}>
            <i className="fa-solid fa-cart-shopping"></i>

            {cartCount ? <span className="cart-count">{cartCount}</span> : null}
          </button>
        </div>
      </div>

      {/* Mobile Search Button */}
      {!showMobileSearch && (
        <button
          className="mobile-search-btn"
          onClick={() => setShowMobileSearch(true)}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      )}

      {/* Mobile Search Close */}
      {showMobileSearch && (
        <button
          className="mobile-search-close"
          onClick={() => setShowMobileSearch(false)}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      )}

      {/* Mobile Cart */}
      {!showMobileSearch && (
        <button className="mobile-cart-btn" onClick={handleCartClick}>
          <i className="fa-solid fa-cart-shopping"></i>

          {cartCount ? <span className="cart-count">{cartCount}</span> : null}
        </button>
      )}
    </header>
  );
}

export default Navbar;
