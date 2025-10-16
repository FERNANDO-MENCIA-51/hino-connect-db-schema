/* eslint-disable no-unused-vars */
import { Edit, Eye, Plus, Search, Shield, Trash2, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import RolModal from "../../components/Modals/RolModal";
import UsuarioDetalleModal from "../../components/Modals/UsuarioDetalleModal";
import UsuarioModal from "../../components/Modals/UsuarioModal";
import { rolService } from "../../services/rolService";
import { usuarioService } from "../../services/usuarioService";
import {
  showConfirmAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../../utils/alerts";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("usuarios"); // usuarios | roles
  const [isUsuarioModalOpen, setIsUsuarioModalOpen] = useState(false);
  const [isUsuarioDetalleModalOpen, setIsUsuarioDetalleModalOpen] =
    useState(false);
  const [isRolModalOpen, setIsRolModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [selectedRol, setSelectedRol] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usuariosData, rolesData] = await Promise.all([
        usuarioService.getAll(),
        rolService.getAll(),
      ]);
      setUsuarios(usuariosData || []);
      setRoles(rolesData || []);
    } catch (error) {
      showErrorAlert("Error", "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUsuario = async (id) => {
    const result = await showConfirmAlert(
      "¿Estás seguro de eliminar este usuario?",
      "El usuario será marcado como inactivo."
    );

    if (result.isConfirmed) {
      try {
        await usuarioService.delete(id);
        showSuccessAlert(
          "¡Usuario Eliminado!",
          "El usuario fue eliminado correctamente."
        );
        loadData();
      } catch (error) {
        showErrorAlert("Error", "No se pudo eliminar el usuario");
      }
    }
  };

  const handleDeleteRol = async (id) => {
    const result = await showConfirmAlert(
      "¿Estás seguro de eliminar este rol?",
      "El rol será marcado como inactivo."
    );

    if (result.isConfirmed) {
      try {
        await rolService.delete(id);
        showSuccessAlert(
          "¡Rol Eliminado!",
          "El rol fue eliminado correctamente."
        );
        loadData();
      } catch (error) {
        showErrorAlert("Error", "No se pudo eliminar el rol");
      }
    }
  };

  // Handlers para Usuario
  const handleCreateUsuario = () => {
    setSelectedUsuario(null);
    setIsUsuarioModalOpen(true);
  };

  const handleEditUsuario = (usuario) => {
    setSelectedUsuario(usuario);
    setIsUsuarioModalOpen(true);
  };

  const handleViewUsuario = (usuario) => {
    setSelectedUsuario(usuario);
    setIsUsuarioDetalleModalOpen(true);
  };

  // Handlers para Rol
  const handleCreateRol = () => {
    setSelectedRol(null);
    setIsRolModalOpen(true);
  };

  const handleEditRol = (rol) => {
    setSelectedRol(rol);
    setIsRolModalOpen(true);
  };

  const getRolNombre = (rolId) => {
    const rol = roles.find((r) => r.id === rolId);
    return rol ? rol.nombre : "N/A";
  };

  const getActivoBadge = (activo) => {
    return activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const filteredUsuarios = usuarios.filter(
    (u) =>
      u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRoles = roles.filter((r) =>
    r.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-purple-500 p-3 rounded-lg">
            <UserCog className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Usuarios y Roles
            </h1>
            <p className="text-gray-600">
              Administra usuarios y roles del sistema
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("usuarios")}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === "usuarios"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <UserCog className="w-5 h-5" />
              Usuarios
            </div>
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === "roles"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />
              Roles
            </div>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Search className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800">Filtros de Búsqueda</h3>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={
                activeTab === "usuarios"
                  ? "Buscar por nombre, email..."
                  : "Buscar por nombre de rol..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={
              activeTab === "usuarios" ? handleCreateUsuario : handleCreateRol
            }
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {activeTab === "usuarios" ? "Nuevo Usuario" : "Nuevo Rol"}
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "usuarios" ? (
        /* Tabla de Usuarios */
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Último Login
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
                ) : filteredUsuarios.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : (
                  filteredUsuarios.map((usuario) => (
                    <tr
                      key={usuario.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {usuario.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {usuario.nombre} {usuario.apellido}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {usuario.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {usuario.telefono || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {getRolNombre(usuario.rolId)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getActivoBadge(
                            usuario.activo
                          )}`}
                        >
                          {usuario.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {usuario.ultimoLogin
                          ? new Date(usuario.ultimoLogin).toLocaleDateString(
                              "es-PE"
                            )
                          : "Nunca"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewUsuario(usuario)}
                            title="Ver detalles"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditUsuario(usuario)}
                            title="Editar"
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUsuario(usuario.id)}
                            title="Eliminar"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Tabla de Roles */
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha de Creación
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
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Cargando...
                    </td>
                  </tr>
                ) : filteredRoles.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No se encontraron roles
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((rol) => (
                    <tr
                      key={rol.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {rol.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {rol.nombre}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {rol.descripcion || "Sin descripción"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(rol.createdAt).toLocaleDateString("es-PE")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditRol(rol)}
                            title="Editar"
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRol(rol.id)}
                            title="Eliminar"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <UsuarioModal
        isOpen={isUsuarioModalOpen}
        onClose={() => setIsUsuarioModalOpen(false)}
        usuario={selectedUsuario}
        onSuccess={loadData}
      />
      <UsuarioDetalleModal
        isOpen={isUsuarioDetalleModalOpen}
        onClose={() => setIsUsuarioDetalleModalOpen(false)}
        usuario={selectedUsuario}
        roles={roles}
      />
      <RolModal
        isOpen={isRolModalOpen}
        onClose={() => setIsRolModalOpen(false)}
        rol={selectedRol}
        onSuccess={loadData}
      />
    </div>
  );
};

export default Usuarios;
