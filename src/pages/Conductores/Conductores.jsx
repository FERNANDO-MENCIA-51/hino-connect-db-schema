/* eslint-disable no-unused-vars */
import { Edit, Eye, Plus, Search, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import ConductorDetalleModal from "../../components/Modals/ConductorDetalleModal";
import ConductorModal from "../../components/Modals/ConductorModal";
import { conductorService } from "../../services/conductorService";
import {
  showConfirmAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../../utils/alerts";

const Conductores = () => {
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [selectedConductor, setSelectedConductor] = useState(null);

  useEffect(() => {
    loadConductores();
  }, []);

  const loadConductores = async () => {
    try {
      setLoading(true);
      const data = await conductorService.getAll();
      setConductores(data || []);
    } catch (error) {
      showErrorAlert("Error", "No se pudieron cargar los conductores");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await showConfirmAlert(
      "¿Estás seguro de eliminar este conductor?",
      "El conductor será marcado como inactivo."
    );

    if (result.isConfirmed) {
      try {
        await conductorService.delete(id);
        showSuccessAlert(
          "¡Conductor Eliminado!",
          "El conductor fue eliminado correctamente."
        );
        loadConductores();
      } catch (error) {
        showErrorAlert("Error", "No se pudo eliminar el conductor");
      }
    }
  };

  const handleEdit = (conductor) => {
    setSelectedConductor(conductor);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedConductor(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedConductor(null);
  };

  const handleViewDetails = (conductor) => {
    setSelectedConductor(conductor);
    setIsDetalleModalOpen(true);
  };

  const handleDetalleModalClose = () => {
    setIsDetalleModalOpen(false);
    setSelectedConductor(null);
  };

  const getEstadoBadge = (estado) => {
    const estadoLower = estado?.toLowerCase();
    return estadoLower === "activo"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const formatEstado = (estado) => {
    return estado?.charAt(0).toUpperCase() + estado?.slice(1).toLowerCase();
  };

  const filteredConductores = conductores.filter((c) => {
    const matchSearch =
      c.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.dni?.includes(searchTerm);
    const matchEstado = filterEstado === "todos" || c.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const statsActivos = conductores.filter((c) => c.estado === "activo").length;
  const statsInactivos = conductores.filter(
    (c) => c.estado === "inactivo"
  ).length;

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-blue-500 p-3 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Listado de Conductores
            </h1>
            <p className="text-gray-600">
              Administra y Gestiona los Conductores en la empresa
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setFilterEstado("activo")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filterEstado === "activo"
                ? "bg-blue-500 text-white"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            Conductores Activos {statsActivos}
          </button>
          <button
            onClick={() => setFilterEstado("inactivo")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filterEstado === "inactivo"
                ? "bg-gray-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Conductores Inactivos {statsInactivos}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Activos</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {statsActivos}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">En Línea</p>
              <h3 className="text-2xl font-bold text-gray-800">2</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Desconectados</p>
              <h3 className="text-2xl font-bold text-gray-800">2</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <Search className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800">Filtro de Búsqueda</h3>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre, DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setFilterEstado("todos")}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Todos los Conductores
          </button>
          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Registrar Conductor
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre Y Apellidos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  DNI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Licencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vehículo Asignado
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
              ) : filteredConductores.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No se encontraron conductores
                  </td>
                </tr>
              ) : (
                filteredConductores.map((conductor) => (
                  <tr
                    key={conductor.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {conductor.codigo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {conductor.nombre} {conductor.apellido}
                      <br />
                      <span className="text-gray-500 text-xs">
                        {conductor.email || "Sin email"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {conductor.dni}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {conductor.telefono}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {conductor.licencia}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {conductor.vehiculoAsignado || "Sin asignar"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(
                          conductor.estado
                        )}`}
                      >
                        ● {formatEstado(conductor.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(conductor)}
                          title="Ver detalles"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(conductor)}
                          title="Editar"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(conductor.id)}
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

      {/* Modals */}
      <ConductorModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        conductor={selectedConductor}
        onSuccess={loadConductores}
      />
      <ConductorDetalleModal
        isOpen={isDetalleModalOpen}
        onClose={handleDetalleModalClose}
        conductor={selectedConductor}
      />
    </div>
  );
};

export default Conductores;
