import api from "../config/api";

export const vehiculoService = {
  // Listar todos los vehículos
  listarVehiculos: async () => {
    try {
      console.log("🔍 Intentando obtener vehículos...");
      const response = await api.get("/vehiculos");
      console.log("✅ Vehículos obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al listar vehículos:", error);
      throw error.response?.data?.message || "Error al obtener vehículos";
    }
  },

  // Obtener vehículo por ID
  obtenerVehiculoPorId: async (id) => {
    try {
      console.log("🔍 Obteniendo vehículo con ID:", id);
      const response = await api.get(`/vehiculos/${id}`);
      console.log("✅ Vehículo obtenido:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener vehículo:", error);
      throw error.response?.data?.message || "Error al obtener vehículo";
    }
  },

  // Crear vehículo
  crearVehiculo: async (vehiculoData) => {
    try {
      console.log("📝 Creando vehículo con datos:", vehiculoData);
      const response = await api.post("/vehiculos", vehiculoData);
      console.log("✅ Vehículo creado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al crear vehículo:", error);
      throw error.response?.data?.message || "Error al crear vehículo";
    }
  },

  // Actualizar vehículo
  actualizarVehiculo: async (id, vehiculoData) => {
    try {
      console.log("📝 Actualizando vehículo con ID:", id, "datos:", vehiculoData);
      console.log("📝 Datos completos a enviar:", JSON.stringify(vehiculoData, null, 2));
      const response = await api.put(`/vehiculos/${id}`, vehiculoData);
      console.log("✅ Vehículo actualizado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar vehículo:", error);
      console.error("❌ Error completo:", error.response);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Error data:", error.response?.data);
      console.error("❌ Error message:", error.response?.data?.message);
      console.error("❌ Error details:", error.response?.data?.details);
      throw error.response?.data?.message || "Error al actualizar vehículo";
    }
  },

  // Eliminar vehículo (soft delete)
  eliminarVehiculo: async (id) => {
    try {
      console.log("🗑️ Eliminando vehículo con ID:", id);
      const response = await api.delete(`/vehiculos/${id}`);
      console.log("✅ Vehículo eliminado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al eliminar vehículo:", error);
      throw error.response?.data?.message || "Error al eliminar vehículo";
    }
  },

  // Buscar vehículos por estado (corregido)
  buscarVehiculosPorEstado: async (estado) => {
    try {
      console.log("🔍 Buscando vehículos por estado:", estado);

      // Si no hay estado o es "todos", cargar todos los vehículos
      if (!estado || estado === "todos") {
        console.log("➡️ No se especificó estado, cargando todos los vehículos...");
        return await vehiculoService.listarVehiculos();
      }

      const response = await api.get(`/vehiculos/estado/${encodeURIComponent(estado)}`);
      console.log("✅ Vehículos encontrados por estado:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al buscar vehículos por estado:", error);
      console.error("📊 Status:", error.response?.status);
      console.error("📊 Mensaje:", error.response?.data?.message);
      throw error.response?.data?.message || "Error al buscar vehículos por estado";
    }
  },

  // Listar vehículos inactivos (soft delete)
  listarVehiculosInactivos: async () => {
    try {
      console.log("🔍 Obteniendo vehículos inactivos...");
      const response = await api.get("/vehiculos/inactivos");
      console.log("✅ Vehículos inactivos obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al listar vehículos inactivos:", error);
      throw error.response?.data?.message || "Error al obtener vehículos inactivos";
    }
  },

  // Restaurar vehículo (soft delete)
  restaurarVehiculo: async (id) => {
    try {
      console.log("🔄 Restaurando vehículo con ID:", id);
      const response = await api.put(`/vehiculos/restaurar/${id}`);
      console.log("✅ Vehículo restaurado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al restaurar vehículo:", error);
      throw error.response?.data?.message || "Error al restaurar vehículo";
    }
  },
};

export default vehiculoService;
