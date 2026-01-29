import React from "react";

const InfoBlock = ({ label, value }) => {
  return (
    <div className="info-block">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
};

export default InfoBlock;
