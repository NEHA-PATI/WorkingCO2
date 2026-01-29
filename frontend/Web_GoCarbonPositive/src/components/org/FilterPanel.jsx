import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Button,
  Badge,
  Switch,
  Label,
} from "./basic-ui";

// SVG Icons
const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const XIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SlidersHorizontalIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="21" y1="4" x2="14" y2="4" />
    <line x1="10" y1="4" x2="3" y2="4" />
    <line x1="21" y1="12" x2="12" y2="12" />
    <line x1="8" y1="12" x2="3" y2="12" />
    <line x1="21" y1="20" x2="14" y2="20" />
    <line x1="10" y1="20" x2="3" y2="20" />
    <line x1="14" y1="2" x2="14" y2="6" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <line x1="14" y1="18" x2="14" y2="22" />
  </svg>
);

const MapPinIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const ASSET_TYPES = [
  "All Types",
  "EV",
  "Trees",
  "Solar",
  "Wind",
  "Hydro",
  "Thermal",
  "Bioenergy",
  "Carbon Capture",
];

const REGIONS = [
  "All Regions",
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East",
  "Africa",
];

const VERIFICATION_STATUS = ["All Status", "Verified", "Pending", "Rejected"];

const ASSET_STATUS = ["All Status", "Active", "Maintenance", "Offline"];

const DATE_RANGES = [
  "All Time",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "Last Year",
  "Custom Range",
];

const FilterPanel = ({
  filters,
  onFilterChange,
  isExpanded,
  onToggleExpanded,
  activeFiltersCount,
}) => {
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
      dateRange: "All Time",
      minCredits: "",
      maxCredits: "",
      showVerifiedOnly: false,
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FilterIcon />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <XIcon />
                <span className="ml-1">Clear All</span>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onToggleExpanded}>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <SlidersHorizontalIcon />
              </motion.div>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
          <Input
            placeholder="Search assets by name or ID..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="input-search"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex items-center space-x-2">
          <Label htmlFor="verified-only" className="text-sm font-medium">
            Verified Only
          </Label>
          <Switch
            id="verified-only"
            checked={filters.showVerifiedOnly}
            onCheckedChange={(checked) =>
              updateFilter("showVerifiedOnly", checked)
            }
          />
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <motion.div
            className="grid-1 md-grid-2 lg-grid-4 pt-4 border-t"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            {/* Asset Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Asset Type</Label>
              <select
                value={filters.assetType}
                onChange={(e) => updateFilter("assetType", e.target.value)}
                className="select"
              >
                {ASSET_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Region */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <MapPinIcon className="mr-1" />
                Region
              </Label>
              <select
                value={filters.region}
                onChange={(e) => updateFilter("region", e.target.value)}
                className="select"
              >
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Verification Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Verification</Label>
              <select
                value={filters.verificationStatus}
                onChange={(e) =>
                  updateFilter("verificationStatus", e.target.value)
                }
                className="select"
              >
                {VERIFICATION_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Asset Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <select
                value={filters.status}
                onChange={(e) => updateFilter("status", e.target.value)}
                className="select"
              >
                {ASSET_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <CalendarIcon className="mr-1" />
                Date Range
              </Label>
              <select
                value={filters.dateRange}
                onChange={(e) => updateFilter("dateRange", e.target.value)}
                className="select"
              >
                {DATE_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            {/* Credits Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Min Credits</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minCredits}
                onChange={(e) => updateFilter("minCredits", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Max Credits</Label>
              <Input
                type="number"
                placeholder="No limit"
                value={filters.maxCredits}
                onChange={(e) => updateFilter("maxCredits", e.target.value)}
              />
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
