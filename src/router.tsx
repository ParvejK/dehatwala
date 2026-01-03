import { createBrowserRouter } from "react-router-dom";
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
import JobListingsPage from "./pages/job-listings-page";
import JobCategoriesPage from "./pages/job-categories-page";
import DetailedJobListingPage from "./pages/detailed-job-listing-page";
import JobDetailedViewPage from "./pages/detailed-job-view-page";
import BlogDetailPage from "./pages/blog-detail-page";
import ApplyJobPage from "./pages/apply-job-page";
import PolicyPage from "./pages/policy-page";
import SignIn from "./pages/sign-in-page";
import ForgotPassword from "./pages/forgot-password-page";
import ServiceListingPage from "./pages/service-listing-page";
import SignUp from "./pages/sign-up-page";
import ProtectedRoute from "./protected-route";
import BookedServicePage from "./pages/booked-service-page";
import InstantServiceReviewsPage from "./pages/service-review-page";
import AddReviewsPage from "./pages/instant-service-reviews-page";

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
        path: "/blog/:slug",
        element: <BlogDetailPage />,
      },
      {
        path: "/instant-service/:id",
        element: <InstantServices />,
      },
      {
        path: "/permanent-service/:id",
        element: <PermanentServices />,
      },
      {
        path: "/services-detail/:slug",
        element: <ServicesDetailsPage />,
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
        path: "/jobs",
        element: <JobListingsPage />,
      },
      {
        path: "/more-jobs",
        element: <JobCategoriesPage />,
      },
      {
        path: "/more-jobs/:slug",
        element: <DetailedJobListingPage />,
      },
      {
        path: "/job-detail/:slug",
        element: <JobDetailedViewPage />,
      },
      {
        path: "/job-detail/:slug/:id",
        element: <ApplyJobPage />,
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
        path: "/service/:category_slug/:sub_category_slug?",
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
