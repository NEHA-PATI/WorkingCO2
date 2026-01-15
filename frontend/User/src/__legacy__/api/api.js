

import axios from 'axios';

const api = axios.create({
   baseURL: 'https://content-service-ykdt.onrender.com/api/blogs',
  // baseURL: 'http://localhost:5009/api/blogs',
  // ⚠️ Do not manually set Content-Type here.
  // Axios will set it automatically (JSON or multipart/form-data).
});

export default api;