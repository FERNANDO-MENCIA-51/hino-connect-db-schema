/* eslint-disable no-unused-vars */
import {
  Download,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import MovimientoModal from "../../components/Modals/MovimientoModal";
import { movimientoService } from "../../services/movimientoService";
import {
  showConfirmAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../../utils/alerts";

const Movimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMovimiento, setSelectedMovimiento] = useState(null);

  useEffect(() => {
    loadMovimientos();
  }, []);

  const loadMovimientos = async () => {
    try {
      setLoading(true);
      const data = await movimientoService.getAll();
      setMovimientos(data || []);
    } catch (error) {
      showErrorAlert("Error", "No se pudieron cargar los movimientos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedMovimiento(null);
    setIsModalOpen(true);
  };

  const handleView = (movimiento) => {
    setSelectedMovimiento(movimiento);
    setIsViewModalOpen(true);
  };

  const handleEdit = (movimiento) => {
    setSelectedMovimiento(movimiento);
    setIsModalOpen(true);
  };

  const handleDelete = async (movimiento) => {
    const result = await showConfirmAlert(
      "¿Eliminar movimiento?",
      `¿Estás seguro de eliminar el movimiento ${movimiento.codigo}? Esta acción no se puede deshacer.`,
      "Sí, eliminar",
      "Cancelar"
    );

    if (result.isConfirmed) {
      try {
        await movimientoService.delete(movimiento.id);
        showSuccessAlert("Eliminado", "Movimiento eliminado correctamente");
        loadMovimientos();
      } catch (error) {
        showErrorAlert("Error", "No se pudo eliminar el movimiento");
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMovimiento(null);
  };

  // Normalizar estado (convertir a minúsculas y reemplazar espacios)
  const normalizarEstado = (estado) => {
    if (!estado) return "";
    return estado.toLowerCase().replace(/\s+/g, "_");
  };

  // Validar si se puede editar según el estado
  const puedeEditar = (estado) => {
    const estadoNorm = normalizarEstado(estado);
    return estadoNorm === "programado" || estadoNorm === "en_curso";
  };

  // Validar si se puede eliminar según el estado
  const puedeEliminar = (estado) => {
    const estadoNorm = normalizarEstado(estado);
    return (
      estadoNorm === "programado" ||
      estadoNorm === "cancelado" ||
      estadoNorm === "inactivo"
    );
  };

  const getEstadoBadge = (estado) => {
    const estadoNorm = normalizarEstado(estado);
    const badges = {
      programado: "bg-blue-100 text-blue-800",
      en_curso: "bg-yellow-100 text-yellow-800",
      completado: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800",
      inactivo: "bg-gray-100 text-gray-800",
    };
    return badges[estadoNorm] || badges.programado;
  };

  const filteredMovimientos = movimientos.filter(
    (m) =>
      m.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.origen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.destino?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statsActivos = movimientos.filter(
    (m) => normalizarEstado(m.estado) === "en_curso"
  ).length;
  const statsCompletados = movimientos.filter(
    (m) => normalizarEstado(m.estado) === "completado"
  ).length;

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Movimientos</h1>
            <p className="text-gray-600">
              Administra y Gestiona los vehículos en la empresa
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <Search className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800">Filtros de Búsqueda</h3>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar por ID, vehículo, conductor, etc."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Datos
          </button>
          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Movimiento
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-6">
        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium">
          Vehículos Activos {statsActivos}
        </button>
        <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
          Completados {statsCompletados}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-green-100 p-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-800">Tabla de Movimientos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha / Hora de Salida
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Conductor Asignado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Origen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Destino
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Cargando...
                  </td>
                </tr>
              ) : filteredMovimientos.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No se encontraron movimientos
                  </td>
                </tr>
              ) : (
                filteredMovimientos.map((movimiento) => (
                  <tr
                    key={movimiento.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {movimiento.codigo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(movimiento.fechaHoraSalida).toLocaleString(
                        "es-PE",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      VH-{movimiento.vehiculoId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Conductor {movimiento.conductorId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {movimiento.origen}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {movimiento.destino}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(
                          movimiento.estado
                        )}`}
                      >
                        ● {movimiento.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* Ver detalles */}
                        <button
                          onClick={() => handleView(movimiento)}
                          title="Ver detalles"
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Editar - Solo si está programado o en curso */}
                        {puedeEditar(movimiento.estado) && (
                          <button
                            onClick={() => handleEdit(movimiento)}
                            title="Editar movimiento"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}

                        {/* Eliminar - Solo si está programado o cancelado */}
                        {puedeEliminar(movimiento.estado) && (
                          <button
                            onClick={() => handleDelete(movimiento)}
                            title="Eliminar movimiento"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edición/Creación */}
      <MovimientoModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        movimiento={selectedMovimiento}
        onSuccess={loadMovimientos}
      />

      {/* Modal de Vista de Detalles */}
      {isViewModalOpen && selectedMovimiento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            {/* Header - Fijo */}
            <div className="p-6 relative flex-shrink-0">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-white">
                Detalles del Movimiento
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Información completa del movimiento {selectedMovimiento.codigo}
              </p>
            </div>

            {/* Content - Con scroll invisible */}
            <div
              className="bg-white rounded-t-xl p-6 overflow-y-auto flex-1 scrollbar-hide"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {/* Sección: Información General */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Información General
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Código
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedMovimiento.codigo}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Estado
                    </label>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(
                        selectedMovimiento.estado
                      )}`}
                    >
                      ● {selectedMovimiento.estado}
                    </span>
                  </div>
                  {selectedMovimiento.tipoMovimiento && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Tipo de Movimiento
                      </label>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedMovimiento.tipoMovimiento}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sección: Asignaciones */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Asignaciones
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Vehículo
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      VH-{selectedMovimiento.vehiculoId}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Conductor
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      Conductor {selectedMovimiento.conductorId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sección: Ruta */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Ruta</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Origen
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedMovimiento.origen}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Destino
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedMovimiento.destino}
                    </p>
                  </div>
                  {selectedMovimiento.cargaPasajeros && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Carga/Pasajeros
                      </label>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedMovimiento.cargaPasajeros}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sección: Fechas y Horarios */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Fechas y Horarios
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Fecha/Hora de Salida
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(
                        selectedMovimiento.fechaHoraSalida
                      ).toLocaleString("es-PE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {selectedMovimiento.fechaHoraLlegadaEstimada && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Llegada Estimada
                      </label>
                      <p className="text-base font-semibold text-gray-900">
                        {new Date(
                          selectedMovimiento.fechaHoraLlegadaEstimada
                        ).toLocaleString("es-PE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                  {selectedMovimiento.fechaHoraLlegadaReal && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Llegada Real
                      </label>
                      <p className="text-base font-semibold text-gray-900">
                        {new Date(
                          selectedMovimiento.fechaHoraLlegadaReal
                        ).toLocaleString("es-PE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sección: Observaciones */}
              {selectedMovimiento.observaciones && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-gray-800 p-2 rounded-lg">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Observaciones
                    </h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900">
                      {selectedMovimiento.observaciones}
                    </p>
                  </div>
                </div>
              )}

              {/* Botón Cerrar */}
              <div className="mt-6">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movimientos;
