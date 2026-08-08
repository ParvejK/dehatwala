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
  // Per-worker pricing. `base_price` / `overtime_price` were dropped from the
  // `services` table on 2026-08-04; use `primaryWorkerRate` in
  // `components/services/pricing.ts` to pick the rate to display.
  meson_label?: string | null;
  is_active_meson?: boolean | number | null;
  meson_amount?: string | number | null;
  meson_overtime_amount?: string | number | null;
  helper_label?: string | null;
  is_active_helper?: boolean | number | null;
  helper_amount?: string | number | null;
  helper_overtime_amount?: string | number | null;
  /** Pre-built by the API from the columns above; preferred when present. */
  worker_rates?: {
    key?: string;
    label?: string | null;
    amount?: string | number | null;
    overtime?: string | number | null;
    active?: boolean | number | null;
  }[];
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
  is_featured: boolean;
  /** Pre-formatted by the API, e.g. "5 min read". */
  read_time: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  /** Eager-loaded by getBlog; null when the blog has no category. */
  category?: BlogCategoryApi | null;
}

/** A row from `blog_categories` — distinct from the frontend BLOG_CATEGORIES map. */
interface BlogCategoryApi {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  icon_link: string | null;
  status: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  /** Present on /get-blog-categories only. */
  blogs_count?: number;
}

interface BlogCategoriesResponse {
  categories: BlogCategoryApi[];
}

