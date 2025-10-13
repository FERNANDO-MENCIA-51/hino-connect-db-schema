import {
  Search,
  Bell,
  MessageSquare,
  Settings,
  User as UserIcon,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { notificationService } from "../../services/notificationService";
import NotificationDropdown from "../common/NotificationDropdown";
import MessageDropdown from "../common/MessageDropdown";

const Header = () => {
  const [unreadCounts, setUnreadCounts] = useState({ notifications: 0, messages: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const messageRef = useRef(null);
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "Admin Sistema";

  // Obtener iniciales del nombre
  const getInitials = (name) => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Cargar conteos de notificaciones al montar el componente
  useEffect(() => {
    loadUnreadCounts();
    // Actualizar conteos cada 30 segundos
    const interval = setInterval(loadUnreadCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setIsMessageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadUnreadCounts = async () => {
    try {
      const counts = await notificationService.getUnreadCount();
      setUnreadCounts(counts);
    } catch (error) {
      console.error("Error al cargar conteos:", error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Buscador */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Iconos y Usuario */}
        <div className="flex items-center gap-4">
          {/* Notificaciones */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                setIsMessageOpen(false);
                setIsDropdownOpen(false);
              }}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCounts.notifications > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {unreadCounts.notifications > 9 ? '9+' : unreadCounts.notifications}
                </span>
              )}
            </button>
            <NotificationDropdown 
              isOpen={isNotificationOpen} 
              onClose={() => setIsNotificationOpen(false)} 
            />
          </div>

          {/* Mensajes */}
          <div className="relative" ref={messageRef}>
            <button 
              onClick={() => {
                setIsMessageOpen(!isMessageOpen);
                setIsNotificationOpen(false);
                setIsDropdownOpen(false);
              }}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-gray-600" />
              {unreadCounts.messages > 0 && (
                <span className="absolute top-1 right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {unreadCounts.messages > 9 ? '9+' : unreadCounts.messages}
                </span>
              )}
            </button>
            <MessageDropdown 
              isOpen={isMessageOpen} 
              onClose={() => setIsMessageOpen(false)} 
            />
          </div>

          {/* Usuario con Dropdown */}
          <div
            className="relative pl-4 border-l border-gray-200"
            ref={dropdownRef}
          >
            <button
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setIsNotificationOpen(false);
                setIsMessageOpen(false);
              }}
              className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors"
            >
              <span className="text-sm text-gray-700">Hola {userName}</span>
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(userName)}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-600 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {localStorage.getItem("userRole") || "Usuario"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/perfil");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  Perfil
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/configuraciones");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Configuraciones
                </button>

                <div className="border-t border-gray-200 my-2"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
