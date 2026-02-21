import "@features/admin/styles/Support.css";
import { FaHeadphones, FaFilter, FaEye, FaCommentDots } from "react-icons/fa";
import { PiFolderOpen } from "react-icons/pi";
import { GiProgression } from "react-icons/gi";
import { MdDone } from "react-icons/md";
import { GiBackwardTime } from "react-icons/gi";
import { TiStarOutline } from "react-icons/ti";
import React, { useEffect, useState } from "react";
import { fetchTickets, updateTicket } from "@shared/utils/apiClient";

const Support = () => {

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [starredTicketIds, setStarredTicketIds] = useState([]);
  const [updatingTicketId, setUpdatingTicketId] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await fetchTickets();
      setTickets(data);
    } catch (error) {
      console.error("Failed to load tickets:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const countByStatus = (status) =>
    tickets.filter((t) => (t.status || "").toLowerCase() === status).length;

  const openCount = countByStatus("open");
  const inProgressCount = countByStatus("in_progress");

  const resolvedTodayCount = tickets.filter((t) => {
    const status = (t.status || "").toLowerCase();
    if (status !== "resolved") return false;
    const resolvedAt = t.resolved_at ? new Date(t.resolved_at) : null;
    return resolvedAt && resolvedAt >= startOfToday;
  }).length;

  const openYesterdayCount = tickets.filter((t) => {
    const createdAt = t.created_at ? new Date(t.created_at) : null;
    const status = (t.status || "").toLowerCase();
    return createdAt && createdAt >= startOfYesterday && createdAt < startOfToday && status === "open";
  }).length;

  const inProgressYesterdayCount = tickets.filter((t) => {
    const createdAt = t.created_at ? new Date(t.created_at) : null;
    const status = (t.status || "").toLowerCase();
    return createdAt && createdAt >= startOfYesterday && createdAt < startOfToday && status === "in_progress";
  }).length;

  const resolvedYesterdayCount = tickets.filter((t) => {
    const resolvedAt = t.resolved_at ? new Date(t.resolved_at) : null;
    const status = (t.status || "").toLowerCase();
    return resolvedAt && resolvedAt >= startOfYesterday && resolvedAt < startOfToday && status === "resolved";
  }).length;

  const resolvedTicketsWithTime = tickets.filter(
    (t) => t.resolved_at && t.created_at && (t.status || "").toLowerCase() === "resolved",
  );
  const avgResponseHours = resolvedTicketsWithTime.length
    ? resolvedTicketsWithTime.reduce((sum, t) => {
        const createdAt = new Date(t.created_at).getTime();
        const resolvedAt = new Date(t.resolved_at).getTime();
        const hours = Math.max(0, (resolvedAt - createdAt) / (1000 * 60 * 60));
        return sum + hours;
      }, 0) / resolvedTicketsWithTime.length
    : 0;

  const toggleTicketStar = (ticketId) => {
    setStarredTicketIds((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId],
    );
  };

  const filteredTickets = tickets.filter((t) => {
    const status = (t.status || "").toLowerCase();
    const priority = (t.priority || "").toLowerCase();
    const searchableText = [
      t.ticket_id,
      t.name,
      t.email,
      t.subject,
      t.message,
      t.category,
      t.status,
      t.priority,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm.trim().toLowerCase());
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    const matchesPriority = priorityFilter === "all" || priority === priorityFilter;
    const matchesStarred = !showStarredOnly || starredTicketIds.includes(t.ticket_id);

    return matchesSearch && matchesStatus && matchesPriority && matchesStarred;
  });

  const getNextStatus = (currentStatus) => {
    const normalized = (currentStatus || "").toLowerCase();
    if (normalized === "open") return "in_progress";
    if (normalized === "in_progress") return "resolved";
    return null;
  };

  const getActionLabel = (status) => {
    const normalized = (status || "").toLowerCase();
    if (normalized === "open") return "Solve Issue";
    if (normalized === "in_progress") return "Pending Resolved";
    return "Resolved";
  };

  const handleAdvanceStatus = async (ticket) => {
    const nextStatus = getNextStatus(ticket.status);
    if (!nextStatus) return;

    try {
      setUpdatingTicketId(ticket.ticket_id);
      await updateTicket(ticket.ticket_id, { status: nextStatus });

      setTickets((prev) =>
        prev.map((t) =>
          t.ticket_id === ticket.ticket_id
            ? {
                ...t,
                status: nextStatus,
                updated_at: new Date().toISOString(),
                resolved_at:
                  nextStatus === "resolved" ? new Date().toISOString() : t.resolved_at,
              }
            : t,
        ),
      );
    } catch (error) {
      console.error("Failed to update ticket status:", error.message);
    } finally {
      setUpdatingTicketId(null);
    }
  };
if (loading) {
  return <div className="support-page">Loading tickets...</div>;
}
  return (
    <div className="support-page">
      {/* Header Section */}
      <div className="support-header">
        <div>
          <h1>Support Management</h1>
          <p>Manage customer support tickets and inquiries</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="support-stats">
        <div className="support-card red">
          <h2>Open Tickets</h2>
          <PiFolderOpen className="card-icon red" />
          <h3>{openCount}</h3>
          <p className="red-text">
            {openCount - openYesterdayCount >= 0 ? "+" : ""}
            {openCount - openYesterdayCount} from yesterday
          </p>
        </div>
        <div className="support-card yellow">
          <h2>In Progress</h2>
          <GiProgression  className="card-icon yellow" />
          <h3>{inProgressCount}</h3>
          <p className="yellow-text">
            {inProgressCount - inProgressYesterdayCount >= 0 ? "+" : ""}
            {inProgressCount - inProgressYesterdayCount} from yesterday
          </p>
        </div>
        <div className="support-card green">
          <h2>Resolved Today</h2>
          <MdDone  className="card-icon green" />
          <h3>{resolvedTodayCount}</h3>
          <p className="green-text">
            {resolvedTodayCount - resolvedYesterdayCount >= 0 ? "+" : ""}
            {resolvedTodayCount - resolvedYesterdayCount} from yesterday
          </p>
        </div>
        <div className="support-card blue">
          <h2>Avg Response Time</h2>
          <GiBackwardTime  className="card-icon blue" />
          <h3>{avgResponseHours.toFixed(1)}h</h3>
          <p className="blue-text">based on resolved tickets</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="support-filter">
        <h2>
          <FaFilter /> Filter Tickets
        </h2>
        <div className="support-filter-controls">
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            className="starred-btn"
            onClick={() => setShowStarredOnly((prev) => !prev)}
            type="button"
          >
            <TiStarOutline />
            {showStarredOnly ? " Showing Starred" : " Starred Only"}
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="support-tickets">
        <h2>Support Tickets ({filteredTickets.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Customer</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Category</th>
              <th>Last Update</th>
              <th>Actions</th>
            </tr>
          </thead>
         <tbody>
  {filteredTickets.map((t) => (
    <tr key={t.ticket_id}>
      <td>{t.ticket_id}</td>

      <td>
        <div className="customer-info">
          <div className="avatar">
            {t.name?.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <strong>{t.name}</strong>
            <p>{t.email}</p>
          </div>
        </div>
      </td>

      <td>
        <strong>{t.subject}</strong>
        <p>{t.message?.slice(0, 60)}...</p>
      </td>

      <td>
        <span className={`priority ${t.priority?.toLowerCase()}`}>
          {t.priority}
        </span>
      </td>

      <td>
        <span
          className={`status ${t.status
            ?.toLowerCase()
            .replace("_", "-")}`}
        >
          {t.status}
        </span>
      </td>

      <td>
        <span className="category">{t.category}</span>
      </td>

      <td>
        {new Date(t.updated_at || t.created_at).toLocaleString()}
      </td>

      <td className="actions">
        <button
          type="button"
          className="view-btn"
          title={starredTicketIds.includes(t.ticket_id) ? "Unstar Ticket" : "Star Ticket"}
          onClick={() => toggleTicketStar(t.ticket_id)}
        >
          <TiStarOutline color={starredTicketIds.includes(t.ticket_id) ? "#f59e0b" : undefined} />
        </button>
        <button className="view-btn">
          <FaEye />
        </button>
        <button className="chat-btn">
          <FaCommentDots />
        </button>
        <button
          type="button"
          className="chat-btn"
          onClick={() => handleAdvanceStatus(t)}
          disabled={(t.status || "").toLowerCase() === "resolved" || updatingTicketId === t.ticket_id}
          title={getActionLabel(t.status)}
        >
          {updatingTicketId === t.ticket_id ? "Updating..." : getActionLabel(t.status)}
        </button>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default Support;

