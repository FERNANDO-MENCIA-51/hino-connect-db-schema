import { useState, useEffect } from "react";
import { usuarioService } from "../../services/usuarioService";
import { showSuccessAlert, showErrorAlert } from "../../utils/sweetAlertConfig";
import { FiX, FiEye, FiEyeOff, FiCheck, FiX as FiXIcon } from "react-icons/fi";

const UsuarioModal = ({ usuario, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    passwordHash: "",
    confirmPassword: "",
    nombre: "",
    apellido: "",
    telefono: "",
    rolId: 2,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (usuario) {
      setFormData({
        email: usuario.email || "",
        passwordHash: "",
        confirmPassword: "",
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        telefono: usuario.telefono || "",
        rolId: usuario.rolId || 2,
      });
    }
  }, [usuario]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!usuario && !formData.passwordHash) {
      newErrors.passwordHash = "La contraseña es requerida";
    } else if (formData.passwordHash && formData.passwordHash.length < 6) {
      newErrors.passwordHash = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!usuario && !formData.confirmPassword) {
      newErrors.confirmPassword = "Debes confirmar la contraseña";
    } else if (formData.passwordHash !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.nombre) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = "El nombre no puede exceder 100 caracteres";
    }

    if (!formData.apellido) {
      newErrors.apellido = "El apellido es requerido";
    } else if (formData.apellido.length > 100) {
      newErrors.apellido = "El apellido no puede exceder 100 caracteres";
    }

    if (formData.telefono && formData.telefono.length > 20) {
      newErrors.telefono = "El teléfono no puede exceder 20 caracteres";
    }

    if (!formData.rolId) {
      newErrors.rolId = "El rol es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Limpiar error del campo
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
      // Preparar datos para enviar
      const dataToSend = { 
        email: formData.email,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        rolId: formData.rolId,
        activo: true // Siempre activo por defecto
      };
      
      // Agregar contraseña solo si se proporcionó
      if (formData.passwordHash) {
        dataToSend.passwordHash = formData.passwordHash;
      }

      if (usuario) {
        await usuarioService.actualizarUsuario(usuario.id, dataToSend);
        showSuccessAlert(
          "¡Registro actualizado exitosamente!",
          "El registro se ha actualizado correctamente. Verás los cambios en el listado."
        );
      } else {
        await usuarioService.crearUsuario(dataToSend);
        showSuccessAlert(
          "¡Registro creado exitosamente!",
          "¡Genial! Tu registro ha sido completado. Tu registro se ha actualizado correctamente."
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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {usuario ? "Editar Usuario" : "Nuevo Usuario"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Juan"
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.apellido ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Pérez"
              />
              {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="usuario@hinoconnect.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña {!usuario && <span className="text-red-500">*</span>}
              {usuario && <span className="text-gray-500 text-xs">(dejar vacío para mantener la actual)</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="passwordHash"
                value={formData.passwordHash}
                onChange={handleChange}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.passwordHash ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.passwordHash && <p className="text-red-500 text-xs mt-1">{errors.passwordHash}</p>}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña {!usuario && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formData.confirmPassword && formData.passwordHash !== formData.confirmPassword
                    ? "border-red-500"
                    : formData.confirmPassword && formData.passwordHash === formData.confirmPassword
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
                placeholder="Repite la contraseña"
              />
              {formData.confirmPassword && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {formData.passwordHash === formData.confirmPassword ? (
                    <FiCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <FiXIcon className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {formData.confirmPassword && formData.passwordHash !== formData.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Las contraseñas no coinciden</p>
            )}
            {formData.confirmPassword && formData.passwordHash === formData.confirmPassword && (
              <p className="text-green-500 text-xs mt-1">Las contraseñas coinciden ✓</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.telefono ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="987654321"
              />
              {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                name="rolId"
                value={formData.rolId}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.rolId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar rol</option>
                <option value={1}>Administrador</option>
                <option value={2}>Usuario</option>
                <option value={3}>Supervisor</option>
              </select>
              {errors.rolId && <p className="text-red-500 text-xs mt-1">{errors.rolId}</p>}
            </div>
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
              {loading ? "Guardando..." : usuario ? "Actualizar" : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioModal;
