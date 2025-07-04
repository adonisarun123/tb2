import { useState, useEffect } from 'react';
import { supabase, BlogPost } from '../lib/supabaseClient';

interface UseBlogReturn {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
}

export const useSupabaseBlog = (limit?: number): UseBlogReturn => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('blog_posts')
          .select('*')
          .order('published_on', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;
        
        if (!isMounted) return;

        if (error) {
          console.error('Error fetching blog posts:', error);
          setError(error.message);
        } else {
          setPosts(data || []);
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

    fetchPosts();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { posts, loading, error };
};

export default useSupabaseBlog; 