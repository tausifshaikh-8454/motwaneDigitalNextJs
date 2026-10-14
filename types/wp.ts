/**
 * TypeScript shapes of the WordPress REST API responses used by the site.
 * These describe structure only; all values come from WordPress at runtime.
 */

export interface WPImage {
  ID: number;
  id: number;
  url: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  mime_type: string;
  sizes?: Record<string, string | number>;
}

export interface SocialLink {
  platform: "facebook" | "linkedin" | "youtube" | "instagram" | "x";
  url: string;
}

export interface Office {
  city: string;
  address: string;
  email: string;
  phone: string;
}

export interface PopupSettings {
  title: string;
  intro: string;
  form_id: number | string | null;
  success_message: string;
}

/** ACF field group "Global Settings" (WordPress page: global-settings) */
export interface GlobalSettings {
  logo: WPImage | false | null;
  header_cta_label: string;
  head_office_address: string;
  phone: string;
  email: string;
  regional_offices: Office[] | null;
  social_links: SocialLink[] | null;
  newsletter_heading: string;
  newsletter_placeholder: string;
  newsletter_consent: string;
  newsletter_form_id: number | string | null;
  newsletter_success: string;
  copyright_text: string;
  get_in_touch_popup: PopupSettings | null;
  brochure_popup: PopupSettings | null;
  recap_popup: PopupSettings | null;
  product_enquiry: {
    heading: string;
    form_id: number | string | null;
    image: WPImage | false | null;
    success_message: string;
  } | null;
}

export interface WPPage<TAcf = Record<string, unknown>> {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  content?: { rendered: string };
  acf: TAcf;
  yoast_head_json?: YoastHead;
}

/** Response of the Contact Form 7 REST "feedback" endpoint */
export interface Cf7Response {
  contact_form_id: number;
  status: "mail_sent" | "mail_failed" | "validation_failed" | "spam" | "aborted" | string;
  message: string;
  invalid_fields?: { field: string; message: string }[];
}

/** ACF "link" field (return format: array) */
export interface WPLink {
  title: string;
  url: string;
  target: string;
}

/** Minimal WP_Post object returned by ACF post_object / relationship fields */
export interface WPPostRef {
  ID: number;
  post_title: string;
  post_name: string;
  post_type: string;
}

export interface WPFile {
  ID: number;
  url: string;
  title: string;
  filename: string;
  mime_type: string;
}

export interface YoastHead {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: Record<string, string>;
  og_title?: string;
  og_description?: string;
  og_image?: { url: string; width?: number; height?: number }[];
  og_type?: string;
  og_site_name?: string;
  og_locale?: string;
  article_published_time?: string;
  article_modified_time?: string;
  twitter_card?: string;
}

/** WordPress site info from the REST API index (/wp-json/) */
export interface WPSiteInfo {
  name: string;
  description: string;
  site_icon_url?: string;
}

/** Product custom post type (/wp/v2/products) */
export interface ProductAcf {
  hero_title: string;
  hero_subtitle: string;
  hero_text: string;
  hero_image: WPImage | false | null;
  brochure_label: string;
  contact_label: string;
  why_eyebrow: string;
  why_heading: string;
  why_text: string;
  stats_eyebrow: string;
  stats_heading: string;
  stats_image: WPImage | false | null;
  stats: { icon: WPImage | false | null; value: string; label: string }[] | null;
  features_eyebrow: string;
  features_heading: string;
  features: { icon: WPImage | false | null; title: string; text: string }[] | null;
  other_eyebrow: string;
  other_heading: string;
  other_products: WPPostRef[] | null | false;
  other_link_label: string;
  card_image: WPImage | false | null;
  card_excerpt: string;
  solution_card_image: WPImage | false | null;
  brochure_file: WPFile | false | null;
}

export interface WPProduct {
  id: number;
  slug: string;
  menu_order: number;
  title: { rendered: string };
  acf: ProductAcf;
  yoast_head_json?: YoastHead;
}

