import React, { useEffect, useState } from "react";
import { movimientosService } from "../../services/movimientosService";
import { vehiculoService } from "../../services/vehiculoService";
import { conductoresService } from "../../services/conductoresService";

const UpdateMovimiento = ({ movimiento, onClose, onSuccess }) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mapFrom = (m) => ({
    codigo: m.codigo || "",
    vehiculo_id: m.vehiculo_id ?? m.vehiculoId ?? "",
    conductor_id: m.conductor_id ?? m.conductorId ?? "",
    origen: m.origen || "",
    destino: m.destino || "",
    fecha_hora_salida: (m.fecha_salida ?? m.fechaHoraSalida ?? "").toString().replace(" ", "T").slice(0, 16),
    fecha_hora_llegada_estimada: (m.fecha_llegada_estimada ?? m.fechaHoraLlegadaEstimada ?? "").toString().replace(" ", "T").slice(0, 16),
    tipo_movimiento: m.tipo_movimiento ?? m.tipoMovimiento ?? "",
    carga_pasajeros: m.carga_pasajeros ?? m.cargaPasajeros ?? "",
    estado: m.estado || "Programado",
    observaciones: m.observaciones || "",
  });

  const [form, setForm] = useState(mapFrom(movimiento));

  useEffect(() => {
    setForm(mapFrom(movimiento));
  }, [movimiento]);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        setError("");
        const [v, c] = await Promise.all([
          vehiculoService.listarVehiculos(),
          conductoresService.listarConductores(),
        ]);
        const vv = Array.isArray(v?.data) ? v.data : Array.isArray(v) ? v : [];
        const cc = Array.isArray(c?.data) ? c.data : Array.isArray(c) ? c : [];
        setVehiculos(vv);
        setConductores(cc);
      } catch {
        setError("No se pudieron cargar vehículos/conductores");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const normalizeDate = (s) => {
    if (!s) return null;
    return s.length === 16 ? `${s}:00` : s;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.origen?.trim() || !form.destino?.trim() || !form.fecha_hora_salida) {
      alert("Completa origen, destino y fecha/hora de salida");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        codigo: form.codigo || movimiento.codigo,
        vehiculoId: form.vehiculo_id ? Number(form.vehiculo_id) : null,
        conductorId: form.conductor_id ? Number(form.conductor_id) : null,
        origen: form.origen,
        destino: form.destino,
        fechaHoraSalida: normalizeDate(form.fecha_hora_salida),
        fechaHoraLlegadaEstimada: normalizeDate(form.fecha_hora_llegada_estimada),
        tipoMovimiento: form.tipo_movimiento,
        cargaPasajeros: form.carga_pasajeros,
        estado: form.estado,
        observaciones: form.observaciones,
      };
      await movimientosService.actualizar(movimiento.id, payload);
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "No se pudo actualizar el movimiento";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-4 overflow-hidden">
        <div className="px-6 py-4 bg-emerald-600 text-white flex items-center justify-between">
          <h3 className="text-lg font-semibold">Update Movimiento</h3>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-white/10">✕</button>
        </div>
        <div className="p-6">
          {loading ? (
            <p className="text-gray-500">Cargando datos...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Código</label>
                <input name="codigo" value={form.codigo} onChange={onChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="MOV-001" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Vehículo Asignado</label>
                <select name="vehiculo_id" value={form.vehiculo_id} onChange={onChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Seleccione</option>
                  {vehiculos.map((v) => (
                    <option key={v.id} value={v.id}>{v.placa || v.codigo || v.id}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Conductor Asignado</label>
                <select name="conductor_id" value={form.conductor_id} onChange={onChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Seleccione</option>
                  {conductores.map((c) => {
                    const label = [c.nombre, c.apellido].filter(Boolean).join(" ") || c.id;
                    return (
                      <option key={c.id} value={c.id}>{label}</option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Origen</label>
                <input name="origen" value={form.origen} onChange={onChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Destino</label>
                <input name="destino" value={form.destino} onChange={onChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Fecha/Hora de Salida</label>
                <input type="datetime-local" name="fecha_hora_salida" value={form.fecha_hora_salida} onChange={onChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Fecha/Hora Estimada de Llegada</label>
                <input type="datetime-local" name="fecha_hora_llegada_estimada" value={form.fecha_hora_llegada_estimada} onChange={onChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Tipo de Movimiento</label>
                <input name="tipo_movimiento" value={form.tipo_movimiento} onChange={onChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Carga/Pasajeros</label>
                <input name="carga_pasajeros" value={form.carga_pasajeros} onChange={onChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Estado</label>
                <select name="estado" value={form.estado} onChange={onChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="Programado">Programado</option>
                  <option value="En curso">En curso</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Observaciones</label>
                <textarea name="observaciones" value={form.observaciones} onChange={onChange} rows={3} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>

              <div className="md:col-span-2 flex items-center gap-3">
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60">Actualizar</button>
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateMovimiento;


