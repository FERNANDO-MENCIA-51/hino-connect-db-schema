import { useState, useEffect } from "react";
import { usuarioService } from "../services/usuarioService";
import { rolService } from "../services/rolService";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmAlert,
} from "../utils/sweetAlertConfig";
import UsuarioModal from "../components/usuarios/UsuarioModal";
import MainLayout from "../components/layout/MainLayout";
import FilterPanel, { useFilters } from "../components/common/FilterPanel";
import StatusBadge from "../components/common/StatusBadge";
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  // Hook para manejar filtros
  const {
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    filters,
    updateFilter,
    clearFilters,
    getFilteredData
  } = useFilters({
    rol: '',
    fechaCreacion: ''
  });

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.listarUsuarios();
      setUsuarios(data.data || []);
    } catch (error) {
      showErrorAlert("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarRoles = async () => {
    try {
      const data = await rolService.listarRoles();
      setRoles(data.data || []);
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  };

  // Función personalizada de filtrado para usuarios
  const customUserFilter = (usuario, searchTerm) => {
    return (
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.telefono?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Obtener usuarios filtrados
  const filteredUsuarios = getFilteredData(usuarios, customUserFilter);

  const handleCrearUsuario = () => {
    setSelectedUsuario(null);
    setIsModalOpen(true);
  };

  const handleEditarUsuario = (usuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleEliminarUsuario = async (id) => {
    const result = await showConfirmAlert(
      "¿Estás seguro de eliminar este usuario?",
      "Al eliminar el usuario, este será removido de tu lista. Podrás volver a activarlo en el futuro si lo necesitas."
    );

    if (result.isConfirmed) {
      try {
        await usuarioService.eliminarUsuario(id);
        showSuccessAlert(
          "¡Usuario eliminado exitosamente!",
          "El usuario ha sido eliminado correctamente."
        );
        cargarUsuarios();
      } catch (error) {
        showErrorAlert("Error", error);
      }
    }
  };

  const handleRestaurarUsuario = async (id) => {
    const result = await showConfirmAlert(
      "¿Estás seguro de restaurar este usuario?",
      "El usuario volverá a estar activo en el sistema.",
      "Sí, restaurar",
      "Cancelar"
    );

    if (result.isConfirmed) {
      try {
        await usuarioService.restaurarUsuario(id);
        showSuccessAlert(
          "¡Usuario restaurado exitosamente!",
          "El usuario ha sido restaurado correctamente."
        );
        cargarUsuarios();
      } catch (error) {
        showErrorAlert("Error", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUsuario(null);
  };

  const handleModalSuccess = () => {
    cargarUsuarios();
    handleModalClose();
  };



  const usuariosActivos = usuarios.filter((u) => u.activo && !u.deletedAt).length;
  const usuariosInactivos = usuarios.filter((u) => !u.activo || u.deletedAt).length;

  return (
    <MainLayout activeMenu="Usuarios">
      {/* Header Superior */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
            <p className="text-gray-500 text-sm mt-1">
              Administra y gestiona los usuarios del sistema
            </p>
          </div>
          <button
            onClick={handleCrearUsuario}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus className="text-xl" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Contenido de Usuarios */}
        {/* Filtros */}
        <FilterPanel
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilterValue={activeFilter}
          onActiveFilterChange={setActiveFilter}
          searchPlaceholder="Buscar por nombre, email, teléfono..."
          activeLabel="Activos"
          inactiveLabel="Inactivos"
          allLabel="Todos"
          filters={[
            {
              key: 'rol',
              label: 'Rol',
              type: 'select',
              value: filters.rol,
              options: roles.map(rol => ({
                value: rol.id.toString(),
                label: rol.nombre
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
            <span className="font-semibold">Usuarios Activos</span>
            <span className="bg-white text-success-500 px-3 py-1 rounded-full font-bold">
              {usuarios.filter(u => u.activo && !u.deletedAt).length}
            </span>
          </div>
          <div className="bg-danger-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Usuarios Inactivos</span>
            <span className="bg-white text-danger-500 px-3 py-1 rounded-full font-bold">
              {usuarios.filter(u => !u.activo || u.deletedAt).length}
            </span>
          </div>
          <div className="bg-info-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Resultados Filtrados</span>
            <span className="bg-white text-info-500 px-3 py-1 rounded-full font-bold">
              {filteredUsuarios.length}
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
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Tabla de Usuarios
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Cargando usuarios...</p>
            </div>
          ) : filteredUsuarios.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No se encontraron usuarios</p>
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
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {usuario.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {usuario.nombre} {usuario.apellido}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {usuario.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {usuario.telefono || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Rol {usuario.rolId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          status={
                            usuario.deletedAt ? 'Eliminado' : 
                            usuario.activo ? 'Activo' : 'Inactivo'
                          }
                          variant={
                            usuario.deletedAt ? 'danger' : 
                            usuario.activo ? 'success' : 'danger'
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {usuario.ultimoLogin
                          ? new Date(usuario.ultimoLogin).toLocaleString()
                          : "Nunca"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {usuario.deletedAt ? (
                            <button
                              onClick={() => handleRestaurarUsuario(usuario.id)}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                              title="Restaurar"
                            >
                              <FiRefreshCw className="text-lg" />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditarUsuario(usuario)}
                                className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors"
                                title="Editar"
                              >
                                <FiEdit2 className="text-lg" />
                              </button>
                              <button
                                onClick={() => handleEliminarUsuario(usuario.id)}
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
          <UsuarioModal
            usuario={selectedUsuario}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Usuarios;
