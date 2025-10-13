import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";

const MainLayout = ({ children, activeMenu }) => {
  const { isCollapsed } = useSidebar();
  const { loading, user } = useAuth();

  // Solo mostrar loading si realmente está cargando Y no hay usuario
  if (loading && !user) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario después de cargar, redirigir al login
  if (!loading && !user) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeMenu={activeMenu} />
      <div
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
