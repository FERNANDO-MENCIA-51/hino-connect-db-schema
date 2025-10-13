import { useState } from 'react';
import { Search, Filter, X, ChevronDown, RotateCcw } from 'lucide-react';

const FilterPanel = ({
  searchValue = '',
  onSearchChange,
  filters = [],
  onFilterChange,
  showActiveFilter = true,
  activeFilterValue = 'all',
  onActiveFilterChange,
  activeLabel = 'Activos',
  inactiveLabel = 'Inactivos',
  allLabel = 'Todos',
  searchPlaceholder = 'Buscar...',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Manejar cambio de búsqueda
  const handleSearchChange = (e) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  // Manejar cambio de filtro activo/inactivo
  const handleActiveFilterChange = (value) => {
    if (onActiveFilterChange) {
      onActiveFilterChange(value);
    }
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    if (onSearchChange) onSearchChange('');
    if (onActiveFilterChange) onActiveFilterChange('all');
    if (onFilterChange) {
      filters.forEach(filter => {
        onFilterChange(filter.key, filter.type === 'select' ? '' : '');
      });
    }
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = () => {
    return searchValue || 
           activeFilterValue !== 'all' || 
           filters.some(filter => filter.value && filter.value !== '');
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {/* Header del panel de filtros */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Filtros de Búsqueda</h3>
            {hasActiveFilters() && (
              <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                Filtros activos
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {hasActiveFilters() && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Limpiar
              </button>
            )}
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>{isExpanded ? 'Contraer' : 'Expandir'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Contenido del panel */}
      <div className="p-4">
        {/* Búsqueda principal */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            />
            {searchValue && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filtros rápidos - Activos/Inactivos */}
        {showActiveFilter && (
          <div className="mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => handleActiveFilterChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilterValue === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {allLabel}
              </button>
              
              <button
                onClick={() => handleActiveFilterChange('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilterValue === 'active'
                    ? 'bg-success-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {activeLabel}
              </button>
              
              <button
                onClick={() => handleActiveFilterChange('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilterValue === 'inactive'
                    ? 'bg-danger-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {inactiveLabel}
              </button>
            </div>
          </div>
        )}

        {/* Filtros adicionales (expandibles) */}
        {isExpanded && filters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                
                {filter.type === 'select' ? (
                  <select
                    value={filter.value || ''}
                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : filter.type === 'date' ? (
                  <input
                    type="date"
                    value={filter.value || ''}
                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : filter.type === 'daterange' ? (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={filter.value?.start || ''}
                      onChange={(e) => onFilterChange(filter.key, { ...filter.value, start: e.target.value })}
                      placeholder="Desde"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      value={filter.value?.end || ''}
                      onChange={(e) => onFilterChange(filter.key, { ...filter.value, end: e.target.value })}
                      placeholder="Hasta"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={filter.value || ''}
                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                    placeholder={filter.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Hook para manejar el estado de filtros
export const useFilters = (initialFilters = {}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveFilter('all');
    setFilters(initialFilters);
  };

  const getFilteredData = (data, customFilterFn) => {
    let filteredData = [...data];

    // Filtro de búsqueda
    if (searchTerm) {
      filteredData = filteredData.filter(item => 
        customFilterFn ? customFilterFn(item, searchTerm) : 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filtro activo/inactivo
    if (activeFilter !== 'all') {
      filteredData = filteredData.filter(item => {
        if (activeFilter === 'active') {
          return item.activo === true || item.estado === 'Activo' || item.deletedAt === null;
        } else if (activeFilter === 'inactive') {
          return item.activo === false || item.estado === 'Inactivo' || item.deletedAt !== null;
        }
        return true;
      });
    }

    // Filtros adicionales
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        if (typeof value === 'object' && value.start && value.end) {
          // Filtro de rango de fechas
          filteredData = filteredData.filter(item => {
            const itemDate = new Date(item[key]);
            const startDate = new Date(value.start);
            const endDate = new Date(value.end);
            return itemDate >= startDate && itemDate <= endDate;
          });
        } else {
          // Filtro simple
          filteredData = filteredData.filter(item => 
            String(item[key]).toLowerCase().includes(String(value).toLowerCase())
          );
        }
      }
    });

    return filteredData;
  };

  return {
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    filters,
    updateFilter,
    clearFilters,
    getFilteredData
  };
};

export default FilterPanel;