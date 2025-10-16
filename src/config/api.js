import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:8081/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      window.location.href = "/login";

      Swal.fire({
        icon: "error",
        title: "Sesión Expirada",
        text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
        confirmButtonColor: "#2563eb",
      });
    }
    return Promise.reject(error);
  }
);

export default api;
