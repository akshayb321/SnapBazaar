import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import API_URL from "../../config/api.js";
import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");

        if (!adminToken) {
          navigate("/admin/login", { replace: true });
          return;
        }

        const response = await axios.get(`${API_URL}/api/admin/auth/me`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        setAdmin(response.data.user);
      } catch (error) {
        console.error("Failed to fetch admin:", error);

        localStorage.removeItem("adminToken");

        navigate("/admin/login", { replace: true });
      }
    };

    fetchAdmin();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <div className="admin-brand">
            <div className="admin-brand-icon">
              <i className="fa-solid fa-bag-shopping"></i>
            </div>

            <div className="admin-brand-text">
              <h2>
                Snap<span>Bazaar</span>
              </h2>

              <p>Admin Panel</p>
            </div>
          </div>

          <nav className="admin-nav">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => (isActive ? "admin-active" : "")}
            >
              <span className="admin-nav-icon">
                <i className="fa-solid fa-chart-pie"></i>
              </span>

              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/products"
              className={({ isActive }) => (isActive ? "admin-active" : "")}
            >
              <span className="admin-nav-icon">
                <i className="fa-solid fa-box"></i>
              </span>

              <span>Products</span>
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={({ isActive }) => (isActive ? "admin-active" : "")}
            >
              <span className="admin-nav-icon">
                <i className="fa-solid fa-cart-shopping"></i>
              </span>

              <span>Orders</span>
            </NavLink>
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <h1>Admin Panel</h1>
            <p>Manage your SnapBazaar store</p>
          </div>

          <div className="admin-profile">
            <div className="admin-profile-icon">
              <i className="fa-solid fa-user-shield"></i>
            </div>

            <div className="admin-profile-info">
              <strong>{admin?.name || "Loading..."}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
