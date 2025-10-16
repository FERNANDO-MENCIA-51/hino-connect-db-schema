import { useState, useEffect } from "react";
import { vehiculoService } from "../services/vehiculoService";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmAlert,
} from "../utils/sweetAlertConfig";
import VehiculoModal from "../components/vehiculos/VehiculoModal";
import VehiculoDetail from "../components/vehiculos/VehiculoDetail";
import MainLayout from "../components/layout/MainLayout";
import FilterPanel, { useFilters } from "../components/common/FilterPanel";
import { VehicleStatusBadge } from "../components/common/StatusBadge";
import { VEHICLE_STATES } from "../constants";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiRefreshCw } from "react-icons/fi";

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculosEliminados, setVehiculosEliminados] = useState([]);
  const [vehiculosActivos, setVehiculosActivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedVehiculoId, setSelectedVehiculoId] = useState(null);
  const [mostrandoEliminados, setMostrandoEliminados] = useState(false);

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
    marca: '',
    tipo: '',
    estado: '',
    fechaCreacion: ''
  });

  useEffect(() => {
    cargarVehiculos(mostrandoEliminados);
  }, [mostrandoEliminados]);

  const cargarVehiculos = async (mostrarEliminados = false) => {
    try {
      setLoading(true);
      console.log("🔄 Cargando vehículos...", mostrarEliminados ? "(eliminados)" : "(activos)");
      
      // Cargar siempre ambos tipos para mantener los conteos actualizados
      const [activosData, eliminadosData] = await Promise.all([
        vehiculoService.listarVehiculos(),
        vehiculoService.listarVehiculosEliminados()
      ]);
      
      setVehiculosActivos(activosData.data || []);
      setVehiculosEliminados(eliminadosData.data || []);
      
      // Mostrar la lista correspondiente según el filtro
      if (mostrarEliminados) {
        setVehiculos(eliminadosData.data || []);
      } else {
        setVehiculos(activosData.data || []);
      }
      
      console.log("📊 Datos recibidos del backend:", { activos: activosData, eliminados: eliminadosData });
    } catch (error) {
      console.error("❌ Error al cargar vehículos:", error);
      showErrorAlert("Error", error);
    } finally {
      setLoading(false);
    }
  };

  // Función personalizada de filtrado para vehículos
  const customVehiculoFilter = (vehiculo, searchTerm) => {
    return (
      vehiculo.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.modelo?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Obtener vehículos filtrados
  const filteredVehiculos = getFilteredData(vehiculos, customVehiculoFilter);

  const handleCrearVehiculo = () => {
    setSelectedVehiculo(null);
    setIsModalOpen(true);
  };

  const handleEditarVehiculo = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setIsModalOpen(true);
  };

  const handleVerVehiculo = (vehiculoId) => {
    setSelectedVehiculoId(vehiculoId);
    setIsDetailOpen(true);
  };

  const handleEliminarVehiculo = async (id) => {
    const result = await showConfirmAlert(
      "¿Estás seguro de eliminar este vehículo?",
      "Al eliminar el vehículo, este será removido de tu lista y su estado cambiará a Inactivo. Podrás volver a activarlo en el futuro si lo necesitas."
    );

    if (result.isConfirmed) {
      try {
        // Primero actualizar el estado a Inactivo
        await vehiculoService.actualizarEstadoVehiculo(id, "Inactivo");
        // Luego eliminar el vehículo (soft delete)
        await vehiculoService.eliminarVehiculo(id);
        showSuccessAlert(
          "¡Vehículo eliminado exitosamente!",
          "El vehículo ha sido eliminado correctamente y su estado cambió a Inactivo."
        );
        cargarVehiculos(mostrandoEliminados);
      } catch (error) {
        showErrorAlert("Error", error);
      }
    }
  };

  const handleRestaurarVehiculo = async (id) => {
    const result = await showConfirmAlert(
      "¿Estás seguro de restaurar este vehículo?",
      "El vehículo volverá a estar activo en el sistema y su estado cambiará a Disponible.",
      "Sí, restaurar",
      "Cancelar"
    );

    if (result.isConfirmed) {
      try {
        // Primero restaurar el vehículo (soft delete)
        await vehiculoService.restaurarVehiculo(id);
        // Luego actualizar el estado a Disponible
        await vehiculoService.actualizarEstadoVehiculo(id, "Disponible");
        showSuccessAlert(
          "¡Vehículo restaurado exitosamente!",
          "El vehículo ha sido restaurado correctamente y su estado cambió a Disponible."
        );
        cargarVehiculos(mostrandoEliminados);
      } catch (error) {
        showErrorAlert("Error", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedVehiculo(null);
  };

  const handleModalSuccess = () => {
    cargarVehiculos();
    handleModalClose();
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setSelectedVehiculoId(null);
  };

  const handleActiveFilterChange = (filter) => {
    setActiveFilter(filter);
    setMostrandoEliminados(filter === 'inactive');
  };

  return (
    <MainLayout activeMenu="Vehículos">
      {/* Header Superior */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Vehículos</h1>
            <p className="text-gray-500 text-sm mt-1">
              Administra y gestiona la flota de vehículos
            </p>
          </div>
          <button
            onClick={handleCrearVehiculo}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus className="text-xl" />
            Nuevo Vehículo
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filtros */}
        <FilterPanel
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilterValue={activeFilter}
          onActiveFilterChange={handleActiveFilterChange}
          searchPlaceholder="Buscar por código, placa, marca o modelo..."
          activeLabel="Activos"
          inactiveLabel="Eliminados"
          allLabel="Todos"
          filters={[
            {
              key: 'marca',
              label: 'Marca',
              type: 'select',
              value: filters.marca,
              options: [
                { value: 'HINO', label: 'HINO' },
                { value: 'VOLVO', label: 'VOLVO' },
                { value: 'SCANIA', label: 'SCANIA' },
                { value: 'MERCEDES', label: 'MERCEDES' }
              ]
            },
            {
              key: 'tipo',
              label: 'Tipo',
              type: 'select',
              value: filters.tipo,
              options: [
                { value: 'Camión', label: 'Camión' },
                { value: 'Semitrailer', label: 'Semitrailer' },
                { value: 'Trailer', label: 'Trailer' }
              ]
            },
            {
              key: 'estadoActual',
              label: 'Estado',
              type: 'select',
              value: filters.estado,
              options: Object.values(VEHICLE_STATES).map(estado => ({
                value: estado,
                label: estado
              }))
            },
            {
              key: 'fechaCreacion',
              label: 'Fecha de Creación',
              type: 'date',
              value: filters.fechaCreacion
            }
          ]}
          onFilterChange={updateFilter}
        />

        {/* Badges de estado */}
        <div className="flex gap-4">
          <div className="bg-success-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Vehículos Activos</span>
            <span className="bg-white text-success-500 px-3 py-1 rounded-full font-bold">
              {vehiculosActivos.length}
            </span>
          </div>
          <div className="bg-danger-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Vehículos Eliminados</span>
            <span className="bg-white text-danger-500 px-3 py-1 rounded-full font-bold">
              {vehiculosEliminados.length}
            </span>
          </div>
          <div className="bg-info-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Resultados Filtrados</span>
            <span className="bg-white text-info-500 px-3 py-1 rounded-full font-bold">
              {filteredVehiculos.length}
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
                    d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0M15 17a2 2 0 104 0"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                {mostrandoEliminados ? "Vehículos Eliminados" : "Vehículos Activos"}
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Cargando vehículos...</p>
            </div>
          ) : filteredVehiculos.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No se encontraron vehículos</p>
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
                      Placa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marca/Modelo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacidad
                    </th>
                    {mostrandoEliminados && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Eliminación
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVehiculos.map((vehiculo) => (
                    <tr key={vehiculo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {vehiculo.codigo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehiculo.placa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div>
                          <div className="font-medium">{vehiculo.marca}</div>
                          <div className="text-gray-500">{vehiculo.modelo}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {vehiculo.tipo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <VehicleStatusBadge 
                          status={vehiculo.deletedAt ? "Inactivo" : vehiculo.estadoActual} 
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {vehiculo.capacidadCarga ? `${vehiculo.capacidadCarga} kg` : "-"}
                      </td>
                      {mostrandoEliminados && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {vehiculo.deletedAt ? new Date(vehiculo.deletedAt).toLocaleDateString() : "-"}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {mostrandoEliminados ? (
                            <button
                              onClick={() => handleRestaurarVehiculo(vehiculo.id)}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                              title="Restaurar"
                            >
                              <FiRefreshCw className="text-lg" />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleVerVehiculo(vehiculo.id)}
                                className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                                title="Ver detalles"
                              >
                                <FiEye className="text-lg" />
                              </button>
                              <button
                                onClick={() => handleEditarVehiculo(vehiculo)}
                                className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors"
                                title="Editar"
                              >
                                <FiEdit2 className="text-lg" />
                              </button>
                              <button
                                onClick={() => handleEliminarVehiculo(vehiculo.id)}
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

        {/* Modales */}
        {isModalOpen && (
          <VehiculoModal
            vehiculo={selectedVehiculo}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
          />
        )}

        {isDetailOpen && (
          <VehiculoDetail
            vehiculoId={selectedVehiculoId}
            onClose={handleDetailClose}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Vehiculos;