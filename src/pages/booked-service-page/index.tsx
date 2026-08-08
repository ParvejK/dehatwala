
import { useAuthStore } from "../../store/auth-store";

import { Navigate } from "react-router-dom";
import { useBookedService } from "../../react-query/auth-booked-service-api";
import Table from "../../components/table";
import Container from "../../components/shared/container";

const BookedServicePage = () => {
  const { token, user } = useAuthStore();

  const userId = user?.id;
  const isSignedIn = !!token && !!userId;

  const { data, isLoading, error, refetch } = useBookedService(token || "");

  // Send the visitor to sign-in *before* rendering, and bring them back here
  // afterwards. Rendering first passed an undefined userId/token into <Table>.
  if (!isSignedIn) return <Navigate to="/sign-in?path=/booked-services" replace />;

  if (isLoading)
    return (
      <div className="mt-10 mb-[100px] min-h-[50vh]">
        <Container>
          <div className="skeleton h-4 w-28 mb-4"></div>
          <div className="flex flex-col gap-4">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="skeleton h-4 w-full"></div>
            ))}
          </div>
        </Container>
      </div>
    );
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  // Table headers
  const headers = [
    "#ID",
    "Service Detail",
    "Mode",
    "Address",
    "State",
    "City",
    "Book date",
    "Time slot",
    "Pick & drop",
    "Tip",
    "Transaction Id",
    "Total Amount",
    "Actions",
    "Instant Service Detail",
  ];
  const rows =
    data?.booked_services.map((service) => ({
      bookedServiceId: service.id,
      serviceId: service.service_id,
      bookDate: service.book_date,
      timeSlot: service.time_slot,
      serviceTitle: service.service_title,
      serviceWorkers: service.service_worker_obj,
      rowData: [
        service.id,
        service.service_title || "N/A",
        service.mode,
        service.address,
        service.state_name || "N/A",
        service.city_name || "N/A",
        service.book_date,
        service.time_slot,
        service.pick_and_drop ? "Yes" : "No",
        `₹${service.tip.toFixed(2)}`,
        service.transaction_id || "N/A",
        `₹${service.total_amount.toFixed(2)}`,
      ],
    })) || [];

  return (
    <div className="mt-10 mb-[100px] min-h-[50vh]">
      <Container>
        <h2 className="text-xl md:text-2xl font-bold text-black mb-10">Booked Services</h2>
        <Table headers={headers} rows={rows} userId={userId} token={token} refetch={refetch} />
      </Container>
    </div>
  );
};

export default BookedServicePage;
