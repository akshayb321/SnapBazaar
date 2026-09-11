import React, { useState } from "react";
import "./Footer.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Footer() {
  const [email, setEmail] = useState("");
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const handleToast = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Please enter your email.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email address.");
    }

    if (!checked) {
      return toast.error("Please accept the terms and conditions.");
    }

    toast.success("🎉 Thanks for subscribing!", {
      duration: 3000,
    });

    setEmail("");
    setChecked(false);
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-item" onClick={() => navigate("/about")}>
          <i className="fa-solid fa-truck"></i>
          <p>Free Delivery</p>
          <span>For all Orders Over ₹499</span>
        </div>

        <div className="footer-item" onClick={() => navigate("/about")}>
          <i className="fa-solid fa-rotate-left"></i>
          <p>7 Days Returns</p>
          <span>For an Exchange Product</span>
        </div>

        <div className="footer-item" onClick={() => navigate("/about")}>
          <i className="fa-solid fa-wallet"></i>
          <p>Secured Payment</p>
          <span>Payment Cards Accepted</span>
        </div>

        <div className="footer-item" onClick={() => navigate("/about")}>
          <i className="fa-solid fa-gift"></i>
          <p>Special Gifts</p>
          <span>On Your First Product Order</span>
        </div>

        <div className="footer-item" onClick={() => navigate("/about")}>
          <i className="fa-solid fa-headset"></i>
          <p>Support 24/7</p>
          <span>Contact Us Anytime</span>
        </div>
      </div>

      <hr />

      <div className="footer-mid">
        {/* Brand */}
        <div className="mid-item">
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784701614/logo.png"
            alt="SnapBazaar Logo"
          />

          <p>
            A modern e-commerce experience built with <br />
            the MERN stack — designed for seamless shopping,
            <br />
            clean UI, and real-world functionality.
          </p>

          <div className="social-media">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/akshay-bachhav-"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <i className="fa-brands fa-linkedin-in"></i>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/akshayb321/SnapBazaar"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <i className="fa-brands fa-github"></i>
            </a>

            {/* Gmail */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=akshaybachhav172@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email"
            >
              <i className="fa-solid fa-envelope"></i>
            </a>

            {/* X */}
            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
            >
              <i className="fa-brands fa-x-twitter"></i>
            </a>
          </div>
        </div>

        {/* Explore */}
        <div className="mid-item">
          <p>Explore</p>

          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>

            <li>
              <Link to="/products">Products</Link>
            </li>

            <li>
              <Link to="/products">Categories</Link>
            </li>

            <li>
              <Link to="/home">Offers</Link>
            </li>
          </ul>
        </div>

        {/* Customer */}
        <div className="mid-item">
          <p>Customer</p>

          <ul>
            <li>
              <Link to="/wishlist">Wishlist</Link>
            </li>

            <li>
              <Link to="/cart">Cart</Link>
            </li>

            <li>
              <Link to="/orders">Orders</Link>
            </li>

            <li>
              <Link to="/about">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="mid-item">
          <p>Subscribe to Newsletter</p>

          <form onSubmit={handleToast}>
            <span>
              Subscribe to our latest newsletter to receive updates and
              exclusive offers.
            </span>

            <input
              type="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit" className="subscribe">
              Subscribe
            </button>

            <div className="mid-cheexkbox">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />

              <p>I agree to the terms and conditions and the privacy policy.</p>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-end">
        <p>
          © 2026 SnapBazaar. Designed & Developed with ❤️ by Akshay Bachhav.
        </p>

        <div className="payment-mode">
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784661800/paymentIcons.png"
            alt="Payment Methods"
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
