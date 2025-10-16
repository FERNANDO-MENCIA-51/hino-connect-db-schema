import api from "../config/api";

// Función para testear conectividad
const testConnection = async () => {
  try {
    console.log("🔍 Testeando conectividad con backend...");
    const response = await api.get("/vehiculos");
    console.log("✅ Backend accesible - Status:", response.status);
    console.log("✅ Datos recibidos:", response.data);
    return true;
  } catch (error) {
    console.log("❌ Backend no accesible");
    console.log("Error:", error.message);
    console.log("Status:", error.response?.status);
    return false;
  }
};

export const vehiculoService = {
  getAll: async () => {
    const response = await api.get("/vehiculos");
    return response.data.data;
  },

  getAllPaginated: async (page = 0, size = 10) => {
    const response = await api.get(
      `/vehiculos/paginated?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/vehiculos/${id}`);
    return response.data.data;
  },

  getByEstado: async (estado) => {
    const response = await api.get(`/vehiculos/estado/${estado}`);
    return response.data.data;
  },

  create: async (vehiculoData) => {
    const response = await api.post("/vehiculos", vehiculoData);
    return response.data.data;
  },

  update: async (id, vehiculoData) => {
    console.log("=== DEBUG SERVICIO UPDATE ===");
    console.log("ID:", id);
    console.log("Datos:", vehiculoData);
    console.log("URL:", `/vehiculos/${id}`);
    console.log("Tipo de datos:", typeof vehiculoData);
    console.log("Es objeto:", typeof vehiculoData === 'object');
    console.log("JSON stringify:", JSON.stringify(vehiculoData));
    
    // Test de conectividad antes del update
    await testConnection();
    
    try {
      const response = await api.put(`/vehiculos/${id}`, vehiculoData);
      console.log("✅ UPDATE EXITOSO");
      console.log("Response:", response);
      return response.data.data;
    } catch (error) {
      console.log("❌ UPDATE FALLÓ");
      console.log("Error completo:", error);
      console.log("Error response:", error.response);
      console.log("Error config:", error.config);
      throw error;
    }
  },

  delete: async (id) => {
    const response = await api.delete(`/vehiculos/${id}`);
    return response.data;
  },

  restore: async (id) => {
    const response = await api.put(`/vehiculos/${id}/restore`);
    return response.data.data;
  },

  getDeleted: async () => {
    const response = await api.get("/vehiculos/deleted");
    return response.data.data;
  },
};
