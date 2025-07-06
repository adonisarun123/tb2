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

        // Add timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          if (isMounted) {
            console.warn('Activities API timeout, using fallback data');
            setActivities([
              {
                id: 1,
                name: 'Virtual Team Building Adventure',
                tagline: 'Experience exciting virtual team building activities',
                description: 'Engage your team with our innovative virtual team building activities designed to boost collaboration and morale.',
                main_image: '/images/activity1.jpg',
                activity_type: 'virtual',
                group_size: '10-50',
                duration: '2-3 hours',
                slug: 'virtual-team-building-adventure',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 2,
                name: 'Outdoor Adventure Challenge',
                tagline: 'Build stronger teams through outdoor adventures',
                description: 'Take your team outdoors for exciting challenges that build trust and communication.',
                main_image: '/images/activity2.jpg',
                activity_type: 'outdoor',
                group_size: '5-30',
                duration: '4-6 hours',
                slug: 'outdoor-adventure-challenge',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 3,
                name: 'Corporate Training Workshop',
                tagline: 'Professional development for your team',
                description: 'Enhance your team\'s skills with our comprehensive corporate training programs.',
                main_image: '/images/activity3.jpg',
                activity_type: 'indoor',
                group_size: '15-100',
                duration: '1-2 days',
                slug: 'corporate-training-workshop',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            ]);
            setLoading(false);
            setError(null);
          }
        }, 5000); // 5 second timeout

        let query = supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (!isMounted) return;
        
        clearTimeout(timeoutId);
        
        if (error) {
          console.error('Error fetching activities:', error);
          
          // Use simplified fallback data
          setActivities([
            {
              id: 1,
              name: 'Virtual Team Building Adventure',
              tagline: 'Experience exciting virtual team building activities',
              description: 'Engage your team with our innovative virtual team building activities designed to boost collaboration and morale.',
              main_image: '/images/activity1.jpg',
              activity_type: 'virtual',
              group_size: '10-50',
              duration: '2-3 hours',
              slug: 'virtual-team-building-adventure',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 2,
              name: 'Outdoor Adventure Challenge',
              tagline: 'Build stronger teams through outdoor adventures',
              description: 'Take your team outdoors for exciting challenges that build trust and communication.',
              main_image: '/images/activity2.jpg',
              activity_type: 'outdoor',
              group_size: '5-30',
              duration: '4-6 hours',
              slug: 'outdoor-adventure-challenge',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 3,
              name: 'Corporate Training Workshop',
              tagline: 'Professional development for your team',
              description: 'Enhance your team\'s skills with our comprehensive corporate training programs.',
              main_image: '/images/activity3.jpg',
              activity_type: 'indoor',
              group_size: '15-100',
              duration: '1-2 days',
              slug: 'corporate-training-workshop',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          ]);
          setError(null); // Don't show error to user
        } else {
          setActivities(data || []);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        if (isMounted) {
          // Use fallback data on any error
          setActivities([
            {
              id: 1,
              name: 'Virtual Team Building Adventure',
              tagline: 'Experience exciting virtual team building activities',
              description: 'Engage your team with our innovative virtual team building activities designed to boost collaboration and morale.',
              main_image: '/images/activity1.jpg',
              activity_type: 'virtual',
              group_size: '10-50',
              duration: '2-3 hours',
              slug: 'virtual-team-building-adventure',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 2,
              name: 'Outdoor Adventure Challenge',
              tagline: 'Build stronger teams through outdoor adventures',
              description: 'Take your team outdoors for exciting challenges that build trust and communication.',
              main_image: '/images/activity2.jpg',
              activity_type: 'outdoor',
              group_size: '5-30',
              duration: '4-6 hours',
              slug: 'outdoor-adventure-challenge',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 3,
              name: 'Corporate Training Workshop',
              tagline: 'Professional development for your team',
              description: 'Enhance your team\'s skills with our comprehensive corporate training programs.',
              main_image: '/images/activity3.jpg',
              activity_type: 'indoor',
              group_size: '15-100',
              duration: '1-2 days',
              slug: 'corporate-training-workshop',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          ]);
          setError(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchActivities();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { activities, loading, error };
};

export default useSupabaseActivities; 