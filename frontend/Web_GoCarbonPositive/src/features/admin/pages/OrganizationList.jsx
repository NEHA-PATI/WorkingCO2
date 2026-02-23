import { useEffect, useMemo, useState } from "react";
import {
  Search,
  CircleDot,
  CalendarDays,
  Upload,
  Plus,
  Eye,
  Pencil,
  Save,
  X,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { ENV } from "@config/env";
import "@features/admin/styles/User Management.css";

const ORGANIZATION_API_URL = `${ENV.ORG_SERVICE_URL}/api/organizations`;

const normalizeOrganization = (row) => ({
  org_id: row.org_id,
  org_request_id: row.org_request_id,
  org_name: row.org_name || "-",
  org_type: row.org_type || "-",
  org_mail: row.org_mail || "-",
  org_contact_number: row.org_contact_number || "-",
  org_contact_person: row.org_contact_person || "-",
  org_designation: row.org_designation || "-",
  org_country: row.org_country || "-",
  org_state: row.org_state || "-",
  org_city: row.org_city || "-",
  created_at: row.created_at,
  status: "active",
});

export default function OrganizationList() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrganizationIds, setSelectedOrganizationIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewOrg, setViewOrg] = useState(null);
  const [viewOrgSnapshot, setViewOrgSnapshot] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(ORGANIZATION_API_URL);
        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch organizations");
        }

        setOrganizations((result.data || []).map(normalizeOrganization));
      } catch (err) {
        setError(err.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const now = new Date();

    return organizations.filter((org) => {
      const matchesSearch =
        !q ||
        org.org_name.toLowerCase().includes(q) ||
        org.org_mail.toLowerCase().includes(q) ||
        org.org_id.toLowerCase().includes(q) ||
        org.org_contact_person.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" || org.status.toLowerCase() === statusFilter;

      const createdAt = new Date(org.created_at);
      let matchesDate = true;

      if (dateFilter === "last7days") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        matchesDate = createdAt >= sevenDaysAgo;
      } else if (dateFilter === "last30days") {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        matchesDate = createdAt >= thirtyDaysAgo;
      } else if (dateFilter === "thisyear") {
        matchesDate = createdAt.getFullYear() === now.getFullYear();
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [organizations, searchQuery, statusFilter, dateFilter]);

  const totalRows = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedOrganizations = filtered.slice(startIndex, startIndex + rowsPerPage);
  const paginatedOrganizationIds = paginatedOrganizations.map((org) => org.org_id);

  const isAllPaginatedSelected =
    paginatedOrganizationIds.length > 0 &&
    paginatedOrganizationIds.every((id) => selectedOrganizationIds.includes(id));

  const toggleSelectAllPaginated = () => {
    setSelectedOrganizationIds((prev) => {
      if (isAllPaginatedSelected) {
        return prev.filter((id) => !paginatedOrganizationIds.includes(id));
      }

      const next = new Set(prev);
      paginatedOrganizationIds.forEach((id) => next.add(id));
      return Array.from(next);
    });
  };

  const toggleSelectOrganization = (id) => {
    setSelectedOrganizationIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleOpenView = async (orgId) => {
    try {
      setEditError("");
      const res = await fetch(`${ORGANIZATION_API_URL}/${orgId}`);
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch organization details");
      }

      setViewOrg(normalizeOrganization(result.data));
      setViewOrgSnapshot(normalizeOrganization(result.data));
      setIsEditMode(false);
    } catch (err) {
      setEditError(err.message || "Failed to fetch organization details");
    }
  };

  const handleCloseView = () => {
    setViewOrg(null);
    setViewOrgSnapshot(null);
    setIsEditMode(false);
    setEditError("");
  };

  const handleFieldChange = (field, value) => {
    setViewOrg((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSaveEdit = async () => {
    if (!viewOrg) return;

    try {
      setEditLoading(true);
      setEditError("");

      const payload = {
        org_request_id: viewOrg.org_request_id,
        org_mail: viewOrg.org_mail,
        org_name: viewOrg.org_name,
        org_type: viewOrg.org_type,
        org_contact_number: viewOrg.org_contact_number,
        org_contact_person: viewOrg.org_contact_person,
        org_designation: viewOrg.org_designation,
        org_country: viewOrg.org_country,
        org_state: viewOrg.org_state,
        org_city: viewOrg.org_city,
      };

      const res = await fetch(`${ORGANIZATION_API_URL}/${viewOrg.org_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to update organization");
      }

      const updated = normalizeOrganization(result.data);
      setOrganizations((prev) =>
        prev.map((org) => (org.org_id === updated.org_id ? updated : org))
      );
      setViewOrg(updated);
      setIsEditMode(false);
    } catch (err) {
      setEditError(err.message || "Failed to update organization");
    } finally {
      setEditLoading(false);
    }
  };

  const handleExportCsv = () => {
    const generatedAt = new Date();
    const fileName = `organization-report-${generatedAt.toISOString().slice(0, 10)}.csv`;

    const escapeCsv = (value) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };

    const headers = [
      "Organization Name",
      "Email",
      "Organization Id",
      "Type",
      "Contact Person",
      "Designation",
      "Contact Number",
      "Country",
      "State",
      "City",
      "Status",
      "Created Date",
    ];

    const rows = filtered.map((org) => [
      org.org_name,
      org.org_mail,
      org.org_id,
      org.org_type,
      org.org_contact_person,
      org.org_designation,
      org.org_contact_number,
      org.org_country,
      org.org_state,
      org.org_city,
      org.status,
      org.created_at ? new Date(org.created_at).toLocaleDateString() : "-",
    ]);

    const csvLines = [headers, ...rows].map((row) => row.map(escapeCsv).join(","));
    const csvContent = csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const buildPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) {
        pages.push(i);
      }
    } else {
      pages.push(1, 2, 3, "...", totalPages);
    }
    return pages;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="um-wrapper">
      <div className="um-container">
        <header className="um-header">
          <h1>Organization Management</h1>
          <p>
            Manage all approved organizations in one place. Control records and
            monitor organization account details.
          </p>
        </header>

        <div className="um-toolbar">
          <div className="um-search">
            <Search />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <label className="um-filter-select-wrap">
            <CircleDot size={15} />
            <select
              className="um-filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Status</option>
              <option value="active">active</option>
            </select>
          </label>

          <label className="um-filter-select-wrap">
            <CalendarDays size={15} />
            <select
              className="um-filter-select"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Date</option>
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
              <option value="thisyear">This year</option>
            </select>
          </label>

          <div className="um-toolbar-spacer" />

          <button className="um-export-btn" type="button" onClick={handleExportCsv}>
            <Upload size={16} />
            <span>Export</span>
          </button>

          <button className="um-add-btn" type="button">
            <Plus size={16} />
            <span>Add Organization</span>
          </button>
        </div>

        <div className="um-table-card">
          <div className="um-table-scroll">
            <table className="um-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="um-checkbox"
                      aria-label="Select all organizations on current page"
                      checked={isAllPaginatedSelected}
                      onChange={toggleSelectAllPaginated}
                    />
                  </th>
                  <th>Organization Name</th>
                  <th>Email</th>
                  <th>Organization Id</th>
                  <th>Type</th>
                  <th>Contact Person</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrganizations.map((org) => (
                  <tr key={org.org_id}>
                    <td>
                      <input
                        type="checkbox"
                        className="um-checkbox"
                        checked={selectedOrganizationIds.includes(org.org_id)}
                        onChange={() => toggleSelectOrganization(org.org_id)}
                        aria-label={`Select organization ${org.org_name}`}
                      />
                    </td>

                    <td>
                      <div className="um-user-cell">
                        <div className="um-avatar">
                          {org.org_name?.charAt(0)?.toUpperCase() || "O"}
                        </div>
                        <span className="um-user-name">{org.org_name}</span>
                      </div>
                    </td>

                    <td>{org.org_mail}</td>
                    <td>{org.org_id}</td>
                    <td>{org.org_type}</td>
                    <td>{org.org_contact_person}</td>

                    <td>
                      <span className="um-badge um-badge--active">{org.status}</span>
                    </td>

                    <td>
                      {org.created_at ? new Date(org.created_at).toLocaleDateString() : "-"}
                    </td>
                    <td>
                      <div className="um-actions">
                        <button
                          className="um-action-btn"
                          type="button"
                          onClick={() => handleOpenView(org.org_id)}
                          title="View organization"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="um-pagination">
            <div className="um-page-info">
              <span>Rows per page</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>of {totalRows} rows</span>
            </div>

            <div className="um-page-numbers">
              <button
                className="um-page-btn"
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                aria-label="First page"
              >
                <ChevronsLeft />
              </button>
              <button
                className="um-page-btn"
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft />
              </button>

              {buildPageNumbers().map((pg, i) =>
                pg === "..." ? (
                  <span key={`e-${i}`} className="um-page-ellipsis">
                    {"..."}
                  </span>
                ) : (
                  <button
                    key={pg}
                    type="button"
                    className={`um-page-btn ${currentPage === pg ? "um-page-btn--active" : ""}`}
                    onClick={() => setCurrentPage(pg)}
                  >
                    {pg}
                  </button>
                )
              )}

              <button
                className="um-page-btn"
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                <ChevronRight />
              </button>
              <button
                className="um-page-btn"
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                aria-label="Last page"
              >
                <ChevronsRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewOrg && (
        <div className="um-modal-overlay" role="dialog" aria-modal="true">
          <div className="um-modal um-org-modal">
            <div className="um-org-modal-head">
              <h3>Organization Details</h3>
              <button
                type="button"
                className="um-action-btn"
                onClick={handleCloseView}
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            {editError && <p className="um-org-error">{editError}</p>}

            <div className="um-org-grid">
              <label>
                Organization ID
                <input value={viewOrg.org_id} disabled />
              </label>
              <label>
                Request ID
                <input
                  value={viewOrg.org_request_id}
                  onChange={(e) => handleFieldChange("org_request_id", e.target.value)}
                  disabled={!isEditMode}
                />
              </label>
              <label>
                Organization Name
                <input
                  value={viewOrg.org_name}
                  onChange={(e) => handleFieldChange("org_name", e.target.value)}
                  disabled={!isEditMode}
                />
              </label>
              <label>
                Email
                <input
                  value={viewOrg.org_mail}
                  onChange={(e) => handleFieldChange("org_mail", e.target.value)}
                  disabled={!isEditMode}
                />
              </label>
              <label>
                Type
                <input
                  value={viewOrg.org_type}
                  onChange={(e) => handleFieldChange("org_type", e.target.value)}
                  disabled={!isEditMode}
                />
              </label>
              <label>
                Contact Person
                <input
                  value={viewOrg.org_contact_person}
                  onChange={(e) => handleFieldChange("org_contact_person", e.target.value)}
                  disabled={!isEditMode}
                />
              </label>
              <label>
                Designation
                <input
                  value={viewOrg.org_designation}
                  onChange={(e) => handleFieldChange("org_designation", e.target.value)}
                  disabled={!isEditMode}
                />
              </label>
              <label>
                Contact Number
                <input
                  value={viewOrg.org_contact_number}
                  onChange={(e) => handleFieldChange("org_contact_number", e.target.value)}
                  disabled={!isEditMode}
                />
              </label>
              <label>
                Country
                <input
                  value={viewOrg.org_country}
                  onChange={(e) => handleFieldChange("org_country", e.target.value)}
                  disabled={!isEditMode}
                />
              </label>
              <label>
                State
                <input
                  value={viewOrg.org_state}
                  onChange={(e) => handleFieldChange("org_state", e.target.value)}
                  disabled={!isEditMode}
                />
              </label>
              <label>
                City
                <input
                  value={viewOrg.org_city}
                  onChange={(e) => handleFieldChange("org_city", e.target.value)}
                  disabled={!isEditMode}
                />
              </label>
            </div>

            <div className="um-modal-actions">
              {!isEditMode ? (
                <button
                  type="button"
                  className="um-modal-btn um-modal-btn--confirm"
                  onClick={() => {
                    setViewOrgSnapshot(viewOrg);
                    setIsEditMode(true);
                  }}
                >
                  <Pencil size={14} /> Edit
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="um-modal-btn um-modal-btn--confirm"
                    onClick={handleSaveEdit}
                    disabled={editLoading}
                  >
                    <Save size={14} /> {editLoading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="um-modal-btn um-modal-btn--cancel"
                    onClick={() => {
                      setViewOrg(viewOrgSnapshot);
                      setIsEditMode(false);
                    }}
                    disabled={editLoading}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
