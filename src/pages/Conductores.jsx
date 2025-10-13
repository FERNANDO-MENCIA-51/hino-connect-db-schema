import { useState, useEffect } from "react";
import { conductoresService } from "../services/conductoresService";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmAlert,
} from "../utils/sweetAlertConfig";
import ConductorModal from "../components/conductores/ConductorModal";
import MainLayout from "../components/layout/MainLayout";
import FilterPanel, { useFilters } from "../components/common/FilterPanel";
import { DriverStatusBadge } from "../components/common/StatusBadge";
import { DRIVER_STATES } from "../constants";
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";

const Conductores = () => {
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConductor, setSelectedConductor] = useState(null);

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
    fechaIngreso: ''
  });

  useEffect(() => {
    cargarConductores();
  }, []);

  const cargarConductores = async () => {
    try {
      setLoading(true);
      console.log("🔄 Cargando conductores...");
      const data = await conductoresService.listarConductores();
      console.log("📊 Datos recibidos del backend:", data);
      setConductores(data.data || []);
    } catch (error) {
      console.error("❌ Error al cargar conductores:", error);
      showErrorAlert("Error", error);
    } finally {
      setLoading(false);
    }
  };

  // Función personalizada de filtrado para conductores
  const customConductorFilter = (conductor, searchTerm) => {
    return (
      conductor.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conductor.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conductor.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conductor.dni?.includes(searchTerm) ||
      conductor.telefono?.includes(searchTerm) ||
      conductor.licencia?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Obtener conductores filtrados
  const filteredConductores = getFilteredData(conductores, customConductorFilter);

  const handleCrearConductor = () => {
    setSelectedConductor(null);
    setIsModalOpen(true);
  };

  const handleEditarConductor = (conductor) => {
    setSelectedConductor(conductor);
    setIsModalOpen(true);
  };

  const handleEliminarConductor = async (id) => {
    const result = await showConfirmAlert(
      "¿Estás seguro de eliminar este conductor?",
      "Al eliminar el conductor, este será removido de tu lista. Podrás volver a activarlo en el futuro si lo necesitas."
    );

    if (result.isConfirmed) {
      try {
        await conductoresService.eliminarConductor(id);
        showSuccessAlert(
          "¡Conductor eliminado exitosamente!",
          "El conductor ha sido eliminado correctamente."
        );
        cargarConductores();
      } catch (error) {
        showErrorAlert("Error", error);
      }
    }
  };

  const handleRestaurarConductor = async (id) => {
    const result = await showConfirmAlert(
      "¿Estás seguro de restaurar este conductor?",
      "El conductor volverá a estar activo en el sistema.",
      "Sí, restaurar",
      "Cancelar"
    );

    if (result.isConfirmed) {
      try {
        await conductoresService.restaurarConductor(id);
        showSuccessAlert(
          "¡Conductor restaurado exitosamente!",
          "El conductor ha sido restaurado correctamente."
        );
        cargarConductores();
      } catch (error) {
        showErrorAlert("Error", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedConductor(null);
  };

  const handleModalSuccess = () => {
    cargarConductores();
    handleModalClose();
  };

  return (
    <MainLayout activeMenu="Conductores">
      {/* Header Superior */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Conductores</h1>
            <p className="text-gray-500 text-sm mt-1">
              Administra y gestiona los conductores de la flota
            </p>
          </div>
          <button
            onClick={handleCrearConductor}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus className="text-xl" />
            Nuevo Conductor
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
          searchPlaceholder="Buscar por código, nombre, DNI, teléfono o licencia..."
          activeLabel="Activos"
          inactiveLabel="Eliminados"
          allLabel="Todos"
          filters={[
            {
              key: 'estado',
              label: 'Estado',
              type: 'select',
              value: filters.estado,
              options: Object.values(DRIVER_STATES).map(estado => ({
                value: estado,
                label: estado
              }))
            },
            {
              key: 'fechaIngreso',
              label: 'Fecha de Ingreso',
              type: 'date',
              value: filters.fechaIngreso
            }
          ]}
          onFilterChange={updateFilter}
        />

        {/* Badges de estado */}
        <div className="flex gap-4">
          <div className="bg-success-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Conductores Activos</span>
            <span className="bg-white text-success-500 px-3 py-1 rounded-full font-bold">
              {conductores.filter(c => c.activo && !c.deletedAt).length}
            </span>
          </div>
          <div className="bg-danger-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Conductores Eliminados</span>
            <span className="bg-white text-danger-500 px-3 py-1 rounded-full font-bold">
              {conductores.filter(c => !c.activo || c.deletedAt).length}
            </span>
          </div>
          <div className="bg-info-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Resultados Filtrados</span>
            <span className="bg-white text-info-500 px-3 py-1 rounded-full font-bold">
              {filteredConductores.length}
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Tabla de Conductores
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Cargando conductores...</p>
            </div>
          ) : filteredConductores.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No se encontraron conductores</p>
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
                      Nombre Completo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DNI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Licencia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehículo Asignado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredConductores.map((conductor) => (
                    <tr key={conductor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {conductor.codigo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {conductor.nombre} {conductor.apellido}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {conductor.dni}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {conductor.telefono || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {conductor.licencia}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <DriverStatusBadge status={conductor.estado} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {conductor.vehiculoAsignado || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {conductor.deletedAt ? (
                            <button
                              onClick={() => handleRestaurarConductor(conductor.id)}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                              title="Restaurar"
                            >
                              <FiRefreshCw className="text-lg" />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditarConductor(conductor)}
                                className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors"
                                title="Editar"
                              >
                                <FiEdit2 className="text-lg" />
                              </button>
                              <button
                                onClick={() => handleEliminarConductor(conductor.id)}
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
          <ConductorModal
            conductor={selectedConductor}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Conductores;