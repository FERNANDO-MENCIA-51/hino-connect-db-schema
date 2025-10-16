import api from "../config/api";

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
    const response = await api.put(`/vehiculos/${id}`, vehiculoData);
    return response.data.data;
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
