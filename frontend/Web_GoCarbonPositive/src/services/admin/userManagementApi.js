import { authApiClient as apiClient } from "../apiClient";


// ✅ GET ALL USERS (Admin table)
export const fetchAllUsers = () =>
  apiClient.get("/api/users").then((res) => res.data);

// ✅ APPROVE USER
export const approveUser = (userId) =>
  apiClient.patch(`/api/users/${userId}/approve`).then((res) => res.data);

// ✅ REJECT USER
export const rejectUser = (userId, reason = "Administrative decision") =>
  apiClient
    .patch(`/api/users/${userId}/reject`, { reason })
    .then((res) => res.data);

// ✅ GET USER BY EMAIL
export const getUserByEmail = (email) =>
  apiClient.get(`/api/users/email/${email}`).then((res) => res.data);

// ✅ UPDATE STATUS (optional)
export const updateUserStatus = (userId, status) =>
  apiClient
    .patch(`/api/users/${userId}/status`, { status })
    .then((res) => res.data);
