import { useState, useEffect } from "react";
import { FiX, FiTruck, FiSettings, FiBox, FiCalendar, FiTag, FiDroplet, FiActivity, FiEdit2, FiRefreshCw } from "react-icons/fi";
import { motion } from "framer-motion";
import { vehiculoService } from "../../services/vehiculoService";
import { showErrorAlert } from "../../utils/sweetAlertConfig";

const VehiculoDetail = ({ vehiculoId, onClose, onEdit, onRestore }) => {
  const [vehiculo, setVehiculo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vehiculoId) {
      cargarVehiculo();
    }
  }, [vehiculoId]);

  const cargarVehiculo = async () => {
    try {
      setLoading(true);
      console.log("🔍 Cargando detalle del vehículo ID:", vehiculoId);
      const response = await vehiculoService.obtenerVehiculoPorId(vehiculoId);
      console.log("📊 Respuesta del detalle:", response);
      console.log("📊 Datos del vehículo:", response.data);
      
      const vehiculoData = response.data;
      console.log("🚗 Vehículo cargado:", {
        id: vehiculoData.id,
        codigo: vehiculoData.codigo,
        placa: vehiculoData.placa,
        estadoActual: vehiculoData.estadoActual,
        activo: vehiculoData.activo,
        deletedAt: vehiculoData.deletedAt
      });
      
      setVehiculo(vehiculoData);
    } catch (error) {
      console.error("❌ Error al cargar detalle del vehículo:", error);
      console.error("❌ Error completo:", error.response);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Error data:", error.response?.data);
      showErrorAlert("Error", "No se pudo cargar el detalle del vehículo");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!vehiculo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-3xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-blue-600 text-white px-6 py-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FiTruck /> Detalles del Vehículo
          </h2>
          <button onClick={onClose} className="hover:text-gray-200">
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Imagen */}
        <div className="p-6 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2 flex items-center justify-center bg-gray-50 rounded-lg p-4">
            {vehiculo.imagenUrl ? (
              <img
                src={vehiculo.imagenUrl}
                alt={vehiculo.modelo}
                className="max-h-64 object-contain rounded-lg shadow-sm"
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <FiTruck className="text-6xl mb-2" />
                <p>Sin imagen</p>
              </div>
            )}
          </div>

          {/* Información básica */}
          <div className="md:w-1/2 space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <FiTag className="text-blue-600" />
              {vehiculo.codigo} — {vehiculo.placa}
            </div>
            <p className="text-gray-600">
              <strong>Marca:</strong> {vehiculo.marca}
            </p>
            <p className="text-gray-600">
              <strong>Modelo:</strong> {vehiculo.modelo}
            </p>
            <p className="text-gray-600">
              <strong>Tipo:</strong> {vehiculo.tipo}
            </p>
            <p className="text-gray-600">
              <strong>N° de Chasis:</strong> {vehiculo.numeroChasis}
            </p>
          </div>
        </div>

        {/* Especificaciones técnicas */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiSettings className="text-gray-700" /> Especificaciones Técnicas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-700">
              <FiCalendar className="text-blue-500" />
              <span>
                <strong>Año de fabricación:</strong> {vehiculo.anioFabricacion}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <FiBox className="text-green-500" />
              <span>
                <strong>Capacidad de carga:</strong> {vehiculo.capacidadCarga} kg
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <FiDroplet className="text-orange-500" />
              <span>
                <strong>Combustible:</strong> {vehiculo.combustible}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <FiActivity className="text-purple-500" />
              <span>
                <strong>Estado actual:</strong> {vehiculo.estadoActual}
              </span>
            </div>
          </div>
        </div>

        {/* Estado de registro */}
        <div className="bg-gray-100 px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            <strong>Activo:</strong>{" "}
            {vehiculo.activo ? (
              <span className="text-green-600 font-semibold">Sí</span>
            ) : (
              <span className="text-red-600 font-semibold">No</span>
            )}
          </p>
          <div className="flex gap-2">
            {(() => {
              // Determinar si es vehículo inactivo
              const esInactivo = vehiculo.estadoActual === "Inactivo" || 
                               vehiculo.activo === false;
              
              return esInactivo ? (
                // Solo botón restaurar para vehículos inactivos
                <>
                  {onRestore && (
                    <button
                      onClick={() => onRestore(vehiculo)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <FiRefreshCw className="text-sm" />
                      Restaurar
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Cerrar
                  </button>
                </>
              ) : (
                // Botones normales para vehículos activos
                <>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(vehiculo)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <FiEdit2 className="text-sm" />
                      Editar
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Cerrar
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VehiculoDetail;
