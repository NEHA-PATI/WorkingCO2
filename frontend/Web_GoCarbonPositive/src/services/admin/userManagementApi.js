import { authApiClient as apiClient } from "../apiClient";


// ✅ GET ALL USERS (Admin table)
export const fetchAllUsers = () =>
  apiClient.get("/api/v1/users").then((res) => res.data);

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
