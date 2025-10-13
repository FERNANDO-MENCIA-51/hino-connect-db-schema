import {
  LayoutDashboard,
  Truck,
  UserCog,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Route,
  FileText,
  History,
  UserCheck,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logoHino from "../../assets/images/logo.png";
import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";
import { PERMISSIONS } from "../../constants";
import PermissionGate from "../common/PermissionGate";

const Sidebar = ({ activeMenu = "Dashboard" }) => {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Si está cargando o no hay usuario, mostrar skeleton
  if (loading || !user) {
    return (
      <aside
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } bg-sidebar h-screen transition-all duration-300 flex flex-col flex-shrink-0 fixed left-0 top-0 z-40`}
      >
        <div className="p-6 border-b border-purple-800/50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-purple-700 rounded animate-pulse mb-4"></div>
            {!isCollapsed && (
              <>
                <div className="w-24 h-4 bg-purple-700 rounded animate-pulse mb-2"></div>
                <div className="w-16 h-3 bg-purple-700 rounded animate-pulse"></div>
              </>
            )}
          </div>
        </div>
        <nav className="flex-1 py-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="px-6 py-3 flex items-center gap-3">
              <div className="w-5 h-5 bg-purple-700 rounded animate-pulse"></div>
              {!isCollapsed && <div className="w-20 h-4 bg-purple-700 rounded animate-pulse"></div>}
            </div>
          ))}
        </nav>
      </aside>
    );
  }

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      path: "/dashboard",
      permission: PERMISSIONS.DASHBOARD_VIEW
    },
    { 
      icon: Shield, 
      label: "Roles", 
      path: "/roles",
      permission: PERMISSIONS.ROLES_VIEW
    },
    { 
      icon: UserCog, 
      label: "Usuarios", 
      path: "/usuarios",
      permission: PERMISSIONS.USERS_VIEW
    },
    { 
      icon: UserCheck, 
      label: "Conductores", 
      path: "/conductores",
      permission: PERMISSIONS.DRIVERS_VIEW
    },
    { 
      icon: Truck, 
      label: "Vehículos", 
      path: "/vehiculos",
      permission: PERMISSIONS.VEHICLES_VIEW
    },
    { 
      icon: Route, 
      label: "Movimientos", 
      path: "/movimientos",
      permission: PERMISSIONS.MOVEMENTS_VIEW
    },
    { 
      icon: FileText, 
      label: "Reportes", 
      path: "/reportes",
      permission: PERMISSIONS.REPORTS_VIEW
    },
    { 
      icon: Settings, 
      label: "Configuraciones", 
      path: "/configuraciones",
      permission: PERMISSIONS.CONFIG_VIEW
    },
    { 
      icon: History, 
      label: "Auditoría", 
      path: "/auditoria",
      permission: PERMISSIONS.AUDIT_VIEW
    },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-sidebar h-screen transition-all duration-300 flex flex-col flex-shrink-0 fixed left-0 top-0 z-40`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-sidebar border-2 border-purple-600 rounded-full p-1 hover:bg-sidebar-hover transition-colors z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-white" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-white" />
        )}
      </button>

      {/* Logo y Usuario */}
      <div className="p-6 border-b border-purple-800/50">
        <div className="flex flex-col items-center">
          <img
            src={logoHino}
            alt="Hino Logo"
            className={`${
              isCollapsed ? "h-10" : "h-16"
            } w-auto mb-4 transition-all duration-300`}
          />
          {!isCollapsed && (
            <>
              <p className="text-gray-300 text-sm mt-2">{user?.nombre || 'Usuario'}</p>
              <p className="text-gray-400 text-xs">{user?.rol || 'Sin rol'}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
                <span className="text-success-400 text-xs">En línea</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || activeMenu === item.label;

          const handleNavigation = (e) => {
            e.preventDefault();
            navigate(item.path);
          };

          return (
            <PermissionGate key={item.label} permission={item.permission}>
              <button
                onClick={handleNavigation}
                className={`w-full flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-sidebar-hover hover:text-white transition-colors ${
                  isActive ? "bg-sidebar-active text-white" : ""
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.label : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            </PermissionGate>
          );
        })}
      </nav>


    </aside>
  );
};

export default Sidebar;
