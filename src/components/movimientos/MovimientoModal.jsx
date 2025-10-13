import { useState, useEffect } from "react";
// import { movimientoService } from "../../services/movimientoService";
import { vehiculoService } from "../../services/vehiculoService";
import { conductoresService } from "../../services/conductoresService";
import { showSuccessAlert, showErrorAlert } from "../../utils/sweetAlertConfig";
import { FiX, FiTruck, FiMapPin, FiClock, FiPackage } from "react-icons/fi";

const MovimientoModal = ({ movimiento, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    codigo: "",
    vehiculoId: "",
    conductorId: "",
    origen: "",
    destino: "",
    distanciaKm: "",
    fechaHoraSalida: "",
    fechaHoraLlegadaEstimada: "",
    tipoMovimiento: "Transporte de carga",
    cargaPasajeros: "",
    pesoEstimado: "",
    observaciones: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Opciones para los select
  const tiposMovimiento = [
    "Transporte de carga",
    "Transporte de pasajeros", 
    "Servicio especial",
    "Mantenimiento",
    "Traslado interno"
  ];

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    if (movimiento) {
      setFormData({
        codigo: movimiento.codigo || generarCodigoMovimiento(),
        vehiculoId: movimiento.vehiculoId?.toString() || "",
        conductorId: movimiento.conductorId?.toString() || "",
        origen: movimiento.origen || "",
        destino: movimiento.destino || "",
        distanciaKm: movimiento.distanciaKm?.toString() || "",
        fechaHoraSalida: movimiento.fechaHoraSalida ? 
          new Date(movimiento.fechaHoraSalida).toISOString().slice(0, 16) : "",
        fechaHoraLlegadaEstimada: movimiento.fechaHoraLlegadaEstimada ? 
          new Date(movimiento.fechaHoraLlegadaEstimada).toISOString().slice(0, 16) : "",
        tipoMovimiento: movimiento.tipoMovimiento || "Transporte de carga",
        cargaPasajeros: movimiento.cargaPasajeros || "",
        pesoEstimado: movimiento.pesoEstimado?.toString() || "",
        observaciones: movimiento.observaciones || "",
      });
    } else {
      setFormData(prev => ({
        ...prev,
        codigo: generarCodigoMovimiento()
      }));
    }
  }, [movimiento, vehiculos, conductores]);

  const cargarDatosIniciales = async () => {
    try {
      setLoadingData(true);
      const [vehiculosData, conductoresData] = await Promise.all([
        vehiculoService.listarVehiculos(),
        conductoresService.listarConductores()
      ]);
      
      // Filtrar solo vehículos y conductores activos
      setVehiculos(vehiculosData.data?.filter(v => v.activo && !v.deletedAt) || []);
      setConductores(conductoresData.data?.filter(c => c.activo && !c.deletedAt) || []);
    } catch (error) {
      showErrorAlert("Error", "No se pudieron cargar los datos iniciales.");
    } finally {
      setLoadingData(false);
    }
  };

  const generarCodigoMovimiento = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `MOV-${timestamp}`;
  };

  const calcularTiempoEstimado = (distancia) => {
    if (!distancia || distancia <= 0) return "";
    
    // Velocidad promedio estimada: 60 km/h
    const velocidadPromedio = 60;
    const tiempoHoras = distancia / velocidadPromedio;
    
    return tiempoHoras;
  };

  const handleDistanciaChange = (e) => {
    const distancia = parseFloat(e.target.value);
    setFormData(prev => ({ ...prev, distanciaKm: e.target.value }));
    
    if (distancia && formData.fechaHoraSalida) {
      const tiempoEstimado = calcularTiempoEstimado(distancia);
      const fechaSalida = new Date(formData.fechaHoraSalida);
      const fechaLlegada = new Date(fechaSalida.getTime() + (tiempoEstimado * 60 * 60 * 1000));
      
      setFormData(prev => ({
        ...prev,
        fechaHoraLlegadaEstimada: fechaLlegada.toISOString().slice(0, 16)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.codigo.trim()) newErrors.codigo = "El código es requerido";
    if (!formData.vehiculoId) newErrors.vehiculoId = "Debe seleccionar un vehículo";
    if (!formData.conductorId) newErrors.conductorId = "Debe seleccionar un conductor";
    if (!formData.origen.trim()) newErrors.origen = "El origen es requerido";
    if (!formData.destino.trim()) newErrors.destino = "El destino es requerido";
    if (!formData.fechaHoraSalida) newErrors.fechaHoraSalida = "La fecha de salida es requerida";
    if (!formData.fechaHoraLlegadaEstimada) newErrors.fechaHoraLlegadaEstimada = "La fecha de llegada estimada es requerida";
    if (!formData.tipoMovimiento) newErrors.tipoMovimiento = "Debe seleccionar el tipo de movimiento";
    if (!formData.cargaPasajeros.trim()) newErrors.cargaPasajeros = "Debe especificar la carga o pasajeros";

    // Validar fechas
    if (formData.fechaHoraSalida && formData.fechaHoraLlegadaEstimada) {
      const fechaSalida = new Date(formData.fechaHoraSalida);
      const fechaLlegada = new Date(formData.fechaHoraLlegadaEstimada);
      
      if (fechaSalida >= fechaLlegada) {
        newErrors.fechaHoraLlegadaEstimada = "La fecha de llegada debe ser posterior a la salida";
      }
      
      if (fechaSalida < new Date()) {
        newErrors.fechaHoraSalida = "La fecha de salida no puede ser en el pasado";
      }
    }

    // Validar distancia
    if (formData.distanciaKm && (isNaN(formData.distanciaKm) || parseFloat(formData.distanciaKm) <= 0)) {
      newErrors.distanciaKm = "La distancia debe ser un número mayor a 0";
    }

    // Validar peso
    if (formData.pesoEstimado && (isNaN(formData.pesoEstimado) || parseFloat(formData.pesoEstimado) <= 0)) {
      newErrors.pesoEstimado = "El peso debe ser un número mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dataToSend = {
        codigo: formData.codigo.trim(),
        vehiculoId: parseInt(formData.vehiculoId),
        conductorId: parseInt(formData.conductorId),
        origen: formData.origen.trim(),
        destino: formData.destino.trim(),
        distanciaKm: formData.distanciaKm ? parseFloat(formData.distanciaKm) : null,
        fechaHoraSalida: formData.fechaHoraSalida,
        fechaHoraLlegadaEstimada: formData.fechaHoraLlegadaEstimada,
        tipoMovimiento: formData.tipoMovimiento,
        cargaPasajeros: formData.cargaPasajeros.trim(),
        pesoEstimado: formData.pesoEstimado ? parseFloat(formData.pesoEstimado) : null,
        estado: "Programado",
        observaciones: formData.observaciones.trim() || null,
      };

      if (movimiento) {
        // await movimientoService.actualizarMovimiento(movimiento.id, dataToSend);
        showSuccessAlert("¡Movimiento actualizado!", "El movimiento fue actualizado correctamente.");
      } else {
        // await movimientoService.crearMovimiento(dataToSend);
        showSuccessAlert("¡Movimiento creado!", "Se ha registrado correctamente el movimiento.");
      }

      onSuccess();
    } catch (error) {
      showErrorAlert("Error", error.message || "Ocurrió un error al guardar el movimiento.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span>Cargando datos...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {movimiento ? "Editar Movimiento" : "Nuevo Movimiento"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiTruck className="text-blue-600" /> Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Código */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 ${
                    errors.codigo ? "border-red-500" : "border-gray-300"
                  }`}
                  readOnly
                />
                {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo}</p>}
              </div>

              {/* Vehículo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehículo <span className="text-red-500">*</span>
                </label>
                <select
                  name="vehiculoId"
                  value={formData.vehiculoId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.vehiculoId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Seleccionar vehículo</option>
                  {vehiculos.map((vehiculo) => (
                    <option key={vehiculo.id} value={vehiculo.id}>
                      {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo}
                    </option>
                  ))}
                </select>
                {errors.vehiculoId && <p className="text-red-500 text-xs mt-1">{errors.vehiculoId}</p>}
              </div>

              {/* Conductor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conductor <span className="text-red-500">*</span>
                </label>
                <select
                  name="conductorId"
                  value={formData.conductorId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.conductorId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Seleccionar conductor</option>
                  {conductores.map((conductor) => (
                    <option key={conductor.id} value={conductor.id}>
                      {conductor.nombre} {conductor.apellido} - {conductor.licencia}
                    </option>
                  ))}
                </select>
                {errors.conductorId && <p className="text-red-500 text-xs mt-1">{errors.conductorId}</p>}
              </div>
            </div>
          </div>

          {/* Información de Ruta */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiMapPin className="text-green-600" /> Información de Ruta
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Origen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origen <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="origen"
                  value={formData.origen}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.origen ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Lima"
                />
                {errors.origen && <p className="text-red-500 text-xs mt-1">{errors.origen}</p>}
              </div>

              {/* Destino */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destino <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="destino"
                  value={formData.destino}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.destino ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Arequipa"
                />
                {errors.destino && <p className="text-red-500 text-xs mt-1">{errors.destino}</p>}
              </div>

              {/* Distancia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distancia (km)
                </label>
                <input
                  type="number"
                  name="distanciaKm"
                  value={formData.distanciaKm}
                  onChange={handleDistanciaChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.distanciaKm ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1000"
                  step="0.1"
                />
                {errors.distanciaKm && <p className="text-red-500 text-xs mt-1">{errors.distanciaKm}</p>}
              </div>
            </div>
          </div>

          {/* Información de Fechas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiClock className="text-purple-600" /> Programación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha de Salida */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha y Hora de Salida <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="fechaHoraSalida"
                  value={formData.fechaHoraSalida}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.fechaHoraSalida ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.fechaHoraSalida && <p className="text-red-500 text-xs mt-1">{errors.fechaHoraSalida}</p>}
              </div>

              {/* Fecha de Llegada Estimada */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha y Hora de Llegada Estimada <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="fechaHoraLlegadaEstimada"
                  value={formData.fechaHoraLlegadaEstimada}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.fechaHoraLlegadaEstimada ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.fechaHoraLlegadaEstimada && <p className="text-red-500 text-xs mt-1">{errors.fechaHoraLlegadaEstimada}</p>}
              </div>
            </div>
          </div>

          {/* Información de Carga */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiPackage className="text-orange-600" /> Información de Carga
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tipo de Movimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Movimiento <span className="text-red-500">*</span>
                </label>
                <select
                  name="tipoMovimiento"
                  value={formData.tipoMovimiento}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.tipoMovimiento ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {tiposMovimiento.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                {errors.tipoMovimiento && <p className="text-red-500 text-xs mt-1">{errors.tipoMovimiento}</p>}
              </div>

              {/* Carga/Pasajeros */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción de Carga/Pasajeros <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cargaPasajeros"
                  value={formData.cargaPasajeros}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.cargaPasajeros ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Carga general 15 toneladas"
                />
                {errors.cargaPasajeros && <p className="text-red-500 text-xs mt-1">{errors.cargaPasajeros}</p>}
              </div>

              {/* Peso Estimado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso Estimado (kg)
                </label>
                <input
                  type="number"
                  name="pesoEstimado"
                  value={formData.pesoEstimado}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.pesoEstimado ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="15000"
                  step="0.1"
                />
                {errors.pesoEstimado && <p className="text-red-500 text-xs mt-1">{errors.pesoEstimado}</p>}
              </div>
            </div>

            {/* Observaciones */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Notas adicionales sobre el movimiento..."
                rows="3"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Guardando..." : movimiento ? "Actualizar" : "Crear Movimiento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovimientoModal;