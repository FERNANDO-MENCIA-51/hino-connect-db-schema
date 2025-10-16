import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { vehiculoService } from "../../services/vehiculoService";
import { showErrorAlert, showSuccessAlert } from "../../utils/alerts";

const VehiculoModal = ({ isOpen, onClose, vehiculo, onSuccess }) => {
  const [formData, setFormData] = useState({
    codigo: "",
    placa: "",
    marca: "",
    modelo: "",
    tipo: "",
    anioFabricacion: new Date().getFullYear(),
    numeroChasis: "",
    capacidadCarga: "",
    combustible: "Diesel",
    estadoActual: "disponible",
    imagenUrl: "",
    activo: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehiculo) {
      setFormData(vehiculo);
    } else {
      resetForm();
    }
  }, [vehiculo, isOpen]);

  const resetForm = () => {
    setFormData({
      codigo: "",
      placa: "",
      marca: "",
      modelo: "",
      tipo: "",
      anioFabricacion: new Date().getFullYear(),
      numeroChasis: "",
      capacidadCarga: "",
      combustible: "Diesel",
      estadoActual: "disponible",
      imagenUrl: "",
      activo: true,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (vehiculo) {
        await vehiculoService.update(vehiculo.id, formData);
        showSuccessAlert(
          "¡Vehículo Actualizado!",
          "El vehículo fue actualizado correctamente."
        );
      } else {
        await vehiculoService.create(formData);
        showSuccessAlert(
          "¡Vehículo Creado!",
          "El vehículo fue creado correctamente."
        );
      }
      onSuccess();
      onClose();
    } catch (error) {
      showErrorAlert(
        "Error",
        error.response?.data?.message || "No se pudo guardar el vehículo"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
            {vehiculo ? "Editar Vehículo" : "Nuevo Vehículo"}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {vehiculo
              ? "Modifica los datos del vehículo"
              : "Completa los datos para registrar un nuevo vehículo"}
          </p>
        </div>

        {/* Form - Con scroll invisible */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-t-xl flex-1 overflow-y-auto scrollbar-hide"
        >
          <div className="p-6">
            {/* Sección: Información Básica */}
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
                  Información Básica
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Código <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    required
                    placeholder="VH0001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Placa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="placa"
                    value={formData.placa}
                    onChange={handleChange}
                    required
                    placeholder="ABC-123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Marca <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    required
                    placeholder="HINO"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Modelo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    required
                    placeholder="GH-4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <input
                    type="text"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    placeholder="Camión"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Año de Fabricación
                  </label>
                  <input
                    type="number"
                    name="anioFabricacion"
                    value={formData.anioFabricacion}
                    onChange={handleChange}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    placeholder="2025"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Especificaciones Técnicas */}
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
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Especificaciones Técnicas
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Número de Chasis
                  </label>
                  <input
                    type="text"
                    name="numeroChasis"
                    value={formData.numeroChasis}
                    onChange={handleChange}
                    placeholder="HINO123456789"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Capacidad de Carga (kg)
                  </label>
                  <input
                    type="number"
                    name="capacidadCarga"
                    value={formData.capacidadCarga}
                    onChange={handleChange}
                    placeholder="15000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Combustible
                  </label>
                  <select
                    name="combustible"
                    value={formData.combustible}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Gasolina">Gasolina</option>
                    <option value="GNV">GNV</option>
                    <option value="Eléctrico">Eléctrico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Estado Actual
                  </label>
                  <select
                    name="estadoActual"
                    value={formData.estadoActual}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="en_operacion">En Operación</option>
                    <option value="en_mantenimiento">En Mantenimiento</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sección: Imagen */}
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Imagen del Vehículo
                </h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  URL de Imagen
                </label>
                <input
                  type="url"
                  name="imagenUrl"
                  value={formData.imagenUrl}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 px-6 pb-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
              >
                {loading
                  ? "Guardando..."
                  : vehiculo
                  ? "Actualizar Vehículo"
                  : "Guardar Vehículo"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehiculoModal;
