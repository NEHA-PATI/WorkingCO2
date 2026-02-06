import React, { useState } from "react";
import "../styles/user/upload.css";

import { LuTreePine } from "react-icons/lu";
import { MdSolarPower } from "react-icons/md";
import { FaPenNib } from "react-icons/fa";
import { MdElectricCar } from "react-icons/md";

import PopupForms from "../components/user/popupform";
import axios from "axios";

const Upload = () => {
  const [activeEVPopup, setActiveEVPopup] = useState(false);
  const [activeTreePopup, setActiveTreePopup] = useState(false);
  const [activeSolarPopup, setActiveSolarPopup] = useState(false);

  const [, setEvCount] = useState(0);
  const [solarCount, setSolarCount] = useState(0);

  // const handleSaveEV = (data) => {
  //   console.log('Saved EV:', data);
  //   setEvCount(evCount + 1);
  //   setActiveEVPopup(false);
  // };
  const handleSaveEV = async (formData) => {
    try {
      const res = await axios.post(
        "https://add-asset-service.onrender.com/api/evmasterdata",
        formData
      );

      // eslint-disable-next-line no-undef
      setEvList((prev) => [...prev, res.data.data]);
      setEvCount(res.data.evCount);
      setActiveEVPopup(false);
    } catch (error) {
      console.error("Error saving EV:", error);
    }
  };

  const handleSaveTree = (data) => {
    console.log("Saved Tree:", data);
    setActiveTreePopup(false);
  };

  const handleSaveSolar = (data) => {
    console.log("Saved Solar:", data);
    setSolarCount(solarCount + 1);
    setActiveSolarPopup(false);
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

export default Upload;
