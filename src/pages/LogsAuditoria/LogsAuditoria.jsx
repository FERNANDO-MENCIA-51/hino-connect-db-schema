/* eslint-disable no-unused-vars */
import { Calendar, FileText, Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { logAuditoriaService } from "../../services/logAuditoriaService";
import { showErrorAlert } from "../../utils/alerts";

const LogsAuditoria = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTabla, setFilterTabla] = useState("todos");
  const [filterOperacion, setFilterOperacion] = useState("todos");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await logAuditoriaService.getRecientes(100);
      setLogs(data || []);
    } catch (error) {
      showErrorAlert("Error", "No se pudieron cargar los logs");
    } finally {
      setLoading(false);
    }
  };

  const getOperacionBadge = (operacion) => {
    const badges = {
      INSERT: "bg-green-100 text-green-800",
      UPDATE: "bg-blue-100 text-blue-800",
      DELETE: "bg-red-100 text-red-800",
    };
    return badges[operacion] || "bg-gray-100 text-gray-800";
  };

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.tabla?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTabla = filterTabla === "todos" || log.tabla === filterTabla;
    const matchOperacion =
      filterOperacion === "todos" || log.operacion === filterOperacion;
    return matchSearch && matchTabla && matchOperacion;
  });

  const tablas = ["todos", ...new Set(logs.map((l) => l.tabla))];
  const operaciones = ["todos", "INSERT", "UPDATE", "DELETE"];

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500 p-3 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Logs de Auditoría
            </h1>
            <p className="text-gray-600">Historial de cambios en el sistema</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Filter className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-gray-800">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar en logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tabla
            </label>
            <select
              value={filterTabla}
              onChange={(e) => setFilterTabla(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {tablas.map((tabla) => (
                <option key={tabla} value={tabla}>
                  {tabla === "todos" ? "Todas las tablas" : tabla}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operación
            </label>
            <select
              value={filterOperacion}
              onChange={(e) => setFilterOperacion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {operaciones.map((op) => (
                <option key={op} value={op}>
                  {op === "todos" ? "Todas las operaciones" : op}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Logs</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {logs.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Inserciones</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {logs.filter((l) => l.operacion === "INSERT").length}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Actualizaciones</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {logs.filter((l) => l.operacion === "UPDATE").length}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Eliminaciones</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {logs.filter((l) => l.operacion === "DELETE").length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-indigo-100 p-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-800">Historial de Cambios</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tabla
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Operación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Registro ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Descripción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Cargando...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No se encontraron logs
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(log.fecha).toLocaleString("es-PE")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        {log.tabla}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getOperacionBadge(
                          log.operacion
                        )}`}
                      >
                        {log.operacion}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.registroId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Usuario {log.usuarioId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.descripcion}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogsAuditoria;
