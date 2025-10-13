import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  User, 
  Clock, 
  X,
  AlertCircle,
  Mail
} from "lucide-react";
import { notificationService } from "../../services/notificationService";

const MessageDropdown = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getMessages();
      setMessages(response.data);
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await notificationService.markMessageAsRead(messageId);
      setMessages(prev => 
        prev.map(m => m.id === messageId ? { ...m, read: true } : m)
      );
    } catch (error) {
      console.error("Error al marcar mensaje como leído:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-danger-600';
      case 'medium': return 'text-warning-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays}d`;
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Mensajes</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-sm">Cargando mensajes...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No tienes mensajes</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !message.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => !message.read && handleMarkAsRead(message.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-medium ${
                          !message.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {message.from}
                        </h4>
                        {getPriorityIcon(message.priority) && (
                          <span className={getPriorityColor(message.priority)}>
                            {getPriorityIcon(message.priority)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!message.read && (
                          <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></div>
                        )}
                        <Clock className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>
                    <h5 className={`text-sm mt-1 ${
                      !message.read ? 'font-medium text-gray-900' : 'text-gray-700'
                    }`}>
                      {message.subject}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {message.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {messages.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
            Ver todos los mensajes
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageDropdown;