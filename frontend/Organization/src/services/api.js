import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// API service for fetching assets
export const assetAPI = {
  // Fetch all EVs for a user
  getEVs: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/evmasterdata/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching EVs:', error);
      throw error;
    }
  },

  // Fetch all Solar Panels for a user
  getSolarPanels: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/solarpanel/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Solar Panels:', error);
      throw error;
    }
  },

  // Fetch all Trees for a user
  getTrees: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tree/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Trees:', error);
      throw error;
    }
  },

  // Fetch all assets for a user (combined)
  getAllAssets: async (userId) => {
    try {
      const [evsResponse, solarResponse, treesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/evmasterdata/${userId}`),
        axios.get(`${API_BASE_URL}/solarpanel/${userId}`),
        axios.get(`${API_BASE_URL}/tree/${userId}`)
      ]);

      // Transform data to match AssetCard format
      const assets = [];

      console.log('EV Response:', evsResponse.data);
      console.log('Solar Response:', solarResponse.data);
      console.log('Tree Response:', treesResponse.data);

      // Transform EVs
      if (evsResponse.data.status === 'success' && evsResponse.data.data) {
        evsResponse.data.data.forEach(ev => {
          assets.push({
            id: ev.vuid || `EV-${ev.ev_id}`,
            name: `${ev.manufacturers} ${ev.model}`,
            type: 'EV',
            location: 'Location not specified', // EV data doesn't have location
            creditsGenerated: Math.floor(Math.random() * 500) + 100, // Mock credits for now
            verified: true,
            lastUpdated: new Date(ev.created_at || Date.now()).toLocaleDateString(),
            status: 'Active',
            efficiency: `${Math.floor(Math.random() * 20) + 80}%`,
            region: 'North America',
            originalData: ev
          });
        });
      }

      // Transform Solar Panels
      if (solarResponse.data.status === 'success' && solarResponse.data.data) {
        solarResponse.data.data.forEach(solar => {
          assets.push({
            id: solar.suid || `SOLAR-${solar.solar_id}`,
            name: 'Solar', // Only show 'Solar' as the name
            type: 'Solar',
            location: 'Location not specified',
            creditsGenerated: Math.floor(Math.random() * 1000) + 200,
            verified: true,
            lastUpdated: new Date(solar.created_at || Date.now()).toLocaleDateString(),
            status: 'Active',
            efficiency: `${Math.floor(Math.random() * 15) + 85}%`,
            region: 'North America',
            originalData: solar
          });
        });
      }

      // Transform Trees
      if (treesResponse.data.status === 'success' && treesResponse.data.data) {
        treesResponse.data.data.forEach(tree => {
          assets.push({
            id: tree.tid || `TREE-${tree.tree_id}`,
            name: tree.treename,
            type: 'Trees',
            location: tree.location || 'Location not specified',
            creditsGenerated: Math.floor(Math.random() * 300) + 50,
            verified: false, // Trees might need verification
            lastUpdated: new Date(tree.plantingdate || Date.now()).toLocaleDateString(),
            status: 'Active',
            region: 'North America',
            originalData: tree
          });
        });
      }

      return assets;
    } catch (error) {
      console.error('Error fetching all assets:', error);
      throw error;
    }
  },

  // Delete EV
  deleteEV: async (evId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/evmasterdata/${evId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting EV:', error);
      throw error;
    }
  },

  // Delete Solar Panel
  deleteSolar: async (solarId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/solarpanel/${solarId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting Solar Panel:', error);
      throw error;
    }
  },

  // Delete Tree
  deleteTree: async (treeId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/tree/${treeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting Tree:', error);
      throw error;
    }
  },

  // Update EV
  updateEV: async (evId, data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/evmasterdata/${evId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating EV:', error);
      throw error;
    }
  },

  // Update Solar Panel
  updateSolar: async (solarId, data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/solarpanel/${solarId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating Solar Panel:', error);
      throw error;
    }
  },

  // Update Tree
  updateTree: async (treeId, data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tree/${treeId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating Tree:', error);
      throw error;
    }
  }
};

export default assetAPI; 