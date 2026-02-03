import React from "react";

const VehicleItem = ({ name, distance, status }) => {
  return (
    <div className="vehicle-item">
      <div className="vehicle-name">{name}</div>
      <div className="vehicle-meta">
        <span>{distance}</span> · <span className="vehicle-status">{status}</span>
      </div>
    </div>
  );
};

export default VehicleItem;
