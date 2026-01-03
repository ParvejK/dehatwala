import axios from "axios";
import { employeeFormData } from "../schema/permanent-service/schema";
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

export const fetchInstantService = (serviceId: number) =>
  axios.get<InstantApiResponse>(`${API_URL}/get-instant-service/${serviceId}`).then((res) => res.data);

export const fetchPermanentService = (serviceId: number) =>
  axios.get<PermanentServiceResponse>(`${API_URL}/get-permanent-service/${serviceId}`).then((res) => res.data);

/**
 * @PermanentService
 * Post User Data
 */

export const postEmployeeData = async (data: employeeFormData) => {
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
