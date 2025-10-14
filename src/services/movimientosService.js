import api from "../config/api";

const BASE_URL = "/movimientos";

export const movimientosService = {
  listar: async () => {
    try {
      const res = await api.get(BASE_URL);
      return res.data?.data ?? res.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al obtener movimientos";
    }
  },
  
  obtener: async (id) => {
    try {
      const res = await api.get(`${BASE_URL}/${id}`);
      return res.data?.data ?? res.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al obtener movimiento";
    }
  },
  
  crear: async (payload) => {
    try {
      console.log("🔵 Payload recibido en servicio:", payload);
      
      // El payload ya viene en snake_case desde el componente
      // Solo aseguramos que esté completo
      const body = {
        codigo: payload.codigo,
        vehiculo_id: payload.vehiculo_id,
        conductor_id: payload.conductor_id,
        origen: payload.origen,
        destino: payload.destino,
        fecha_hora_salida: payload.fecha_hora_salida,
        fecha_hora_llegada_estimada: payload.fecha_hora_llegada_estimada,
        tipo_movimiento: payload.tipo_movimiento,
        carga_pasajeros: payload.carga_pasajeros,
        estado: payload.estado,
        observaciones: payload.observaciones || ""
      };
      
      console.log("🟢 Body a enviar:", body);
      
      const res = await api.post(BASE_URL, body);
      console.log("✅ Respuesta del servidor:", res.data);
      return res.data?.data ?? res.data;
    } catch (error) {
      console.error("❌ Error en crear movimiento:", error.response?.data);
      throw error.response?.data?.message || error.response?.data || "Error al crear movimiento";
    }
  },
  
  actualizar: async (id, payload) => {
    try {
      const body = {
        ...payload,
        fecha_hora_salida: payload.fechaHoraSalida ?? payload.fecha_hora_salida ?? null,
        fecha_hora_llegada_estimada: payload.fechaHoraLlegadaEstimada ?? payload.fecha_hora_llegada_estimada ?? null,
      };
      const res = await api.put(`${BASE_URL}/${id}`, body);
      return res.data?.data ?? res.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al actualizar movimiento";
    }
  },
  
  eliminar: async (id) => {
    try {
      const res = await api.delete(`${BASE_URL}/${id}`);
      return res.data?.data ?? res.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al eliminar movimiento";
    }
  },
};

export default movimientosService;