import { useAuth } from '../context/AuthContext';

/**
 * Hook personalizado para verificar permisos de forma más conveniente
 */
export const usePermissions = () => {
  const { hasPermission, hasRole, hasAnyRole, user } = useAuth();

  /**
   * Verifica si el usuario puede realizar una acción específica
   * @param {string} action - La acción a verificar (create, edit, delete, view, etc.)
   * @param {string} resource - El recurso sobre el que se quiere actuar (users, vehicles, etc.)
   * @returns {boolean}
   */
  const canPerform = (action, resource) => {
    const permission = `${resource}.${action}`;
    return hasPermission(permission);
  };

  /**
   * Verifica múltiples permisos a la vez
   * @param {string[]} permissions - Array de permisos a verificar
   * @param {boolean} requireAll - Si true, requiere todos los permisos. Si false, requiere al menos uno
   * @returns {boolean}
   */
  const canPerformMultiple = (permissions, requireAll = true) => {
    if (requireAll) {
      return permissions.every(permission => hasPermission(permission));
    } else {
      return permissions.some(permission => hasPermission(permission));
    }
  };

  /**
   * Verifica si el usuario puede acceder a un módulo específico
   * @param {string} module - El módulo a verificar
   * @returns {boolean}
   */
  const canAccessModule = (module) => {
    return hasPermission(`${module}.view`);
  };

  /**
   * Obtiene todos los módulos a los que el usuario tiene acceso
   * @returns {string[]}
   */
  const getAccessibleModules = () => {
    const modules = ['dashboard', 'roles', 'users', 'drivers', 'vehicles', 'movements', 'reports', 'config', 'audit'];
    return modules.filter(module => canAccessModule(module));
  };

  /**
   * Verifica si el usuario es administrador
   * @returns {boolean}
   */
  const isAdmin = () => {
    return hasRole('Administrador');
  };

  /**
   * Verifica si el usuario es supervisor o administrador
   * @returns {boolean}
   */
  const isSupervisorOrAdmin = () => {
    return hasAnyRole(['Administrador', 'Supervisor']);
  };

  /**
   * Verifica si el usuario puede gestionar otros usuarios
   * @returns {boolean}
   */
  const canManageUsers = () => {
    return hasPermission('users.create') || hasPermission('users.edit') || hasPermission('users.delete');
  };

  /**
   * Verifica si el usuario puede ver datos sensibles
   * @returns {boolean}
   */
  const canViewSensitiveData = () => {
    return hasAnyRole(['Administrador', 'Supervisor']);
  };

  /**
   * Verifica si el usuario puede realizar operaciones de restauración
   * @param {string} resource - El recurso a restaurar
   * @returns {boolean}
   */
  const canRestore = (resource) => {
    return hasPermission(`${resource}.restore`);
  };

  /**
   * Verifica si el usuario puede eliminar registros
   * @param {string} resource - El recurso a eliminar
   * @returns {boolean}
   */
  const canDelete = (resource) => {
    return hasPermission(`${resource}.delete`);
  };

  /**
   * Verifica si el usuario puede crear registros
   * @param {string} resource - El recurso a crear
   * @returns {boolean}
   */
  const canCreate = (resource) => {
    return hasPermission(`${resource}.create`);
  };

  /**
   * Verifica si el usuario puede editar registros
   * @param {string} resource - El recurso a editar
   * @returns {boolean}
   */
  const canEdit = (resource) => {
    return hasPermission(`${resource}.edit`);
  };

  /**
   * Verifica si el usuario puede ver registros
   * @param {string} resource - El recurso a ver
   * @returns {boolean}
   */
  const canView = (resource) => {
    return hasPermission(`${resource}.view`);
  };

  /**
   * Obtiene el nivel de acceso del usuario para un recurso específico
   * @param {string} resource - El recurso a verificar
   * @returns {object} Objeto con los permisos disponibles
   */
  const getResourcePermissions = (resource) => {
    return {
      canView: canView(resource),
      canCreate: canCreate(resource),
      canEdit: canEdit(resource),
      canDelete: canDelete(resource),
      canRestore: canRestore(resource)
    };
  };

  /**
   * Verifica si el usuario puede acceder a configuraciones críticas
   * @returns {boolean}
   */
  const canAccessCriticalConfig = () => {
    return hasRole('Administrador');
  };

  /**
   * Verifica si el usuario puede ver logs de auditoría
   * @returns {boolean}
   */
  const canViewAuditLogs = () => {
    return hasPermission('audit.view');
  };

  /**
   * Verifica si el usuario puede generar reportes
   * @returns {boolean}
   */
  const canGenerateReports = () => {
    return hasPermission('reports.create');
  };

  return {
    // Verificaciones básicas
    canPerform,
    canPerformMultiple,
    canAccessModule,
    getAccessibleModules,
    
    // Verificaciones de rol
    isAdmin,
    isSupervisorOrAdmin,
    canManageUsers,
    canViewSensitiveData,
    
    // Verificaciones CRUD
    canView,
    canCreate,
    canEdit,
    canDelete,
    canRestore,
    getResourcePermissions,
    
    // Verificaciones específicas
    canAccessCriticalConfig,
    canViewAuditLogs,
    canGenerateReports,
    
    // Información del usuario
    user,
    userRole: user?.rol,
    userPermissions: user?.permissions || []
  };
};

export default usePermissions;