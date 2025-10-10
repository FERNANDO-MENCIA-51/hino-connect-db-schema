import api from "../config/api";

export const authService = {
  login: async (email, password) => {
    try {
      console.log("Enviando petición a:", api.defaults.baseURL + "/auth/login");
      console.log("Datos:", { email, password });

      const response = await api.post("/auth/login", { email, password });

      console.log("Respuesta del servidor:", response.data);

      const { token, nombre, rol } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userName", nombre);
      localStorage.setItem("userRole", rol);

      return response.data;
    } catch (error) {
      console.error("Error detallado:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      // Mostrar error más descriptivo
      let errorMessage = "Error al iniciar sesión";

      if (error.response) {
        // El servidor respondió con un código de error
        if (error.response.status === 400) {
          const backendMessage = error.response.data?.message || "";
          if (backendMessage.includes("R2DBC") || backendMessage.includes("Connection")) {
            errorMessage = "Error de conexión con la base de datos. Por favor, contacta al administrador o reinicia el backend.";
          } else {
            errorMessage = backendMessage || "Credenciales inválidas. Verifica tu email y contraseña.";
          }
        } else if (error.response.status === 401) {
          errorMessage = "Email o contraseña incorrectos";
        } else if (error.response.status === 500) {
          const backendMessage = error.response.data?.message || "";
          if (backendMessage.includes("R2DBC") || backendMessage.includes("Connection")) {
            errorMessage = "El servidor no puede conectarse a la base de datos. Reinicia el backend y verifica que la base de datos esté corriendo.";
          } else {
            errorMessage = "Error en el servidor. Intenta nuevamente más tarde.";
          }
        } else {
          errorMessage = error.response.data?.message || `Error ${error.response.status}`;
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        errorMessage = "No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8080";
      } else {
        errorMessage = error.message;
      }

      throw errorMessage;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};
