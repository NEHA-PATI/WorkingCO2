import { assetApiClient as apiClient } from "../apiClient";


export const solarService = {
  getAllSolarPanels: async (userId) => {
    const response = await apiClient.get(`/solarpanel/${userId}`);
    return response.data;
  },

  getSolarPanel: async (userId, panelId) => {
    const response = await apiClient.get(`/solarpanel/${userId}/${panelId}`);
    return response.data;
  },

  createSolarPanel: async (panelData) => {
    const response = await apiClient.post('/solarpanel', panelData);
    return response.data;
  },

  updateSolarPanel: async (userId, panelId, panelData) => {
    const response = await apiClient.put(`/solarpanel/${userId}/${panelId}`, panelData);
    return response.data;
  },

  deleteSolarPanel: async (userId, panelId) => {
    const response = await apiClient.delete(`/solarpanel/${userId}/${panelId}`);
    return response.data;
  },
};

export default solarService;
