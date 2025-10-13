import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Usuarios from "./pages/Usuarios";
import Roles from "./pages/Roles";
import Conductores from "./pages/Conductores";
import Vehiculos from "./pages/Vehiculos";
import Movimientos from "./pages/Movimientos";
import Reportes from "./pages/Reportes";
import Configuraciones from "./pages/Configuraciones";
import Auditoria from "./pages/Auditoria";

function App() {
  console.log("🚀 App component rendering...");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/conductores" element={<Conductores />} />
        <Route path="/vehiculos" element={<Vehiculos />} />
        <Route path="/movimientos" element={<Movimientos />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/configuraciones" element={<Configuraciones />} />
        <Route path="/auditoria" element={<Auditoria />} />
        <Route path="/perfil" element={<Dashboard />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  Página no encontrada
                </h1>
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Ir al Login
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
