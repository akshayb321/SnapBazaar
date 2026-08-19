import Header from "../../componets/Header/Header";

import { Outlet } from "react-router-dom";
import Navbar from "../../componets/Navbar/Navbar";
import Footer from "../../componets/Footer/Footer";
import ScrollToTop from "../../componets/ScrollToTop";
import "./MainLayout.css";

function MainLayout() {
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
