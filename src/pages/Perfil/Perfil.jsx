import { Camera, Lock, Mail, Phone, Save, User } from "lucide-react";
import { useState } from "react";
import { authService } from "../../services/authService";
import { showErrorAlert, showSuccessAlert } from "../../utils/alerts";

const Perfil = () => {
  const [activeTab, setActiveTab] = useState("perfil"); // perfil | seguridad
  const [loading, setLoading] = useState(false);

  const [perfilData, setPerfilData] = useState({
    nombre: authService.getUserName() || "Admin",
    apellido: "Sistema",
    email: "admin@hinoconnect.com",
    telefono: "+51 999 999 999",
    rol: authService.getUserRole() || "Administrador",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePerfilChange = (e) => {
    const { name, value } = e.target;
    setPerfilData({
      ...perfilData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleSavePerfil = async () => {
    setLoading(true);
    try {
      // Aquí iría la llamada al backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccessAlert(
        "¡Perfil Actualizado!",
        "Tus datos se actualizaron correctamente."
      );
    } catch (error) {
      showErrorAlert("Error", "No se pudo actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showErrorAlert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showErrorAlert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      // Aquí iría la llamada al backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccessAlert(
        "¡Contraseña Actualizada!",
        "Tu contraseña se cambió correctamente."
      );
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showErrorAlert("Error", "No se pudo cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500 p-3 rounded-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
            <p className="text-gray-600">Administra tu información personal</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Avatar y Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {perfilData.nombre.charAt(0)}
                  {perfilData.apellido.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-800">
                {perfilData.nombre} {perfilData.apellido}
              </h3>
              <p className="text-gray-600">{perfilData.rol}</p>
              <div className="mt-4 w-full space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  {perfilData.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  {perfilData.telefono}
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Sesiones Activas:</span>
                <span className="font-medium text-gray-900">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Último Acceso:</span>
                <span className="font-medium text-gray-900">Hoy</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cuenta Creada:</span>
                <span className="font-medium text-gray-900">Ene 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("perfil")}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === "perfil"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Información Personal
              </button>
              <button
                onClick={() => setActiveTab("seguridad")}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === "seguridad"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Seguridad
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === "perfil" ? (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Información Personal
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={perfilData.nombre}
                      onChange={handlePerfilChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      value={perfilData.apellido}
                      onChange={handlePerfilChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={perfilData.email}
                    onChange={handlePerfilChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={perfilData.telefono}
                    onChange={handlePerfilChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <input
                    type="text"
                    value={perfilData.rol}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>

                <button
                  onClick={handleSavePerfil}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Cambiar Contraseña
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña Actual
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Requisitos de contraseña:</strong>
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Mínimo 6 caracteres</li>
                    <li>
                      • Se recomienda usar mayúsculas, minúsculas y números
                    </li>
                    <li>• Evita usar información personal</li>
                  </ul>
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-5 h-5" />
                  {loading ? "Cambiando..." : "Cambiar Contraseña"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
