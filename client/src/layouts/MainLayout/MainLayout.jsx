import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Header from "../../componets/Header/Header";
import Navbar from "../../componets/Navbar/Navbar";
import Footer from "../../componets/Footer/Footer";
import ScrollToTop from "../../componets/ScrollToTop";

import { useFilter } from "../../context/FilterContext";

import "./MainLayout.css";

function MainLayout() {
  const location = useLocation();

  const { setSearch } = useFilter();

  useEffect(() => {
    // Jab Products page ke bahar jayenge
    // tab search reset hoga.
    if (location.pathname !== "/products") {
      setSearch("");
    }
  }, [location.pathname, setSearch]);

  return (
    <>
      <ScrollToTop />

      <Header />

      <div className="main-content">
        <Outlet />
      </div>

      <Footer />
    </>
  );
}

export default MainLayout;
