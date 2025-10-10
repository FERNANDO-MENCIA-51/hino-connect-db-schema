import { Calendar } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
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
  // Datos para los gráficos
  const movimientosData = [
    { mes: "Ene", valor1: 520, valor2: 320 },
    { mes: "Feb", valor1: 580, valor2: 420 },
    { mes: "Mar", valor1: 530, valor2: 480 },
    { mes: "Abr", valor1: 620, valor2: 380 },
    { mes: "May", valor1: 590, valor2: 520 },
    { mes: "Jun", valor1: 550, valor2: 450 },
    { mes: "Jul", valor1: 600, valor2: 500 },
    { mes: "Ago", valor1: 580, valor2: 420 },
    { mes: "Sept", valor1: 620, valor2: 480 },
  ];

  const movimientoGraficoData = [
    { mes: "Lun", valor: 45 },
    { mes: "Mar", valor: 52 },
    { mes: "Mier", valor: 48 },
    { mes: "Juev", valor: 55 },
    { mes: "Vier", valor: 50 },
    { mes: "Sab", valor: 58 },
    { mes: "Dom", valor: 53 },
  ];

  const usuariosData = [
    { name: "Inactivos", value: 40, color: "#a78bfa" },
    { name: "Activos", value: 32, color: "#6366f1" },
  ];

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
                <p className="text-3xl font-bold text-gray-800">10</p>
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
                <p className="text-3xl font-bold text-gray-800">5</p>
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
                <p className="text-3xl font-bold text-gray-800">2</p>
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
                <p className="text-3xl font-bold text-gray-800">12</p>
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
                <button className="text-gray-800 font-medium border-b-2 border-primary-600 pb-2">
                  Vehículos
                </button>
                <button className="text-gray-500 hover:text-gray-800 pb-2">
                  Usuarios
                </button>
                <button className="text-gray-500 hover:text-gray-800 pb-2">
                  Movimientos
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Vehículos Chart */}
              <div className="text-center">
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={[{ value: 81 }, { value: 19 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill="#ef4444" />
                      <Cell fill="#fee2e2" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-2xl font-bold text-gray-800 mt-2">81%</p>
                <p className="text-sm text-gray-500">Total Vehículos</p>
              </div>

              {/* Usuarios Chart */}
              <div className="text-center">
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={[{ value: 22 }, { value: 78 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#dcfce7" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-2xl font-bold text-gray-800 mt-2">22%</p>
                <p className="text-sm text-gray-500">Total Usuarios</p>
              </div>

              {/* Movimientos Chart */}
              <div className="text-center">
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={[{ value: 62 }, { value: 38 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#dbeafe" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-2xl font-bold text-gray-800 mt-2">62%</p>
                <p className="text-sm text-gray-500">Total Movimientos</p>
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
