// PopupForms.js - React component file with all three popup forms
import React, { useState } from 'react';
import "@features/org/styles/popupforms.css";
import { assetAPI } from "@features/org/services/assetApi";
import { MdElectricCar, MdSolarPower } from "react-icons/md";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { GiPowder } from "react-icons/gi";
import AddPlantationModal from "@features/org/components/AddPlantationModal";
const PopupForms = ({
  activeEVPopup,
  setActiveEVPopup,
  activeSolarPopup,
  setActiveSolarPopup,
  activePlantationPopup,
  setActivePlantationPopup,
  activeCapturePopup,
  setActiveCapturePopup,
  handleSaveEV,
  handleSavePlantation,
  handleSaveSolar,
  handleSaveCapture,
  setEvCount,
  setSolarCount // ✅ Add this line!
}) => {

  // State for managing popups

  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const [solarPanelData, setSolarPanelData] = useState({
    Installed_Capacity: '',
    Installation_Date: '',
    Energy_Generation_Value: '',
    Energy_Generation: '',
    Grid_Emission_Factor: '',
    Inverter_Type: '',
    Panel_Efficiency: ''
  });



  const [evData, setEVData] = useState({
    manufacturer: '',
    model: '',
    year: '',
    batteryconsumed: '', // ✅ Fixed: Was batteryCapacity, caused uncontrolled input
    range: '',
    EVCategory: '',
    chargingType: '',
    gridEmissionFactor: '', // ✅ Fixed: Added to state
    topSpeed: '', // ✅ Fixed: Added to state
    chargingTime: '', // ✅ Fixed: Added to state
    motorpower: '', // ✅ Fixed: Added to state
  });
  const [captureData, setCaptureData] = useState({
    industryType: "",
    totalEmission: "",
    captureTechnology: "",
    captureEfficiency: "",
  });
  const [captureTouched, setCaptureTouched] = useState({
    industryType: false,
    totalEmission: false,
    captureTechnology: false,
    captureEfficiency: false,
  });

  // Toast notification handler
  const showToast = (message, type = 'success') => {
    console.log('🔔 Showing toast:', message, type);
    setToast({ show: true, message, type });
    setTimeout(() => {
      console.log('🔔 Hiding toast');
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const validateCaptureField = (name, value) => {
    if (name === "industryType") {
      if (!value) return "Industry Type is required";
      return "";
    }

    if (name === "totalEmission") {
      if (value === "") return "Total Emission is required";
      if (Number(value) <= 0) return "Total Emission must be greater than 0";
      return "";
    }

    if (name === "captureTechnology") {
      if (!value) return "Capture Technology is required";
      return "";
    }

    if (name === "captureEfficiency") {
      if (value === "") return "Capture Efficiency is required";
      const numericValue = Number(value);
      if (numericValue < 0 || numericValue > 100) return "Capture Efficiency must be between 0 and 100";
      return "";
    }

    return "";
  };

  const captureErrors = {
    industryType: validateCaptureField("industryType", captureData.industryType),
    totalEmission: validateCaptureField("totalEmission", captureData.totalEmission),
    captureTechnology: validateCaptureField("captureTechnology", captureData.captureTechnology),
    captureEfficiency: validateCaptureField("captureEfficiency", captureData.captureEfficiency),
  };

  const hasCaptureErrors = Object.values(captureErrors).some(Boolean);

  const handleCaptureChange = (name, value) => {
    setCaptureData((prev) => ({ ...prev, [name]: value }));
    setCaptureTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleCaptureBlur = (name) => {
    setCaptureTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleCaptureSubmit = async (e) => {
    e.preventDefault();

    setCaptureTouched({
      industryType: true,
      totalEmission: true,
      captureTechnology: true,
      captureEfficiency: true,
    });

    if (hasCaptureErrors) {
      showToast("Please fix validation errors before submitting.", "error");
      return;
    }

    const authUserRaw = localStorage.getItem("authUser");
    const authUser = authUserRaw ? JSON.parse(authUserRaw) : null;
    const orgId =
      authUser?.org_id ||
      authUser?.u_id ||
      localStorage.getItem("orgId") ||
      localStorage.getItem("userId");

    if (!orgId) {
      showToast("Organization ID not found. Please login again.", "error");
      return;
    }

    const payload = {
      c_uid: crypto.randomUUID(),
      org_id: orgId,
      industry_type: captureData.industryType,
      total_emission_tonnes_per_year: Number(captureData.totalEmission),
      capture_technology: captureData.captureTechnology,
      capture_efficiency_percent: Number(captureData.captureEfficiency),
    };

    try {
      const result = await assetAPI.createCarbonCapture(payload);
      if (result?.success) {
        handleSaveCapture?.(result.data);
        showToast("Carbon Capture details saved successfully.", "success");
        setCaptureData({
          industryType: "",
          totalEmission: "",
          captureTechnology: "",
          captureEfficiency: "",
        });
        setCaptureTouched({
          industryType: false,
          totalEmission: false,
          captureTechnology: false,
          captureEfficiency: false,
        });
        setActiveCapturePopup(false);
      } else {
        showToast(result?.message || "Failed to save Carbon Capture asset.", "error");
      }
    } catch (error) {
      showToast(error?.message || "Server error while saving Carbon Capture asset.", "error");
    }
  };
  const handlePlantationSubmit = async (payload) => {
    const authUserRaw = localStorage.getItem("authUser");
    const authUser = authUserRaw ? JSON.parse(authUserRaw) : null;
    const orgId =
      authUser?.org_id ||
      authUser?.u_id ||
      localStorage.getItem("orgId") ||
      localStorage.getItem("userId");

    if (!orgId) {
      showToast("Organization ID not found. Please login again.", "error");
      return;
    }

    const step1 = payload?.step1 || {};
    const step2 = payload?.step2 || {};
    const points = payload?.points || [];

    const apiPayload = {
      org_id: orgId,
      plantation_name: String(step1.name || "").trim(),
      plantation_date: step1.date,
      total_area: Number(step1.area),
      area_unit: step1.areaUnit,
      manager_name: String(step1.managerName || "").trim(),
      manager_contact: String(step1.managerContact || "").trim(),
      trees_planted: Number(step2.treesCount),
      species_name: String(step2.speciesName || "").trim(),
      plant_age_years: Number(step2.plantAge),
      points: points.map((pt) => ({ lat: Number(pt.lat), lng: Number(pt.lng) })),
    };

    try {
      const result = await assetAPI.createPlantation(apiPayload);
      if (result?.success) {
        handleSavePlantation?.(result.data);
        showToast("Plantation details added successfully", "success");
        setActivePlantationPopup(false);
        return true;
      } else {
        showToast(result?.message || "Failed to save plantation", "error");
        return false;
      }
    } catch (error) {
      showToast(error?.message || "Server error while saving plantation", "error");
      return false;
    }
  };

  const handleSolarSubmit = async (e) => {
    e.preventDefault();

    // Get user ID from localStorage
    const U_ID = localStorage.getItem("userId");
    if (!U_ID) {
      showToast("User ID not found. Please log in first.", "error");
      return;
    }

    const payload = {
      SUID: crypto.randomUUID(),
      U_ID,
      Installed_Capacity: solarPanelData.Installed_Capacity,
      Installation_Date: solarPanelData.Installation_Date,
      Energy_Generation_Value: Number(solarPanelData.Energy_Generation_Value),

      Grid_Emission_Factor: Number(solarPanelData.Grid_Emission_Factor),
      Inverter_Type: solarPanelData.Inverter_Type,

    };

    // ✅ Debug log
    console.log('Submitting Solar Panel Payload:', payload);

    // ✅ Quick client-side validation
    const missingFields = Object.entries(payload).filter(([_, val]) =>
      val === undefined || val === null || val === '' || (typeof val === 'string' && val.trim() === '')
    );

    if (missingFields.length > 0) {
      showToast(`Missing fields: ${missingFields.map(f => f[0]).join(', ')}`, 'error');
      return;
    }

    try {
      const result = await assetAPI.createSolar(payload);

      if (result.status === 'success') {
        const { data: savedSolar, solarCount } = result;
        setSolarCount(solarCount);
        showToast(`Solar Panel saved! Total: ${solarCount}`, 'success');
        // Let AddAsset.jsx handle the popup closing and navigation
        handleSaveSolar(savedSolar);
      } else {
        showToast('Failed: ' + (result.message || 'Unknown error'), 'error');
      }
    } catch (err) {
      showToast('Server error: ' + err.message, 'error');
    }
  };



  const handleEVSubmit = async (e) => {
    e.preventDefault();

    // ✅ 1. Auth Validation (Robust)
    const U_ID = localStorage.getItem("userId");
    if (!U_ID || U_ID === "undefined" || U_ID === "null") {
      showToast("Session invalid. Please log in again.", "error");
      return;
    }

    // 📦 2. Payload Construction (Aligned with State & Backend)
    const payload = {
      VUID: crypto.randomUUID(),
      U_ID, // Backend expects u_id
      Category: evData.EVCategory,
      Manufacturers: evData.manufacturer,
      Model: evData.model,
      Purchase_Year: Number(evData.year),
      Energy_Consumed: Number(evData.batteryconsumed), // ✅ Fixed key mapping
      Primary_Charging_Type: evData.chargingType,
      Range: Number(evData.range),
      Grid_Emission_Factor: Number(evData.gridEmissionFactor),
      // ✅ Optional fields validation: valid number or null
      Top_Speed: evData.topSpeed ? Number(evData.topSpeed) : null,
      Charging_Time: evData.chargingTime ? Number(evData.chargingTime) : null,
      Motor_Power: evData.motorpower ? String(evData.motorpower) : null // Backend might expect string or number, safely handling
    };

    // ✅ Debug log
    console.log('🔍 Submitting EV Payload:', payload);

    try {
      const result = await assetAPI.createEV(payload);

      if (result.status === 'success') {
        const { data: savedEV, evCount } = result;

        // ✅ Only call if it's a valid function
        if (typeof setEvCount === 'function') {
          setEvCount(evCount);
        }

        showToast(`EV saved! Total EVs: ${evCount}`, 'success');

        // ✅ Save new activity to localStorage
        const newActivity = {
          title: "EV Added",
          detail: `${evData.manufacturer} ${evData.model} - ${evData.range} km range`,
          time: "Just now",
          credits: 20,            // Adjust as per logic
          color: "bg-blue-100"
        };

        localStorage.setItem("latestActivity", JSON.stringify(newActivity));

        // Let AddAsset.jsx handle the popup closing and navigation
        handleSaveEV(savedEV);
      } else {
        showToast('Failed to save EV: ' + (result.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error("EV submit error:", error);
      showToast('Server error! ' + error.message, 'error');
    }
  };

  return (
    <div>
      {/* EV Popup */}
      {activeEVPopup && (
      <div className={`popup-overlay ${activeEVPopup ? 'active' : ''}`} onClick={() => setActiveEVPopup(false)}>
        <div className={`popup ${activeEVPopup ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
          <div className="popup-header">
            <h2>
              <MdElectricCar size={28} color="#3b82f6" />
              Electric Vehicle Details
            </h2>
            <button className="popup-close" onClick={() => setActiveEVPopup(false)}>×</button>
          </div>
          <form onSubmit={handleEVSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="EVCategory">Vehicle Category</label>
                <select
                  id="EVCategory"
                  className="form-control"
                  value={evData.EVCategory}
                  onChange={(e) => setEVData({ ...evData, EVCategory: e.target.value })}
                  required
                >
                  <option value="" disabled hidden>
                    -- Select Vehicle Category --
                  </option>
                  <option value="Two-Wheelers">Two-Wheelers</option>
                  <option value="Three-Wheeler">Three-Wheeler </option>
                  <option value="Hatchbacks">Hatchbacks</option>
                  <option value="Sedans">Sedans</option>
                  <option value="SUVs">SUVs</option>
                  <option value="MPVs">MPVs</option>
                  <option value="Buses">Buses</option>
                  <option value="Trucks">Trucks</option>
                  <option value="Vans">Vans</option>
                  <option value="Tractors">Tractors</option>
                  <option value="nForklifts">Forklifts</option>
                  <option value="NEVs">NEVs</option>
                  <option value="Golf Carts">Golf Carts</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="ev-manufacturer">Manufacturer</label>
                <input
                  type="text"
                  id="ev-manufacturer"
                  className="form-control"
                  placeholder="e.g., Tesla, Nissan, Chevrolet"
                  value={evData.manufacturer}
                  onChange={(e) => setEVData({ ...evData, manufacturer: e.target.value })}
                  required
                />
              </div>
            </div>




            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ev-model">Model</label>
                <input
                  type="text"
                  id="ev-model"
                  className="form-control"
                  placeholder="e.g., Model 3, Leaf, Bolt"
                  value={evData.model}
                  onChange={(e) => setEVData({ ...evData, model: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="ev-year">Purchase Year</label>
                <input
                  type="number"
                  id="ev-year"
                  className="form-control"
                  placeholder="e.g., 2022"
                  min="2000"
                  max="2030"
                  value={evData.year}
                  onChange={(e) => setEVData({ ...evData, year: e.target.value })}
                  required
                />
              </div>
            </div>



            <div className="form-row">
              <div className="form-group">
                <label htmlFor="energyConsumed">Energy consumed(kWh)</label>
                <input
                  type="number"
                  id="energyconsumed"
                  className="form-control"
                  placeholder="e.g., 75"
                  step="0.1"
                  min="1"
                  value={evData.batteryconsumed}
                  onChange={(e) => setEVData({ ...evData, batteryconsumed: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="chargingType">Primary Charging Type</label>
                <select
                  id="chargingType"
                  className="form-control"
                  value={evData.chargingType}
                  onChange={(e) => setEVData({ ...evData, chargingType: e.target.value })}
                  required
                >
                  <option value="" disabled hidden>
                    -- Select Charging Type --
                  </option>
                  <option value="level1">Level 1 (120V)</option>
                  <option value="level2">Level 2 (240V)</option>
                  <option value="dcfast">DC Fast Charging</option>
                  <option value="tesla">Tesla Supercharger</option>
                </select>
              </div>
            </div>



            <div className="form-row">
              <div className="form-group">
                <label htmlFor="range">Range (Km) </label>
                <input
                  type="number"
                  id="range"
                  className="form-control"
                  placeholder="e.g., 300"
                  min="1"
                  value={evData.range}
                  onChange={(e) => setEVData({ ...evData, range: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="gridEmissionFactor">Grid Emission Factor</label>
                <input
                  type="number"
                  id="gridEmissionFactor"
                  className="form-control"
                  placeholder="e.g., 5 "
                  min="0"
                  value={evData.gridEmissionFactor}
                  onChange={(e) => setEVData({ ...evData, gridEmissionFactor: e.target.value })}
                  required
                />
              </div>
            </div>




            <div className="form-row">

              <div className="form-group">
                <label htmlFor="topSpeed">Top Speed (km/h)</label>
                <input
                  type="number"
                  id="topSpeed"
                  className="form-control"
                  placeholder="e.g., 80"
                  min="0"
                  value={evData.topSpeed}
                  onChange={(e) => setEVData({ ...evData, topSpeed: e.target.value })}
                // ❌ Removed 'required' (Optional field)
                />
              </div>
              <div className="form-group">
                <label htmlFor="chargingTime">Charging time (hrs)</label>
                <input
                  type="number"
                  id="chargingTime"
                  className="form-control"
                  placeholder="e.g., 1"
                  min="0"
                  value={evData.chargingTime}
                  onChange={(e) => setEVData({ ...evData, chargingTime: e.target.value })}
                // ❌ Removed 'required' (Optional field)
                />
              </div>
              <div className="form-group">
                <label htmlFor="motorpower">Motor power (kW)</label>
                <input
                  type="number"
                  id="motorpower"
                  className="form-control"
                  placeholder="e.g., 5"
                  min="0"
                  value={evData.motorpower}
                  onChange={(e) => setEVData({ ...evData, motorpower: e.target.value })}
                // ❌ Removed 'required' (Optional field)
                />
              </div>


            </div>





            <div className="form-actions">
              <button type="button" className="btn-primary btn-cancel" onClick={() => setActiveEVPopup(false)}>Cancel</button>
              <button type="submit" className="btn-primary btn-submit-ev">Save Details</button>
            </div>
          </form>
        </div>
      </div>
      )}
      {/* Plantation Popup */}
      {activePlantationPopup && (
      <AddPlantationModal
        onClose={() => setActivePlantationPopup(false)}
        onSubmit={handlePlantationSubmit}
      />
      )}


      {/* Solar Panel Popup */}
      {activeSolarPopup && (
      <div className={`popup-overlay ${activeSolarPopup ? 'active' : ''}`} onClick={() => setActiveSolarPopup(false)}>
        <div className={`popup ${activeSolarPopup ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
          <div className="popup-header">
            <h2>
              <MdSolarPower size={28} color="#f59e0b" />
              Solar Panel Details
            </h2>
            <button className="popup-close" onClick={() => setActiveSolarPopup(false)}>×</button>
          </div>
          <form onSubmit={handleSolarSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Installed_Capacity">Installed Capacity</label>
                <input
                  type="text"
                  id="Installed_Capacity"
                  className="form-control"
                  placeholder="e.g., 3kw"
                  value={solarPanelData.Installed_Capacity}
                  onChange={(e) => setSolarPanelData({ ...solarPanelData, Installed_Capacity: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="Installation_Date">Installation_Date</label>
                <input
                  type="date"
                  id="Installation_Date"
                  className="form-control"
                  placeholder="e.g., 3kw"
                  value={solarPanelData.Installation_Date}
                  onChange={(e) => setSolarPanelData({ ...solarPanelData, Installation_Date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Energy_Generation_Value">Energy Generation Value</label>
                <input
                  type="number"
                  id="Energy_Generation_Value"
                  className="form-control"
                  placeholder="e.g., 3kw"
                  value={solarPanelData.Energy_Generation_Value}
                  onChange={(e) =>
                    setSolarPanelData({
                      ...solarPanelData,
                      Energy_Generation_Value: e.target.value
                    })
                  }
                  required
                />
              </div>


            </div>
            <div className="form-row">

              <div className="form-group">
                <label htmlFor="Grid_Emission_Factor">Grid_Emission_Factor</label>
                <input
                  type="number"
                  id="Grid_Emission_Factor"
                  className="form-control"
                  placeholder="e.g., 30"
                  value={solarPanelData.Grid_Emission_Factor}
                  onChange={(e) => setSolarPanelData({ ...solarPanelData, Grid_Emission_Factor: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="Inverter_Type">Inverter_Type</label>
                <select
                  id="Inverter_Type"
                  className="form-control"
                  value={solarPanelData.Inverter_Type}
                  onChange={(e) => setSolarPanelData({ ...solarPanelData, Inverter_Type: e.target.value })}
                  required
                >
                  <option value="" disabled hidden>
                    -- Select Inverter Type --
                  </option>
                  <option value="string">String Inverter</option>
                  <option value="microinverter">Microinverter</option>
                  <option value="hybrid">Hybrid Inverter</option>
                  <option value="central">Central Inverter</option>
                </select>
              </div>
            </div>
            <div className="form-row">

            </div>
            <div className="form-row">


            </div>
            <div className="form-actions">
              <button type="button" className="btn-primary btn-cancel" onClick={() => setActiveSolarPopup(false)}>Cancel</button>
              <button type="submit" className="btn-primary btn-submit-tree">Save Details</button>
            </div>
          </form>
        </div>
      </div>
      )}

      {/* Carbon Capture Popup */}
      {activeCapturePopup && (
      <div className={`popup-overlay ${activeCapturePopup ? 'active' : ''}`} onClick={() => setActiveCapturePopup(false)}>
        <div className={`popup capture-popup ${activeCapturePopup ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
          <div className="popup-header">
            <h2>
              <GiPowder size={26} color="#475569" />
              Carbon Capture Facility
            </h2>
            <button className="popup-close" onClick={() => setActiveCapturePopup(false)}>×</button>
          </div>

          <form onSubmit={handleCaptureSubmit}>
            <div className="capture-section-card">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="industryType">Industry Type *</label>
                  <select
                    id="industryType"
                    className={`form-control ${captureTouched.industryType && captureErrors.industryType ? "form-control-error" : ""}`}
                    value={captureData.industryType}
                    onChange={(e) => handleCaptureChange("industryType", e.target.value)}
                    onBlur={() => handleCaptureBlur("industryType")}
                    required
                  >
                    <option value="" disabled hidden>-- Select Industry Type --</option>
                    <option value="Cement">Cement</option>
                    <option value="Steel">Steel</option>
                    <option value="Power">Power</option>
                    <option value="Refinery">Refinery</option>
                    <option value="Chemical">Chemical</option>
                  </select>
                  {captureTouched.industryType && captureErrors.industryType && (
                    <p className="form-error-text">{captureErrors.industryType}</p>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="totalEmission">Total Emission (tonnes CO2/year) *</label>
                  <div className="unit-input-wrap">
                    <input
                      type="number"
                      id="totalEmission"
                      className={`form-control form-control-with-unit ${captureTouched.totalEmission && captureErrors.totalEmission ? "form-control-error" : ""}`}
                      placeholder="e.g., 250000"
                      min="0.01"
                      step="0.01"
                      value={captureData.totalEmission}
                      onChange={(e) => handleCaptureChange("totalEmission", e.target.value)}
                      onBlur={() => handleCaptureBlur("totalEmission")}
                      required
                    />
                    <span className="input-unit">tonnes</span>
                  </div>
                  {captureTouched.totalEmission && captureErrors.totalEmission && (
                    <p className="form-error-text">{captureErrors.totalEmission}</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="captureTechnology">Capture Technology *</label>
                  <select
                    id="captureTechnology"
                    className={`form-control ${captureTouched.captureTechnology && captureErrors.captureTechnology ? "form-control-error" : ""}`}
                    value={captureData.captureTechnology}
                    onChange={(e) => handleCaptureChange("captureTechnology", e.target.value)}
                    onBlur={() => handleCaptureBlur("captureTechnology")}
                    required
                  >
                    <option value="" disabled hidden>-- Select Capture Technology --</option>
                    <option value="Post-combustion">Post-combustion</option>
                    <option value="Pre-combustion">Pre-combustion</option>
                    <option value="Oxy-fuel">Oxy-fuel</option>
                    <option value="Direct Air Capture">Direct Air Capture</option>
                  </select>
                  {captureTouched.captureTechnology && captureErrors.captureTechnology && (
                    <p className="form-error-text">{captureErrors.captureTechnology}</p>
                  )}
                </div>
              </div>

              <div className="form-row form-row-single">
                <div className="form-group">
                  <label htmlFor="captureEfficiency">Capture Efficiency (%) *</label>
                  <div className="unit-input-wrap">
                    <input
                      type="number"
                      id="captureEfficiency"
                      className={`form-control form-control-with-unit ${captureTouched.captureEfficiency && captureErrors.captureEfficiency ? "form-control-error" : ""}`}
                      placeholder="0-100"
                      min="0"
                      max="100"
                      step="0.1"
                      value={captureData.captureEfficiency}
                      onChange={(e) => handleCaptureChange("captureEfficiency", e.target.value)}
                      onBlur={() => handleCaptureBlur("captureEfficiency")}
                      required
                    />
                    <span className="input-unit">%</span>
                  </div>
                  {captureTouched.captureEfficiency && captureErrors.captureEfficiency && (
                    <p className="form-error-text">{captureErrors.captureEfficiency}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-primary btn-cancel" onClick={() => setActiveCapturePopup(false)}>Cancel</button>
              <button type="submit" className="btn-primary btn-submit-capture">Save Details</button>
            </div>
          </form>
        </div>
      </div>
      )}



      {/* Toast Notification */}
      {toast.show && (
      <div className={`org-popup-toast show ${toast.type}`}>
        {toast.type === 'error' ? (
          <FaTimesCircle className="org-popup-toast-icon" size={24} color="#fecaca" />
        ) : (
          <FaCheckCircle className="org-popup-toast-icon" size={24} color="#bbf7d0" />
        )}
        <span className="org-popup-toast-message">{toast.message}</span>
      </div>
      )}
    </div>
  );
};
export default PopupForms;



