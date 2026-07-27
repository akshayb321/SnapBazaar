import React from "react";
import { assets } from "../../assets/assets.js";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext.jsx";
import { useState } from "react";
import Button from "../Button/Button.jsx";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";

function Navbar({ search, setSearch }) {
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
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
      {/* Logo */}
      <div className="navbar__logo">
        <img src={assets.logo_icon} alt="SnapBazzar" />
      </div>

      {/* Search */}
      <div className="navbar__search">
        <input
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button>
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

      {showMenu && (
        <div className="profileMenu">
          <Button
            text={"My Account"}
            icon={"fa-regular fa-user"}
            onClick={() => navigate("/profile")}
          />
          <Button text={"Address"} icon={"fa-solid fa-location-dot"} />
          <Button
            text={"Orders"}
            icon={"fa-regular fa-clipboard"}
            onClick={() => navigate("/orders")}
          />
          <Button
            text={"My List"}
            icon={"fa-regular fa-heart"}
            onClick={() => navigate("/wishlist")}
          />
          <Button
            text={"Logout"}
            icon={"fa-solid fa-arrow-right-from-bracket"}
            onClick={handleLogout}
          />
        </div>
      )}
      {/* Actions */}
      <div className="navbar__actions">
        {user ? (
          <button className="userData" onClick={() => setShowMenu(!showMenu)}>
            <div className="userIcon">
              <i className="fa-regular fa-user"></i>
            </div>

            <div className="userText">
              <p>{user.name}</p>
              <span>{user.email}</span>
            </div>
          </button>
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
