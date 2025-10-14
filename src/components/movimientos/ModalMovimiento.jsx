import React from "react";
import CreateMovimientos from "./CreateMovimientos";

const ModalMovimiento = ({ onClose, onSuccess }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Registrar Movimiento</h3>
              <p className="text-blue-100 text-sm">Complete los datos para crear un nuevo movimiento</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-white/10">✕</button>
        </div>
        <div className="p-6 bg-blue-50/40">
          <CreateMovimientos onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
};

export default ModalMovimiento;
