import { blueCarbonApiClient } from "@shared/utils/apiClient";

const BASE = "/blue-carbon";
export const blueCarbonApi = {
  summary: async () => (await blueCarbonApiClient.get(`${BASE}/summary`)).data,
  monitoringReport: async (params = {}) => (await blueCarbonApiClient.get(`${BASE}/reports/monitoring.csv`, { params, responseType: "blob" })).data,
  methodologies: async () => (await blueCarbonApiClient.get(`${BASE}/methodologies`)).data,
  projects: async () => (await blueCarbonApiClient.get(`${BASE}/projects`)).data,
  createProject: async (payload) => (await blueCarbonApiClient.post(`${BASE}/projects`, payload)).data,
  project: async (projectId) => (await blueCarbonApiClient.get(`${BASE}/projects/${projectId}`)).data,
  tiles: async (projectId) => (await blueCarbonApiClient.get(`${BASE}/projects/${projectId}/tiles`)).data,
  generateTiles: async (projectId, payload) => (await blueCarbonApiClient.post(`${BASE}/projects/${projectId}/tiles/generate`, payload)).data,
  assignments: async (projectId) => (await blueCarbonApiClient.get(`${BASE}/projects/${projectId}/assignments`)).data,
  assignTiles: async (projectId, payload) => (await blueCarbonApiClient.post(`${BASE}/projects/${projectId}/assignments`, payload)).data,
  clearAssignments: async (projectId) => (await blueCarbonApiClient.delete(`${BASE}/projects/${projectId}/assignments`)).data,
  createSchedule: async (projectId, payload) => (await blueCarbonApiClient.post(`${BASE}/projects/${projectId}/schedules`, payload)).data,
  tasks: async (params = {}) => (await blueCarbonApiClient.get(`${BASE}/tasks`, { params })).data,
  startVisit: async (taskId, payload) => (await blueCarbonApiClient.post(`${BASE}/tasks/${taskId}/visits`, payload)).data,
  uploadVisitMedia: async (visitId, formData, onUploadProgress) => (await blueCarbonApiClient.post(`${BASE}/visits/${visitId}/media`, formData, { headers: { "Content-Type": "multipart/form-data" }, onUploadProgress })).data,
  visitMedia: async (visitId) => (await blueCarbonApiClient.get(`${BASE}/visits/${visitId}/media`)).data,
  tileHistory: async (tileId) => (await blueCarbonApiClient.get(`${BASE}/tiles/${tileId}/history`)).data,
  submitVisit: async (visitId, payload) => (await blueCarbonApiClient.post(`${BASE}/visits/${visitId}/submit`, payload)).data,
  reviewMedia: async (evidenceId, payload) => (await blueCarbonApiClient.post(`${BASE}/evidence/${evidenceId}/review`, payload)).data,
  mediaReviewHistory: async (evidenceId) => (await blueCarbonApiClient.get(`${BASE}/evidence/${evidenceId}/review-history`)).data,
  updateProject: async (projectId, payload) => (await blueCarbonApiClient.patch(`${BASE}/projects/${projectId}`, payload)).data,
  baselines: async (projectId) => (await blueCarbonApiClient.get(`${BASE}/projects/${projectId}/baselines`)).data,
  observations: async (projectId) => (await blueCarbonApiClient.get(`${BASE}/projects/${projectId}/observations`)).data,
  createObservation: async (projectId, payload) => (await blueCarbonApiClient.post(`${BASE}/projects/${projectId}/observations`, payload)).data,
  samples: async (projectId) => (await blueCarbonApiClient.get(`${BASE}/projects/${projectId}/samples`)).data,
  createSample: async (projectId, payload) => (await blueCarbonApiClient.post(`${BASE}/projects/${projectId}/samples`, payload)).data,
  reviewObservation: async (projectId, observationId, payload) => (await blueCarbonApiClient.post(`${BASE}/projects/${projectId}/observations/${observationId}/review`, payload)).data,
  reviewSample: async (projectId, sampleId, payload) => (await blueCarbonApiClient.post(`${BASE}/projects/${projectId}/samples/${sampleId}/review`, payload)).data,
  revisions: async (projectId, recordType, recordId) => {
    if (String(projectId).startsWith("demo-")) {
      const approved = String(recordId).includes("1002");
      const collected = String(recordId).startsWith("SOIL-") && String(recordId).includes("DW");
      return { data: [{
        revision_id: `demo-revision-${recordId}`,
        version: approved ? 2 : 1,
        change_reason: approved ? "Evidence reviewed and approved" : collected ? "Sample collected and custody record created" : "Initial field record captured",
        created_at: approved ? "2026-09-20T14:10:00Z" : "2026-09-18T09:30:00Z",
      }] };
    }
    return (await blueCarbonApiClient.get(`${BASE}/projects/${projectId}/evidence/${recordType}/${recordId}/revisions`)).data;
  },
  reviewHistory: async (projectId, recordId) => {
    if (String(projectId).startsWith("demo-")) {
      const approved = String(recordId).includes("1002");
      const collected = String(recordId).startsWith("SOIL-") && String(recordId).includes("DW");
      return { data: [{
        review_id: `demo-review-${recordId}`,
        from_status: collected ? "collected" : "pending",
        to_status: approved ? "approved" : collected ? "lab_review" : "pending",
        comment: approved ? "Field evidence verified by the review team." : collected ? "Sample received; laboratory analysis is in review." : "Awaiting administrator review of field evidence.",
        created_at: approved ? "2026-09-20T14:10:00Z" : "2026-09-18T12:15:00Z",
      }] };
    }
    return (await blueCarbonApiClient.get(`${BASE}/projects/${projectId}/review-history/${recordId}`)).data;
  },
  correctObservation: async (projectId, observationId, payload) => (await blueCarbonApiClient.patch(`${BASE}/projects/${projectId}/observations/${observationId}/correction`, payload)).data,
  correctSample: async (projectId, sampleId, payload) => (await blueCarbonApiClient.patch(`${BASE}/projects/${projectId}/samples/${sampleId}/correction`, payload)).data,
};
