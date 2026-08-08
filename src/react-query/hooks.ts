import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  CareerContentResponse,
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
  InstantApiResponse,
  PartnersApiResponse,
  TopCompaniesApiResponse,
  LabourTestimonialsApiResponse,
  PermanentServiceResponse,
  PolicyApiResponse,
  ServiceApiResponse,
  ServiceDetailApiResponse,
  ServicesProps,
  SingleBlogProps,
  SliderProps,
  SubCategoryProps,
} from "../types";
import {
  fetchBlog,
  fetchCareerContent,
  fetchCareerOpening,
  fetchCareerOpenings,
  fetchBlogCategories,
  fetchBlogsByCategory,
  fetchCategories,
  fetchHeroCarousel,
  fetchJoinUsCategories,
  fetchMediaNews,
  fetchMediaNewsDetail,
  fetchMediaPhotos,
  fetchMediaPublications,
  fetchMediaVideos,
  fetchHomeServices,
  fetchInstantService,
  fetchPermanentService,
  fetchServiceDetail,
  fetchServices,
  fetchServicesPage,
  fetchSingleBlog,
  fetchSubCategories,
  fetchUserAddresses,
  getClients,
  getFaqCategories,
  getFaqs,
  getPartners,
  getTopCompanies,
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

export function useSubCategories(categoryId: number) {
  return useQuery<SubCategoryProps, Error>({
    queryKey: ["subCategory", categoryId],
    queryFn: async () => fetchSubCategories(categoryId),
  });
}

export function useSubFormCategories(selectedCategoryIds: number[]) {
  return useQuery<SubCategoryProps[], Error>({
    queryKey: ["subCategories", selectedCategoryIds],
    queryFn: async () => {
      const promises = selectedCategoryIds.map((id) => fetchSubCategories(id));
      const results = await Promise.all(promises);
      // Here, we expect results to be of type SubCategoryProps
      return results; // Make sure results is of type SubCategoryProps[]
    },
    enabled: selectedCategoryIds.length > 0,
    staleTime: Infinity,
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

export function useServicesByCategory(categorySlug?: string, subCategorySlug?: string) {
  return useQuery<ServiceApiResponse, Error>({
    queryKey: ["services-by-category", categorySlug, subCategorySlug ?? ""],
    queryFn: () =>
      fetchServices({
        category_slug: categorySlug ?? "",
        sub_category_slug: subCategorySlug ?? "",
        keyword: "",
      }),
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

export function useInstantServices(slug: string) {
  return useQuery<InstantApiResponse, Error>({
    queryKey: ["instant-services", slug],
    queryFn: async () => fetchInstantService(slug),
    enabled: !!slug,
    staleTime: 10 * 1000,
  });
}

export function usePermanentServices(slug: string) {
  return useQuery<PermanentServiceResponse, Error>({
    queryKey: ["permanent-services", slug],
    queryFn: async () => fetchPermanentService(slug),
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
export function useHeroCarousel() {
  return useQuery<SliderProps, Error>({
    queryKey: ["hero-carousel"],
    queryFn: fetchHeroCarousel,
    staleTime: 10 * 1000,
  });
}

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
export function useFetchPartners() {
  return useQuery<PartnersApiResponse, Error>({
    queryKey: ["partners"],
    queryFn: getPartners,
    staleTime: Infinity,
  });
}

// Top Companies
export function useFetchTopCompanies() {
  return useQuery<TopCompaniesApiResponse, Error>({
    queryKey: ["top-companies"],
    queryFn: getTopCompanies,
    staleTime: Infinity,
  });
}

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

export function useCareerContent() {
  return useQuery<CareerContentResponse, Error>({
    queryKey: ["career-content"],
    queryFn: fetchCareerContent,
    staleTime: Infinity,
  });
}

export function useJoinUsCategories() {
  return useQuery<CategoriesProps, Error>({
    queryKey: ["join-us-categories"],
    queryFn: fetchJoinUsCategories,
    staleTime: Infinity,
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
