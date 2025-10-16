import { Calendar, Package, TrendingUp, Truck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { conductorService } from "../../services/conductorService";
import { movimientoService } from "../../services/movimientoService";
import { usuarioService } from "../../services/usuarioService";
import { vehiculoService } from "../../services/vehiculoService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    vehiculos: 0,
    conductores: 0,
    usuarios: 0,
    movimientos: 0,
  });
  const [vehiculosData, setVehiculosData] = useState([]);
  const [movimientosData, setMovimientosData] = useState([]);
  const [usuariosData, setUsuariosData] = useState([]);
  const [movimientosTotales, setMovimientosTotales] = useState([]);

  useEffect(() => {
    loadStats();
    loadChartData();
  }, []);

  const loadStats = async () => {
    try {
      const [vehiculos, conductores, movimientos, usuarios] = await Promise.all(
        [
          vehiculoService.getAll(),
          conductorService.getAll(),
          movimientoService.getAll(),
          usuarioService.getAll().catch(() => []),
        ]
      );

      setStats({
        vehiculos: vehiculos?.length || 0,
        conductores: conductores?.length || 0,
        usuarios: usuarios?.length || 0,
        movimientos: movimientos?.length || 0,
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const loadChartData = async () => {
    try {
      const [vehiculos, movimientos, usuarios] = await Promise.all([
        vehiculoService.getAll(),
        movimientoService.getAll(),
        usuarioService.getAll().catch(() => []),
      ]);

      // Datos para gráfico de vehículos (por estado)
      const totalVehiculos = vehiculos?.length || 1;
      const vehiculosActivos =
        vehiculos?.filter((v) => v.estado === "Activo").length || 0;
      const vehiculosInactivos =
        vehiculos?.filter((v) => v.estado === "Inactivo").length || 0;
      const vehiculosMantenimiento =
        vehiculos?.filter((v) => v.estado === "Mantenimiento").length || 0;

      setVehiculosData([
        {
          name: "Activos",
          value: vehiculosActivos || 1,
          percentage: Math.round((vehiculosActivos / totalVehiculos) * 100),
        },
        {
          name: "Inactivos",
          value: vehiculosInactivos || 0,
          percentage: Math.round((vehiculosInactivos / totalVehiculos) * 100),
        },
        {
          name: "Mantenimiento",
          value: vehiculosMantenimiento || 0,
          percentage: Math.round(
            (vehiculosMantenimiento / totalVehiculos) * 100
          ),
        },
      ]);

      // Datos para gráfico de usuarios (activos vs inactivos)
      const totalUsuarios = usuarios?.length || 1;
      const usuariosActivos =
        usuarios?.filter((u) => u.estado === "Activo").length || 0;
      const usuariosInactivos =
        usuarios?.filter((u) => u.estado === "Inactivo").length || 0;

      setUsuariosData([
        {
          name: "Activos",
          value: usuariosActivos || 1,
          percentage: Math.round((usuariosActivos / totalUsuarios) * 100),
        },
        {
          name: "Inactivos",
          value: usuariosInactivos || 0,
          percentage: Math.round((usuariosInactivos / totalUsuarios) * 100),
        },
      ]);

      // Datos para gráfico de movimientos por mes
      const meses = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];

      const movimientosPorMes = {};
      movimientos?.forEach((mov) => {
        const fecha = new Date(mov.fecha_salida);
        const mesIndex = fecha.getMonth();
        const mes = meses[mesIndex];
        movimientosPorMes[mes] = (movimientosPorMes[mes] || 0) + 1;
      });

      const movimientosChart = meses.map((mes) => ({
        mes,
        movimientos: movimientosPorMes[mes] || 0,
      }));

      setMovimientosData(movimientosChart);

      // Datos para gráfico de movimientos totales (entrada/salida)
      const movimientosTotalesData = meses.map((mes) => {
        const movsMes =
          movimientos?.filter((mov) => {
            const fecha = new Date(mov.fecha_salida);
            return meses[fecha.getMonth()] === mes;
          }) || [];

        return {
          mes,
          entrada: movsMes.filter((m) => m.tipo === "Entrada").length,
          salida: movsMes.filter((m) => m.tipo === "Salida").length,
        };
      });

      setMovimientosTotales(movimientosTotalesData);
    } catch (error) {
      console.error("Error al cargar datos de gráficos:", error);
      // Datos de ejemplo si falla
      setVehiculosData([
        { name: "Activos", value: 8, percentage: 81 },
        { name: "Inactivos", value: 2, percentage: 19 },
      ]);
      setUsuariosData([
        { name: "Activos", value: 4, percentage: 22 },
        { name: "Inactivos", value: 2, percentage: 78 },
      ]);
    }
  };

  const statCards = [
    {
      title: "Vehículos",
      value: stats.vehiculos,
      icon: Truck,
      color: "#10b981",
      bgColor: "bg-green-50",
    },
    {
      title: "Conductores",
      value: stats.conductores,
      icon: Users,
      color: "#3b82f6",
      bgColor: "bg-blue-50",
    },
    {
      title: "Usuarios",
      value: stats.usuarios,
      icon: Package,
      color: "#8b5cf6",
      bgColor: "bg-purple-50",
    },
    {
      title: "Movimientos",
      value: stats.movimientos,
      icon: TrendingUp,
      color: "#10b981",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Hola Administrados Bienvenido Al Dashboard
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Filtrar por Fecha</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4"
          >
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-xs text-gray-500">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Side - 3 Donut Charts */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Vehículos */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Vehículos
              </h3>
              <div className="relative" style={{ height: "140px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vehiculosData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      paddingAngle={0}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      <Cell fill="#ef4444" />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-2xl font-bold text-gray-800">
                    {vehiculosData[0]?.percentage || 81}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                Total Vehículos
              </p>
              <p className="text-lg font-bold text-center text-gray-800">
                {stats.vehiculos}
              </p>
            </div>

            {/* Usuarios */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Usuarios
              </h3>
              <div className="relative" style={{ height: "140px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={usuariosData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      paddingAngle={0}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-2xl font-bold text-gray-800">
                    {usuariosData[0]?.percentage || 22}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                Total Usuarios
              </p>
              <p className="text-lg font-bold text-center text-gray-800">
                {stats.usuarios}
              </p>
            </div>

            {/* Movimientos */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Movimientos
              </h3>
              <div className="relative" style={{ height: "140px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: 62 }, { value: 38 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      paddingAngle={0}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-2xl font-bold text-gray-800">62%</p>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                Total Movimientos
              </p>
              <p className="text-lg font-bold text-center text-gray-800">
                {stats.movimientos}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Movimiento Gráfico */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                Movimiento Gráfico
              </h3>
              <p className="text-xs text-gray-400">Ver los movimientos</p>
            </div>
            <button className="px-3 py-1.5 text-xs text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
              Reporte
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={movimientosData}>
              <defs>
                <linearGradient
                  id="colorMovimientos"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="mes"
                stroke="#94a3b8"
                style={{ fontSize: "11px" }}
              />
              <YAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="movimientos"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMovimientos)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Section - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Movimientos Totales Line Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              Movimientos Totales
            </h3>
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">202</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">30</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={movimientosTotales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="mes"
                stroke="#94a3b8"
                style={{ fontSize: "11px" }}
              />
              <YAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="entrada"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: "#3b82f6", r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="salida"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ fill: "#ef4444", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Porcentajes de Usuarios */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                Porcentajes de Usuarios
              </h3>
              <p className="text-xs text-gray-400">desde 1-30 Octubre 2025</p>
            </div>
            <button className="px-3 py-1.5 text-xs text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
              Reporte
            </button>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={usuariosData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill="#6366f1" />
                  <Cell fill="#c7d2fe" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-200 rounded-sm"></div>
              <span className="text-xs text-gray-600">
                Inactivos {usuariosData[1]?.percentage || 40}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
              <span className="text-xs text-gray-600">
                Activos {usuariosData[0]?.percentage || 32}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
