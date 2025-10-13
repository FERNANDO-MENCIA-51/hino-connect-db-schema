// Estados de vehículos
export const VEHICLE_STATES = {
  EN_OPERACION: 'En operación',
  EN_MANTENIMIENTO: 'En mantenimiento',
  DISPONIBLE: 'Disponible',
  INACTIVO: 'Inactivo'
};

// Estados de conductores
export const DRIVER_STATES = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
  EN_VIAJE: 'En Viaje'
};

// Estados de movimientos
export const MOVEMENT_STATES = {
  PROGRAMADO: 'Programado',
  EN_CURSO: 'En curso',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado',
  INACTIVO: 'Inactivo'
};

// Tipos de operaciones de auditoría
export const AUDIT_OPERATIONS = {
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
};

// Tablas del sistema
export const SYSTEM_TABLES = {
  USUARIOS: 'usuarios',
  ROLES: 'roles',
  CONDUCTORES: 'conductores',
  VEHICULOS: 'vehiculos',
  MOVIMIENTOS: 'movimientos',
  REPORTES: 'reportes',
  CONFIGURACIONES: 'configuraciones'
};

// Tipos de reportes
export const REPORT_TYPES = {
  VEHICULOS: 'vehiculos',
  CONDUCTORES: 'conductores',
  MOVIMIENTOS: 'movimientos',
  USUARIOS: 'usuarios'
};

// Configuraciones de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100]
};

// Roles del sistema
export const USER_ROLES = {
  ADMINISTRADOR: 'Administrador',
  SUPERVISOR: 'Supervisor',
  OPERADOR: 'Operador',
  COORDINADOR: 'Coordinador'
};

// Permisos del sistema
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',
  
  // Roles
  ROLES_VIEW: 'roles.view',
  ROLES_CREATE: 'roles.create',
  ROLES_EDIT: 'roles.edit',
  ROLES_DELETE: 'roles.delete',
  ROLES_RESTORE: 'roles.restore',
  
  // Usuarios
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  USERS_RESTORE: 'users.restore',
  
  // Conductores
  DRIVERS_VIEW: 'drivers.view',
  DRIVERS_CREATE: 'drivers.create',
  DRIVERS_EDIT: 'drivers.edit',
  DRIVERS_DELETE: 'drivers.delete',
  DRIVERS_RESTORE: 'drivers.restore',
  
  // Vehículos
  VEHICLES_VIEW: 'vehicles.view',
  VEHICLES_CREATE: 'vehicles.create',
  VEHICLES_EDIT: 'vehicles.edit',
  VEHICLES_DELETE: 'vehicles.delete',
  VEHICLES_RESTORE: 'vehicles.restore',
  
  // Movimientos
  MOVEMENTS_VIEW: 'movements.view',
  MOVEMENTS_CREATE: 'movements.create',
  MOVEMENTS_EDIT: 'movements.edit',
  MOVEMENTS_DELETE: 'movements.delete',
  MOVEMENTS_RESTORE: 'movements.restore',
  
  // Reportes
  REPORTS_VIEW: 'reports.view',
  REPORTS_CREATE: 'reports.create',
  REPORTS_EDIT: 'reports.edit',
  REPORTS_DELETE: 'reports.delete',
  REPORTS_RESTORE: 'reports.restore',
  
  // Configuraciones
  CONFIG_VIEW: 'config.view',
  CONFIG_CREATE: 'config.create',
  CONFIG_EDIT: 'config.edit',
  CONFIG_DELETE: 'config.delete',
  CONFIG_RESTORE: 'config.restore',
  
  // Auditoría
  AUDIT_VIEW: 'audit.view'
};

// Mensajes del sistema
export const MESSAGES = {
  SUCCESS: {
    CREATED: 'Registro creado exitosamente',
    UPDATED: 'Registro actualizado exitosamente',
    DELETED: 'Registro eliminado exitosamente',
    RESTORED: 'Registro restaurado exitosamente'
  },
  ERROR: {
    GENERIC: 'Ha ocurrido un error inesperado',
    NETWORK: 'Error de conexión. Verifica tu conexión a internet',
    UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
    NOT_FOUND: 'El registro solicitado no fue encontrado',
    VALIDATION: 'Por favor verifica los datos ingresados'
  },
  CONFIRM: {
    DELETE: '¿Estás seguro de que deseas eliminar este registro?',
    RESTORE: '¿Estás seguro de que deseas restaurar este registro?',
    CANCEL: '¿Estás seguro de que deseas cancelar esta operación?'
  }
};

// Configuraciones de la aplicación
export const APP_CONFIG = {
  NAME: 'HINO CONNECT',
  VERSION: '1.0.0',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos en milisegundos
  API_TIMEOUT: 10000, // 10 segundos
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp']
};