import { assetApiClient as apiClient } from "@shared/utils/apiClient";


export const transactionService = {
  getAllTransactions: async (userId) => {
    const response = await apiClient.get(`/transaction/${userId}`);
    return response.data;
  },

  createTransaction: async (transactionData) => {
    const response = await apiClient.post('/transaction', transactionData);
    return response.data;
  },

  deleteTransaction: async (userId, transactionId) => {
    const response = await apiClient.delete(`/transaction/${userId}/${transactionId}`);
    return response.data;
  },
};

export default transactionService;

