import { authApiClient as apiClient } from "@shared/utils/apiClient";

const ADMIN_API_BASE =
  import.meta.env.VITE_ADMIN_SERVICE_URL || "http://localhost:8080";


// ✅ GET ALL USERS (Admin table)
export const fetchAllUsers = async () => {
  const res = await fetch(`${ADMIN_API_BASE}/api/v1/users`);
  const payload = await res.json();

  if (!res.ok) {
    throw new Error(payload?.message || "Failed to fetch users");
  }

  // Backend returns { success: true, data: [...] }.
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

// ✅ APPROVE USER
export const approveUser = (userId) =>
  apiClient.patch(`/api/v1/users/${userId}/approve`).then((res) => res.data);

// ✅ REJECT USER
export const rejectUser = (userId, reason = "Administrative decision") =>
  apiClient
    .patch(`/api/v1/users/${userId}/reject`, { reason })
    .then((res) => res.data);

// ✅ GET USER BY EMAIL
export const getUserByEmail = (email) =>
  apiClient.get(`/api/v1/users/email/${email}`).then((res) => res.data);

// ✅ UPDATE STATUS (optional)
export const updateUserStatus = (userId, status) =>
  apiClient
    .patch(`/api/v1/users/${userId}/status`, { status })
    .then((res) => res.data);

