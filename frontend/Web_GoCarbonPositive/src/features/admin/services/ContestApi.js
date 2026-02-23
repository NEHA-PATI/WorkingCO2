import apiClient from "./apiClient";

export const uploadQuizCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient({
    url: "/quiz/admin/upload-csv",
    method: "POST",
    data: formData,
    isFormData: true,
  });
};

export const getQuizStatus = async () => {
  return apiClient({
    url: "/quiz/admin/status",
    method: "GET",
  });
};

export const getContests = async () => {
  return apiClient({
    url: "/rewards/config",
    method: "GET",
  });
};

export const getContestStats = async () => {
  return apiClient({
    url: "/rewards/contest-stats",
    method: "GET",
  });
};

export const createContest = async (payload) => {
  return apiClient({
    url: "/rewards/rule",   // ✅ FIXED
    method: "POST",
    data: payload,
  });
};

export const updateRule = async (id, data) => {
  return apiClient({
    url: `/rewards/rule/${id}`,
    method: "PUT",
    data
  });
};

export const getRewardsCatalogAdmin = async ({ page = 1, limit = 200, search = "" } = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search && String(search).trim()) {
    params.set("search", String(search).trim());
  }

  return apiClient({
    url: `/rewards/catalog-admin?${params.toString()}`,
    method: "GET",
  });
};

export const createRewardCatalogItem = async (payload) => {
  return apiClient({
    url: "/rewards/catalog-admin",
    method: "POST",
    data: payload,
  });
};

export const updateRewardCatalogItem = async (rewardId, payload) => {
  return apiClient({
    url: `/rewards/catalog-admin/${encodeURIComponent(rewardId)}`,
    method: "PUT",
    data: payload,
  });
};

export const deleteRewardCatalogItem = async (rewardId) => {
  return apiClient({
    url: `/rewards/catalog-admin/${encodeURIComponent(rewardId)}`,
    method: "DELETE",
  });
};
