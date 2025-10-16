/* eslint-disable no-unused-vars */
import { Edit, Eye, Plus, Search, Trash2, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import VehiculoDetalleModal from "../../components/Modals/VehiculoDetalleModal";
import VehiculoModal from "../../components/Modals/VehiculoModal";
import { vehiculoService } from "../../services/vehiculoService";
import {
  showConfirmAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../../utils/alerts";

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);

  useEffect(() => {
    loadVehiculos();
  }, []);

  const loadVehiculos = async () => {
    try {
      setLoading(true);
      const data = await vehiculoService.getAll();
      setVehiculos(data || []);
    } catch (error) {
      showErrorAlert("Error", "No se pudieron cargar los vehículos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await showConfirmAlert(
      "¿Estás seguro de eliminar este vehículo?",
      "El vehículo será marcado como inactivo y podrá ser restaurado posteriormente."
    );

    if (result.isConfirmed) {
      try {
        await vehiculoService.delete(id);
        showSuccessAlert(
          "¡Vehículo Eliminado!",
          "El vehículo fue eliminado correctamente."
        );
        loadVehiculos();
      } catch (error) {
        showErrorAlert("Error", "No se pudo eliminar el vehículo");
      }
    }
  };

  const handleEdit = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedVehiculo(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedVehiculo(null);
  };

  const handleViewDetails = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setIsDetalleModalOpen(true);
  };

  const handleDetalleModalClose = () => {
    setIsDetalleModalOpen(false);
    setSelectedVehiculo(null);
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      disponible: "bg-green-100 text-green-800",
      en_operacion: "bg-blue-100 text-blue-800",
      en_mantenimiento: "bg-yellow-100 text-yellow-800",
      inactivo: "bg-gray-100 text-gray-800",
    };
    return badges[estado] || badges.disponible;
  };

  const filteredVehiculos = vehiculos.filter(
    (v) =>
      v.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.marca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-blue-500 p-3 rounded-lg">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Vehículos</h1>
            <p className="text-gray-600">
              Administra y Gestiona la flota de vehículos en el sistema
            </p>
          </div>
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
              placeholder="Buscar por código, placa, marca, modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Vehículo
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
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Placa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Marca/Modelo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Año
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Capacidad
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
              ) : filteredVehiculos.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No se encontraron vehículos
                  </td>
                </tr>
              ) : (
                filteredVehiculos.map((vehiculo) => (
                  <tr
                    key={vehiculo.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {vehiculo.codigo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {vehiculo.placa}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {vehiculo.marca}
                      <br />
                      <span className="text-gray-500">{vehiculo.modelo}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {vehiculo.tipo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {vehiculo.anioFabricacion}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {vehiculo.capacidadCarga} kg
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(
                          vehiculo.estadoActual
                        )}`}
                      >
                        {vehiculo.estadoActual}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(vehiculo)}
                          title="Ver detalles"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(vehiculo)}
                          title="Editar"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vehiculo.id)}
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
      <VehiculoModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        vehiculo={selectedVehiculo}
        onSuccess={loadVehiculos}
      />
      <VehiculoDetalleModal
        isOpen={isDetalleModalOpen}
        onClose={handleDetalleModalClose}
        vehiculo={selectedVehiculo}
      />
    </div>
  );
};

export default Vehiculos;
