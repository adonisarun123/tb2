import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Use provided Supabase credentials with Vite environment variables
// Adding fallback values for deployment environments where env vars might not be accessible
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yrppmcoycmydrujbesnd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlycHBtY295Y215ZHJ1amJlc25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5NjU3MjYsImV4cCI6MjAxNTU0MTcyNn0.kpS1nRRPMdAgG8J9vkgyhIOO2GdXU23P9GnxJCsXGGE';

// Log a warning if the environment variables are missing
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Using fallback Supabase credentials. Consider adding proper environment variables for production.');
}

// Create Supabase client with graceful error handling
let supabase: SupabaseClient;

try {
  // Attempt to create the Supabase client
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Test the connection
  supabase.auth.getSession().catch(err => {
    console.error('Supabase connection error:', err);
    // Log specific information for API key issues
    if (err.message?.includes('key') || err.message?.includes('API')) {
      console.error('This appears to be an API key issue. Please check your Supabase credentials.');
    }
  });
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  
  // Create a fallback mock client to prevent application crashes
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
  
  // Override with mock methods
  (supabase as any) = {
    from: (table: string) => ({
      select: () => ({
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: { message: 'Invalid API key - using mock client' } }),
          eq: () => Promise.resolve({ data: [], error: { message: 'Invalid API key - using mock client' } }),
          in: () => Promise.resolve({ data: [], error: { message: 'Invalid API key - using mock client' } }),
          Promise: Promise.resolve({ data: [], error: { message: 'Invalid API key - using mock client' } }),
        }),
        eq: () => Promise.resolve({ data: [], error: { message: 'Invalid API key - using mock client' } }),
        in: () => Promise.resolve({ data: [], error: { message: 'Invalid API key - using mock client' } }),
        limit: () => Promise.resolve({ data: [], error: { message: 'Invalid API key - using mock client' } }),
      }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
  } as unknown as SupabaseClient;
}

export { supabase };

// Type definitions for your Supabase tables
/**
 * Represents a team building activity
 */
export interface Activity {
  id: number;
  name: string;
  tagline: string;
  description: string;
  main_image: string;
  activity_type: string;
  group_size: string;
  duration: string;
  slug: string;
  created_at: string;
  updated_at: string;
  activity_main_tag?: string;
  location?: string;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  destination_description: string;
  region: string;
  region_id?: string;
  slug: string;
  destination_main_image: string;
  destination_image: string;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a stay/venue for team outings
 * @property {string} image - The primary image to display. Access with getStayImage() helper.
 * @property {string[]} allImages - All available images. Access with getStayImages() helper.
 * @property {string} description - The description text. Access with getStayDescription() helper.
 * @property {string} created_at - Creation timestamp, normalized from various fields.
 * @property {string} updated_at - Last update timestamp, normalized from various fields.
 */
export interface Stay {
  id: number;
  name: string;
  slug: string;
  
  // Core data fields
  location?: string;
  facilities?: string;
  special_activities?: string;
  destination_id?: number;
  destination_details?: Destination | null;
  rating?: string;
  price?: string;
  
  // Image fields - use helper functions instead of accessing directly
  stay_image?: string;        // Primary image (preferred)
  images?: string[];          // Array of images (preferred)
  image_url?: string;         // Legacy primary image
  banner_image_url?: string;  // Legacy banner image
  image_1?: string;           // Legacy image 1
  image_2?: string;           // Legacy image 2
  image_3?: string;           // Legacy image 3
  
  // Description fields - use helper functions instead of accessing directly
  stay_description?: string;  // Preferred description field
  description?: string;       // Legacy description field
  
  // Metadata fields
  meta_title?: string;
  meta_description?: string;
  alt_text?: string;
  tagline?: string;
  
  // Reference fields
  collection_id?: string;
  destination?: string;
  destination_name?: string;
  destination_cms_multi_reference?: string;
  location_plain_text?: string;
  
  // Legacy fields
  title?: string;
  price_per_night?: number;
  max_capacity?: number;
  check_in_value?: string;
  check_out_value?: string;
  total_room_value?: string;
  
