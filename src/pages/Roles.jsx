import { useState, useEffect } from "react";
import { rolService } from "../services/rolService";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmAlert,
} from "../utils/sweetAlertConfig";
import RolModal from "../components/usuarios/RolModal";
import MainLayout from "../components/layout/MainLayout";
import FilterPanel, { useFilters } from "../components/common/FilterPanel";
import StatusBadge from "../components/common/StatusBadge";
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRol, setSelectedRol] = useState(null);

  // Hook para manejar filtros
  const {
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    getFilteredData
  } = useFilters();

  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    try {
      setLoading(true);
      const data = await rolService.listarRoles();
      setRoles(data.data || []);
    } catch (error) {
      showErrorAlert("Error", error);
    } finally {
      setLoading(false);
    }
  };

  // Función personalizada de filtrado para roles
  const customRolFilter = (rol, searchTerm) => {
    return (
      rol.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rol.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Obtener roles filtrados
  const filteredRoles = getFilteredData(roles, customRolFilter);

  const handleCrearRol = () => {
    setSelectedRol(null);
    setIsModalOpen(true);
  };

  const handleEditarRol = (rol) => {
    setSelectedRol(rol);
    setIsModalOpen(true);
  };

  const handleEliminarRol = async (id) => {
    const result = await showConfirmAlert(
      "¿Estás seguro de eliminar este rol?",
      "Al eliminar el rol, este será removido de tu lista. Podrás volver a activarlo en el futuro si lo necesitas."
    );

    if (result.isConfirmed) {
      try {
        await rolService.eliminarRol(id);
        showSuccessAlert(
          "¡Rol eliminado exitosamente!",
          "El rol ha sido eliminado correctamente."
        );
        cargarRoles();
      } catch (error) {
        showErrorAlert("Error", error);
      }
    }
  };

  const handleRestaurarRol = async (id) => {
    const result = await showConfirmAlert(
      "¿Estás seguro de restaurar este rol?",
      "El rol volverá a estar activo en el sistema.",
      "Sí, restaurar",
      "Cancelar"
    );

    if (result.isConfirmed) {
      try {
        await rolService.restaurarRol(id);
        showSuccessAlert(
          "¡Rol restaurado exitosamente!",
          "El rol ha sido restaurado correctamente."
        );
        cargarRoles();
      } catch (error) {
        showErrorAlert("Error", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRol(null);
  };

  const handleModalSuccess = () => {
    cargarRoles();
    handleModalClose();
  };

  return (
    <MainLayout activeMenu="Roles">
      {/* Header Superior */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Roles</h1>
            <p className="text-gray-500 text-sm mt-1">
              Administra y gestiona los roles del sistema
            </p>
          </div>
          <button
            onClick={handleCrearRol}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus className="text-xl" />
            Nuevo Rol
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
          searchPlaceholder="Buscar por nombre o descripción..."
          activeLabel="Activos"
          inactiveLabel="Eliminados"
          allLabel="Todos"
          filters={[
            {
              key: 'fechaCreacion',
              label: 'Fecha de Creación',
              type: 'date',
              value: ''
            }
          ]}
          onFilterChange={() => {}}
        />

        {/* Badges de estado */}
        <div className="flex gap-4">
          <div className="bg-success-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Roles Activos</span>
            <span className="bg-white text-success-500 px-3 py-1 rounded-full font-bold">
              {roles.filter(r => !r.deletedAt).length}
            </span>
          </div>
          <div className="bg-danger-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Roles Eliminados</span>
            <span className="bg-white text-danger-500 px-3 py-1 rounded-full font-bold">
              {roles.filter(r => r.deletedAt).length}
            </span>
          </div>
          <div className="bg-info-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Resultados Filtrados</span>
            <span className="bg-white text-info-500 px-3 py-1 rounded-full font-bold">
              {filteredRoles.length}
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Tabla de Roles
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Cargando roles...</p>
            </div>
          ) : filteredRoles.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No se encontraron roles</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Creación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRoles.map((rol) => (
                    <tr key={rol.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rol.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {rol.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {rol.descripcion || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          status={rol.deletedAt ? 'Eliminado' : 'Activo'}
                          variant={rol.deletedAt ? 'danger' : 'success'}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(rol.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {rol.deletedAt ? (
                            <button
                              onClick={() => handleRestaurarRol(rol.id)}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                              title="Restaurar"
                            >
                              <FiRefreshCw className="text-lg" />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditarRol(rol)}
                                className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors"
                                title="Editar"
                              >
                                <FiEdit2 className="text-lg" />
                              </button>
                              <button
                                onClick={() => handleEliminarRol(rol.id)}
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
          <RolModal
            rol={selectedRol}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Roles;