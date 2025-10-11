import { FiSearch, FiFilter, FiRefreshCw } from "react-icons/fi";

const VehiculoFilters = ({
  searchTerm,
  setSearchTerm,
  filterEstado,
  setFilterEstado,
  filterMarca,
  setFilterMarca,
  onClearFilters,
  onSearchByEstado,
  loading = false,
}) => {
  const estadosVehiculo = ["En operación", "En mantenimiento", "Disponible", "Inactivo"];
  const marcasVehiculo = [
    "Hino",
    "Isuzu",
    "Mitsubishi",
    "Nissan",
    "Toyota",
    "Ford",
    "Chevrolet",
    "Volvo",
    "Mercedes-Benz",
    "Otro",
  ];

  const handleEstadoChange = (estado) => {
    setFilterEstado(estado);
    
    // Para "Inactivo" usar endpoint específico, para otros estados filtrado local
    if (estado === "Inactivo") {
      onSearchByEstado(estado);
    }
  };

  const hasActiveFilters = searchTerm || filterEstado !== "todos" || filterMarca !== "todos";

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded">
            <FiFilter className="text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Filtros de Búsqueda</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            disabled={loading}
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Limpiar Filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por código, placa, marca, modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        <select
          value={filterEstado}
          onChange={(e) => handleEstadoChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="todos">Todos los estados</option>
          {estadosVehiculo.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>

        <select
          value={filterMarca}
          onChange={(e) => setFilterMarca(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="todos">Todas las marcas</option>
          {marcasVehiculo.map((marca) => (
            <option key={marca} value={marca}>
              {marca}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default VehiculoFilters;
