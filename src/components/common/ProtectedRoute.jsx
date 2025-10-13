import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, Lock, UserX } from 'lucide-react';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredPermission = null,
  requiredRoles = null,
  requiredPermissions = null,
  fallbackPath = '/login',
  showUnauthorized = true 
}) => {
  const { user, isAuthenticated, hasRole, hasPermission, hasAnyRole, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Verificar si el usuario está autenticado
  if (!isAuthenticated()) {
    console.log('🔒 Usuario no autenticado, redirigiendo al login');
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Verificar rol específico
  if (requiredRole && !hasRole(requiredRole)) {
    console.log(`🚫 Acceso denegado: se requiere rol "${requiredRole}", usuario tiene "${user?.rol}"`);
    
    if (showUnauthorized) {
      return <UnauthorizedPage requiredRole={requiredRole} userRole={user?.rol} />;
    }
    
    return <Navigate to="/dashboard" replace />;
  }

  // Verificar múltiples roles (el usuario debe tener al menos uno)
  if (requiredRoles && requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    console.log(`🚫 Acceso denegado: se requiere uno de los roles [${requiredRoles.join(', ')}], usuario tiene "${user?.rol}"`);
    
    if (showUnauthorized) {
      return <UnauthorizedPage requiredRoles={requiredRoles} userRole={user?.rol} />;
    }
    
    return <Navigate to="/dashboard" replace />;
  }

  // Verificar permiso específico
  if (requiredPermission && !hasPermission(requiredPermission)) {
    console.log(`🚫 Acceso denegado: se requiere permiso "${requiredPermission}"`);
    
    if (showUnauthorized) {
      return <UnauthorizedPage requiredPermission={requiredPermission} />;
    }
    
    return <Navigate to="/dashboard" replace />;
  }

  // Verificar múltiples permisos (el usuario debe tener todos)
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission));
    
    if (!hasAllPermissions) {
      const missingPermissions = requiredPermissions.filter(permission => !hasPermission(permission));
      console.log(`🚫 Acceso denegado: faltan permisos [${missingPermissions.join(', ')}]`);
      
      if (showUnauthorized) {
        return <UnauthorizedPage requiredPermissions={requiredPermissions} />;
      }
      
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Si todas las verificaciones pasan, renderizar el componente
  console.log('✅ Acceso autorizado para:', user?.nombre, `(${user?.rol})`);
  return children;
};

// Componente para mostrar página de acceso no autorizado
const UnauthorizedPage = ({ 
  requiredRole, 
  requiredRoles, 
  requiredPermission, 
  requiredPermissions, 
  userRole 
}) => {
  const { logout } = useAuth();

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso Denegado
          </h1>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta página
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
            <UserX className="w-4 h-4" />
            <span className="font-medium">Tu rol actual:</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
              {userRole}
            </span>
          </div>
          
          {requiredRole && (
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="font-medium">Rol requerido:</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                {requiredRole}
              </span>
            </div>
          )}
          
          {requiredRoles && requiredRoles.length > 0 && (
            <div className="text-sm text-gray-700 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="font-medium">Roles requeridos (cualquiera):</span>
              </div>
              <div className="flex flex-wrap gap-1 ml-6">
                {requiredRoles.map((role, index) => (
                  <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {requiredPermission && (
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="font-medium">Permiso requerido:</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                {requiredPermission}
              </span>
            </div>
          )}
          
          {requiredPermissions && requiredPermissions.length > 0 && (
            <div className="text-sm text-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="font-medium">Permisos requeridos:</span>
              </div>
              <div className="flex flex-wrap gap-1 ml-6">
                {requiredPermissions.map((permission, index) => (
                  <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoToDashboard}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Ir al Dashboard
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Volver Atrás
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Si crees que esto es un error, contacta al administrador del sistema.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;