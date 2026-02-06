import React from "react";
import "../../styles/user/ActivityItem.css";

const ActivityItem = ({ titleIcon, title, detail, time, credits, imageUrl, type }) => {
  return (
    <div className="activity-item" data-type={type}>
      {/* Header */}
      <div className="activity-header">
        <div className="activity-title-wrapper">
          {titleIcon && <span className="activity-icon">{titleIcon}</span>}
          <h3 className="activity-title">{title}</h3>
        </div>
        {credits && <span className="activity-credits">{credits}</span>}
      </div>

      {/* Body: details + optional image */}
      <div className="activity-body">
        <div className="activity-details">
          {detail}
        </div>

        {imageUrl && (
          <div className="activity-tree-image">
            <img
              src={imageUrl}
              alt="Tree"
              className="tree-thumbnail"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="activity-footer">
        <span className="activity-time">{time}</span>
      </div>
    </div>
  );
};

export default ActivityItem;
