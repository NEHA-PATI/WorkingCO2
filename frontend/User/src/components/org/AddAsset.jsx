import React, { useState } from "react";
import "../../styles/org/AddAsset.css";
import PopupForms from "./popupforms";

import { LuTreePine } from "react-icons/lu";
import { MdSolarPower } from "react-icons/md";

import { MdElectricCar } from "react-icons/md";
import { GiWindmill } from "react-icons/gi";
import { GiWaterMill } from "react-icons/gi";
import { GiPowder } from "react-icons/gi";
import { FaFire } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddAsset = () => {
  const [activeEVPopup, setActiveEVPopup] = useState(false);
  const [activeTreePopup, setActiveTreePopup] = useState(false);
  const [activeSolarPopup, setActiveSolarPopup] = useState(false);

  const [evCount, setEvCount] = useState(0);
  const [solarCount, setSolarCount] = useState(0);

  const navigate = useNavigate();

  const handleSaveEV = async (formData) => {
    // If formData already has ev_id, it means it's saved data from popupforms
    if (formData && formData.ev_id) {
      console.log("EV already saved:", formData);
      setActiveEVPopup(false);
      // Stay on the same page after successful save
      return;
    }

    // This path should not be reached since popupforms handles the API call
    try {
      const res = await axios.post(
        "http://localhost:8080/api/evmasterdata",
        formData
      );
      setEvCount(res.data.evCount);
      setActiveEVPopup(false);
      // Stay on the same page after successful save
    } catch (error) {
      console.error("Error saving EV:", error);
      // Don't close popup on error, let the user see the error message
    }
  };

  const handleSaveTree = (data) => {
    console.log("Saved Tree:", data);
    setActiveTreePopup(false);
    // Stay on the same page after successful save
  };

  const handleSaveSolar = (data) => {
    console.log("Saved Solar:", data);
    setSolarCount(solarCount + 1);
    setActiveSolarPopup(false);
    // Stay on the same page after successful save
  };

  return (
    <div className="dashboard-container">
      <div className="card electric-vehicle">
        <MdElectricCar className="card-icon" style={{ color: "#3b82f6" }} />

        <h2>Electric Vehicle</h2>
        <p className="subtitle">Smart mobility tracking</p>
        <button
          className="add-button blue"
          onClick={() => setActiveEVPopup(true)}
        >
          + Add EV Details
        </button>
      </div>

      <div className="card trees">
        <LuTreePine className="card-icon" style={{ color: "#10b981" }} />
        <h2>Trees</h2>
        <p className="subtitle">Nature conservation</p>
        <button
          className="add-button green"
          onClick={() => setActiveTreePopup(true)}
        >
          + Add Tree Details
        </button>
      </div>

      <div className="card solar-panel">
        <MdSolarPower className="card-icon" style={{ color: "#f59e0b" }} />
        <h2>Solar Panel</h2>
        <p className="subtitle">Renewable energy</p>
        <button
          className="add-button orange"
          onClick={() => setActiveSolarPopup(true)}
        >
          + Add Solar Details
        </button>
      </div>

      <div className="card solar-panel">
        <GiWindmill className="card-icon" style={{ color: "D3F3FF" }} />
        <h2>Wind Mill</h2>
        <p className="subtitle">Renewable energy</p>
        <button
          className="add-button orange"
          onClick={() => setActiveSolarPopup(true)}
        >
          + Add WindMill Details
        </button>
      </div>

      <div className="card solar-panel">
        <GiWaterMill className="card-icon" style={{ color: "8ed1e3" }} />
        <h2>Hydro Power</h2>
        <p className="subtitle">Renewable energy</p>
        <button
          className="add-button d4f1f9"
          style={{ color: "white" }}
          onClick={() => setActiveSolarPopup(true)}
        >
          + Add HydroPower Details
        </button>
      </div>

      <div className="card solar-panel">
        <GiPowder className="card-icon" style={{ color: "32454D" }} />
        <h2>Carbon Capture</h2>
        <p className="subtitle">Renewable energy</p>
        <button
          className="add-button "
          style={{ color: "white" }}
          onClick={() => setActiveSolarPopup(true)}
        >
          + Add CarbonCapture Details
        </button>
      </div>

      <div className="card solar-panel">
        <FaFire className="card-icon" style={{ color: "#e25822" }} />
        <h2>Thermal Power</h2>
        <p className="subtitle">Renewable energy</p>
        <button
          className="add-button orange"
          style={{ color: "white" }}
          onClick={() => setActiveSolarPopup(true)}
        >
          + Add CarbonCapture Details
        </button>
      </div>

      <PopupForms
        activeEVPopup={activeEVPopup}
        setActiveEVPopup={setActiveEVPopup}
        activeTreePopup={activeTreePopup}
        setActiveTreePopup={setActiveTreePopup}
        activeSolarPopup={activeSolarPopup}
        setActiveSolarPopup={setActiveSolarPopup}
        handleSaveEV={handleSaveEV}
        handleSaveTree={handleSaveTree}
        handleSaveSolar={handleSaveSolar}
        setEvCount={setEvCount}
        setSolarCount={setSolarCount}
      />
    </div>
  );
};

export default AddAsset;
