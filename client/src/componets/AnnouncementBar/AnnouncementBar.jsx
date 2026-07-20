import React from "react";
import "./AnnouncementBar.css";

function AnnouncementBar() {
  return (
    <div className="Announcement">
      <div className="left">
        <p>Get up to 50% off new season styles, limited time only</p>
      </div>
      <div className="right">
        <a href="">Help Center</a>
        <a href="">Order Tracking</a>
      </div>
    </div>
  );
}

export default AnnouncementBar;
