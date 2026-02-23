"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Search,
  CircleDot,
  CalendarDays,
  Upload,
  Plus,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react"
import "@features/admin/styles/User Management.css"

// Helper functions outside component (Allowed)
function getInitials(name) {
  return name?.split(" ").map((w) => w[0]).join("").slice(0, 2)
}

export default function UserManagementPage() {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmSuspendUser, setConfirmSuspendUser] = useState(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/users")
        const result = await res.json()

        if (result.success) {
          setUsers(result.data)
        }
      } catch (err) {
        setError("Server error")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // 🔥 ALL HOOKS BEFORE RETURNS
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const now = new Date()

    return users.filter((u) => {
      const matchesSearch =
        !q ||
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.u_id?.toLowerCase().includes(q)

      const userStatus = (u.status || "").toLowerCase()
      const matchesStatus =
        statusFilter === "all" || userStatus === statusFilter

      const createdAt = new Date(u.created_at)
      let matchesDate = true

      if (dateFilter === "last7days") {
        const sevenDaysAgo = new Date(now)
        sevenDaysAgo.setDate(now.getDate() - 7)
        matchesDate = createdAt >= sevenDaysAgo
      } else if (dateFilter === "last30days") {
        const thirtyDaysAgo = new Date(now)
        thirtyDaysAgo.setDate(now.getDate() - 30)
        matchesDate = createdAt >= thirtyDaysAgo
      } else if (dateFilter === "thisyear") {
        matchesDate = createdAt.getFullYear() === now.getFullYear()
      }

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [searchQuery, users, statusFilter, dateFilter])

  const totalRows = filtered.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)

  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedUsers = filtered.slice(
    startIndex,
    startIndex + rowsPerPage
  )
  const paginatedUserIds = paginatedUsers.map((user) => user.id)
  const isAllPaginatedSelected =
    paginatedUserIds.length > 0 &&
    paginatedUserIds.every((id) => selectedUserIds.includes(id))

  const toggleSelectAllPaginated = () => {
    setSelectedUserIds((prev) => {
      if (isAllPaginatedSelected) {
        return prev.filter((id) => !paginatedUserIds.includes(id))
      }
      const next = new Set(prev)
      paginatedUserIds.forEach((id) => next.add(id))
      return Array.from(next)
    })
  }

  const toggleSelectUser = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSuspendUser = (id) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== id) return user

        const currentStatus = (user.status || "").toLowerCase()
        if (currentStatus !== "active") return user

        return { ...user, status: "suspended" }
      })
    )
  }

  const handleConfirmSuspend = () => {
    if (!confirmSuspendUser?.id) return
    handleSuspendUser(confirmSuspendUser.id)
    setConfirmSuspendUser(null)
  }

  const handleExportCsv = () => {
    const reportUsers = users
    const generatedAt = new Date()
    const fileName = `user-status-report-${generatedAt
      .toISOString()
      .slice(0, 10)}.csv`

    const toRoleLabel = (roleId) => {
      if (roleId === 1) return "User"
      if (roleId === 2) return "Admin"
      if (roleId === 3) return "Super Admin"
      return "No Role"
    }

    const escapeCsv = (value) => {
      const text = String(value ?? "")
      return `"${text.replace(/"/g, '""')}"`
    }

    const headers = ["Full Name", "Email", "User Id", "Status", "Role", "Joined Date"]
    const rows = reportUsers.map((user) => [
      user.username || "-",
      user.email || "-",
      user.u_id || "-",
      user.status || "-",
      toRoleLabel(user.role_id),
      user.created_at ? new Date(user.created_at).toLocaleDateString() : "-",
    ])

    const csvLines = [headers, ...rows].map((row) => row.map(escapeCsv).join(","))
    const csvContent = csvLines.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function buildPageNumbers() {
    const pages = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1, 2, 3, "...", totalPages)
    }
    return pages
  }

  // ✅ RETURNS AFTER ALL HOOKS
  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="um-wrapper">
      <div className="um-container">
        {/* Header */}
        <header className="um-header">
          <h1>User Management</h1>
          <p>
            Manage all users in one place. Control access, assign roles, and
            monitor activity across your platform.
          </p>
        </header>

        {/* Toolbar */}
        <div className="um-toolbar">
          <div className="um-search">
            <Search />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <label className="um-filter-select-wrap">
            <CircleDot size={15} />
            <select
              className="um-filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="all">Status</option>
              <option value="active">active</option>
              <option value="suspended">suspended</option>
            </select>
          </label>

          <label className="um-filter-select-wrap">
            <CalendarDays size={15} />
            <select
              className="um-filter-select"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value)
                setCurrentPage(1)
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
            <span>Add User</span>
          </button>
        </div>

        {/* Table */}
        <div className="um-table-card">
          <div className="um-table-scroll">
            <table className="um-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="um-checkbox"
                      aria-label="Select all users on current page"
                      checked={isAllPaginatedSelected}
                      onChange={toggleSelectAllPaginated}
                    />
                  </th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>User Id</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
  {paginatedUsers.map((user) => (
    <tr key={user.id}>
      <td>
        <input
          type="checkbox"
          className="um-checkbox"
          checked={selectedUserIds.includes(user.id)}
          onChange={() => toggleSelectUser(user.id)}
          aria-label={`Select user ${user.username}`}
        />
      </td>

      <td>
        <div className="um-user-cell">
          <div className="um-avatar">
            {user.username?.charAt(0)?.toUpperCase()}
          </div>
          <span className="um-user-name">{user.username}</span>
        </div>
      </td>

      <td>{user.email}</td>
      <td>{user.u_id}</td>

      <td>
        <span className={`um-badge um-badge--${user.status}`}>
          {user.status}
        </span>
      </td>

      <td>
        {user.role_id === 1
          ? "User"
          : user.role_id === 2
          ? "Admin"
          : user.role_id === 3
          ? "Super Admin"
          : "No Role"}
      </td>

      <td>
        {new Date(user.created_at).toLocaleDateString()}
      </td>

      <td>
        <div className="um-actions">
          <button
            className={`um-suspend-btn ${(user.status || "").toLowerCase() === "suspended" ? "um-suspend-btn--disabled" : ""}`}
            type="button"
            onClick={() => setConfirmSuspendUser(user)}
            disabled={(user.status || "").toLowerCase() === "suspended"}
          >
            {(user.status || "").toLowerCase() === "suspended" ? "Suspended" : "Suspend User"}
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>

          {/* Pagination */}
          <div className="um-pagination">
            <div className="um-page-info">
              <span>Rows per page</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value))
                  setCurrentPage(1)
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
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
      {confirmSuspendUser && (
        <div className="um-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="um-suspend-title">
          <div className="um-modal">
            <h3 id="um-suspend-title">Suspend Confirmation</h3>
            <p>Are u sure want to suspend this user/admin</p>
            <div className="um-modal-actions">
              <button type="button" className="um-modal-btn um-modal-btn--confirm" onClick={handleConfirmSuspend}>
                Yes Continue
              </button>
              <button type="button" className="um-modal-btn um-modal-btn--cancel" onClick={() => setConfirmSuspendUser(null)}>
                No Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
