import { useState, useEffect } from "react";
// import { reporteService } from "../services/reporteService";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmAlert,
} from "../utils/sweetAlertConfig";
import ReporteModal from "../components/reportes/ReporteModal";
import MainLayout from "../components/layout/MainLayout";
import FilterPanel, { useFilters } from "../components/common/FilterPanel";
import StatusBadge from "../components/common/StatusBadge";
import { REPORT_TYPES } from "../constants";
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiDownload, FiEye, FiFileText, FiBarChart } from "react-icons/fi";

const Reportes = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReporte, setSelectedReporte] = useState(null);

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
    tipoReporte: '',
    fechaGeneracion: ''
  });

  // Datos simulados
  const mockReportes = [
    {
      id: 1,
      tipoReporte: "vehiculos",
      generadoPor: 1,
      usuario: { nombre: "Admin", apellido: "Sistema" },
      fechaGeneracion: "2024-10-15T10:30:00Z",
      parametros: JSON.stringify({
        estado: "En operación",
        fechaInicio: "2024-10-01",
        fechaFin: "2024-10-15"
      }),
      resultado: JSON.stringify({
        total: 25,
        enOperacion: 20,
        enMantenimiento: 3,
        disponibles: 2,
        inactivos: 0
      }),
      createdAt: "2024-10-15T10:30:00Z"
    },
    {
      id: 2,
      tipoReporte: "conductores",
      generadoPor: 1,
      usuario: { nombre: "Admin", apellido: "Sistema" },
      fechaGeneracion: "2024-10-14T15:45:00Z",
      parametros: JSON.stringify({
        estado: "Activo",
        fechaInicio: "2024-10-01",
        fechaFin: "2024-10-14"
      }),
      resultado: JSON.stringify({
        total: 15,
        activos: 12,
        inactivos: 2,
        enViaje: 1
      }),
      createdAt: "2024-10-14T15:45:00Z"
    },
    {
      id: 3,
      tipoReporte: "movimientos",
      generadoPor: 2,
      usuario: { nombre: "María", apellido: "García" },
      fechaGeneracion: "2024-10-13T09:15:00Z",
      parametros: JSON.stringify({
        estado: "Completado",
        fechaInicio: "2024-10-01",
        fechaFin: "2024-10-13"
      }),
      resultado: JSON.stringify({
        total: 45,
        completados: 38,
        enCurso: 4,
        programados: 2,
        cancelados: 1
      }),
      createdAt: "2024-10-13T09:15:00Z"
    }
  ];

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      setLoading(true);
      // Simulando datos hasta que esté el servicio
      setTimeout(() => {
        setReportes(mockReportes);
        setLoading(false);
      }, 500);
    } catch (error) {
      showErrorAlert("Error", error);
    } finally {
      setLoading(false);
    }
  };

  // Función personalizada de filtrado para reportes
  const customReporteFilter = (reporte, searchTerm) => {
    return (
      getReportTypeName(reporte.tipoReporte).toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${reporte.usuario?.nombre} ${reporte.usuario?.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Obtener reportes filtrados
  const filteredReportes = getFilteredData(reportes, customReporteFilter);

  const getReportIcon = (tipo) => {
    switch (tipo) {
      case 'vehiculos': return <FiFileText className="w-5 h-5 text-blue-600" />;
      case 'conductores': return <FiFileText className="w-5 h-5 text-green-600" />;
      case 'movimientos': return <FiBarChart className="w-5 h-5 text-purple-600" />;
      case 'usuarios': return <FiFileText className="w-5 h-5 text-orange-600" />;
      default: return <FiFileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getReportTypeName = (tipo) => {
    const names = {
      'vehiculos': 'Vehículos',
      'conductores': 'Conductores',
      'movimientos': 'Movimientos',
      'usuarios': 'Usuarios'
    };
    return names[tipo] || tipo;
  };

  const handleCrearReporte = () => {
    setSelectedReporte(null);
    setIsModalOpen(true);
  };

  const handleEditarReporte = (reporte) => {
    setSelectedReporte(reporte);
    setIsModalOpen(true);
  };

  const handleVerReporte = (reporte) => {
    try {
      const parametros = JSON.parse(reporte.parametros);
      const resultado = JSON.parse(reporte.resultado);
      
      let content = `
        <div class="text-left">
          <h4 class="font-semibold mb-2">Parámetros:</h4>
          <ul class="text-sm mb-4">
            ${Object.entries(parametros).map(([key, value]) => 
              `<li><strong>${key}:</strong> ${value}</li>`
            ).join('')}
          </ul>
          
          <h4 class="font-semibold mb-2">Resultados:</h4>
          <ul class="text-sm">
            ${Object.entries(resultado).map(([key, value]) => 
              `<li><strong>${key}:</strong> ${value}</li>`
            ).join('')}
          </ul>
        </div>
      `;

      showSuccessAlert(`Reporte de ${getReportTypeName(reporte.tipoReporte)}`, content);
    } catch (error) {
      showErrorAlert("Error", "No se pudo mostrar el contenido del reporte.");
    }
  };

  const handleDescargarReporte = (reporte) => {
    try {
      const parametros = JSON.parse(reporte.parametros);
      const resultado = JSON.parse(reporte.resultado);
      
      const data = {
        tipo: reporte.tipoReporte,
        fechaGeneracion: reporte.fechaGeneracion,
        generadoPor: `${reporte.usuario.nombre} ${reporte.usuario.apellido}`,
        parametros,
        resultado
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${reporte.tipoReporte}_${reporte.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showSuccessAlert(
        "¡Descargado!",
        "El reporte ha sido descargado exitosamente."
      );
    } catch (error) {
      showErrorAlert("Error", "No se pudo descargar el reporte.");
    }
  };

  const handleEliminarReporte = async (id) => {
    const result = await showConfirmAlert(
      "¿Estás seguro de eliminar este reporte?",
      "Al eliminar el reporte, este será removido de tu lista. Podrás volver a activarlo en el futuro si lo necesitas."
    );

    if (result.isConfirmed) {
      try {
        // await reporteService.eliminarReporte(id);
        showSuccessAlert(
          "¡Reporte eliminado exitosamente!",
          "El reporte ha sido eliminado correctamente."
        );
        cargarReportes();
      } catch (error) {
        showErrorAlert("Error", error);
      }
    }
  };

  const handleRestaurarReporte = async (id) => {
    const result = await showConfirmAlert(
      "¿Estás seguro de restaurar este reporte?",
      "El reporte volverá a estar activo en el sistema.",
      "Sí, restaurar",
      "Cancelar"
    );

    if (result.isConfirmed) {
      try {
        // await reporteService.restaurarReporte(id);
        showSuccessAlert(
          "¡Reporte restaurado exitosamente!",
          "El reporte ha sido restaurado correctamente."
        );
        cargarReportes();
      } catch (error) {
        showErrorAlert("Error", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedReporte(null);
  };

  const handleModalSuccess = () => {
    cargarReportes();
    handleModalClose();
  };



  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <MainLayout activeMenu="Reportes">
      {/* Header Superior */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Reportes</h1>
            <p className="text-gray-500 text-sm mt-1">
              Genera y administra reportes del sistema
            </p>
          </div>
          <button
            onClick={handleCrearReporte}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus className="text-xl" />
            Generar Reporte
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
          searchPlaceholder="Buscar reportes por tipo o usuario..."
          activeLabel="Activos"
          inactiveLabel="Eliminados"
          allLabel="Todos"
          filters={[
            {
              key: 'tipoReporte',
              label: 'Tipo de Reporte',
              type: 'select',
              value: filters.tipoReporte,
              options: Object.entries(REPORT_TYPES).map(([key, value]) => ({
                value: value,
                label: getReportTypeName(value)
              }))
            },
            {
              key: 'fechaGeneracion',
              label: 'Fecha de Generación',
              type: 'date',
              value: filters.fechaGeneracion
            }
          ]}
          onFilterChange={updateFilter}
        />

        {/* Badges de estado */}
        <div className="flex gap-4">
          <div className="bg-success-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Reportes Activos</span>
            <span className="bg-white text-success-500 px-3 py-1 rounded-full font-bold">
              {reportes.filter(r => !r.deletedAt).length}
            </span>
          </div>
          <div className="bg-danger-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Reportes Eliminados</span>
            <span className="bg-white text-danger-500 px-3 py-1 rounded-full font-bold">
              {reportes.filter(r => r.deletedAt).length}
            </span>
          </div>
          <div className="bg-info-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Resultados Filtrados</span>
            <span className="bg-white text-info-500 px-3 py-1 rounded-full font-bold">
              {filteredReportes.length}
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
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Tabla de Reportes
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Cargando reportes...</p>
            </div>
          ) : filteredReportes.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No se encontraron reportes</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generado Por
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Generación
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
                  {filteredReportes.map((reporte) => (
                    <tr key={reporte.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {getReportIcon(reporte.tipoReporte)}
                          <div>
                            <div className="font-medium text-gray-900">
                              {getReportTypeName(reporte.tipoReporte)}
                            </div>
                            <div className="text-sm text-gray-500">ID: {reporte.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {reporte.usuario.nombre} {reporte.usuario.apellido}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {formatDateTime(reporte.fechaGeneracion)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          status={reporte.deletedAt ? 'Eliminado' : 'Activo'}
                          variant={reporte.deletedAt ? 'danger' : 'success'}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {reporte.deletedAt ? (
                            <button
                              onClick={() => handleRestaurarReporte(reporte.id)}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                              title="Restaurar"
                            >
                              <FiRefreshCw className="text-lg" />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleVerReporte(reporte)}
                                className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                                title="Ver"
                              >
                                <FiEye className="text-lg" />
                              </button>
                              <button
                                onClick={() => handleDescargarReporte(reporte)}
                                className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors"
                                title="Descargar"
                              >
                                <FiDownload className="text-lg" />
                              </button>
                              <button
                                onClick={() => handleEliminarReporte(reporte.id)}
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
          <ReporteModal
            reporte={selectedReporte}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Reportes;