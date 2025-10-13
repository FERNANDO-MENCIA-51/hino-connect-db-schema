import api from "../config/api";

export const notificationService = {
  // Obtener notificaciones del usuario actual
  getNotifications: async () => {
    try {
      // Por ahora simulamos notificaciones, pero esto se conectaría a un endpoint real
      const mockNotifications = [
        {
          id: 1,
          title: "Nuevo movimiento programado",
          message: "Se ha programado un nuevo movimiento para el vehículo V001",
          type: "info",
          read: false,
          createdAt: new Date().toISOString(),
          icon: "truck"
        },
        {
          id: 2,
          title: "Mantenimiento vencido",
          message: "El vehículo V003 tiene mantenimiento vencido desde hace 3 días",
          type: "warning",
          read: false,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          icon: "alert-triangle"
        },
        {
          id: 3,
          title: "Conductor disponible",
          message: "El conductor C005 ha completado su viaje y está disponible",
          type: "success",
          read: true,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          icon: "user-check"
        }
      ];

      return { data: mockNotifications };
    } catch (error) {
      console.error("❌ Error al obtener notificaciones:", error);
      throw error.response?.data?.message || "Error al obtener notificaciones";
    }
  },

  // Marcar notificación como leída
  markAsRead: async (notificationId) => {
    try {
      console.log("📖 Marcando notificación como leída:", notificationId);
      // Aquí se haría la llamada real al backend
      return { success: true };
    } catch (error) {
      console.error("❌ Error al marcar notificación como leída:", error);
      throw error.response?.data?.message || "Error al marcar notificación como leída";
    }
  },

  // Marcar todas las notificaciones como leídas
  markAllAsRead: async () => {
    try {
      console.log("📖 Marcando todas las notificaciones como leídas");
      // Aquí se haría la llamada real al backend
      return { success: true };
    } catch (error) {
      console.error("❌ Error al marcar todas las notificaciones como leídas:", error);
      throw error.response?.data?.message || "Error al marcar todas las notificaciones como leídas";
    }
  },

  // Obtener mensajes del usuario actual
  getMessages: async () => {
    try {
      // Por ahora simulamos mensajes, pero esto se conectaría a un endpoint real
      const mockMessages = [
        {
          id: 1,
          from: "Sistema",
          subject: "Bienvenido a HINO CONNECT",
          message: "Tu cuenta ha sido activada exitosamente",
          read: false,
          createdAt: new Date().toISOString(),
          priority: "normal"
        },
        {
          id: 2,
          from: "Supervisor",
          subject: "Actualización de horarios",
          message: "Se han actualizado los horarios de los turnos para la próxima semana",
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          priority: "high"
        },
        {
          id: 3,
          from: "Mantenimiento",
          subject: "Programación de mantenimiento",
          message: "Se ha programado mantenimiento preventivo para el vehículo V001",
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          priority: "normal"
        }
      ];

      return { data: mockMessages };
    } catch (error) {
      console.error("❌ Error al obtener mensajes:", error);
      throw error.response?.data?.message || "Error al obtener mensajes";
    }
  },

  // Marcar mensaje como leído
  markMessageAsRead: async (messageId) => {
    try {
      console.log("📖 Marcando mensaje como leído:", messageId);
      // Aquí se haría la llamada real al backend
      return { success: true };
    } catch (error) {
      console.error("❌ Error al marcar mensaje como leído:", error);
      throw error.response?.data?.message || "Error al marcar mensaje como leído";
    }
  },

  // Obtener conteo de notificaciones no leídas
  getUnreadCount: async () => {
    try {
      const notifications = await notificationService.getNotifications();
      const messages = await notificationService.getMessages();
      
      const unreadNotifications = notifications.data.filter(n => !n.read).length;
      const unreadMessages = messages.data.filter(m => !m.read).length;
      
      return {
        notifications: unreadNotifications,
        messages: unreadMessages,
        total: unreadNotifications + unreadMessages
      };
    } catch (error) {
      console.error("❌ Error al obtener conteo de no leídos:", error);
      return { notifications: 0, messages: 0, total: 0 };
    }
  }
};

export default notificationService;