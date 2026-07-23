import React, { useState } from "react";
import "./Footer.css";
import Button from "../Button/Button";
import toast from "react-hot-toast";

function Footer() {
  const [email, setEmail] = useState("");
  const [checked, setChecked] = useState(false);

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
    <div className="footer">
      <div className="footer-top">
        <div className="footer-item">
          <i className="fa-solid fa-truck"></i>
          <p>Free Delivery</p>
          <span>For all Orders Over ₹499</span>
        </div>

        <div className="footer-item">
          <i className="fa-solid fa-rotate-left"></i>
          <p>7 Days Returns</p>
          <span>For an Exchange Product</span>
        </div>

        <div className="footer-item">
          <i className="fa-solid fa-wallet"></i>
          <p>Secured Payment</p>
          <span>Payment Cards Accepted</span>
        </div>

        <div className="footer-item">
          <i className="fa-solid fa-gift"></i>
          <p>Special Gifts</p>
          <span>On Your First Product Order</span>
        </div>

        <div className="footer-item">
          <i className="fa-solid fa-headset"></i>
          <p>Support 24/7</p>
          <span>Contact Us Anytime</span>
        </div>
      </div>

      <hr />

      <div className="footer-mid">
        <div className="mid-item">
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784701614/logo.png"
            alt="SnapBazaar"
          />

          <p>
            Premium shopping experience with quality
            <br />
            products at unbeatable prices.
          </p>
          <div className="social-media">
            <a href="">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>

            <a href="">
              <i className="fa-brands fa-instagram"></i>
            </a>

            <a href="">
              <i className="fa-brands fa-facebook-f"></i>
            </a>

            <a href="">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
          </div>
        </div>

        <div className="mid-item">
          <p>Explore</p>

          <ul>
            <li>
              <a href="">Home</a>
            </li>
            <li>
              <a href="">Products</a>
            </li>
            <li>
              <a href="">Categories</a>
            </li>
            <li>
              <a href="">Offers</a>
            </li>
          </ul>
        </div>

        <div className="mid-item">
          <p>Customer</p>

          <ul>
            <li>
              <a href="">Wishlist</a>
            </li>
            <li>
              <a href="">Cart</a>
            </li>
            <li>
              <a href="">Orders</a>
            </li>
            <li>
              <a href="">Support</a>
            </li>
          </ul>
        </div>

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
    </div>
  );
}

export default Footer;
