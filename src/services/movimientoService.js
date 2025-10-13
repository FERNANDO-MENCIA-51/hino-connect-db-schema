import api from "../config/api";

export const movimientoService = {
  // Listar todos los movimientos
  listarMovimientos: async () => {
    try {
      console.log("🔍 Intentando obtener movimientos...");
      const response = await api.get("/movimientos");
      console.log("✅ Movimientos obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al listar movimientos:", error);
      throw error.response?.data?.message || "Error al obtener movimientos";
    }
  },

  // Obtener movimiento por ID
  obtenerMovimientoPorId: async (id) => {
    try {
      console.log("🔍 Obteniendo movimiento con ID:", id);
      const response = await api.get(`/movimientos/${id}`);
      console.log("✅ Movimiento obtenido:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener movimiento:", error);
      throw error.response?.data?.message || "Error al obtener movimiento";
    }
  },

  // Buscar movimientos por estado
  buscarMovimientosPorEstado: async (estado) => {
    try {
      console.log("🔍 Buscando movimientos por estado:", estado);
      const response = await api.get(`/movimientos/estado/${encodeURIComponent(estado)}`);
      console.log("✅ Movimientos encontrados por estado:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al buscar movimientos por estado:", error);
      throw error.response?.data?.message || "Error al buscar movimientos por estado";
    }
  },

  // Buscar movimientos por vehículo
  buscarMovimientosPorVehiculo: async (vehiculoId) => {
    try {
      console.log("🔍 Buscando movimientos por vehículo:", vehiculoId);
      const response = await api.get(`/movimientos/vehiculo/${vehiculoId}`);
      console.log("✅ Movimientos encontrados por vehículo:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al buscar movimientos por vehículo:", error);
      throw error.response?.data?.message || "Error al buscar movimientos por vehículo";
    }
  },

  // Buscar movimientos por conductor
  buscarMovimientosPorConductor: async (conductorId) => {
    try {
      console.log("🔍 Buscando movimientos por conductor:", conductorId);
      const response = await api.get(`/movimientos/conductor/${conductorId}`);
      console.log("✅ Movimientos encontrados por conductor:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al buscar movimientos por conductor:", error);
      throw error.response?.data?.message || "Error al buscar movimientos por conductor";
    }
  },

  // Crear movimiento
  crearMovimiento: async (movimientoData) => {
    try {
      console.log("📝 Creando movimiento con datos:", movimientoData);
      const response = await api.post("/movimientos", movimientoData);
      console.log("✅ Movimiento creado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al crear movimiento:", error);
      throw error.response?.data?.message || "Error al crear movimiento";
    }
  },

  // Actualizar movimiento
  actualizarMovimiento: async (id, movimientoData) => {
    try {
      console.log("📝 Actualizando movimiento con ID:", id, "datos:", movimientoData);
      const response = await api.put(`/movimientos/${id}`, movimientoData);
      console.log("✅ Movimiento actualizado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar movimiento:", error);
      throw error.response?.data?.message || "Error al actualizar movimiento";
    }
  },

  // Eliminar movimiento (soft delete)
  eliminarMovimiento: async (id) => {
    try {
      console.log("🗑️ Eliminando movimiento con ID:", id);
      const response = await api.delete(`/movimientos/${id}`);
      console.log("✅ Movimiento eliminado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al eliminar movimiento:", error);
      throw error.response?.data?.message || "Error al eliminar movimiento";
    }
  },

  // Restaurar movimiento
  restaurarMovimiento: async (id) => {
    try {
      console.log("🔄 Restaurando movimiento con ID:", id);
      const response = await api.put(`/movimientos/${id}/restore`);
      console.log("✅ Movimiento restaurado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al restaurar movimiento:", error);
      throw error.response?.data?.message || "Error al restaurar movimiento";
    }
  },

  // Listar movimientos eliminados
  listarMovimientosEliminados: async () => {
    try {
      console.log("🔍 Obteniendo movimientos eliminados...");
      const response = await api.get("/movimientos/deleted");
      console.log("✅ Movimientos eliminados obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al listar movimientos eliminados:", error);
      throw error.response?.data?.message || "Error al obtener movimientos eliminados";
    }
  }
};

export default movimientoService;