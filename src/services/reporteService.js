/* eslint-disable no-unused-vars */
import api from "../config/api";

export const reporteService = {
  getAll: async () => {
    try {
      const response = await api.get("/reportes");
      return response.data.data;
    } catch (error) {
      console.warn("⚠️ Endpoint /reportes no disponible (Error 400)");
      console.warn(
        "💡 Solución: Verificar que el backend tenga el endpoint GET /api/v1/reportes configurado"
      );
      console.warn(
        "📝 El endpoint debe aceptar peticiones GET sin parámetros y devolver un array de reportes"
      );

      // Devolver array vacío para que la página funcione
      return [];
    }
  },

  getById: async (id) => {
    const response = await api.get(`/reportes/${id}`);
    return response.data.data;
  },

  getByTipo: async (tipoReporte) => {
    const response = await api.get(`/reportes/tipo/${tipoReporte}`);
    return response.data.data;
  },

  getByUsuario: async (usuarioId) => {
    const response = await api.get(`/reportes/usuario/${usuarioId}`);
    return response.data.data;
  },

  create: async (reporteData) => {
    const response = await api.post("/reportes", reporteData);
    return response.data.data;
  },

  // Generar reportes automáticos
  generarReporteConductores: async (periodo, usuarioId) => {
    const response = await api.post(
      `/reportes/generar/conductores?periodo=${periodo}&usuarioId=${usuarioId}`
    );
    return response.data.data;
  },

  generarReporteVehiculos: async (estado, usuarioId) => {
    const response = await api.post(
      `/reportes/generar/vehiculos?estado=${estado}&usuarioId=${usuarioId}`
    );
    return response.data.data;
  },

  generarReporteMovimientos: async (fechaInicio, fechaFin, usuarioId) => {
    const response = await api.post(
      `/reportes/generar/movimientos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&usuarioId=${usuarioId}`
    );
    return response.data.data;
  },

  update: async (id, reporteData) => {
    const response = await api.put(`/reportes/${id}`, reporteData);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/reportes/${id}`);
    return response.data;
  },

  restore: async (id) => {
    const response = await api.put(`/reportes/${id}/restore`);
    return response.data.data;
  },

  getDeleted: async () => {
    try {
      const response = await api.get("/reportes/deleted");
      return response.data.data;
    } catch (error) {
      console.warn("⚠️ Endpoint /reportes/deleted no disponible");
      console.warn("Error:", error.response?.data);
      return [];
    }
  },
};
