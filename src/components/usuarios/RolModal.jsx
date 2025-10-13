import { useState, useEffect } from "react";
import { rolService } from "../../services/rolService";
import { showSuccessAlert, showErrorAlert } from "../../utils/sweetAlertConfig";
import { FiX } from "react-icons/fi";

const RolModal = ({ rol, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (rol) {
      setFormData({
        nombre: rol.nombre || "",
        descripcion: rol.descripcion || "",
      });
    }
  }, [rol]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.length > 50) {
      newErrors.nombre = "El nombre no puede exceder 50 caracteres";
    }

    if (formData.descripcion && formData.descripcion.length > 255) {
      newErrors.descripcion = "La descripción no puede exceder 255 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (rol) {
        await rolService.actualizarRol(rol.id, formData);
        showSuccessAlert(
          "¡Rol actualizado exitosamente!",
          "El rol se ha actualizado correctamente."
        );
      } else {
        await rolService.crearRol(formData);
        showSuccessAlert(
          "¡Rol creado exitosamente!",
          "El rol ha sido creado correctamente."
        );
      }
      onSuccess();
    } catch (error) {
      showErrorAlert("Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {rol ? "Editar Rol" : "Nuevo Rol"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.nombre ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="OPERADOR"
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.descripcion ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Descripción del rol"
            />
            {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : rol ? "Actualizar" : "Crear Rol"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RolModal;
