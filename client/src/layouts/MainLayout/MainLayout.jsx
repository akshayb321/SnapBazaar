import React from "react";
import Header from "../../componets/Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../../componets/Footer/Footer";
import "./MainLayout.css";

function MainLayout() {
  return (
    <>
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default MainLayout;
