import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { PERMISSIONS, USER_ROLES, APP_CONFIG } from '../constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  // Inicializar el contexto al cargar la aplicación
  useEffect(() => {
    initializeAuth();
  }, []);

  // Configurar timeout de sesión
  useEffect(() => {
    if (token) {
      setupSessionTimeout();
    } else {
      clearSessionTimeout();
    }
  }, [token]);

  const initializeAuth = () => {
    try {
      console.log('🔄 Inicializando autenticación...');
      
      const storedToken = localStorage.getItem('token');
      const storedUserName = localStorage.getItem('userName');
      const storedUserRole = localStorage.getItem('userRole');
      const storedUserId = localStorage.getItem('userId');
      const storedUserEmail = localStorage.getItem('userEmail');

      console.log('📦 Datos almacenados:', { storedToken: !!storedToken, storedUserName, storedUserRole });

      if (storedToken && storedUserName && storedUserRole) {
        const userData = {
          id: storedUserId ? parseInt(storedUserId) : null,
          email: storedUserEmail || '',
          nombre: storedUserName,
          rol: storedUserRole,
          permissions: getRolePermissions(storedUserRole)
        };

        console.log('✅ Usuario restaurado desde localStorage:', userData);

        setUser(userData);
        setToken(storedToken);
        console.log('✅ Sesión restaurada:', userData);
      } else {
        console.log('❌ No hay sesión almacenada');
      }
    } catch (error) {
      console.error('❌ Error al inicializar autenticación:', error);
      logout();
    } finally {
      console.log('🏁 Finalizando inicialización, loading = false');
      setLoading(false);
    }
  };

  const setupSessionTimeout = () => {
    clearSessionTimeout();
    
    const timeout = setTimeout(() => {
      console.log('⏰ Sesión expirada por inactividad');
      logout();
      alert('Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.');
    }, APP_CONFIG.SESSION_TIMEOUT);

    setSessionTimeout(timeout);
  };

  const clearSessionTimeout = () => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }
  };

  const resetSessionTimeout = () => {
    if (token) {
      setupSessionTimeout();
    }
  };

  // Agregar listeners para resetear el timeout con actividad del usuario
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const resetTimeout = () => {
      resetSessionTimeout();
    };

    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout, true);
      });
    };
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      
      const { token: newToken, nombre, rol, email: userEmail } = response.data;
      
      // Simular ID de usuario (en producción vendría del backend)
      const userId = Math.floor(Math.random() * 1000) + 1;
      
      const userData = {
        id: userId,
        email: userEmail || email,
        nombre,
        rol,
        permissions: getRolePermissions(rol)
      };

      // Guardar en localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('userName', nombre);
      localStorage.setItem('userRole', rol);
      localStorage.setItem('userId', userId.toString());
      localStorage.setItem('userEmail', userEmail || email);

      setUser(userData);
      setToken(newToken);

      console.log('✅ Login exitoso:', userData);
      return response;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      // Limpiar estado
      setUser(null);
      setToken(null);
      clearSessionTimeout();

      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');

      console.log('✅ Logout exitoso');
      
      // Redirigir al login
      window.location.href = '/login';
    } catch (error) {
      console.error('❌ Error en logout:', error);
    }
  };

  const refreshToken = async () => {
    try {
      // En una implementación real, aquí se haría una llamada al backend
      // para refrescar el token antes de que expire
      console.log('🔄 Refrescando token...');
      
      // Simular refresh exitoso
      const newToken = token + '_refreshed_' + Date.now();
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      console.log('✅ Token refrescado exitosamente');
      return newToken;
    } catch (error) {
      console.error('❌ Error al refrescar token:', error);
      logout();
      throw error;
    }
  };

  const getRolePermissions = (roleName) => {
    // Mapeo de roles a permisos
    const rolePermissions = {
      [USER_ROLES.ADMINISTRADOR]: [
        // Dashboard
        PERMISSIONS.DASHBOARD_VIEW,
        
        // Roles - acceso completo
        PERMISSIONS.ROLES_VIEW,
        PERMISSIONS.ROLES_CREATE,
        PERMISSIONS.ROLES_EDIT,
        PERMISSIONS.ROLES_DELETE,
        PERMISSIONS.ROLES_RESTORE,
        
        // Usuarios - acceso completo
        PERMISSIONS.USERS_VIEW,
        PERMISSIONS.USERS_CREATE,
        PERMISSIONS.USERS_EDIT,
        PERMISSIONS.USERS_DELETE,
        PERMISSIONS.USERS_RESTORE,
        
        // Conductores - acceso completo
        PERMISSIONS.DRIVERS_VIEW,
        PERMISSIONS.DRIVERS_CREATE,
        PERMISSIONS.DRIVERS_EDIT,
        PERMISSIONS.DRIVERS_DELETE,
        PERMISSIONS.DRIVERS_RESTORE,
        
        // Vehículos - acceso completo
        PERMISSIONS.VEHICLES_VIEW,
        PERMISSIONS.VEHICLES_CREATE,
        PERMISSIONS.VEHICLES_EDIT,
        PERMISSIONS.VEHICLES_DELETE,
        PERMISSIONS.VEHICLES_RESTORE,
        
        // Movimientos - acceso completo
        PERMISSIONS.MOVEMENTS_VIEW,
        PERMISSIONS.MOVEMENTS_CREATE,
        PERMISSIONS.MOVEMENTS_EDIT,
        PERMISSIONS.MOVEMENTS_DELETE,
        PERMISSIONS.MOVEMENTS_RESTORE,
        
        // Reportes - acceso completo
        PERMISSIONS.REPORTS_VIEW,
        PERMISSIONS.REPORTS_CREATE,
        PERMISSIONS.REPORTS_EDIT,
        PERMISSIONS.REPORTS_DELETE,
        PERMISSIONS.REPORTS_RESTORE,
        
        // Configuraciones - acceso completo
        PERMISSIONS.CONFIG_VIEW,
        PERMISSIONS.CONFIG_CREATE,
        PERMISSIONS.CONFIG_EDIT,
        PERMISSIONS.CONFIG_DELETE,
        PERMISSIONS.CONFIG_RESTORE,
        
        // Auditoría
        PERMISSIONS.AUDIT_VIEW
      ],
      
      [USER_ROLES.SUPERVISOR]: [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.USERS_VIEW,
        PERMISSIONS.DRIVERS_VIEW,
        PERMISSIONS.DRIVERS_CREATE,
        PERMISSIONS.DRIVERS_EDIT,
        PERMISSIONS.VEHICLES_VIEW,
        PERMISSIONS.VEHICLES_EDIT,
        PERMISSIONS.MOVEMENTS_VIEW,
        PERMISSIONS.MOVEMENTS_CREATE,
        PERMISSIONS.MOVEMENTS_EDIT,
        PERMISSIONS.REPORTS_VIEW,
        PERMISSIONS.REPORTS_CREATE,
        PERMISSIONS.CONFIG_VIEW,
        PERMISSIONS.AUDIT_VIEW
      ],
      
      [USER_ROLES.COORDINADOR]: [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.DRIVERS_VIEW,
        PERMISSIONS.VEHICLES_VIEW,
        PERMISSIONS.MOVEMENTS_VIEW,
        PERMISSIONS.MOVEMENTS_CREATE,
        PERMISSIONS.MOVEMENTS_EDIT,
        PERMISSIONS.REPORTS_VIEW,
        PERMISSIONS.REPORTS_CREATE
      ],
      
      [USER_ROLES.OPERADOR]: [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.DRIVERS_VIEW,
        PERMISSIONS.VEHICLES_VIEW,
        PERMISSIONS.MOVEMENTS_VIEW,
        PERMISSIONS.REPORTS_VIEW
      ]
    };

    return rolePermissions[roleName] || [];
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) {
      return false;
    }
    return user.permissions.includes(permission);
  };

  const hasRole = (roleName) => {
    if (!user) {
      return false;
    }
    return user.rol === roleName;
  };

  const hasAnyRole = (roleNames) => {
    if (!user) {
      return false;
    }
    return roleNames.includes(user.rol);
  };

  const isAuthenticated = () => {
    return !!(user && token);
  };

  const getUserInfo = () => {
    return user;
  };

  const getToken = () => {
    return token;
  };

  const updateUserProfile = (updatedData) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      
      // Actualizar localStorage si es necesario
      if (updatedData.nombre) {
        localStorage.setItem('userName', updatedData.nombre);
      }
      if (updatedData.email) {
        localStorage.setItem('userEmail', updatedData.email);
      }
      
      console.log('✅ Perfil de usuario actualizado:', updatedUser);
    }
  };

  const value = {
    // Estado
    user,
    token,
    loading,
    
    // Métodos de autenticación
    login,
    logout,
    refreshToken,
    
    // Métodos de autorización
    hasPermission,
    hasRole,
    hasAnyRole,
    isAuthenticated,
    
    // Información del usuario
    getUserInfo,
    getToken,
    updateUserProfile,
    
    // Utilidades
    resetSessionTimeout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;