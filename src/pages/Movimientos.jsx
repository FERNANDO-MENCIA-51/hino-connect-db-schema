import { useEffect, useMemo, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { FaDownload, FaPen, FaTrash, FaEye, FaUndo } from "react-icons/fa";
import { movimientosService } from "../services/movimientosService";
import { vehiculoService } from "../services/vehiculoService";
import { conductoresService } from "../services/conductoresService";
import ModalMovimiento from "../components/movimientos/ModalMovimiento";
import DetailsMovement from "../components/movimientos/DetailsMovement";
import UpdateMovimiento from "../components/movimientos/UpdateMovimiento";

function Movimientos() {
  const [search, setSearch] = useState("");
  const [vehiculoFiltro, setVehiculoFiltro] = useState("todos");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vehMap, setVehMap] = useState({}); // id -> placa/codigo
  const [condMap, setCondMap] = useState({}); // id -> nombre completo
  const [showModal, setShowModal] = useState(false);
  const [detailMov, setDetailMov] = useState(null);
  const [editMov, setEditMov] = useState(null);

  const cargarMovimientos = async () => {
    try {
      setLoading(true);
      setError("");
      const [movRes, vehRes, condRes] = await Promise.allSettled([
        movimientosService.listar(),
        vehiculoService.listarVehiculos(),
        conductoresService.listarConductores(),
      ]);

      if (movRes.status !== "fulfilled") {
        throw movRes.reason || "No se pudieron cargar los movimientos";
      }
      const resMov = movRes.value;
      const resVeh = vehRes.status === "fulfilled" ? vehRes.value : [];
      const resCond = condRes.status === "fulfilled" ? condRes.value : [];

      const listaMov = Array.isArray(resMov?.data) ? resMov.data : Array.isArray(resMov) ? resMov : [];
      const vehs = Array.isArray(resVeh?.data) ? resVeh.data : Array.isArray(resVeh) ? resVeh : [];
      const conds = Array.isArray(resCond?.data) ? resCond.data : Array.isArray(resCond) ? resCond : [];

      const vehIndex = {};
      vehs.forEach((v) => {
        const label = v.placa || v.codigo || v.id;
        if (v.id != null) vehIndex[v.id] = label;
      });
      const condIndex = {};
      conds.forEach((c) => {
        const name = [c.nombre, c.apellido].filter(Boolean).join(" ") || c.id;
        if (c.id != null) condIndex[c.id] = name;
      });

      setVehMap(vehIndex);
      setCondMap(condIndex);

      // Normalizar campos aceptando camelCase del backend Java y alternativas snake_case
      const normalizados = listaMov.map((m) => ({
        id: m.id ?? m.codigo ?? "",
        codigo: m.codigo,
        vehiculo_id: m.vehiculo_id ?? m.vehiculoId ?? null,
        conductor_id: m.conductor_id ?? m.conductorId ?? null,
        origen: m.origen,
        destino: m.destino,
  fecha_salida: m.fechaHoraSalida ?? m.fecha_hora_salida ?? "",
        fecha_llegada_estimada: m.fechaHoraLlegadaEstimada ?? m.fecha_hora_llegada_estimada ?? null,
        fecha_llegada_real: m.fechaHoraLlegadaReal ?? m.fecha_hora_llegada_real ?? null,
        tipo_movimiento: m.tipoMovimiento ?? m.tipo_movimiento ?? m.tipo,
        carga_pasajeros: m.cargaPasajeros ?? m.carga_pasajeros ?? m.carga,
        estado: m.estado,
        observaciones: m.observaciones,
        created_at: m.createdAt ?? m.created_at ?? null,
        updated_at: m.updatedAt ?? m.updated_at ?? null,
        deleted_at: m.deletedAt ?? m.deleted_at ?? null,
      }));

      setMovimientos(normalizados);
    } catch (e) {
      setError(typeof e === "string" ? e : "No se pudieron cargar los movimientos");
      setMovimientos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const formatFecha = (iso) => {
    if (!iso) return "";
    try {
      const value = typeof iso === 'string' && iso.includes(' ') && !iso.includes('T') ? iso.replace(' ', 'T') : iso;
      const d = new Date(value);
      const fecha = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
      let hora = new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true }).format(d);
      hora = hora.replace(/\./g, '').replace(/\s+/g, ' ').replace('a m', 'am').replace('p m', 'pm');
      return `${fecha} ${hora}`;
    } catch {
      return String(iso);
    }
  };

  const filtered = useMemo(() => {
    const texto = search.toLowerCase();
    return movimientos.filter((m) => {
      const vehiculo = vehMap[m.vehiculo_id] || "No asignado";
      const conductor = condMap[m.conductor_id] || "No asignado";
      const fechaSalida = formatFecha(m.fecha_salida);
      const porTexto = [m.id, m.codigo, vehiculo, conductor, m.origen, m.destino, m.estado, fechaSalida]
        .join(" ")
        .toLowerCase()
        .includes(texto);

      const porVehiculo =
        vehiculoFiltro === "todos" ||
        (vehiculoFiltro === "asignados" && !!m.conductor_id) ||
        (vehiculoFiltro === "no-asignados" && !m.conductor_id);

      const porEstado =
        estadoFiltro === "todos" ||
        (estadoFiltro === "inactivos" && m.estado === "Inactivo") ||
        (estadoFiltro === "activos" && m.estado === "En curso");

      return porTexto && porVehiculo && porEstado;
    });
  }, [movimientos, search, vehiculoFiltro, estadoFiltro, vehMap, condMap]);

  // Ordenar por fecha de salida (más reciente primero)
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const da = a.fecha_salida ? new Date(a.fecha_salida).getTime() : 0;
      const db = b.fecha_salida ? new Date(b.fecha_salida).getTime() : 0;
      return db - da;
    });
  }, [filtered]);

  const activeVehicles = useMemo(() => {
    return movimientos.filter((m) => m.estado === "En curso").length;
  }, [movimientos]);

  const inactiveVehicles = useMemo(() => {
    return movimientos.filter((m) => m.estado === "Inactivo").length;
  }, [movimientos]);

  const estadoBadge = (estado) => {
    if (estado === "En curso") return "bg-green-100 text-green-700";
    if (estado === "Completado") return "bg-blue-100 text-blue-700";
    if (estado === "Cancelado") return "bg-red-100 text-red-700";
    if (estado === "Inactivo") return "bg-gray-100 text-gray-700";
    return "bg-blue-100 text-blue-700"; // Programado u otros
  };

  const onExportar = () => {
    const headers = [
      "ID",
      "Código",
      "Vehículo",
      "Conductor",
      "Origen",
      "Destino",
      "Tipo Movimiento",
      "Carga/Pasajeros",
      "Estado",
      "Fecha/Hora salida",
      "Fecha llegada estimada",
      "Fecha llegada real",
      "Observaciones",
      "Creado",
      "Actualizado",
      "Eliminado",
    ]; 
    const rows = sorted.map((m) => [
      m.id,
      m.codigo || "",
      vehMap[m.vehiculo_id] || "No asignado",
      condMap[m.conductor_id] || "No asignado",
      m.origen,
      m.destino,
      m.tipo_movimiento || "",
      m.carga_pasajeros || "",
      m.estado,
      formatFecha(m.fecha_salida),
      formatFecha(m.fecha_llegada_estimada),
      formatFecha(m.fecha_llegada_real),
      m.observaciones || "",
      formatFecha(m.created_at),
      formatFecha(m.updated_at),
      formatFecha(m.deleted_at),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "movimientos.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onInactivar = async (mov) => {
    if (!mov?.id) return;
    const ok = window.confirm("¿Marcar este movimiento como Inactivo?");
    if (!ok) return;
    try {
      const payload = {
        codigo: mov.codigo,
        vehiculoId: mov.vehiculo_id ?? null,
        conductorId: mov.conductor_id ?? null,
        origen: mov.origen,
        destino: mov.destino,
        fechaHoraSalida: mov.fecha_salida ?? null,
        fechaHoraLlegadaEstimada: mov.fecha_llegada_estimada ?? null,
        fechaHoraLlegadaReal: mov.fecha_llegada_real ?? null,
        tipoMovimiento: mov.tipo_movimiento ?? null,
        cargaPasajeros: mov.carga_pasajeros ?? null,
        estado: "Inactivo",
        observaciones: mov.observaciones ?? null,
        createdAt: mov.created_at ?? null,
        updatedAt: mov.updated_at ?? null,
        deletedAt: mov.deleted_at ?? null,
      };
      await movimientosService.actualizar(mov.id, payload);
      await cargarMovimientos();
    } catch (e) {
      alert(typeof e === "string" ? e : "No se pudo inactivar");
    }
  };

  const onActivar = async (mov) => {
    if (!mov?.id) return;
    const ok = window.confirm("¿Activar este movimiento (En curso)?");
    if (!ok) return;
    try {
      const payload = {
        codigo: mov.codigo,
        vehiculoId: mov.vehiculo_id ?? null,
        conductorId: mov.conductor_id ?? null,
        origen: mov.origen,
        destino: mov.destino,
        fechaHoraSalida: mov.fecha_salida ?? null,
        fechaHoraLlegadaEstimada: mov.fecha_llegada_estimada ?? null,
        fechaHoraLlegadaReal: mov.fecha_llegada_real ?? null,
        tipoMovimiento: mov.tipo_movimiento ?? null,
        cargaPasajeros: mov.carga_pasajeros ?? null,
        estado: "En curso",
        observaciones: mov.observaciones ?? null,
        createdAt: mov.created_at ?? null,
        updatedAt: mov.updated_at ?? null,
        deletedAt: mov.deleted_at ?? null,
      };
      await movimientosService.actualizar(mov.id, payload);
      await cargarMovimientos();
    } catch (e) {
      alert(typeof e === "string" ? e : "No se pudo activar");
    }
  };

  return (
    <>
    <MainLayout activeMenu="Movimientos">
      <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
        <div className="bg-white rounded-lg shadow-md mt-6 px-6 py-4 border border-gray-200 w-full max-w-[1118px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <polyline points="19 9 15 13 11 9 7 13 5 11" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">Movimientos</h1>
                <p className="text-gray-500 mt-0.5">Administra y Gestiona los vehículos en la empresa</p>
              </div>
            </div>
            <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium bg-green-600 hover:bg-green-700 active:bg-green-800 transition-colors">
              <span className="text-sm">+ Nuevo Movimiento</span>
            </button>
          </div>
        </div>

        {/* Filtros de Búsqueda */}
        <div className="bg-white rounded-lg shadow-sm mt-6 border border-gray-200 w-full max-w-[1118px]">
          <div className="px-6 pt-4 pb-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-green-600/15">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12 10 19 14 21 14 12 22 3"></polygon>
                </svg>
              </span>
              Filtros de Búsqueda
            </h2>
          </div>
          <div className="px-6 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por placa, estado, modelo, etc."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <select
                value={vehiculoFiltro}
                onChange={(e) => setVehiculoFiltro(e.target.value)}
                className="appearance-none block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg leading-tight focus:outline-none focus:border-blue-500"
              >
                <option value="todos">Todos los vehículos</option>
                <option value="asignados">Vehículos asignados</option>
                <option value="no-asignados">Vehículos no asignados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Movimientos */}
        <div className="bg-white rounded-lg shadow-sm mt-6 border border-gray-200 w-full max-w-[1118px]">
          <div className="flex items-center justify-between px-6 pt-4 pb-2">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-emerald-600/15">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                </svg>
              </span>
              Tabla de Movimientos
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={onExportar} className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white bg-amber-600 hover:bg-amber-700">
                <FaDownload className="w-4 h-4" />
                <span className="text-sm">Exportar Datos</span>
              </button>
              <button onClick={() => setEstadoFiltro("activos")} className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white bg-blue-600">
                Vehículos Activos <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white text-xs">{activeVehicles}</span>
              </button>
              <button onClick={() => setEstadoFiltro("inactivos")} className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white bg-red-600">
                Vehículos Inactivos <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white text-xs">{inactiveVehicles}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-600 text-left">
                <tr>
                  <th className="px-6 py-3">Código</th>
                  <th className="px-6 py-3">Fecha/Hora de salida</th>
                  <th className="px-6 py-3">Fecha/Hora estimada de llegada</th>
                  <th className="px-6 py-3">Vehículo</th>
                  <th className="px-6 py-3">Conductor</th>
                  <th className="px-6 py-3">Origen</th>
                  <th className="px-6 py-3">Destino</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="px-6 py-6 text-center text-gray-500">Cargando movimientos...</td></tr>
                ) : error ? (
                  <tr><td colSpan={8} className="px-6 py-6 text-center text-red-600">{error}</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-6 py-6 text-center text-gray-500">No hay resultados</td></tr>
                ) : (
                  sorted.map((m) => (
                    <tr key={m.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium">{m.codigo || "—"}</td>
                      <td className="px-6 py-3">{formatFecha(m.fecha_salida) || "—"}</td>
                      <td className="px-6 py-3">{formatFecha(m.fecha_llegada_estimada) || "—"}</td>
                      <td className="px-6 py-3">
                        <a href="#" className="text-blue-600 hover:underline">{vehMap[m.vehiculo_id] || "No asignado"}</a>
                      </td>
                      <td className="px-6 py-3">{condMap[m.conductor_id] || "No asignado"}</td>
                      <td className="px-6 py-3">{m.origen}</td>
                      <td className="px-6 py-3">{m.destino}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${estadoBadge(m.estado)}`}>{m.estado}</span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 rounded-md bg-gray-100 hover:bg-gray-200" title="Ver" onClick={() => setDetailMov(m)}><FaEye className="text-gray-700" /></button>
                          <button className="p-2 rounded-md bg-yellow-100 hover:bg-yellow-200" title="Editar" onClick={() => setEditMov(m)}><FaPen className="text-yellow-700" /></button>
                          {m.estado === "Inactivo" ? (
                            <button className="p-2 rounded-md bg-green-100 hover:bg-green-200" title="Activar" onClick={() => onActivar(m)}>
                              <FaUndo className="text-green-700" />
                            </button>
                          ) : (
                            <button className="p-2 rounded-md bg-red-100 hover:bg-red-200" title="Inactivar" onClick={() => onInactivar(m)}>
                              <FaTrash className="text-red-700" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
    {showModal && (
      <ModalMovimiento
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          cargarMovimientos();
        }}
      />
    )}
    {detailMov && (
      <DetailsMovement
        movement={{
          ...detailMov,
          vehiculo_label: vehMap[detailMov.vehiculo_id] || detailMov.vehiculo_id,
          conductor_label: condMap[detailMov.conductor_id] || detailMov.conductor_id,
        }}
        onClose={() => setDetailMov(null)}
      />
    )}
    {editMov && (
      <UpdateMovimiento
        movimiento={editMov}
        onClose={() => setEditMov(null)}
        onSuccess={() => {
          setEditMov(null);
          cargarMovimientos();
        }}
      />
    )}
    </>
  )
}

export default Movimientos;
