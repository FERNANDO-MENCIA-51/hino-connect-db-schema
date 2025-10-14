import React from "react";

const Row = ({ label, value }) => (
  <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-b-0">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm font-medium text-gray-800 text-right ml-4 break-all">{value ?? "—"}</span>
  </div>
);

const DetailsMovement = ({ movement, onClose }) => {
  if (!movement) return null;

  const format = (iso) => {
    if (!iso) return "—";
    try {
      const v = typeof iso === 'string' && iso.includes(' ') && !iso.includes('T') ? iso.replace(' ', 'T') : iso;
      const d = new Date(v);
      const fecha = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
      const hora = new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true }).format(d).replace(/\./g, '');
      return `${fecha} ${hora}`;
    } catch {
      return String(iso);
    }
  };

  const exportPDF = () => {
    const docTitle = `Detalle_${movement.codigo || movement.id}`;
    const style = `
      <style>
        *{box-sizing:border-box}
        @page{margin:16mm}
        html,body{height:100%}
        body{font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;background:#f8fafc}
        .header{background:linear-gradient(90deg,#059669,#10b981);color:#fff;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:4px solid #065f46}
        .title{font-size:20px;font-weight:700;letter-spacing:.2px}
        .subtitle{font-size:12px;opacity:.95}
        .section{padding:18px 24px;border-bottom:1px solid #e2e8f0;background:#ffffff}
        .section h4{margin:0 0 12px 0;color:#065F46;font-size:14px;text-transform:uppercase;letter-spacing:.6px;border-left:4px solid #10b981;padding-left:8px}
        .row{display:flex;justify-content:space-between;padding:8px 10px;border-radius:8px;margin:4px 0;background:linear-gradient(90deg,#ecfdf5,#ffffff)}
        .row:nth-child(even){background:linear-gradient(90deg,#f0fdf4,#ffffff)}
        .label{color:#0f766e;font-size:12px;font-weight:600}
        .value{font-weight:700;font-size:12px;max-width:60%;text-align:right;color:#0b1324}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
        .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}
        .footer{padding:12px 24px;color:#64748b;font-size:11px}
      </style>
    `;
    const html = `
      <!DOCTYPE html><html><head><meta charset='utf-8'><title>${docTitle}</title>${style}</head>
      <body>
        <div class='header'>
          <div>
            <div class='title'>Detalle de Movimiento</div>
            <div class='subtitle mono'>Código ${movement.codigo || movement.id}</div>
          </div>
        </div>
        <div class='section'>
          <div class='grid'>
            <div>
              <h4>Información general</h4>
              <div class='row'><span class='label'>Vehículo</span><span class='value'>${movement.vehiculo_label || movement.vehiculo_id || '—'}</span></div>
              <div class='row'><span class='label'>Conductor</span><span class='value'>${movement.conductor_label || movement.conductor_id || '—'}</span></div>
              <div class='row'><span class='label'>Estado</span><span class='value'>${movement.estado || '—'}</span></div>
              <div class='row'><span class='label'>Tipo</span><span class='value'>${movement.tipo_movimiento || '—'}</span></div>
              <div class='row'><span class='label'>Carga/Pasajeros</span><span class='value'>${movement.carga_pasajeros || '—'}</span></div>
            </div>
            <div>
              <h4>Tiempos</h4>
              <div class='row'><span class='label'>Salida</span><span class='value'>${format(movement.fecha_salida)}</span></div>
              <div class='row'><span class='label'>Llegada estimada</span><span class='value'>${format(movement.fecha_llegada_estimada)}</span></div>
              <div class='row'><span class='label'>Llegada real</span><span class='value'>${format(movement.fecha_llegada_real)}</span></div>
              <div class='row'><span class='label'>Creado</span><span class='value'>${format(movement.created_at)}</span></div>
              <div class='row'><span class='label'>Actualizado</span><span class='value'>${format(movement.updated_at)}</span></div>
            </div>
          </div>
        </div>
        <div class='section'>
          <h4>Ubicaciones</h4>
          <div class='row'><span class='label'>Origen</span><span class='value'>${movement.origen || '—'}</span></div>
          <div class='row'><span class='label'>Destino</span><span class='value'>${movement.destino || '—'}</span></div>
        </div>
        <div class='section'>
          <h4>Observaciones</h4>
          <div style='font-size:12px'>${(movement.observaciones || '—')}</div>
        </div>
        <script>window.onload=() => {window.print(); setTimeout(()=>window.close(), 250);}</script>
      </body></html>
    `;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-emerald-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Detalle de Movimiento</h3>
              <p className="text-emerald-100 text-sm">Código {movement.codigo || movement.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">✕</button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-emerald-100 rounded-xl p-4">
            <h4 className="text-emerald-700 font-semibold mb-3">Información general</h4>
            <Row label="Código" value={movement.codigo || movement.id} />
            <Row label="Vehículo" value={movement.vehiculo_label || movement.vehiculo_id} />
            <Row label="Conductor" value={movement.conductor_label || movement.conductor_id} />
            <Row label="Estado" value={movement.estado} />
            <Row label="Tipo" value={movement.tipo_movimiento || '—'} />
            <Row label="Carga/Pasajeros" value={movement.carga_pasajeros || '—'} />
          </div>

          <div className="bg-white border border-emerald-100 rounded-xl p-4">
            <h4 className="text-emerald-700 font-semibold mb-3">Tiempos</h4>
            <Row label="Salida" value={format(movement.fecha_salida)} />
            <Row label="Llegada estimada" value={format(movement.fecha_llegada_estimada)} />
            <Row label="Llegada real" value={format(movement.fecha_llegada_real)} />
            <Row label="Creado" value={format(movement.created_at)} />
            <Row label="Actualizado" value={format(movement.updated_at)} />
            <Row label="Eliminado" value={format(movement.deleted_at)} />
          </div>

          <div className="md:col-span-2 bg-white border border-emerald-100 rounded-xl p-4">
            <h4 className="text-emerald-700 font-semibold mb-3">Ubicaciones</h4>
            <Row label="Origen" value={movement.origen} />
            <Row label="Destino" value={movement.destino} />
          </div>

          <div className="md:col-span-2 bg-white border border-emerald-100 rounded-xl p-4">
            <h4 className="text-emerald-700 font-semibold mb-3">Observaciones</h4>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{movement.observaciones || "—"}</p>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
          <button onClick={exportPDF} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Exportar PDF</button>
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default DetailsMovement;


