import { useState, useEffect } from "react";
// import { movimientoService } from "../services/movimientoService";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmAlert,
} from "../utils/sweetAlertConfig";
import MovimientoModal from "../components/movimientos/MovimientoModal";
import MainLayout from "../components/layout/MainLayout";
import FilterPanel, { useFilters } from "../components/common/FilterPanel";
import StatusBadge from "../components/common/StatusBadge";
import { MOVEMENT_STATES } from "../constants";
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiMapPin, FiClock } from "react-icons/fi";

const Movimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovimiento, setSelectedMovimiento] = useState(null);

  // Hook para manejar filtros
  const {
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    filters,
    updateFilter,
    getFilteredData
  } = useFilters({
    estado: '',
    tipoMovimiento: '',
    fechaSalida: ''
  });

  // Datos simulados
  const mockMovimientos = [
    {
      id: 1,
      codigo: "MOV-001",
      vehiculoId: 1,
      conductorId: 1,
      vehiculo: { codigo: "V001", placa: "ABC-123", marca: "HINO" },
      conductor: { codigo: "C001", nombre: "Juan", apellido: "Pérez" },
      origen: "Lima",
      destino: "Arequipa",
      fechaHoraSalida: "2024-10-15T08:00:00",
      fechaHoraLlegadaEstimada: "2024-10-15T20:00:00",
      fechaHoraLlegadaReal: null,
      tipoMovimiento: "Transporte de carga",
      cargaPasajeros: "Carga general 15 toneladas",
      estado: "En curso",
      observaciones: "Ruta normal sin inconvenientes",
      createdAt: "2024-10-14T10:00:00Z"
    },
    {
      id: 2,
      codigo: "MOV-002",
      vehiculoId: 2,
      conductorId: 2,
      vehiculo: { codigo: "V002", placa: "DEF-456", marca: "HINO" },
      conductor: { codigo: "C002", nombre: "María", apellido: "García" },
      origen: "Lima",
      destino: "Cusco",
      fechaHoraSalida: "2024-10-16T06:00:00",
      fechaHoraLlegadaEstimada: "2024-10-16T18:00:00",
      fechaHoraLlegadaReal: "2024-10-16T17:30:00",
      tipoMovimiento: "Transporte de pasajeros",
      cargaPasajeros: "25 pasajeros",
      estado: "Completado",
      observaciones: "Viaje completado sin inconvenientes",
      createdAt: "2024-10-15T09:00:00Z"
    },
    {
      id: 3,
      codigo: "MOV-003",
      vehiculoId: 3,
      conductorId: 3,
      vehiculo: { codigo: "V003", placa: "GHI-789", marca: "HINO" },
      conductor: { codigo: "C003", nombre: "Carlos", apellido: "López" },
      origen: "Trujillo",
      destino: "Chiclayo",
      fechaHoraSalida: "2024-10-17T10:00:00",
      fechaHoraLlegadaEstimada: "2024-10-17T14:00:00",
      fechaHoraLlegadaReal: null,
      tipoMovimiento: "Transporte de carga",
      cargaPasajeros: "Carga refrigerada 8 toneladas",
      estado: "Programado",
      observaciones: "Requiere cadena de frío",
      createdAt: "2024-10-16T14:00:00Z"
    }
  ];

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const cargarMovimientos = async () => {
    try {
      setLoading(true);
      // Simulando datos hasta que esté el servicio
      setTimeout(() => {
        setMovimientos(mockMovimientos);
        setLoading(false);
      }, 500);
    } catch (error) {
      showErrorAlert("Error", error);
    } finally {
      setLoading(false);
    }
  };

  // Función personalizada de filtrado para movimientos
  const customMovimientoFilter = (movimiento, searchTerm) => {
    return (
      movimiento.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movimiento.origen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movimiento.destino?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movimiento.vehiculo?.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${movimiento.conductor?.nombre} ${movimiento.conductor?.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Obtener movimientos filtrados
  const filteredMovimientos = getFilteredData(movimientos, customMovimientoFilter);

  const handleCrearMovimiento = () => {
    setSelectedMovimiento(null);
    setIsModalOpen(true);
  };

  const handleEditarMovimiento = (movimiento) => {
    setSelectedMovimiento(movimiento);
    setIsModalOpen(true);
  };

  const handleEliminarMovimiento = async (id) => {
    const result = await showConfirmAlert(
      "¿Estás seguro de eliminar este movimiento?",
      "Al eliminar el movimiento, este será removido de tu lista. Podrás volver a activarlo en el futuro si lo necesitas."
    );

    if (result.isConfirmed) {
      try {
        // await movimientoService.eliminarMovimiento(id);
        showSuccessAlert(
          "¡Movimiento eliminado exitosamente!",
          "El movimiento ha sido eliminado correctamente."
        );
        cargarMovimientos();
      } catch (error) {
        showErrorAlert("Error", error);
      }
    }
  };

  const handleRestaurarMovimiento = async (id) => {
    const result = await showConfirmAlert(
      "¿Estás seguro de restaurar este movimiento?",
      "El movimiento volverá a estar activo en el sistema.",
      "Sí, restaurar",
      "Cancelar"
    );

    if (result.isConfirmed) {
      try {
        // await movimientoService.restaurarMovimiento(id);
        showSuccessAlert(
          "¡Movimiento restaurado exitosamente!",
          "El movimiento ha sido restaurado correctamente."
        );
        cargarMovimientos();
      } catch (error) {
        showErrorAlert("Error", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMovimiento(null);
  };

  const handleModalSuccess = () => {
    cargarMovimientos();
    handleModalClose();
  };



  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <MainLayout activeMenu="Movimientos">
      {/* Header Superior */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Movimientos</h1>
            <p className="text-gray-500 text-sm mt-1">
              Administra y gestiona los movimientos de vehículos y conductores
            </p>
          </div>
          <button
            onClick={handleCrearMovimiento}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus className="text-xl" />
            Nuevo Movimiento
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filtros */}
        <FilterPanel
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilterValue={activeFilter}
          onActiveFilterChange={setActiveFilter}
          searchPlaceholder="Buscar por código, origen, destino, vehículo o conductor..."
          activeLabel="Activos"
          inactiveLabel="Eliminados"
          allLabel="Todos"
          filters={[
            {
              key: 'estado',
              label: 'Estado',
              type: 'select',
              value: filters.estado,
              options: Object.values(MOVEMENT_STATES).map(estado => ({
                value: estado,
                label: estado
              }))
            },
            {
              key: 'tipoMovimiento',
              label: 'Tipo de Movimiento',
              type: 'select',
              value: filters.tipoMovimiento,
              options: [
                { value: 'Transporte de carga', label: 'Transporte de carga' },
                { value: 'Transporte de pasajeros', label: 'Transporte de pasajeros' },
                { value: 'Servicio especial', label: 'Servicio especial' }
              ]
            },
            {
              key: 'fechaSalida',
              label: 'Fecha de Salida',
              type: 'date',
              value: filters.fechaSalida
            }
          ]}
          onFilterChange={updateFilter}
        />

        {/* Badges de estado */}
        <div className="flex gap-4">
          <div className="bg-success-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Movimientos Activos</span>
            <span className="bg-white text-success-500 px-3 py-1 rounded-full font-bold">
              {movimientos.filter(m => !m.deletedAt).length}
            </span>
          </div>
          <div className="bg-danger-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Movimientos Eliminados</span>
            <span className="bg-white text-danger-500 px-3 py-1 rounded-full font-bold">
              {movimientos.filter(m => m.deletedAt).length}
            </span>
          </div>
          <div className="bg-info-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Resultados Filtrados</span>
            <span className="bg-white text-info-500 px-3 py-1 rounded-full font-bold">
              {filteredMovimientos.length}
            </span>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="bg-green-600 p-2 rounded">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Tabla de Movimientos
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Cargando movimientos...</p>
            </div>
          ) : filteredMovimientos.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No se encontraron movimientos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conductor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ruta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salida
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMovimientos.map((movimiento) => (
                    <tr key={movimiento.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{movimiento.codigo}</div>
                        <div className="text-sm text-gray-500">{movimiento.tipoMovimiento}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{movimiento.vehiculo.placa}</div>
                        <div className="text-sm text-gray-500">{movimiento.vehiculo.codigo} - {movimiento.vehiculo.marca}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {movimiento.conductor.nombre} {movimiento.conductor.apellido}
                        </div>
                        <div className="text-sm text-gray-500">{movimiento.conductor.codigo}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <FiMapPin className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{movimiento.origen}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-medium">{movimiento.destino}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{movimiento.cargaPasajeros}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm">
                          <FiClock className="w-4 h-4 text-gray-400" />
                          <span>{formatDateTime(movimiento.fechaHoraSalida)}</span>
                        </div>
                        {movimiento.fechaHoraLlegadaReal && (
                          <div className="text-xs text-success-600 mt-1">
                            Llegó: {formatDateTime(movimiento.fechaHoraLlegadaReal)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          status={movimiento.deletedAt ? 'Eliminado' : movimiento.estado}
                          variant={
                            movimiento.deletedAt ? 'danger' :
                            movimiento.estado === 'Completado' ? 'success' :
                            movimiento.estado === 'En curso' ? 'warning' :
                            movimiento.estado === 'Programado' ? 'info' :
                            'danger'
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {movimiento.deletedAt ? (
                            <button
                              onClick={() => handleRestaurarMovimiento(movimiento.id)}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                              title="Restaurar"
                            >
                              <FiRefreshCw className="text-lg" />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditarMovimiento(movimiento)}
                                className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors"
                                title="Editar"
                              >
                                <FiEdit2 className="text-lg" />
                              </button>
                              <button
                                onClick={() => handleEliminarMovimiento(movimiento.id)}
                                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                                title="Eliminar"
                              >
                                <FiTrash2 className="text-lg" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <MovimientoModal
            movimiento={selectedMovimiento}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Movimientos;