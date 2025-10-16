import { Bell, ChevronDown, MessageSquare, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

const Header = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const userName = authService.getUserName() || "";
  const userEmail = authService.getUserEmail() || "";

  const notificationsRef = useRef(null);
  const messagesRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    // Cargar notificaciones reales (conectadas con eventos del sistema)
    loadNotifications();
    loadMessages();

    // Cerrar dropdowns al hacer click fuera
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        setShowMessages(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifications = () => {
    // Aquí puedes conectar con tu API para obtener notificaciones reales
    // Por ahora usamos datos simulados basados en acciones del sistema
    setNotifications([
      {
        id: 1,
        title: "Nuevo vehículo registrado",
        message: "Se ha registrado un nuevo vehículo en el sistema",
        time: "Hace 5 min",
        read: false,
        type: "vehiculo",
        link: "/vehiculos",
      },
      {
        id: 2,
        title: "Mantenimiento programado",
        message: "El vehículo ABC-123 tiene mantenimiento mañana",
        time: "Hace 1 hora",
        read: false,
        type: "vehiculo",
        link: "/vehiculos",
      },
      {
        id: 3,
        title: "Conductor asignado",
        message: "Se asignó un conductor al vehículo XYZ-789",
        time: "Hace 2 horas",
        read: true,
        type: "conductor",
        link: "/conductores",
      },
      {
        id: 4,
        title: "Nuevo movimiento registrado",
        message: "Se registró un nuevo movimiento de salida",
        time: "Hace 3 horas",
        read: true,
        type: "movimiento",
        link: "/movimientos",
      },
    ]);
  };

  const loadMessages = () => {
    // Aquí puedes conectar con tu API para obtener mensajes reales
    setMessages([
      {
        id: 1,
        from: "Juan Pérez",
        message: "¿Cuándo estará disponible el vehículo?",
        time: "Hace 10 min",
        read: false,
        link: "/mensajes/1",
      },
      {
        id: 2,
        from: "María García",
        message: "Necesito autorización para el movimiento",
        time: "Hace 30 min",
        read: false,
        link: "/mensajes/2",
      },
      {
        id: 3,
        from: "Carlos López",
        message: "Reporte de movimientos completado",
        time: "Hace 1 hora",
        read: true,
        link: "/mensajes/3",
      },
    ]);
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = messages.filter((m) => !m.read).length;

  const handleNotificationClick = (notification) => {
    // Marcar como leída
    setNotifications(
      notifications.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
    // Navegar a la página correspondiente
    navigate(notification.link);
    setShowNotifications(false);
  };

  const handleMessageClick = (message) => {
    // Marcar como leído
    setMessages(
      messages.map((m) => (m.id === message.id ? { ...m, read: true } : m))
    );
    // Navegar a la página de mensajes (puedes crear una página específica)
    // navigate(message.link);
    setShowMessages(false);
  };

  const deleteNotification = (e, notificationId) => {
    e.stopPropagation();
    setNotifications(notifications.filter((n) => n.id !== notificationId));
  };

  const deleteMessage = (e, messageId) => {
    e.stopPropagation();
    setMessages(messages.filter((m) => m.id !== messageId));
  };

  const getInitials = (name) => {
    if (!name) return "AS";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-6">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {unreadNotifications}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                  <h3 className="font-semibold text-gray-800">
                    Notificaciones
                  </h3>
                  {unreadNotifications > 0 && (
                    <span className="text-xs text-blue-600 font-medium">
                      {unreadNotifications} nuevas
                    </span>
                  )}
                </div>
                <div className="divide-y divide-gray-100">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative group ${
                          !notif.read ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              !notif.read ? "bg-blue-500" : "bg-gray-300"
                            }`}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notif.time}
                            </p>
                          </div>
                          <button
                            onClick={(e) => deleteNotification(e, notif.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all flex-shrink-0"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4">
                      <p className="text-sm text-gray-600 text-center">
                        No hay notificaciones
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="relative" ref={messagesRef}>
            <button
              onClick={() => setShowMessages(!showMessages)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MessageSquare className="w-6 h-6" />
              {unreadMessages > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {unreadMessages}
                </span>
              )}
            </button>
            {showMessages && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                  <h3 className="font-semibold text-gray-800">Mensajes</h3>
                  {unreadMessages > 0 && (
                    <span className="text-xs text-blue-600 font-medium">
                      {unreadMessages} nuevos
                    </span>
                  )}
                </div>
                <div className="divide-y divide-gray-100">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => handleMessageClick(msg)}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative group ${
                          !msg.read ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {msg.from
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800">
                              {msg.from}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 truncate">
                              {msg.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {msg.time}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!msg.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <button
                              onClick={(e) => deleteMessage(e, msg.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4">
                      <p className="text-sm text-gray-600 text-center">
                        No hay mensajes
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                Hola {userName || "Admin Sistema"}
              </span>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(userName)}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-800">
                    {userName || "Admin Sistema"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {userEmail || "admin@sistema.com"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Administrador</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate("/perfil");
                      setShowProfile(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Mi Perfil
                  </button>
                  <button
                    onClick={() => {
                      navigate("/configuracion");
                      setShowProfile(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Configuración
                  </button>
                  <button
                    onClick={() => authService.logout()}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
