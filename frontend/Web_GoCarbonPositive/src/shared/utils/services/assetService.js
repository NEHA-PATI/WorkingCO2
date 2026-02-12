import { assetApiClient as apiClient } from "@shared/utils/apiClient";

export const assetService = {
  getAllAssetStatuses: async (userId) => {
    const response = await apiClient.get(`/assets/user/${userId}/status`);
    return response.data;
  },

  healthCheck: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default assetService;

