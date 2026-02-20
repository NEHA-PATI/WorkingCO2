import { useEffect, useRef, useState } from "react";
import { FaCheck, FaCheckCircle, FaLeaf, FaMapMarkerAlt, FaTrashAlt } from "react-icons/fa";
import { MdMyLocation } from "react-icons/md";
import { GiTreeBranch } from "react-icons/gi";
import "@features/org/styles/AddPlantationModal.css";

const POINT_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const EARTH_RADIUS_M = 6378137;

const TOP_SPECIES_OPTIONS = [
  "Neem (Azadirachta indica)",
  "Teak (Tectona grandis)",
  "Eucalyptus",
  "Bamboo",
  "Mango (Mangifera indica)",
  "Mixed",
  "Other",
];

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function calculatePolygonAreaSqm(points) {
  if (!Array.isArray(points) || points.length < 3) return 0;
  const avgLatRad = toRadians(
    points.reduce((sum, point) => sum + point.lat, 0) / points.length
  );
  const projected = points.map((point) => ({
    x: EARTH_RADIUS_M * toRadians(point.lng) * Math.cos(avgLatRad),
    y: EARTH_RADIUS_M * toRadians(point.lat),
  }));

  let area = 0;
  for (let i = 0; i < projected.length; i += 1) {
    const current = projected[i];
    const next = projected[(i + 1) % projected.length];
    area += current.x * next.y - next.x * current.y;
  }
  return Math.abs(area) / 2;
}

function convertArea(sqm, unit) {
  if (unit === "ha") return sqm / 10000;
  if (unit === "acres") return sqm / 4046.8564224;
  return sqm;
}

function formatAreaForUnit(value, unit) {
  if (!Number.isFinite(value) || value <= 0) return "";
  if (unit === "sqm") return value.toFixed(2);
  return value.toFixed(3);
}

function getSpeciesDisplayValue(step2) {
  if (step2.speciesName === "Other") return step2.speciesOther.trim();
  return step2.speciesName;
}

function StepIndicator({ currentStep }) {
  const steps = [
    { num: 1, label: "Details" },
    { num: 2, label: "Review" },
  ];

  return (
    <div className="step-indicator">
      {steps.map((s, i) => (
        <div key={s.num} className="step-wrapper">
          <div className={`step-circle ${currentStep > s.num ? "completed" : currentStep === s.num ? "active" : ""}`}>
            {currentStep > s.num ? <FaCheck /> : s.num}
          </div>
          <span className={`step-label ${currentStep >= s.num ? "active-label" : ""}`}>{s.label}</span>
          {i < steps.length - 1 && <div className={`step-line ${currentStep > s.num ? "completed-line" : ""}`} />}
        </div>
      ))}
    </div>
  );
}

function MapComponent({ points, onPointAdd, onPointRemove }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);
  const polygonRef = useRef(null);
  const gridLayerRef = useRef(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!window.L || leafletMap.current) return;

    const L = window.L;
    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629],
      zoom: 10,
    });

   L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "Tiles © Esri"
  }
  
).addTo(map);
map.attributionControl.setPrefix(false);
map.attributionControl.setPosition("bottomleft");
const brandControl = L.control({ position: "bottomright" });

