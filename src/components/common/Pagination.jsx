import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  MoreHorizontal
} from 'lucide-react';
import { PAGINATION } from '../../constants';

const Pagination = ({
  currentPage = 0,
  totalPages = 0,
  totalElements = 0,
  pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  showPageInfo = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  pageSizeOptions = PAGINATION.PAGE_SIZE_OPTIONS,
  className = '',
  size = 'md'
}) => {
  // Calcular información de paginación
  const startItem = Math.min((currentPage * pageSize) + 1, totalElements);
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= totalPages - 1;

  // Generar números de página visibles
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(0, currentPage - half);
    let end = Math.min(totalPages - 1, start + maxVisiblePages - 1);

    // Ajustar si estamos cerca del final
    if (end - start < maxVisiblePages - 1) {
      start = Math.max(0, end - maxVisiblePages + 1);
    }

    const pages = [];
    
    // Agregar primera página si no está incluida
    if (start > 0) {
      pages.push(0);
      if (start > 1) {
        pages.push('ellipsis-start');
      }
    }

    // Agregar páginas del rango
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Agregar última página si no está incluida
    if (end < totalPages - 1) {
      if (end < totalPages - 2) {
        pages.push('ellipsis-end');
      }
      pages.push(totalPages - 1);
    }

    return pages;
  };

  // Configuración de tamaños
  const sizeConfig = {
    sm: {
      button: 'px-2 py-1 text-xs',
      select: 'px-2 py-1 text-xs',
      text: 'text-xs'
    },
    md: {
      button: 'px-3 py-2 text-sm',
      select: 'px-3 py-2 text-sm',
      text: 'text-sm'
    },
    lg: {
      button: 'px-4 py-2 text-base',
      select: 'px-4 py-2 text-base',
      text: 'text-base'
    }
  };

  const config = sizeConfig[size] || sizeConfig.md;

  // Manejar cambio de página
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Manejar cambio de tamaño de página
  const handlePageSizeChange = (newSize) => {
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  // Si no hay elementos, no mostrar paginación
  if (totalElements === 0) {
    return null;
  }

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Información de página */}
      {showPageInfo && (
        <div className="flex items-center gap-4">
          <div className={`text-gray-700 ${config.text}`}>
            Mostrando {startItem.toLocaleString()} - {endItem.toLocaleString()} de {totalElements.toLocaleString()} resultados
          </div>
          
          {/* Selector de tamaño de página */}
          {showPageSizeSelector && onPageSizeChange && (
            <div className="flex items-center gap-2">
              <span className={`text-gray-700 ${config.text}`}>
                Filas por página:
              </span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className={`border border-gray-300 rounded ${config.select} focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Controles de navegación */}
      <div className="flex items-center gap-1">
        {/* Botón primera página */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(0)}
            disabled={isFirstPage}
            className={`
              ${config.button} border border-gray-300 rounded-lg
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:bg-gray-100 transition-colors
              flex items-center justify-center
            `}
            title="Primera página"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}

        {/* Botón página anterior */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isFirstPage}
          className={`
            ${config.button} border border-gray-300 rounded-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-gray-100 transition-colors
            flex items-center justify-center
          `}
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Números de página */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => {
            if (typeof page === 'string') {
              // Ellipsis
              return (
                <span
                  key={page}
                  className={`${config.button} flex items-center justify-center`}
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </span>
              );
            }

            const isActive = page === currentPage;
            
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`
                  ${config.button} border rounded-lg transition-colors
                  flex items-center justify-center min-w-[2.5rem]
                  ${isActive 
                    ? 'bg-primary-600 text-white border-primary-600' 
                    : 'border-gray-300 hover:bg-gray-100'
                  }
                `}
              >
                {page + 1}
              </button>
            );
          })}
        </div>

        {/* Botón página siguiente */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isLastPage}
          className={`
            ${config.button} border border-gray-300 rounded-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-gray-100 transition-colors
            flex items-center justify-center
          `}
          title="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Botón última página */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={isLastPage}
            className={`
              ${config.button} border border-gray-300 rounded-lg
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:bg-gray-100 transition-colors
              flex items-center justify-center
            `}
            title="Última página"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Componente simplificado para paginación básica
export const SimplePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= totalPages - 1;

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
      >
        Anterior
      </button>
      
      <span className="px-4 py-2 text-sm text-gray-700">
        Página {currentPage + 1} de {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
      >
        Siguiente
      </button>
    </div>
  );
};

// Hook para manejar estado de paginación
export const usePagination = (initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0); // Reset a la primera página
  };

  const reset = () => {
    setCurrentPage(0);
  };

  return {
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    reset
  };
};

export default Pagination;