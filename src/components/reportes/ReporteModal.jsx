import { useState, useEffect } from "react";
// import { reporteService } from "../../services/reporteService";
import { showSuccessAlert, showErrorAlert } from "../../utils/sweetAlertConfig";
import { FiX, FiBarChart, FiCalendar, FiFilter } from "react-icons/fi";
import { REPORT_TYPES } from "../../constants";

const ReporteModal = ({ reporte, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    tipoReporte: "vehiculos",
    fechaInicio: "",
    fechaFin: "",
    parametros: {},
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Configuración de parámetros por tipo de reporte
  const reporteConfig = {
    vehiculos: {
      nombre: "Reporte de Vehículos",
      descripcion: "Genera un reporte detallado de la flota de vehículos",
      parametros: [
        {
          key: "estado",
          label: "Estado",
          type: "select",
          options: [
            { value: "", label: "Todos los estados" },
            { value: "En operación", label: "En operación" },
            { value: "En mantenimiento", label: "En mantenimiento" },
            { value: "Disponible", label: "Disponible" },
            { value: "Inactivo", label: "Inactivo" }
          ]
        },
        {
          key: "marca",
          label: "Marca",
          type: "select",
          options: [
            { value: "", label: "Todas las marcas" },
            { value: "HINO", label: "HINO" },
            { value: "VOLVO", label: "VOLVO" },
            { value: "SCANIA", label: "SCANIA" },
            { value: "MERCEDES", label: "MERCEDES" }
          ]
        },
        {
          key: "tipo",
          label: "Tipo de Vehículo",
          type: "select",
          options: [
            { value: "", label: "Todos los tipos" },
            { value: "Camión", label: "Camión" },
            { value: "Semitrailer", label: "Semitrailer" },
            { value: "Trailer", label: "Trailer" }
          ]
        }
      ]
    },
    conductores: {
      nombre: "Reporte de Conductores",
      descripcion: "Genera un reporte detallado de los conductores",
      parametros: [
        {
          key: "estado",
          label: "Estado",
          type: "select",
          options: [
            { value: "", label: "Todos los estados" },
            { value: "Activo", label: "Activo" },
            { value: "Inactivo", label: "Inactivo" },
            { value: "En viaje", label: "En viaje" },
            { value: "Descanso", label: "Descanso" }
          ]
        },
        {
          key: "licencia",
          label: "Tipo de Licencia",
          type: "text",
          placeholder: "Ej: A2B, A3B"
        },
        {
          key: "antiguedad",
          label: "Antigüedad Mínima (años)",
          type: "number",
          placeholder: "0"
        }
      ]
    },
    movimientos: {
      nombre: "Reporte de Movimientos",
      descripcion: "Genera un reporte detallado de los movimientos de vehículos",
      parametros: [
        {
          key: "estado",
          label: "Estado",
          type: "select",
          options: [
            { value: "", label: "Todos los estados" },
            { value: "Programado", label: "Programado" },
            { value: "En curso", label: "En curso" },
            { value: "Completado", label: "Completado" },
            { value: "Cancelado", label: "Cancelado" }
          ]
        },
        {
          key: "tipoMovimiento",
          label: "Tipo de Movimiento",
          type: "select",
          options: [
            { value: "", label: "Todos los tipos" },
            { value: "Transporte de carga", label: "Transporte de carga" },
            { value: "Transporte de pasajeros", label: "Transporte de pasajeros" },
            { value: "Servicio especial", label: "Servicio especial" }
          ]
        },
        {
          key: "origen",
          label: "Origen",
          type: "text",
          placeholder: "Ciudad de origen"
        },
        {
          key: "destino",
          label: "Destino",
          type: "text",
          placeholder: "Ciudad de destino"
        }
      ]
    },
    usuarios: {
      nombre: "Reporte de Usuarios",
      descripcion: "Genera un reporte detallado de los usuarios del sistema",
      parametros: [
        {
          key: "activo",
          label: "Estado",
          type: "select",
          options: [
            { value: "", label: "Todos los estados" },
            { value: "true", label: "Activos" },
            { value: "false", label: "Inactivos" }
          ]
        },
        {
          key: "rol",
          label: "Rol",
          type: "select",
          options: [
            { value: "", label: "Todos los roles" },
            { value: "1", label: "Administrador" },
            { value: "2", label: "Operador" },
            { value: "3", label: "Supervisor" }
          ]
        },
        {
          key: "ultimoLogin",
          label: "Último Login (días atrás)",
          type: "number",
          placeholder: "30"
        }
      ]
    }
  };

  useEffect(() => {
    if (reporte) {
      const parametros = typeof reporte.parametros === 'string' 
        ? JSON.parse(reporte.parametros) 
        : reporte.parametros || {};
        
      setFormData({
        tipoReporte: reporte.tipoReporte || "vehiculos",
        fechaInicio: reporte.fechaInicio ? reporte.fechaInicio.split('T')[0] : "",
        fechaFin: reporte.fechaFin ? reporte.fechaFin.split('T')[0] : "",
        parametros: parametros,
      });
    } else {
      // Establecer fechas por defecto (último mes)
      const hoy = new Date();
      const haceUnMes = new Date();
      haceUnMes.setMonth(haceUnMes.getMonth() - 1);
      
      setFormData(prev => ({
        ...prev,
        fechaInicio: haceUnMes.toISOString().split('T')[0],
        fechaFin: hoy.toISOString().split('T')[0],
      }));
    }
  }, [reporte]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tipoReporte) newErrors.tipoReporte = "Debe seleccionar un tipo de reporte";
    if (!formData.fechaInicio) newErrors.fechaInicio = "La fecha de inicio es requerida";
    if (!formData.fechaFin) newErrors.fechaFin = "La fecha de fin es requerida";

    // Validar fechas
    if (formData.fechaInicio && formData.fechaFin) {
      const fechaInicio = new Date(formData.fechaInicio);
      const fechaFin = new Date(formData.fechaFin);
      
      if (fechaInicio >= fechaFin) {
        newErrors.fechaFin = "La fecha de fin debe ser posterior a la fecha de inicio";
      }
      
      // Validar que no sea más de 1 año de diferencia
      const unAno = 365 * 24 * 60 * 60 * 1000;
      if (fechaFin - fechaInicio > unAno) {
        newErrors.fechaFin = "El rango de fechas no puede ser mayor a 1 año";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "tipoReporte") {
      // Limpiar parámetros cuando cambia el tipo de reporte
      setFormData(prev => ({
        ...prev,
        [name]: value,
        parametros: {}
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleParametroChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      parametros: {
        ...prev.parametros,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dataToSend = {
        tipoReporte: formData.tipoReporte,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        parametros: formData.parametros,
        generadoPor: 1, // TODO: Obtener del contexto de usuario
      };

      if (reporte) {
        // await reporteService.actualizarReporte(reporte.id, dataToSend);
        showSuccessAlert("¡Reporte actualizado!", "El reporte fue actualizado correctamente.");
      } else {
        // await reporteService.generarReporte(dataToSend);
        showSuccessAlert("¡Reporte generado!", "El reporte ha sido generado exitosamente.");
      }

      onSuccess();
    } catch (error) {
      showErrorAlert("Error", error.message || "Ocurrió un error al procesar el reporte.");
    } finally {
      setLoading(false);
    }
  };

  const currentConfig = reporteConfig[formData.tipoReporte];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {reporte ? "Editar Reporte" : "Generar Nuevo Reporte"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipo de Reporte */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiBarChart className="text-blue-600" /> Tipo de Reporte
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seleccionar Tipo <span className="text-red-500">*</span>
              </label>
              <select
                name="tipoReporte"
                value={formData.tipoReporte}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.tipoReporte ? "border-red-500" : "border-gray-300"
                }`}
              >
                {Object.entries(REPORT_TYPES).map(([key, value]) => (
                  <option key={key} value={value}>
                    {reporteConfig[value]?.nombre || value}
                  </option>
                ))}
              </select>
              {errors.tipoReporte && <p className="text-red-500 text-xs mt-1">{errors.tipoReporte}</p>}
              
              {currentConfig && (
                <p className="text-sm text-gray-600 mt-2">{currentConfig.descripcion}</p>
              )}
            </div>
          </div>

          {/* Rango de Fechas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiCalendar className="text-green-600" /> Rango de Fechas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha Inicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.fechaInicio ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.fechaInicio && <p className="text-red-500 text-xs mt-1">{errors.fechaInicio}</p>}
              </div>

              {/* Fecha Fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.fechaFin ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.fechaFin && <p className="text-red-500 text-xs mt-1">{errors.fechaFin}</p>}
              </div>
            </div>
          </div>

          {/* Parámetros Específicos */}
          {currentConfig && currentConfig.parametros.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiFilter className="text-purple-600" /> Filtros Específicos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentConfig.parametros.map((param) => (
                  <div key={param.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {param.label}
                    </label>
                    {param.type === "select" ? (
                      <select
                        value={formData.parametros[param.key] || ""}
                        onChange={(e) => handleParametroChange(param.key, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {param.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={param.type}
                        value={formData.parametros[param.key] || ""}
                        onChange={(e) => handleParametroChange(param.key, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder={param.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información del Reporte */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Información del Reporte</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• El reporte se generará en formato JSON descargable</li>
              <li>• Los datos incluirán información detallada según los filtros seleccionados</li>
              <li>• El proceso puede tomar unos minutos dependiendo del rango de fechas</li>
              <li>• Una vez generado, podrás descargarlo desde la lista de reportes</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Generando..." : reporte ? "Actualizar Reporte" : "Generar Reporte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReporteModal;