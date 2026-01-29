import { blogApiClient } from "../apiClient";

export const blogService = {
  getPosts: async (page = 1, limit = 10) => {
    const res = await blogApiClient.get("/posts", {
      params: { page, limit },
    });
    return res.data;
  },

  getPostBySlug: async (slug) => {
    const res = await blogApiClient.get(`/posts/${slug}`);
    return res.data;
  },

  getRelatedPosts: async (id, limit = 3) => {
    const res = await blogApiClient.get(`/posts/${id}/related`, {
      params: { limit },
    });
    return res.data;
  },

  getCategories: async () => {
    const res = await blogApiClient.get("/categories");
    return res.data;
  },

  getPostsByCategory: async (slug, page = 1, limit = 10) => {
    const res = await blogApiClient.get(`/categories/${slug}/posts`, {
      params: { page, limit },
    });
    return res.data;
  },

  getTags: async () => {
    const res = await blogApiClient.get("/tags");
    return res.data;
  },

  getPostsByTag: async (slug, page = 1, limit = 10) => {
    const res = await blogApiClient.get(`/tags/${slug}/posts`, {
      params: { page, limit },
    });
    return res.data;
  },

  searchPosts: async (query, page = 1, limit = 10) => {
    const res = await blogApiClient.get("/search", {
      params: { q: query, page, limit },
    });
    return res.data;
  },

  getAuthorProfile: async (slug) => {
    const res = await blogApiClient.get(`/authors/${slug}`);
    return res.data;
  },
};

export default blogService;
