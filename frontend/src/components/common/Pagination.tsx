type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  // Build smart array: [1, 2, ..., n-1, n, n+1, ..., total]
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="mt-6 pt-4 border-t border-institution-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-institution-500">
      <div>
        Menampilkan halaman <span className="font-semibold text-institution-800">{currentPage}</span> dari <span className="font-semibold text-institution-800">{totalPages}</span>
        {totalItems !== undefined && (
          <span className="ml-2 text-institution-400">({totalItems} item)</span>
        )}
      </div>
      <div className="inline-flex items-center gap-1">
        <button 
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-2.5 py-1.5 rounded border border-institution-200 bg-white text-institution-600 hover:bg-institution-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition"
        >
          Sebelumnya
        </button>
        
        {getPageNumbers().map((page, idx) => (
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-1.5 py-1 text-institution-400">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`min-w-[28px] px-2 py-1.5 rounded font-medium text-xs transition ${
                currentPage === page
                  ? 'bg-univ-blue text-white shadow-sm border border-univ-blueHover'
                  : 'bg-white border border-institution-200 text-institution-600 hover:bg-institution-50'
              }`}
            >
              {page}
            </button>
          )
        ))}

        <button 
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-2.5 py-1.5 rounded border border-institution-200 bg-white text-institution-600 hover:bg-institution-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
};
