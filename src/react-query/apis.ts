import axios from "axios";
import { EmployeeFormData } from "../schema/permanent-service/schema";
import { FormJoinUsType } from "../schema/step-form";
import {
  BlogCategoriesResponse,
  BlogListProps,
  BlogProps,
  CategoriesProps,
  CateGoryApiResponse,
  CitiesResponse,
  ClientsApiResponse,
  FaqApiResponse,
  FaqCategoriesApiResponse,
  FormInputs,
  InstantApiResponse,
  JobApiResponse,
  JobCategoryApiResponse,
  JobDetailApiResponse,
  JobSliderProps,
  PartnersApiResponse,
  PermanentServiceResponse,
  PolicyApiResponse,
  SearchPostProps,
  ServiceApiResponse,
  ServiceDetailApiResponse,
  ServicesProps,
  SingleBlogProps,
  SliderProps,
  StateProps,
  SubCategoryProps,
  TopCompaniesApiResponse,
  LabourTestimonialsApiResponse,
  CheckAvailabilityPayload,
  CheckAvailabilityResponse,
  CareerApplicationPayload,
  CareerApplicationResponse,
  CareerContentResponse,
  CareerOpeningResponse,
  CareerOpeningsResponse,
  MediaNewsDetailResponse,
  MediaNewsResponse,
  MediaPhotosResponse,
  MediaPublicationsResponse,
  MediaVideosResponse,
  SaveUserAddressPayload,
  SaveUserAddressResponse,
  UserAddressesResponse,
} from "../types";
import { API_URL } from "./constants";

/**
 * @Categories
 * Get Categories data.
 */
export const fetchCategories = () => axios.get<CategoriesProps>(`${API_URL}/get-categories`).then((res) => res.data);

export const fetchSubCategories = (categoryId: number) =>
  axios.get<SubCategoryProps>(`${API_URL}/get-sub-category/${categoryId}`).then((res) => res.data);

/** Work types offered on the worker registration form. */
export const fetchJoinUsCategories = () =>
  axios.get<CategoriesProps>(`${API_URL}/get-join-us-category`).then((res) => res.data);

/**
 * @Blog
 * Get Blog data.
 */

export const fetchBlog = () => axios.get<BlogProps>(`${API_URL}/get-blogs`).then((res) => res.data);

export const fetchSingleBlog = (slug: string) =>
  axios.get<SingleBlogProps>(`${API_URL}/get-blog/${slug}`).then((res) => res.data);

export const fetchBlogCategories = () =>
  axios.get<BlogCategoriesResponse>(`${API_URL}/get-blog-categories`).then((res) => res.data);

/** `?category=` narrows to one category and returns the slim `{ total, blogs }` shape. */
export const fetchBlogsByCategory = (categorySlug: string) =>
  axios
    .get<BlogListProps>(`${API_URL}/get-blogs`, { params: { category: categorySlug } })
    .then((res) => res.data);

/**
 * @HomeSlider
 * Get Slider data.
 */

export const fetchHeroCarousel = () => axios.get<SliderProps>(`${API_URL}/get-sliders`).then((res) => res.data);

/**
 * @JobSlider
 * Get Slider data.
 */

export const fetchJobCarousel = () => axios.get<JobSliderProps>(`${API_URL}/job-sliders`).then((res) => res.data);

/**
 * @InstantService
 * Get Slider data.
 */

export const fetchInstantService = (slug: string) =>
  axios.get<InstantApiResponse>(`${API_URL}/get-instant-service/${slug}`).then((res) => res.data);

export const fetchPermanentService = (slug: string) =>
  axios.get<PermanentServiceResponse>(`${API_URL}/get-permanent-service/${slug}`).then((res) => res.data);

/**
 * @PermanentService
 * Post User Data
 */

export const postEmployeeData = async (data: EmployeeFormData) => {
  const response = await axios.post(`${API_URL}/save-query-permanent-service`, data);
  return response.data;
};

/**
 * @PermanentService
 * Post User Data
 */
export const stepFormeData = async (data: FormJoinUsType) => {
  const response = await axios.post(`${API_URL}/save-join-us-data`, data);
  return response.data;
};

/**
 * @JobCategory
 * Post User Data
 */
export const jobsCategory = async () => {
  const response = await axios.get<CateGoryApiResponse>(`${API_URL}/get-jobs-category`);
  return response.data;
};

export const jobsCategoryBySlug = async (slug: string) => {
  const response = await axios.get<JobCategoryApiResponse>(`${API_URL}/get-job-category/${slug}`);
  return response.data;
};

export const searchCategory = async () => {
  const response = await axios.post<SearchPostProps>(`${API_URL}/get-job-category`);
  return response.data;
};

export const jobs = async () => {
  const response = await axios.post<JobApiResponse>(`${API_URL}/get-jobs`);
  return response.data;
};

export const fetchJobs = async (filters: Record<string, string>) => {
  const response = await axios.post(`${API_URL}/get-jobs`, filters);
  return response.data;
};

export const jobsBySlug = async (slug: string) => {
  if (!slug) {
    throw new Error("No slug provided");
  }
  const response = await axios.get<JobDetailApiResponse>(`${API_URL}/get-job-detail/${slug}`);
  return response.data;
};

/**
 * @Apply Job
 */

export const applyJob = async (data: FormInputs) => {
  const response = await axios.post(`${API_URL}/save-apply-job`, data);
  return response.data;
};

/**
 * @Apply CITY STATE
 */

