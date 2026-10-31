import axios from "axios";

// Dynamically determine the best API base URL:
// 1. If running locally on localhost or 127.0.0.1, prioritize local server http://localhost:5000/api
// 2. Otherwise use VITE_API_URL or production Render fallback
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (isLocalhost) {
      return (
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api"
      ).replace(/\/+$/, "");
    }
  }

  return (
    import.meta.env.VITE_API_URL ||
    "https://portfolio-pocn.onrender.com/api"
  ).replace(/\/+$/, "");
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization Bearer token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle API responses and authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      window.dispatchEvent(new Event("auth-expired"));
    }

    return Promise.reject(error);
  }
);

export default api;
