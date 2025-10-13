import api from "../config/api";

export const configuracionService = {
  // Listar todas las configuraciones
  listarConfiguraciones: async () => {
    try {
      console.log("🔍 Intentando obtener configuraciones...");
      const response = await api.get("/configuraciones");
      console.log("✅ Configuraciones obtenidas:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al listar configuraciones:", error);
      throw error.response?.data?.message || "Error al obtener configuraciones";
    }
  },

  // Obtener configuración por ID
  obtenerConfiguracionPorId: async (id) => {
    try {
      console.log("🔍 Obteniendo configuración con ID:", id);
      const response = await api.get(`/configuraciones/${id}`);
      console.log("✅ Configuración obtenida:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener configuración:", error);
      throw error.response?.data?.message || "Error al obtener configuración";
    }
  },

  // Obtener configuración por clave
  obtenerConfiguracionPorClave: async (clave) => {
    try {
      console.log("🔍 Obteniendo configuración por clave:", clave);
      const response = await api.get(`/configuraciones/clave/${encodeURIComponent(clave)}`);
      console.log("✅ Configuración obtenida por clave:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener configuración por clave:", error);
      throw error.response?.data?.message || "Error al obtener configuración por clave";
    }
  },

  // Obtener solo el valor de una configuración
  obtenerValorConfiguracion: async (clave) => {
    try {
      console.log("🔍 Obteniendo valor de configuración:", clave);
      const response = await api.get(`/configuraciones/valor/${encodeURIComponent(clave)}`);
      console.log("✅ Valor de configuración obtenido:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener valor de configuración:", error);
      throw error.response?.data?.message || "Error al obtener valor de configuración";
    }
  },

  // Buscar configuraciones por patrón
  buscarConfiguraciones: async (patron) => {
    try {
      console.log("🔍 Buscando configuraciones por patrón:", patron);
      const response = await api.get(`/configuraciones/buscar/${encodeURIComponent(patron)}`);
      console.log("✅ Configuraciones encontradas:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al buscar configuraciones:", error);
      throw error.response?.data?.message || "Error al buscar configuraciones";
    }
  },

  // Crear configuración
  crearConfiguracion: async (configuracionData) => {
    try {
      console.log("📝 Creando configuración con datos:", configuracionData);
      const response = await api.post("/configuraciones", configuracionData);
      console.log("✅ Configuración creada exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al crear configuración:", error);
      throw error.response?.data?.message || "Error al crear configuración";
    }
  },

  // Actualizar configuración completa
  actualizarConfiguracion: async (id, configuracionData) => {
    try {
      console.log("📝 Actualizando configuración con ID:", id, "datos:", configuracionData);
      const response = await api.put(`/configuraciones/${id}`, configuracionData);
      console.log("✅ Configuración actualizada exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar configuración:", error);
      throw error.response?.data?.message || "Error al actualizar configuración";
    }
  },

  // Actualizar solo el valor de una configuración
  actualizarValorConfiguracion: async (clave, nuevoValor) => {
    try {
      console.log("📝 Actualizando valor de configuración:", clave, "nuevo valor:", nuevoValor);
      const response = await api.put(`/configuraciones/valor/${encodeURIComponent(clave)}`, {
        valor: nuevoValor
      });
      console.log("✅ Valor de configuración actualizado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar valor de configuración:", error);
      throw error.response?.data?.message || "Error al actualizar valor de configuración";
    }
  },

  // Eliminar configuración (soft delete)
  eliminarConfiguracion: async (id) => {
    try {
      console.log("🗑️ Eliminando configuración con ID:", id);
      const response = await api.delete(`/configuraciones/${id}`);
      console.log("✅ Configuración eliminada exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al eliminar configuración:", error);
      throw error.response?.data?.message || "Error al eliminar configuración";
    }
  },

  // Restaurar configuración
  restaurarConfiguracion: async (id) => {
    try {
      console.log("🔄 Restaurando configuración con ID:", id);
      const response = await api.put(`/configuraciones/${id}/restore`);
      console.log("✅ Configuración restaurada exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al restaurar configuración:", error);
      throw error.response?.data?.message || "Error al restaurar configuración";
    }
  },

  // Listar configuraciones eliminadas
  listarConfiguracionesEliminadas: async () => {
    try {
      console.log("🔍 Obteniendo configuraciones eliminadas...");
      const response = await api.get("/configuraciones/deleted");
      console.log("✅ Configuraciones eliminadas obtenidas:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al listar configuraciones eliminadas:", error);
      throw error.response?.data?.message || "Error al obtener configuraciones eliminadas";
    }
  }
};

export default configuracionService;