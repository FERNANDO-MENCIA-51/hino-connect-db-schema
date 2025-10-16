import { Calendar, User, X } from "lucide-react";

const ConductorDetalleModal = ({ isOpen, onClose, conductor }) => {
  if (!isOpen || !conductor) return null;

  const getEstadoBadge = (estado) => {
    return estado === "activo"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

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
            Detalles del Conductor
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {conductor.codigo} - {conductor.nombre} {conductor.apellido}
          </p>
        </div>

        {/* Content - Con scroll invisible */}
        <div className="bg-white rounded-t-xl flex-1 overflow-y-auto scrollbar-hide p-6">
          {/* Sección: Información Personal */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gray-800 p-2 rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Información Personal
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Código
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {conductor.codigo}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  DNI
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {conductor.dni}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Nombre Completo
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {conductor.nombre} {conductor.apellido}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Teléfono
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {conductor.telefono || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Estado
                </label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(
                    conductor.estado
                  )}`}
                >
                  ● {conductor.estado}
                </span>
              </div>
            </div>
          </div>

          {/* Sección: Información Laboral */}
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Información Laboral
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Licencia
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {conductor.licencia}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Vehículo Asignado
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {conductor.vehiculoAsignado || "Sin asignar"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Fecha de Ingreso
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {conductor.fechaIngreso
                    ? new Date(conductor.fechaIngreso).toLocaleDateString(
                        "es-PE",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Sección: Información Adicional */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gray-800 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Información Adicional
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Activo
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {conductor.activo ? "Sí" : "No"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Fecha de Registro
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {conductor.createdAt
                    ? new Date(conductor.createdAt).toLocaleDateString(
                        "es-PE",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "N/A"}
                </p>
              </div>
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

export default ConductorDetalleModal;
