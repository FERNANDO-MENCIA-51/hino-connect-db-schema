import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock, 
  Pause, 
  Play,
  Truck,
  User,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

const StatusBadge = ({
  status,
  variant = 'auto',
  size = 'md',
  showIcon = true,
  className = '',
  iconClassName = '',
  textClassName = ''
}) => {
  // Mapeo automático de estados a variantes
  const autoVariantMap = {
    // Estados generales
    'activo': 'success',
    'active': 'success',
    'completado': 'success',
    'completed': 'success',
    'aprobado': 'success',
    'approved': 'success',
    'disponible': 'success',
    'available': 'success',
    'en línea': 'success',
    'online': 'success',
    
    // Estados de advertencia
    'pendiente': 'warning',
    'pending': 'warning',
    'en curso': 'warning',
    'in progress': 'warning',
    'programado': 'warning',
    'scheduled': 'warning',
    'en viaje': 'warning',
    'en operación': 'warning',
    'en mantenimiento': 'warning',
    'maintenance': 'warning',
    
    // Estados de error/peligro
    'inactivo': 'danger',
    'inactive': 'danger',
    'cancelado': 'danger',
    'cancelled': 'danger',
    'rechazado': 'danger',
    'rejected': 'danger',
    'error': 'danger',
    'fallido': 'danger',
    'failed': 'danger',
    'fuera de línea': 'danger',
    'offline': 'danger',
    
    // Estados informativos
    'información': 'info',
    'info': 'info',
    'nuevo': 'info',
    'new': 'info',
    'borrador': 'info',
    'draft': 'info'
  };

  // Determinar la variante
  const finalVariant = variant === 'auto' 
    ? autoVariantMap[status?.toLowerCase()] || 'gray'
    : variant;

  // Configuración de variantes
  const variantConfig = {
    success: {
      classes: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle
    },
    warning: {
      classes: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: AlertCircle
    },
    danger: {
      classes: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle
    },
    info: {
      classes: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: AlertCircle
    },
    gray: {
      classes: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: Clock
    },
    primary: {
      classes: 'bg-primary-100 text-primary-800 border-primary-200',
      icon: CheckCircle
    }
  };

  // Configuración de tamaños
  const sizeConfig = {
    sm: {
      classes: 'px-2 py-1 text-xs',
      iconSize: 'w-3 h-3'
    },
    md: {
      classes: 'px-2.5 py-1.5 text-sm',
      iconSize: 'w-4 h-4'
    },
    lg: {
      classes: 'px-3 py-2 text-base',
      iconSize: 'w-5 h-5'
    }
  };

  // Iconos específicos por estado
  const statusIcons = {
    'activo': CheckCircle,
    'active': CheckCircle,
    'completado': CheckCircle,
    'completed': CheckCircle,
    'disponible': CheckCircle,
    'available': CheckCircle,
    
    'pendiente': Clock,
    'pending': Clock,
    'programado': Clock,
    'scheduled': Clock,
    
    'en curso': Play,
    'in progress': Play,
    'en viaje': Truck,
    'en operación': Truck,
    
    'en mantenimiento': Settings,
    'maintenance': Settings,
    
    'inactivo': Pause,
    'inactive': Pause,
    'cancelado': XCircle,
    'cancelled': XCircle,
    
    'nuevo': AlertCircle,
    'new': AlertCircle
  };

  const config = variantConfig[finalVariant] || variantConfig.gray;
  const sizeConf = sizeConfig[size] || sizeConfig.md;
  
  // Seleccionar icono
  const IconComponent = statusIcons[status?.toLowerCase()] || config.icon;

  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${config.classes} ${sizeConf.classes} ${className}
      `}
    >
      {showIcon && IconComponent && (
        <IconComponent className={`${sizeConf.iconSize} ${iconClassName}`} />
      )}
      <span className={textClassName}>
        {status}
      </span>
    </span>
  );
};

// Componente especializado para estados de vehículos
export const VehicleStatusBadge = ({ status, ...props }) => {
  const vehicleVariants = {
    'En operación': 'success',
    'Disponible': 'info',
    'En mantenimiento': 'warning',
    'Inactivo': 'danger'
  };

  return (
    <StatusBadge 
      status={status}
      variant={vehicleVariants[status] || 'gray'}
      {...props}
    />
  );
};

// Componente especializado para estados de conductores
export const DriverStatusBadge = ({ status, ...props }) => {
  const driverVariants = {
    'Activo': 'success',
    'En Viaje': 'warning',
    'Inactivo': 'danger'
  };

  return (
    <StatusBadge 
      status={status}
      variant={driverVariants[status] || 'gray'}
      {...props}
    />
  );
};

// Componente especializado para estados de movimientos
export const MovementStatusBadge = ({ status, ...props }) => {
  const movementVariants = {
    'Programado': 'info',
    'En curso': 'warning',
    'Completado': 'success',
    'Cancelado': 'danger',
    'Inactivo': 'gray'
  };

  return (
    <StatusBadge 
      status={status}
      variant={movementVariants[status] || 'gray'}
      {...props}
    />
  );
};

// Componente para mostrar prioridad
export const PriorityBadge = ({ priority, ...props }) => {
  const priorityVariants = {
    'alta': 'danger',
    'high': 'danger',
    'media': 'warning',
    'medium': 'warning',
    'baja': 'info',
    'low': 'info',
    'normal': 'gray'
  };

  const priorityLabels = {
    'alta': 'Alta',
    'high': 'Alta',
    'media': 'Media',
    'medium': 'Media',
    'baja': 'Baja',
    'low': 'Baja',
    'normal': 'Normal'
  };

  return (
    <StatusBadge 
      status={priorityLabels[priority?.toLowerCase()] || priority}
      variant={priorityVariants[priority?.toLowerCase()] || 'gray'}
      {...props}
    />
  );
};

// Componente para mostrar roles de usuario
export const RoleBadge = ({ role, ...props }) => {
  const roleVariants = {
    'Administrador': 'danger',
    'Supervisor': 'warning',
    'Coordinador': 'info',
    'Operador': 'gray'
  };

  return (
    <StatusBadge 
      status={role}
      variant={roleVariants[role] || 'gray'}
      showIcon={false}
      {...props}
    />
  );
};

// Componente para mostrar estado booleano
export const BooleanBadge = ({ 
  value, 
  trueLabel = 'Sí', 
  falseLabel = 'No',
  trueVariant = 'success',
  falseVariant = 'danger',
  ...props 
}) => {
  return (
    <StatusBadge 
      status={value ? trueLabel : falseLabel}
      variant={value ? trueVariant : falseVariant}
      showIcon={true}
      {...props}
    />
  );
};

export default StatusBadge;