import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Settings,
  TrendingUp,
  Truck,
  UserCog,
  Users,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { authService } from "../../services/authService";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const userName = authService.getUserName();
  const userRole = authService.getUserRole();

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/vehiculos", icon: Truck, label: "Vehículos" },
    { path: "/conductores", icon: Users, label: "Conductores" },
    { path: "/movimientos", icon: TrendingUp, label: "Movimientos" },
    { path: "/reportes", icon: BarChart3, label: "Reportes" },
    { path: "/usuarios", icon: UserCog, label: "Usuarios y Roles" },
    { path: "/perfil", icon: Users, label: "Perfil" },
    { path: "/configuracion", icon: Settings, label: "Configuración" },
  ];

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 h-screen text-white transition-all duration-300 flex flex-col relative flex-shrink-0`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 bg-slate-800 border-2 border-slate-600 rounded-full p-1 hover:bg-slate-700 transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Logo & User Info */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-center mb-3">
          <img
            src={logo}
            alt="HINO"
            className={`${collapsed ? "h-8" : "h-12"} transition-all`}
          />
        </div>
        {!collapsed && (
          <div className="text-center">
            <p className="text-sm text-slate-200">
              {userName || "Fernando Mencia"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {userRole || "Administrador"}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">En Línea</span>
            </div>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 px-3 overflow-hidden">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 mb-1 rounded-lg transition-all group ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-700 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Log Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
