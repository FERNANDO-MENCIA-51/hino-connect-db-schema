import api from "../config/api";

export const configuracionService = {
  getAll: async () => {
    const response = await api.get("/configuraciones");
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/configuraciones/${id}`);
    return response.data.data;
  },

  getByClave: async (clave) => {
    const response = await api.get(`/configuraciones/clave/${clave}`);
    return response.data.data;
  },

  getValor: async (clave) => {
    const response = await api.get(`/configuraciones/valor/${clave}`);
    return response.data.data;
  },

  create: async (configData) => {
    const response = await api.post("/configuraciones", configData);
    return response.data.data;
  },

  update: async (id, configData) => {
    const response = await api.put(`/configuraciones/${id}`, configData);
    return response.data.data;
  },

  updateValor: async (clave, valor) => {
    const response = await api.put(`/configuraciones/valor/${clave}`, {
      valor,
    });
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/configuraciones/${id}`);
    return response.data;
  },

  restore: async (id) => {
    const response = await api.put(`/configuraciones/${id}/restore`);
    return response.data.data;
  },

  getDeleted: async () => {
    const response = await api.get("/configuraciones/deleted");
    return response.data.data;
  },

  buscar: async (pattern) => {
    const response = await api.get(`/configuraciones/buscar/${pattern}`);
    return response.data.data;
  },
};
