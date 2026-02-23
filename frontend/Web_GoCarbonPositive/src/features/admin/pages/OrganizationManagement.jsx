import React from "react";

const containerStyle = {
  padding: "24px",
  background: "#ffffff",
  borderRadius: "14px",
  border: "1px solid #e5e7eb",
};

export default function OrganizationManagement() {
  return (
    <div style={containerStyle}>
      <h2 style={{ marginTop: 0 }}>Organisation Management</h2>
      <p style={{ marginBottom: 0, color: "#475569" }}>
        This is the Organization Management page. Nested sections can be added
        here next.
      </p>
    </div>
  );
}
