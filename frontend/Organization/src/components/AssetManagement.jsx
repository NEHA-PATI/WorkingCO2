import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./basic-ui";
import { useNavigate } from "react-router-dom";
import { assetAPI } from "../services/api";
import {
  FiSun,
  FiWind,
  FiDroplet,
  FiZap,
  FiEye,
  FiGrid,
  FiList,
  FiTrendingUp,
  FiCalendar,
  FiSettings,
} from "react-icons/fi";
import { FaTree, FaCar, FaIndustry, FaLeaf } from "react-icons/fa";
import AssetTopBar from "./AssetTopBar";


// SVG Icons
const GridIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ListIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.1" y2="6" />
    <line x1="3" y1="12" x2="3.1" y2="12" />
    <line x1="3" y1="18" x2="3.1" y2="18" />
  </svg>
);

const EyeIcon = () => <FiEye size={16} style={{ color: "#6366f1" }} />;

const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.828 2.828 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h6a1 1 0 011 1v2" />
  </svg>
);

const CalendarIcon = () => (
  <FiCalendar size={16} style={{ color: "#8b5cf6" }} />
);

const TrendingUpIcon = () => (
  <FiTrendingUp size={16} style={{ color: "#10b981" }} />
);

const CheckCircleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.1" y2="16" />
  </svg>
);

const ActiveStatusIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l3 3 5-5" />
  </svg>
);

const LayersIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const CarIcon = () => <FaCar size={24} style={{ color: "#6366f1" }} />;

const TreesIcon = () => <FaTree size={24} style={{ color: "#10b981" }} />;

const SunIcon = () => <FiSun size={24} style={{ color: "#f59e0b" }} />;

const WindIcon = () => <FiWind size={24} style={{ color: "#06b6d4" }} />;

const ZapIcon = () => <FiZap size={24} style={{ color: "#ef4444" }} />;

const DropletsIcon = () => <FiDroplet size={24} style={{ color: "#3b82f6" }} />;

const FactoryIcon = () => <FaIndustry size={24} style={{ color: "#6b7280" }} />;

const LeafIcon = () => <FaLeaf size={24} style={{ color: "#22c55e" }} />;

const FleetIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="7" rx="2" />
    <path d="M5 18v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
    <circle cx="7.5" cy="16.5" r="1.5" />
    <circle cx="16.5" cy="16.5" r="1.5" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UpdateIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 2v6h-6" />
    <path d="M3 13a9 9 0 0 1 14.19-7.36L21 8" />
    <path d="M3 21v-6h6" />
    <path d="M21 11a9 9 0 0 1-14.19 7.36L3 16" />
  </svg>
);

// Icon mapping for asset types
const ASSET_ICONS = {
  EV: CarIcon,
  Trees: TreesIcon,
  Solar: SunIcon,
  Wind: WindIcon,
  Hydro: DropletsIcon,
  Thermal: ZapIcon,
  Bioenergy: LeafIcon,
  "Carbon Capture": FactoryIcon,
};

// Color mapping for asset types
const ASSET_COLORS = {
  EV: { bg: "bg-indigo-light", text: "var(--color-indigo)" },
  Trees: { bg: "bg-green-light", text: "var(--color-green)" },
  Solar: { bg: "bg-yellow-light", text: "var(--color-yellow)" },
  Wind: { bg: "bg-indigo-light", text: "var(--color-indigo)" },
  Hydro: { bg: "bg-indigo-light", text: "var(--color-indigo)" },
  Thermal: { bg: "bg-red-light", text: "var(--color-red)" },
  Bioenergy: { bg: "bg-green-light", text: "var(--color-green)" },
  "Carbon Capture": {
    bg: "var(--color-card-bg)",
    text: "var(--color-text-secondary)",
  },
};

// Status colors
const STATUS_COLORS = {
  Active: { bg: "bg-green-light", text: "var(--color-green-dark)" },
  Maintenance: { bg: "bg-yellow-light", text: "var(--color-yellow-dark)" },
  Offline: { bg: "bg-red-light", text: "var(--color-red)" },
};

