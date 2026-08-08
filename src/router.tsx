import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./layout";
import HomePage from "./pages/home-page";
import ErrorPage from "./pages/error-page";
import BlogPage from "./pages/blog-page";
import ContactUsPage from "./pages/contact-page";
import AboutPage from "./pages/about-page";
import FaqsPage from "./pages/faqs-page";
import InstantServices from "./pages/instant-services";
import PermanentServices from "./pages/permanent-services";
import ServicesDetailsPage from "./pages/service-detail-page";
import CartPage from "./pages/cart-page";
import ServiceLetterPage from "./pages/service-letter";
import JoinUsPage from "./pages/joinus-page";
import JoinUsSuccessPage from "./pages/joinus-success-page";
import CareersPage from "./pages/careers-page";
import DashboardLayout from "./components/dashboard/dashboard-layout";
import DashboardBookings from "./pages/dashboard/bookings";
import DashboardBookingDetail from "./pages/dashboard/booking-detail";
import DashboardAddresses from "./pages/dashboard/addresses";
import DashboardReviews from "./pages/dashboard/reviews";
import DashboardSettings from "./pages/dashboard/settings";
import DashboardSupport from "./pages/dashboard/support";
import CareersOpenPositionsPage from "./pages/careers-open-positions-page";
import CareersApplyPage from "./pages/careers-apply-page";
import CareersSendProfilePage from "./pages/careers-send-profile-page";
import BlogDetailPage from "./pages/blog-detail-page";
import BlogCategoryPage from "./pages/blog-category-page";
import PolicyPage from "./pages/policy-page";
import SignIn from "./pages/sign-in-page";
import ForgotPassword from "./pages/forgot-password-page";
import ServiceListingPage from "./pages/service-listing-page";
import SignUp from "./pages/sign-up-page";
import ProtectedRoute from "./protected-route";
import BookedServicePage from "./pages/booked-service-page";
import InstantServiceReviewsPage from "./pages/service-review-page";
import AddReviewsPage from "./pages/instant-service-reviews-page";
import MediaNewsPage from "./pages/media-news-page";
import MediaNewsListPage from "./pages/media-news-list-page";
import MediaNewsDetailPage from "./pages/media-news-detail-page";
import MediaVideosPage from "./pages/media-videos-page";
import MediaPhotosPage from "./pages/media-photos-page";
import SelectWorkerPage from "./pages/booking/select-worker";
import BookingDetailsPage from "./pages/booking/booking-details";
import PaymentPage from "./pages/booking/payment";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/contact",
        element: <ContactUsPage />,
      },
      {
        path: "/about-us",
        element: <AboutPage />,
      },
      {
        path: "/faqs",
        element: <FaqsPage />,
      },
      {
        path: "/blog",
        element: <BlogPage />,
      },
      {
        path: "/media-news",
        element: <MediaNewsPage />,
      },
      {
        path: "/media-news/news",
        element: <MediaNewsListPage />,
      },
      {
        path: "/media-news/news/:slug",
        element: <MediaNewsDetailPage />,
      },
      {
        path: "/media-news/videos",
        element: <MediaVideosPage />,
      },
      {
        path: "/media-news/photos",
        element: <MediaPhotosPage />,
      },
      {
        // Declared before /blog/:slug; the static "category" segment also ranks
        // higher in React Router, so it cannot be swallowed by the slug route.
        path: "/blog/category/:categorySlug",
        element: <BlogCategoryPage />,
      },
      {
        path: "/blog/:slug",
        element: <BlogDetailPage />,
      },
      {
        path: "/service/instant/:slug",
        element: <InstantServices />,
      },
      {
        path: "/service/permanent/:slug",
        element: <PermanentServices />,
      },
      {
        path: "/service/detail/:slug",
        element: <ServicesDetailsPage />,
      },
      {
        path: "/book/:slug/select-worker",
        element: <SelectWorkerPage />,
      },
      {
        path: "/book/:slug/booking-details",
        element: <BookingDetailsPage />,
      },
      {
        path: "/book/:slug/payment",
        element: <PaymentPage />,
      },
      {
        path: "/booked-services",
        element: <BookedServicePage />,
      },
      {
        path: "/service-reviews",
        element: <InstantServiceReviewsPage />,
      },
      {
        path: "/service-reviews/:bookedServiceId?/:serviceId?",
        element: <AddReviewsPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/service-letter",
        element: <ServiceLetterPage />,
      },
      {
        path: "/become-a-part-of-dehatwala",
        element: <JoinUsPage />,
      },
      {
        path: "/become-a-part-of-dehatwala/success",
        element: <JoinUsSuccessPage />,
      },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard/bookings" replace /> },
          { path: "bookings", element: <DashboardBookings /> },
          { path: "bookings/:id", element: <DashboardBookingDetail /> },
          { path: "addresses", element: <DashboardAddresses /> },
          { path: "reviews", element: <DashboardReviews /> },
          { path: "settings", element: <DashboardSettings /> },
          { path: "support", element: <DashboardSupport /> },
        ],
      },
      {
        path: "/careers",
        element: <CareersPage />,
      },
      {
        path: "/careers/open-positions",
        element: <CareersOpenPositionsPage />,
      },
      {
        path: "/careers/open-positions/:slug",
        element: <CareersApplyPage />,
      },
      {
        path: "/careers/send-profile",
        element: <CareersSendProfilePage />,
      },
      {
        path: "/sign-in",
        element: (
          <ProtectedRoute redirectTo="/">
            <SignIn />
          </ProtectedRoute>
        ),
      },
      {
        path: "/sign-up",
        element: (
          <ProtectedRoute redirectTo="/">
            <SignUp />
          </ProtectedRoute>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <ProtectedRoute redirectTo="/">
            <ForgotPassword />
          </ProtectedRoute>
        ),
      },
      {
        path: "/services/:category_slug/:sub_category_slug?",
        element: <ServiceListingPage />,
      },
      {
        path: "/:slug",
        element: <PolicyPage />,
      },
    ],
  },
]);

export default router;
