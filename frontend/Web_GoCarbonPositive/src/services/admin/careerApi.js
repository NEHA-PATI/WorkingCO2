import { careerApiClient } from "../apiClient";

const JOBS_BASE = "/api/jobs";
const APPS_BASE = "/api/applications";

// Admin-only APIs
export const fetchJobs = async (params = {}) => {
  const res = await careerApiClient.get(JOBS_BASE, { params });
  return res.data;
};

export const createJob = async (data) => {
  const res = await careerApiClient.post(JOBS_BASE, data);
  return res.data;
};

export const updateJob = async (id, data) => {
  const res = await careerApiClient.put(`${JOBS_BASE}/${id}`, data);
  return res.data;
};

export const deleteJob = async (id) => {
  const res = await careerApiClient.delete(`${JOBS_BASE}/${id}`);
  return res.data;
};

export const fetchApplications = async () => {
  const res = await careerApiClient.get(APPS_BASE);
  return res.data;
};

export const updateApplicationStatus = async (id, status) => {
  const res = await careerApiClient.put(
    `${APPS_BASE}/${id}/status`,
    { status }
  );
  return res.data;
};
