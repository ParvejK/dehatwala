export const BOOKING_STEPS = [
  { step: 1, label: "Select Workers", segment: "select-worker" },
  { step: 2, label: "Booking Details", segment: "booking-details" },
  { step: 3, label: "Payment", segment: "payment" },
] as const;

export type BookingSegment = (typeof BOOKING_STEPS)[number]["segment"];

export const bookingPath = (slug: string, segment: BookingSegment) => `/book/${slug}/${segment}`;
