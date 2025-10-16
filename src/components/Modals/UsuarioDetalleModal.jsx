import { Calendar, Shield, User, X } from "lucide-react";

const UsuarioDetalleModal = ({ isOpen, onClose, usuario, roles }) => {
  if (!isOpen || !usuario) return null;

  const getRolNombre = (rolId) => {
    const rol = roles?.find((r) => r.id === rolId);
    return rol ? rol.nombre : "N/A";
  };

  const getActivoBadge = (activo) => {
    return activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

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
            Detalles del Usuario
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {usuario.nombre} {usuario.apellido}
          </p>
        </div>

        {/* Content - Con scroll invisible */}
        <div className="bg-white rounded-t-xl flex-1 overflow-y-auto scrollbar-hide p-6">
          {/* Sección: Información Personal */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gray-800 p-2 rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Información Personal
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  ID
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {usuario.id}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Nombre Completo
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {usuario.nombre} {usuario.apellido}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Email
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {usuario.email}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Teléfono
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {usuario.telefono || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Username
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {usuario.username}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Estado
                </label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getActivoBadge(
                    usuario.activo
                  )}`}
                >
                  ● {usuario.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </div>

          {/* Sección: Rol y Permisos */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gray-800 p-2 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Rol y Permisos
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Rol Asignado
                </label>
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {getRolNombre(usuario.rolId)}
                </span>
              </div>
            </div>
          </div>

          {/* Sección: Información Adicional */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gray-800 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Información Adicional
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Último Login
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {usuario.ultimoLogin
                    ? new Date(usuario.ultimoLogin).toLocaleString("es-PE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Nunca"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Fecha de Registro
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {usuario.createdAt
                    ? new Date(usuario.createdAt).toLocaleDateString("es-PE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuarioDetalleModal;
