import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { rolService } from "../../services/rolService";
import { showErrorAlert, showSuccessAlert } from "../../utils/alerts";

const RolModal = ({ isOpen, onClose, rol, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rol) {
      setFormData(rol);
    } else {
      resetForm();
    }
  }, [rol, isOpen]);

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (rol) {
        await rolService.update(rol.id, formData);
        showSuccessAlert(
          "¡Rol Actualizado!",
          "El rol fue actualizado correctamente."
        );
      } else {
        await rolService.create(formData);
        showSuccessAlert("¡Rol Creado!", "El rol fue creado correctamente.");
      }
      onSuccess();
      onClose();
    } catch (error) {
      showErrorAlert(
        "Error",
        error.response?.data?.message || "No se pudo guardar el rol"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Fijo */}
        <div className="p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-white">
            {rol ? "Editar Rol" : "Nuevo Rol"}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {rol
              ? "Modifica los datos del rol"
              : "Completa los datos para crear un nuevo rol"}
          </p>
        </div>

        {/* Form - Con scroll invisible */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-t-xl flex-1 overflow-y-auto scrollbar-hide"
        >
          <div className="p-6">
            {/* Sección: Información del Rol */}
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Información del Rol
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Nombre del Rol <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Administrador, Operador, Supervisor"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe las responsabilidades y permisos de este rol..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 font-medium"
              >
                {loading
                  ? "Guardando..."
                  : rol
                  ? "Actualizar Rol"
                  : "Guardar Rol"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RolModal;
