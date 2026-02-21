import { ENV } from "@config/env";
import { assetApiClient as apiClient } from "@shared/utils/apiClient";

const PLANTATION_BASE = `${ENV.ASSET_SERVICE_URL}/api/v1/plantation`;

const orgAssetApi = {
  getAll: async () => {
    const response = await apiClient.get(`${PLANTATION_BASE}/all`);
    return response.data;
  },

  updateStatus: async (assetId, status) => {
    const response = await apiClient.put(`${PLANTATION_BASE}/${assetId}/status`, {
      status,
    });
    return response.data;
  },
};

export default orgAssetApi;
