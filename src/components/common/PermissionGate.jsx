import { useAuth } from '../../context/AuthContext';

/**
 * Componente para mostrar/ocultar elementos basado en permisos
 */
const PermissionGate = ({
  children,
  permission = null,
  permissions = null,
  role = null,
  roles = null,
  requireAll = true,
  fallback = null,
  inverse = false
}) => {
  const { hasPermission, hasRole, hasAnyRole } = useAuth();

  let hasAccess = true;

  // Verificar permiso único
  if (permission) {
    hasAccess = hasPermission(permission);
  }

  // Verificar múltiples permisos
  if (permissions && permissions.length > 0) {
    if (requireAll) {
      hasAccess = permissions.every(perm => hasPermission(perm));
    } else {
      hasAccess = permissions.some(perm => hasPermission(perm));
    }
  }

  // Verificar rol único
  if (role) {
    hasAccess = hasAccess && hasRole(role);
  }

  // Verificar múltiples roles
  if (roles && roles.length > 0) {
    hasAccess = hasAccess && hasAnyRole(roles);
  }

  // Invertir lógica si se especifica
  if (inverse) {
    hasAccess = !hasAccess;
  }

  // Renderizar según el acceso
  if (hasAccess) {
    return children;
  }

  return fallback;
};

/**
 * Componente específico para botones con permisos
 */
export const PermissionButton = ({
  children,
  permission,
  permissions,
  role,
  roles,
  requireAll = true,
  disabled = false,
  disabledTitle = "No tienes permisos para esta acción",
  className = "",
  ...props
}) => {
  const { hasPermission, hasRole, hasAnyRole } = useAuth();

  let hasAccess = true;

  if (permission) {
    hasAccess = hasPermission(permission);
  }

  if (permissions && permissions.length > 0) {
    if (requireAll) {
      hasAccess = permissions.every(perm => hasPermission(perm));
    } else {
      hasAccess = permissions.some(perm => hasPermission(perm));
    }
  }

  if (role) {
    hasAccess = hasAccess && hasRole(role);
  }

  if (roles && roles.length > 0) {
    hasAccess = hasAccess && hasAnyRole(roles);
  }

  const isDisabled = disabled || !hasAccess;
  const buttonClassName = `${className} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <button
      {...props}
      disabled={isDisabled}
      title={!hasAccess ? disabledTitle : props.title}
      className={buttonClassName}
    >
      {children}
    </button>
  );
};

/**
 * Componente para mostrar información de permisos en desarrollo
 */
export const PermissionDebug = ({ showInProduction = false }) => {
  const { user } = useAuth();
  
  // Solo mostrar en desarrollo a menos que se especifique lo contrario
  if (process.env.NODE_ENV === 'production' && !showInProduction) {
    return null;
  }

  if (!user) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded-lg p-3 text-xs">
        <strong>Debug:</strong> Usuario no autenticado
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-3 text-xs max-w-xs">
      <div className="font-semibold mb-2">Debug - Permisos de Usuario</div>
      <div><strong>Usuario:</strong> {user.nombre}</div>
      <div><strong>Rol:</strong> {user.rol}</div>
      <div className="mt-2">
        <strong>Permisos ({user.permissions?.length || 0}):</strong>
        <div className="max-h-32 overflow-y-auto mt-1">
          {user.permissions?.map((permission, index) => (
            <div key={index} className="text-xs text-gray-600">
              • {permission}
            </div>
          )) || <div className="text-gray-500">Sin permisos</div>}
        </div>
      </div>
    </div>
  );
};

export default PermissionGate;