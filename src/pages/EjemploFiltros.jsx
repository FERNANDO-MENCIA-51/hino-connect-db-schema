import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import FilterPanel, { useFilters } from "../components/common/FilterPanel";
import DataTable from "../components/common/DataTable";
import StatusBadge, { VehicleStatusBadge, DriverStatusBadge } from "../components/common/StatusBadge";
import { Edit, Trash2, RotateCcw, Eye } from "lucide-react";

const EjemploFiltros = () => {
  // Datos de ejemplo
  const [vehiculos] = useState([
    {
      id: 1,
      codigo: "V001",
      placa: "ABC-123",
      marca: "HINO",
      modelo: "GH-500",
      tipo: "Camión",
      estadoActual: "En operación",
      activo: true,
      createdAt: "2024-01-15T10:00:00Z",
      deletedAt: null
    },
    {
      id: 2,
      codigo: "V002",
      placa: "DEF-456",
      marca: "HINO",
      modelo: "FC-300",
      tipo: "Semitrailer",
      estadoActual: "Disponible",
      activo: true,
      createdAt: "2024-01-16T10:00:00Z",
      deletedAt: null
    },
    {
      id: 3,
      codigo: "V003",
      placa: "GHI-789",
      marca: "VOLVO",
      modelo: "FH-460",
      tipo: "Camión",
      estadoActual: "En mantenimiento",
      activo: true,
      createdAt: "2024-01-17T10:00:00Z",
      deletedAt: null
    },
    {
      id: 4,
      codigo: "V004",
      placa: "JKL-012",
      marca: "SCANIA",
      modelo: "R-450",
      tipo: "Semitrailer",
      estadoActual: "Inactivo",
      activo: false,
      createdAt: "2024-01-18T10:00:00Z",
      deletedAt: "2024-02-01T10:00:00Z"
    }
  ]);

  const [conductores] = useState([
    {
      id: 1,
      codigo: "C001",
      nombre: "Juan",
      apellido: "Pérez",
      dni: "12345678",
      estado: "Activo",
      activo: true,
      createdAt: "2024-01-15T10:00:00Z",
      deletedAt: null
    },
    {
      id: 2,
      codigo: "C002",
      nombre: "María",
      apellido: "García",
      dni: "87654321",
      estado: "En Viaje",
      activo: true,
      createdAt: "2024-01-16T10:00:00Z",
      deletedAt: null
    },
    {
      id: 3,
      codigo: "C003",
      nombre: "Carlos",
      apellido: "López",
      dni: "11223344",
      estado: "Inactivo",
      activo: false,
      createdAt: "2024-01-17T10:00:00Z",
      deletedAt: "2024-02-01T10:00:00Z"
    }
  ]);

  const [activeTab, setActiveTab] = useState("vehiculos");

  // Hook para filtros de vehículos
  const vehiculosFilters = useFilters({
    marca: '',
    tipo: '',
    estado: '',
    fechaCreacion: ''
  });

  // Hook para filtros de conductores
  const conductoresFilters = useFilters({
    estado: '',
    fechaCreacion: ''
  });

  // Función personalizada de filtrado para vehículos
  const customVehiculoFilter = (vehiculo, searchTerm) => {
    return (
      vehiculo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Función personalizada de filtrado para conductores
  const customConductorFilter = (conductor, searchTerm) => {
    return (
      conductor.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conductor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conductor.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conductor.dni.includes(searchTerm)
    );
  };

  // Obtener datos filtrados
  const filteredVehiculos = vehiculosFilters.getFilteredData(vehiculos, customVehiculoFilter);
  const filteredConductores = conductoresFilters.getFilteredData(conductores, customConductorFilter);

  // Configuración de columnas para vehículos
  const vehiculosColumns = [
    {
      accessor: 'codigo',
      header: 'Código',
      sortable: true,
      searchable: true
    },
    {
      accessor: 'placa',
      header: 'Placa',
      sortable: true,
      searchable: true
    },
    {
      accessor: 'marca',
      header: 'Marca',
      sortable: true,
      searchable: true
    },
    {
      accessor: 'modelo',
      header: 'Modelo',
      sortable: true,
      searchable: true
    },
    {
      accessor: 'tipo',
      header: 'Tipo',
      sortable: true
    },
    {
      accessor: 'estadoActual',
      header: 'Estado',
      render: (vehiculo) => (
        <VehicleStatusBadge status={vehiculo.estadoActual} />
      )
    },
    {
      accessor: 'createdAt',
      header: 'Fecha Creación',
      type: 'date',
      sortable: true
    }
  ];

  // Configuración de columnas para conductores
  const conductoresColumns = [
    {
      accessor: 'codigo',
      header: 'Código',
      sortable: true,
      searchable: true
    },
    {
      accessor: 'nombre',
      header: 'Nombre Completo',
      render: (conductor) => `${conductor.nombre} ${conductor.apellido}`,
      sortable: true,
      searchable: true
    },
    {
      accessor: 'dni',
      header: 'DNI',
      sortable: true,
      searchable: true
    },
    {
      accessor: 'estado',
      header: 'Estado',
      render: (conductor) => (
        <DriverStatusBadge status={conductor.estado} />
      )
    },
    {
      accessor: 'createdAt',
      header: 'Fecha Ingreso',
      type: 'date',
      sortable: true
    }
  ];

  // Acciones para las tablas
  const renderActions = (item, type) => (
    <div className="flex items-center gap-2">
      {item.deletedAt ? (
        <button
          onClick={() => console.log(`Restaurar ${type}:`, item.id)}
          className="p-2 text-success-600 hover:bg-success-100 rounded-lg transition-colors"
          title="Restaurar"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      ) : (
        <>
          <button
            onClick={() => console.log(`Ver ${type}:`, item.id)}
            className="p-2 text-info-600 hover:bg-info-100 rounded-lg transition-colors"
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => console.log(`Editar ${type}:`, item.id)}
            className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => console.log(`Eliminar ${type}:`, item.id)}
            className="p-2 text-danger-600 hover:bg-danger-100 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );

  return (
    <MainLayout activeMenu="Dashboard">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Ejemplo de Filtros Avanzados</h1>
            <p className="text-gray-500 text-sm mt-1">
              Demostración del sistema de filtros con DataTable
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("vehiculos")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "vehiculos"
                  ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>Vehículos</span>
                <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs font-bold">
                  {filteredVehiculos.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("conductores")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "conductores"
                  ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>Conductores</span>
                <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs font-bold">
                  {filteredConductores.length}
                </span>
              </div>
            </button>
          </div>
        </div>

        {activeTab === "vehiculos" ? (
          <div className="space-y-6">
            {/* Filtros para Vehículos */}
            <FilterPanel
              searchValue={vehiculosFilters.searchTerm}
              onSearchChange={vehiculosFilters.setSearchTerm}
              activeFilterValue={vehiculosFilters.activeFilter}
              onActiveFilterChange={vehiculosFilters.setActiveFilter}
              searchPlaceholder="Buscar por código, placa, marca o modelo..."
              activeLabel="Activos"
              inactiveLabel="Eliminados"
              allLabel="Todos"
              filters={[
                {
                  key: 'marca',
                  label: 'Marca',
                  type: 'select',
                  value: vehiculosFilters.filters.marca,
                  options: [
                    { value: 'HINO', label: 'HINO' },
                    { value: 'VOLVO', label: 'VOLVO' },
                    { value: 'SCANIA', label: 'SCANIA' }
                  ]
                },
                {
                  key: 'tipo',
                  label: 'Tipo',
                  type: 'select',
                  value: vehiculosFilters.filters.tipo,
                  options: [
                    { value: 'Camión', label: 'Camión' },
                    { value: 'Semitrailer', label: 'Semitrailer' }
                  ]
                },
                {
                  key: 'estadoActual',
                  label: 'Estado',
                  type: 'select',
                  value: vehiculosFilters.filters.estado,
                  options: [
                    { value: 'En operación', label: 'En operación' },
                    { value: 'Disponible', label: 'Disponible' },
                    { value: 'En mantenimiento', label: 'En mantenimiento' },
                    { value: 'Inactivo', label: 'Inactivo' }
                  ]
                },
                {
                  key: 'createdAt',
                  label: 'Fecha de Creación',
                  type: 'date',
                  value: vehiculosFilters.filters.fechaCreacion
                }
              ]}
              onFilterChange={vehiculosFilters.updateFilter}
            />

            {/* Tabla de Vehículos */}
            <DataTable
              data={filteredVehiculos}
              columns={vehiculosColumns}
              loading={false}
              searchable={false} // Ya tenemos búsqueda en FilterPanel
              actions={(vehiculo) => renderActions(vehiculo, 'vehículo')}
              emptyMessage="No se encontraron vehículos que coincidan con los filtros"
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filtros para Conductores */}
            <FilterPanel
              searchValue={conductoresFilters.searchTerm}
              onSearchChange={conductoresFilters.setSearchTerm}
              activeFilterValue={conductoresFilters.activeFilter}
              onActiveFilterChange={conductoresFilters.setActiveFilter}
              searchPlaceholder="Buscar por código, nombre o DNI..."
              activeLabel="Activos"
              inactiveLabel="Eliminados"
              allLabel="Todos"
              filters={[
                {
                  key: 'estado',
                  label: 'Estado',
                  type: 'select',
                  value: conductoresFilters.filters.estado,
                  options: [
                    { value: 'Activo', label: 'Activo' },
                    { value: 'En Viaje', label: 'En Viaje' },
                    { value: 'Inactivo', label: 'Inactivo' }
                  ]
                },
                {
                  key: 'createdAt',
                  label: 'Fecha de Ingreso',
                  type: 'date',
                  value: conductoresFilters.filters.fechaCreacion
                }
              ]}
              onFilterChange={conductoresFilters.updateFilter}
            />

            {/* Tabla de Conductores */}
            <DataTable
              data={filteredConductores}
              columns={conductoresColumns}
              loading={false}
              searchable={false} // Ya tenemos búsqueda en FilterPanel
              actions={(conductor) => renderActions(conductor, 'conductor')}
              emptyMessage="No se encontraron conductores que coincidan con los filtros"
            />
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vehículos</p>
                <p className="text-2xl font-bold text-gray-900">{vehiculos.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚛</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Conductores</p>
                <p className="text-2xl font-bold text-gray-900">{conductores.length}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👨‍💼</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resultados Filtrados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeTab === "vehiculos" ? filteredVehiculos.length : filteredConductores.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-info-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EjemploFiltros;