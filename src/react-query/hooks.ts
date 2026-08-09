import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  CareerOpeningResponse,
  CareerOpeningsResponse,
  MediaNewsDetailResponse,
  MediaNewsResponse,
  MediaPhotosResponse,
  MediaPublicationsResponse,
  MediaVideosResponse,
  UserAddressesResponse,
  BlogCategoriesResponse,
  BlogListProps,
  BlogProps,
  CategoriesProps,
  ClientsApiResponse,
  FaqApiResponse,
  FaqCategoriesApiResponse,
  LabourTestimonialsApiResponse,
  PolicyApiResponse,
  ServiceDetailApiResponse,
  ServicesProps,
  SingleBlogProps,
} from "../types";
import {
  fetchBlog,
  fetchCareerOpening,
  fetchCareerOpenings,
  fetchBlogCategories,
  fetchBlogsByCategory,
  fetchCategories,
  fetchMediaNews,
  fetchMediaNewsDetail,
  fetchMediaPhotos,
  fetchMediaPublications,
  fetchMediaVideos,
  fetchHomeServices,
  fetchServiceDetail,
  fetchServicesPage,
  fetchSingleBlog,
  fetchUserAddresses,
  getClients,
  getFaqCategories,
  getFaqs,
  getLabourTestimonials,
  getPolicies,
} from "./apis";

// Category
export function useCategories() {
  return useQuery<CategoriesProps, Error>({
    queryKey: ["category"],
    queryFn: fetchCategories,
    staleTime: 10 * 1000,
  });
}

// Services
export function useServices() {
  return useQuery<ServicesProps, Error>({
    queryKey: ["services"],
    queryFn: fetchHomeServices,
    staleTime: 10 * 1000,
  });
}

/** How many services each scroll step pulls in. */
const SERVICES_PER_PAGE = 9;

/**
 * Services for a category, one page at a time.
 *
 * The listing used to fetch every service in one request and render them all —
 * 35 rows and 35 full-size images on first paint, which only gets worse as the
 * catalogue grows. Pages are appended as the visitor scrolls.
 */
export function useInfiniteServicesByCategory(categorySlug?: string, subCategorySlug?: string) {
  return useInfiniteQuery({
    queryKey: ["services-infinite", categorySlug, subCategorySlug ?? ""],
    queryFn: ({ pageParam }) =>
      fetchServicesPage({
        category_slug: categorySlug ?? "",
        sub_category_slug: subCategorySlug ?? "",
        keyword: "",
        page: pageParam,
        per_page: SERVICES_PER_PAGE,
      }),
    initialPageParam: 1,
    // `has_more` comes from the API; without meta there is nothing more to ask
    // for, which is also the correct answer for an unpaged response.
    getNextPageParam: (lastPage) =>
      lastPage.meta?.has_more ? lastPage.meta.current_page + 1 : undefined,
    enabled: !!categorySlug,
    staleTime: 10 * 1000,
  });
}

export function useServiceDetail(slug: string) {
  return useQuery<ServiceDetailApiResponse, Error>({
    queryKey: ["service-detail", slug],
    queryFn: () => fetchServiceDetail(slug),
    enabled: !!slug,
    staleTime: 10 * 1000,
  });
}

// Blogs
export function useBlogs() {
  return useQuery<BlogProps, Error>({
    queryKey: ["blogs"],
    queryFn: fetchBlog,
    staleTime: 10 * 1000,
  });
}

export function useSingleBlog(slug: string) {
  return useQuery<SingleBlogProps, Error>({
    queryKey: ["single-blogs", slug],
    queryFn: () => fetchSingleBlog(slug),
  });
}

export function useBlogCategories() {
  return useQuery<BlogCategoriesResponse, Error>({
    queryKey: ["blog-categories"],
    queryFn: fetchBlogCategories,
    staleTime: Infinity,
  });
}

export function useBlogsByCategory(categorySlug?: string) {
  return useQuery<BlogListProps, Error>({
    queryKey: ["blogs-by-category", categorySlug],
    queryFn: () => fetchBlogsByCategory(categorySlug ?? ""),
    enabled: !!categorySlug,
    staleTime: 10 * 1000,
  });
}

// Carousel
// FAQs
export function useFetchFaqCategories() {
  return useQuery<FaqCategoriesApiResponse, Error>({
    queryKey: ["faq-categories"],
    queryFn: getFaqCategories,
    staleTime: Infinity,
  });
}

export function useFetchFaqs() {
  return useQuery<FaqApiResponse, Error>({
    queryKey: ["faqs"],
    queryFn: getFaqs,
    staleTime: Infinity,
  });
}

// Clients
export function useFetchClients() {
  return useQuery<ClientsApiResponse, Error>({
    queryKey: ["clients"],
    queryFn: getClients,
    // staleTime: Infinity,
  });
}

// Clients
// Top Companies
// Labour Testimonials
export function useFetchLabourTestimonials() {
  return useQuery<LabourTestimonialsApiResponse, Error>({
    queryKey: ["labour-testimonials"],
    queryFn: getLabourTestimonials,
    staleTime: Infinity,
  });
}

// Clients
export function useFetchPolicies(slug: string) {
  return useQuery<PolicyApiResponse, Error>({
    queryKey: ["policies", slug],
    queryFn: () => getPolicies(slug),
    staleTime: Infinity,
  });
}


// Careers
export function useCareerOpenings() {
  return useQuery<CareerOpeningsResponse, Error>({
    queryKey: ["career-openings"],
    queryFn: fetchCareerOpenings,
    staleTime: 10 * 1000,
  });
}

export function useCareerOpening(slug?: string) {
  return useQuery<CareerOpeningResponse, Error>({
    queryKey: ["career-opening", slug],
    queryFn: () => fetchCareerOpening(slug ?? ""),
    enabled: !!slug,
    staleTime: 10 * 1000,
  });
}

// Media & News
export function useMediaPublications() {
  return useQuery<MediaPublicationsResponse, Error>({
    queryKey: ["media-publications"],
    queryFn: fetchMediaPublications,
    staleTime: Infinity,
  });
}

export function useMediaNews() {
  return useQuery<MediaNewsResponse, Error>({
    queryKey: ["media-news"],
    queryFn: fetchMediaNews,
    staleTime: 10 * 1000,
  });
}

export function useMediaNewsDetail(slug?: string) {
  return useQuery<MediaNewsDetailResponse, Error>({
    queryKey: ["media-news-detail", slug],
    queryFn: () => fetchMediaNewsDetail(slug ?? ""),
    enabled: !!slug,
    staleTime: 10 * 1000,
  });
}

export function useMediaVideos() {
  return useQuery<MediaVideosResponse, Error>({
    queryKey: ["media-videos"],
    queryFn: fetchMediaVideos,
    staleTime: 10 * 1000,
  });
}

export function useMediaPhotos() {
  return useQuery<MediaPhotosResponse, Error>({
    queryKey: ["media-photos"],
    queryFn: fetchMediaPhotos,
    staleTime: 10 * 1000,
  });
}

// Saved addresses
export function useUserAddresses(userId?: number) {
  return useQuery<UserAddressesResponse, Error>({
    queryKey: ["user-addresses", userId],
    queryFn: () => fetchUserAddresses(userId ?? 0),
    enabled: !!userId,
    staleTime: 10 * 1000,
  });
}
