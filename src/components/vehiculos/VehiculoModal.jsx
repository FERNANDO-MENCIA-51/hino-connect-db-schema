import { useState, useEffect } from "react";
import { vehiculoService } from "../../services/vehiculoService";
import { showSuccessAlert, showErrorAlert } from "../../utils/sweetAlertConfig";
import { FiX, FiCheck, FiImage } from "react-icons/fi";

const VehiculoModal = ({ vehiculo, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    codigo: "",
    placa: "",
    marca: "",
    modelo: "",
    tipo: "",
    anioFabricacion: new Date().getFullYear(),
    numeroChasis: "",
    capacidadCarga: "",
    combustible: "",
    estadoActual: "Disponible",
    imagenUrl: "",
    activo: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Opciones para los select
  const tiposVehiculo = ["Camión", "Furgón", "Volquete", "Grúa", "Remolque", "Otro"];
  const tiposCombustible = ["Diesel", "Gasolina", "Gas Natural", "Eléctrico", "Híbrido", "Otro"];
  const estadosVehiculo = ["En operación", "En mantenimiento", "Disponible", "Inactivo"];
  const marcasVehiculo = ["Hino", "Isuzu", "Mitsubishi", "Nissan", "Toyota", "Ford", "Chevrolet", "Volvo", "Mercedes-Benz", "Otro"];

  useEffect(() => {
    if (vehiculo) {
      setFormData({
        codigo: vehiculo.codigo || "",
        placa: vehiculo.placa || "",
        marca: vehiculo.marca || "",
        modelo: vehiculo.modelo || "",
        tipo: vehiculo.tipo || "",
        anioFabricacion: vehiculo.anioFabricacion || new Date().getFullYear(),
        numeroChasis: vehiculo.numeroChasis || "",
        capacidadCarga: vehiculo.capacidadCarga || "",
        combustible: vehiculo.combustible || "",
        estadoActual: vehiculo.estadoActual || "Disponible",
        imagenUrl: vehiculo.imagenUrl || "",
        activo: vehiculo.activo !== undefined ? vehiculo.activo : true,
      });
    }
  }, [vehiculo]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.codigo.trim()) newErrors.codigo = "El código es requerido";
    else if (formData.codigo.length > 20) newErrors.codigo = "Máximo 20 caracteres";

    if (!formData.placa.trim()) newErrors.placa = "La placa es requerida";
    else if (formData.placa.length > 10) newErrors.placa = "Máximo 10 caracteres";

    if (!formData.marca.trim()) newErrors.marca = "La marca es requerida";
    if (!formData.modelo.trim()) newErrors.modelo = "El modelo es requerido";
    if (!formData.tipo.trim()) newErrors.tipo = "El tipo es requerido";

    if (!formData.anioFabricacion) newErrors.anioFabricacion = "El año es requerido";
    else if (formData.anioFabricacion < 1900 || formData.anioFabricacion > new Date().getFullYear() + 1)
      newErrors.anioFabricacion = "Año inválido";

    if (!formData.numeroChasis.trim()) newErrors.numeroChasis = "El número de chasis es requerido";
    if (!formData.capacidadCarga) newErrors.capacidadCarga = "Capacidad de carga requerida";
    else if (isNaN(formData.capacidadCarga) || parseFloat(formData.capacidadCarga) <= 0)
      newErrors.capacidadCarga = "Debe ser un número mayor a 0";

    if (!formData.combustible.trim()) newErrors.combustible = "El tipo de combustible es requerido";
    if (!formData.estadoActual.trim()) newErrors.estadoActual = "El estado actual es requerido";

    if (formData.imagenUrl && !isValidUrl(formData.imagenUrl))
      newErrors.imagenUrl = "La URL no es válida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
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
        placa: formData.placa.trim().toUpperCase(),
        marca: formData.marca.trim(),
        modelo: formData.modelo.trim(),
        tipo: formData.tipo,
        anioFabricacion: parseInt(formData.anioFabricacion),
        numeroChasis: formData.numeroChasis.trim(),
        capacidadCarga: parseFloat(formData.capacidadCarga),
        combustible: formData.combustible,
        estadoActual: formData.estadoActual,
        imagenUrl: formData.imagenUrl.trim() || null,
        activo: formData.activo,
      };

      console.log("📝 Datos del formulario:", formData);
      console.log("📝 Datos a enviar:", dataToSend);
      console.log("📝 Estado actual seleccionado:", formData.estadoActual);

      if (vehiculo) {
        console.log("📝 Actualizando vehículo ID:", vehiculo.id);
        await vehiculoService.actualizarVehiculo(vehiculo.id, dataToSend);
        showSuccessAlert("¡Vehículo actualizado!", "El vehículo fue actualizado correctamente.");
      } else {
        console.log("📝 Creando nuevo vehículo");
        await vehiculoService.crearVehiculo(dataToSend);
        showSuccessAlert("¡Vehículo creado!", "Se ha registrado correctamente el vehículo.");
      }

      onSuccess();
    } catch (error) {
      showErrorAlert("Error", error.message || "Ocurrió un error al guardar el vehículo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {vehiculo ? "Editar Vehículo" : "Nuevo Vehículo"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiCheck className="text-green-600" /> Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "codigo", label: "Código", type: "text", placeholder: "VH001" },
                { name: "placa", label: "Placa", type: "text", placeholder: "ABC-123" },
                { name: "modelo", label: "Modelo", type: "text", placeholder: "300" },
                { name: "numeroChasis", label: "Número de Chasis", type: "text", placeholder: "HINO123456789" },
              ].map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} <span className="text-red-500">*</span>
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

          {/* Especificaciones */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiCheck className="text-blue-600" /> Especificaciones Técnicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Marca */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca <span className="text-red-500">*</span>
                </label>
                <select 
                  name="marca" 
                  value={formData.marca} 
                  onChange={handleChange} 
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.marca ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Seleccionar marca</option>
                  {marcasVehiculo.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                {errors.marca && <p className="text-red-500 text-xs mt-1">{errors.marca}</p>}
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo <span className="text-red-500">*</span>
                </label>
                <select 
                  name="tipo" 
                  value={formData.tipo} 
                  onChange={handleChange} 
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.tipo ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposVehiculo.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                {errors.tipo && <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>}
              </div>

              {/* Año de fabricación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Año de Fabricación <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="anioFabricacion"
                  value={formData.anioFabricacion}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.anioFabricacion ? "border-red-500" : "border-gray-300"
                  }`}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
                {errors.anioFabricacion && <p className="text-red-500 text-xs mt-1">{errors.anioFabricacion}</p>}
              </div>

              {/* Capacidad de carga */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidad de Carga (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="capacidadCarga"
                  value={formData.capacidadCarga}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.capacidadCarga ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="5000.00"
                  step="0.01"
                />
                {errors.capacidadCarga && <p className="text-red-500 text-xs mt-1">{errors.capacidadCarga}</p>}
              </div>

              {/* Combustible */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Combustible <span className="text-red-500">*</span>
                </label>
                <select 
                  name="combustible" 
                  value={formData.combustible} 
                  onChange={handleChange} 
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.combustible ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Seleccionar combustible</option>
                  {tiposCombustible.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                {errors.combustible && <p className="text-red-500 text-xs mt-1">{errors.combustible}</p>}
              </div>

              {/* Estado actual */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado Actual <span className="text-red-500">*</span>
                </label>
                <select 
                  name="estadoActual" 
                  value={formData.estadoActual} 
                  onChange={handleChange} 
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.estadoActual ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {estadosVehiculo.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
                {errors.estadoActual && <p className="text-red-500 text-xs mt-1">{errors.estadoActual}</p>}
              </div>
            </div>
          </div>

          {/* Imagen y estado */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiImage className="text-purple-600" /> Imagen y Estado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* URL de imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de Imagen
                </label>
                <input
                  type="url"
                  name="imagenUrl"
                  value={formData.imagenUrl}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.imagenUrl ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://example.com/imagen.jpg"
                />
                {errors.imagenUrl && <p className="text-red-500 text-xs mt-1">{errors.imagenUrl}</p>}
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
                  Vehículo Activo
                </label>
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
              {loading ? "Guardando..." : vehiculo ? "Actualizar" : "Crear Vehículo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehiculoModal;
