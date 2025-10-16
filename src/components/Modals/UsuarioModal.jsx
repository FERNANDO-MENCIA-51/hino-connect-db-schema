import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { rolService } from "../../services/rolService";
import { usuarioService } from "../../services/usuarioService";
import { showErrorAlert, showSuccessAlert } from "../../utils/alerts";

const UsuarioModal = ({ isOpen, onClose, usuario, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    username: "",
    password: "",
    rolId: "",
    activo: true,
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRoles();
    }
    if (usuario) {
      setFormData({
        ...usuario,
        password: "", // No mostrar password en edición
      });
    } else {
      resetForm();
    }
  }, [usuario, isOpen]);

  const loadRoles = async () => {
    try {
      const data = await rolService.getAll();
      setRoles(data || []);
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      username: "",
      password: "",
      rolId: "",
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
      const dataToSend = {
        ...formData,
        rolId: parseInt(formData.rolId),
      };

      // Si es edición y no se cambió el password, no enviarlo
      if (usuario && !dataToSend.password) {
        delete dataToSend.password;
      }

      if (usuario) {
        await usuarioService.update(usuario.id, dataToSend);
        showSuccessAlert(
          "¡Usuario Actualizado!",
          "El usuario fue actualizado correctamente."
        );
      } else {
        await usuarioService.create(dataToSend);
        showSuccessAlert(
          "¡Usuario Creado!",
          "El usuario fue creado correctamente."
        );
      }
      onSuccess();
      onClose();
    } catch (error) {
      showErrorAlert(
        "Error",
        error.response?.data?.message || "No se pudo guardar el usuario"
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
            {usuario ? "Editar Usuario" : "Nuevo Usuario"}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {usuario
              ? "Modifica los datos del usuario"
              : "Completa los datos para crear un nuevo usuario"}
          </p>
        </div>

        {/* Form - Con scroll invisible */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-t-xl flex-1 overflow-y-auto scrollbar-hide"
        >
          <div className="p-6">
            {/* Sección: Credenciales de Acceso */}
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
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Credenciales de Acceso
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Ej: jperez"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Password{" "}
                    {!usuario && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!usuario}
                    placeholder={
                      usuario ? "Dejar vacío para no cambiar" : "Password@123"
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo 8 caracteres, incluir mayúsculas y números
                  </p>
                </div>
              </div>
            </div>

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
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="juan@hinoconnect.com"
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
                    placeholder="+51 999 888 777"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Rol y Permisos */}
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
                  Rol y Permisos
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Rol <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="rolId"
                    value={formData.rolId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">
                      Seleccione una persona asociada a este usuario
                    </option>
                    {roles.map((rol) => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Seleccione la persona asociada a este usuario
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    name="activo"
                    value={formData.activo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={true}>Activo</option>
                    <option value={false}>Inactivo</option>
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
                  : usuario
                  ? "Actualizar Usuario"
                  : "Registrar"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioModal;
