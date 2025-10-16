import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { authService } from "./services/authService";

// Layout
import MainLayout from "./components/Layout/MainLayout";

// Pages
import Login from "./pages/Auth/Login";
import Conductores from "./pages/Conductores/Conductores";
import Configuracion from "./pages/Configuracion/Configuracion";
import Dashboard from "./pages/Dashboard/Dashboard";
import LogsAuditoria from "./pages/LogsAuditoria/LogsAuditoria";
import Movimientos from "./pages/Movimientos/Movimientos";
import Perfil from "./pages/Perfil/Perfil";
import Reportes from "./pages/Reportes/Reportes";
import Usuarios from "./pages/Usuarios/Usuarios";
import Vehiculos from "./pages/Vehiculos/Vehiculos";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehiculos" element={<Vehiculos />} />
          <Route path="conductores" element={<Conductores />} />
          <Route path="movimientos" element={<Movimientos />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="logs" element={<LogsAuditoria />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
