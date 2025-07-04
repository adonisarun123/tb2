import { createClient } from '@supabase/supabase-js';

// Use the same fallback values as in supabaseClient.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yrppmcoycmydrujbesnd.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlycHBtY295Y215ZHJ1amJlc25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5NjU3MjYsImV4cCI6MjAxNTU0MTcyNn0.kpS1nRRPMdAgG8J9vkgyhIOO2GdXU23P9GnxJCsXGGE';

// Create client with graceful error handling
const supabase = createClient(supabaseUrl, supabaseKey);

// Cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

// In-memory cache with TTL
class DataCache {
  private cache = new Map<string, CacheEntry<any>>();
  private cleanupInterval: number | null = null;
  
  constructor() {
    // Setup periodic cleanup of expired cache entries
    this.startCleanupInterval();
  }
  
  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: ttlMs
    });
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.expiresIn) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  // Cleanup expired entries
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.expiresIn) {
        this.cache.delete(key);
      }
    });
  }
  
  // Start periodic cleanup
  private startCleanupInterval(): void {
    // Run cleanup every minute
    // Check if window exists (browser environment) to avoid SSR issues
    if (typeof window !== 'undefined') {
      this.cleanupInterval = window.setInterval(() => {
        this.cleanupExpiredEntries();
      }, 60 * 1000);
    }
  }
  
  // Stop cleanup interval when not needed
  stopCleanupInterval(): void {
    if (this.cleanupInterval !== null) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
  
  // Get cache stats for debugging
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

const cache = new DataCache();

// Request deduplication
const pendingRequests = new Map<string, Promise<any>>();

// Optimized data fetcher with caching and deduplication
export class DataOptimizer {
  
  // Batch multiple requests into a single operation
  static async batchFetch<T>(requests: Array<{
    table: string;
    select?: string;
    filters?: Record<string, any>;
    order?: string;
    limit?: number;
    cacheKey: string;
    cacheTtl?: number;
  }>): Promise<Record<string, T[]>> {
    const results: Record<string, T[]> = {};
    const uncachedRequests: typeof requests = [];
    
    // Check cache first
    for (const request of requests) {
      const cached = cache.get<T[]>(request.cacheKey);
      if (cached) {
        results[request.cacheKey] = cached;
      } else {
        uncachedRequests.push(request);
      }
    }
    
    // Execute uncached requests in parallel
    if (uncachedRequests.length > 0) {
      // Create a map to track individual request statuses
      const requestStatuses = new Map<string, { success: boolean; error?: Error }>();
      
      const promises = uncachedRequests.map(async (request) => {
        // Track request status
        requestStatuses.set(request.cacheKey, { success: false });
        
        // Check if request is already pending - use a critical section approach
        const pendingPromise = pendingRequests.get(request.cacheKey);
        if (pendingPromise) {
          try {
            const data = await pendingPromise;
            results[request.cacheKey] = data;
            requestStatuses.set(request.cacheKey, { success: true });
            return;
          } catch (error) {
            requestStatuses.set(request.cacheKey, {
              success: false,
              error: error instanceof Error ? error : new Error(String(error))
            });
            // Continue with a new request if pending one failed
          }
        }
        
        // Create new request with proper error isolation
        try {
          // Atomically update pendingRequests map to prevent race conditions
          const promise = this.executeSingleRequest<T>(request);
          pendingRequests.set(request.cacheKey, promise);
          
          const data = await promise;
          cache.set(request.cacheKey, data, request.cacheTtl || 5 * 60 * 1000);
          results[request.cacheKey] = data;
          requestStatuses.set(request.cacheKey, { success: true });
        } catch (error) {
          console.error(`Error fetching ${request.cacheKey}:`, error);
          requestStatuses.set(request.cacheKey, {
            success: false,
            error: error instanceof Error ? error : new Error(String(error))
          });
          // Don't rethrow - we want to isolate errors to individual requests
        } finally {
          pendingRequests.delete(request.cacheKey);
        }
      });
      
      await Promise.all(promises);
      
      // Log summary of request statuses
      const failedRequests = Array.from(requestStatuses.entries())
        .filter(([_, status]) => !status.success);
      
      if (failedRequests.length > 0) {
        console.warn(`${failedRequests.length} of ${requestStatuses.size} batch requests failed`);
      }
    }
    
    return results;
  }
  
  // Execute a single optimized request
  private static async executeSingleRequest<T>(request: {
    table: string;
    select?: string;
    filters?: Record<string, any>;
    order?: string;
    limit?: number;
  }): Promise<T[]> {
    let query = supabase
      .from(request.table)
      .select(request.select || '*');
    
    // Apply filters
    if (request.filters) {
      Object.entries(request.filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else {
          query = query.eq(key, value);
        }
      });
    }
    
    // Apply ordering
    if (request.order) {
      const [column, direction] = request.order.split('.');
      query = query.order(column, { ascending: direction !== 'desc' });
    }
    
    // Apply limit
    if (request.limit) {
      query = query.limit(request.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase request error:', error);
      throw error;
    }
    
    return (data as T[]) || [];
  }
  
  // Get essential data with minimal requests
  static async getEssentialData() {
    const requests = [
      {
        table: 'activities',
        select: 'id, name, small_description, image, location, duration, capacity, rating, slug, tags',
        limit: 50,
        cacheKey: 'activities-essential',
        cacheTtl: 10 * 60 * 1000 // 10 minutes
      },
      {
        table: 'stays',
        select: 'id, name, description, image, location, facilities, slug, rating',
        limit: 30,
        cacheKey: 'stays-essential',
        cacheTtl: 10 * 60 * 1000
      },
      {
        table: 'destinations',
        select: 'id, name, description, image, region, slug',
        limit: 20,
        cacheKey: 'destinations-essential',
        cacheTtl: 15 * 60 * 1000
      },
      {
        table: 'regions',
        select: 'id, name, slug',
        order: 'name.asc',
        cacheKey: 'regions-all',
        cacheTtl: 30 * 60 * 1000 // 30 minutes - rarely changes
      }
    ];
    
    return this.batchFetch(requests);
  }
  
  // Get blog posts with optimization
  static async getBlogPosts(limit: number = 10) {
    const cacheKey = `blog-posts-${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, name, small_description, published_on, slug, image')
      .order('published_on', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    cache.set(cacheKey, data, 15 * 60 * 1000); // 15 minutes
    return data || [];
  }
  
  // Get featured activities (most popular)
  static async getFeaturedActivities(limit: number = 12) {
    const cacheKey = `featured-activities-${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('rating', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    cache.set(cacheKey, data, 10 * 60 * 1000);
    return data || [];
  }
  
  // Get featured stays
  static async getFeaturedStays(limit: number = 9) {
    const cacheKey = `featured-stays-${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    const { data, error } = await supabase
      .from('stays')
      .select('*')
      .order('rating', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    cache.set(cacheKey, data, 10 * 60 * 1000);
    return data || [];
  }
  
  // Get counts efficiently
  static async getCounts() {
    const cacheKey = 'total-counts';
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    const requests = [
      {
        table: 'activities',
        select: 'id',
        cacheKey: 'activities-count',
        cacheTtl: 30 * 60 * 1000
      },
      {
        table: 'stays',
        select: 'id',
        cacheKey: 'stays-count',
        cacheTtl: 30 * 60 * 1000
      },
      {
        table: 'blog_posts',
        select: 'id',
        cacheKey: 'blog-count',
        cacheTtl: 30 * 60 * 1000
      }
    ];
    
    const results = await this.batchFetch(requests);
    
    const counts = {
      activities: results['activities-count']?.length || 0,
      stays: results['stays-count']?.length || 0,
      blogs: results['blog-count']?.length || 0
    };
    
    cache.set(cacheKey, counts, 30 * 60 * 1000);
    return counts;
  }
  
  // Preload critical data for homepage
  static async preloadHomepageData() {
    try {
      // Load essential data in parallel
      const [essentialData, blogPosts, counts] = await Promise.all([
        this.getEssentialData(),
        this.getBlogPosts(6),
        this.getCounts()
      ]);
      
      // Preload featured content
      const [featuredActivities, featuredStays] = await Promise.all([
        this.getFeaturedActivities(8),
        this.getFeaturedStays(6)
      ]);
      
      return {
        activities: essentialData['activities-essential'] || [],
        stays: essentialData['stays-essential'] || [],
        destinations: essentialData['destinations-essential'] || [],
        regions: essentialData['regions-all'] || [],
        blogPosts,
        featuredActivities,
        featuredStays,
        counts
      };
    } catch (error) {
      console.error('Failed to preload homepage data:', error);
      return null;
    }
  }
  
  // Clear cache when needed
  static clearCache() {
    cache.clear();
    pendingRequests.clear();
  }
  
  // Clean up resources when app is shutting down
  static cleanup() {
    cache.stopCleanupInterval();
    cache.clear();
    pendingRequests.clear();
  }
  
  // Get cache statistics
  static getCacheStats() {
    return cache.getStats();
  }
}

export default DataOptimizer; 