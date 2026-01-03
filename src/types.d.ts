/**
 * @type
 *  Categories Types
 */
interface Category {
  id: number;
  name: string;
  hindi_name: string | null;
  slug: string;
  parent_id: number;
  description: string;
  cat_img: string;
  image_link: string | null;
  meta_title: string | null;
  meta_keyword: string | null;
  meta_description: string | null;
  status: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// Type for the response data
interface CategoriesProps {
  categories: Category[];
}

// Type for the category card
interface CategoryCardProps {
  category: Category;
}

interface SubCategory {
  id: number;
  name: string;
  hindi_name: string | null;
  slug: string;
  parent_id: number;
  description: string;
  cat_img: string;
  image_link: string | null;
  meta_title: string | null;
  meta_keyword: string | null;
  meta_description: string | null;
  status: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface SubCategoryProps {
  sub_category: SubCategory[];
}
interface SubCategoryCardProps {
  data: SubCategory;
}

/**
 * @type
 *  Services Types
 */
interface Services {
  id: number;
  user_id: number;
  category_id: number;
  meta_title: string | null;
  meta_keyword: string | null;
  meta_description: string | null;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  tags: string;
  service_image: string;
  image_link: string | null;
  video_link: string | null;
  status: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  rating: number;
  category_name?: string;
  reviews: Review[];
}

interface ServicesProps {
  services: Services[];
}
interface ServicesCardProps {
  data: Services;
}

/**
 * @type
 *  Blog Types
 */

interface Blog {
  id: number;
  category_id: number | null;
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  tags: string | null;
  blogimg: string;
  image_link: string;
  status: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface BlogProps {
  blogs: Blog[];
}
interface SingleBlogProps {
  blog: Blog;
}

interface BlogCardProps {
  data: Blog;
}

/**
 * @type
 *  Slider Types
 */

interface Slider {
  id: number;
  category_id: number;
  title: string;
  tagline: string;
  rlink: string | null;
  slider_img: string;
  status: string;
  slider_page: string | null;
  image_link: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface SliderProps {
  sliders: Slider[];
}

/**
 * @Instant Services
 */

interface InstantService {
  id: number;
  service_id: number;
  instant_service_id: number;
  per_day_meason_rate: number;
  per_day_helper_rate: number;
  per_day: number;
  per_hour_meason_rate: number;
  per_hour_helper_rate: number;
  per_hour: number;
  overtime_meason_rate: number;
  overtime_helper_rate: number;
  overtime_per_hour: number;
  includes_instument: string;
  excludes_instument: string;
  labour_chowk_id: string[];
  created_at: string;
  updated_at: string;
}

interface InstantServiceSliderSlogan {
  id: number;
  category_id: number;
  slogan: string;
  slogan_image: string;
  service_type: string;
  status: string;
  ref_link: string;
  slogan_image_link: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface InstantApiResponse {
  instant_service: InstantService;
  slider_slogans: SliderSlogan[];
  instant_service: ServiceNotes;
  permanent_service: ServiceNotes;
  service: Service;
}

interface CategoryProps {
  id: number;
  name: string;
  hindi_name: string | null;
  slug: string;
  parent_id: number;
  description: string;
  cat_img: string;
  image_link: string | null;
  meta_title: string | null;
  meta_keyword: string | null;
  meta_description: string | null;
  status: string;
  is_join_us: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  jobs_count: number;
}

interface CateGoryApiResponse {
  categories: CategoryProps[];
}

interface JobProps {
  id: number;
  user_id: number;
  category_id: number;
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  title: string;
  post: string;
  vaccancy: string;
  slug: string;
  experience: string;
  salary: number;
  facilities: string;
  description: string;
  skill: string;
  location: string;
  last_date: string;
  jobimg: string;
  recruitment_letter: string;
  image_link: string;
  special_priority: string;
  priority: string;
  status: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface JobApiResponse {
  jobs: JobProps[];
}
interface JobDetailApiResponse {
  job: JobProps;
}
interface JobCategoryApiResponse {
  job: JobProps[];
}

// Apply job
export type FormInputs = {
  name: string;
  email: string;
  city_id: string;
  state_id: string;
  job_id: number;
  skill: string;
  mobile_number: string;
  aboutYourself?: string;
};

// Search

export interface SearchPostProps {
  experience: string;
  location: string;
  category: string;
  salary: string;
}

// CITY STATE
interface State {
  id: number;
  name: string;
  country_id: number;
  state_code: string;
  pos: string;
  pos_code: number;
  status_launch: string;
  status: string;
  created_At: string;
  updated_at: string;
}

interface StateProps {
  states: State[];
}

interface StateApiProps {
  states: State;
}

interface City {
  id: number;
  country_id: number;
  state_id: number;
  name: string;
  slug: string;
  status: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface CitiesResponse {
  cites: City[];
}

interface Faq {
  id: number;
  category_id: number | null;
  question: string;
  slug: string;
  answer: string;
  status: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface FaqApiResponse {
  faqs: Faq[];
}

// Clients
interface Client {
  id: number;
  user_id: number | null;
  name: string;
  company: string;
  designation: string;
  content: string;
  client_image: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ClientsApiResponse {
  clients: Client[];
}

// Partners
interface Partner {
  id: number;
  user_id: number | null;
  name: string;
  url: string;
  logo: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PartnersApiResponse {
  partners: Partner[];
}

interface PolicyType {
  id: number;
  title: string;
  slug: string;
  content: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PolicyApiResponse {
  page: PolicyType;
}

// Services listing
interface Service {
  id: number;
  user_id: number;
  category_id: number;
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  title: string;
  slug: string;
  short_description: string;
  description: string; // HTML content, so kept as string
  tags: string;
  service_image: string;
  image_link: string;
  video_link: string;
  status: string; // Assuming it's a string, e.g., "1" for active; adjust to number if needed
  is_instant_service: number;
  is_permanent_service: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  category_name?: string;
}

// New Services
interface ServiceApiResponse {
  services: Service[];
  category: Category;
  sub_categories: SubCategory[];
}

interface Category {
  id: number;
  name: string;
  hindi_name: string | null;
  slug: string;
  parent_id: number;
  description: string;
  cat_img: string;
  image_link: string;
  meta_title: string | null;
  meta_keyword: string | null;
  meta_description: string | null;
  status: string; // If you expect a string (e.g., "1" for active), else change to number
  is_join_us: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface SubCategory {
  id: number;
  name: string;
  hindi_name: string | null;
  slug: string;
  parent_id: number;
  description: string;
  cat_img: string;
  image_link: string;
  meta_title: string | null;
  meta_keyword: string | null;
  meta_description: string | null;
  status: string; // If you expect a string (e.g., "1" for active), else change to number
  is_join_us: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// Services detail
export interface Service {
  id: number;
  user_id: number;
  category_id: number;
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  tags: string;
  service_image: string;
  image_link: string;
  video_link: string;
  status: string;
  is_instant_service: number;
  is_permanent_service: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  rating: number;
  reviews: Review[];
  slider_image: string[];
  category_name: string;
  tags: string;
}

export interface Slogan {
  id: number;
  category_id: number;
  slogan: string;
  slogan_image: string;
  service_type: string;
  status: string;
  ref_link: string;
  slogan_image_link: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  name: string;
  rating: number;
  review_comments: string;
}
interface Tag {
  id: number; // Optional if you have unique IDs
  value: string;
}

export interface ServiceDetailApiResponse {
  service: Service;
  slider_slogans: Slogan[];
  instant_service: ServiceNotes;
  permanent_service: ServiceNotes;
}

// Permanet service

interface PermanentServiceResponse {
  permanent_service: PermanentService;
  slider_slogans: SliderSlogan[];
}

interface PermanentService {
  id: number;
  service_id: number;
  includes_instument: string;
  excludes_instument: string;
  created_at: string;
  updated_at: string;
}

interface ServiceNotes {
  includes_instument: string; // HTML content in string format
  excludes_instument: string;
}

interface SliderSlogan {
  id: number;
  category_id: number;
  slogan: string;
  slogan_image: string;
  service_type: string;
  status: string;
  ref_link: string;
  slogan_image_link: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// API RESPONSE ERROR
interface ApiErrorResponse {
  message: string;
}

// JOB Slider
export interface SliderApiResponse {
  id: number;
  category_id: number;
  title: string;
  tagline: string;
  rlink: string;
  slider_img: string;
  status: string;
  slider_page: string | null;
  image_link: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobSliderProps {
  sliders: SliderApiResponse[];
}
