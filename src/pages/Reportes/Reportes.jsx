/* eslint-disable no-unused-vars */
import {
  BarChart3,
  Download,
  Edit,
  Eye,
  FileText,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ReporteDetalleModal from "../../components/Modals/ReporteDetalleModal";
import { reporteService } from "../../services/reporteService";
import {
  showErrorAlert,
  showLoadingAlert,
  showSuccessAlert,
} from "../../utils/alerts";

const Reportes = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [selectedReporte, setSelectedReporte] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    loadReportes();
  }, [showDeleted]);

  const loadReportes = async () => {
    try {
      setLoading(true);
      const data = showDeleted
        ? await reporteService.getDeleted()
        : await reporteService.getAll();
      setReportes(data || []);
    } catch (error) {
      console.error("Error al cargar reportes:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      });
      setReportes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarReporteConductores = async () => {
    const periodo = new Date().toISOString().substring(0, 7); // YYYY-MM
    const usuarioId = authService.getUserId();

    showLoadingAlert("Generando reporte...");
    try {
      const reporte = await reporteService.generarReporteConductores(
        periodo,
        usuarioId
      );
      Swal.close();

      const resultado = JSON.parse(reporte.resultado);
      showSuccessAlert(
        "¡Reporte Generado!",
        `Total: ${resultado.total_conductores} | Activos: ${resultado.activos} | Inactivos: ${resultado.inactivos}`
      );
      loadReportes();
    } catch (error) {
      Swal.close();
      console.error(
        "Error al generar reporte de conductores:",
        error.response?.data
      );

      // Mensaje de error más específico
      let errorMessage = "Error al generar el reporte";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage =
          "Error en el servidor: Problema con la base de datos. Contacta al administrador del sistema.";
      }

      showErrorAlert("Error al Generar Reporte", errorMessage);
    }
  };

  const handleGenerarReporteVehiculos = async () => {
    const estado = "todos";
    const usuarioId = authService.getUserId();

    showLoadingAlert("Generando reporte...");
    try {
      const reporte = await reporteService.generarReporteVehiculos(
        estado,
        usuarioId
      );
      Swal.close();

      const resultado = JSON.parse(reporte.resultado);
      showSuccessAlert(
        "¡Reporte Generado!",
        `Total: ${resultado.total_vehiculos} | Disponibles: ${resultado.disponibles} | En Operación: ${resultado.en_operacion}`
      );
      loadReportes();
    } catch (error) {
      Swal.close();
      showErrorAlert("Error", "No se pudo generar el reporte");
    }
  };

  const handleGenerarReporteMovimientos = async () => {
    const hoy = new Date();
    const hace30Dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);

    const fechaInicio = hace30Dias.toISOString().split("T")[0];
    const fechaFin = hoy.toISOString().split("T")[0];
    const usuarioId = authService.getUserId();

    showLoadingAlert("Generando reporte...");
    try {
      const reporte = await reporteService.generarReporteMovimientos(
        fechaInicio,
        fechaFin,
        usuarioId
      );
      Swal.close();

      const resultado = JSON.parse(reporte.resultado);
      showSuccessAlert(
        "¡Reporte Generado!",
        `Total: ${resultado.total_movimientos} | En Curso: ${resultado.en_curso} | Completados: ${resultado.completados}`
      );
      loadReportes();
    } catch (error) {
      Swal.close();
      showErrorAlert("Error", "No se pudo generar el reporte");
    }
  };

  const handleViewReporte = (reporte) => {
    setSelectedReporte(reporte);
    setIsDetalleModalOpen(true);
  };

  const handleEditReporte = (reporte) => {
    Swal.fire({
      title: "Editar Reporte",
      text: "Los reportes generados no se pueden editar. Puedes generar un nuevo reporte si necesitas datos actualizados.",
      icon: "info",
      confirmButtonText: "Entendido",
    });
  };

  const handleDeleteReporte = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar reporte?",
      text: "Podrás restaurarlo desde la sección de eliminados",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await reporteService.delete(id);
        showSuccessAlert("Eliminado", "Reporte eliminado correctamente");
        loadReportes();
      } catch (error) {
        showErrorAlert("Error", "No se pudo eliminar el reporte");
      }
    }
  };

  const handleRestoreReporte = async (id) => {
    const result = await Swal.fire({
      title: "¿Restaurar reporte?",
      text: "El reporte volverá a la lista principal",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, restaurar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      showLoadingAlert("Restaurando reporte...");
      try {
        await reporteService.restore(id);
        Swal.close();
        showSuccessAlert("Restaurado", "Reporte restaurado correctamente");
        loadReportes();
      } catch (error) {
        Swal.close();
        console.error("Error al restaurar reporte:", error.response?.data);
        showErrorAlert(
          "Error al Restaurar",
          error.response?.data?.message ||
            "No se pudo restaurar el reporte. Verifica que el backend tenga el endpoint configurado."
        );
      }
    }
  };

  const formatResultado = (resultado) => {
    try {
      const parsed = JSON.parse(resultado);
      const keys = Object.keys(parsed);
      if (keys.length > 0) {
        const firstKey = keys[0];
        const firstValue = parsed[firstKey];
        return `${firstKey}: ${firstValue}${
          keys.length > 1 ? `, +${keys.length - 1} más` : ""
        }`;
      }
      return "Sin datos";
    } catch (error) {
      return resultado?.substring(0, 30) + "...";
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-purple-500 p-3 rounded-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
            <p className="text-gray-600">
              Genera y visualiza reportes del sistema
            </p>
          </div>
        </div>
      </div>

      {/* Generar Reportes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Reporte de Conductores
              </h3>
              <p className="text-sm text-gray-600">
                Estado actual de conductores
              </p>
            </div>
          </div>
          <button
            onClick={handleGenerarReporteConductores}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Generar Reporte
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Reporte de Vehículos
              </h3>
              <p className="text-sm text-gray-600">Estado de la flota</p>
            </div>
          </div>
          <button
            onClick={handleGenerarReporteVehiculos}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Generar Reporte
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Reporte de Movimientos
              </h3>
              <p className="text-sm text-gray-600">Últimos 30 días</p>
            </div>
          </div>
          <button
            onClick={handleGenerarReporteMovimientos}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Generar Reporte
          </button>
        </div>
      </div>

      {/* Historial de Reportes */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-purple-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800">
              {showDeleted ? "Reportes Eliminados" : "Historial de Reportes"}
            </h3>
          </div>
          <button
            onClick={() => setShowDeleted(!showDeleted)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showDeleted
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-white text-purple-600 hover:bg-purple-50"
            }`}
          >
            {showDeleted ? "Ver Activos" : "Ver Eliminados"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tipo de Reporte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha de Generación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Generado Por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Resultado
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
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Cargando...
                  </td>
                </tr>
              ) : reportes.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {showDeleted
                      ? "No hay reportes eliminados"
                      : "No hay reportes generados"}
                  </td>
                </tr>
              ) : (
                reportes.map((reporte) => (
                  <tr
                    key={reporte.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {reporte.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {reporte.tipoReporte}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(reporte.fechaGeneracion).toLocaleString(
                        "es-PE"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {reporte.nombreUsuario ||
                        `Usuario ${reporte.generadoPor}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                        {formatResultado(reporte.resultado)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {showDeleted ? (
                          <>
                            <button
                              onClick={() => handleViewReporte(reporte)}
                              title="Ver detalles"
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRestoreReporte(reporte.id)}
                              title="Restaurar"
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleViewReporte(reporte)}
                              title="Ver detalles"
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditReporte(reporte)}
                              title="Editar"
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteReporte(reporte.id)}
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

      {/* Modal de Detalles */}
      <ReporteDetalleModal
        isOpen={isDetalleModalOpen}
        onClose={() => setIsDetalleModalOpen(false)}
        reporte={selectedReporte}
      />
    </div>
  );
};

export default Reportes;