brandControl.onAdd = function () {
  const div = L.DomUtil.create("div", "brand-control");

  div.innerHTML = `
    <div class="brand-wrapper">
      <img src="/GoCarbonPositive_LOGO.svg" alt="Carbon Positive Logo" />
      <span>Carbon Positive</span>
    </div>
  `;

  return div;
};
brandControl.addTo(map);
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      onPointAdd({ lat, lng });
    });

    leafletMap.current = map;

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, []);

  useEffect(() => {
    const L = window.L;
    if (!L || !leafletMap.current) return;

    markersRef.current.forEach((m) => leafletMap.current.removeLayer(m));
    markersRef.current = [];

    if (polygonRef.current) {
      leafletMap.current.removeLayer(polygonRef.current);
      polygonRef.current = null;
    }

    if (gridLayerRef.current) {
      leafletMap.current.removeLayer(gridLayerRef.current);
      gridLayerRef.current = null;
    }

    points.forEach((pt, i) => {
      const label = POINT_LABELS[i] || i + 1;
      const icon = L.divIcon({
        className: "",
        html: `<div class="map-marker confirmed-marker">${label}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      const marker = L.marker([pt.lat, pt.lng], { icon }).addTo(leafletMap.current);
      markersRef.current.push(marker);
    });

    if (points.length >= 3) {
      const latlngs = points.map((p) => [p.lat, p.lng]);
      const poly = L.polygon(latlngs, {
        color: "#16a34a",
        weight: 2,
        fillColor: "#22c55e",
        fillOpacity: 0.2,
      }).addTo(leafletMap.current);
      polygonRef.current = poly;

      const bounds = poly.getBounds();
      const gridLines = [];
      const latStep = (bounds.getNorth() - bounds.getSouth()) / 10;
      const lngStep = (bounds.getEast() - bounds.getWest()) / 10;

      for (let lat = bounds.getSouth(); lat <= bounds.getNorth(); lat += latStep) {
        gridLines.push(
          L.polyline(
            [
              [lat, bounds.getWest()],
              [lat, bounds.getEast()],
            ],
            { color: "#16a34a", weight: 0.5, opacity: 0.5 }
          )
        );
      }

      for (let lng = bounds.getWest(); lng <= bounds.getEast(); lng += lngStep) {
        gridLines.push(
          L.polyline(
            [
              [bounds.getSouth(), lng],
              [bounds.getNorth(), lng],
            ],
            { color: "#16a34a", weight: 0.5, opacity: 0.5 }
          )
        );
      }

      gridLayerRef.current = L.layerGroup(gridLines).addTo(leafletMap.current);
      leafletMap.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [points]);

  const handleUseMyLocation = () => {
    if (locating || !navigator.geolocation) return;
    setLocating(true);

    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (leafletMap.current) {
            leafletMap.current.setView([latitude, longitude], 15);
          }
          onPointAdd({ lat: latitude, lng: longitude });
          setLocating(false);
        },
        () => {
          setLocating(false);
          alert("Unable to retrieve your location.");
        }
      );
    }, 2000);
  };

  return (
    <div className="map-section">
      <div className="map-header-row">
        <label className="field-label">Plantation Location</label>
        <button type="button" className="use-location-btn" onClick={handleUseMyLocation} disabled={locating}>
          {locating ? (
            <>
              <span className="locating-spinner" />
              Locating...
            </>
          ) : (
            <>
              <MdMyLocation color="#16a34a" />
              Use My Location
            </>
          )}
        </button>
      </div>

      <div className="map-container" ref={mapRef} />
      <p className="map-hint">Click on the map to add points directly</p>

      {points.length > 0 && (
        <div className="confirmed-points-card">
          <p className="confirmed-title">Confirmed Points:</p>
          {points.map((pt, i) => (
            <div key={i} className="confirmed-point-row">
              <span className="point-label-badge">{POINT_LABELS[i]}</span>
              <span className="point-coords">
                {pt.lat.toFixed(5)}, {pt.lng.toFixed(5)}
              </span>
              <button type="button" className="delete-point-btn" onClick={() => onPointRemove(i)}>
                <FaTrashAlt color="#ef4444" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Step1({ data, step2, onChange, onStep2Change, points, onPointAdd, onPointRemove }) {
  const isOtherSpecies = step2.speciesName === "Other";

  return (
    <div className="step-content">
      <div className="field-group">
        <label className="field-label">
          Plantation Name <span className="required">*</span>
        </label>
        <input className="field-input" placeholder="e.g. Green Valley Plantation" value={data.name} onChange={(e) => onChange("name", e.target.value)} />
      </div>

      <div className="field-group">
        <label className="field-label">
          Plantation Date <span className="required">*</span>
        </label>
        <input className="field-input" type="date" value={data.date} onChange={(e) => onChange("date", e.target.value)} />
      </div>

      <MapComponent points={points} onPointAdd={onPointAdd} onPointRemove={onPointRemove} />

      <div className="field-group">
        <label className="field-label">
          Total Plantation Area <span className="required">*</span>
        </label>
        <div className="area-input-row">
          <input
            className="field-input area-input"
            placeholder="Auto-calculated from map"
            type="number"
            value={data.area}
            readOnly
          />
          <select className="unit-select" value={data.areaUnit} onChange={(e) => onChange("areaUnit", e.target.value)}>
            <option value="ha">ha</option>
            <option value="acres">acres</option>
            <option value="sqm">sqm</option>
          </select>
        </div>
        <p className="field-help">Area is auto-calculated from selected map points.</p>
      </div>

      <div className="field-group">
        <label className="field-label">
          Plantation Manager Name <span className="required">*</span>
        </label>
        <input className="field-input" placeholder="Enter manager's full name" value={data.managerName} onChange={(e) => onChange("managerName", e.target.value)} />
      </div>

      <div className="field-group">
        <label className="field-label">
          Manager Contact Number <span className="required">*</span>
        </label>
        <input
          className="field-input"
          placeholder="10 digit contact number"
          type="tel"
          maxLength={10}
          value={data.managerContact}
          onChange={(e) => onChange("managerContact", e.target.value.replace(/\D/g, "").slice(0, 10))}
        />
      </div>
      <div className="field-group section-divider">
        <label className="section-title">Vegetation Details</label>
      </div>

      <div className="field-group">
        <label className="field-label">
          Number of Trees Planted <span className="required">*</span>
        </label>
        <input
          className="field-input"
          placeholder="e.g. 500"
          type="number"
          value={step2.treesCount}
          onChange={(e) => onStep2Change("treesCount", e.target.value)}
        />
      </div>

      <div className="field-group">
        <label className="field-label">
          Add Species <span className="required">*</span>
        </label>
        <select
          className="field-input field-select"
          value={step2.speciesName}
          onChange={(e) => {
            onStep2Change("speciesName", e.target.value);
            if (e.target.value !== "Other") onStep2Change("speciesOther", "");
          }}
        >
          <option value="">Select species</option>
          {TOP_SPECIES_OPTIONS.map((species) => (
            <option key={species} value={species}>
              {species}
            </option>
          ))}
        </select>
      </div>

      {isOtherSpecies && (
        <div className="field-group">
          <label className="field-label">
            Specify Species <span className="required">*</span>
          </label>
          <input
            className="field-input"
            placeholder="Enter species name"
            value={step2.speciesOther}
            onChange={(e) => onStep2Change("speciesOther", e.target.value)}
          />
        </div>
      )}

      <div className="field-group">
        <label className="field-label">
          Plantation Age <span className="required">*</span>
        </label>
        <div className="age-input-wrapper">
          <input
            className="field-input age-input"
            placeholder="e.g. 2"
            type="number"
            value={step2.plantAge}
            onChange={(e) => onStep2Change("plantAge", e.target.value)}
          />
          <span className="age-unit">yrs</span>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="review-row">
      <span className="review-label">{label}</span>
      <span className="review-value">{value || "-"}</span>
    </div>
  );
}

function Step3({ step1, step2, points }) {
  return (
    <div className="step-content review-step">
      <div className="review-header">
        <div className="review-check-circle">
          <FaCheckCircle color="#16a34a" size={30} />
        </div>
        <h2 className="review-title">Review Your Details</h2>
        <p className="review-subtitle">Please confirm all information before submitting</p>
      </div>

      <div className="review-card">
        <div className="review-card-header">
          <div className="review-card-icon">
            <FaMapMarkerAlt color="#ef4444" size={16} />
          </div>
          <span className="review-card-title">Basic Information</span>
        </div>
        <ReviewRow label="PLANTATION NAME" value={step1.name} />
        <ReviewRow label="PLANTATION DATE" value={step1.date} />
        <ReviewRow label="TOTAL AREA" value={step1.area ? `${step1.area} ${step1.areaUnit}` : ""} />
        <ReviewRow label="MANAGER NAME" value={step1.managerName} />
        <ReviewRow label="MANAGER CONTACT" value={step1.managerContact} />
        {points.length > 0 && <ReviewRow label="LOCATION POINTS" value={`${points.length} point(s) marked`} />}
      </div>

      <div className="review-card">
        <div className="review-card-header">
          <div className="review-card-icon">
            <FaLeaf color="#16a34a" size={16} />
          </div>
          <span className="review-card-title">Vegetation Details</span>
        </div>
        <ReviewRow label="TREES PLANTED" value={step2.treesCount} />
        <ReviewRow label="SPECIES" value={getSpeciesDisplayValue(step2)} />
        <ReviewRow label="PLANTATION AGE" value={step2.plantAge ? `${step2.plantAge} yrs` : ""} />
      </div>
    </div>
  );
}

export default function AddPlantationModal({ onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [points, setPoints] = useState([]);
  const [stepError, setStepError] = useState("");
  const bodyRef = useRef(null);
  const [step1, setStep1] = useState({
    name: "",
    date: "",
    area: "",
    areaUnit: "ha",
    managerName: "",
    managerContact: "",
  });
  const [step2, setStep2] = useState({
    treesCount: "",
    speciesName: "",
    speciesOther: "",
    plantAge: "",
  });

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [step]);

  const handleStep1Change = (key, val) => setStep1((p) => ({ ...p, [key]: val }));
  const handleStep2Change = (key, val) => setStep2((p) => ({ ...p, [key]: val }));
  const handlePointAdd = (pt) => setPoints((p) => [...p, pt]);
  const handlePointRemove = (idx) => setPoints((p) => p.filter((_, i) => i !== idx));

  useEffect(() => {
    const areaSqm = calculatePolygonAreaSqm(points);
    setStep1((prev) => {
      const converted = convertArea(areaSqm, prev.areaUnit);
      const nextArea = formatAreaForUnit(converted, prev.areaUnit);
      if (prev.area === nextArea) return prev;
      return { ...prev, area: nextArea };
    });
  }, [points, step1.areaUnit]);

  const isDetailsValid = () => {
    const tenDigit = /^\d{10}$/.test(step1.managerContact.trim());
    const speciesValue = getSpeciesDisplayValue(step2);
    return (
      step1.name.trim() &&
      step1.date &&
      step1.area &&
      step1.managerName.trim() &&
      tenDigit &&
      points.length >= 3 &&
      step2.treesCount &&
      speciesValue &&
      step2.plantAge
    );
  };

  const handleNext = () => {
    if (step === 1 && !isDetailsValid()) {
      setStepError("Complete Step 1: fill all required fields, enter a valid 10-digit contact number, and add at least 3 map points.");
      return;
    }

    setStepError("");
    if (step < 2) setStep((s) => s + 1);
  };

  const handleBack = () => {
    setStepError("");
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!isDetailsValid()) {
      setStepError("Please complete all required details before submitting.");
      return;
    }

    const payload = {
      step1,
      step2: {
        ...step2,
        speciesName: getSpeciesDisplayValue(step2),
      },
      points,
    };
    let shouldClose = true;
    if (typeof onSubmit === "function") {
      const submitResult = await onSubmit(payload);
      shouldClose = submitResult !== false;
    }
    if (shouldClose && onClose) onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="header-left">
            <div className="header-icon">
              <GiTreeBranch color="#ffffff" size={22} />
            </div>
            <div className="header-text">
              <h1 className="modal-title">Add Plantation Details</h1>
              <p className="modal-subtitle">Step {step} of 2</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>

        <div className="modal-steps">
          <StepIndicator currentStep={step} />
        </div>

        <div className="modal-body" ref={bodyRef}>
          {step === 1 && (
            <Step1
              data={step1}
              step2={step2}
              onChange={handleStep1Change}
              onStep2Change={handleStep2Change}
              points={points}
              onPointAdd={handlePointAdd}
              onPointRemove={handlePointRemove}
            />
          )}
          {step === 2 && <Step3 step1={step1} step2={step2} points={points} />}
        </div>

        {stepError && <div className="modal-inline-alert">{stepError}</div>}

        <div className="modal-footer">
          <button className={`btn-back ${step === 1 ? "btn-back-disabled" : ""}`} onClick={handleBack} disabled={step === 1}>
            Back
          </button>
          {step < 2 ? (
            <button className="btn-next" onClick={handleNext}>Next</button>
          ) : (
            <button className="btn-submit" onClick={handleSubmit}>Submit</button>
          )}
        </div>
      </div>
    </div>
  );
}


