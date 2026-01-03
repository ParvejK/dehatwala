import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NoDataFound from "../no-data-found";

interface TableRow {
  serviceId: number;
  bookedServiceId: number;
  instantService: InstantServiceObj;
  rowData: (string | number)[];
  // rowData: (string | number | InstantServiceObj)[];
}

interface TableProps {
  headers: string[];
  rows: TableRow[];
}

const Table: React.FC<TableProps> = ({ headers, rows }) => {
  const redirect = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Number of rows to display per page

  // Calculate the range of rows for the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="overflow-x-auto">
      {rows.length === 0 ? (
        // Display "No Data" message
        <div className="flex justify-center items-center min-h-[50vh]">
          <NoDataFound />
        </div>
      ) : (
        <>
          <table className="table min-w-[1280px] lg:min-w-[2100px]">
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

                  <td>
                    <button
                      className="btn btn-xs btn-primary min-w-[100px]"
                      onClick={() =>
                        redirect(
                          `/service-reviews/${btoa(row.bookedServiceId.toString())}/${btoa(row.serviceId.toString())}`
                        )
                      }
                    >
                      Add Reviews
                    </button>
                  </td>
                  <td className="max-w-[300px]">
                    {JSON.stringify(row.instantService)}
                    {/* <ul>
                      <li>Mason Day Count: {row.instantService.MasonDayCount}</li>
                      <li>Helper Day Count: {row.instantService.helperDayCount}</li>
                      <li>Mason Rate: {row.instantService.MasonRate}</li>
                      <li>Helper Rate: {row.instantService.helperRate}</li>
                      <li>Mason Overtime Count: {row.instantService.MasonOvertimeCount}</li>
                      <li>Helper Overtime Count: {row.instantService.helperOvertimeCount}</li>
                      <li>Mason Overtime Rate: {row.instantService.MasonOvertimeRate}</li>
                      <li>Helper Overtime Rate: {row.instantService.helperOvertimeRate}</li>
                      <li>Total Mason Day Rate: {row.instantService.totalMasonDayRate}</li>
                      <li>Total Helper Day Rate: {row.instantService.totalHelperDayRate}</li>
                      <li>Total Mason Overtime Rate: {row.instantService.totalMasonOvertimeRate}</li>
                      <li>Total Helper Overtime Rate: {row.instantService.totalHelperOvertimeRate}</li>
                      <li>Total Day Price: {row.instantService.totalDayPrice}</li>
                      <li>Tip Value: {row.instantService.tipValue}</li>
                    </ul> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center space-x-2 mt-10">
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

export default Table;

//--- OLD code --------------
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// interface TableRow {
//   serviceId: number;
//   bookedServiceId: number;
//   rowData: (string | number)[];
// }

// interface TableProps {
//   headers: string[];
//   rows: TableRow[];
// }

// const Table: React.FC<TableProps> = ({ headers, rows }) => {
//   const redirect = useNavigate();
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 10; // Number of rows to display per page

//   // Calculate the range of rows for the current page
//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

//   const totalPages = Math.ceil(rows.length / rowsPerPage);

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="table min-w-[1280px] lg:min-w-full">
//         {/* Table Head */}
//         <thead>
//           <tr>
//             {headers.map((header, index) => (
//               <th key={index}>{header}</th>
//             ))}
//           </tr>
//         </thead>
//         {/* Table Body */}
//         <tbody>
//           {currentRows.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {row.rowData.map((cell, cellIndex) => (
//                 <td key={cellIndex}>{cell}</td>
//               ))}
//               <td>
//                 <button
//                   className="btn btn-xs btn-primary"
//                   onClick={() =>
//                     redirect(
//                       `/service-reviews/${btoa(row.bookedServiceId.toString())}/${btoa(row.serviceId.toString())}`
//                     )
//                   }
//                 >
//                   Add Reviews
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Pagination Controls */}
//       <div className="flex justify-center space-x-2 mt-10">
//         <button className="btn btn-sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
//           Previous
//         </button>
//         {Array.from({ length: totalPages }, (_, index) => (
//           <button
//             key={index}
//             className={`btn btn-sm ${currentPage === index + 1 ? "btn-primary" : "btn-secondary"}`}
//             onClick={() => handlePageChange(index + 1)}
//           >
//             {index + 1}
//           </button>
//         ))}
//         <button
//           className="btn btn-sm"
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Table;

// ----- OLD CODE ---------------------------
// import React from "react";
// import { useNavigate } from "react-router-dom";

// interface TableRow {
//   serviceId: number;
//   bookedServiceId: number;
//   rowData: (string | number)[];
// }

// interface TableProps {
//   headers: string[];
//   rows: TableRow[];
// }
// const Table: React.FC<TableProps> = ({ headers, rows }) => {
//   const redirect = useNavigate();
//   return (
//     <div className="overflow-x-auto">
//       <table className="table min-w-[1280px] lg:min-w-full">
//         {/* Table Head */}
//         <thead>
//           <tr>
//             {headers.map((header, index) => (
//               <th key={index}>{header}</th>
//             ))}
//           </tr>
//         </thead>
//         {/* Table Body */}
//         <tbody>
//           {rows.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {row.rowData.map((cell, cellIndex) => (
//                 <td key={cellIndex}>{cell}</td>
//               ))}
//               <td>
//                 <button
//                   className="btn btn-xs btn-primary"
//                   onClick={() =>
//                     redirect(
//                       `/service-reviews/${btoa(row.bookedServiceId.toString())}/${btoa(row.serviceId.toString())}`
//                     )
//                   }
//                 >
//                   Add Reviews
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Table;
