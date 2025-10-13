import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { dashboardService } from "../services/dashboardService";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Dashboard = () => {
  // Estados para los datos
  const [stats, setStats] = useState({
    vehiculos: { total: 0, activos: 0, enMantenimiento: 0, disponibles: 0, inactivos: 0 },
    conductores: { total: 0, activos: 0, inactivos: 0, enViaje: 0 },
    usuarios: { total: 0, activos: 0, inactivos: 0 },
    movimientos: { total: 0, completados: 0, enCurso: 0, programados: 0, cancelados: 0 }
  });
  const [movimientosData, setMovimientosData] = useState([]);
  const [movimientoGraficoData, setMovimientoGraficoData] = useState([]);
  const [usuariosData, setUsuariosData] = useState([]);
  const [percentages, setPercentages] = useState({ vehiculos: 0, usuarios: 0, movimientos: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vehiculos');

  // Cargar datos al montar el componente
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar todas las estadísticas
      const [statsResponse, movimientosResponse, semanalResponse, usuariosResponse] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getMovimientosChart(),
        dashboardService.getMovimientoSemanal(),
        dashboardService.getUsuariosStats()
      ]);

      const statsData = statsResponse.data;
      setStats(statsData);
      setMovimientosData(movimientosResponse.data);
      setMovimientoGraficoData(semanalResponse.data);
      setUsuariosData(usuariosResponse.data);

      // Calcular porcentajes
      const calculatedPercentages = dashboardService.calculatePercentages(statsData);
      setPercentages(calculatedPercentages);

    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout activeMenu="Dashboard">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Hola Administrador Bienvenido Al Dashboard
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-info-100 text-info-600 rounded-lg hover:bg-info-200 transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Filtrar por Fecha</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Vehículos */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-success-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">
                  {loading ? "..." : stats.vehiculos.total}
                </p>
                <p className="text-gray-500 text-sm">Vehículos</p>
              </div>
            </div>
          </div>

          {/* Conductores */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-success-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">
                  {loading ? "..." : stats.conductores.total}
                </p>
                <p className="text-gray-500 text-sm">Conductores</p>
              </div>
            </div>
          </div>

          {/* Usuarios */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">
                  {loading ? "..." : stats.usuarios.total}
                </p>
                <p className="text-gray-500 text-sm">Usuarios</p>
              </div>
            </div>
          </div>

          {/* Movimientos */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-success-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">
                  {loading ? "..." : stats.movimientos.total}
                </p>
                <p className="text-gray-500 text-sm">Movimientos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donut Charts */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-8">
                <button 
                  onClick={() => setActiveTab('vehiculos')}
                  className={`font-medium pb-2 transition-colors ${
                    activeTab === 'vehiculos' 
                      ? 'text-gray-800 border-b-2 border-primary-600' 
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Vehículos
                </button>
                <button 
                  onClick={() => setActiveTab('usuarios')}
                  className={`font-medium pb-2 transition-colors ${
                    activeTab === 'usuarios' 
                      ? 'text-gray-800 border-b-2 border-primary-600' 
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Usuarios
                </button>
                <button 
                  onClick={() => setActiveTab('movimientos')}
                  className={`font-medium pb-2 transition-colors ${
                    activeTab === 'movimientos' 
                      ? 'text-gray-800 border-b-2 border-primary-600' 
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Movimientos
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Gráfico Principal - Cambia según pestaña activa */}
              <div className="text-center">
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={[
                        { value: percentages[activeTab] }, 
                        { value: 100 - percentages[activeTab] }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill={
                        activeTab === 'vehiculos' ? "#ef4444" :
                        activeTab === 'usuarios' ? "#22c55e" :
                        "#3b82f6"
                      } />
                      <Cell fill={
                        activeTab === 'vehiculos' ? "#fee2e2" :
                        activeTab === 'usuarios' ? "#dcfce7" :
                        "#dbeafe"
                      } />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {loading ? "..." : `${percentages[activeTab]}%`}
                </p>
                <p className="text-sm text-gray-500">
                  {activeTab === 'vehiculos' ? 'Vehículos Activos' :
                   activeTab === 'usuarios' ? 'Usuarios Activos' :
                   'Movimientos Completados'}
                </p>
              </div>

              {/* Detalles por categoría */}
              <div className="col-span-2">
                {activeTab === 'vehiculos' && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="font-semibold text-green-800">Activos</p>
                      <p className="text-2xl font-bold text-green-600">{stats.vehiculos.activos}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="font-semibold text-yellow-800">En Mantenimiento</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.vehiculos.enMantenimiento}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="font-semibold text-blue-800">Disponibles</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.vehiculos.disponibles}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-semibold text-gray-800">Inactivos</p>
                      <p className="text-2xl font-bold text-gray-600">{stats.vehiculos.inactivos}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'usuarios' && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="font-semibold text-green-800">Activos</p>
                      <p className="text-2xl font-bold text-green-600">{stats.usuarios.activos}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="font-semibold text-red-800">Inactivos</p>
                      <p className="text-2xl font-bold text-red-600">{stats.usuarios.inactivos}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'movimientos' && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="font-semibold text-green-800">Completados</p>
                      <p className="text-2xl font-bold text-green-600">{stats.movimientos.completados}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="font-semibold text-blue-800">En Curso</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.movimientos.enCurso}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="font-semibold text-yellow-800">Programados</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.movimientos.programados}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="font-semibold text-red-800">Cancelados</p>
                      <p className="text-2xl font-bold text-red-600">{stats.movimientos.cancelados}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Movimiento Grafico */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Movimiento Grafico
                </h3>
                <p className="text-sm text-gray-500">Los últimos movimientos</p>
              </div>
              <button className="px-4 py-2 bg-info-100 text-info-600 rounded-lg text-sm hover:bg-info-200 transition-colors">
                Reporte
              </button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={movimientoGraficoData}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorArea)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-2 mt-4">
              <span className="text-xs text-gray-500">45 Orde</span>
              <span className="text-xs text-gray-500">6 hr</span>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Movimientos Totales */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Movimientos Totales
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={movimientosData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="valor1"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444", r: 4 }}
                  name="2025"
                />
                <Line
                  type="monotone"
                  dataKey="valor2"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  name="2024"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Porcentajes de Usuarios */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Porcentajes de Usuarios
                </h3>
                <p className="text-sm text-gray-500">
                  desde 1-30 Octubre, 2025
                </p>
              </div>
              <button className="px-4 py-2 bg-info-100 text-info-600 rounded-lg text-sm hover:bg-info-200 transition-colors">
                Reporte
              </button>
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={usuariosData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {usuariosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-8 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <span className="text-sm text-gray-600">Inactivos 40%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <span className="text-sm text-gray-600">Activos 32%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