/** ACF field group "Home Page" */
export interface HomeAcf {
  webinar_banner: {
    enabled: boolean;
    image: WPImage | false | null;
    eyebrow: string;
    title: string;
    subtitle: string;
    date_text: string;
    location_text: string;
    button: WPLink | null | "";
  } | null;
  hero_slides: {
    background_image: WPImage | false | null;
    eyebrow: string;
    heading: string;
    subheading: string;
    product: WPPostRef | null | false;
    brochure_label: string;
    learn_more: WPLink | null | "";
  }[] | null;
  clients_heading: string;
  client_logos: WPImage[] | null | false;
  offerings_eyebrow: string;
  offerings_heading: string;
  offerings_products: WPPostRef[] | null | false;
  offerings_link_label: string;
  features_eyebrow: string;
  features_heading: string;
  features: { icon: WPImage | false | null; title: string; text: string }[] | null;
  about_image: WPImage | false | null;
  about_eyebrow: string;
  about_heading: string;
  about_text: string;
  about_points: { text: string }[] | null;
  about_button: WPLink | null | "";
  highlights_eyebrow: string;
  highlights_heading: string;
  highlights: { icon: WPImage | false | null; value: string; label: string }[] | null;
  faq_eyebrow: string;
  faq_heading: string;
  faqs: { question: string; answer: string }[] | null;
}

/** Blog listing/article settings (WordPress page: blog) */
export interface BlogSettings {
  hero_title: string;
  hero_text: string;
  hero_image: WPImage | false | null;
  must_read_heading: string;
  categories_heading: string;
  all_label: string;
  categories_image: WPImage | false | null;
  posts_per_page: number | string | null;
  published_label: string;
  read_time_label: string;
  toc_heading: string;
  share_label: string;
  related_heading: string;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  yoast_head_json?: YoastHead;
}

export interface WPMediaEmbed {
  id: number;
  source_url: string;
  alt_text: string;
  media_details?: { width: number; height: number };
}

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  content?: { rendered: string };
  categories: number[];
  acf: { intro: string; must_read: boolean; banner_image?: WPImage | false | null };
  yoast_head_json?: YoastHead;
  _embedded?: {
    "wp:featuredmedia"?: WPMediaEmbed[];
    "wp:term"?: { id: number; name: string; slug: string; taxonomy: string }[][];
  };
}

/** Webinar custom post type (/wp/v2/webinars) */
export interface WebinarAcf {
  webinar_status: "Upcoming Webinar" | "Past Webinar" | string;
  /** Y-m-d */
  webinar_date: string;
  webinar_duration: string;
  webinar_platform: string;
  registration_link: string;
  banner_image: WPImage | false | null;
  recap_image: WPImage | false | null;
  key_takeaways: { text: string }[] | null | false;
  speakers: { photo: WPImage | false | null; name: string; designation: string }[] | null | false;
}

export interface WPWebinar {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  content?: { rendered: string };
  excerpt?: { rendered: string };
  acf: WebinarAcf;
  yoast_head_json?: YoastHead;
  _embedded?: { "wp:featuredmedia"?: WPMediaEmbed[] };
}

/** Webinar listing + shared webinar page settings (WordPress page: webinars) */
export interface WebinarsSettings {
  hero_title: string;
  hero_image: WPImage | false | null;
  other_heading: string;
  cta_heading: string;
  cta_button: WPLink | null | "";
  cta_image: WPImage | false | null;
  overview_label: string;
  takeaways_label: string;
  speakers_label: string;
  venue_label: string;
  recap_label: string;
  register_label: string;
  learn_more_label: string;
}

/** Contact page (WordPress page: contact-us) */
export interface ContactAcf {
  hero_title: string;
  hero_text: string;
  hero_image: WPImage | false | null;
  form_heading: string;
  form_id: number | string | null;
  submit_label: string;
  success_message: string;
}
