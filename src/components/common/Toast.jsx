import { useState, useEffect, createContext, useContext } from "react";
import {
  X,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  AlertTriangle,
} from "lucide-react";

// Contexto para el sistema de toast
const ToastContext = createContext();

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe ser usado dentro de un ToastProvider");
  }
  return context;
};

// Provider del sistema de toast
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: "info",
      duration: 5000,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove después de la duración especificada
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  // Métodos de conveniencia
  const success = (message, options = {}) => {
    return addToast({
      type: "success",
      message,
      ...options,
    });
  };

  const error = (message, options = {}) => {
    return addToast({
      type: "error",
      message,
      duration: 7000, // Errores duran más tiempo
      ...options,
    });
  };

  const warning = (message, options = {}) => {
    return addToast({
      type: "warning",
      message,
      ...options,
    });
  };

  const info = (message, options = {}) => {
    return addToast({
      type: "info",
      message,
      ...options,
    });
  };

  const loading = (message, options = {}) => {
    return addToast({
      type: "loading",
      message,
      duration: 0, // Loading toasts no se auto-remueven
      ...options,
    });
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    success,
    error,
    warning,
    info,
    loading,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Componente individual de toast
const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  // Configuración de tipos
  const typeConfig = {
    success: {
      icon: CheckCircle,
      classes: "bg-green-50 border-green-200 text-green-800",
      iconClasses: "text-green-500",
    },
    error: {
      icon: XCircle,
      classes: "bg-red-50 border-red-200 text-red-800",
      iconClasses: "text-red-500",
    },
    warning: {
      icon: AlertTriangle,
      classes: "bg-yellow-50 border-yellow-200 text-yellow-800",
      iconClasses: "text-yellow-500",
    },
    info: {
      icon: Info,
      classes: "bg-blue-50 border-blue-200 text-blue-800",
      iconClasses: "text-blue-500",
    },
    loading: {
      icon: null,
      classes: "bg-gray-50 border-gray-200 text-gray-800",
      iconClasses: "text-gray-500",
    },
  };

  const config = typeConfig[toast.type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${
          isVisible && !isRemoving
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }
        max-w-sm w-full bg-white border rounded-lg shadow-lg pointer-events-auto
        ${config.classes}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {toast.type === "loading" ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
            ) : Icon ? (
              <Icon className={`w-5 h-5 ${config.iconClasses}`} />
            ) : null}
          </div>

          <div className="ml-3 w-0 flex-1">
            {toast.title && (
              <p className="text-sm font-medium">{toast.title}</p>
            )}
            <p className={`text-sm ${toast.title ? "mt-1" : ""}`}>
              {toast.message}
            </p>

            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={toast.action.onClick}
                  className="text-sm font-medium underline hover:no-underline"
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>

          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleRemove}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Barra de progreso para toasts con duración */}
      {toast.duration > 0 && (
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-current opacity-30 transition-all ease-linear"
            style={{
              animation: `toast-progress ${toast.duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
};

// Contenedor de toasts
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}

      {/* Estilos CSS para la animación de progreso */}
      <style>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

// Componente de loading indicator
export const LoadingSpinner = ({
  size = "md",
  color = "primary",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    primary: "border-primary-600",
    white: "border-white",
    gray: "border-gray-600",
    success: "border-green-600",
    danger: "border-red-600",
    warning: "border-yellow-600",
    info: "border-blue-600",
  };

  return (
    <div
      className={`
        animate-spin rounded-full border-b-2 
        ${sizeClasses[size]} ${colorClasses[color]} ${className}
      `}
    />
  );
};

// Componente de estado de carga para páginas completas
export const PageLoader = ({ message = "Cargando..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
};

// Componente de estado de carga para secciones
export const SectionLoader = ({ message = "Cargando...", className = "" }) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-2 text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  );
};

// export { useToast };
export default Toast;
