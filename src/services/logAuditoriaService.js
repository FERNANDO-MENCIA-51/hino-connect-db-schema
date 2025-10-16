import api from "../config/api";

export const logAuditoriaService = {
  getAll: async () => {
    const response = await api.get("/logs-auditoria");
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/logs-auditoria/${id}`);
    return response.data.data;
  },

  getByTabla: async (tabla) => {
    const response = await api.get(`/logs-auditoria/tabla/${tabla}`);
    return response.data.data;
  },

  getByOperacion: async (operacion) => {
    const response = await api.get(`/logs-auditoria/operacion/${operacion}`);
    return response.data.data;
  },

  getByUsuario: async (usuarioId) => {
    const response = await api.get(`/logs-auditoria/usuario/${usuarioId}`);
    return response.data.data;
  },

  getByRegistro: async (registroId, tabla) => {
    const response = await api.get(
      `/logs-auditoria/registro/${registroId}/tabla/${tabla}`
    );
    return response.data.data;
  },

  getByFecha: async (fechaInicio, fechaFin) => {
    const params = new URLSearchParams({
      fechaInicio,
      fechaFin,
    });
    const response = await api.get(`/logs-auditoria/fecha?${params}`);
    return response.data.data;
  },

  getRecientes: async (limit = 50) => {
    const response = await api.get(`/logs-auditoria/recientes?limit=${limit}`);
    return response.data.data;
  },

  getEstadisticasTabla: async (tabla) => {
    const response = await api.get(
      `/logs-auditoria/estadisticas/tabla/${tabla}`
    );
    return response.data.data;
  },

  getEstadisticasOperacion: async (operacion) => {
    const response = await api.get(
      `/logs-auditoria/estadisticas/operacion/${operacion}`
    );
    return response.data.data;
  },
};
