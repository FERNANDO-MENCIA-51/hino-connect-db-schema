import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:8081/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug: mostrar detalles de la petición
    console.log("=== DEBUG AXIOS REQUEST ===");
    console.log("URL:", config.baseURL + config.url);
    console.log("Method:", config.method?.toUpperCase());
    console.log("Headers:", config.headers);
    console.log("Data:", config.data);
    console.log("==========================");
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    // Debug: mostrar respuesta exitosa
    console.log("=== DEBUG AXIOS RESPONSE ===");
    console.log("Status:", response.status);
    console.log("URL:", response.config.url);
    console.log("Data:", response.data);
    console.log("============================");
    return response;
  },
  (error) => {
    // Debug: mostrar detalles del error
    console.log("=== DEBUG AXIOS ERROR ===");
    console.log("Status:", error.response?.status);
    console.log("URL:", error.config?.url);
    console.log("Method:", error.config?.method?.toUpperCase());
    console.log("Headers:", error.config?.headers);
    console.log("Request Data:", error.config?.data);
    console.log("Response Data:", error.response?.data);
    console.log("Error Message:", error.message);
    console.log("=========================");
    
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
