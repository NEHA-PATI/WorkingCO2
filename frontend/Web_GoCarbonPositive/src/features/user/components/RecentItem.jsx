import React from "react";

const RecentItem = ({ name, location, status }) => {
  return (
    <div className="recent-item">
      <div><strong>{name}</strong></div>
      <div className="recent-meta">
        <span>{location}</span> · <span className="recent-status">{status}</span>
      </div>
    </div>
  );
};

export default RecentItem;
