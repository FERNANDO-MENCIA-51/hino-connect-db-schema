import { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { PAGINATION } from '../../constants';

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  pagination = null,
  onPageChange = null,
  onPageSizeChange = null,
  onSort = null,
  searchable = true,
  filterable = true,
  actions = null,
  emptyMessage = "No hay datos disponibles",
  className = "",
  rowClassName = "",
  headerClassName = "",
  cellClassName = ""
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);

  // Filtrar datos por búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm || !searchable) return data;
    
    return data.filter(item => {
      return columns.some(column => {
        if (!column.searchable) return false;
        
        const value = getNestedValue(item, column.accessor);
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns, searchable]);

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginar datos (solo si no hay paginación externa)
  const paginatedData = useMemo(() => {
    if (pagination) return sortedData; // Paginación externa
    
    const startIndex = currentPage * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  // Función para obtener valores anidados
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Manejar ordenamiento
  const handleSort = (columnKey) => {
    if (onSort) {
      onSort(columnKey);
      return;
    }

    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  // Manejar cambio de página
  const handlePageChange = (newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setCurrentPage(newPage);
    }
  };

  // Manejar cambio de tamaño de página
  const handlePageSizeChange = (newSize) => {
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    } else {
      setPageSize(newSize);
      setCurrentPage(0);
    }
  };

  // Obtener información de paginación
  const paginationInfo = pagination || {
    pageNumber: currentPage,
    pageSize: pageSize,
    totalElements: sortedData.length,
    totalPages: Math.ceil(sortedData.length / pageSize),
    first: currentPage === 0,
    last: currentPage >= Math.ceil(sortedData.length / pageSize) - 1
  };

  // Renderizar celda
  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item, getNestedValue(item, column.accessor));
    }
    
    const value = getNestedValue(item, column.accessor);
    
    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString('es-ES');
    }
    
    if (column.type === 'datetime' && value) {
      return new Date(value).toLocaleString('es-ES');
    }
    
    if (column.type === 'currency' && value !== null && value !== undefined) {
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
      }).format(value);
    }
    
    if (column.type === 'number' && value !== null && value !== undefined) {
      return new Intl.NumberFormat('es-ES').format(value);
    }
    
    return value || '-';
  };

  // Renderizar icono de ordenamiento
  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-primary-600" />
      : <ArrowDown className="w-4 h-4 text-primary-600" />;
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
      {/* Header con búsqueda y filtros */}
      {(searchable || filterable) && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {searchable && (
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
            
            {filterable && (
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filtros</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando datos...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className={`bg-gray-50 ${headerClassName}`}>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.accessor}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    } ${column.headerClassName || ''}`}
                    onClick={() => column.sortable && handleSort(column.accessor)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.header}</span>
                      {column.sortable && renderSortIcon(column.accessor)}
                    </div>
                  </th>
                ))}
                {actions && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td 
                    colSpan={columns.length + (actions ? 1 : 0)} 
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr 
                    key={item.id || index} 
                    className={`hover:bg-gray-50 transition-colors ${
                      typeof rowClassName === 'function' ? rowClassName(item) : rowClassName
                    }`}
                  >
                    {columns.map((column) => (
                      <td 
                        key={column.accessor}
                        className={`px-6 py-4 whitespace-nowrap ${cellClassName} ${column.cellClassName || ''}`}
                      >
                        {renderCell(item, column)}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {typeof actions === 'function' ? actions(item) : actions}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      {paginationInfo.totalElements > 0 && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700">
                Mostrando {Math.min((paginationInfo.pageNumber * paginationInfo.pageSize) + 1, paginationInfo.totalElements)} - {Math.min((paginationInfo.pageNumber + 1) * paginationInfo.pageSize, paginationInfo.totalElements)} de {paginationInfo.totalElements} resultados
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Filas por página:</span>
                <select
                  value={paginationInfo.pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {PAGINATION.PAGE_SIZE_OPTIONS.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(0)}
                disabled={paginationInfo.first}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                title="Primera página"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handlePageChange(paginationInfo.pageNumber - 1)}
                disabled={paginationInfo.first}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                title="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-700">
                  Página {paginationInfo.pageNumber + 1} de {paginationInfo.totalPages}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(paginationInfo.pageNumber + 1)}
                disabled={paginationInfo.last}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                title="Página siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handlePageChange(paginationInfo.totalPages - 1)}
                disabled={paginationInfo.last}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                title="Última página"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;