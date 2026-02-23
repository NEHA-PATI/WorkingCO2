import { careerApiClient } from "@shared/utils/apiClient";

const JOBS_BASE = "/api/jobs";
const APPS_BASE = "/api/applications";

export const fetchActiveJobs = async () => {
  const res = await careerApiClient.get(JOBS_BASE, {
    params: { status: "Active" },
  });
  return res.data;
};

export const submitApplication = async (data) => {
  const res = await careerApiClient.post(APPS_BASE, data);
  return res.data;
};

