import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { conductorService } from "../../services/conductorService";
import { movimientoService } from "../../services/movimientoService";
import { vehiculoService } from "../../services/vehiculoService";
import { showErrorAlert, showSuccessAlert } from "../../utils/alerts";

const MovimientoModal = ({ isOpen, onClose, movimiento, onSuccess }) => {
  const [formData, setFormData] = useState({
    codigo: "",
    vehiculoId: "",
    conductorId: "",
    origen: "",
    destino: "",
    fechaHoraSalida: "",
    fechaHoraLlegadaEstimada: "",
    fechaHoraLlegadaReal: "",
    tipoMovimiento: "Transporte de carga",
    cargaPasajeros: "",
    estado: "programado",
    observaciones: "",
  });
  const [loading, setLoading] = useState(false);
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadVehiculos();
      loadConductores();
    }
    if (movimiento) {
      setFormData({
        ...movimiento,
        fechaHoraSalida: movimiento.fechaHoraSalida?.substring(0, 16) || "",
        fechaHoraLlegadaEstimada:
          movimiento.fechaHoraLlegadaEstimada?.substring(0, 16) || "",
        fechaHoraLlegadaReal:
          movimiento.fechaHoraLlegadaReal?.substring(0, 16) || "",
      });
    } else {
      resetForm();
    }
  }, [movimiento, isOpen]);

  const loadVehiculos = async () => {
    try {
      const data = await vehiculoService.getAll();
      setVehiculos(data || []);
    } catch (error) {
      console.error("Error al cargar vehículos:", error);
    }
  };

  const loadConductores = async () => {
    try {
      const data = await conductorService.getAll();
      setConductores(data || []);
    } catch (error) {
      console.error("Error al cargar conductores:", error);
    }
  };

  const resetForm = () => {
    const now = new Date();
    const localDateTime = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    )
      .toISOString()
      .substring(0, 16);

    setFormData({
      codigo: "",
      vehiculoId: "",
      conductorId: "",
      origen: "",
      destino: "",
      fechaHoraSalida: localDateTime,
      fechaHoraLlegadaEstimada: "",
      fechaHoraLlegadaReal: "",
      tipoMovimiento: "Transporte de carga",
      cargaPasajeros: "",
      estado: "programado",
      observaciones: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        vehiculoId: parseInt(formData.vehiculoId),
        conductorId: parseInt(formData.conductorId),
        fechaHoraSalida: formData.fechaHoraSalida
          ? new Date(formData.fechaHoraSalida).toISOString()
          : null,
        fechaHoraLlegadaEstimada: formData.fechaHoraLlegadaEstimada
          ? new Date(formData.fechaHoraLlegadaEstimada).toISOString()
          : null,
        fechaHoraLlegadaReal: formData.fechaHoraLlegadaReal
          ? new Date(formData.fechaHoraLlegadaReal).toISOString()
          : null,
      };

      if (movimiento) {
        await movimientoService.update(movimiento.id, dataToSend);
        showSuccessAlert(
          "¡Movimiento Actualizado!",
          "El movimiento fue actualizado correctamente."
        );
      } else {
        await movimientoService.create(dataToSend);
        showSuccessAlert(
          "¡Movimiento Creado!",
          "El movimiento fue creado correctamente."
        );
      }
      onSuccess();
      onClose();
    } catch (error) {
      showErrorAlert(
        "Error",
        error.response?.data?.message || "No se pudo guardar el movimiento"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Fijo */}
        <div className="p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-white">
            {movimiento ? "Editar Movimiento" : "Nuevo Movimiento"}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {movimiento
              ? "Modifica los datos del movimiento"
              : "Completa los datos para crear un nuevo movimiento"}
          </p>
        </div>

        {/* Form - Con scroll invisible */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-t-xl flex-1 overflow-y-auto scrollbar-hide"
        >
          <div className="p-6">
            {/* Sección: Información Básica */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gray-800 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Información Básica
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Código <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    required
                    placeholder="MOV-001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Tipo de Movimiento
                  </label>
                  <input
                    type="text"
                    name="tipoMovimiento"
                    value={formData.tipoMovimiento}
                    onChange={handleChange}
                    placeholder="Transporte de carga"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Estado Inicial
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="programado">Programado</option>
                    <option value="en_curso">En Curso</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sección: Asignaciones */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gray-800 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Asignaciones
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Vehículo Asignado <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vehiculoId"
                    value={formData.vehiculoId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar vehículo</option>
                    {vehiculos.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.codigo} - {v.placa} ({v.marca} {v.modelo})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Conductor Asignado <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="conductorId"
                    value={formData.conductorId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar conductor</option>
                    {conductores.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} {c.apellido} - {c.licencia}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sección: Ruta */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gray-800 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Ruta</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Origen <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="origen"
                    value={formData.origen}
                    onChange={handleChange}
                    required
                    placeholder="Almacén Central Lima"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Destino <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="destino"
                    value={formData.destino}
                    onChange={handleChange}
                    required
                    placeholder="Puerto del Callao"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Carga o pasajeros
                  </label>
                  <input
                    type="text"
                    name="cargaPasajeros"
                    value={formData.cargaPasajeros}
                    onChange={handleChange}
                    placeholder="15 toneladas de repuestos automotriz"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Fechas y Horarios */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gray-800 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Fechas y Horarios
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Fecha/Hora de Salida Programada{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="fechaHoraSalida"
                    value={formData.fechaHoraSalida}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Fecha/Hora Estimada de Llegada
                  </label>
                  <input
                    type="datetime-local"
                    name="fechaHoraLlegadaEstimada"
                    value={formData.fechaHoraLlegadaEstimada}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Observaciones */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gray-800 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Observaciones
                </h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  rows="3"
                  placeholder="El vehículo debe pasar por control de la garita antes de ingresar al puerto"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 px-6 pb-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
              >
                {loading
                  ? "Guardando..."
                  : movimiento
                  ? "Actualizar Movimiento"
                  : "Guardar Movimiento"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovimientoModal;
