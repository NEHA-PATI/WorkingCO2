import React from "react";
import { FaTrophy, FaCoins, FaLeaf } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import "../styles/user/wallet.css";

const WalletPopup = ({ onClose }) => {
  return (
    <div className="wallet-popup">
      <div className="wallet-header">
        <h2>My Wallet</h2>
        <button className="close-btn" onClick={onClose}>
          <IoClose size={22} />
        </button>
      </div>

      <div className="wallet-item">
        <div className="wallet-left">
          <FaTrophy className="wallet-icon trophy" />
          <span className="wallet-label">Game Points</span>
        </div>
        <span className="wallet-value">2,450</span>
      </div>

      <div className="wallet-item">
        <div className="wallet-left">
          <FaCoins className="wallet-icon coins" />
          <span className="wallet-label">Gold Coins</span>
        </div>
        <span className="wallet-value">1,250</span>
      </div>

      <div className="wallet-item">
        <div className="wallet-left">
          <FaLeaf className="wallet-icon leaf" />
          <span className="wallet-label">Carbon Credits</span>
        </div>
        <span className="wallet-value">0.00</span>
      </div>

      <button className="marketplace-btn">Marketplace</button>
    </div>
  );
};

export default WalletPopup;
