import { assetApiClient as apiClient } from "@shared/utils/apiClient";
import { ENV } from "@config/env";

const API_BASE_URL = `${ENV.ASSET_SERVICE_URL}/api/v1`;
const isSuccessResponse = (payload) =>
  payload?.success === true || payload?.status === "success";

// API service for fetching assets
export const assetAPI = {
  // Fetch all EVs for a user
  getEVs: async (userId) => {
    try {
      const response = await apiClient.get(
        `${API_BASE_URL}/evmasterdata/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching EVs:", error);
      throw error;
    }
  },

  // Fetch all Solar Panels for a user
  getSolarPanels: async (userId) => {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/solarpanel/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Solar Panels:", error);
      throw error;
    }
  },

  // Fetch all Trees for a user
  getTrees: async (userId) => {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/tree/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Trees:", error);
      throw error;
    }
  },

  // Fetch all assets for a user/org (combined)
  getAllAssets: async (userId, orgId = userId) => {
    try {
      const [evsResult, solarResult, treesResult, captureResult, plantationResult] =
        await Promise.allSettled([
          apiClient.get(`${API_BASE_URL}/evmasterdata/${userId}`),
          apiClient.get(`${API_BASE_URL}/solarpanel/${userId}`),
          apiClient.get(`${API_BASE_URL}/tree/${userId}`),
          apiClient.get(`${API_BASE_URL}/carbon-capture/org/${orgId}`),
          apiClient.get(`${API_BASE_URL}/plantation/org/${orgId}`),
        ]);

      const evsResponse =
        evsResult.status === "fulfilled" ? evsResult.value : { data: {} };
      const solarResponse =
        solarResult.status === "fulfilled" ? solarResult.value : { data: {} };
      const treesResponse =
        treesResult.status === "fulfilled" ? treesResult.value : { data: {} };
      const carbonResponse =
        captureResult.status === "fulfilled" ? captureResult.value : { data: {} };
      const plantationResponse =
        plantationResult.status === "fulfilled" ? plantationResult.value : { data: {} };

      // Transform data to match AssetCard format
      const assets = [];

      console.log("EV Response:", evsResponse.data);
      console.log("Solar Response:", solarResponse.data);
      console.log("Tree Response:", treesResponse.data);

      // Transform EVs
      if (isSuccessResponse(evsResponse.data) && evsResponse.data.data) {
        evsResponse.data.data.forEach((ev) => {
          assets.push({
            id: ev.vuid || `EV-${ev.ev_id}`,
            name: `${ev.manufacturers} ${ev.model}`,
            type: "EV",
            location: "Location not specified", // EV data doesn't have location
            creditsGenerated: Math.floor(Math.random() * 500) + 100, // Mock credits for now
            verified: true,
            lastUpdated: new Date(
              ev.created_at || Date.now()
            ).toLocaleDateString(),
            status: "Active",
            efficiency: `${Math.floor(Math.random() * 20) + 80}%`,
            region: "North America",
            originalData: ev,
          });
        });
      }

      // Transform Solar Panels
      if (isSuccessResponse(solarResponse.data) && solarResponse.data.data) {
        solarResponse.data.data.forEach((solar) => {
          assets.push({
            id: solar.suid || `SOLAR-${solar.solar_id}`,
            name: "Solar", // Only show 'Solar' as the name
            type: "Solar",
            location: "Location not specified",
            creditsGenerated: Math.floor(Math.random() * 1000) + 200,
            verified: true,
            lastUpdated: new Date(
              solar.created_at || Date.now()
            ).toLocaleDateString(),
            status: "Active",
            efficiency: `${Math.floor(Math.random() * 15) + 85}%`,
            region: "North America",
            originalData: solar,
          });
        });
      }

      // Transform Trees
      if (isSuccessResponse(treesResponse.data) && treesResponse.data.data) {
        treesResponse.data.data.forEach((tree) => {
          assets.push({
            id: tree.tid || `TREE-${tree.tree_id}`,
            name: tree.treename,
            type: "Trees",
            location: tree.location || "Location not specified",
            creditsGenerated: Math.floor(Math.random() * 300) + 50,
            verified: false, // Trees might need verification
            lastUpdated: new Date(
              tree.plantingdate || Date.now()
            ).toLocaleDateString(),
            status: "Active",
            region: "North America",
            originalData: tree,
          });
        });
      }
      // Transform Plantation assets
      if (isSuccessResponse(plantationResponse.data) && plantationResponse.data.data) {
        plantationResponse.data.data.forEach((plantation) => {
          assets.push({
            id: plantation.p_id,
            name: plantation.plantation_name,
            type: "Trees",
            location:
              Array.isArray(plantation.points) && plantation.points.length > 0
                ? `${plantation.points[0].lat}, ${plantation.points[0].lng}`
                : "Location not specified",
            creditsGenerated: Math.floor(Math.random() * 300) + 50,
            verified: plantation.verification_status === "accepted",
            lastUpdated: new Date(
              plantation.updated_at || plantation.created_at || Date.now()
            ).toLocaleDateString(),
            status:
              plantation.verification_status === "accepted"
                ? "Active"
                : plantation.verification_status === "rejected"
                ? "Offline"
                : "Maintenance",
            region: "North America",
            originalData: {
              t_uid: plantation.p_id,
              treename: plantation.plantation_name,
              botanicalname: plantation.species_name,
              plantingdate: plantation.plantation_date,
              location:
                Array.isArray(plantation.points) && plantation.points.length > 0
                  ? `${plantation.points[0].lat}, ${plantation.points[0].lng}`
                  : "",
              area: plantation.total_area,
              trees_planted: plantation.trees_planted,
              manager_name: plantation.manager_name,
              manager_contact: plantation.manager_contact,
              plant_age: plantation.plant_age_years,
              area_unit: plantation.area_unit,
              points: plantation.points,
            },
          });
        });
      }
      // Transform Carbon Capture assets
      if (isSuccessResponse(carbonResponse.data) && carbonResponse.data.data) {
        carbonResponse.data.data.forEach((capture) => {
          assets.push({
            id: capture.c_uid || `CC-${capture.capture_id}`,
            name: capture.industry_type
              ? `${capture.industry_type} Carbon Capture`
              : "Carbon Capture Facility",
            type: "Carbon Capture",
            location: "Location not specified",
            creditsGenerated: Math.floor(Math.random() * 900) + 150,
            verified: capture.status === "approved",
            lastUpdated: new Date(
              capture.updated_at || capture.created_at || Date.now()
            ).toLocaleDateString(),
            status:
              capture.status === "approved"
                ? "Active"
                : capture.status === "rejected"
                ? "Offline"
                : "Maintenance",
            efficiency: `${
              capture.capture_efficiency_percent !== undefined
                ? capture.capture_efficiency_percent
                : 0
            }%`,
            region: "North America",
            originalData: capture,
          });
        });
      }

      return assets;
    } catch (error) {
      console.error("Error fetching all assets:", error);
      throw error;
    }
  },

  // Delete EV
  deleteEV: async (evId) => {
    try {
      const response = await apiClient.delete(
        `${API_BASE_URL}/evmasterdata/${evId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting EV:", error);
      throw error;
    }
  },

  // Delete Solar Panel
  deleteSolar: async (solarId) => {
    try {
      const response = await apiClient.delete(
        `${API_BASE_URL}/solarpanel/${solarId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting Solar Panel:", error);
      throw error;
    }
  },

  // Delete Tree
  deleteTree: async (treeId) => {
    try {
      const response = await apiClient.delete(`${API_BASE_URL}/tree/${treeId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting Tree:", error);
      throw error;
    }
  },

  // Update EV
  updateEV: async (evId, data) => {
    try {
      const response = await apiClient.put(
        `${API_BASE_URL}/evmasterdata/${evId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating EV:", error);
      throw error;
    }
  },

  // Update Solar Panel
  updateSolar: async (solarId, data) => {
    try {
      const response = await apiClient.put(
        `${API_BASE_URL}/solarpanel/${solarId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating Solar Panel:", error);
      throw error;
    }
  },

  // Update Tree
  updateTree: async (treeId, data) => {
    try {
      const response = await apiClient.put(`${API_BASE_URL}/tree/${treeId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating Tree:", error);
      throw error;
    }
  },
  // Create Plantation asset
  createPlantation: async (data) => {
    try {
      const response = await apiClient.post(`${API_BASE_URL}/plantation`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating Plantation asset:", error);
      throw error;
    }
  },

  // Get Plantation assets by organization
  getPlantationByOrg: async (orgId) => {
    try {
      const response = await apiClient.get(
        `${API_BASE_URL}/plantation/org/${orgId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching Plantation assets:", error);
      throw error;
    }
  },
  // Create Carbon Capture asset
  createCarbonCapture: async (data) => {
    try {
      const response = await apiClient.post(
        `${API_BASE_URL}/carbon-capture`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating Carbon Capture asset:", error);
      throw error;
    }
  },

  // Get Carbon Capture assets by organization
  getCarbonCaptureByOrg: async (orgId) => {
    try {
      const response = await apiClient.get(
        `${API_BASE_URL}/carbon-capture/org/${orgId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching Carbon Capture assets:", error);
      throw error;
    }
  },

  // Update Carbon Capture asset
  updateCarbonCapture: async (captureId, data) => {
    try {
      const response = await apiClient.put(
        `${API_BASE_URL}/carbon-capture/${captureId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating Carbon Capture asset:", error);
      throw error;
    }
  },

  // Delete Carbon Capture asset
  deleteCarbonCapture: async (captureId) => {
    try {
      const response = await apiClient.delete(
        `${API_BASE_URL}/carbon-capture/${captureId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting Carbon Capture asset:", error);
      throw error;
    }
  },
};

export default assetAPI;


