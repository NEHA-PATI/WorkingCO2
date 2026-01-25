import React from "react";
import "../../styles/admin/Support.css";
import { FaHeadphones, FaFilter, FaEye, FaCommentDots } from "react-icons/fa";
import { PiFolderOpen } from "react-icons/pi";
import { GiProgression } from "react-icons/gi";
import { MdDone } from "react-icons/md";
import { GiBackwardTime } from "react-icons/gi";
import { TiStarOutline } from "react-icons/ti";


import { MdArchive } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";

const Support = () => {
  const tickets = [
    {
      id: "TICK-2024-001",
      customer: "John Smith",
      email: "john.smith@email.com",
      subject: "EV credit verification delay",
      description:
        "Submitted Tesla Model 3 verification document but it's still pending.",
      priority: "HIGH",
      status: "Open",
      category: "Verification",
      assignedTo: "Sarah Admin",
      lastUpdate: "2024-06-15 14:30",
    },
    {
      id: "TICK-2024-002",
      customer: "ABC Corporation",
      email: "admin@abccorp.com",
      subject: "Transaction failed",
      description:
        "Payment processed but carbon credits not reflected in dashboard.",
      priority: "MEDIUM",
      status: "In Progress",
      category: "Marketplace",
      assignedTo: "Mike Admin",
      lastUpdate: "2024-06-15 09:15",
    },
    {
      id: "TICK-2024-003",
      customer: "Sarah Johnson",
      email: "sarah.j@email.com",
      subject: "Login issues",
      description: "Unable to login after password reset request.",
      priority: "LOW",
      status: "Resolved",
      category: "Account",
      assignedTo: "Admin Team",
      lastUpdate: "2024-06-14 11:45",
    },
    {
      id: "TICK-2024-004",
      customer: "GreenTech Solutions",
      email: "dev@greentech.com",
      subject: "API documentation request",
      description: "Need detailed API docs for carbon credit transactions.",
      priority: "MEDIUM",
      status: "Open",
      category: "Technical",
      assignedTo: "Tech Team",
      lastUpdate: "2024-06-15 16:20",
    },
  ];

  return (
    <div className="support-page">
      {/* Header Section */}
      <div className="support-header">
        <div>
          <h1>Support Management</h1>
          <p>Manage customer support tickets and inquiries</p>
        </div>
        <div className="support-header-buttons">
          <button className="archive-btn">
            <MdArchive /> Archive Resolved
          </button>
          <button className="create-btn">
            <IoMdAddCircle /> Create Ticket
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="support-stats">
        <div className="support-card red">
          <h2>Open Tickets</h2>
          <PiFolderOpen className="card-icon red" />
          <h3>7</h3>
          <p className="red-text">+2 from yesterday</p>
        </div>
        <div className="support-card yellow">
          <h2>In Progress</h2>
          <GiProgression  className="card-icon yellow" />
          <h3>12</h3>
          <p className="yellow-text">-3 from yesterday</p>
        </div>
        <div className="support-card green">
          <h2>Resolved Today</h2>
          <MdDone  className="card-icon green" />
          <h3>8</h3>
          <p className="green-text">+5 from yesterday</p>
        </div>
        <div className="support-card blue">
          <h2>Avg Response Time</h2>
          <GiBackwardTime  className="card-icon blue" />
          <h3>2.5h</h3>
          <p className="blue-text">-0.5h from yesterday</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="support-filter">
        <h2>
          <FaFilter /> Filter Tickets
        </h2>
        <div className="support-filter-controls">
          <input type="text" placeholder="Search tickets..." />
          <select>
            <option>All Status</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <select>
            <option>All Priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <button className="starred-btn"><TiStarOutline /> Starred Only</button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="support-tickets">
        <h2>Support Tickets ({tickets.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Customer</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Category</th>
              <th>Assigned To</th>
              <th>Last Update</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t, index) => (
              <tr key={index}>
                <td>{t.id}</td>
                <td>
                  <div className="customer-info">
                    <div className="avatar">
                      {t.customer.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <strong>{t.customer}</strong>
                      <p>{t.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <strong>{t.subject}</strong>
                  <p>{t.description.slice(0, 60)}...</p>
                </td>
                <td>
                  <span className={`priority ${t.priority.toLowerCase()}`}>
                    {t.priority}
                  </span>
                </td>
                <td>
                  <span
                    className={`status ${t.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {t.status}
                  </span>
                </td>
                <td>
                  <span className="category">{t.category}</span>
                </td>
                <td>{t.assignedTo}</td>
                <td>{t.lastUpdate}</td>
                <td className="actions">
                  <button className="view-btn">
                    <FaEye />
                  </button>
                  <button className="chat-btn">
                    <FaCommentDots />
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
