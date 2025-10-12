import React, { useState, useEffect } from "react";
import { FaUser, FaEdit, FaTrash } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import Swal from "sweetalert2";
import MainLayout from "../components/layout/MainLayout";
import { conductorService } from "../services/conductoresService";
import ActualizarConductor from "../components/conductores/UpdateConductor.jsx";
import CrearConductor from "../components/conductores/CreateConductor.jsx";

const FilterIcon = () => (
    <div
        className="flex items-center justify-center h-8 w-8"
        style={{ borderRadius: "10px", background: "#0088ffff" }}
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" fill="none">
            <path
                d="M6.6665 5.33337H25.3332L18.6665 14V26.6667L13.3332 21.3334V14L6.6665 5.33337Z"
                fill="#FFF"
                stroke="#FFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    </div>
);

const ConductorFilters = ({ searchTerm, setSearchTerm, filterEstado, setFilterEstado, onCrear }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ width: "1118px" }}>
        <div className="pt-4 px-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <FilterIcon /> Filtro de Búsqueda
            </h2>
        </div>
        <div className="p-4 flex items-center gap-4 border-t border-gray-200">
            <div className="relative flex-grow">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, apellido o DNI..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="relative w-[220px]">
                <select
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value)}
                    className="appearance-none block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500"
                >
                    <option value="todos">Todos los Conductores</option>
                    <option value="Activo">Activos</option>
                    <option value="Inactivo">Inactivos</option>
                </select>
            </div>
            <button
                className="text-white font-medium rounded-lg px-6 py-2 transition-all"
                style={{ backgroundColor: "#4CAF50", border: "1px solid #16A34A" }}
                onClick={onCrear}
            >
                + Registrar Conductor
            </button>
        </div>
    </div>
);

function Conductores() {
    const [conductores, setConductores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEstado, setFilterEstado] = useState("todos");

    const [conductorSeleccionado, setConductorSeleccionado] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [crearModalVisible, setCrearModalVisible] = useState(false);

    const handleEdit = (c) => {
        setConductorSeleccionado(c);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setConductorSeleccionado(null);
    };

    const handleOpenCrearModal = () => setCrearModalVisible(true);
    const handleCloseCrearModal = () => setCrearModalVisible(false);

    const fetchConductores = async () => {
        try {
            setLoading(true);
            let lista = [];

            if (filterEstado === "Activo" || filterEstado === "Inactivo") {
                const res = await conductorService.listarConductoresPorEstado(filterEstado);
                lista = res.data;
            } else {
                const activos = await conductorService.listarConductoresPorEstado("Activo");
                const inactivos = await conductorService.listarConductoresPorEstado("Inactivo");
                lista = [...activos.data, ...inactivos.data];
            }

            const listaOrdenada = lista.sort((a, b) => {
                const codigoA = a.codigo?.toString().toLowerCase() || "";
                const codigoB = b.codigo?.toString().toLowerCase() || "";
                return codigoA.localeCompare(codigoB, undefined, { numeric: true });
            });

            setConductores(listaOrdenada);
        } catch (err) {
            setError(err.message || "Error al obtener conductores");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConductores();
    }, [filterEstado]);

    const conductoresFiltrados = conductores.filter(c => {
        const texto = searchTerm.toLowerCase();
        return (
            c.nombre?.toLowerCase().includes(texto) ||
            c.apellido?.toLowerCase().includes(texto) ||
            c.dni?.toLowerCase().includes(texto)
        );
    });

    const handleDelete = async c => {
        const confirm = await Swal.fire({
            title: "¿Eliminar conductor?",
            text: `El conductor ${c.nombre} será desactivado.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (confirm.isConfirmed) {
            try {
                await conductorService.desactivarConductor(c);
                Swal.fire("Desactivado", "El conductor fue desactivado.", "success");
                fetchConductores();
            } catch {
                Swal.fire("Error", "No se pudo desactivar el conductor.", "error");
            }
        }
    };

    const handleRestore = async c => {
        const confirm = await Swal.fire({
            title: "¿Restaurar conductor?",
            text: `El conductor ${c.nombre} será reactivado.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, restaurar",
            cancelButtonText: "Cancelar",
        });
        if (confirm.isConfirmed) {
            try {
                await conductorService.restaurarConductor(c);
                Swal.fire("Restaurado", "El conductor fue reactivado.", "success");
                fetchConductores();
            } catch {
                Swal.fire("Error", "No se pudo restaurar el conductor.", "error");
            }
        }
    };

    return (
        <MainLayout activeMenu="Dashboard">
            <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
                {/* Encabezado */}
                <div className="bg-white rounded-lg shadow-md flex items-center gap-6 mt-6 px-8 border border-gray-300" style={{ width: "1118px", height: "112px" }}>
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                        <FaUser className="text-blue-600 text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">Listado de Conductores</h1>
                        <p className="text-gray-500 mt-1">Administra y visualiza los conductores registrados.</p>
                    </div>
                </div>

                {/* Filtro */}
                <div className="mt-6">
                    <ConductorFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterEstado={filterEstado}
                        setFilterEstado={setFilterEstado}
                        onCrear={handleOpenCrearModal}
                    />
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-lg shadow-sm mt-6 border border-gray-200 overflow-x-auto" style={{ width: "1118px" }}>
                    {loading ? (
                        <p className="text-center p-6 text-gray-500">Cargando conductores...</p>
                    ) : error ? (
                        <p className="text-center p-6 text-red-500">Error al cargar conductores: {error}</p>
                    ) : conductoresFiltrados.length === 0 ? (
                        <p className="text-center p-6 text-gray-500">No se encontraron conductores.</p>
                    ) : (
                        <table className="min-w-full text-sm text-gray-700">
                            <thead className="bg-gray-100 text-gray-800 text-left">
                                <tr>
                                    <th className="px-4 py-3">Código</th>
                                    <th className="px-4 py-3">Nombre</th>
                                    <th className="px-4 py-3">Apellido</th>
                                    <th className="px-4 py-3">DNI</th>
                                    <th className="px-4 py-3">Teléfono</th>
                                    <th className="px-4 py-3">Licencia</th>
                                    <th className="px-4 py-3">Vehículo Asignado</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Fecha de Ingreso</th>
                                    <th className="px-4 py-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {conductoresFiltrados.map(c => {
                                    const isActivo = c.estado === "Activo";
                                    return (
                                        <tr key={c.id} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-3">{c.codigo}</td>
                                            <td className="px-4 py-3">{c.nombre}</td>
                                            <td className="px-4 py-3">{c.apellido}</td>
                                            <td className="px-4 py-3">{c.dni}</td>
                                            <td className="px-4 py-3">+51 {c.telefono}</td>
                                            <td className="px-4 py-3">{c.licencia}</td>
                                            <td className="px-4 py-3">{c.vehiculoAsignado || "No asignado"}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        isActivo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {c.estado}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{c.fechaIngreso}</td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center gap-2">
                                                    {isActivo && (
                                                        <button
                                                            onClick={() => handleEdit(c)}
                                                            className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                                            title="Editar"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                    )}
                                                    {isActivo ? (
                                                        <button
                                                            onClick={() => handleDelete(c)}
                                                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                            title="Eliminar"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleRestore(c)}
                                                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                                            title="Restaurar"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Modal de actualización */}
                {modalVisible && (
                    <ActualizarConductor
                        conductor={conductorSeleccionado}
                        onClose={handleCloseModal}
                        onUpdated={fetchConductores}
                    />
                )}

                {/* Modal de creación */}
                {crearModalVisible && (
                    <CrearConductor
                        onClose={handleCloseCrearModal}
                        onCreated={fetchConductores}
                    />
                )}
            </div>
        </MainLayout>
    );
}

export default Conductores;