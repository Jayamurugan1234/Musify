import axios from "axios";

const api = axios.create({
  baseURL: "https://musify-backend-67qs.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ❗ Optional debugging + auth handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log("API ERROR:", error.response.status, error.response.data);

      // Optional auto logout on 401
      if (error.response.status === 401) {
        console.warn("Unauthorized - token expired or invalid");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
