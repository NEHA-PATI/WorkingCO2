import { assetApiClient as apiClient } from "@shared/utils/apiClient";


const evService = {
  // ==============================
  // Get all EVs for a user
  // GET /api/v1/evmasterdata/:userId
  // ==============================
  getAllEVs: async (userId) => {
    try {
      const res = await apiClient.get(`/evmasterdata/${userId}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || {
        status: "error",
        message: "Failed to fetch EVs",
      };
    }
  },

  // ==============================
  // Get single EV
  // GET /api/v1/evmasterdata/single/:ev_id
  // ==============================
  getEV: async (evId) => {
    try {
      const res = await apiClient.get(`/evmasterdata/single/${evId}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || {
        status: "error",
        message: "Failed to fetch EV",
      };
    }
  },

  // ==============================
  // Create EV
  // POST /api/v1/evmasterdata
  // ==============================
  createEV: async (evData) => {
    try {
      const res = await apiClient.post("/evmasterdata", evData);
      return res.data;
    } catch (error) {
      throw error.response?.data || {
        status: "error",
        message: "Failed to create EV",
      };
    }
  },

  // ==============================
  // Update EV
  // PUT /api/v1/evmasterdata/:ev_id
  // ==============================
  updateEV: async (evId, evData) => {
    try {
      const res = await apiClient.put(`/evmasterdata/${evId}`, evData);
      return res.data;
    } catch (error) {
      throw error.response?.data || {
        status: "error",
        message: "Failed to update EV",
      };
    }
  },

  // ==============================
  // Delete EV
  // DELETE /api/v1/evmasterdata/:ev_id
  // ==============================
  deleteEV: async (evId) => {
    try {
      const res = await apiClient.delete(`/evmasterdata/${evId}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || {
        status: "error",
        message: "Failed to delete EV",
      };
    }
  },

  // ==============================
  // Update EV Status (Admin)
  // PATCH /api/v1/evmasterdata/:ev_id/status
  // ==============================
  updateEVStatus: async (evId, status) => {
    try {
      const res = await apiClient.patch(
        `/evmasterdata/${evId}/status`,
        { status }
      );
      return res.data;
    } catch (error) {
      throw error.response?.data || {
        status: "error",
        message: "Failed to update EV status",
      };
    }
  },
};

export default evService;

