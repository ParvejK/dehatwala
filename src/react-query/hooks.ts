import { useQuery } from "@tanstack/react-query";
import {
  BlogProps,
  CategoriesProps,
  CateGoryApiResponse,
  ClientsApiResponse,
  FaqApiResponse,
  InstantApiResponse,
  JobApiResponse,
  JobCategoryApiResponse,
  JobDetailApiResponse,
  PartnersApiResponse,
  PermanentServiceResponse,
  PolicyApiResponse,
  ServiceDetailApiResponse,
  ServicesProps,
  SingleBlogProps,
  SliderProps,
  SubCategoryProps,
} from "../types";
import {
  fetchBlog,
  fetchCategories,
  fetchHeroCarousel,
  fetchHomeServices,
  fetchInstantService,
  fetchPermanentService,
  fetchServiceDetail,
  fetchSingleBlog,
  fetchSubCategories,
  getClients,
  getFaqs,
  getPartners,
  getPolicies,
  jobs,
  jobsBySlug,
  jobsCategory,
  jobsCategoryBySlug,
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

export function useServiceDetail(slug: string) {
  return useQuery<ServiceDetailApiResponse, Error>({
    queryKey: ["service-detail", slug],
    queryFn: () => fetchServiceDetail(slug),
    staleTime: 10 * 1000,
  });
}

export function useInstantServices(serviceId: number) {
  return useQuery<InstantApiResponse, Error>({
    queryKey: ["instant-services", serviceId],
    queryFn: async () => fetchInstantService(serviceId),
    staleTime: 10 * 1000,
  });
}

export function usePermanentServices(serviceId: number) {
  return useQuery<PermanentServiceResponse, Error>({
    queryKey: ["permanent-services", serviceId],
    queryFn: async () => fetchPermanentService(serviceId),
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

// Carousel
export function useHeroCarousel() {
  return useQuery<SliderProps, Error>({
    queryKey: ["hero-carousel"],
    queryFn: fetchHeroCarousel,
    staleTime: 10 * 1000,
  });
}

// Jobs
export function useJobsCategory() {
  return useQuery<CateGoryApiResponse, Error>({
    queryKey: ["job-category"],
    queryFn: jobsCategory,
    staleTime: 10 * 1000,
  });
}

export function useJobsCategoryBySlug(slug: string) {
  return useQuery<JobCategoryApiResponse, Error>({
    queryKey: ["jobs", slug],
    queryFn: () => jobsCategoryBySlug(slug),
    staleTime: 10 * 1000,
  });
}

export function useJobs() {
  return useQuery<JobApiResponse, Error>({
    queryKey: ["jobs"],
    queryFn: jobs,
    staleTime: 10 * 1000,
  });
}

export function useJobsBySlug(slug: string) {
  return useQuery<JobDetailApiResponse, Error>({
    queryKey: ["job-detail", slug],
    queryFn: () => jobsBySlug(slug),
    staleTime: 10 * 1000,
    enabled: !!slug,
  });
}

// FAQs
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

// Clients
export function useFetchPolicies(slug: string) {
  return useQuery<PolicyApiResponse, Error>({
    queryKey: ["policies", slug],
    queryFn: () => getPolicies(slug),
    staleTime: Infinity,
  });
}

// Clients
// export function useFetchServices() {
//   return useQuery<ServiceApiResponse, Error>({
//     queryKey: ["services"],
//     queryFn: getServices,
//     staleTime: Infinity,
//   });
// }
