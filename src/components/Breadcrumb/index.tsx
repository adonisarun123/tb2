import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadcrumbItem {
  label: string;
  path: string;
  isLast?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  homeLabel?: string;
  separator?: React.ReactNode;
  includeHome?: boolean;
  schema?: boolean;
}

/**
 * Breadcrumb component for improved navigation and SEO
 * 
 * This component creates accessible, semantic breadcrumbs that help users
 * understand their location in the site hierarchy and navigate effectively.
 * It also supports schema markup for better SEO.
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = '',
  homeLabel = 'Home',
  separator = <FiChevronRight className="mx-2 text-gray-400 flex-shrink-0" />,
  includeHome = true,
  schema = true
}) => {
  const location = useLocation();
  
  // Auto-generate breadcrumb items if not provided
  const breadcrumbItems = items || generateBreadcrumbItems(location.pathname, homeLabel);
  
  // Generate structured data for breadcrumbs
  const structuredData = schema ? generateStructuredData(breadcrumbItems) : null;
  
  return (
    <nav aria-label="Breadcrumb" className={`py-3 ${className}`}>
      {/* Schema.org structured data for breadcrumbs */}
      {schema && structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      )}
      
      {/* Accessible breadcrumb structure */}
      <ol className="flex flex-wrap items-center space-x-1 text-sm">
        {breadcrumbItems.map((item, index) => (
          <li key={item.path} className="flex items-center">
            {index > 0 && separator}
            
            {item.isLast ? (
              <span className="text-gray-700 font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.path} 
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                {index === 0 && includeHome ? (
                  <span className="flex items-center">
                    <FiHome className="mr-1" /> {item.label}
                  </span>
                ) : (
                  item.label
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

/**
 * Generate breadcrumb items from the current path
 */
const generateBreadcrumbItems = (pathname: string, homeLabel: string): BreadcrumbItem[] => {
  // Create the home item
  const items: BreadcrumbItem[] = [
    { label: homeLabel, path: '/' }
  ];
  
  // Skip if we're on the homepage
  if (pathname === '/') {
    return items;
  }
  
  // Split the path and build breadcrumb items
  const pathSegments = pathname.split('/').filter(Boolean);
  
  // Path mapping for readable labels - extend this based on your site structure
  const pathMapping: Record<string, string> = {
    'activities': 'Activities',
    'team-building-activity': 'Team Building Activity',
    'stays': 'Venues',
    'stay': 'Venue',
    'blog': 'Blog',
    'about': 'About Us',
    'contact': 'Contact',
    'virtual-team-building': 'Virtual Team Building',
    'outdoor-team-building': 'Outdoor Team Building',
    'corporate-team-outings': 'Corporate Team Outings',
    'team-building-games': 'Team Building Games',
    'bangalore': 'Bangalore',
    'mumbai': 'Mumbai',
    'hyderabad': 'Hyderabad',
    'corporate-teambuilding': 'Corporate Teambuilding',
    'customized-training': 'Customized Training'
  };
  
  let currentPath = '';
  
  // Build breadcrumb items from path segments
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;
    
    // Try to get a friendly name for the segment, or format the segment as a label
    let label = pathMapping[segment] || 
               segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // If it's a dynamic segment (like a slug), try to make it more readable
    if (segment.length > 20 || /^[a-f0-9]{24}$/.test(segment)) {
      label = 'Details';
    }
    
    items.push({
      label,
      path: currentPath,
      isLast
    });
  });
  
  return items;
};

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
const generateStructuredData = (items: BreadcrumbItem[]): string => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.label,
      'item': `${window.location.origin}${item.path}`
    }))
  };
  
  return JSON.stringify(structuredData);
};

export default Breadcrumb;