import React from "react";

const containerStyle = {
  padding: "24px",
  background: "#ffffff",
  borderRadius: "14px",
  border: "1px solid #e5e7eb",
};

export default function OrganizationList() {
  return (
    <div style={containerStyle}>
      <h2 style={{ marginTop: 0 }}>Organization</h2>
      <p style={{ marginBottom: 0, color: "#475569" }}>
        Organization listing and management page.
      </p>
    </div>
  );
}
