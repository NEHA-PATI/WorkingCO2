import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiRefreshCw,
  FiMap,
  FiPlus,
  FiDownload,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { FaFilePdf, FaFileExcel, FaFileCsv } from "react-icons/fa";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import "@features/org/styles/AssetTopBar.css";

const AssetTopBar = ({ fetchAssets, onBulkUpload, onExport, onMapView }) => {
  const [showBulkUpload, setShowBulkUpload] = React.useState(false);

  React.useEffect(() => {
    const handleFocus = () => {
      if (fetchAssets) fetchAssets();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchAssets]);

  const navigate = useNavigate();

  const handleAddAsset = () => {
    navigate("/add-asset");
  };

  const handleExport = (format) => {
    if (onExport) onExport(format);
  };

  const handleMapView = () => {
    if (onMapView) onMapView();
  };

  const handleBulkUpload = () => setShowBulkUpload(true);
  const closeBulkUpload = () => setShowBulkUpload(false);

  return (
    <>
      <div className="asset-topbar">
        <div className="topbar-left">
          <h1 className="title">Asset Management</h1>
          <p className="subtitle">
            Manage and monitor your carbon credit generating assets
          </p>
        </div>

        <div className="topbar-actions">
          <button className="btn" onClick={fetchAssets} disabled={!fetchAssets}>
            <FiRefreshCw className="icon" />
            <span>Refresh</span>
          </button>

          <button className="btn" onClick={handleMapView}>
            <FiMap className="icon" />
            <span>Map View</span>
          </button>

          <button className="btn" onClick={handleBulkUpload}>
            <FiUpload className="icon" />
            <span>Bulk Upload</span>
          </button>

          {/* Radix Export Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="btn">
                <FiDownload className="icon" />
                <span>Export</span>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className="dropdown-menu" sideOffset={6}>
              <DropdownMenu.Item
                onSelect={() => handleExport("pdf")}
                className="dropdown-item"
              >
                <FaFilePdf className="icon" />
                <span>Export as PDF</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => handleExport("csv")}
                className="dropdown-item"
              >
                <FaFileCsv className="icon" />
                <span>Export as CSV</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => handleExport("excel")}
                className="dropdown-item"
              >
                <FaFileExcel className="icon" />
                <span>Export as Excel</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <button type="button" className="btn btn-primary" onClick={handleAddAsset}>
            <FiPlus className="icon" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <div className="bulk-upload-modal">
          <div className="bulk-upload-box">
            <button className="close-btn" onClick={closeBulkUpload}>
              <FiX size={22} />
            </button>

            <h2 className="bulk-title">Bulk Upload</h2>
            <p className="bulk-subtitle">
              Upload many records at once with a clean CSV. Enjoy clear
              validation, progress, and an accessible, responsive experience.
            </p>

            <div className="upload-section">
              <h3>Upload CSV</h3>
              <p>
                Drag & drop or browse to select a <b>.csv</b> file. Use the
                sample template if needed.
              </p>

              <label className="drop-zone">
                <FiUpload size={28} className="upload-icon" />
                <p>Drag & drop your CSV here</p>
                <span>or</span>
                <input type="file" accept=".csv" hidden />
                <button type="button" className="browse-btn">
                  Browse files
                </button>
              </label>

              <p className="file-info">No file selected</p>

              <div className="action-buttons">
                <button className="secondary-btn">Download Sample CSV</button>
                <button className="secondary-btn">Reset</button>
                <button className="primary-btn">Upload CSV</button>
              </div>
            </div>

            <ul className="notes">
              <li>File type must be .csv encoded in UTF-8.</li>
              <li>
                Include a header row. Recommended columns:{" "}
                <b>name, email, asset_id, amount</b>.
              </li>
              <li>
                Maximum file size: 10MB. Split large files for better
                performance.
              </li>
              <li>We validate and show errors before any data is committed.</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default AssetTopBar;
