import { Calendar, FileText, X } from "lucide-react";

const ReporteDetalleModal = ({ isOpen, onClose, reporte }) => {
  if (!isOpen || !reporte) return null;

  const formatResultado = (resultado) => {
    try {
      return JSON.parse(resultado);
    } catch {
      return { error: "No se pudo parsear el resultado" };
    }
  };

  const resultado = formatResultado(reporte.resultado);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Fijo */}
        <div className="p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-white">
            Detalles del Reporte
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Reporte #{reporte.id} - {reporte.tipoReporte}
          </p>
        </div>

        {/* Content - Con scroll invisible */}
        <div className="bg-white rounded-t-xl flex-1 overflow-y-auto scrollbar-hide p-6">
          {/* Sección: Información del Reporte */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gray-800 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Información del Reporte
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  ID
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {reporte.id}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Tipo de Reporte
                </label>
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  {reporte.tipoReporte}
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Fecha de Generación
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {new Date(reporte.fechaGeneracion).toLocaleString("es-PE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Generado Por
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {reporte.nombreUsuario || `Usuario ${reporte.generadoPor}`}
                </p>
              </div>
            </div>
          </div>

          {/* Sección: Resultado del Reporte */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gray-800 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Resultado del Reporte
              </h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(resultado).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      {key.replace(/_/g, " ").toUpperCase()}
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sección: JSON Completo */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gray-800 p-2 rounded-lg">
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
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Datos Completos (JSON)
              </h3>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
              <pre className="text-green-400 text-xs font-mono">
                {JSON.stringify(resultado, null, 2)}
              </pre>
            </div>
          </div>

          {/* Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteDetalleModal;
