import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NoDataFound from "../no-data-found";

interface TableRow {
  serviceId: number;
  bookedServiceId: number;
  instantService: InstantServiceObj;
  rowData: (string | number)[];
}

interface TableProps {
  headers: string[];
  rows: TableRow[];
}

const Table: React.FC<TableProps> = ({ headers, rows }) => {
  const redirect = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Number of rows to display per page

  const [showReschedulePopup, setShowReschedulePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

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

  const openReschedulePopup = (bookedServiceId: number) => {
    setSelectedBookingId(bookedServiceId);
    setSelectedDate("");
    setShowReschedulePopup(true);
  };

  const openCancelPopup = (bookedServiceId: number) => {
    setSelectedBookingId(bookedServiceId);
    setShowCancelPopup(true);
  };

  const handleReschedule = async () => {
    if (!selectedDate) {
      alert("Please select a future date");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/update-book-date", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBookingId,
          newDate: selectedDate,
        }),
      });
      if (response.ok) {
        alert("Service rescheduled successfully");
        setShowReschedulePopup(false);
        setSelectedBookingId(null);
        setSelectedDate("");
      } else {
        alert("Failed to reschedule service");
      }
    } catch (error) {
      console.error("Reschedule error:", error);
      alert("Error rescheduling service");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelService = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cancel-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBookingId,
        }),
      });
      if (response.ok) {
        alert("Service cancelled successfully");
        setShowCancelPopup(false);
        setSelectedBookingId(null);
      } else {
        alert("Failed to cancel service");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Error cancelling service");
    } finally {
      setIsLoading(false);
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
                    <div className="flex gap-2 flex-wrap">
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
                      <button
                        className="btn btn-xs btn-info min-w-[100px]"
                        onClick={() => openReschedulePopup(row.bookedServiceId)}
                        disabled={isLoading}
                      >
                        Re-Schedule
                      </button>
                      <button
                        className="btn btn-xs btn-error min-w-[100px]"
                        onClick={() => openCancelPopup(row.bookedServiceId)}
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                  <td className="max-w-[300px]">
                    <td>
                      <ul>
                        {Object.entries(row.instantService).map(([key, value]) => (
                          <li key={key}>
                            <strong>{key}:</strong> {value}
                          </li>
                        ))}
                      </ul>
                    </td>

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

      {/* Re-Schedule Popup */}
      {showReschedulePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Re-Schedule Service</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input input-bordered w-full mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleReschedule}
                className="flex-1 btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Confirm"}
              </button>
              <button
                onClick={() => setShowReschedulePopup(false)}
                className="flex-1 btn btn-secondary"
                disabled={isLoading}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Popup */}
      {showCancelPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Cancel Service</h2>
            <p className="mb-6 text-gray-600">Are you sure you want to cancel this service?</p>
            <div className="flex gap-2">
              <button
                onClick={handleCancelService}
                className="flex-1 btn btn-error"
                disabled={isLoading}
              >
                {isLoading ? "Cancelling..." : "Yes, Cancel"}
              </button>
              <button
                onClick={() => setShowCancelPopup(false)}
                className="flex-1 btn btn-secondary"
                disabled={isLoading}
              >
                No, Keep it
              </button>
            </div>
          </div>
        </div>
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
