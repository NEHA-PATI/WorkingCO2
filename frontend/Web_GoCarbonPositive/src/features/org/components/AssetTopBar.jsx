import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiRefreshCw,
  FiMap,
  FiPlus,
  FiDownload,
  FiUpload,
} from "react-icons/fi";
import { FaFilePdf, FaFileExcel, FaFileCsv } from "react-icons/fa";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { toast } from "react-toastify";
import "@features/org/styles/AssetTopBar.css";

const AssetTopBar = ({ fetchAssets, onBulkUpload, onExport, onMapView }) => {
  const [showBulkUpload, setShowBulkUpload] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef(null);

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
  const closeBulkUpload = () => {
    setShowBulkUpload(false);
    setSelectedFile(null);
    setIsDragOver(false);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      window.alert("Please select a CSV file.");
      event.target.value = "";
      return;
    }
    setSelectedFile(file);
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      window.alert("Only CSV files are supported.");
      return;
    }
    setSelectedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const handleDownloadSampleCsv = () => {
    const sampleCsv = [
      "name,email,asset_id,amount",
      "Solar Plant A,ops@example.com,AST-1001,1250",
      "Wind Farm B,sustainability@example.com,AST-1002,980",
    ].join("\n");

    const blob = new Blob([sampleCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bulk-upload-sample.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResetFile = () => {
    setSelectedFile(null);
    setIsDragOver(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadCsv = async () => {
    if (!selectedFile) {
      toast.error("Please choose a CSV file before uploading.");
      return;
    }

    try {
      setIsUploading(true);
      if (onBulkUpload) {
        await onBulkUpload(selectedFile);
      }
      toast.success(`File "${selectedFile.name}" uploaded successfully.`);
      closeBulkUpload();
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

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
            <FiRefreshCw className="icon icon-refresh" />
            <span>Refresh</span>
          </button>

          <button className="btn" onClick={handleMapView}>
            <FiMap className="icon icon-map" />
            <span>Map View</span>
          </button>

          <button className="btn" onClick={handleBulkUpload}>
            <FiUpload className="icon icon-upload" />
            <span>Bulk Upload</span>
          </button>

          {/* Radix Export Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="btn">
                <FiDownload className="icon icon-export" />
                <span>Export</span>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
              className="dropdown-menu"
              side="bottom"
              align="end"
              sideOffset={6}
              collisionPadding={10}
            >
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
            <FiPlus className="icon icon-add" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <div className="bulk-upload-modal" onClick={closeBulkUpload}>
          <div
            className="bulk-upload-box"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bulk-upload-header">
              <h2 className="bulk-title">Bulk Upload</h2>
              <button
                type="button"
                className="close-btn"
                aria-label="Close bulk upload modal"
                onClick={closeBulkUpload}
              >
                <span className="close-btn-icon" aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="upload-section">
              <h3>Upload CSV</h3>
              <p>
                Drag & drop or browse to select a <b>.csv</b> file. Use the
                sample template if needed.
              </p>

              <label
                className={`drop-zone ${isDragOver ? "drop-zone--active" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <FiUpload size={28} className="upload-icon" />
                <p>Drag & drop your CSV here</p>
                <span>or</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={handleFileSelect}
                />
                <button type="button" className="browse-btn" onClick={handleBrowseFiles}>
                  Browse files
                </button>
              </label>

              <p className="file-info">
                {selectedFile ? selectedFile.name : "No file selected"}
              </p>

              <div className="action-buttons">
                <button className="secondary-btn" onClick={handleDownloadSampleCsv}>
                  Download Sample CSV
                </button>
                <button className="secondary-btn" onClick={handleResetFile}>
                  Reset
                </button>
                <button
                  className="primary-btn"
                  onClick={handleUploadCsv}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload CSV"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssetTopBar;
