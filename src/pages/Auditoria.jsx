import { useState, useEffect, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import FilterPanel, { useFilters } from "../components/common/FilterPanel";
import StatusBadge from "../components/common/StatusBadge";
import { AUDIT_OPERATIONS, SYSTEM_TABLES } from "../constants";
import { FiSearch, FiFilter, FiCalendar, FiUser, FiDatabase, FiEye, FiFileText, FiActivity, FiClock, FiDownload } from "react-icons/fi";

// Datos simulados - movidos fuera del componente para evitar re-renders
const mockLogs = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    tabla: "vehiculos",
    operacion: "UPDATE",
    registroId: 1,
    usuarioId: 1,
    usuario: { nombre: "Admin", apellido: "Sistema" },
    descripcion:
      "Actualización del estado del vehículo V001 de 'Disponible' a 'En operación'",
    fecha: "2024-10-15T14:30:00Z",
    detalles: {
      camposModificados: ["estadoActual"],
      valorAnterior: { estadoActual: "Disponible" },
      valorNuevo: { estadoActual: "En operación" },
    },
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    tabla: "conductores",
    operacion: "INSERT",
    registroId: 5,
    usuarioId: 2,
    usuario: { nombre: "María", apellido: "García" },
    descripcion: "Creación de nuevo conductor C005 - Roberto Mendoza",
    fecha: "2024-10-15T10:15:00Z",
    detalles: {
      registroCreado: {
        codigo: "C005",
        nombre: "Roberto",
        apellido: "Mendoza",
        dni: "12345678",
        estado: "Activo",
      },
    },
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    tabla: "movimientos",
    operacion: "UPDATE",
    registroId: 3,
    usuarioId: 1,
    usuario: { nombre: "Admin", apellido: "Sistema" },
    descripcion:
      "Actualización del estado del movimiento MOV-003 de 'Programado' a 'En curso'",
    fecha: "2024-10-15T08:00:00Z",
    detalles: {
      camposModificados: ["estado", "fechaHoraSalidaReal"],
      valorAnterior: { estado: "Programado", fechaHoraSalidaReal: null },
      valorNuevo: {
        estado: "En curso",
        fechaHoraSalidaReal: "2024-10-15T08:00:00Z",
      },
    },
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    tabla: "usuarios",
    operacion: "DELETE",
    registroId: 8,
    usuarioId: 1,
    usuario: { nombre: "Admin", apellido: "Sistema" },
    descripcion: "Eliminación (soft delete) del usuario temporal@test.com",
    fecha: "2024-10-14T16:45:00Z",
    detalles: {
      registroEliminado: {
        email: "temporal@test.com",
        nombre: "Usuario",
        apellido: "Temporal",
        rol: "Operador",
      },
    },
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    tabla: "configuraciones",
    operacion: "UPDATE",
    registroId: 1,
    usuarioId: 1,
    usuario: { nombre: "Admin", apellido: "Sistema" },
    descripcion:
      "Actualización de configuración max_velocidad_carretera de '80' a '90'",
    fecha: "2024-10-14T12:20:00Z",
    detalles: {
      camposModificados: ["valor"],
      valorAnterior: { valor: "80" },
      valorNuevo: { valor: "90" },
    },
  },
];

