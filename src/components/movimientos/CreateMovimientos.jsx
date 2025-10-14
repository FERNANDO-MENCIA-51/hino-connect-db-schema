import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { movimientosService } from "../../services/movimientosService";
import { vehiculoService } from "../../services/vehiculoService";
import { conductoresService } from "../../services/conductoresService";

function CreateMovimientos() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    codigo: "",
    vehiculoId: "",
    conductorId: "",
    origen: "",
    destino: "",
    fechaHoraSalida: "",
    fechaHoraLlegadaEstimada: "",
    tipoMovimiento: "",
    cargaPasajeros: "",
    estado: "Pendiente",
    observaciones: ""
  });
  
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar vehículos
      let vehiculosData = [];
      try {
        const response = await vehiculoService.listarVehiculos();
        // Extraer data si viene envuelta
        vehiculosData = response?.data || response;
        console.log("✅ Vehículos cargados:", vehiculosData);
      } catch (err) {
        console.error("❌ Error al cargar vehículos:", err);
      }
      
      // Cargar conductores
      let conductoresData = [];
      try {
        const response = await conductoresService.listarConductores();
        // Extraer data si viene envuelta
        conductoresData = response?.data || response;
        console.log("✅ Conductores cargados:", conductoresData);
      } catch (err) {
        console.error("❌ Error al cargar conductores:", err);
      }
      
      // Cargar movimientos para generar código
      let movimientosData = [];
      try {
        const response = await movimientosService.listar();
        movimientosData = response?.data || response;
        console.log("✅ Movimientos cargados:", movimientosData);
      } catch (err) {
        console.error("❌ Error al cargar movimientos:", err);
      }
      
      setVehiculos(Array.isArray(vehiculosData) ? vehiculosData : []);
      setConductores(Array.isArray(conductoresData) ? conductoresData : []);
      
      // Generar código automático
      const ultimoNumero = Array.isArray(movimientosData) && movimientosData.length > 0 
        ? Math.max(...movimientosData.map(m => {
            const num = parseInt(m.codigo?.split('-')[1] || '0');
            return isNaN(num) ? 0 : num;
          }))
        : 0;
      
      const nuevoCodigo = `MOV-${String(ultimoNumero + 1).padStart(3, '0')}`;
      setForm(prev => ({ ...prev, codigo: nuevoCodigo }));
      
    } catch (error) {
      console.error("❌ Error general al cargar datos:", error);
      alert("Error al cargar los datos necesarios: " + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validar que las fechas estén presentes
      if (!form.fechaHoraSalida) {
        alert("La fecha y hora de salida es obligatoria");
        return;
      }

      // Convertir fechas al formato ISO completo para PostgreSQL
      // Formato: YYYY-MM-DDTHH:mm:ss.sssZ
      const formatearFecha = (fechaLocal) => {
        if (!fechaLocal) return null;
        // Crear fecha en zona horaria local y convertir a ISO
        const fecha = new Date(fechaLocal);
        return fecha.toISOString();
      };

      const payload = {
        codigo: form.codigo,
        vehiculo_id: parseInt(form.vehiculoId),
        conductor_id: parseInt(form.conductorId),
        origen: form.origen,
        destino: form.destino,
        fecha_hora_salida: formatearFecha(form.fechaHoraSalida),
        fecha_hora_llegada_estimada: formatearFecha(form.fechaHoraLlegadaEstimada),
        tipo_movimiento: form.tipoMovimiento,
        carga_pasajeros: form.cargaPasajeros,
        estado: form.estado,
        observaciones: form.observaciones || ""
      };
      
      console.log("📤 Enviando payload:", JSON.stringify(payload, null, 2));
      const resultado = await movimientosService.crear(payload);
      console.log("✅ Resultado:", resultado);
      alert("Movimiento creado exitosamente");
      navigate("/movimientos");
    } catch (error) {
      console.error("❌ Error completo:", error);
      console.error("❌ Datos del formulario:", form);
      alert("Error al crear el movimiento: " + (error.message || error));
    }
  };

  const handleCancel = () => {
    if (window.confirm("¿Desea cancelar? Los datos no guardados se perderán.")) {
      navigate("/movimientos");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 16, textAlign: "center" }}>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 20 }}>Crear Nuevo Movimiento</h2>
      
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
        
        {/* Código - Solo lectura */}
        <div style={{ display: "grid", gap: 4 }}>
          <label style={{ fontWeight: 600 }}>Código</label>
          <input
            type="text"
            name="codigo"
            value={form.codigo}
            readOnly
            style={{ 
              backgroundColor: "#e9ecef", 
              padding: 8,
              border: "1px solid #ced4da",
              borderRadius: 4,
              cursor: "not-allowed"
            }}
          />
        </div>

        {/* Vehículo */}
        <div style={{ display: "grid", gap: 4 }}>
          <label style={{ fontWeight: 600 }}>
            Vehículo <span style={{ color: "red" }}>*</span>
          </label>
          <select
            name="vehiculoId"
            value={form.vehiculoId}
            onChange={handleChange}
            required
            style={{ padding: 8, border: "1px solid #ced4da", borderRadius: 4 }}
          >
            <option value="">Seleccione un vehículo</option>
            {vehiculos.map((vehiculo) => (
              <option key={vehiculo.id} value={vehiculo.id}>
                {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo}
              </option>
            ))}
          </select>
        </div>

        {/* Conductor */}
        <div style={{ display: "grid", gap: 4 }}>
          <label style={{ fontWeight: 600 }}>
            Conductor <span style={{ color: "red" }}>*</span>
          </label>
          <select
            name="conductorId"
            value={form.conductorId}
            onChange={handleChange}
            required
            style={{ padding: 8, border: "1px solid #ced4da", borderRadius: 4 }}
          >
            <option value="">Seleccione un conductor</option>
            {conductores.map((conductor) => (
              <option key={conductor.id} value={conductor.id}>
                {conductor.nombre} {conductor.apellido}
              </option>
            ))}
          </select>
        </div>

        {/* Origen y Destino */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ display: "grid", gap: 4 }}>
            <label style={{ fontWeight: 600 }}>
              Origen <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="origen"
              value={form.origen}
              onChange={handleChange}
              placeholder="Ciudad o lugar de origen"
              required
              style={{ padding: 8, border: "1px solid #ced4da", borderRadius: 4 }}
            />
          </div>

          <div style={{ display: "grid", gap: 4 }}>
            <label style={{ fontWeight: 600 }}>
              Destino <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="destino"
              value={form.destino}
              onChange={handleChange}
              placeholder="Ciudad o lugar de destino"
              required
              style={{ padding: 8, border: "1px solid #ced4da", borderRadius: 4 }}
            />
          </div>
        </div>

        {/* Fecha y Hora de Salida y Llegada Estimada */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ display: "grid", gap: 4 }}>
            <label style={{ fontWeight: 600 }}>
              Fecha y Hora de Salida <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="datetime-local"
              name="fechaHoraSalida"
              value={form.fechaHoraSalida}
              onChange={handleChange}
              required
              style={{ padding: 8, border: "1px solid #ced4da", borderRadius: 4 }}
            />
          </div>

          <div style={{ display: "grid", gap: 4 }}>
            <label style={{ fontWeight: 600 }}>
              Fecha y Hora de Llegada Estimada
            </label>
            <input
              type="datetime-local"
              name="fechaHoraLlegadaEstimada"
              value={form.fechaHoraLlegadaEstimada}
              onChange={handleChange}
              style={{ padding: 8, border: "1px solid #ced4da", borderRadius: 4 }}
            />
          </div>
        </div>

        {/* Tipo de Movimiento */}
        <div style={{ display: "grid", gap: 4 }}>
          <label style={{ fontWeight: 600 }}>
            Tipo de Movimiento <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="tipoMovimiento"
            value={form.tipoMovimiento}
            onChange={handleChange}
            placeholder="Ej: Transporte de carga, Viaje de pasajeros"
            required
            style={{ padding: 8, border: "1px solid #ced4da", borderRadius: 4 }}
          />
        </div>

        {/* Carga o Pasajeros */}
        <div style={{ display: "grid", gap: 4 }}>
          <label style={{ fontWeight: 600 }}>
            Carga o Pasajeros <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="cargaPasajeros"
            value={form.cargaPasajeros}
            onChange={handleChange}
            placeholder="Ej: Carga general 10 toneladas, 25 pasajeros"
            required
            style={{ padding: 8, border: "1px solid #ced4da", borderRadius: 4 }}
          />
        </div>

        {/* Estado Inicial */}
        <div style={{ display: "grid", gap: 4 }}>
          <label style={{ fontWeight: 600 }}>
            Estado <span style={{ color: "red" }}>*</span>
          </label>
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            required
            style={{ padding: 8, border: "1px solid #ced4da", borderRadius: 4 }}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En curso">En curso</option>
            <option value="Completado">Completado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        {/* Observaciones */}
        <div style={{ display: "grid", gap: 4 }}>
          <label style={{ fontWeight: 600 }}>Observaciones</label>
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            placeholder="Detalles adicionales del movimiento..."
            rows="4"
            style={{ 
              padding: 8, 
              border: "1px solid #ced4da", 
              borderRadius: 4,
              resize: "vertical",
              fontFamily: "inherit"
            }}
          />
        </div>

        {/* Botones */}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button 
            type="submit"
            style={{ 
              padding: "10px 24px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            Guardar Movimiento
          </button>
          <button 
            type="button" 
            onClick={handleCancel}
            style={{ 
              padding: "10px 24px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateMovimientos;