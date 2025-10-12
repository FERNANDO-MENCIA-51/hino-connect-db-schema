import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { conductorService } from "../../services/conductoresService";

const CrearConductor = ({ onClose, onCreated }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        dni: "",
        telefono: "",
        licencia: "",
        vehiculoAsignado: "",
    });

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 10);
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validarFormulario = async () => {
        const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        const dniRegex = /^[0-9]{8}$/;
        const telefonoDigits = formData.telefono.replace(/\s+/g, '');

        if (!nombreRegex.test(formData.nombre)) {
            Swal.fire("Error", "El nombre solo puede contener letras.", "error");
            return false;
        }
        if (!nombreRegex.test(formData.apellido)) {
            Swal.fire("Error", "El apellido solo puede contener letras.", "error");
            return false;
        }
        if (!dniRegex.test(formData.dni)) {
            Swal.fire("Error", "El DNI debe contener exactamente 8 números.", "error");
            return false;
        }
        if (!/^[0-9]{9}$/.test(telefonoDigits)) {
            Swal.fire("Error", "El teléfono debe ser un número peruano de 9 dígitos.", "error");
            return false;
        }

        const res = await conductorService.listarConductores();
        const existeDNI = res.data.some(c => c.dni === formData.dni);
        if (existeDNI) {
            Swal.fire("Error", "El DNI ya está registrado.", "error");
            return false;
        }

        return true;
    };

    const generarCodigo = (conductoresExistentes) => {
        if (conductoresExistentes.length === 0) return "C1";
        const numeros = conductoresExistentes.map(c => parseInt(c.codigo.replace("C", ""), 10));
        const maxNumero = Math.max(...numeros);
        return "C" + (maxNumero + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!(await validarFormulario())) return;

        try {
            const res = await conductorService.listarConductores();
            const nuevoCodigo = generarCodigo(res.data);

            const payload = {
                ...formData,
                codigo: nuevoCodigo,
                estado: "Activo",
                activo: true,
                fechaIngreso: new Date().toISOString().split("T")[0],
            };

            await conductorService.crearConductor(payload);
            Swal.fire("Registrado", "El conductor ha sido registrado.", "success");
            onCreated();
            handleClose();
        } catch (error) {
            console.error("Error al crear conductor:", error);
            Swal.fire(
                "Error",
                error.response?.data?.message || "No se pudo registrar el conductor.",
                "error"
            );
        }
    };

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
            <div className={`bg-white rounded-lg shadow-lg w-[650px] relative overflow-hidden transform transition-transform duration-300 ${visible ? "translate-y-0 scale-100" : "-translate-y-10 scale-90"}`}>
                <div className="bg-green-500 text-white text-center py-4 font-semibold text-xl">
                    Registrar Conductor
                </div>


                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Datos Personales */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-4">Datos Personales</h3>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block font-medium text-gray-600">Nombre:</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded mt-1"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block font-medium text-gray-600">Apellido:</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded mt-1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <div className="flex-1">
                                <label className="block font-medium text-gray-600">DNI:</label>
                                <input
                                    type="text"
                                    name="dni"
                                    value={formData.dni}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded mt-1"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block font-medium text-gray-600">Teléfono:</label>
                                <input
                                    type="text"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded mt-1"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Licencia y Vehículo */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-4">Licencia y Vehículo</h3>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block font-medium text-gray-600">Tipo de Licencia:</label>
                                <select
                                    name="licencia"
                                    value={formData.licencia}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded mt-1"
                                >
                                    <option value="">Seleccione</option>
                                    <option value="A-I">A-I</option>
                                    <option value="A-IIa">A-IIa</option>
                                    <option value="A-IIb">A-IIb</option>
                                    <option value="A-IIIa">A-IIIa</option>
                                    <option value="A-IIIb">A-IIIb</option>
                                    <option value="A-IIIc">A-IIIc</option>
                                    <option value="B-I">B-I</option>
                                    <option value="B-II">B-II</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block font-medium text-gray-600">Vehículo Asignado:</label>
                                <input
                                    type="text"
                                    name="vehiculoAsignado"
                                    value={formData.vehiculoAsignado}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded mt-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Registrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearConductor;