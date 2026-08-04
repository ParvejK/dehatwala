import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NoDataFound from "../no-data-found";
import { InstantServiceObj } from "../../react-query/booking-type";
import { API_URL } from "../../react-query/constants";
import axios from "axios";
import toast from "react-hot-toast";

interface TableRow {
  serviceId: number;
  bookedServiceId: number;
  bookDate?: string;
  timeSlot?: string;
  serviceTitle?: string;
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
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedServiceTitle, setSelectedServiceTitle] = useState<string>("");
  const [originalDate, setOriginalDate] = useState<string>("");
  const [originalTime, setOriginalTime] = useState<string>("");
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

  // Normalize various API date formats to the yyyy-MM-dd that <input type="date"> expects
  const toDateInputValue = (raw?: string) => {
    if (!raw) return "";
    const trimmed = raw.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    const d = new Date(trimmed);
    if (isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Normalize various time formats ("HH:MM", "HH:MM:SS", "9:30 AM") to "HH:MM"
  const toTimeInputValue = (raw?: string) => {
    if (!raw) return "";
    const trimmed = raw.trim();
    const m24 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (m24) {
      const h = String(Math.min(23, parseInt(m24[1], 10))).padStart(2, "0");
      return `${h}:${m24[2]}`;
    }
    const m12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
    if (m12) {
      let h = parseInt(m12[1], 10) % 12;
      if (m12[3].toLowerCase() === "pm") h += 12;
      return `${String(h).padStart(2, "0")}:${m12[2]}`;
    }
    return "";
  };

  const openReschedulePopup = (
    bookedServiceId: number,
    bookDate?: string,
    timeSlot?: string,
    serviceTitle?: string
  ) => {
    const date = toDateInputValue(bookDate);
    const time = toTimeInputValue(timeSlot);
    setSelectedBookingId(bookedServiceId);
    setSelectedDate(date);
    setSelectedTime(time);
    setOriginalDate(date);
    setOriginalTime(time);
    setSelectedServiceTitle(serviceTitle || "");
    setShowReschedulePopup(true);
  };

  const openCancelPopup = (bookedServiceId: number, serviceTitle?: string) => {
    setSelectedBookingId(bookedServiceId);
    setSelectedServiceTitle(serviceTitle || "");
    setShowCancelPopup(true);
  };

  const handleReschedule = async () => {
    if (!selectedDate) {
      toast.error("Please select a future date");
      return;
    }
    if (!selectedTime) {
      toast.error("Please select an arrival time");
      return;
    }
    if (selectedDate === originalDate && selectedTime === originalTime) {
      toast("No changes to update.", { icon: "ℹ️" });
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
          timeSlot: selectedTime,
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
        setSelectedTime("");
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
              {currentRows.map((row, rowIndex) => {
                // Booking is "over" when its scheduled date is strictly before today (date-only compare)
                const isBookingOver = (() => {
                  if (!row.bookDate) return false;
                  const booked = new Date(row.bookDate);
                  if (isNaN(booked.getTime())) return false;
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  booked.setHours(0, 0, 0, 0);
                  return booked.getTime() < today.getTime();
                })();
                return (
                  <tr key={rowIndex}>
                    {row.rowData.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}

                    <td>
                      <div className="flex gap-2 flex-wrap">
                        {isBookingOver && (
                          <button
                            className="btn btn-xs btn-primary min-w-[100px]"
                            onClick={() =>
                              redirect(
                                `/service-reviews/${btoa(row.bookedServiceId.toString())}/${btoa(
                                  row.serviceId.toString()
                                )}`
                              )
                            }
                          >
                            Add Reviews
                          </button>
                        )}
                        <button
                          className="btn btn-xs btn-info min-w-[100px]"
                          onClick={() =>
                            openReschedulePopup(row.bookedServiceId, row.bookDate, row.timeSlot, row.serviceTitle)
                          }
                          disabled={isLoading || isBookingOver}
                          title={isBookingOver ? "Booking date has passed" : undefined}
                        >
                          Re-Schedule
                        </button>
                        <button
                          className="btn btn-xs btn-error min-w-[100px]"
                          onClick={() => openCancelPopup(row.bookedServiceId, row.serviceTitle)}
                          disabled={isLoading || isBookingOver}
                          title={isBookingOver ? "Booking date has passed" : undefined}
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
                );
              })}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-[fadeIn_0.15s_ease-out]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Re-Schedule Service</h2>
                <p className="text-xs text-gray-500 mt-0.5">Update the date and arrival time</p>
              </div>
              <button
                onClick={() => setShowReschedulePopup(false)}
                disabled={isLoading}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-700 transition disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {selectedServiceTitle && (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium px-3 py-2 rounded-md">
                  <span className="opacity-70">Service</span>
                  <span className="font-semibold">{selectedServiceTitle}</span>
                </div>
              )}

              <div>
                <label htmlFor="reschedule_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  id="reschedule_date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input input-bordered w-full"
                  min={new Date().toISOString().split("T")[0]}
                />
                <p className="text-xs text-gray-500 mt-1">(worker will reach on this date)</p>
              </div>

              <div>
                <label htmlFor="reschedule_time" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Arrival Time
                </label>
                <input
                  id="reschedule_time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="input input-bordered w-full"
                />
                <p className="text-xs text-gray-500 mt-1">(Select time slot when worker should start)</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setShowReschedulePopup(false)}
                className="btn btn-sm btn-ghost"
                disabled={isLoading}
              >
                Close
              </button>
              <button onClick={handleReschedule} className="btn btn-sm btn-primary min-w-[120px]" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    Updating...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Popup */}
      {showCancelPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-[fadeIn_0.15s_ease-out]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Cancel Service</h2>
                  <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={() => setShowCancelPopup(false)}
                disabled={isLoading}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-700 transition disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-3">
              {selectedServiceTitle && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-xs font-medium px-3 py-2 rounded-md">
                  <span className="opacity-70">Service</span>
                  <span className="font-semibold">{selectedServiceTitle}</span>
                </div>
              )}
              <p className="text-sm text-gray-600">Are you sure you want to cancel this service?</p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setShowCancelPopup(false)}
                className="btn btn-sm btn-ghost"
                disabled={isLoading}
              >
                No, Keep it
              </button>
              <button
                onClick={handleCancelService}
                className="btn btn-sm btn-error min-w-[120px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
