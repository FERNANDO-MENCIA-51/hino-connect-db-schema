import { useState, useEffect } from "react";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmAlert,
} from "../utils/sweetAlertConfig";
import Swal from "sweetalert2";
import MainLayout from "../components/layout/MainLayout";
import FilterPanel, { useFilters } from "../components/common/FilterPanel";
import StatusBadge from "../components/common/StatusBadge";
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiSettings, FiAlertTriangle, FiSearch } from "react-icons/fi";
import { AlertTriangle, RotateCcw, Settings, Edit, Trash2 } from "lucide-react";

const Configuraciones = () => {
  const [configuraciones, setConfiguraciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [deletedConfiguraciones, setDeletedConfiguraciones] = useState([]);
  const [formData, setFormData] = useState({ clave: "", valor: "", descripcion: "" });
  const [editingConfig, setEditingConfig] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);

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
    tipo: '',
    criticidad: ''
  });

  // Datos simulados
  const mockConfiguraciones = [
    {
      id: 1,
      clave: "max_velocidad_carretera",
      valor: "90",
      descripcion: "Velocidad máxima permitida en carretera (km/h)",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      deletedAt: null,
      critica: true
    },
    {
      id: 2,
      clave: "tiempo_descanso_conductor",
      valor: "8",
      descripcion: "Tiempo mínimo de descanso para conductores (horas)",
      createdAt: "2024-01-16T10:00:00Z",
      updatedAt: "2024-01-16T10:00:00Z",
      deletedAt: null,
      critica: true
    },
    {
      id: 3,
      clave: "capacidad_maxima_carga",
      valor: "25000",
      descripcion: "Capacidad máxima de carga por vehículo (kg)",
      createdAt: "2024-01-17T10:00:00Z",
      updatedAt: "2024-01-17T10:00:00Z",
      deletedAt: null,
      critica: true
    },
    {
      id: 4,
      clave: "notificaciones_email",
      valor: "true",
      descripcion: "Habilitar notificaciones por email",
      createdAt: "2024-01-18T10:00:00Z",
      updatedAt: "2024-01-18T10:00:00Z",
      deletedAt: null,
      critica: false
    },
    {
      id: 5,
      clave: "intervalo_mantenimiento",
      valor: "30",
      descripcion: "Intervalo de mantenimiento preventivo (días)",
      createdAt: "2024-01-19T10:00:00Z",
      updatedAt: "2024-01-19T10:00:00Z",
      deletedAt: null,
      critica: false
    },
    {
      id: 6,
      clave: "backup_automatico",
      valor: "true",
      descripcion: "Realizar backup automático de la base de datos",
      createdAt: "2024-01-20T10:00:00Z",
      updatedAt: "2024-01-20T10:00:00Z",
      deletedAt: null,
      critica: false
    }
  ];

  useEffect(() => {
    cargarConfiguraciones();
  }, []);

  const cargarConfiguraciones = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setConfiguraciones(mockConfiguraciones);
        setLoading(false);
      }, 500);
    } catch (error) {
      showErrorAlert("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearConfiguracion = () => {
    setSelectedConfig(null);
    setIsModalOpen(true);
  };

  const handleEditarConfiguracion = (config) => {
    setSelectedConfig(config);
    setIsModalOpen(true);
  };

  const handleEdit = (config) => {
    setEditingConfig(config);
    setFormData({
      clave: config.clave,
      valor: config.valor,
      descripcion: config.descripcion
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedConfig(null);
  };

  const handleModalSuccess = () => {
    cargarConfiguraciones();
    handleModalClose();
  };

  const handleQuickEdit = async (config) => {
    const { value: nuevoValor } = await Swal.fire({
      title: `Editar ${config.clave}`,
      text: config.descripcion,
      input: 'text',
      inputValue: config.valor,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'El valor no puede estar vacío';
        }
      }
    });

    if (nuevoValor) {
      try {
        setConfiguraciones(prev => prev.map(c => 
          c.id === config.id 
            ? { ...c, valor: nuevoValor, updatedAt: new Date().toISOString() }
            : c
        ));
        
        Swal.fire({
          title: "¡Actualizado!",
          text: "La configuración ha sido actualizada exitosamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo actualizar la configuración.",
          icon: "error"
        });
      }
    }
  };

  const handleDelete = async (config) => {
    let confirmText = `¿Estás seguro de que deseas eliminar la configuración "${config.clave}"?`;
    let warningText = "";
    
    if (config.critica) {
      warningText = "⚠️ Esta es una configuración crítica del sistema. Su eliminación puede afectar el funcionamiento.";
    }

    const result = await Swal.fire({
      title: "¿Eliminar configuración?",
      html: `${warningText}<br><br>${confirmText}`,
      icon: config.critica ? "warning" : "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        setConfiguraciones(prev => prev.filter(c => c.id !== config.id));
        setDeletedConfiguraciones(prev => [...prev, { ...config, deletedAt: new Date().toISOString() }]);
        
        Swal.fire({
          title: "¡Eliminado!",
          text: "La configuración ha sido eliminada exitosamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar la configuración.",
          icon: "error"
        });
      }
    }
  };

  const handleRestore = async (config) => {
    const result = await Swal.fire({
      title: "¿Restaurar configuración?",
      text: `¿Estás seguro de que deseas restaurar la configuración "${config.clave}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, restaurar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        setDeletedConfiguraciones(prev => prev.filter(c => c.id !== config.id));
        setConfiguraciones(prev => [...prev, { ...config, deletedAt: null }]);
        
        Swal.fire({
          title: "¡Restaurado!",
          text: "La configuración ha sido restaurada exitosamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo restaurar la configuración.",
          icon: "error"
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.clave.trim() || !formData.valor.trim()) {
      Swal.fire({
        title: "Error",
        text: "La clave y el valor son requeridos.",
        icon: "error"
      });
      return;
    }

    try {
      if (editingConfig) {
        setConfiguraciones(prev => prev.map(c => 
          c.id === editingConfig.id 
            ? { ...c, ...formData, updatedAt: new Date().toISOString() }
            : c
        ));
        
        Swal.fire({
          title: "¡Actualizado!",
          text: "La configuración ha sido actualizada exitosamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        const newConfig = {
          id: Math.max(...configuraciones.map(c => c.id), 0) + 1,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          critica: false
        };
        setConfiguraciones(prev => [...prev, newConfig]);
        
        Swal.fire({
          title: "¡Creado!",
          text: "La configuración ha sido creada exitosamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      }
      
      setIsModalOpen(false);
      setFormData({ clave: "", valor: "", descripcion: "" });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar la configuración.",
        icon: "error"
      });
    }
  };

  // Función personalizada de filtrado para configuraciones
  const customConfigFilter = (config, searchTerm) => {
    return (
      config.clave?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.valor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Obtener configuraciones filtradas
  const filteredConfiguraciones = getFilteredData(configuraciones, customConfigFilter);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <MainLayout activeMenu="Configuraciones">
      {/* Header Superior */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Configuraciones del Sistema</h1>
            <p className="text-gray-500 text-sm mt-1">
              Administra los parámetros de configuración del sistema
            </p>
          </div>
          <button
            onClick={handleCrearConfiguracion}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus className="text-xl" />
            Nueva Configuración
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
          searchPlaceholder="Buscar configuraciones por clave, valor o descripción..."
          activeLabel="Activas"
          inactiveLabel="Eliminadas"
          allLabel="Todas"
          filters={[
            {
              key: 'tipo',
              label: 'Tipo de Configuración',
              type: 'select',
              value: filters.tipo,
              options: [
                { value: 'sistema', label: 'Sistema' },
                { value: 'operacion', label: 'Operación' },
                { value: 'notificacion', label: 'Notificación' },
                { value: 'mantenimiento', label: 'Mantenimiento' }
              ]
            },
            {
              key: 'criticidad',
              label: 'Criticidad',
              type: 'select',
              value: filters.criticidad,
              options: [
                { value: 'critica', label: 'Crítica' },
                { value: 'normal', label: 'Normal' }
              ]
            }
          ]}
          onFilterChange={updateFilter}
        />

        {/* Badges de estado */}
        <div className="flex gap-4">
          <div className="bg-success-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Configuraciones Activas</span>
            <span className="bg-white text-success-500 px-3 py-1 rounded-full font-bold">
              {configuraciones.filter(c => !c.deletedAt).length}
            </span>
          </div>
          <div className="bg-danger-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Configuraciones Eliminadas</span>
            <span className="bg-white text-danger-500 px-3 py-1 rounded-full font-bold">
              {deletedConfiguraciones.length}
            </span>
          </div>
          <div className="bg-info-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Resultados Filtrados</span>
            <span className="bg-white text-info-500 px-3 py-1 rounded-full font-bold">
              {filteredConfiguraciones.length}
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Tabla de Configuraciones
              </h2>
            </div>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Cargando configuraciones...</p>
            </div>
          ) : filteredConfiguraciones.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No se encontraron configuraciones</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clave
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Actualización
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredConfiguraciones.map((config) => (
                      <tr key={config.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded">
                              <FiSettings className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="font-medium text-gray-900">{config.clave}</div>
                                {config.critica && (
                                  <AlertTriangle className="w-4 h-4 text-orange-500" title="Configuración crítica" />
                                )}
                              </div>
                              <div className="text-sm text-gray-500">ID: {config.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded-lg border">
                            {config.valor}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-600 text-sm">{config.descripcion}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                          {formatDate(config.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={config.deletedAt ? 'Eliminada' : 'Activa'}
                            variant={config.deletedAt ? 'danger' : 'success'}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            {showDeleted ? (
                              <button
                                onClick={() => handleRestore(config)}
                                className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                                title="Restaurar"
                              >
                                <FiRefreshCw className="text-lg" />
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleQuickEdit(config)}
                                  className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors"
                                  title="Edición rápida"
                                >
                                  <FiSettings className="text-lg" />
                                </button>
                                <button
                                  onClick={() => handleEdit(config)}
                                  className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                                  title="Editar"
                                >
                                  <FiEdit2 className="text-lg" />
                                </button>
                                <button
                                  onClick={() => handleDelete(config)}
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
                    ))
                  }
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FiSettings className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {editingConfig ? 'Editar Configuración' : 'Nueva Configuración'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clave de Configuración *
                </label>
                <input
                  type="text"
                  value={formData.clave}
                  onChange={(e) => setFormData(prev => ({ ...prev, clave: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="ej: max_velocidad_carretera"
                  required
                  disabled={editingConfig !== null}
                />
                {editingConfig && (
                  <p className="text-xs text-gray-500 mt-1">La clave no se puede modificar</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor *
                </label>
                <input
                  type="text"
                  value={formData.valor}
                  onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="ej: 90"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Descripción detallada de la configuración"
                  rows="4"
                />
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingConfig ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Configuraciones;