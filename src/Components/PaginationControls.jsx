function PaginationControls({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center mt-6">
      <nav className="inline-flex -space-x-px">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 border ${
                currentPage === page
                  ? "bg-[#00A99D] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {page}
            </button>
          )
        )}
      </nav>
    </div>
  );
}

export default PaginationControls;
