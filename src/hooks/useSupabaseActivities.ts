import { useState, useEffect } from 'react';
import { supabase, Activity } from '../lib/supabaseClient';

interface UseActivitiesReturn {
  activities: Activity[];
  loading: boolean;
  error: string | null;
}

export const useSupabaseActivities = (limit?: number): UseActivitiesReturn => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (!isMounted) return;
        
        if (error) {
          console.error('Error fetching activities:', error);
          
          // Provide more specific error messages for common issues
          if (error.message?.includes('key') || error.message?.includes('API')) {
            setError('Error loading activities: Invalid API key. Please check your environment configuration.');
            
            // Provide fallback data for development
            if (process.env.NODE_ENV === 'development') {
              console.log('Using fallback activities data for development');
              setActivities([
                {
                  id: 1,
                  name: 'Demo Activity 1',
                  tagline: 'This is a fallback activity due to API key issue',
                  description: 'Fallback activity description',
                  main_image: '/images/activity2.jpg',
                  activity_type: 'virtual',
                  group_size: '10-50',
                  duration: '2-3 hours',
                  slug: 'demo-activity-1',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }
              ]);
            }
          } else {
            setError(error.message);
          }
        } else {
          setActivities(data || []);
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

    fetchActivities();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { activities, loading, error };
};

export default useSupabaseActivities; 