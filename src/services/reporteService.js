import api from "../config/api";

export const reporteService = {
  // Listar todos los reportes
  listarReportes: async () => {
    try {
      console.log("🔍 Intentando obtener reportes...");
      const response = await api.get("/reportes");
      console.log("✅ Reportes obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al listar reportes:", error);
      throw error.response?.data?.message || "Error al obtener reportes";
    }
  },

  // Obtener reporte por ID
  obtenerReportePorId: async (id) => {
    try {
      console.log("🔍 Obteniendo reporte con ID:", id);
      const response = await api.get(`/reportes/${id}`);
      console.log("✅ Reporte obtenido:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener reporte:", error);
      throw error.response?.data?.message || "Error al obtener reporte";
    }
  },

  // Filtrar reportes por tipo
  filtrarReportesPorTipo: async (tipoReporte) => {
    try {
      console.log("🔍 Filtrando reportes por tipo:", tipoReporte);
      const response = await api.get(`/reportes/tipo/${encodeURIComponent(tipoReporte)}`);
      console.log("✅ Reportes filtrados por tipo:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al filtrar reportes por tipo:", error);
      throw error.response?.data?.message || "Error al filtrar reportes por tipo";
    }
  },

  // Filtrar reportes por usuario generador
  filtrarReportesPorUsuario: async (usuarioId) => {
    try {
      console.log("🔍 Filtrando reportes por usuario:", usuarioId);
      const response = await api.get(`/reportes/usuario/${usuarioId}`);
      console.log("✅ Reportes filtrados por usuario:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al filtrar reportes por usuario:", error);
      throw error.response?.data?.message || "Error al filtrar reportes por usuario";
    }
  },

  // Crear reporte
  crearReporte: async (reporteData) => {
    try {
      console.log("📝 Creando reporte con datos:", reporteData);
      const response = await api.post("/reportes", reporteData);
      console.log("✅ Reporte creado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al crear reporte:", error);
      throw error.response?.data?.message || "Error al crear reporte";
    }
  },

  // Actualizar reporte
  actualizarReporte: async (id, reporteData) => {
    try {
      console.log("📝 Actualizando reporte con ID:", id, "datos:", reporteData);
      const response = await api.put(`/reportes/${id}`, reporteData);
      console.log("✅ Reporte actualizado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar reporte:", error);
      throw error.response?.data?.message || "Error al actualizar reporte";
    }
  },

  // Eliminar reporte (soft delete)
  eliminarReporte: async (id) => {
    try {
      console.log("🗑️ Eliminando reporte con ID:", id);
      const response = await api.delete(`/reportes/${id}`);
      console.log("✅ Reporte eliminado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al eliminar reporte:", error);
      throw error.response?.data?.message || "Error al eliminar reporte";
    }
  },

  // Restaurar reporte
  restaurarReporte: async (id) => {
    try {
      console.log("🔄 Restaurando reporte con ID:", id);
      const response = await api.put(`/reportes/${id}/restore`);
      console.log("✅ Reporte restaurado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al restaurar reporte:", error);
      throw error.response?.data?.message || "Error al restaurar reporte";
    }
  },

  // Listar reportes eliminados
  listarReportesEliminados: async () => {
    try {
      console.log("🔍 Obteniendo reportes eliminados...");
      const response = await api.get("/reportes/deleted");
      console.log("✅ Reportes eliminados obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al listar reportes eliminados:", error);
      throw error.response?.data?.message || "Error al obtener reportes eliminados";
    }
  }
};

export default reporteService;