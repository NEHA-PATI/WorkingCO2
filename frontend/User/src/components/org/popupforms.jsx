// PopupForms.js - React component file with all three popup forms
import React, { useState, useEffect } from 'react';
import '../styles/popupforms.css';
import { assetAPI } from '../services/api';
const PopupForms = ({
  activeEVPopup,
  setActiveEVPopup,
  activeSolarPopup,
  setActiveSolarPopup,
  activePlantationPopup,
  setActivePlantationPopup,
  handleSaveEV,
  handleSavePlantation,
  handleSaveSolar,
  setEvCount,
  setSolarCount // ✅ Add this line!
}) => {





  // State for managing popups

  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // List state for fetched data
  const [evList, setEvList] = useState([]);      // All EVs from backend
  const [plantationList, setPlantationList] = useState([]);  // All plantations from backend
  const [solarPanels, setSolarPanels] = useState([]); // All solar panels from backend





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


  const [plantationData, setPlantationData] = useState({
    location_lat: '',
    location_long: '',
    area_hactare: '',
    species_Name: '',
    trees_planted: '',
    avg_height: '',
    avg_dbh: '',
    survival_rate: '',
    plantation_date: '',
    Base_line_Land: '',
    photos: [],
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





  const handlePlantationSubmit = async (e) => {
    e.preventDefault();

    const u_id = localStorage.getItem("userId");
    if (!u_id) {
      showToast("User not logged in", "error");
      return;
    }

    try {
      let image_id = null;

      // 1️⃣ Upload image (take FIRST image only)
      if (plantationData.photos?.length > 0) {
        const formData = new FormData();

        const blob = dataURLtoBlob(plantationData.photos[0]);
        formData.append("images", blob);

        const imageRes = await assetAPI.uploadImage(formData);

        if (imageRes.status !== "success") {
          showToast("Image upload failed", "error");
          return;
        }

        image_id = imageRes.imageIds[0]; // ✅ SINGLE image_id
      }

      // 2️⃣ Build ORG ASSET payload
      const payload = {
        plantationId: crypto.randomUUID(),   // ✅ REQUIRED
        t_oid: `TREE-${Date.now()}`,          // ✅ REQUIRED
        u_id,                                // ✅ MATCH DB
        location_lat: Number(plantationData.location_lat),
        location_long: Number(plantationData.location_long),
        area_hactare: Number(plantationData.area_hactare),
        species_Name: plantationData.species_Name,
        trees_planted: Number(plantationData.trees_planted),
        avg_height: Number(plantationData.avg_height),
        avg_dbh: Number(plantationData.avg_dbh),
        survival_rate: Number(plantationData.survival_rate),
        plantation_date: plantationData.plantation_date,
        Base_line_Land: plantationData.Base_line_Land,
        ImageId: image_id,
      };

      console.log("🌱 ORG ASSET PAYLOAD:", payload);

      // 3️⃣ Call ORG ASSET backend (PORT 5000)
      const result = await assetAPI.createOrgAsset(payload);

      if (result.success) {
        showToast("Plantation saved successfully!", "success");
        handleSavePlantation?.(result.data);
        setActivePlantationPopup(false);
      } else {
        showToast(result.error || "Failed to save plantation", "error");
      }

    } catch (err) {
      console.error(err);
      showToast("Server error", "error");
    }
  };


  // ✅ Helper function: dataURL to Blob
  function dataURLtoBlob(dataURL) {
    const byteString = atob(dataURL.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/jpeg' });
    return blob;
  }


  // File upload handler for tree photos





  const removePlantationPhoto = (index) => {
    setPlantationData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      {/* EV Popup */}
      <div className={`popup-overlay ${activeEVPopup ? 'active' : ''}`} onClick={() => setActiveEVPopup(false)}>
        <div className={`popup ${activeEVPopup ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
          <div className="popup-header">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="9" width="20" height="10" rx="2" ry="2"></rect>
                <circle cx="7" cy="19" r="2"></circle>
                <circle cx="17" cy="19" r="2"></circle>
                <path d="M5 9V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"></path>
                <path d="M15 13h2"></path>
                <path d="M7 13h2"></path>
              </svg>
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
      {/* Plantation Popup (using activePlantationPopup prop) */}
      <div className={`popup-overlay ${activePlantationPopup ? 'active' : ''}`} onClick={() => setActivePlantationPopup(false)}>
        <div className={`popup ${activePlantationPopup ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
          <div className="popup-header">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 14l-5-5-5 5"></path>
                <path d="M12 9v12"></path>
                <path d="M12 3a5 5 0 0 1 5 5c0 2-3 3-5 3s-5-1-5-3a5 5 0 0 1 5-5z"></path>
              </svg>
              Plantation Details
            </h2>
            <button className="popup-close" onClick={() => setActivePlantationPopup(false)}>×</button>
          </div>
          <form onSubmit={handlePlantationSubmit}>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location_lat">Location Latitude</label>
                <input
                  type="number"
                  id="location_lat"
                  className="form-control"
                  placeholder="e.g., 28.6139"
                  step="any"
                  value={plantationData.location_lat}
                  onChange={(e) => setPlantationData({ ...plantationData, location_lat: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location_long">Location Longitude</label>
                <input
                  type="number"
                  id="location_long"
                  className="form-control"
                  placeholder="e.g., 77.2090"
                  step="any"
                  value={plantationData.location_long}
                  onChange={(e) => setPlantationData({ ...plantationData, location_long: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="area_hactare">Area in Hectares</label>
                <input
                  type="number"
                  id="area_hactare"
                  className="form-control"
                  placeholder="e.g., 2.5"
                  step="0.01"
                  value={plantationData.area_hactare}
                  onChange={(e) => setPlantationData({ ...plantationData, area_hactare: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="species_Name">Species Name</label>
                <input
                  type="text"
                  id="species_Name"
                  className="form-control"
                  placeholder="e.g., Teak, Mango, Neem"
                  value={plantationData.species_Name}
                  onChange={(e) => setPlantationData({ ...plantationData, species_Name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="trees_planted">Number of Trees Planted</label>
                <input
                  type="number"
                  id="trees_planted"
                  className="form-control"
                  placeholder="e.g., 500"
                  min="1"
                  value={plantationData.trees_planted}
                  onChange={(e) => setPlantationData({ ...plantationData, trees_planted: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="avg_height">Average Height (cm)</label>
                <input
                  type="number"
                  id="avg_height"
                  className="form-control"
                  placeholder="e.g., 150"
                  step="0.1"
                  value={plantationData.avg_height}
                  onChange={(e) => setPlantationData({ ...plantationData, avg_height: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="avg_dbh">Average DBH (cm)</label>
                <input
                  type="number"
                  id="avg_dbh"
                  className="form-control"
                  placeholder="e.g., 15"
                  step="0.1"
                  value={plantationData.avg_dbh}
                  onChange={(e) => setPlantationData({ ...plantationData, avg_dbh: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="survival_rate">Survival Rate (%)</label>
                <input
                  type="number"
                  id="survival_rate"
                  className="form-control"
                  placeholder="e.g., 85"
                  min="0"
                  max="100"
                  step="0.1"
                  value={plantationData.survival_rate}
                  onChange={(e) => setPlantationData({ ...plantationData, survival_rate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="plantation_date">Date of Plantation</label>
                <input
                  type="date"
                  id="plantation_date"
                  className="form-control"
                  value={plantationData.plantation_date}
                  onChange={(e) => setPlantationData({ ...plantationData, plantation_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="Base_line_Land">Base line Land</label>
                <select
                  id="Base_line_Land"
                  className="form-control"
                  value={plantationData.Base_line_Land}
                  onChange={(e) => setPlantationData({ ...plantationData, Base_line_Land: e.target.value })}
                  required
                >
                  <option value="" disabled hidden>-- Select Base line Land --</option>
                  <option value="Crop">Crop</option>
                  <option value="Grass">Grass</option>
                  <option value="Barren">Barren</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Upload Images Here (Up to 5)</label>
              <label className="file-upload">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;

                    const updatedPhotos = Array.from(files).slice(0, 5);
                    const fileReaders = [];
                    const base64Images = [];

                    updatedPhotos.forEach((file) => {
                      const reader = new FileReader();
                      fileReaders.push(reader);

                      reader.onload = (event) => {
                        base64Images.push(event.target.result);
                        if (base64Images.length === updatedPhotos.length) {
                          setPlantationData((prev) => ({
                            ...prev,
                            photos: [...(prev.photos || []), ...base64Images].slice(0, 5),
                          }));
                        }
                      };

                      reader.readAsDataURL(file);
                    });
                  }}
                  disabled={(plantationData.photos || []).length >= 5}
                />
                <svg className="file-upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <div className="file-upload-text">
                  <strong>Click to upload photos</strong>
                  <p>Install GPS MAP CAMERA and upload the picture</p>
                  <p>PER IMAGE LIMIT 1 Mb</p>
                  <p>{(plantationData.photos || []).length}/5 photos uploaded</p>
                </div>
              </label>
              {(plantationData.photos || []).length > 0 && (
                <div className="photo-preview">
                  {plantationData.photos.map((photo, index) => (
                    <div key={index} className="photo-item">
                      <img src={photo} alt={`Plantation photo ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-photo"
                        onClick={() => removePlantationPhoto(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="button" className="btn-primary btn-cancel" onClick={() => setActivePlantationPopup(false)}>Cancel</button>
              <button type="submit" className="btn-primary btn-submit-tree">Save Details</button>
            </div>
          </form>
        </div>
      </div>



      {/* Solar Panel Popup */}
      <div className={`popup-overlay ${activeSolarPopup ? 'active' : ''}`} onClick={() => setActiveSolarPopup(false)}>
        <div className={`popup ${activeSolarPopup ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
          <div className="popup-header">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="7" width="18" height="12" rx="2" ry="2"></rect>
                <line x1="3" y1="13" x2="21" y2="13"></line>
                <line x1="9" y1="7" x2="9" y2="19"></line>
                <line x1="15" y1="7" x2="15" y2="19"></line>
              </svg>
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
              <button type="submit" className="btn-primary btn-submit">Save Details</button>
            </div>
          </form>
        </div>
      </div>



      {/* Toast Notification */}
      <div className={`toast ${toast.show ? 'show' : ''} ${toast.type}`}>
        {toast.type === 'error' ? (
          <svg className="toast-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        ) : (
          <svg className="toast-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        )}
        <span className="toast-message">{toast.message}</span>
      </div>
    </div>
  );
};
export default PopupForms;