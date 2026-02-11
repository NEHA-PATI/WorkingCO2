import React from "react";

const Panel = ({ title, status, children, className }) => {
  return (
    <div className="panel-card">
      <div className="panel-header">
        <h3>{title}</h3>
        <span className={`panel-status ${className || ""}`}>{status}</span>
      </div>
      <div className="panel-content">{children}</div>
    </div>
  );
};

export default Panel;
