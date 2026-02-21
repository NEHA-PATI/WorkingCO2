import { ENV } from "@config/env";
import { assetApiClient as apiClient } from "@shared/utils/apiClient";

const PLANTATION_BASE = `${ENV.ASSET_SERVICE_URL}/api/v1/plantation`;
const CARBON_BASE = `${ENV.ASSET_SERVICE_URL}/api/v1/carbon-capture`;

const orgAssetApi = {
  getAll: async () => {
    const response = await apiClient.get(`${PLANTATION_BASE}/all`);
    return response.data;
  },

  getAllFleet: async () => {
    const response = await apiClient.get(`${ENV.ASSET_SERVICE_URL}/api/v1/fleet/all`);
    return response.data;
  },

  getAllCarbon: async () => {
    const response = await apiClient.get(`${CARBON_BASE}/all`);
    return response.data;
  },

  updateStatus: async (assetId, status) => {
    const response = await apiClient.put(`${PLANTATION_BASE}/${assetId}/status`, {
      status,
    });
    return response.data;
  },

  updateCarbonStatus: async (captureId, status) => {
    const response = await apiClient.put(`${CARBON_BASE}/${captureId}`, {
      status,
    });
    return response.data;
  },
};

export default orgAssetApi;
