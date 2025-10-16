/* eslint-disable no-unused-vars */
import { Edit, Eye, Plus, Search, Trash2, Truck, Users, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import VehiculoDetalleModal from "../../components/Modals/VehiculoDetalleModal";
import VehiculoModal from "../../components/Modals/VehiculoModal";
import { vehiculoService } from "../../services/vehiculoService";
import {
  showConfirmAlert,
  showErrorAlert,
  showSuccessAlert,
  showRestoreConfirm,
} from "../../utils/alerts";

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculosInactivos, setVehiculosInactivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos"); // "todos", "activos", "inactivos", "disponible", "en_operacion", "en_mantenimiento"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);

  useEffect(() => {
    loadVehiculos();
  }, []);

  const loadVehiculos = async () => {
    try {
      setLoading(true);
      // Cargar vehículos activos
      const dataActivos = await vehiculoService.getAll();
      setVehiculos(dataActivos || []);
      
      // Cargar vehículos inactivos
      const dataInactivos = await vehiculoService.getDeleted();
      setVehiculosInactivos(dataInactivos || []);
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

  const handleRestore = async (id) => {
    const result = await showRestoreConfirm(
      "¿Estás seguro de restaurar este vehículo?",
      "El vehículo será reactivado y estará disponible nuevamente."
    );

    if (result.isConfirmed) {
      try {
        await vehiculoService.restore(id);
        showSuccessAlert(
          "¡Vehículo Restaurado!",
          "El vehículo fue restaurado correctamente."
        );
        loadVehiculos();
      } catch (error) {
        showErrorAlert("Error", "No se pudo restaurar el vehículo");
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

  const getEstadoBadge = (estado, vehiculo) => {
    // Si estamos viendo vehículos inactivos, siempre mostrar como inactivo
    if (estadoFilter === "inactivos") {
      return "estado-inactivo";
    }
    
    // Mapear estados a sus clases CSS correspondientes
    const badges = {
      disponible: "estado-disponible",
      en_operacion: "estado-en-operacion", 
      en_operación: "estado-en-operacion", // Maneja acentos
      en_mantenimiento: "estado-en-mantenimiento",
      inactivo: "estado-inactivo",
      // Mapear estados del backend directamente
      'Disponible': "estado-disponible",
      'En operación': "estado-en-operacion",
      'En mantenimiento': "estado-en-mantenimiento",
      'Inactivo': "estado-inactivo",
    };
    
    // Usar la función de normalización mejorada
    const estadoNormalizado = normalizeEstado(estado);
    const claseSeleccionada = badges[estado] || badges[estadoNormalizado] || badges.disponible;
    
    // Debug: mostrar qué estado y clase se está usando
    console.log(`Badge - Estado original: "${estado}", Normalizado: "${estadoNormalizado}", Clase: "${claseSeleccionada}"`);
    
    return claseSeleccionada;
  };

  const getEstadoTexto = (estado, vehiculo) => {
    // Si estamos viendo vehículos inactivos, siempre mostrar "inactivo"
    if (estadoFilter === "inactivos") {
      return "inactivo";
    }
    return estado;
  };

  // Función para normalizar estados
  const normalizeEstado = (estado) => {
    if (!estado) return '';
    
    // Mapear estados del backend a estados normalizados para el frontend
    const estadoMap = {
      'Disponible': 'disponible',
      'En operación': 'en_operacion',
      'En mantenimiento': 'en_mantenimiento',
      'Inactivo': 'inactivo'
    };
    
    // Si el estado está en el mapa, usar el valor mapeado
    if (estadoMap[estado]) {
      return estadoMap[estado];
    }
    
    // Fallback: normalización antigua para compatibilidad
    return estado.toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n');
  };

  const getFilteredVehiculos = () => {
    let vehiculosToShow = [];
    
    // Determinar qué vehículos mostrar según el filtro
    switch (estadoFilter) {
      case "todos":
        vehiculosToShow = [...vehiculos, ...vehiculosInactivos];
        break;
      case "activos":
        // Solo vehículos activos (no eliminados y no inactivos)
        vehiculosToShow = vehiculos.filter(v => {
          const estadoNorm = normalizeEstado(v.estadoActual);
          return v.estadoActual !== 'Inactivo' && estadoNorm !== 'inactivo';
        });
        break;
      case "inactivos":
        // Solo vehículos eliminados
        vehiculosToShow = vehiculosInactivos;
        break;
      case "disponible":
        // Solo vehículos con estado "disponible"
        vehiculosToShow = vehiculos.filter(v => 
          v.estadoActual === 'Disponible' || normalizeEstado(v.estadoActual) === 'disponible'
        );
        break;
      case "en_operacion":
        // Solo vehículos con estado "en_operacion" (maneja variaciones)
        vehiculosToShow = vehiculos.filter(v => {
          const estadoNorm = normalizeEstado(v.estadoActual);
          console.log(`Filtro en_operacion: "${v.estadoActual}" -> "${estadoNorm}"`);
          return v.estadoActual === 'En operación' || estadoNorm === 'en_operacion' || estadoNorm === 'en_operación';
        });
        break;
      case "en_mantenimiento":
        // Solo vehículos con estado "en_mantenimiento"
        vehiculosToShow = vehiculos.filter(v => 
          v.estadoActual === 'En mantenimiento' || normalizeEstado(v.estadoActual) === 'en_mantenimiento'
        );
        break;
      default:
        vehiculosToShow = [...vehiculos, ...vehiculosInactivos];
    }

    console.log(`Filtro "${estadoFilter}" encontrado ${vehiculosToShow.length} vehículos`);

    // Aplicar filtro de búsqueda
    return vehiculosToShow.filter((v) => {
      const matchesSearch = 
        v.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.tipo?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  };

  const filteredVehiculos = getFilteredVehiculos();

  // Calcular estadísticas
  const getVehiculosStats = () => {
    // Contar solo vehículos realmente activos (excluyendo inactivos)
    const activosReales = vehiculos.filter(v => {
      const estadoNorm = normalizeEstado(v.estadoActual);
      return v.estadoActual !== 'Inactivo' && estadoNorm !== 'inactivo';
    }).length;
    
    const totalInactivos = vehiculosInactivos.length;
    
    // El total debe ser la suma de activos reales + inactivos
    const totalVehiculos = activosReales + totalInactivos;

    return {
      total: totalVehiculos,
      activos: activosReales,
      inactivos: totalInactivos,
    };
  };

  const stats = getVehiculosStats();
  
  // Debug: verificar que los conteos sean consistentes
  console.log("=== DEBUG CONTEO ESTADÍSTICAS ===");
  console.log("Total vehículos en array 'vehiculos':", vehiculos.length);
  console.log("Total vehículos en array 'vehiculosInactivos':", vehiculosInactivos.length);
  console.log("Vehículos con estado 'Inactivo' en array 'vehiculos':", 
    vehiculos.filter(v => v.estadoActual === 'Inactivo').length);
  console.log("Estadísticas calculadas:", stats);
  console.log("Verificación: activos + inactivos =", stats.activos + stats.inactivos, "vs total =", stats.total);
  console.log("=================================");

  // Función para obtener conteos de cada filtro
  const getFilterCounts = () => {
    // Debug: mostrar todos los estados que tenemos
    console.log("=== DEBUG ESTADOS ===");
    vehiculos.forEach((v, index) => {
      console.log(`Vehículo ${index + 1}:`, {
        codigo: v.codigo,
        estadoOriginal: v.estadoActual,
        estadoNormalizado: normalizeEstado(v.estadoActual)
      });
    });
    
    const disponible = vehiculos.filter(v => 
      v.estadoActual === 'Disponible' || normalizeEstado(v.estadoActual) === 'disponible'
    ).length;
    
    const enOperacion = vehiculos.filter(v => {
      const estadoNorm = normalizeEstado(v.estadoActual);
      console.log(`Conteo en_operacion: "${v.estadoActual}" -> "${estadoNorm}"`);
      return v.estadoActual === 'En operación' || estadoNorm === 'en_operacion' || estadoNorm === 'en_operación';
    }).length;
    
    const enMantenimiento = vehiculos.filter(v => 
      v.estadoActual === 'En mantenimiento' || normalizeEstado(v.estadoActual) === 'en_mantenimiento'
    ).length;
    
    console.log("Conteos finales:", { disponible, enOperacion, enMantenimiento });
    
    // Contar solo vehículos realmente activos (excluyendo inactivos)
    const activosReales = vehiculos.filter(v => {
      const estadoNorm = normalizeEstado(v.estadoActual);
      return v.estadoActual !== 'Inactivo' && estadoNorm !== 'inactivo';
    }).length;
    
    return {
      todos: stats.total, // Ya corregido en getVehiculosStats
      activos: stats.activos, // Ya corregido en getVehiculosStats
      inactivos: stats.inactivos,
      disponible,
      en_operacion: enOperacion,
      en_mantenimiento: enMantenimiento
    };
  };

  const filterCounts = getFilterCounts();

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Vehículos */}
        <div 
          className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setEstadoFilter("todos")}
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Vehículos</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>

        {/* Vehículos Activos */}
        <div 
          className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setEstadoFilter("activos")}
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">Vehículos Activos</p>
              <p className="text-2xl font-bold text-gray-800">{stats.activos}</p>
            </div>
          </div>
        </div>

        {/* Vehículos Inactivos */}
        <div 
          className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setEstadoFilter("inactivos")}
        >
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Truck className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">Vehículos Inactivos</p>
              <p className="text-2xl font-bold text-gray-800">{stats.inactivos}</p>
            </div>
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
        
        {/* Filtros por Estado */}
        <div className="mb-4">
          <div className="space-y-3">
            {/* Filtros Principales */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setEstadoFilter("todos")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  estadoFilter === "todos"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                }`}
              >
                <span>📋</span>
                Todos
                <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                  {filterCounts.todos}
                </span>
              </button>
              
              <button
                onClick={() => setEstadoFilter("activos")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  estadoFilter === "activos"
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                }`}
              >
                <span>✅</span>
                Activos
                <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                  {filterCounts.activos}
                </span>
              </button>
              
              <button
                onClick={() => setEstadoFilter("inactivos")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  estadoFilter === "inactivos"
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                }`}
              >
                <span>❌</span>
                Inactivos
                <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                  {filterCounts.inactivos}
                </span>
              </button>
            </div>

            {/* Filtros por Estado Específico */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 font-medium self-center mr-2">Estados específicos:</span>
              
              <button
                onClick={() => setEstadoFilter("disponible")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  estadoFilter === "disponible"
                    ? "bg-green-100 text-green-800 border-2 border-green-300 shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-700 border border-gray-200"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Disponible
                <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                  {filterCounts.disponible}
                </span>
              </button>
              
              <button
                onClick={() => setEstadoFilter("en_operacion")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  estadoFilter === "en_operacion"
                    ? "bg-blue-100 text-blue-800 border-2 border-blue-300 shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                En Operación
                <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                  {filterCounts.en_operacion}
                </span>
              </button>
              
              <button
                onClick={() => setEstadoFilter("en_mantenimiento")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  estadoFilter === "en_mantenimiento"
                    ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300 shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 border border-gray-200"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                En Mantenimiento
                <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                  {filterCounts.en_mantenimiento}
                </span>
              </button>
            </div>
          </div>
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
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoBadge(
                          vehiculo.estadoActual,
                          vehiculo
                        )}`}
                      >
                        {getEstadoTexto(vehiculo.estadoActual, vehiculo)}
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
                        
                        {/* Mostrar botones según el filtro activo */}
                        {estadoFilter === "inactivos" ? (
                          // Para vehículos inactivos, mostrar botón de restaurar
                          <button
                            onClick={() => handleRestore(vehiculo.id)}
                            title="Restaurar"
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        ) : (
                          // Para vehículos activos, mostrar botones de editar y eliminar
                          <>
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
                          </>
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
