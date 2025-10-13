import api from "../config/api";

export const rolService = {
  // Listar todos los roles
  listarRoles: async () => {
    try {
      const response = await api.get("/roles");
      return response.data;
    } catch (error) {
      console.error("Error al listar roles:", error);
      throw error.response?.data?.message || "Error al obtener roles";
    }
  },

  // Crear rol
  crearRol: async (rolData) => {
    try {
      const response = await api.post("/roles", rolData);
      return response.data;
    } catch (error) {
      console.error("Error al crear rol:", error);
      throw error.response?.data?.message || "Error al crear rol";
    }
  },

  // Actualizar rol
  actualizarRol: async (id, rolData) => {
    try {
      const response = await api.put(`/roles/${id}`, rolData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      throw error.response?.data?.message || "Error al actualizar rol";
    }
  },

  // Eliminar rol
  eliminarRol: async (id) => {
    try {
      const response = await api.delete(`/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar rol:", error);
      throw error.response?.data?.message || "Error al eliminar rol";
    }
  },
};
