// import { useEffect } from "react";
// import { useAuthStore } from "../../store/auth-store";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useBookedService } from "../../react-query/auth-booked-service-api";
// import Table from "../../components/table";
// import Container from "../../components/shared/container";

// const BookedServicePage = () => {
//   const navigate = useNavigate();
//   const { token, user } = useAuthStore();

//   const userId = user?.id;

//   useEffect(() => {
//     if (!token || !userId) {
//       toast.error("Access denied. Please log in to continue.");
//       navigate("/");
//     }
//   }, [token, userId, navigate]);

//   // const userId = parseInt(userId || "0", 10);
//   const { data, isLoading, error } = useBookedService(userId, token || "");

//   if (isLoading)
//     return (
//       <div className="mt-10 mb-[100px] min-h-[50vh]">
//         <Container>
//           <div className="skeleton h-4 w-28 mb-4"></div>
//           <div className="flex flex-col gap-4">
//             {[...Array(10)].map((_, index) => (
//               <div key={index} className="skeleton h-4 w-full"></div>
//             ))}
//           </div>
//         </Container>
//       </div>
//     );
//   if (error instanceof Error) return <p>Error: {error.message}</p>;

//   // Table
//   const headers = [
//     "#ID",
//     "Service Detail",
//     "Mode",
//     "Address",
//     "State",
//     "City",
//     "Book date",
//     "Time slot",
//     "Pick & drop",
//     "Tip",
//     "Transaction Id",
//     "Total Amount",
//     "Instant Service Detail",
//     "Actions",
//   ];
//   const rows =
//     data?.booked_services.map((service) => ({
//       bookedServiceId: service.id,
//       serviceId: service.service_id,
//       rowData: [
//         service.id,
//         service.service_id,
//         service.mode,
//         service.address,
//         service.state_name,
//         service.city_name,
//         service.book_date,
//         service.time_slot,
//         service.pick_and_drop,
//         service.tip,
//         service.transaction_id,
//         service.instant_service_obj || "N/A",
//         ,
//         `₹${service.total_amount.toFixed(2)}`,
//       ],
//     })) || [];

//   return (
//     <div className="mt-10 mb-[100px] min-h-[50vh]">
//       <Container>
//         <h2 className="text-2xl font-semibold mb-10">Booked Services</h2>
//         <Table headers={headers} rows={rows} />
//       </Container>
//     </div>
//   );
// };

// export default BookedServicePage;
import { useEffect } from "react";
import { useAuthStore } from "../../store/auth-store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useBookedService } from "../../react-query/auth-booked-service-api";
import Table from "../../components/table";
import Container from "../../components/shared/container";

const BookedServicePage = () => {
  const navigate = useNavigate();
  const { token, user } = useAuthStore();

  const userId = user?.id;

  useEffect(() => {
    if (!token || !userId) {
      toast.error("Access denied. Please log in to continue.");
      navigate("/");
    }
  }, [token, userId, navigate]);

  const { data, isLoading, error } = useBookedService(userId, token || "");

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

  // Table
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
      instantService: service.instant_service_obj,
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
        // service.instant_service_obj ? JSON.stringify(service.instant_service_obj, null, 2) : "N/A",
      ],
    })) || [];

  return (
    <div className="mt-10 mb-[100px] min-h-[50vh]">
      <Container>
        <h2 className="text-xl md:text-2xl font-semibold mb-10">Booked Services</h2>
        <Table headers={headers} rows={rows} />
      </Container>
    </div>
  );
};

export default BookedServicePage;
