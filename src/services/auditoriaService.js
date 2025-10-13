import api from "../config/api";

export const auditoriaService = {
  // Listar todos los logs de auditoría
  listarLogs: async () => {
    try {
      console.log("🔍 Intentando obtener logs de auditoría...");
      const response = await api.get("/logs-auditoria");
      console.log("✅ Logs de auditoría obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al listar logs de auditoría:", error);
      throw error.response?.data?.message || "Error al obtener logs de auditoría";
    }
  },

  // Obtener log por ID
  obtenerLogPorId: async (id) => {
    try {
      console.log("🔍 Obteniendo log con ID:", id);
      const response = await api.get(`/logs-auditoria/${id}`);
      console.log("✅ Log obtenido:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener log:", error);
      throw error.response?.data?.message || "Error al obtener log";
    }
  },

  // Filtrar logs por tabla
  filtrarLogsPorTabla: async (tabla) => {
    try {
      console.log("🔍 Filtrando logs por tabla:", tabla);
      const response = await api.get(`/logs-auditoria/tabla/${encodeURIComponent(tabla)}`);
      console.log("✅ Logs filtrados por tabla:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al filtrar logs por tabla:", error);
      throw error.response?.data?.message || "Error al filtrar logs por tabla";
    }
  },

  // Filtrar logs por operación
  filtrarLogsPorOperacion: async (operacion) => {
    try {
      console.log("🔍 Filtrando logs por operación:", operacion);
      const response = await api.get(`/logs-auditoria/operacion/${encodeURIComponent(operacion)}`);
      console.log("✅ Logs filtrados por operación:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al filtrar logs por operación:", error);
      throw error.response?.data?.message || "Error al filtrar logs por operación";
    }
  },

  // Filtrar logs por usuario
  filtrarLogsPorUsuario: async (usuarioId) => {
    try {
      console.log("🔍 Filtrando logs por usuario:", usuarioId);
      const response = await api.get(`/logs-auditoria/usuario/${usuarioId}`);
      console.log("✅ Logs filtrados por usuario:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al filtrar logs por usuario:", error);
      throw error.response?.data?.message || "Error al filtrar logs por usuario";
    }
  },

  // Obtener historial de un registro específico
  obtenerHistorialRegistro: async (registroId, tabla) => {
    try {
      console.log("🔍 Obteniendo historial del registro:", registroId, "en tabla:", tabla);
      const response = await api.get(`/logs-auditoria/registro/${registroId}/tabla/${encodeURIComponent(tabla)}`);
      console.log("✅ Historial del registro obtenido:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener historial del registro:", error);
      throw error.response?.data?.message || "Error al obtener historial del registro";
    }
  },

  // Filtrar logs por rango de fechas
  filtrarLogsPorFecha: async (fechaInicio, fechaFin) => {
    try {
      console.log("🔍 Filtrando logs por fecha:", fechaInicio, "a", fechaFin);
      const params = new URLSearchParams({
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      });
      const response = await api.get(`/logs-auditoria/fecha?${params}`);
      console.log("✅ Logs filtrados por fecha:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al filtrar logs por fecha:", error);
      throw error.response?.data?.message || "Error al filtrar logs por fecha";
    }
  },

  // Obtener logs recientes
  obtenerLogsRecientes: async (limit = 50) => {
    try {
      console.log("🔍 Obteniendo logs recientes, límite:", limit);
      const response = await api.get(`/logs-auditoria/recientes?limit=${limit}`);
      console.log("✅ Logs recientes obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener logs recientes:", error);
      throw error.response?.data?.message || "Error al obtener logs recientes";
    }
  },

  // Obtener estadísticas por tabla
  obtenerEstadisticasPorTabla: async (tabla) => {
    try {
      console.log("🔍 Obteniendo estadísticas por tabla:", tabla);
      const response = await api.get(`/logs-auditoria/estadisticas/tabla/${encodeURIComponent(tabla)}`);
      console.log("✅ Estadísticas por tabla obtenidas:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener estadísticas por tabla:", error);
      throw error.response?.data?.message || "Error al obtener estadísticas por tabla";
    }
  },

  // Obtener estadísticas por operación
  obtenerEstadisticasPorOperacion: async (operacion) => {
    try {
      console.log("🔍 Obteniendo estadísticas por operación:", operacion);
      const response = await api.get(`/logs-auditoria/estadisticas/operacion/${encodeURIComponent(operacion)}`);
      console.log("✅ Estadísticas por operación obtenidas:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener estadísticas por operación:", error);
      throw error.response?.data?.message || "Error al obtener estadísticas por operación";
    }
  }
};

export default auditoriaService;