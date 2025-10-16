import api from "../config/api";

export const usuarioService = {
  getAll: async () => {
    const response = await api.get("/usuarios");
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data.data;
  },

  create: async (usuarioData) => {
    const response = await api.post("/usuarios", usuarioData);
    return response.data.data;
  },

  update: async (id, usuarioData) => {
    const response = await api.put(`/usuarios/${id}`, usuarioData);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  restore: async (id) => {
    const response = await api.put(`/usuarios/${id}/restore`);
    return response.data.data;
  },

  getDeleted: async () => {
    const response = await api.get("/usuarios/deleted");
    return response.data.data;
  },
};
