import api from "../config/api";

export const rolService = {
  getAll: async () => {
    const response = await api.get("/roles");
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/roles/${id}`);
    return response.data.data;
  },

  create: async (rolData) => {
    const response = await api.post("/roles", rolData);
    return response.data.data;
  },

  update: async (id, rolData) => {
    const response = await api.put(`/roles/${id}`, rolData);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
  },

  restore: async (id) => {
    const response = await api.put(`/roles/${id}/restore`);
    return response.data.data;
  },

  getDeleted: async () => {
    const response = await api.get("/roles/deleted");
    return response.data.data;
  },
};
