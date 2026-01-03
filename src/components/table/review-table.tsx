import React, { useState } from "react";
import NoDataFound from "../no-data-found";

interface TableRow {
  rowData: (string | number)[];
}

interface TableProps {
  headers: string[];
  rows: TableRow[];
}

const ReviewTable: React.FC<TableProps> = ({ headers, rows }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Number of rows per page

  // Calculate the index of the first and last row on the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  // Slice the rows array to display only the rows for the current page
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

  // Calculate the total number of pages
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="overflow-x-auto">
      {rows.length === 0 ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <NoDataFound />
        </div>
      ) : (
        <>
          <table className="table min-w-[1280px] lg:min-w-full">
            {/* Table Head */}
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {currentRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.rowData.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-10 space-x-2">
            <button
              className="btn btn-sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`btn btn-sm ${currentPage === index + 1 ? "btn-primary" : "btn-secondary"}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="btn btn-sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewTable;
