import React, { useState } from 'react';
import '../styles/AddAsset.css';
import PopupForms from './popupforms';

import { MdSolarPower, MdElectricCar } from "react-icons/md";
import { GiWindmill, GiWaterMill, GiPowder } from "react-icons/gi";
import { FaFire } from "react-icons/fa";
import { LuTreePine } from "react-icons/lu"; // 🌱 Plantation icon

import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddAsset = () => {

  // ✅ Popup states
  const [activeEVPopup, setActiveEVPopup] = useState(false);
  const [activeSolarPopup, setActiveSolarPopup] = useState(false);
  const [activePlantationPopup, setActivePlantationPopup] = useState(false);

  // Counts
  const [evCount, setEvCount] = useState(0);
  const [solarCount, setSolarCount] = useState(0);

  const navigate = useNavigate();

  /* =======================
      CALLBACK HANDLERS
  ======================= */

  const handleSaveEV = async (formData) => {
    if (formData && formData.ev_id) {
      console.log('EV already saved:', formData);
      setActiveEVPopup(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/evmasterdata", formData);
      setEvCount(res.data.evCount);
      setActiveEVPopup(false);
    } catch (error) {
      console.error("Error saving EV:", error);
    }
  };

  const handleSaveSolar = (data) => {
    console.log('Saved Solar:', data);
    setSolarCount(prev => prev + 1);
    setActiveSolarPopup(false);
  };

  const handleSavePlantation = (data) => {
    console.log('Saved Plantation:', data);
    setActivePlantationPopup(false);
  };

  /* =======================
          UI
  ======================= */

  return (
    <div className="dashboard-container">

      {/* EV */}
      <div className="card electric-vehicle">
        <h2 className="card-title">
          <MdElectricCar className="card-icon" style={{ color: "#3b82f6" }} />
          Electric Vehicle
        </h2>
        <p className="subtitle">Smart mobility tracking</p>
        <button className="add-button blue" onClick={() => setActiveEVPopup(true)}>
          + Add EV Details
        </button>
      </div>

      {/* 🌱 Plantation */}
      <div className="card trees">
        <h2 className="card-title">
          <LuTreePine className="card-icon" style={{ color: "#10b981" }} />
          Plantation
        </h2>
        <p className="subtitle">Afforestation & land restoration</p>
        <button className="add-button green" onClick={() => setActivePlantationPopup(true)}>
          + Add Plantation Details
        </button>
      </div>

      {/* Solar */}
      <div className="card solar-panel">
        <h2 className="card-title">
          <MdSolarPower className="card-icon" style={{ color: "#f59e0b" }} />
          Solar Panel
        </h2>
        <p className="subtitle">Renewable energy</p>
        <button className="add-button orange" onClick={() => setActiveSolarPopup(true)}>
          + Add Solar Details
        </button>
      </div>

      {/* Wind */}
      <div className="card solar-panel">
        <h2 className="card-title">
          <GiWindmill className="card-icon" style={{ color: "#D3F3FF" }} />
          Wind Mill
        </h2>
        <p className="subtitle">Renewable energy</p>
        <button className="add-button orange">
          + Add WindMill Details
        </button>
      </div>

      {/* Hydro */}
      <div className="card solar-panel">
        <h2 className="card-title">
          <GiWaterMill className="card-icon" style={{ color: "#8ed1e3" }} />
          Hydro Power
        </h2>
        <p className="subtitle">Renewable energy</p>
        <button className="add-button d4f1f9" style={{ color: "white" }}>
          + Add HydroPower Details
        </button>
      </div>

      {/* Carbon Capture */}
      <div className="card solar-panel">
        <h2 className="card-title">
          <GiPowder className="card-icon" style={{ color: "#32454D" }} />
          Carbon Capture
        </h2>
        <p className="subtitle">Negative emission tech</p>
        <button className="add-button" style={{ color: "white" }}>
          + Add CarbonCapture Details
        </button>
      </div>

      {/* Thermal */}
      <div className="card solar-panel">
        <h2 className="card-title">
          <FaFire className="card-icon" style={{ color: "#e25822" }} />
          Thermal Power
        </h2>
        <p className="subtitle">Energy production</p>
        <button className="add-button orange" style={{ color: "white" }}>
          + Add Thermal Details
        </button>
      </div>

      {/* =======================
             POPUPS
      ======================= */}

      <PopupForms
        activeEVPopup={activeEVPopup}
        setActiveEVPopup={setActiveEVPopup}

        activeSolarPopup={activeSolarPopup}
        setActiveSolarPopup={setActiveSolarPopup}

        activePlantationPopup={activePlantationPopup}
        setActivePlantationPopup={setActivePlantationPopup}

        handleSaveEV={handleSaveEV}
        handleSaveSolar={handleSaveSolar}
        handleSavePlantation={handleSavePlantation}

        setEvCount={setEvCount}
        setSolarCount={setSolarCount}
      />

    </div>
  );
};

export default AddAsset;
