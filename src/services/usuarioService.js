import api from "../config/api";

export const usuarioService = {
  // Listar todos los usuarios
  listarUsuarios: async () => {
    try {
      console.log("🔍 Intentando obtener usuarios...");
      console.log("📍 URL:", api.defaults.baseURL + "/usuarios");
      console.log("🔑 Token:", localStorage.getItem("token") ? "✅ Presente" : "❌ No encontrado");
      
      const response = await api.get("/usuarios");
      console.log("✅ Usuarios obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al listar usuarios:", error);
      console.error("📊 Detalles del error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw error.response?.data?.message || "Error al obtener usuarios";
    }
  },

  // Crear usuario
  crearUsuario: async (userData) => {
    try {
      console.log("📝 Creando usuario con datos:", userData);
      const response = await api.post("/usuarios", userData);
      console.log("✅ Usuario creado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al crear usuario:", error);
      console.error("📊 Status:", error.response?.status);
      console.error("📊 Mensaje:", error.response?.data?.message);
      console.error("📊 Data completa:", error.response?.data);
      throw error.response?.data?.message || "Error al crear usuario";
    }
  },

  // Actualizar usuario
  actualizarUsuario: async (id, userData) => {
    try {
      const response = await api.put(`/usuarios/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error.response?.data?.message || "Error al actualizar usuario";
    }
  },

  // Eliminar usuario (soft delete)
  eliminarUsuario: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error.response?.data?.message || "Error al eliminar usuario";
    }
  },

  // Restaurar usuario
  restaurarUsuario: async (id) => {
    try {
      const response = await api.patch(`/usuarios/${id}/restaurar`);
      return response.data;
    } catch (error) {
      console.error("Error al restaurar usuario:", error);
      throw error.response?.data?.message || "Error al restaurar usuario";
    }
  },
};
