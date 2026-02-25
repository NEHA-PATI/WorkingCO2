import { assetApiClient as apiClient } from "@shared/utils/apiClient";

export const treeService = {
  getAllTrees: async (userId) => {
    const response = await apiClient.get(`/tree/${userId}`);
    return response.data;
  },

  getTree: async (treeId) => {
    const response = await apiClient.get(`/tree/single/${treeId}`);
    return response.data;
  },

  createTree: async (treeData) => {
    const response = await apiClient.post('/tree', treeData);
    return response.data;
  },

  updateTree: async (treeId, treeData) => {
    const response = await apiClient.put(`/tree/${treeId}`, treeData);
    return response.data;
  },

  deleteTree: async (treeId, userId) => {
    const response = await apiClient.delete(`/tree/${treeId}`, {
      data: { UID: userId },
    });
    return response.data;
  },

  uploadTreeImage: async (userId, treeId, imageFile) => {
    const formData = new FormData();
    formData.append("images", imageFile);

    const uploadResponse = await apiClient.post("/image/upload", formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const firstImage = uploadResponse?.data?.data?.images?.[0];
    if (!firstImage?.url) {
      throw new Error("Image upload succeeded but image URL was not returned");
    }

    const linkResponse = await apiClient.post(`/tree/${treeId}/image`, {
      UID: userId,
      image_url: firstImage.url,
      cloudinary_public_id: firstImage.public_id || null,
    });

    return {
      upload: uploadResponse.data,
      treeImage: linkResponse.data,
    };
  },
};

export default treeService;

