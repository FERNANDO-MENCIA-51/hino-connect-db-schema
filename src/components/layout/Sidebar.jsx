import {
  LayoutDashboard,
  Truck,
  Users,
  TrendingUp,
  BarChart3,
  UserCog,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoHino from "../../assets/images/logo.png";
import { useSidebar } from "../../context/SidebarContext";
import { authService } from "../../services/authService";

const Sidebar = ({ activeMenu = "Dashboard" }) => {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Truck, label: "Vehículos", path: "/vehiculos" },
    { icon: Users, label: "Conductores", path: "/conductores" },
    { icon: TrendingUp, label: "Movimientos", path: "/movimientos" },
    { icon: BarChart3, label: "Reportes", path: "/reportes" },
    { icon: UserCog, label: "Usuarios y Roles", path: "/usuarios" },
    { icon: User, label: "Perfil", path: "/perfil" },
    { icon: Settings, label: "Configuración", path: "/configuracion" },
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
              <p className="text-gray-300 text-sm mt-2">Administrador</p>
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
          const isActive = activeMenu === item.label;

          return (
            <a
              key={item.label}
              href={item.path}
              className={`flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-sidebar-hover hover:text-white transition-colors ${
                isActive ? "bg-sidebar-active text-white" : ""
              } ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </a>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-purple-800/50 p-4">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-sidebar-hover hover:text-white rounded-lg transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Log Out" : ""}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
