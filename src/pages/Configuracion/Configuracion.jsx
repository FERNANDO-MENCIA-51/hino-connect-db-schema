/* eslint-disable no-unused-vars */
import { RefreshCw, Save, Settings } from "lucide-react";
import { useState } from "react";
import { showErrorAlert, showSuccessAlert } from "../../utils/alerts";

const Configuracion = () => {
  const [config, setConfig] = useState({
    nombreEmpresa: "HINO Connect",
    emailContacto: "contacto@hinoconnect.com",
    telefonoContacto: "+51 999 999 999",
    direccion: "Av. Principal 123, Lima, Perú",
    maxVelocidadCarretera: "90",
    tiempoMaximoConduccion: "8",
    notificacionesEmail: true,
    notificacionesSMS: false,
    mantenimientoAutomatico: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig({
      ...config,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Aquí iría la llamada al backend para guardar la configuración
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulación
      showSuccessAlert(
        "¡Configuración Guardada!",
        "Los cambios se guardaron correctamente."
      );
    } catch (error) {
      showErrorAlert("Error", "No se pudo guardar la configuración");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConfig({
      nombreEmpresa: "HINO Connect",
      emailContacto: "contacto@hinoconnect.com",
      telefonoContacto: "+51 999 999 999",
      direccion: "Av. Principal 123, Lima, Perú",
      maxVelocidadCarretera: "90",
      tiempoMaximoConduccion: "8",
      notificacionesEmail: true,
      notificacionesSMS: false,
      mantenimientoAutomatico: true,
    });
    showSuccessAlert(
      "Configuración Restablecida",
      "Se restauraron los valores por defecto."
    );
  };

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>
            <p className="text-gray-600">
              Administra la configuración del sistema
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información de la Empresa */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Información de la Empresa
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Empresa
              </label>
              <input
                type="text"
                name="nombreEmpresa"
                value={config.nombreEmpresa}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de Contacto
              </label>
              <input
                type="email"
                name="emailContacto"
                value={config.emailContacto}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                name="telefonoContacto"
                value={config.telefonoContacto}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <textarea
                name="direccion"
                value={config.direccion}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Configuración de Operaciones */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Configuración de Operaciones
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Velocidad Máxima en Carretera (km/h)
              </label>
              <input
                type="number"
                name="maxVelocidadCarretera"
                value={config.maxVelocidadCarretera}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo Máximo de Conducción (horas)
              </label>
              <input
                type="number"
                name="tiempoMaximoConduccion"
                value={config.tiempoMaximoConduccion}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Notificaciones
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">
                  Notificaciones por Email
                </p>
                <p className="text-sm text-gray-600">
                  Recibir alertas por correo electrónico
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="notificacionesEmail"
                  checked={config.notificacionesEmail}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">
                  Notificaciones por SMS
                </p>
                <p className="text-sm text-gray-600">
                  Recibir alertas por mensaje de texto
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="notificacionesSMS"
                  checked={config.notificacionesSMS}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">
                  Mantenimiento Automático
                </p>
                <p className="text-sm text-gray-600">
                  Programar mantenimientos automáticamente
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="mantenimientoAutomatico"
                  checked={config.mantenimientoAutomatico}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Información del Sistema */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Información del Sistema
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Versión:</span>
              <span className="font-medium text-gray-900">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Última Actualización:</span>
              <span className="font-medium text-gray-900">
                {new Date().toLocaleDateString("es-PE")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Base de Datos:</span>
              <span className="font-medium text-green-600">Conectada</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado del Sistema:</span>
              <span className="font-medium text-green-600">Operativo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleReset}
          className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Restablecer
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
};

export default Configuracion;
