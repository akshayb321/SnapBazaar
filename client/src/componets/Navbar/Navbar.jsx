import React from "react";
import { assets } from "../../assets/assets.js";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext.jsx";
import { useState } from "react";
import Button from "../Button/Button.jsx";
import { useNavigate } from "react-router-dom";

function Navbar({ search, setSearch, category, setCategory }) {
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
          <Button text={"My Account"} icon={"fa-regular fa-user"} />
          <Button text={"Address"} icon={"fa-solid fa-location-dot"} />
          <Button text={"Orders"} icon={"fa-regular fa-clipboard"} />
          <Button text={"My List"} icon={"fa-regular fa-heart"} />
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
            <button className="login-btn">
              <span>Login</span>
            </button>
            <p>|</p>

            <button className="Register-btn">
              <span>Register</span>
            </button>
          </div>
        )}

        <div className="btn">
          <button className="icon-btn">
            <i className="fa-regular fa-heart"></i>
            <span className="cart-count">1</span>
          </button>
          <button className="icon-btn cart-btn">
            <i className="fa-solid fa-cart-shopping"></i>
            <span className="cart-count">2</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
