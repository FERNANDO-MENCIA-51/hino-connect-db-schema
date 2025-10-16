import api from "../config/api";

export const conductorService = {
  getAll: async () => {
    const response = await api.get("/conductores");
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/conductores/${id}`);
    return response.data.data;
  },

  getByEstado: async (estado) => {
    const response = await api.get(`/conductores/estado/${estado}`);
    return response.data.data;
  },

  create: async (conductorData) => {
    const response = await api.post("/conductores", conductorData);
    return response.data.data;
  },

  update: async (id, conductorData) => {
    const response = await api.put(`/conductores/${id}`, conductorData);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/conductores/${id}`);
    return response.data;
  },

  restore: async (id) => {
    const response = await api.put(`/conductores/restaurar/${id}`);
    return response.data.data;
  },
};