/** Trimmed category shape carried on every blog card. */
interface BlogCardCategory {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

/**
 * The card shape `/get-blogs` returns — not a full `blogs` row. The API has
 * already trimmed the excerpt, computed the read time and picked the category.
 */
interface BlogCard {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  /** Filename only; build with `${VITE_IMAGE_PATH_URL}/blog/${image}`. */
  image: string;
  /** Pre-formatted by the API, e.g. "5 min read". */
  read_time: string;
  is_featured: boolean;
  published_at: string;
  updated_at: string;
  category: BlogCardCategory | null;
}

/** `GET /get-blogs` with no params — everything the blog landing page renders. */
interface BlogProps {
  success: boolean;
  total: number;
  featured: BlogCard | null;
  categories: (BlogCardCategory & { blogs_count: number })[];
  sections: { category: BlogCardCategory; blogs: BlogCard[] }[];
  blogs: BlogCard[];
}

/** `GET /get-blogs?category=…` or `?search=…` — the filtered subset only. */
interface BlogListProps {
  success: boolean;
  total: number;
  blogs: BlogCard[];
}
interface SingleBlogProps {
  blog: Blog;
  /** Five most recent other posts, returned alongside the blog. */
  recent_blogs?: Blog[];
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
  worker_1_label?: string;
  worker_2_label?: string;
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
  labour_chowk_id?: string[];
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

interface FaqCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  /** Null on every row today; reserved for an admin-picked icon key. */
  icon: string | null;
  faqs_count: number;
}

interface FaqCategoriesApiResponse {
  success: boolean;
  total_faqs: number;
  categories: FaqCategory[];
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

// Top Companies
interface TopCompany {
  id: number;
  user_id: number | null;
  name: string;
  url: string | null;
  logo: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface TopCompaniesApiResponse {
  success: boolean;
  top_companies: TopCompany[];
}

// Labour Testimonials
interface LabourTestimonial {
  id: number;
  user_id: number | null;
  name: string;
  /** The worker's trade, e.g. "Mason". The API calls this `post`. */
  post: string | null;
  /** Free text beside the trade on the card, e.g. "गुरुग्राम". */
  location: string | null;
  /** The quote itself. The API calls this `description`. */
  description: string | null;
  labour_image: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface LabourTestimonialsApiResponse {
  success?: boolean;
  labour_testimonials: LabourTestimonial[];
}

// Service availability check
interface CheckAvailabilityPayload {
  state_id: string | number;
  city_id: string | number;
  pincode: string;
}

interface ServiceArea {
  id: number;
  country_id: number;
  state_id: number;
  city_id: number;
  name: string;
  address_line1?: string | null;
  address_line2?: string | null;
  landmark?: string | null;
  pincode?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface CheckAvailabilityResponse {
  success: boolean;
  available: boolean;
  message?: string;
  service_area?: ServiceArea;
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
  sub_category_id?: number | null;
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
  // See the note on `Services` — per-worker pricing replaced base_price.
  meson_label?: string | null;
  is_active_meson?: boolean | number | null;
  meson_amount?: string | number | null;
  meson_overtime_amount?: string | number | null;
  helper_label?: string | null;
  is_active_helper?: boolean | number | null;
  helper_amount?: string | number | null;
  helper_overtime_amount?: string | number | null;
  /** Pre-built by the API from the columns above; preferred when present. */
  worker_rates?: {
    key?: string;
    label?: string | null;
    amount?: string | number | null;
    overtime?: string | number | null;
    active?: boolean | number | null;
  }[];
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
  tag_list?: string[];
  category?: Category;
  /** Admin textarea — newline separated. Use `whats_included_list` when present. */
  whats_included?: string | string[] | null;
  whats_included_list?: string[];
  /** Admin textarea — newline separated. Use `ideal_for_list` when present. */
  ideal_for?: string | string[] | null;
  ideal_for_list?: string[];
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
  service_name?: string | null;
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

/**
 * @type
 *  Careers
 */
export interface CareerApplicationPayload {
  name: string;
  mobile_number: string;
  email: string;
  state_id: string;
  city_id: string;
  /** Role title being applied for, or the applicant's area of interest. */
  role: string;
  /** Which surface the application came from. */
  source: "open-position" | "send-profile";
  message?: string;
  cv: File;
}

export interface CareerApplicationResponse {
  success: boolean;
  message: string;
}

/** A row from `GET /career-openings`. */
export interface CareerOpeningSummary {
  id: number;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
}

/** `GET /career-openings/{slug}` adds the body copy. */
export interface CareerOpeningDetail extends CareerOpeningSummary {
  /** Raw textarea, one bullet per line. Prefer the `_list` companions. */
  responsibilities: string;
  requirements: string;
  responsibilities_list?: string[];
  requirements_list?: string[];
}

export interface CareerOpeningsResponse {
  success: boolean;
  openings: CareerOpeningSummary[];
}

export interface CareerOpeningResponse {
  success: boolean;
  opening: CareerOpeningDetail;
}

export interface CareerContentResponse {
  success: boolean;
  careers_email: string;
}

/**
 * @type
 *  Media & News
 */
export interface MediaPublication {
  id: number;
  name: string;
  /** Filename in the `publication` storage folder. */
  logo: string | null;
  website_url: string | null;
  sort_order: number;
}

export interface MediaNewsItem {
  id: number;
  slug: string;
  title: string;
  tag: string;
  source: string;
  published_at: string;
  /** Either a bare number ("2") or a phrase ("2 min read") — normalise before display. */
  read_time: string | null;
  /** Filename in the `media` storage folder. */
  image: string;
  external_url: string | null;
  excerpt: string;
}

export interface MediaNewsArticle extends MediaNewsItem {
  lead: string | null;
  /** One paragraph per line; `body_list` is the pre-split form. */
  body: string | null;
  body_list?: string[];
  quote_text: string | null;
  quote_author: string | null;
}

export interface MediaVideo {
  id: number;
  title: string;
  subtitle: string | null;
  channel: string;
  duration: string | null;
  thumbnail: string;
  video_url: string;
  published_at: string;
}

export interface MediaPhoto {
  id: number;
  image: string;
  alt: string;
  caption: string;
  location: string | null;
  taken_at: string;
}

export interface MediaPublicationsResponse {
  success: boolean;
  publications: MediaPublication[];
}
export interface MediaNewsResponse {
  success: boolean;
  news: MediaNewsItem[];
}
export interface MediaNewsDetailResponse {
  success: boolean;
  article: MediaNewsArticle;
  related: MediaNewsItem[];
}
export interface MediaVideosResponse {
  success: boolean;
  videos: MediaVideo[];
}
export interface MediaPhotosResponse {
  success: boolean;
  photos: MediaPhoto[];
}

/**
 * @type
 *  Saved worksite addresses
 */
export interface SaveUserAddressPayload {
  user_id: number;
  /** "Home", "Office", "Site – Sector 66". Optional; the API falls back to a default. */
  label?: string;
  address: string;
  state_id: string | number;
  city_id: string | number;
  pincode: string;
  /** Gate number, floor, whom to contact — the free-text box on booking step 2. */
  instructions?: string;
  /** Resolved by `check-availability` when the address was verified. */
  service_area_id?: number | null;
  is_default?: boolean;
}

export interface UserAddress {
  id: number;
  user_id: number;
  label: string;
  address: string;
  state_id: number;
  city_id: number;
  state_name?: string | null;
  city_name?: string | null;
  pincode: string;
  instructions: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface SaveUserAddressResponse {
  success: boolean;
  message: string;
  address: UserAddress;
}

export interface UserAddressesResponse {
  success: boolean;
  addresses: UserAddress[];
}
