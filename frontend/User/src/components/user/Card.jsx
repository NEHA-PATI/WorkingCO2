import React from "react";

const Card = ({ title, value, change, color }) => {
  return (
    <div className="card">
      <h4>{title}</h4>
      <p className={`value ${color}`}>{value}</p>
      <span className="change">{change}</span>
    </div>
  );
};


export default Card;
