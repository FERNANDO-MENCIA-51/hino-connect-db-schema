import { useState, useEffect } from "react";
import { vehiculoService } from "../services/vehiculoService";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmAlert,
} from "../utils/sweetAlertConfig";
import VehiculoModal from "../components/vehiculos/VehiculoModal";
import VehiculoDetail from "../components/vehiculos/VehiculoDetail";
import VehiculoFilters from "../components/vehiculos/VehiculoFilters";
import MainLayout from "../components/layout/MainLayout";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiTruck, FiRefreshCw } from "react-icons/fi";

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [filteredVehiculos, setFilteredVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterMarca, setFilterMarca] = useState("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedVehiculoId, setSelectedVehiculoId] = useState(null);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Estados disponibles
  const estadosVehiculo = [
    "En operación",
    "En mantenimiento",
    "Disponible",
    "Inactivo",
  ];

  // Marcas comunes
  const marcasVehiculo = [
    "Hino",
    "Isuzu",
    "Mitsubishi",
    "Nissan",
    "Toyota",
    "Ford",
    "Chevrolet",
    "Volvo",
    "Mercedes-Benz",
    "Otro",
  ];

  useEffect(() => {
    cargarVehiculos();
  }, []);

  useEffect(() => {
    filtrarVehiculos();
  }, [searchTerm, filterEstado, filterMarca, vehiculos]);

  useEffect(() => {
    setCurrentPage(1); // Resetear a la primera página cuando cambien los filtros
  }, [searchTerm, filterEstado, filterMarca]);

  // Carga inicial
  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      console.log("🔄 Cargando vehículos...");
      const data = await vehiculoService.listarVehiculos();
      console.log("📊 Datos recibidos del backend:", data);
      console.log("📊 Tipo de datos:", typeof data);
      console.log("📊 Estructura de datos:", Object.keys(data));
      
      const lista = data.data || [];
      console.log("📋 Lista de vehículos:", lista);
      console.log("📋 Cantidad de vehículos:", lista.length);
      
      // Ordenar por código para mantener orden consistente
      const listaOrdenada = lista.sort((a, b) => {
        return a.codigo.localeCompare(b.codigo);
      });
      
      console.log("📋 Lista ordenada por código:", listaOrdenada);
      
      // Debug: mostrar estados de cada vehículo
      listaOrdenada.forEach((vehiculo, index) => {
        console.log(`🚗 Vehículo ${index + 1}:`, {
          id: vehiculo.id,
          codigo: vehiculo.codigo,
          placa: vehiculo.placa,
          estadoActual: vehiculo.estadoActual,
          activo: vehiculo.activo,
          deletedAt: vehiculo.deletedAt,
          marca: vehiculo.marca,
          modelo: vehiculo.modelo
        });
      });
      
      setVehiculos(listaOrdenada);
      setFilteredVehiculos(listaOrdenada);
    } catch (error) {
      console.error("❌ Error al cargar vehículos:", error);
      console.error("❌ Error completo:", error.response);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Error data:", error.response?.data);
      showErrorAlert("Error", "Error al cargar los vehículos");
    } finally {
      setLoading(false);
    }
  };

  // Filtro general mejorado
  const filtrarVehiculos = () => {
    let filtrados = [...vehiculos];

    console.log("🔍 Filtrado iniciado:", {
      totalVehiculos: vehiculos.length,
      filterEstado,
      filterMarca,
      searchTerm
    });

    // Si el filtro es "Inactivo", no aplicar filtrado local adicional
    // porque ya viene filtrado del endpoint específico
    if (filterEstado === "Inactivo") {
      console.log("⚙️ Filtro Inactivo: usando datos del endpoint específico");
      setFilteredVehiculos(filtrados);
      return;
    }

    // 🔍 Filtro de búsqueda
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtrados = filtrados.filter(
        (v) =>
          v.codigo?.toLowerCase().includes(term) ||
          v.placa?.toLowerCase().includes(term) ||
          v.marca?.toLowerCase().includes(term) ||
          v.modelo?.toLowerCase().includes(term) ||
          v.tipo?.toLowerCase().includes(term) ||
          v.numeroChasis?.toLowerCase().includes(term)
      );
      console.log("🔍 Después de búsqueda:", filtrados.length);
    }

    // Filtro por estado (excepto Inactivo)
    if (filterEstado !== "todos" && filterEstado !== "Inactivo") {
      console.log("⚙️ Filtrando por estado:", filterEstado);
      filtrados = filtrados.filter((v) => {
        const estadoVehiculo = v.estadoActual?.toLowerCase();
        const estadoFiltro = filterEstado.toLowerCase();
        const match = estadoVehiculo === estadoFiltro;
        console.log(`⚙️ Vehículo ${v.codigo}: "${estadoVehiculo}" === "${estadoFiltro}" = ${match}`);
        return match;
      });
      console.log("⚙️ Después de filtro estado:", filtrados.length);
    }

    // Filtro por marca
    if (filterMarca !== "todos") {
      filtrados = filtrados.filter(
        (v) => v.marca?.toLowerCase() === filterMarca.toLowerCase()
      );
      console.log("🚗 Después de filtro marca:", filtrados.length);
    }

    console.log("✅ Filtrado final:", filtrados.length, "vehículos");
    setFilteredVehiculos(filtrados);
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterEstado("todos");
    setFilterMarca("todos");
    setFilteredVehiculos(vehiculos);
    setCurrentPage(1);
  };

  // Lógica de paginación
  const totalPages = Math.ceil(filteredVehiculos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehiculos = filteredVehiculos.slice(startIndex, endIndex);

  // Función para cambiar de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Función para ir a la página anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Función para ir a la página siguiente
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas con elipsis
      if (currentPage <= 3) {
        // Al inicio
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Al final
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // En el medio
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Buscar por estado (función auxiliar para casos especiales)
  const handleSearchByEstado = async (estado) => {
    try {
      setLoading(true);
      console.log("🔍 handleSearchByEstado llamado con estado:", estado);
      
      if (!estado || estado === "todos") {
        console.log("🔄 Cargando todos los vehículos...");
        await cargarVehiculos();
      } else if (estado === "Inactivo") {
        // Usar endpoint específico para vehículos inactivos
        console.log("🔍 Llamando endpoint /vehiculos/inactivos...");
        const data = await vehiculoService.listarVehiculosInactivos();
        console.log("📊 Respuesta del endpoint inactivos:", data);
        console.log("📊 Tipo de datos inactivos:", typeof data);
        console.log("📊 Estructura de datos inactivos:", Object.keys(data));
        
        const listaInactivos = data.data || [];
        console.log("📋 Lista de inactivos:", listaInactivos);
        console.log("📋 Cantidad de vehículos inactivos:", listaInactivos.length);
        
        // Ordenar por código para mantener orden consistente
        const listaInactivosOrdenada = listaInactivos.sort((a, b) => {
          return a.codigo.localeCompare(b.codigo);
        });
        
        console.log("📋 Lista de inactivos ordenada:", listaInactivosOrdenada);
        
        // Debug: mostrar estados de cada vehículo
        listaInactivosOrdenada.forEach((vehiculo, index) => {
          console.log(`🚗 Vehículo inactivo ${index + 1}:`, {
            id: vehiculo.id,
            codigo: vehiculo.codigo,
            placa: vehiculo.placa,
            estadoActual: vehiculo.estadoActual,
            activo: vehiculo.activo,
            deletedAt: vehiculo.deletedAt,
            marca: vehiculo.marca,
            modelo: vehiculo.modelo
          });
        });
        
        setVehiculos(listaInactivosOrdenada);
        setFilteredVehiculos(listaInactivosOrdenada);
      } else {
        console.log("🔍 Llamando endpoint por estado:", estado);
        const data = await vehiculoService.buscarVehiculosPorEstado(estado);
        console.log("📊 Respuesta del endpoint estado:", data);
        const listaPorEstado = data.data || [];
        
        // Ordenar por código para mantener orden consistente
        const listaOrdenada = listaPorEstado.sort((a, b) => {
          return a.codigo.localeCompare(b.codigo);
        });
        
        console.log("📋 Lista por estado ordenada:", listaOrdenada);
        
        setVehiculos(listaOrdenada);
        setFilteredVehiculos(listaOrdenada);
      }
    } catch (error) {
      console.error("❌ Error en handleSearchByEstado:", error);
      showErrorAlert("Error", "Error al buscar vehículos por estado");
    } finally {
      setLoading(false);
    }
  };

  // Crear
  const handleCrearVehiculo = () => {
    setSelectedVehiculo(null);
    setIsModalOpen(true);
  };

  // Editar
  const handleEditarVehiculo = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setIsModalOpen(true);
  };

  // Ver detalle
  const handleVerDetalle = (vehiculoId) => {
    setSelectedVehiculoId(vehiculoId);
    setIsDetailOpen(true);
  };

  const handleEditarDesdeDetalle = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setIsDetailOpen(false);
    setIsModalOpen(true);
  };

  // Eliminar (soft delete)
  const handleEliminarVehiculo = async (vehiculo) => {
    console.log("🗑️ Eliminando vehículo:", vehiculo);
    
    const result = await showConfirmAlert(
      "¿Estás seguro de eliminar este vehículo?",
      "El vehículo será marcado como inactivo y podrá ser restaurado posteriormente.",
      "Sí, eliminar",
      "Cancelar"
    );

    if (result.isConfirmed) {
      try {
        console.log("📝 Eliminando vehículo con ID:", vehiculo.id);
        console.log("🔍 Vehículo original:", vehiculo);
        
        const response = await vehiculoService.eliminarVehiculo(vehiculo.id);
        console.log("✅ Respuesta de eliminación:", response);
        console.log("✅ Datos del vehículo eliminado:", response.data);
        
        showSuccessAlert("Eliminado", "Vehículo marcado como inactivo.");
        
        // Recargar la lista de vehículos
        await cargarVehiculos();
      } catch (error) {
        console.error("❌ Error al eliminar vehículo:", error);
        console.error("❌ Error completo:", error.response);
        console.error("❌ Error status:", error.response?.status);
        console.error("❌ Error data:", error.response?.data);
        showErrorAlert("Error", "No se pudo eliminar el vehículo.");
      }
    }
  };

  // Restaurar vehículo
  const handleRestaurarVehiculo = async (vehiculo) => {
    console.log("🔄 Restaurando vehículo:", vehiculo);
    
    const result = await showConfirmAlert(
      "¿Estás seguro de restaurar este vehículo?",
      "El vehículo volverá a estar disponible en el sistema.",
      "Sí, restaurar",
      "Cancelar"
    );

    if (result.isConfirmed) {
      try {
        console.log("📝 Restaurando vehículo con ID:", vehiculo.id);
        console.log("🔍 Vehículo original:", vehiculo);
        
        const response = await vehiculoService.restaurarVehiculo(vehiculo.id);
        console.log("✅ Respuesta de restauración:", response);
        console.log("✅ Datos del vehículo restaurado:", response.data);
        
        showSuccessAlert("Restaurado", "Vehículo restaurado correctamente.");
        
        // Recargar todos los vehículos para mostrar todos los estados
        await cargarVehiculos();
        
        // Cambiar filtro a "todos" para mostrar todos los estados
        setFilterEstado("todos");
        
      } catch (error) {
        console.error("❌ Error al restaurar vehículo:", error);
        console.error("❌ Error completo:", error.response);
        console.error("❌ Error status:", error.response?.status);
        console.error("❌ Error data:", error.response?.data);
        showErrorAlert("Error", "No se pudo restaurar el vehículo.");
      }
    }
  };

  // Modal control
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

  // Colores de estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "En operación":
        return "bg-blue-100 text-blue-800";
      case "En mantenimiento":
        return "bg-yellow-100 text-yellow-800";
      case "Disponible":
        return "bg-green-100 text-green-800";
      case "Inactivo":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <MainLayout activeMenu="Vehículos">
      {/* Contenido */}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full">
                <FiTruck className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Vehículos
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Administra y gestiona la flota de vehículos del sistema
                </p>
              </div>
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
        <VehiculoFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterEstado={filterEstado}
          setFilterEstado={setFilterEstado}
          filterMarca={filterMarca}
          setFilterMarca={setFilterMarca}
          onClearFilters={handleClearFilters}
          onSearchByEstado={handleSearchByEstado}
          loading={loading}
        />

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Cargando vehículos...</p>
            </div>
          ) : filteredVehiculos.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FiTruck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No se encontraron vehículos</p>
              <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Código</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Placa</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Marca/Modelo</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Año</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Capacidad</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentVehiculos.map((vehiculo) => (
                    <tr key={vehiculo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{vehiculo.codigo}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">{vehiculo.placa}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{vehiculo.marca}</div>
                          <div className="text-gray-500">{vehiculo.modelo}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{vehiculo.tipo}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{vehiculo.anioFabricacion}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{vehiculo.capacidadCarga} kg</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(vehiculo.estadoActual)}`}>
                          {vehiculo.estadoActual}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {(() => {
                            // Determinar si es vehículo inactivo (soft delete)
                            const esInactivo = vehiculo.deletedAt || 
                                             vehiculo.activo === false ||
                                             filterEstado === "Inactivo"; // Si estamos filtrando por inactivos
                            
                            console.log(`🔍 Vehículo ${vehiculo.codigo} - Es inactivo:`, esInactivo, {
                              estadoActual: vehiculo.estadoActual,
                              deletedAt: vehiculo.deletedAt,
                              activo: vehiculo.activo,
                              filterEstado
                            });
                            
                            return esInactivo ? (
                              // Solo botón restaurar para vehículos inactivos
                              <button onClick={() => handleRestaurarVehiculo(vehiculo)} className="text-purple-600 hover:text-purple-900 p-2 hover:bg-purple-50 rounded transition-colors" title="Restaurar vehículo">
                                <FiRefreshCw className="text-lg" />
                              </button>
                            ) : (
                              // Botones normales para vehículos activos
                              <>
                                <button onClick={() => handleVerDetalle(vehiculo.id)} className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors" title="Ver detalle">
                                  <FiEye className="text-lg" />
                                </button>
                                <button onClick={() => handleEditarVehiculo(vehiculo)} className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors" title="Editar">
                                  <FiEdit2 className="text-lg" />
                                </button>
                                <button onClick={() => handleEliminarVehiculo(vehiculo)} className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors" title="Eliminar">
                                  <FiTrash2 className="text-lg" />
                                </button>
                              </>
                            );
                          })()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Paginación */}
        {filteredVehiculos.length > 0 && totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredVehiculos.length)} de {filteredVehiculos.length} vehículos
              </div>
              <div className="flex items-center space-x-2">
                {/* Botón anterior */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &lt;
                </button>

                {/* Números de página */}
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                    disabled={page === '...'}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : page === '...'
                        ? 'text-gray-500 cursor-default'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Botón siguiente */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        )}

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
            onEdit={handleEditarDesdeDetalle}
            onRestore={handleRestaurarVehiculo}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Vehiculos;