const Auditoria = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  // Hook para manejar filtros
  const {
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    filters,
    updateFilter,
    getFilteredData
  } = useFilters({
    tabla: '',
    operacion: '',
    usuario: '',
    fecha: ''
  });

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setLogs(mockLogs);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error al cargar logs de auditoría:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const getOperationBadge = (operacion) => {
    const colors = {
      INSERT: "bg-success-100 text-success-700",
      UPDATE: "bg-info-100 text-info-700",
      DELETE: "bg-danger-100 text-danger-700",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[operacion] || "bg-gray-100 text-gray-700"
        }`}
      >
        {operacion}
      </span>
    );
  };

  const getTableIcon = (tabla) => {
    const icons = {
      vehiculos: "🚛",
      conductores: "👨‍💼",
      movimientos: "📍",
      usuarios: "👤",
      roles: "🛡️",
      configuraciones: "⚙️",
      reportes: "📊",
    };
    return icons[tabla] || "📄";
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
  };

  const handleDownloadLog = (log) => {
    try {
      const logData = {
        id: log.id,
        fecha: log.fecha,
        usuario: `${log.usuario.nombre} ${log.usuario.apellido}`,
        tabla: log.tabla,
        operacion: log.operacion,
        registroId: log.registroId,
        descripcion: log.descripcion,
        detalles: log.detalles
      };
      
      const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `log_auditoria_${log.id.slice(0, 8)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar log:", error);
    }
  };

  const handleExportAllLogs = () => {
    try {
      const allLogsData = filteredLogs.map(log => ({
        id: log.id,
        fecha: log.fecha,
        usuario: `${log.usuario.nombre} ${log.usuario.apellido}`,
        tabla: log.tabla,
        operacion: log.operacion,
        registroId: log.registroId,
        descripcion: log.descripcion,
        detalles: log.detalles
      }));
      
      const blob = new Blob([JSON.stringify(allLogsData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs_auditoria_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar logs:", error);
    }
  };

  // Función personalizada de filtrado para logs de auditoría
  const customLogFilter = (log, searchTerm) => {
    return (
      log.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.tabla.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${log.usuario.nombre} ${log.usuario.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.operacion.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Obtener logs filtrados
  const filteredLogs = getFilteredData(logs, customLogFilter).filter((log) => {
    const matchesTable = !filters.tabla || log.tabla === filters.tabla;
    const matchesOperation = !filters.operacion || log.operacion === filters.operacion;
    const matchesUser = !filters.usuario || log.usuarioId.toString() === filters.usuario;
    const matchesDate = !filters.fecha || log.fecha.startsWith(filters.fecha);

    return matchesTable && matchesOperation && matchesUser && matchesDate;
  });

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatTableName = (tabla) => {
    const names = {
      vehiculos: "Vehículos",
      conductores: "Conductores",
      movimientos: "Movimientos",
      usuarios: "Usuarios",
      roles: "Roles",
      configuraciones: "Configuraciones",
      reportes: "Reportes",
    };
    return names[tabla] || tabla;
  };

  // Obtener usuarios únicos para el filtro
  const uniqueUsers = [
    ...new Map(logs.map((log) => [log.usuarioId, log.usuario])).values(),
  ];

  return (
    <MainLayout activeMenu="Auditoría">
      {/* Header Superior */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Logs de Auditoría</h1>
            <p className="text-gray-500 text-sm mt-1">
              Consulta el historial completo de cambios en el sistema
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiDatabase className="w-4 h-4" />
              <span>{filteredLogs.length} registros</span>
            </div>
            <button
              onClick={handleExportAllLogs}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FiDownload className="text-xl" />
              Exportar Logs
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filtros */}
        <FilterPanel
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilterValue={activeFilter}
          onActiveFilterChange={setActiveFilter}
          searchPlaceholder="Buscar en logs de auditoría..."
          activeLabel="Recientes"
          inactiveLabel="Antiguos"
          allLabel="Todos"
          filters={[
            {
              key: 'tabla',
              label: 'Tabla',
              type: 'select',
              value: filters.tabla,
              options: Object.values(SYSTEM_TABLES || {}).map((tabla) => ({
                value: tabla,
                label: formatTableName(tabla)
              }))
            },
            {
              key: 'operacion',
              label: 'Operación',
              type: 'select',
              value: filters.operacion,
              options: Object.values(AUDIT_OPERATIONS || {}).map((op) => ({
                value: op,
                label: op
              }))
            },
            {
              key: 'usuario',
              label: 'Usuario',
              type: 'select',
              value: filters.usuario,
              options: uniqueUsers.map((user) => ({
                value: user.usuarioId?.toString() || '',
                label: `${user.nombre} ${user.apellido}`
              }))
            },
            {
              key: 'fecha',
              label: 'Fecha',
              type: 'date',
              value: filters.fecha
            }
          ]}
          onFilterChange={updateFilter}
        />

        {/* Badges de estado */}
        <div className="flex gap-4">
          <div className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Total de Logs</span>
            <span className="bg-white text-blue-500 px-3 py-1 rounded-full font-bold">
              {logs.length}
            </span>
          </div>
          <div className="bg-success-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Operaciones INSERT</span>
            <span className="bg-white text-success-500 px-3 py-1 rounded-full font-bold">
              {logs.filter(l => l.operacion === 'INSERT').length}
            </span>
          </div>
          <div className="bg-warning-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Operaciones UPDATE</span>
            <span className="bg-white text-warning-500 px-3 py-1 rounded-full font-bold">
              {logs.filter(l => l.operacion === 'UPDATE').length}
            </span>
          </div>
          <div className="bg-danger-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <span className="font-semibold">Operaciones DELETE</span>
            <span className="bg-white text-danger-500 px-3 py-1 rounded-full font-bold">
              {logs.filter(l => l.operacion === 'DELETE').length}
            </span>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="bg-green-600 p-2 rounded">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Logs de Auditoría
              </h2>
            </div>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Cargando logs de auditoría...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No se encontraron logs de auditoría</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tabla
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Operación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-100 p-2 rounded">
                              <FiClock className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {formatDateTime(log.fecha)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {log.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded">
                              <FiUser className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {log.usuario.nombre} {log.usuario.apellido}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {log.usuarioId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded">
                              <span className="text-lg">
                                {getTableIcon(log.tabla)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {formatTableName(log.tabla)}
                              </div>
                              <div className="text-sm text-gray-500">
                                Registro ID: {log.registroId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge 
                            status={log.operacion}
                            variant={
                              log.operacion === 'INSERT' ? 'success' :
                              log.operacion === 'UPDATE' ? 'warning' :
                              log.operacion === 'DELETE' ? 'danger' : 'info'
                            }
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {log.descripcion}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDetails(log)}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                              title="Ver detalles"
                            >
                              <FiEye className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDownloadLog(log)}
                              className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors"
                              title="Descargar log"
                            >
                              <FiDownload className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl mx-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-lg">
                <FiActivity className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Detalles del Log de Auditoría
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="ml-auto text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID del Log
                  </label>
                  <p className="text-sm text-gray-900 font-mono bg-white p-2 rounded border">
                    {selectedLog.id}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha y Hora
                  </label>
                  <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                    {formatDateTime(selectedLog.fecha)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuario Responsable
                  </label>
                  <div className="bg-white p-2 rounded border">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedLog.usuario.nombre} {selectedLog.usuario.apellido}
                    </p>
                    <p className="text-xs text-gray-500">ID: {selectedLog.usuarioId}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tabla Afectada
                  </label>
                  <div className="bg-white p-2 rounded border">
                    <p className="text-sm font-medium text-gray-900">
                      {formatTableName(selectedLog.tabla)}
                    </p>
                    <p className="text-xs text-gray-500">Registro ID: {selectedLog.registroId}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Operación
                </label>
                <div className="bg-white p-2 rounded border">
                  <StatusBadge 
                    status={selectedLog.operacion}
                    variant={
                      selectedLog.operacion === 'INSERT' ? 'success' :
                      selectedLog.operacion === 'UPDATE' ? 'warning' :
                      selectedLog.operacion === 'DELETE' ? 'danger' : 'info'
                    }
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción de la Operación
                </label>
                <p className="text-sm text-gray-900 bg-white p-3 rounded border leading-relaxed">
                  {selectedLog.descripcion}
                </p>
              </div>

              {selectedLog.detalles && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detalles Técnicos
                  </label>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-xs font-mono">
                      {JSON.stringify(selectedLog.detalles, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Auditoria;
