import api from "../config/api";

export const movimientoService = {
  getAll: async () => {
    const response = await api.get("/movimientos");
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/movimientos/${id}`);
    return response.data.data;
  },

  getByEstado: async (estado) => {
    const response = await api.get(`/movimientos/estado/${estado}`);
    return response.data.data;
  },

  getByVehiculo: async (vehiculoId) => {
    const response = await api.get(`/movimientos/vehiculo/${vehiculoId}`);
    return response.data.data;
  },

  getByConductor: async (conductorId) => {
    const response = await api.get(`/movimientos/conductor/${conductorId}`);
    return response.data.data;
  },

  create: async (movimientoData) => {
    const response = await api.post("/movimientos", movimientoData);
    return response.data.data;
  },

  update: async (id, movimientoData) => {
    const response = await api.put(`/movimientos/${id}`, movimientoData);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/movimientos/${id}`);
    return response.data;
  },
};
