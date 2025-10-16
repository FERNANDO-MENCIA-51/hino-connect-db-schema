import { Calendar, Gauge, Truck, X } from "lucide-react";

const VehiculoDetalleModal = ({ isOpen, onClose, vehiculo }) => {
  if (!isOpen || !vehiculo) return null;

  const getEstadoBadge = (estado) => {
    const badges = {
      disponible: "bg-green-100 text-green-800",
      en_operacion: "bg-blue-100 text-blue-800",
      en_mantenimiento: "bg-yellow-100 text-yellow-800",
      inactivo: "bg-gray-100 text-gray-800",
    };
    return badges[estado] || badges.disponible;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Fijo */}
        <div className="p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-white">
            Detalles del Vehículo
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {vehiculo.codigo} - {vehiculo.placa}
          </p>
        </div>

        {/* Content - Con scroll invisible */}
        <div className="bg-white rounded-t-xl flex-1 overflow-y-auto scrollbar-hide p-6">
          {/* Imagen del vehículo */}
          {vehiculo.imagenUrl && (
            <div
              className="mb-6 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
              style={{ maxHeight: "300px" }}
            >
              <img
                src={vehiculo.imagenUrl}
                alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                className="w-full h-auto object-contain max-h-[300px]"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Sección: Información del Vehículo */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gray-800 p-2 rounded-lg">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Información del Vehículo
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Código
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {vehiculo.codigo}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Placa
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {vehiculo.placa}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Marca
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {vehiculo.marca}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Modelo
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {vehiculo.modelo}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Tipo
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {vehiculo.tipo || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Estado
                </label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(
                    vehiculo.estadoActual
                  )}`}
                >
                  ● {vehiculo.estadoActual}
                </span>
              </div>
            </div>
          </div>

          {/* Sección: Especificaciones Técnicas */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gray-800 p-2 rounded-lg">
                <Gauge className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Especificaciones Técnicas
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Año de Fabricación
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {vehiculo.anioFabricacion}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Número de Chasis
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {vehiculo.numeroChasis || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Capacidad de Carga
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {vehiculo.capacidadCarga || 0} kg
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Combustible
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {vehiculo.combustible || "N/A"}
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
                  {vehiculo.activo ? "Sí" : "No"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Fecha de Registro
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {new Date(vehiculo.createdAt).toLocaleDateString("es-PE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
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

export default VehiculoDetalleModal;
