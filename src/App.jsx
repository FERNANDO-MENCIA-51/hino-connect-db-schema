import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Usuarios from './pages/Usuarios'
import Vehiculos from './pages/Vehiculos'
import Conductores from './pages/Conductores'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/vehiculos" element={<Vehiculos />} />
        <Route path="/conductores" element={<Conductores />} />
      </Routes>
    </Router>
  )
}

export default App
