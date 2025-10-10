import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1";

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

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo cerrar sesión si es un error de token inválido o expirado
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || "";
      
      // Solo cerrar sesión si el mensaje indica token inválido/expirado
      if (
        errorMessage.includes("token") || 
        errorMessage.includes("Token") ||
        errorMessage.includes("JWT") ||
        errorMessage.includes("expired") ||
        errorMessage.includes("invalid") ||
        !localStorage.getItem("token")
      ) {
        console.log("🔒 Token inválido o expirado. Cerrando sesión...");
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
