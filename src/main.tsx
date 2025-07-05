import { StrictMode, useEffect, Suspense, lazy, Component, ErrorInfo } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { generateSitemap } from './utils/sitemapGenerator'
import './index.css'
import App from './App'
import { CombinedProvider } from './contexts/TeamOutingAdsContext'
import ScrollToTop from './components/ScrollToTop'

// Simple placeholder components for pages that have complex dependencies
const SimplePage = ({ title, description }: { title: string; description: string }) => (
  <div className="min-h-screen bg-white">
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            {description}
          </p>
          <div className="mt-8">
            <a href="/" className="bg-gradient-to-r from-[#FF4C39] to-[#FFB573] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Import all the proper page components
const ActivitiesPage = lazy(() => import('./pages/Activities'));
const AboutPage = lazy(() => import('./pages/About'));
const ContactPage = lazy(() => import('./pages/Contact'));
const StaysPage = lazy(() => import('./pages/Stays'));
const BlogPage = lazy(() => import('./pages/Blog'));
const JobsPage = lazy(() => import('./pages/Jobs'));

// Lazy load all other pages
const AmdocsPage = lazy(() => import('./pages/Amdocs'));
const BangaloreResortsPage = lazy(() => import('./pages/BangaloreResorts'));
const CampusToCorporatePage = lazy(() => import('./pages/CampusToCorporate'));
const CorporateGiftingPage = lazy(() => import('./pages/CorporateGifting'));
const CorporateTeamBuildingActivitiesPage = lazy(() => import('./pages/CorporateTeamBuildingActivities'));
const CorporateTeamBuildingGamesPage = lazy(() => import('./pages/CorporateTeamBuildingGames'));
const CorporateTeamOffsitePage = lazy(() => import('./pages/CorporateTeamOffsite'));
const CorporateTeamOutboundTrainingPage = lazy(() => import('./pages/CorporateTeamOutboundTraining'));
const CorporateTeamOutingBangalorePage = lazy(() => import('./pages/CorporateTeamOutingBangalore'));
const CorporateTeamOutingMumbaiPage = lazy(() => import('./pages/CorporateTeamOutingMumbai'));
const CorporateTeamOutingPlacesPage = lazy(() => import('./pages/CorporateTeamOutingPlaces'));
const CorporateTeamOutingPlacesBangalorePage = lazy(() => import('./pages/CorporateTeamOutingPlacesBangalore'));
const CorporateTeamOutingPlacesHyderabadPage = lazy(() => import('./pages/CorporateTeamOutingPlacesHyderabad'));
const CorporateTeamOutingsPage = lazy(() => import('./pages/CorporateTeamOutings'));
const CorporateTeambuildingPage = lazy(() => import('./pages/CorporateTeambuilding'));
const CustomizedTrainingPage = lazy(() => import('./pages/CustomizedTraining'));
const DestinationDetailPage = lazy(() => import('./pages/DestinationDetail'));
const DestinationsPage = lazy(() => import('./pages/Destinations'));
const FunIndoorTeamBuildingActivitiesPage = lazy(() => import('./pages/FunIndoorTeamBuildingActivities'));
const FunVirtualTeamBuildingGamesPage = lazy(() => import('./pages/FunVirtualTeamBuildingGames'));
const GlobalPartnerRegistrationPage = lazy(() => import('./pages/GlobalPartnerRegistration'));
const HighEngagementTeamBuildingPage = lazy(() => import('./pages/HighEngagementTeamBuilding'));
const HighEngagingActivitiesPage = lazy(() => import('./pages/HighEngagingActivities'));
const IcebreakerGamesPage = lazy(() => import('./pages/IcebreakerGames'));
const OneDayOutingBangalorePage = lazy(() => import('./pages/OneDayOutingBangalore'));
const OneDayOutingResortsHyderabadPage = lazy(() => import('./pages/OneDayOutingResortsHyderabad'));
const OnlineTeamBuildingActivitiesPage = lazy(() => import('./pages/OnlineTeamBuildingActivities'));
const OutboundGuidelinesPage = lazy(() => import('./pages/OutboundGuidelines'));
const OutboundTeamBuildingPage = lazy(() => import('./pages/OutboundTeamBuilding'));
const OutdoorTeamBuildingPage = lazy(() => import('./pages/OutdoorTeamBuilding'));
const OvernightTeamOutingNearBangalorePage = lazy(() => import('./pages/OvernightTeamOutingNearBangalore'));
const PlanYourTeamOffsiteTodayPage = lazy(() => import('./pages/PlanYourTeamOffsiteToday'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicy'));
const ResortsAroundBangalorePage = lazy(() => import('./pages/ResortsAroundBangalore'));
const ReturnToOfficePage = lazy(() => import('./pages/ReturnToOffice'));
const StayDetailPage = lazy(() => import('./pages/StayDetail'));
const TeamBuildingPage = lazy(() => import('./pages/TeamBuilding'));
const TeamBuildingActivitiesBangalorePage = lazy(() => import('./pages/TeamBuildingActivitiesBangalore'));
const TeamBuildingActivitiesMumbaiPage = lazy(() => import('./pages/TeamBuildingActivitiesMumbai'));
const TeamBuildingActivitiesSmallGroupsPage = lazy(() => import('./pages/TeamBuildingActivitiesSmallGroups'));
const TeamBuildingGamesPage = lazy(() => import('./pages/TeamBuildingGames'));
const TeamCollaborationGamesPage = lazy(() => import('./pages/TeamCollaborationGames'));
const TeamEngagementActivitiesPage = lazy(() => import('./pages/TeamEngagementActivities'));
const TeamOutingDetailPage = lazy(() => import('./pages/TeamOutingDetail'));
const TeamOutingPlacesBangalorePage = lazy(() => import('./pages/TeamOutingPlacesBangalore'));
const TeamOutingPlacesHyderabadPage = lazy(() => import('./pages/TeamOutingPlacesHyderabad'));
const TeamOutingRegionsPage = lazy(() => import('./pages/TeamOutingRegions'));
const TeamOutingsPage = lazy(() => import('./pages/TeamOutings'));
const TermsAndConditionsPage = lazy(() => import('./pages/TermsAndConditions'));
const ThankYouPage = lazy(() => import('./pages/ThankYou'));
const TopTeamBuildingActivitiesPage = lazy(() => import('./pages/TopTeamBuildingActivities'));
const TopTeamBuildingActivitiesLargeGroupsPage = lazy(() => import('./pages/TopTeamBuildingActivitiesLargeGroups'));
const VirtualEscapeRoomTeambuildingActivityTreboundPage = lazy(() => import('./pages/VirtualEscapeRoomTeambuildingActivityTrebound'));
const VirtualGuidelinesPage = lazy(() => import('./pages/VirtualGuidelines'));
const VirtualTeamBuildingPage = lazy(() => import('./pages/VirtualTeamBuilding'));
const VirtualTeamBuildingHolidayPage = lazy(() => import('./pages/VirtualTeamBuildingHoliday'));
const VirtualTeamBuildingIcebreakerGamesPage = lazy(() => import('./pages/VirtualTeamBuildingIcebreakerGames'));
const WhyChooseTreboundPage = lazy(() => import('./pages/WhyChooseTrebound'));
const ActivityDetailPage = lazy(() => import('./pages/ActivityDetail'));
const BlogPostPage = lazy(() => import('./pages/BlogPost'));
const ExpertConsultationPage = lazy(() => import('./pages/ExpertConsultation'));

const emotionCache = createCache({ key: 'css' });

// Error Boundary to prevent the entire app from crashing
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null, errorInfo: ErrorInfo | null }> {
  private originalConsoleError: typeof console.error;
  private errorCleanupAttempted: boolean = false;
  
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
    
    // Store original console.error to restore later
    this.originalConsoleError = console.error;
    
    // Add DOM error monitoring
    this.monitorDOMErrors();
  }
  
  monitorDOMErrors() {
    // Override console.error to catch and handle DOM-related errors
    console.error = (...args: any[]) => {
      const errorString = args.join(' ');
      
      // Check if this is a DOM-related error we want to handle specially
      if (
        errorString.includes('removeChild') ||
        errorString.includes('Failed to execute') ||
        errorString.includes('is not a child of this node')
      ) {
        this.handleDOMError();
        return; // Suppress error from console
      }
      
      // Call original for other errors
      this.originalConsoleError.apply(console, args);
    };
    
    // Add global error handler
    window.addEventListener('error', this.handleGlobalError);
    window.addEventListener('unhandledrejection', this.handlePromiseRejection);
  }
  
  handleGlobalError = (event: ErrorEvent) => {
    if (
      event.message?.includes('removeChild') ||
      event.message?.includes('Failed to execute') ||
      event.message?.includes('is not a child of this node')
    ) {
      this.handleDOMError();
      event.preventDefault(); // Prevent default error handling
      return false;
    }
    return true;
  };
  
  handlePromiseRejection = (event: PromiseRejectionEvent) => {
    if (
      event.reason?.toString().includes('removeChild') ||
      event.reason?.toString().includes('Failed to execute') ||
      event.reason?.toString().includes('is not a child of this node')
    ) {
      this.handleDOMError();
      event.preventDefault();
    }
  };
  
  handleDOMError = () => {
    if (this.errorCleanupAttempted) return; // Only try cleanup once
    
    this.errorCleanupAttempted = true;
    
    try {
      // Clean up any potentially problematic elements
      this.cleanupDOMElements();
    } catch (e) {
      // Silent catch - we don't want errors in our error handler
    }
  };
  
  cleanupDOMElements() {
    try {
      // Clean up font optimization styles
      const fontStyles = document.querySelectorAll('style[id^="font-optimization"]');
      fontStyles.forEach(el => {
        if (el.parentNode) {
          try {
            el.parentNode.removeChild(el);
          } catch (e) {
            // Silent catch
          }
        }
      });
      
      // Clean up script elements with data-loading-strategy
      const scriptElements = document.querySelectorAll('script[data-loading-strategy]');
      scriptElements.forEach(el => {
        if (el.parentNode) {
          try {
            el.parentNode.removeChild(el);
          } catch (e) {
            // Silent catch
          }
        }
      });
      
      // Remove placeholder elements
      const placeholders = document.querySelectorAll('.lazy-component-placeholder');
      placeholders.forEach(el => {
        if (el.parentNode) {
          try {
            el.parentNode.removeChild(el);
          } catch (e) {
            // Silent catch
          }
        }
      });
    } catch (e) {
      // Silent catch
    }
  }

  static getDerivedStateFromError(error: Error) {
    // If this is a DOM removal error, we want to try to recover without showing the error
    if (
      error.message.includes('removeChild') ||
      error.message.includes('Failed to execute') ||
      error.message.includes('is not a child of this node')
    ) {
      return { hasError: false, error };
    }
    
    // For other errors, show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log non-DOM errors to console
    if (
      !error.message.includes('removeChild') &&
      !error.message.includes('Failed to execute') &&
      !error.message.includes('is not a child of this node')
    ) {
      this.originalConsoleError('React Error Boundary caught an error:', error, errorInfo);
    }
    
    this.setState({
      error,
      errorInfo
    });
    
    // For DOM errors, attempt cleanup
    if (
      error.message.includes('removeChild') ||
      error.message.includes('Failed to execute') ||
      error.message.includes('is not a child of this node')
    ) {
      this.handleDOMError();
    }
  }
  
  componentWillUnmount() {
    // Restore original console.error
    console.error = this.originalConsoleError;
    
    // Remove global handlers
    window.removeEventListener('error', this.handleGlobalError);
    window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-700 mb-4">
              We're sorry, but the application has encountered an error. Please try refreshing the page.
            </p>
            {this.state.error && (
              <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto">
                <p className="font-mono text-sm text-red-800 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component for better UX during route transitions
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FF4C39] border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

const SitemapComponent = () => {
  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const sitemap = await generateSitemap();
        const blob = new Blob([sitemap], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        
        // Create a download link instead of navigating to the blob URL
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sitemap.xml';
        link.click();
        
        // Clean up the blob URL to prevent memory leaks
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);
      } catch (error) {
        console.error('Error generating sitemap:', error);
      }
    };
    fetchSitemap();
  }, []);
  return null;
};

