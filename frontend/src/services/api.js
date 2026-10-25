import axios from "axios";

const api = axios.create({
  baseURL: (
    import.meta.env.VITE_API_URL ||
<<<<<<< HEAD
    "https://portfolio-pocn.onrender.com/api"
  ).replace(/\/+$/, ""),
=======
    "https://portfolio-pocn.onrender.com/api",
>>>>>>> 37d72c3985e058f97333d00918b0e512df565520
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Handle API responses and authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event("auth-expired"));
    }

    return Promise.reject(error);
  }
);

export default api;
