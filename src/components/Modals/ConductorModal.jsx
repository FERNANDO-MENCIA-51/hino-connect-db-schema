import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { conductorService } from "../../services/conductorService";
import { showErrorAlert, showSuccessAlert } from "../../utils/alerts";

const ConductorModal = ({ isOpen, onClose, conductor, onSuccess }) => {
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    licencia: "",
    vehiculoAsignado: "",
    estado: "activo",
    fechaIngreso: new Date().toISOString().split("T")[0],
    activo: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (conductor) {
      setFormData({
        ...conductor,
        fechaIngreso:
          conductor.fechaIngreso?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
      });
    } else {
      resetForm();
    }
  }, [conductor, isOpen]);

  const resetForm = () => {
    setFormData({
      codigo: "",
      nombre: "",
      apellido: "",
      dni: "",
      telefono: "",
      licencia: "",
      vehiculoAsignado: "",
      estado: "activo",
      fechaIngreso: new Date().toISOString().split("T")[0],
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
      if (conductor) {
        await conductorService.update(conductor.id, formData);
        showSuccessAlert(
          "¡Conductor Actualizado!",
          "El conductor fue actualizado correctamente."
        );
      } else {
        await conductorService.create(formData);
        showSuccessAlert(
          "¡Conductor Creado!",
          "El conductor fue creado correctamente."
        );
      }
      onSuccess();
      onClose();
    } catch (error) {
      showErrorAlert(
        "Error",
        error.response?.data?.message || "No se pudo guardar el conductor"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
            {conductor ? "Editar Conductor" : "Nuevo Conductor"}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {conductor
              ? "Modifica los datos del conductor"
              : "Completa los datos para registrar un nuevo conductor"}
          </p>
        </div>

        {/* Form - Con scroll invisible */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-t-xl flex-1 overflow-y-auto scrollbar-hide"
        >
          <div className="p-6">
            {/* Sección: Información Personal */}
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Información Personal
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
                    placeholder="C001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    DNI <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    required
                    placeholder="12345678"
                    maxLength="20"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Juan"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                    placeholder="Pérez"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="987654321"
                    maxLength="20"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Licencia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="licencia"
                    value={formData.licencia}
                    onChange={handleChange}
                    required
                    placeholder="A-III-b"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Vehículo Asignado
                  </label>
                  <input
                    type="text"
                    name="vehiculoAsignado"
                    value={formData.vehiculoAsignado}
                    onChange={handleChange}
                    placeholder="VH0001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Fecha de Ingreso
                  </label>
                  <input
                    type="date"
                    name="fechaIngreso"
                    value={formData.fechaIngreso}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
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
                  : conductor
                  ? "Actualizar Conductor"
                  : "Guardar Conductor"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConductorModal;
