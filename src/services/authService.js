import api from "../config/api";

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, nombre, rol, id } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userName", nombre);
      localStorage.setItem("userRole", rol);
      localStorage.setItem("userEmail", email);
      if (id) {
        localStorage.setItem("userId", id);
      }

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error en login";
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  getUserName: () => {
    return localStorage.getItem("userName");
  },

  getUserRole: () => {
    return localStorage.getItem("userRole");
  },

  getUserEmail: () => {
    return localStorage.getItem("userEmail");
  },

  getUserId: () => {
    const userId = localStorage.getItem("userId");
    return userId ? parseInt(userId) : 1; // Fallback a 1 si no existe
  },
};
