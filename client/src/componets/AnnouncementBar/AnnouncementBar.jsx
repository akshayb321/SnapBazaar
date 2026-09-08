import React from "react";
import "./AnnouncementBar.css";
import { Link } from "react-router-dom";

function AnnouncementBar() {
  return (
    <div className="Announcement">
      <div className="left">
        <p>Get up to 50% off new season styles, limited time only</p>
      </div>
      <div className="right">
        <Link to="/about">Help Center</Link>
        <Link to="/orders">Order Tracking</Link>
      </div>
    </div>
  );
}

export default AnnouncementBar;
