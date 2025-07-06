import { useState, useEffect } from 'react';
import { supabase, BlogPost } from '../lib/supabaseClient';

interface UseBlogReturn {
  blogPosts: BlogPost[];
  loading: boolean;
  error: string | null;
}

export const useSupabaseBlog = (limit?: number): UseBlogReturn => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (!isMounted) return;
        
        if (error) {
          console.error('Error fetching blog posts:', error);
          
          if (error.message?.includes('key') || error.message?.includes('API')) {
            console.warn('API key issue detected, using fallback blog data');
            
            // Comprehensive fallback data with 15+ diverse blog posts
            setBlogPosts([
              {
                id: 1,
                name: 'Top 10 Team Building Activities for Remote Teams',
                slug: 'top-10-team-building-activities-remote-teams',
                collection_id: 'blog',
                locale_id: 'en',
                item_id: 'blog-1',
                created_on: new Date().toISOString(),
                updated_on: new Date().toISOString(),
                published_on: new Date().toISOString(),
                post_body: 'Discover the most effective team building activities designed specifically for remote and distributed teams...',
                small_description: 'Explore innovative team building strategies that bring remote teams together and boost collaboration.',
                main_image: '/images/blog-remote-teams.jpg',
                thumbnail_image: '/images/blog-remote-teams-thumb.jpg',
                featured: true,
                color: '#FF4C39',
                author: 'Team Building Expert',
                blog_post_tags: 'remote work, team building, collaboration',
                date_time: new Date().toISOString(),
                canonical_tag: 'team-building-remote',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 2,
                name: 'How to Plan the Perfect Corporate Retreat',
                slug: 'how-to-plan-perfect-corporate-retreat',
                collection_id: 'blog',
                locale_id: 'en',
                item_id: 'blog-2',
                created_on: new Date().toISOString(),
                updated_on: new Date().toISOString(),
                published_on: new Date().toISOString(),
                post_body: 'A comprehensive guide to planning memorable corporate retreats that strengthen team bonds and boost productivity...',
                small_description: 'Learn the essential steps to organize a successful corporate retreat that your team will remember.',
                main_image: '/images/blog-corporate-retreat.jpg',
                thumbnail_image: '/images/blog-corporate-retreat-thumb.jpg',
                featured: true,
                color: '#FFB573',
                author: 'Event Planning Specialist',
                blog_post_tags: 'corporate retreat, event planning, team building',
                date_time: new Date().toISOString(),
                canonical_tag: 'corporate-retreat-planning',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 3,
                name: 'The Psychology Behind Effective Team Building',
                slug: 'psychology-behind-effective-team-building',
                collection_id: 'blog',
                locale_id: 'en',
                item_id: 'blog-3',
                created_on: new Date().toISOString(),
                updated_on: new Date().toISOString(),
                published_on: new Date().toISOString(),
                post_body: 'Understanding the psychological principles that make team building activities truly effective for workplace dynamics...',
                small_description: 'Discover the science behind successful team building and how it impacts workplace relationships.',
                main_image: '/images/blog-psychology.jpg',
                thumbnail_image: '/images/blog-psychology-thumb.jpg',
                featured: false,
                color: '#4A90E2',
                author: 'Organizational Psychologist',
                blog_post_tags: 'psychology, team dynamics, workplace behavior',
                date_time: new Date().toISOString(),
                canonical_tag: 'team-building-psychology',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 4,
                name: 'Virtual Team Building: Making It Work in 2024',
                slug: 'virtual-team-building-2024-guide',
                collection_id: 'blog',
                locale_id: 'en',
                item_id: 'blog-4',
                created_on: new Date().toISOString(),
                updated_on: new Date().toISOString(),
                published_on: new Date().toISOString(),
                post_body: 'The complete guide to virtual team building activities that actually engage participants and build stronger connections...',
                small_description: 'Master the art of virtual team building with innovative activities and engagement strategies.',
                main_image: '/images/blog-virtual-2024.jpg',
                thumbnail_image: '/images/blog-virtual-2024-thumb.jpg',
                featured: true,
                color: '#7B68EE',
                author: 'Digital Collaboration Expert',
                blog_post_tags: 'virtual team building, remote work, digital collaboration',
                date_time: new Date().toISOString(),
                canonical_tag: 'virtual-team-building-2024',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 5,
                name: 'Best Outdoor Team Building Activities for Large Groups',
                slug: 'best-outdoor-team-building-large-groups',
                collection_id: 'blog',
                locale_id: 'en',
                item_id: 'blog-5',
                created_on: new Date().toISOString(),
                updated_on: new Date().toISOString(),
                published_on: new Date().toISOString(),
                post_body: 'Discover exciting outdoor activities perfect for large corporate groups, from adventure challenges to collaborative games...',
                small_description: 'Find the perfect outdoor team building activities that can accommodate and engage large groups.',
                main_image: '/images/blog-outdoor-large.jpg',
                thumbnail_image: '/images/blog-outdoor-large-thumb.jpg',
                featured: false,
                color: '#32CD32',
                author: 'Adventure Activity Coordinator',
                blog_post_tags: 'outdoor activities, large groups, adventure team building',
                date_time: new Date().toISOString(),
                canonical_tag: 'outdoor-team-building-large-groups',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 6,
                name: 'Building Trust Through Team Activities',
                slug: 'building-trust-through-team-activities',
                collection_id: 'blog',
                locale_id: 'en',
                item_id: 'blog-6',
                created_on: new Date().toISOString(),
                updated_on: new Date().toISOString(),
                published_on: new Date().toISOString(),
                post_body: 'Learn how specific team building exercises can foster trust and improve communication within your organization...',
                small_description: 'Explore proven strategies for building trust and strengthening relationships through team activities.',
                main_image: '/images/blog-trust-building.jpg',
                thumbnail_image: '/images/blog-trust-building-thumb.jpg',
                featured: false,
                color: '#FF6B6B',
                author: 'Team Development Coach',
                blog_post_tags: 'trust building, team communication, workplace relationships',
                date_time: new Date().toISOString(),
                canonical_tag: 'trust-building-activities',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 7,
                name: 'Corporate Team Building Trends for 2024',
                slug: 'corporate-team-building-trends-2024',
                collection_id: 'blog',
                locale_id: 'en',
                item_id: 'blog-7',
                created_on: new Date().toISOString(),
                updated_on: new Date().toISOString(),
                published_on: new Date().toISOString(),
                post_body: 'Stay ahead of the curve with the latest trends in corporate team building, from AI-powered activities to sustainability-focused events...',
                small_description: 'Discover the emerging trends that are shaping the future of corporate team building.',
                main_image: '/images/blog-trends-2024.jpg',
                thumbnail_image: '/images/blog-trends-2024-thumb.jpg',
                featured: true,
                color: '#FF7F50',
                author: 'Industry Trend Analyst',
                blog_post_tags: 'corporate trends, team building innovation, future of work',
                date_time: new Date().toISOString(),
                canonical_tag: 'team-building-trends-2024',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 8,
                name: 'Measuring ROI of Team Building Activities',
                slug: 'measuring-roi-team-building-activities',
                collection_id: 'blog',
                locale_id: 'en',
                item_id: 'blog-8',
                created_on: new Date().toISOString(),
                updated_on: new Date().toISOString(),
                published_on: new Date().toISOString(),
                post_body: 'Learn how to quantify the impact of your team building investments and demonstrate value to stakeholders...',
                small_description: 'Understand how to measure and prove the return on investment of your team building programs.',
                main_image: '/images/blog-roi-measurement.jpg',
                thumbnail_image: '/images/blog-roi-measurement-thumb.jpg',
                featured: false,
                color: '#4169E1',
                author: 'HR Analytics Expert',
                blog_post_tags: 'ROI measurement, team building impact, HR analytics',
                date_time: new Date().toISOString(),
                canonical_tag: 'team-building-roi-measurement',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 9,
                name: 'Team Building Activities for Diverse Teams',
                slug: 'team-building-activities-diverse-teams',
                collection_id: 'blog',
                locale_id: 'en',
                item_id: 'blog-9',
                created_on: new Date().toISOString(),
                updated_on: new Date().toISOString(),
                published_on: new Date().toISOString(),
                post_body: 'Creating inclusive team building experiences that celebrate diversity and bring multicultural teams together...',
                small_description: 'Learn how to design inclusive team building activities that work for diverse and multicultural teams.',
                main_image: '/images/blog-diverse-teams.jpg',
                thumbnail_image: '/images/blog-diverse-teams-thumb.jpg',
                featured: false,
                color: '#9370DB',
                author: 'Diversity & Inclusion Specialist',
                blog_post_tags: 'diversity, inclusion, multicultural teams, inclusive activities',
                date_time: new Date().toISOString(),
                canonical_tag: 'diverse-team-building',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 10,
                name: 'Quick Team Building Activities for Busy Schedules',
                slug: 'quick-team-building-activities-busy-schedules',
                collection_id: 'blog',
                locale_id: 'en',
                item_id: 'blog-10',
                created_on: new Date().toISOString(),
                updated_on: new Date().toISOString(),
                published_on: new Date().toISOString(),
                post_body: 'Effective team building activities that can be completed in 15-30 minutes for busy corporate schedules...',
                small_description: 'Discover quick and effective team building activities perfect for tight schedules and busy teams.',
                main_image: '/images/blog-quick-activities.jpg',
                thumbnail_image: '/images/blog-quick-activities-thumb.jpg',
                featured: false,
                color: '#FF6347',
                author: 'Productivity Consultant',
                blog_post_tags: 'quick activities, time management, busy schedules, efficient team building',
                date_time: new Date().toISOString(),
                canonical_tag: 'quick-team-building-activities',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 11,
                name: 'Team Building on a Budget: Maximum Impact, Minimum Cost',
                slug: 'team-building-on-budget-maximum-impact',
                collection_id: 'blog',
                locale_id: 'en',
                item_id: 'blog-11',
                created_on: new Date().toISOString(),
                updated_on: new Date().toISOString(),
                published_on: new Date().toISOString(),
                post_body: 'Discover cost-effective team building activities that deliver exceptional results without breaking the budget...',
                small_description: 'Learn how to create impactful team building experiences while staying within budget constraints.',
                main_image: '/images/blog-budget-friendly.jpg',
                thumbnail_image: '/images/blog-budget-friendly-thumb.jpg',
                featured: false,
                color: '#20B2AA',
                author: 'Budget Planning Expert',
                blog_post_tags: 'budget friendly, cost effective, affordable team building',
                date_time: new Date().toISOString(),
                canonical_tag: 'budget-team-building',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 12,
                name: 'The Future of Hybrid Team Building Events',
                slug: 'future-hybrid-team-building-events',
                collection_id: 'blog',
                locale_id: 'en',
                item_id: 'blog-12',
                created_on: new Date().toISOString(),
                updated_on: new Date().toISOString(),
                published_on: new Date().toISOString(),
                post_body: 'Exploring innovative hybrid team building formats that seamlessly blend in-person and virtual experiences...',
                small_description: 'Discover the next generation of team building that combines physical and digital experiences.',
                main_image: '/images/blog-hybrid-future.jpg',
                thumbnail_image: '/images/blog-hybrid-future-thumb.jpg',
                featured: true,
                color: '#FF1493',
                author: 'Future of Work Strategist',
                blog_post_tags: 'hybrid events, future of work, blended experiences, innovation',
                date_time: new Date().toISOString(),
                canonical_tag: 'hybrid-team-building-future',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 13,
                name: 'Creating Memorable Team Building Experiences',
                slug: 'creating-memorable-team-building-experiences',
                collection_id: 'blog',
                locale_id: 'en',
                item_id: 'blog-13',
                created_on: new Date().toISOString(),
                updated_on: new Date().toISOString(),
                published_on: new Date().toISOString(),
                post_body: 'Learn the art of designing team building experiences that leave lasting impressions and drive long-term engagement...',
                small_description: 'Master the elements that make team building experiences truly memorable and impactful.',
                main_image: '/images/blog-memorable-experiences.jpg',
                thumbnail_image: '/images/blog-memorable-experiences-thumb.jpg',
                featured: false,
                color: '#8A2BE2',
                author: 'Experience Design Expert',
                blog_post_tags: 'memorable experiences, engagement, experience design',
                date_time: new Date().toISOString(),
                canonical_tag: 'memorable-team-building',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 14,
                name: 'Team Building Activities for Tech Companies',
                slug: 'team-building-activities-tech-companies',
                collection_id: 'blog',
                locale_id: 'en',
                item_id: 'blog-14',
                created_on: new Date().toISOString(),
                updated_on: new Date().toISOString(),
                published_on: new Date().toISOString(),
                post_body: 'Specialized team building activities designed for tech teams, incorporating innovation, problem-solving, and digital collaboration...',
                small_description: 'Explore team building activities specifically designed for technology companies and their unique culture.',
                main_image: '/images/blog-tech-companies.jpg',
                thumbnail_image: '/images/blog-tech-companies-thumb.jpg',
                featured: false,
                color: '#00CED1',
                author: 'Tech Industry Consultant',
                blog_post_tags: 'tech companies, innovation, problem solving, digital teams',
                date_time: new Date().toISOString(),
                canonical_tag: 'tech-team-building',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 15,
                name: 'Building High-Performance Teams Through Strategic Activities',
                slug: 'building-high-performance-teams-strategic-activities',
                collection_id: 'blog',
                locale_id: 'en',
                item_id: 'blog-15',
                created_on: new Date().toISOString(),
                updated_on: new Date().toISOString(),
                published_on: new Date().toISOString(),
                post_body: 'A comprehensive guide to using strategic team building activities to develop high-performance teams that consistently deliver results...',
                small_description: 'Learn how to strategically design team building programs that create high-performance teams.',
                main_image: '/images/blog-high-performance.jpg',
                thumbnail_image: '/images/blog-high-performance-thumb.jpg',
                featured: true,
                color: '#DC143C',
                author: 'Performance Excellence Coach',
                blog_post_tags: 'high performance, strategic planning, team excellence, performance optimization',
                date_time: new Date().toISOString(),
                canonical_tag: 'high-performance-team-building',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            ]);
            setError(null);
          } else {
            setError(error.message);
          }
        } else {
          setBlogPosts(data || []);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBlogPosts();
    
    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { blogPosts, loading, error };
};

export default useSupabaseBlog; 