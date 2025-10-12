import api from "../config/api";

const BASE_URL = "/conductores";

export const conductorService = {
    listarConductores: async () => {
        try {
            const response = await api.get(BASE_URL);
            return response.data;
        } catch (error) {
            console.error("Error al listar conductores:", error);
            throw error.response?.data?.message || "Error al obtener conductores";
        }
    },

    obtenerConductor: async (id) => {
        try {
            const response = await api.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener conductor ${id}:`, error);
            throw error.response?.data?.message || "Error al obtener conductor";
        }
    },

    crearConductor: async (conductorData) => {
        try {
            const response = await api.post(BASE_URL, conductorData);
            return response.data;
        } catch (error) {
            console.error("Error al crear conductor:", error);
            throw error.response?.data?.message || "Error al crear conductor";
        }
    },

    actualizarConductor: async (id, conductorData) => {
        try {
            const payload = {
                codigo: conductorData.codigo,
                nombre: conductorData.nombre,
                apellido: conductorData.apellido,
                dni: conductorData.dni,
                telefono: conductorData.telefono,
                licencia: conductorData.licencia,
                vehiculoAsignado: conductorData.vehiculoAsignado,
                estado: conductorData.estado ?? "Activo",
                activo: conductorData.activo ?? true,
                fechaIngreso: conductorData.fechaIngreso,
                createdAt: conductorData.createdAt,
                updatedAt: new Date().toISOString(),
                deletedAt: conductorData.deletedAt ?? null
            };
            const response = await api.put(`${BASE_URL}/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar conductor ${id}:`, error);
            throw error.response?.data?.message || "Error al actualizar conductor";
        }
    },

    desactivarConductor: async (conductor) => {
        try {
            const payload = {
                ...conductor,
                estado: "Inactivo",
                activo: false,
                updatedAt: new Date().toISOString()
            };
            const response = await api.put(`${BASE_URL}/${conductor.id}`, payload);
            return response.data;
        } catch (error) {
            console.error(`Error al desactivar conductor ${conductor.id}:`, error);
            throw error.response?.data?.message || "Error al desactivar conductor";
        }
    },


    restaurarConductor: async (conductor) => {
        try {
            const response = await api.put(`${BASE_URL}/restaurar/${conductor.id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al restaurar conductor ${conductor.id}:`, error);
            throw error.response?.data?.message || "Error al restaurar conductor";
        }
    },


    listarConductoresPorEstado: async (estado) => {
        try {
            const response = await api.get(`${BASE_URL}/estado/${estado}`);
            return response.data;
        } catch (error) {
            console.error(`Error al listar conductores por estado ${estado}:`, error);
            throw error.response?.data?.message || "Error al obtener conductores por estado";
        }
    },
};