const Root = () => (
  <StrictMode>
    <CacheProvider value={emotionCache}>
      <HelmetProvider>
        <CombinedProvider>
          <ErrorBoundary>
            <Router>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Main Pages */}
                <Route path="/" element={<App />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/team-building-activity" element={<ActivitiesPage />} />
                <Route path="/stays" element={<StaysPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/expert-consultation" element={<ExpertConsultationPage />} />
                
                {/* Activity and Detail Pages */}
                <Route path="/activity/:slug" element={<ActivityDetailPage />} />
                <Route path="/team-building-activity/:slug" element={<ActivityDetailPage />} />
                <Route path="/stay/:slug" element={<StayDetailPage />} />
                <Route path="/stays/:slug" element={<StayDetailPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/team-building/:slug" element={<TeamBuildingPage />} />
                <Route path="/customized-training/:slug" element={<CustomizedTrainingPage />} />
                <Route path="/corporate-teambuilding/:slug" element={<CorporateTeambuildingPage />} />
                
                {/* Corporate Pages */}
                <Route path="/amdocs" element={<AmdocsPage />} />
                <Route path="/corporate-gifting" element={<CorporateGiftingPage />} />
                <Route path="/corporate-team-building-activities" element={<CorporateTeamBuildingActivitiesPage />} />
                <Route path="/corporate-team-building-games" element={<CorporateTeamBuildingGamesPage />} />
                <Route path="/corporate-team-offsite" element={<CorporateTeamOffsitePage />} />
                <Route path="/corporate-team-outbound-training" element={<CorporateTeamOutboundTrainingPage />} />
                <Route path="/corporate-team-outing-bangalore" element={<CorporateTeamOutingBangalorePage />} />
                <Route path="/corporate-team-outing-mumbai" element={<CorporateTeamOutingMumbaiPage />} />
                <Route path="/corporate-team-outing-places" element={<CorporateTeamOutingPlacesPage />} />
                <Route path="/corporate-team-outing-places-bangalore" element={<CorporateTeamOutingPlacesBangalorePage />} />
                <Route path="/corporate-team-outing-places-hyderabad" element={<CorporateTeamOutingPlacesHyderabadPage />} />
                <Route path="/corporate-team-outings" element={<CorporateTeamOutingsPage />} />
                <Route path="/corporate-teambuilding" element={<CorporateTeambuildingPage />} />
                
                {/* Team Building Pages */}
                <Route path="/team-building" element={<TeamBuildingPage />} />
                <Route path="/team-building-activities-bangalore" element={<TeamBuildingActivitiesBangalorePage />} />
                <Route path="/team-building-activities-mumbai" element={<TeamBuildingActivitiesMumbaiPage />} />
                <Route path="/team-building-activities-small-groups" element={<TeamBuildingActivitiesSmallGroupsPage />} />
                <Route path="/team-building-games" element={<TeamBuildingGamesPage />} />
                <Route path="/team-collaboration-games" element={<TeamCollaborationGamesPage />} />
                <Route path="/team-engagement-activities" element={<TeamEngagementActivitiesPage />} />
                <Route path="/top-team-building-activities" element={<TopTeamBuildingActivitiesPage />} />
                <Route path="/top-team-building-activities-large-groups" element={<TopTeamBuildingActivitiesLargeGroupsPage />} />
                
                {/* Virtual Team Building */}
                <Route path="/virtual-team-building" element={<VirtualTeamBuildingPage />} />
                <Route path="/virtual-team-building-holiday" element={<VirtualTeamBuildingHolidayPage />} />
                <Route path="/virtual-team-building-icebreaker-games" element={<VirtualTeamBuildingIcebreakerGamesPage />} />
                <Route path="/virtual-escape-room-teambuilding-activity-trebound" element={<VirtualEscapeRoomTeambuildingActivityTreboundPage />} />
                <Route path="/fun-virtual-team-building-games" element={<FunVirtualTeamBuildingGamesPage />} />
                <Route path="/online-team-building-activities" element={<OnlineTeamBuildingActivitiesPage />} />
                <Route path="/virtual-guidelines" element={<VirtualGuidelinesPage />} />
                
                {/* Indoor/Outdoor Activities */}
                <Route path="/fun-indoor-team-building-activities" element={<FunIndoorTeamBuildingActivitiesPage />} />
                <Route path="/outdoor-team-building" element={<OutdoorTeamBuildingPage />} />
                <Route path="/outbound-team-building" element={<OutboundTeamBuildingPage />} />
                <Route path="/outbound-guidelines" element={<OutboundGuidelinesPage />} />
                <Route path="/icebreaker-games" element={<IcebreakerGamesPage />} />
                
                {/* Location-specific Pages */}
                <Route path="/bangalore-resorts" element={<BangaloreResortsPage />} />
                <Route path="/resorts-around-bangalore" element={<ResortsAroundBangalorePage />} />
                <Route path="/one-day-outing-bangalore" element={<OneDayOutingBangalorePage />} />
                <Route path="/one-day-outing-resorts-hyderabad" element={<OneDayOutingResortsHyderabadPage />} />
                <Route path="/overnight-team-outing-near-bangalore" element={<OvernightTeamOutingNearBangalorePage />} />
                <Route path="/team-outing-places-bangalore" element={<TeamOutingPlacesBangalorePage />} />
                <Route path="/team-outing-places-hyderabad" element={<TeamOutingPlacesHyderabadPage />} />
                <Route path="/team-outing-regions" element={<TeamOutingRegionsPage />} />
                <Route path="/team-outings" element={<TeamOutingsPage />} />
                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/destination/:slug" element={<DestinationDetailPage />} />
                
                {/* Engagement & Training */}
                <Route path="/high-engagement-team-building" element={<HighEngagementTeamBuildingPage />} />
                <Route path="/high-engaging-activities" element={<HighEngagingActivitiesPage />} />
                <Route path="/customized-training" element={<CustomizedTrainingPage />} />
                <Route path="/campus-to-corporate" element={<CampusToCorporatePage />} />
                <Route path="/return-to-office" element={<ReturnToOfficePage />} />
                <Route path="/plan-your-team-offsite-today" element={<PlanYourTeamOffsiteTodayPage />} />
                
                {/* Other Pages */}
                <Route path="/global-partner-registration" element={<GlobalPartnerRegistrationPage />} />
                <Route path="/why-choose-trebound" element={<WhyChooseTreboundPage />} />
                <Route path="/team-outing-detail/:slug" element={<TeamOutingDetailPage />} />
                <Route path="/thank-you" element={<ThankYouPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
                
                {/* Utility Routes */}
                <Route path="/sitemap.xml" element={<SitemapComponent />} />
                
                {/* Catch-all route for any unmatched paths */}
                <Route path="*" element={<SimplePage title="Page Not Found" description="The page you're looking for doesn't exist. Let's get you back on track." />} />
              </Routes>
            </Suspense>
          </Router>
          </ErrorBoundary>
        </CombinedProvider>
      </HelmetProvider>
    </CacheProvider>
  </StrictMode>
);

createRoot(document.getElementById('root')!).render(<Root />);
