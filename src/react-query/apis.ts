import axios from "axios";
import { EmployeeFormData } from "../schema/permanent-service/schema";
import { FormJoinUsType } from "../schema/step-form";
import {
  BlogProps,
  CategoriesProps,
  CateGoryApiResponse,
  CitiesResponse,
  ClientsApiResponse,
  FaqApiResponse,
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
} from "../types";
import { API_URL } from "./constants";

/**
 * @Categories
 * Get Categories data.
 */
export const fetchCategories = () => axios.get<CategoriesProps>(`${API_URL}/get-categories`).then((res) => res.data);

export const fetchSubCategories = (categoryId: number) =>
  axios.get<SubCategoryProps>(`${API_URL}/get-sub-category/${categoryId}`).then((res) => res.data);

/**
 * @Blog
 * Get Blog data.
 */

export const fetchBlog = () => axios.get<BlogProps>(`${API_URL}/get-blogs`).then((res) => res.data);

export const fetchSingleBlog = (slug: string) =>
  axios.get<SingleBlogProps>(`${API_URL}/get-blog/${slug}`).then((res) => res.data);

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
 * Submit a career application (with CV) as multipart/form-data.
 *
 * NOTE: `POST /career-application` does not exist in the Laravel API yet — see
 * the contract in the careers apply page. Until it is added the request 404s and
 * the form falls back to the email route.
 */
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
