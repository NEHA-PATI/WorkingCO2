import React from 'react';
import "../../styles/user/LoadingPopup.css";


const LoadingPopup = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="loading-popup-overlay">
      <div className="loading-popup-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading</p>
      </div>
    </div>
  );
};

export default LoadingPopup;
