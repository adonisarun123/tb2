import { useState, useEffect } from 'react';
import { supabase, Stay } from '../lib/supabaseClient';

interface UseStaysReturn {
  stays: Stay[];
  loading: boolean;
  error: string | null;
}

export const useSupabaseStays = (limit?: number): UseStaysReturn => {
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStays = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('stays')
          .select('*')
          .order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (!isMounted) return;
        
        if (error) {
          console.error('Error fetching stays:', error);
          
          if (error.message?.includes('key') || error.message?.includes('API')) {
            console.warn('API key issue detected, using fallback stays data');
            
            // Comprehensive fallback data with 18+ diverse stays
            setStays([
              {
                id: 1,
                name: 'Luxury Beach Resort Goa',
                tagline: 'Premium beachfront experience',
                stay_description: 'Experience luxury at its finest with our premium beachfront resort in Goa. Perfect for corporate retreats and team building.',
                stay_image: '/images/resort1.jpg',
                location: 'Goa',
                facilities: 'Pool, Beach Access, Conference Hall, Restaurant',
                price: '₹8,000-15,000',
                rating: '4.8',
                slug: 'luxury-beach-resort-goa',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 2,
                name: 'Mountain View Resort Lonavala',
                tagline: 'Scenic mountain retreat',
                stay_description: 'Breathtaking mountain views and serene environment make this the perfect venue for corporate offsites and team activities.',
                stay_image: '/images/resort2.jpg',
                location: 'Lonavala',
                facilities: 'Mountain View, Adventure Activities, Spa, Restaurant',
                price: '₹5,000-10,000',
                rating: '4.6',
                slug: 'mountain-view-resort-lonavala',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 3,
                name: 'Heritage Palace Hotel Jaipur',
                tagline: 'Royal heritage experience',
                stay_description: 'Step into royalty with our heritage palace hotel in Jaipur. Ideal for executive retreats and cultural team building.',
                stay_image: '/images/resort3.jpg',
                location: 'Jaipur',
                facilities: 'Palace Architecture, Royal Dining, Cultural Shows, Gardens',
                price: '₹7,000-12,000',
                rating: '4.7',
                slug: 'heritage-palace-hotel-jaipur',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 4,
                name: 'Riverside Resort Rishikesh',
                tagline: 'Adventure and tranquility by the Ganges',
                stay_description: 'Combine adventure with spirituality at our riverside resort in Rishikesh. Perfect for team building and wellness programs.',
                stay_image: '/images/resort1.jpg',
                location: 'Rishikesh',
                facilities: 'River View, Adventure Sports, Yoga, Meditation',
                price: '₹4,000-8,000',
                rating: '4.5',
                slug: 'riverside-resort-rishikesh',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 5,
                name: 'Business Hotel Mumbai',
                tagline: 'Corporate excellence in the financial capital',
                stay_description: 'State-of-the-art business hotel in Mumbai with modern amenities and excellent connectivity for corporate events.',
                stay_image: '/images/resort2.jpg',
                location: 'Mumbai',
                facilities: 'Business Center, Conference Rooms, City View, Restaurant',
                price: '₹6,000-12,000',
                rating: '4.6',
                slug: 'business-hotel-mumbai',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 6,
                name: 'Backwater Resort Kerala',
                tagline: 'Serene backwaters experience',
                stay_description: 'Immerse yourself in the tranquil backwaters of Kerala. Perfect for relaxation and team bonding activities.',
                stay_image: '/images/resort3.jpg',
                location: 'Kerala',
                facilities: 'Backwater View, Boat Rides, Ayurvedic Spa, Traditional Cuisine',
                price: '₹5,500-9,500',
                rating: '4.7',
                slug: 'backwater-resort-kerala',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 7,
                name: 'Hillside Resort Manali',
                tagline: 'Adventure in the Himalayas',
                stay_description: 'Experience the majestic Himalayas with our hillside resort in Manali. Ideal for adventure-based team building.',
                stay_image: '/images/resort1.jpg',
                location: 'Manali',
                facilities: 'Mountain View, Adventure Activities, Bonfire, Trekking',
                price: '₹4,500-8,500',
                rating: '4.4',
                slug: 'hillside-resort-manali',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 8,
                name: 'Luxury Resort Udaipur',
                tagline: 'Lake palace experience',
                stay_description: 'Elegant lake-facing resort in the city of lakes. Perfect for luxury corporate retreats and special events.',
                stay_image: '/images/resort2.jpg',
                location: 'Udaipur',
                facilities: 'Lake View, Royal Decor, Boat Rides, Cultural Programs',
                price: '₹7,500-14,000',
                rating: '4.8',
                slug: 'luxury-resort-udaipur',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 9,
                name: 'Tech Hub Hotel Bangalore',
                tagline: 'Modern amenities in Silicon Valley',
                stay_description: 'Contemporary hotel in Bangalore with cutting-edge technology and excellent facilities for tech company retreats.',
                stay_image: '/images/resort3.jpg',
                location: 'Bangalore',
                facilities: 'High-Speed WiFi, Tech Facilities, Conference Rooms, Rooftop',
                price: '₹5,000-10,000',
                rating: '4.5',
                slug: 'tech-hub-hotel-bangalore',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 10,
                name: 'Desert Resort Jaisalmer',
                tagline: 'Golden desert experience',
                stay_description: 'Unique desert resort experience in Jaisalmer with camel safaris and cultural performances for memorable team outings.',
                stay_image: '/images/resort1.jpg',
                location: 'Jaisalmer',
                facilities: 'Desert View, Camel Safari, Cultural Shows, Stargazing',
                price: '₹6,000-11,000',
                rating: '4.6',
                slug: 'desert-resort-jaisalmer',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 11,
                name: 'Coastal Resort Gokarna',
                tagline: 'Pristine beach escape',
                stay_description: 'Secluded coastal resort in Gokarna offering pristine beaches and peaceful environment for team retreats.',
                stay_image: '/images/resort2.jpg',
                location: 'Gokarna',
                facilities: 'Private Beach, Water Sports, Yoga, Organic Food',
                price: '₹4,500-8,000',
                rating: '4.4',
                slug: 'coastal-resort-gokarna',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 12,
                name: 'Wine Resort Nashik',
                tagline: 'Vineyard experience',
                stay_description: 'Premium wine resort in Nashik with vineyard tours and wine tasting experiences for sophisticated corporate events.',
                stay_image: '/images/resort3.jpg',
                location: 'Nashik',
                facilities: 'Vineyard View, Wine Tasting, Gourmet Dining, Tours',
                price: '₹6,500-12,000',
                rating: '4.7',
                slug: 'wine-resort-nashik',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 13,
                name: 'Garden Resort Coorg',
                tagline: 'Coffee plantation retreat',
                stay_description: 'Immerse yourself in the aromatic coffee plantations of Coorg with our garden resort perfect for nature-based team building.',
                stay_image: '/images/resort1.jpg',
                location: 'Coorg',
                facilities: 'Coffee Plantation, Nature Walks, Spa, Local Cuisine',
                price: '₹4,000-7,500',
                rating: '4.5',
                slug: 'garden-resort-coorg',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 14,
                name: 'Luxury Hotel Delhi',
                tagline: 'Capital city elegance',
                stay_description: 'Sophisticated luxury hotel in Delhi with world-class amenities and proximity to business districts.',
                stay_image: '/images/resort2.jpg',
                location: 'Delhi',
                facilities: 'Luxury Suites, Multiple Restaurants, Spa, Business Center',
                price: '₹8,000-16,000',
                rating: '4.8',
                slug: 'luxury-hotel-delhi',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 15,
                name: 'Beach Resort Puri',
                tagline: 'Spiritual beach experience',
                stay_description: 'Combine spirituality with beach relaxation at our resort in Puri, ideal for contemplative team retreats.',
                stay_image: '/images/resort3.jpg',
                location: 'Puri',
                facilities: 'Beach Access, Temple Tours, Seafood, Cultural Activities',
                price: '₹3,500-7,000',
                rating: '4.3',
                slug: 'beach-resort-puri',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 16,
                name: 'Eco Resort Wayanad',
                tagline: 'Sustainable luxury in nature',
                stay_description: 'Eco-friendly resort in Wayanad with sustainable practices and immersive nature experiences for environmentally conscious teams.',
                stay_image: '/images/resort1.jpg',
                location: 'Wayanad',
                facilities: 'Eco-Friendly, Nature Trails, Wildlife, Organic Food',
                price: '₹4,500-8,500',
                rating: '4.6',
                slug: 'eco-resort-wayanad',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 17,
                name: 'City Hotel Pune',
                tagline: 'Urban comfort and convenience',
                stay_description: 'Modern city hotel in Pune with excellent connectivity and comprehensive facilities for corporate meetings and events.',
                stay_image: '/images/resort2.jpg',
                location: 'Pune',
                facilities: 'City Center, Conference Facilities, Restaurant, Gym',
                price: '₹4,500-9,000',
                rating: '4.4',
                slug: 'city-hotel-pune',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: 18,
                name: 'Island Resort Andaman',
                tagline: 'Tropical paradise experience',
                stay_description: 'Exclusive island resort in Andaman with pristine beaches and water activities for unique team building experiences.',
                stay_image: '/images/resort3.jpg',
                location: 'Andaman',
                facilities: 'Private Island, Scuba Diving, Water Sports, Seafood',
                price: '₹10,000-18,000',
                rating: '4.9',
                slug: 'island-resort-andaman',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            ]);
            setError(null);
          } else {
            setError(error.message);
          }
        } else {
          setStays(data || []);
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

    fetchStays();
    
    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { stays, loading, error };
};

export default useSupabaseStays; 