import { useState, useEffect } from "react";
import { conductoresService } from "../../services/conductoresService";
import { showSuccessAlert, showErrorAlert } from "../../utils/sweetAlertConfig";
import { FiX, FiCheck, FiUser } from "react-icons/fi";

const ConductorModal = ({ conductor, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    licencia: "",
    fechaIngreso: new Date().toISOString().split('T')[0],
    estado: "Activo",
    direccion: "",
    contactoEmergencia: "",
    observaciones: "",
    activo: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Opciones para los select
  const estadosConductor = ["Activo", "Inactivo", "En viaje", "Descanso"];

  useEffect(() => {
    if (conductor) {
      setFormData({
        codigo: conductor.codigo || "",
        nombre: conductor.nombre || "",
        apellido: conductor.apellido || "",
        dni: conductor.dni || "",
        telefono: conductor.telefono || "",
        email: conductor.email || "",
        licencia: conductor.licencia || "",
        fechaIngreso: conductor.fechaIngreso ? conductor.fechaIngreso.split('T')[0] : new Date().toISOString().split('T')[0],
        estado: conductor.estado || "Activo",
        direccion: conductor.direccion || "",
        contactoEmergencia: conductor.contactoEmergencia || "",
        observaciones: conductor.observaciones || "",
        activo: conductor.activo !== undefined ? conductor.activo : true,
      });
    }
  }, [conductor]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.codigo.trim()) newErrors.codigo = "El código es requerido";
    else if (formData.codigo.length > 20) newErrors.codigo = "Máximo 20 caracteres";

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    else if (formData.nombre.length > 50) newErrors.nombre = "Máximo 50 caracteres";

    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es requerido";
    else if (formData.apellido.length > 50) newErrors.apellido = "Máximo 50 caracteres";

    if (!formData.dni.trim()) newErrors.dni = "El DNI es requerido";
    else if (!/^\d{8}$/.test(formData.dni)) newErrors.dni = "El DNI debe tener 8 dígitos";

    if (!formData.licencia.trim()) newErrors.licencia = "La licencia es requerida";

    if (formData.telefono && !/^\d{9}$/.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = "El teléfono debe tener 9 dígitos";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de email inválido";
    }

    if (!formData.fechaIngreso) newErrors.fechaIngreso = "La fecha de ingreso es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dataToSend = {
        codigo: formData.codigo.trim(),
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        dni: formData.dni.trim(),
        telefono: formData.telefono.trim() || null,
        email: formData.email.trim() || null,
        licencia: formData.licencia.trim(),
        fechaIngreso: formData.fechaIngreso,
        estado: formData.estado,
        direccion: formData.direccion.trim() || null,
        contactoEmergencia: formData.contactoEmergencia.trim() || null,
        observaciones: formData.observaciones.trim() || null,
        activo: formData.activo,
      };

      if (conductor) {
        await conductoresService.actualizarConductor(conductor.id, dataToSend);
        showSuccessAlert("¡Conductor actualizado!", "El conductor fue actualizado correctamente.");
      } else {
        await conductoresService.crearConductor(dataToSend);
        showSuccessAlert("¡Conductor creado!", "Se ha registrado correctamente el conductor.");
      }

      onSuccess();
    } catch (error) {
      showErrorAlert("Error", error.message || "Ocurrió un error al guardar el conductor.");
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
            {conductor ? "Editar Conductor" : "Nuevo Conductor"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Personal */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiUser className="text-blue-600" /> Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "codigo", label: "Código", type: "text", placeholder: "C001", required: true },
                { name: "dni", label: "DNI", type: "text", placeholder: "12345678", required: true },
                { name: "nombre", label: "Nombre", type: "text", placeholder: "Juan", required: true },
                { name: "apellido", label: "Apellido", type: "text", placeholder: "Pérez", required: true },
                { name: "telefono", label: "Teléfono", type: "text", placeholder: "987654321" },
                { name: "email", label: "Email", type: "email", placeholder: "juan@example.com" },
              ].map(({ name, label, type, placeholder, required }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors[name] ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={placeholder}
                  />
                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Información Laboral */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiCheck className="text-green-600" /> Información Laboral
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Licencia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Licencia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="licencia"
                  value={formData.licencia}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.licencia ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="A2B"
                />
                {errors.licencia && <p className="text-red-500 text-xs mt-1">{errors.licencia}</p>}
              </div>

              {/* Fecha de Ingreso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Ingreso <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fechaIngreso"
                  value={formData.fechaIngreso}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.fechaIngreso ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.fechaIngreso && <p className="text-red-500 text-xs mt-1">{errors.fechaIngreso}</p>}
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado <span className="text-red-500">*</span>
                </label>
                <select 
                  name="estado" 
                  value={formData.estado} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {estadosConductor.map((estado) => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>

              {/* Estado activo */}
              <div className="flex items-center justify-center">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input 
                    type="checkbox" 
                    name="activo" 
                    checked={formData.activo} 
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  Conductor Activo
                </label>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Adicional</h3>
            <div className="space-y-4">
              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Av. Principal 123, Lima"
                />
              </div>

              {/* Contacto de Emergencia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contacto de Emergencia
                </label>
                <input
                  type="text"
                  name="contactoEmergencia"
                  value={formData.contactoEmergencia}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="María Pérez - 987654321"
                />
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Notas adicionales sobre el conductor..."
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Guardando..." : conductor ? "Actualizar" : "Crear Conductor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConductorModal;