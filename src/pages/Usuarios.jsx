import { useState, useEffect } from "react";
import { usuarioService } from "../services/usuarioService";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmAlert,
} from "../utils/sweetAlertConfig";
import UsuarioModal from "../components/usuarios/UsuarioModal";
import MainLayout from "../components/layout/MainLayout";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter } from "react-icons/fi";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActivo, setFilterActivo] = useState("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  useEffect(() => {
    filtrarUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterActivo, usuarios]);

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

  const filtrarUsuarios = () => {
    let filtered = usuarios;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (usuario) =>
          usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.telefono?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado activo
    if (filterActivo === "activos") {
      filtered = filtered.filter((usuario) => usuario.activo);
    } else if (filterActivo === "inactivos") {
      filtered = filtered.filter((usuario) => !usuario.activo);
    }

    setFilteredUsuarios(filtered);
  };

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

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUsuario(null);
  };

  const handleModalSuccess = () => {
    cargarUsuarios();
    handleModalClose();
  };

  const usuariosActivos = usuarios.filter((u) => u.activo).length;
  const usuariosInactivos = usuarios.filter((u) => !u.activo).length;

  return (
    <MainLayout activeMenu="Usuarios y Roles">
      {/* Header Superior */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
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
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-green-600 p-2 rounded">
              <FiFilter className="text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              Filtros de Búsqueda
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Buscador */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email, teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro de estado */}
            <select
              value={filterActivo}
              onChange={(e) => setFilterActivo(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos los usuarios</option>
              <option value="activos">Usuarios activos</option>
              <option value="inactivos">Usuarios inactivos</option>
            </select>
          </div>
        </div>

        {/* Badges de estado */}
        <div className="flex gap-4">
          <div className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Usuarios Activos</span>
            <span className="bg-white text-blue-500 px-3 py-1 rounded-full font-bold">
              {usuariosActivos}
            </span>
          </div>
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Usuarios Inactivos</span>
            <span className="bg-white text-red-500 px-3 py-1 rounded-full font-bold">
              {usuariosInactivos}
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
                        {usuario.activo ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Activo
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {usuario.ultimoLogin
                          ? new Date(usuario.ultimoLogin).toLocaleString()
                          : "Nunca"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
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