// Improved Asset Card Component with better structure
const AssetCard = ({ asset, onClick, onDelete }) => {
  const Icon = ASSET_ICONS[asset.type] || LeafIcon;
  const { bg: statusBg, color: statusText } = STATUS_COLORS[asset.status] || {};

  return (
    <motion.div
      className="asset-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Header with Icon and Status */}
      <div className="asset-card-header">
        <div>
          <motion.div
            className="asset-icon-container"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, type: "spring" }}
          >
            <Icon />
          </motion.div>
          <motion.h3
            className="asset-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {asset.name}
          </motion.h3>
          <p className="asset-type">{asset.type}</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span
            className={`asset-status-badge ${statusBg}`}
            style={{ color: statusText }}
          >
            {asset.status === "Active" && (
              <ActiveStatusIcon
                style={{ marginRight: "4px", color: statusText }}
              />
            )}
            {asset.status}
          </span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="asset-content">
        {/* Location - Hide for EV and Solar assets */}
        {asset.type !== "EV" && asset.type !== "Solar" && (
          <div className="asset-location">
            <FiMapPin size={16} style={{ color: "#f59e0b" }} />
            <span>{asset.location}</span>
          </div>
        )}

        {/* Credits Generated */}
        <div className="asset-info-row">
          <div className="asset-info-label">
            <TrendingUpIcon />
            <span>Credits Generated</span>
          </div>
          <motion.span
            className="asset-credits-value"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {asset.creditsGenerated.toLocaleString()}
          </motion.span>
        </div>

        {/* Verification Status */}
        <div className="asset-info-row">
          <span className="asset-info-label">Verification</span>
          <motion.span
            className={`badge ${
              asset.verified ? "bg-green-light" : "bg-yellow-light"
            }`}
            style={{
              color: asset.verified ? "#059669" : "#d97706",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {asset.verified ? "✓ Verified" : "⏳ Pending"}
          </motion.span>
        </div>

        {/* Efficiency (if available) */}
        {asset.efficiency && (
          <div className="asset-info-row">
            <span className="asset-info-label">Efficiency</span>
            <span className="asset-info-value">{asset.efficiency}</span>
          </div>
        )}

        {/* Last Updated */}
        <div className="asset-updated">
          <CalendarIcon />
          <span>Updated {asset.lastUpdated}</span>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
          <motion.button
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "transparent",
              color: "#6366f1",
              border: "1px solid #6366f1",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onClick={() => onClick(asset)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <EyeIcon />
            <span>View Details</span>
          </motion.button>

          <motion.button
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "transparent",
              color: "#10b981",
              border: "1px solid #10b981",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log("Add button clicked for", asset.type, asset.name);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiPlus size={16} />
            <span>Add</span>
          </motion.button>

          <motion.button
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "transparent",
              color: "#ef4444",
              border: "1px solid #ef4444",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (
                window.confirm(`Are you sure you want to delete ${asset.name}?`)
              ) {
                onDelete(asset);
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <TrashIcon />
            <span>Delete</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Filter Panel Component
const FilterPanel = ({ filters, onFilterChange, activeFiltersCount }) => {
  const updateFilter = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      search: "",
      assetType: "All Types",
      region: "All Regions",
      verificationStatus: "All Status",
      status: "All Status",
      showVerifiedOnly: false,
    });
  };

  // Active filter chips
  const activeChips = [];
  if (filters.assetType && filters.assetType !== "All Types") {
    activeChips.push({
      label: `Type: ${filters.assetType}`,
      key: "assetType",
    });
  }
  if (filters.status && filters.status !== "All Status") {
    activeChips.push({
      label: `Status: ${filters.status}`,
      key: "status",
    });
  }
  if (filters.region && filters.region !== "All Regions") {
    activeChips.push({
      label: `Region: ${filters.region}`,
      key: "region",
    });
  }

  const removeChip = (key) => {
    updateFilter(
      key,
      key === "assetType"
        ? "All Types"
        : key === "status"
        ? "All Status"
        : "All Regions"
    );
  };

  return (
    <div className="filterbar-container">
      <div className="filterbar-row">
        <span className="filterbar-label">Filter</span>
        <div className="filterbar-pills">
          <select
            value={filters.assetType}
            onChange={(e) => updateFilter("assetType", e.target.value)}
            className="filter-pill"
          >
            <option value="All Types">Type</option>
            <option value="EV">EV</option>
            <option value="Trees">Trees</option>
            <option value="Solar">Solar</option>
            <option value="Wind">Wind</option>
            <option value="Hydro">Hydro</option>
            <option value="Thermal">Thermal</option>
            <option value="Bioenergy">Bioenergy</option>
            <option value="Carbon Capture">Carbon Capture</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="filter-pill"
          >
            <option value="All Status">Status</option>
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Offline">Offline</option>
          </select>
          <select
            value={filters.region}
            onChange={(e) => updateFilter("region", e.target.value)}
            className="filter-pill"
          >
            <option value="All Regions">Region</option>
            <option value="North America">North America</option>
            <option value="Europe">Europe</option>
            <option value="Asia Pacific">Asia Pacific</option>
            <option value="Latin America">Latin America</option>
          </select>
        </div>
        <div className="filterbar-search">
          <Input
            placeholder="Search by name"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="filterbar-search-input"
          />
        </div>
        <div className="filterbar-actions">
          {(activeChips.length > 0 || filters.search) && (
            <button className="filterbar-clear" onClick={clearAllFilters}>
              &#10005; Clear filters
            </button>
          )}
        </div>
      </div>
      {activeChips.length > 0 && (
        <div className="filterbar-chips">
          {activeChips.map((chip) => (
            <span className="filter-chip" key={chip.key}>
              {chip.label}
              <button
                className="chip-remove"
                onClick={() => removeChip(chip.key)}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const AssetManagement = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showAssetDetails, setShowAssetDetails] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  // State for update modal and form data
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateFormData, setUpdateFormData] = useState(null);

  // Handler to open update modal with pre-filled data
  const handleOpenUpdateModal = () => {
    setUpdateFormData(selectedAsset?.originalData || {});
    setShowUpdateModal(true);
  };

  // Handler for form field changes
  const handleUpdateFormChange = (field, value) => {
    setUpdateFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handler for update submit
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (selectedAsset.type === "EV") {
        response = await assetAPI.updateEV(
          updateFormData.ev_id,
          updateFormData
        );
      } else if (selectedAsset.type === "Solar") {
        response = await assetAPI.updateSolar(
          updateFormData.Solar_ID,
          updateFormData
        );
      } else if (selectedAsset.type === "Trees") {
        response = await assetAPI.updateTree(
          updateFormData.Tree_ID,
          updateFormData
        );
      }
      if (response.status === "success") {
        showToast("Asset updated successfully!", "success");
        setShowUpdateModal(false);
        fetchAssets();
      } else {
        showToast("Failed to update asset. Please try again.", "error");
      }
    } catch (error) {
      showToast("Error updating asset. Please try again.", "error");
    }
  };

  // Toast notification handler
  const showToast = (message, type = "success") => {
    console.log("🔔 Showing toast:", message, type);
    setToast({ show: true, message, type });
    setTimeout(() => {
      console.log("🔔 Hiding toast");
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Hardcoded user ID for demo purposes
  const DEMO_USER_ID = "DEMO_USER_001";

  // Fetch assets from backend
  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedAssets = await assetAPI.getAllAssets(DEMO_USER_ID);
      setAssets(fetchedAssets);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError("Failed to load assets. Please try again.");
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  // Load assets on component mount
  React.useEffect(() => {
    fetchAssets();
  }, []);

  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    assetType: "All Types",
    region: "All Regions",
    verificationStatus: "All Status",
    status: "All Status",
    showVerifiedOnly: false,
  });

  // Filter assets based on current filters
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      if (
        filters.search &&
        !asset.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !asset.id.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      if (
        filters.assetType !== "All Types" &&
        asset.type !== filters.assetType
      ) {
        return false;
      }

      if (filters.region !== "All Regions" && asset.region !== filters.region) {
        return false;
      }

      if (filters.status !== "All Status" && asset.status !== filters.status) {
        return false;
      }

      if (filters.showVerifiedOnly && !asset.verified) {
        return false;
      }

      return true;
    });
  }, [assets, filters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.assetType !== "All Types") count++;
    if (filters.region !== "All Regions") count++;
    if (filters.status !== "All Status") count++;
    if (filters.showVerifiedOnly) count++;
    return count;
  }, [filters]);

  const handleViewDetails = (asset) => {
    setSelectedAsset(asset);
    setShowAssetDetails(true);
  };

  const handleDeleteAsset = async (asset) => {
    try {
      let response;
      switch (asset.type) {
        case "EV":
          response = await assetAPI.deleteEV(asset.originalData.ev_id);
          break;
        case "Solar":
          response = await assetAPI.deleteSolar(asset.originalData.solar_id);
          break;
        case "Trees":
          response = await assetAPI.deleteTree(asset.originalData.tree_id);
          break;
        default:
          throw new Error("Unknown asset type");
      }

      if (response.status === "success") {
        setAssets((prevAssets) => prevAssets.filter((a) => a.id !== asset.id));
        showToast(`${asset.name} deleted successfully!`, "success");
      } else {
        showToast("Failed to delete asset. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
      showToast("Error deleting asset. Please try again.", "error");
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header with AssetTopBar */}
      <AssetTopBar fetchAssets={fetchAssets} filteredAssets={filteredAssets} />

      {/* Summary Cards */}
      <div className="grid-4 md-grid-4">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Total Assets</p>
                <p className="text-2xl font-bold">
                  {loading ? "..." : assets.length}
                </p>
              </div>
              <LayersIcon className="text-blue" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Verified</p>
                <p className="text-2xl font-bold text-green">
                  {loading ? "..." : assets.filter((a) => a.verified).length}
                </p>
              </div>
              <CheckCircleIcon className="text-green" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Pending</p>
                <p className="text-2xl font-bold text-yellow">
                  {loading ? "..." : assets.filter((a) => !a.verified).length}
                </p>
              </div>
              <ClockIcon className="text-yellow" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Maintenance</p>
                <p className="text-2xl font-bold text-orange">
                  {loading
                    ? "..."
                    : assets.filter((a) => a.status === "Maintenance").length}
                </p>
              </div>
              <AlertCircleIcon className="text-orange" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {/* View Toggle and Results */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-secondary">
            Showing {filteredAssets.length} of {loading ? "..." : assets.length}{" "}
            assets
          </span>
          {activeFiltersCount > 0 && (
            <Badge variant="outline">{activeFiltersCount} filters active</Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <GridIcon />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <ListIcon />
          </Button>
        </div>
      </div>

      {/* Assets Display */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-secondary">Loading assets...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchAssets} className="button">
              Try Again
            </button>
          </div>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-secondary mb-4">No assets found</p>
            <button onClick={() => navigate("/add-asset")} className="button">
              Add Your First Asset
            </button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid-3 lg-grid-4">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onClick={handleViewDetails}
              onDelete={handleDeleteAsset}
            />
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-secondary">{asset.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{asset.type}</Badge>
                  </TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell className="font-medium">
                    {asset.creditsGenerated.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={`badge-${asset.status.toLowerCase()}`}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {asset.verified ? (
                      <CheckCircleIcon className="text-green" />
                    ) : (
                      <ClockIcon className="text-yellow" />
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="sm">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(asset)}
                        >
                          <EyeIcon />
                          <span className="ml-2">View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleOpenUpdateModal}>
                          <EditIcon />
                          <span className="ml-2">Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete ${asset.name}?`
                              )
                            ) {
                              handleDeleteAsset(asset);
                            }
                          }}
                        >
                          <TrashIcon />
                          <span className="ml-2">Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Asset Details Modal */}
      <Dialog open={showAssetDetails} onOpenChange={setShowAssetDetails}>
        <DialogContent className="dialog-content-medium">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedAsset?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <div className="asset-details-modal-content">
              <div className="grid-2">
                <div>
                  <label className="text-sm text-secondary">Asset ID</label>
                  <p className="text-lg font-semibold">{selectedAsset.id}</p>
                </div>
                <div>
                  <label className="text-sm text-secondary">Type</label>
                  <p className="text-lg font-semibold">{selectedAsset.type}</p>
                </div>
                {selectedAsset.type === "EV" ? (
                  <>
                    <div>
                      <label className="text-sm text-secondary">
                        Manufacturer
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.manufacturers || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">Model</label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.model || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">
                        Purchase Year
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.purchase_year || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">
                        Energy Consumed (kWh)
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.energy_consumed || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">
                        Primary Charging Type
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.primary_charging_type ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">
                        Range (km)
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.range || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">
                        Grid Emission Factor
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.grid_emission_factor ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">
                        Top Speed
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.top_speed || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">
                        Charging Time
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.charging_time || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">
                        Motor Power
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.motor_power || "N/A"}
                      </p>
                    </div>
                  </>
                ) : selectedAsset.type === "Solar" ? (
                  <>
                    <div>
                      <label className="text-sm text-secondary">
                        Installation Capacity
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.installed_capacity ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">
                        Installation Date
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.installation_date || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">
                        Energy Generation Value
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.energy_generation_value ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">
                        Grid Emission Factor
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.grid_emission_factor ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">
                        Inverter Type
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.inverter_type || "N/A"}
                      </p>
                    </div>
                  </>
                ) : selectedAsset.type === "Trees" ? (
                  <>
                    <div>
                      <label className="text-sm text-secondary">
                        Tree Name
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.treename || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">
                        Botanical Name
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.botanicalname || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">
                        Planting Date
                      </label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.plantingdate || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">Height</label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.height || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">Location</label>
                      <p className="text-lg font-semibold">
                        {selectedAsset.originalData?.location || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-secondary">
                        Tree Photo
                      </label>
                      {selectedAsset.originalData?.photos &&
                      selectedAsset.originalData.photos.length > 0 ? (
                        <img
                          src={selectedAsset.originalData.photos[0]}
                          alt="Tree Photo"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "120px",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        <p className="text-lg font-semibold">N/A</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="text-sm text-secondary">Location</label>
                    <p className="text-lg font-semibold">
                      {selectedAsset.location}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-secondary">
                    Credits Generated
                  </label>
                  <p className="text-lg font-semibold text-green">
                    {selectedAsset.creditsGenerated.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="button-row">
                <button
                  className="update-asset-btn"
                  onClick={handleOpenUpdateModal}
                >
                  <UpdateIcon />
                  Update
                </button>
                <button
                  className="view-fleet-btn"
                  onClick={() => {
                    navigate("/view-fleet");
                  }}
                >
                  <FleetIcon aria-hidden="true" />
                  View Fleet
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent
          style={{
            maxWidth: 600,
            padding: 0,
            borderRadius: 16,
            overflow: "hidden",
            background: "#f9fafb",
          }}
        >
          <DialogHeader style={{ padding: "2rem 2rem 0 2rem" }}>
            <DialogTitle style={{ fontSize: "1.5rem", fontWeight: 700 }}>
              Update {selectedAsset?.type} Asset
            </DialogTitle>
            <DialogDescription
              style={{ color: "#6b7280", marginTop: 4, fontSize: "1rem" }}
            >
              Edit the details below and click <b>Save</b> to update your asset.
            </DialogDescription>
          </DialogHeader>
          {updateFormData && (
            <form
              onSubmit={handleUpdateSubmit}
              style={{ padding: "2rem", paddingTop: 0 }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                  marginBottom: "2.5rem",
                  maxWidth: "100%",
                }}
              >
                {selectedAsset?.type === "EV" && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>Manufacturer</label>
                      <Input
                        value={updateFormData.Manufacturers || ""}
                        onChange={(e) =>
                          handleUpdateFormChange(
                            "Manufacturers",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>Model</label>
                      <Input
                        value={updateFormData.Model || ""}
                        onChange={(e) =>
                          handleUpdateFormChange("Model", e.target.value)
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>Purchase Year</label>
                      <Input
                        value={updateFormData.Purchase_Year || ""}
                        onChange={(e) =>
                          handleUpdateFormChange(
                            "Purchase_Year",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>
                        Energy Consumed (kWh)
                      </label>
                      <Input
                        value={updateFormData.Energy_Consumed || ""}
                        onChange={(e) =>
                          handleUpdateFormChange(
                            "Energy_Consumed",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>
                        Primary Charging Type
                      </label>
                      <Input
                        value={updateFormData.Primary_Charging_Type || ""}
                        onChange={(e) =>
                          handleUpdateFormChange(
                            "Primary_Charging_Type",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>Range (km)</label>
                      <Input
                        value={updateFormData.Range || ""}
                        onChange={(e) =>
                          handleUpdateFormChange("Range", e.target.value)
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>
                        Grid Emission Factor
                      </label>
                      <Input
                        value={updateFormData.Grid_Emission_Factor || ""}
                        onChange={(e) =>
                          handleUpdateFormChange(
                            "Grid_Emission_Factor",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>Top Speed</label>
                      <Input
                        value={updateFormData.Top_Speed || ""}
                        onChange={(e) =>
                          handleUpdateFormChange("Top_Speed", e.target.value)
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>Charging Time</label>
                      <Input
                        value={updateFormData.Charging_Time || ""}
                        onChange={(e) =>
                          handleUpdateFormChange(
                            "Charging_Time",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>Motor Power</label>
                      <Input
                        value={updateFormData.Motor_Power || ""}
                        onChange={(e) =>
                          handleUpdateFormChange("Motor_Power", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
                {selectedAsset?.type === "Solar" && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>
                        Installation Capacity
                      </label>
                      <Input
                        value={updateFormData.Installed_Capacity || ""}
                        onChange={(e) =>
                          handleUpdateFormChange(
                            "Installed_Capacity",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>
                        Installation Date
                      </label>
                      <Input
                        value={updateFormData.Installation_Date || ""}
                        onChange={(e) =>
                          handleUpdateFormChange(
                            "Installation_Date",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>
                        Energy Generation Value
                      </label>
                      <Input
                        value={updateFormData.Energy_Generation_Value || ""}
                        onChange={(e) =>
                          handleUpdateFormChange(
                            "Energy_Generation_Value",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>
                        Grid Emission Factor
                      </label>
                      <Input
                        value={updateFormData.Grid_Emission_Factor || ""}
                        onChange={(e) =>
                          handleUpdateFormChange(
                            "Grid_Emission_Factor",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>Inverter Type</label>
                      <Input
                        value={updateFormData.Inverter_Type || ""}
                        onChange={(e) =>
                          handleUpdateFormChange(
                            "Inverter_Type",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </>
                )}
                {selectedAsset?.type === "Trees" && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>Tree Name</label>
                      <Input
                        value={updateFormData.TreeName || ""}
                        onChange={(e) =>
                          handleUpdateFormChange("TreeName", e.target.value)
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>Botanical Name</label>
                      <Input
                        value={updateFormData.BotanicalName || ""}
                        onChange={(e) =>
                          handleUpdateFormChange(
                            "BotanicalName",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>Planting Date</label>
                      <Input
                        value={updateFormData.PlantingDate || ""}
                        onChange={(e) =>
                          handleUpdateFormChange("PlantingDate", e.target.value)
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>Height</label>
                      <Input
                        value={updateFormData.Height || ""}
                        onChange={(e) =>
                          handleUpdateFormChange("Height", e.target.value)
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <label style={{ fontWeight: 600 }}>Location</label>
                      <Input
                        value={updateFormData.Location || ""}
                        onChange={(e) =>
                          handleUpdateFormChange("Location", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
              </div>
              <div
                style={{
                  position: "sticky",
                  bottom: 0,
                  background: "#f9fafb",
                  padding: "1.5rem 0 0 0",
                  display: "flex",
                  justifyContent: "flex-end",
                  borderTop: "1px solid #e5e7eb",
                  borderRadius: "0 0 16px 16px",
                }}
              >
                <Button
                  type="submit"
                  style={{
                    background: "#6366f1",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "1rem",
                    borderRadius: 8,
                    padding: "0.75rem 2.5rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    transition: "background 0.2s",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#4f46e5")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "#6366f1")
                  }
                >
                  Save
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Toast Notification */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: toast.type === "error" ? "#d32f2f" : "#388E3C",
          color: "white",
          padding: "1rem 1.5rem",
          borderRadius: "8px",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          transform: toast.show ? "translateY(0)" : "translateY(100px)",
          opacity: toast.show ? 1 : 0,
          transition: "all 0.3s ease",
          zIndex: 9999,
          minWidth: "300px",
          maxWidth: "400px",
          fontSize: "14px",
          borderLeft: `4px solid ${
            toast.type === "error" ? "#f44336" : "#4CAF50"
          }`,
        }}
      >
        {toast.type === "error" ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        )}
        <span style={{ fontWeight: "500", lineHeight: "1.4" }}>
          {toast.message}
        </span>
       
      </div>
    </motion.div>
  );
};

export default AssetManagement;