export const getStates = async () => {
  const response = await axios.get<StateProps>(`${API_URL}/get-states`);
  return response.data;
};

export const getCities = async (stateId: number) => {
  const response = await axios.get<CitiesResponse>(`${API_URL}/get-city/${stateId}`);
  return response.data;
};

/**
 * @Apply FAQs
 */

export const getFaqs = async () => {
  const response = await axios.get<FaqApiResponse>(`${API_URL}/get-faqs`);
  return response.data;
};

export const getFaqCategories = async () => {
  const response = await axios.get<FaqCategoriesApiResponse>(`${API_URL}/get-faq-categories`);
  return response.data;
};


/**
 * @Apply Clients
 */

export const getClients = async () => {
  const response = await axios.get<ClientsApiResponse>(`${API_URL}/get-client-says`);
  return response.data;
};

/**
 * @Apply Partners
 */

export const getPartners = async () => {
  const response = await axios.get<PartnersApiResponse>(`${API_URL}/get-partners`);
  return response.data;
};

/**
 * @Apply Top Companies
 */

export const getTopCompanies = async () => {
  const response = await axios.get<TopCompaniesApiResponse>(`${API_URL}/get-top-companies`);
  return response.data;
};

/**
 * @Labour Testimonials
 */

export const getLabourTestimonials = async () => {
  const response = await axios.get<LabourTestimonialsApiResponse>(`${API_URL}/labour-testimonials`);
  return response.data;
};

/**
 * @Addresses
 * Saved worksite addresses. Written from booking step 2 and managed on the
 * dashboard. A failed save never blocks a booking.
 */
export const saveUserAddress = (payload: SaveUserAddressPayload) =>
  axios.post<SaveUserAddressResponse>(`${API_URL}/save-user-address`, payload).then((res) => res.data);

export const fetchUserAddresses = (userId: number) =>
  axios.get<UserAddressesResponse>(`${API_URL}/user-addresses/${userId}`).then((res) => res.data);

/**
 * @CheckAvailability
 * Check if service is available for the given state / city / pincode
 */
export const checkAvailability = async (payload: CheckAvailabilityPayload) => {
  const response = await axios.post<CheckAvailabilityResponse>(`${API_URL}/check-availability`, payload);
  return response.data;
};

/**
 * @Apply Policies
 */

export const getPolicies = async (slug: string) => {
  const response = await axios.get<PolicyApiResponse>(`${API_URL}/page/${slug}`);
  return response.data;
};

/**
 * @Apply Services
 */

/**
 * @Services
 * Get Services data.
 */

export const fetchHomeServices = () => axios.get<ServicesProps>(`${API_URL}/get-services`).then((res) => res.data);

export const fetchServices = async (filters: { category_slug: string; sub_category_slug: string; keyword: string }) => {
  const response = await axios.post<ServiceApiResponse>(`${API_URL}/get-services`, filters);
  return response.data;
};

export const fetchServiceDetail = (slug: string) =>
  axios.get<ServiceDetailApiResponse>(`${API_URL}/get-service-detail/${slug}`).then((res) => res.data);

/**
 * @Careers
 */

export const fetchCareerOpenings = () =>
  axios.get<CareerOpeningsResponse>(`${API_URL}/career-openings`).then((res) => res.data);

export const fetchCareerOpening = (slug: string) =>
  axios.get<CareerOpeningResponse>(`${API_URL}/career-openings/${slug}`).then((res) => res.data);

export const fetchCareerContent = () =>
  axios.get<CareerContentResponse>(`${API_URL}/career-content`).then((res) => res.data);

/** Submit a career application (with CV) as multipart/form-data. */
export const submitCareerApplication = async (payload: CareerApplicationPayload) => {
  const body = new FormData();
  body.append("name", payload.name);
  body.append("mobile_number", payload.mobile_number);
  body.append("email", payload.email);
  body.append("state_id", payload.state_id);
  body.append("city_id", payload.city_id);
  body.append("role", payload.role);
  body.append("source", payload.source);
  if (payload.message) body.append("message", payload.message);
  body.append("cv", payload.cv);

  const response = await axios.post<CareerApplicationResponse>(`${API_URL}/career-application`, body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * @Media & News
 */

export const fetchMediaPublications = () =>
  axios.get<MediaPublicationsResponse>(`${API_URL}/media/publications`).then((res) => res.data);

export const fetchMediaNews = () => axios.get<MediaNewsResponse>(`${API_URL}/media/news`).then((res) => res.data);

export const fetchMediaNewsDetail = (slug: string) =>
  axios.get<MediaNewsDetailResponse>(`${API_URL}/media/news/${slug}`).then((res) => res.data);

export const fetchMediaVideos = () => axios.get<MediaVideosResponse>(`${API_URL}/media/videos`).then((res) => res.data);

export const fetchMediaPhotos = () => axios.get<MediaPhotosResponse>(`${API_URL}/media/photos`).then((res) => res.data);

export const updateUserAddress = (id: number, payload: SaveUserAddressPayload) =>
  axios.put<SaveUserAddressResponse>(`${API_URL}/user-addresses/${id}`, payload).then((res) => res.data);

export const deleteUserAddress = (id: number) =>
  axios.delete<{ success: boolean; message: string }>(`${API_URL}/user-addresses/${id}`).then((res) => res.data);

export const setDefaultUserAddress = (id: number) =>
  axios.patch<SaveUserAddressResponse>(`${API_URL}/user-addresses/${id}/default`).then((res) => res.data);