  // Date fields - use created_at and updated_at for consistency
  created_at?: string;        // Preferred creation date
  updated_at?: string;        // Preferred update date
  created_on?: string;        // Legacy creation date
  updated_on?: string;        // Legacy update date
  published_on?: string;      // Publication date
}

/**
 * Get the primary image for a stay
 */
export function getStayImage(stay: Stay): string {
  return stay.stay_image || stay.image_url || stay.banner_image_url ||
         stay.image_1 || '/images/default-stay.jpg';
}

/**
 * Get all images for a stay as an array
 */
export function getStayImages(stay: Stay): string[] {
  const images: string[] = [];
  
  // Add image array if it exists
  if (stay.images && Array.isArray(stay.images)) {
    images.push(...stay.images);
  }
  
  // Add individual image fields if they exist and aren't already in the array
  const singleImages: (string | undefined)[] = [
    stay.stay_image,
    stay.image_url,
    stay.banner_image_url,
    stay.image_1,
    stay.image_2,
    stay.image_3
  ];
  
  singleImages.forEach(img => {
    if (img && !images.includes(img)) {
      images.push(img);
    }
  });
  
  // Return default image if no images found
  return images.length > 0 ? images : ['/images/default-stay.jpg'];
}

/**
 * Get the description for a stay
 */
export function getStayDescription(stay: Stay): string {
  return stay.stay_description || stay.description || '';
}

/**
 * Get the normalized creation date
 */
export function getStayCreatedDate(stay: Stay): string {
  return stay.created_at || stay.created_on || new Date().toISOString();
}

/**
 * Get the normalized update date
 */
export function getStayUpdatedDate(stay: Stay): string {
  return stay.updated_at || stay.updated_on || new Date().toISOString();
}

export interface CustomizedTraining {
  id: number;
  title: string;
  name: string;
  description: string;
  image_url: string;
  banner_image: string;
  category: string;
  duration: string;
  activity_time: string;
  max_participants: number;
  group_size: string;
  tagline: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  name: string;
  slug: string;
  collection_id: string;
  locale_id: string;
  item_id: string;
  created_on: string;
  updated_on: string;
  published_on: string;
  post_body: string;
  small_description: string;
  main_image: string;
  thumbnail_image: string;
  featured: boolean;
  color: string;
  author: string;
  blog_post_tags: string;
  date_time: string;
  canonical_tag: string;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscription {
  id: number;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  updated_at: string;
}

export type ActivityType = 'outbound' | 'virtual' | 'hybrid' | 'exploring';

export interface ContactSubmission {
  id: number;
  name: string;
  work_email: string;
  preferred_destination: string;
  phone: string;
  number_of_pax: number;
  more_details?: string;
  activity_type: ActivityType;
  page_url: string;
  page_heading: string;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface Region {
  id: string;
  name: string;
  description: string;
  destinations_list: string;
  banner_image_url: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface TeamOutingAd {
  id: number;
  name: string;
  slug: string;
  description?: string;
  banner_image_url?: string;
  main_image_url?: string;
  tagline?: string;
  location?: string;
  group_size?: string;
  activity_time?: string;
  created_at?: string;
  updated_at?: string;
  banner_image?: string;
  main_heading?: string;
  subtext_after_heading?: string;
  cta_action?: string;
  form_button_text?: string;
  image_1?: string;
  image_2?: string;
  image_3?: string;
  showcase_heading?: string;
  showcase_subtext?: string;
  heading_1?: string;
  subtext_1?: string;
  heading_2?: string;
  subtext_2?: string;
  heading_3?: string;
  subtext_3?: string;
  final_cta_heading?: string;
  final_cta_subtext?: string;
  priority?: number;
}

export interface PartnerRegistration {
  id: number;
  company_name: string;
  website?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  company_type: string;
  employee_count?: string;
  years_in_business?: string;
  services_offered: string[];
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Add more type definitions as needed for other tables 