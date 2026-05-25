import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NoDataFound from "../no-data-found";
import { API_URL } from "../../react-query/constants";
import axios from "axios";
import toast from "react-hot-toast";

interface TableRow {
  serviceId: number;
  bookedServiceId: number;
  instantService: InstantServiceObj;
  rowData: (string | number)[];
}

interface TableProps {
  headers: string[];
  rows: TableRow[];
  userId: number;
  token: string;
  refetch: () => void;
}

const Table: React.FC<TableProps> = ({ headers, rows, userId, token, refetch }) => {
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
      toast.error("Please select a future date");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/reschedule-booked-service`,
        {
          user_id: userId,
          bookingId: selectedBookingId,
          newDate: selectedDate,
          timeSlot: "Morning",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Service rescheduled successfully");
        setShowReschedulePopup(false);
        setSelectedBookingId(null);
        setSelectedDate("");
        refetch(); // Refresh table data
      } else {
        toast.error("Failed to reschedule service");
      }
    } catch (error) {
      console.error("Reschedule error:", error);
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Error rescheduling service"
          : "Error rescheduling service"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelService = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/cancel-booked-service`,
        {
          user_id: userId,
          bookingId: selectedBookingId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Service cancelled successfully");
        setShowCancelPopup(false);
        setSelectedBookingId(null);
        refetch(); // Refresh table data
      } else {
        toast.error("Failed to cancel service");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Error cancelling service"
          : "Error cancelling service"
      );
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
                  <td className="max-w-[320px] align-top">
                    {(() => {
                      const raw = row.instantService as unknown;
                      const obj =
                        typeof raw === "string"
                          ? (() => {
                              try {
                                return JSON.parse(raw);
                              } catch {
                                return null;
                              }
                            })()
                          : raw;
                      if (!obj || typeof obj !== "object") {
                        return <span className="text-xs text-gray-500">N/A</span>;
                      }
                      const o = obj as Record<string, number | string | undefined>;
                      const worker1 = (o.worker_1_label as string | undefined)?.trim() || "Mason";
                      const worker2 = (o.worker_2_label as string | undefined)?.trim() || "Helper";

                      const f = (v: unknown) => {
                        const n = parseFloat(String(v ?? 0));
                        return Number.isFinite(n) ? n : 0;
                      };
                      const sumTotal =
                        f(o.totalMasonDayRate) +
                        f(o.totalHelperDayRate) +
                        f(o.totalMasonOvertimeRate) +
                        f(o.totalHelperOvertimeRate);

                      return (
                        <div className="text-xs space-y-1">
                          <div>
                            <strong>{worker1}:</strong> {o.MasonDayCount ?? 0}{" "}
                            <span className="text-gray-500">*</span> {o.MasonRate ?? 0}
                          </div>
                          <div>
                            <strong>{worker2}:</strong> {o.helperDayCount ?? 0}{" "}
                            <span className="text-gray-500">*</span> {o.helperRate ?? 0}
                          </div>
                          <div>
                            <strong>{worker1} Overtime:</strong> {o.MasonOvertimeCount ?? 0}{" "}
                            <span className="text-gray-500">*</span> {o.MasonOvertimeRate ?? 0}
                          </div>
                          <div>
                            <strong>{worker2} Overtime:</strong> {o.helperOvertimeCount ?? 0}{" "}
                            <span className="text-gray-500">*</span> {o.helperOvertimeRate ?? 0}
                          </div>
                          <div className="pt-1 border-t border-base-300 mt-1">
                            <strong>Total:</strong> {sumTotal}
                          </div>
                          <div>Tip: {f(o.tipValue)}</div>
                          <div className="font-semibold">Total Price: {f(o.totalDayPrice)}</div>
                        </div>
                      );
                    })()}
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
              min={new Date().toISOString().split("T")[0]}
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
