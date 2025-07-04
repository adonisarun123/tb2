import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SchemaMarkupProps {
  type: 'organization' | 'activity' | 'venue' | 'article' | 'product' | 'faq' | 'homepage' | 'webpage' | 'breadcrumb' | 'dataset' | 'ai-service';
  data: any;
}

const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ type, data }) => {
  const generateSchema = (): any => {
    const baseSchema: any = {
      "@context": "https://schema.org",
      "@graph": []
    };

    switch (type) {
      case 'organization':
        baseSchema["@graph"].push({
          "@type": "Organization",
          "@id": "https://www.trebound.com/#organization",
          "name": "Trebound",
          "alternateName": "Trebound Team Building",
          "url": "https://www.trebound.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.trebound.com/images/trebound-logo.png",
            "width": 400,
            "height": 100
          },
          "description": "AI-powered team building and corporate events solutions with 350+ unique activities, designed to enhance team productivity and workplace cohesion through data-driven approaches",
          "foundingDate": "2018",
          "slogan": "AI-Powered Team Building Solutions",
          "foundingLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Bangalore",
              "addressRegion": "Karnataka",
              "addressCountry": "IN"
            }
          },
          "contactPoint": [{
            "@type": "ContactPoint",
            "telephone": "+91-8447464439",
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": ["en", "hi", "te", "ta", "kn"]
          }],
          "email": "connect@trebound.com",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN",
            "addressRegion": "Karnataka",
            "addressLocality": "Bangalore",
            "postalCode": "560001",
            "streetAddress": "MG Road"
          },
          "sameAs": [
            "https://www.linkedin.com/company/trebound",
            "https://www.facebook.com/trebound",
            "https://twitter.com/trebound",
            "https://www.instagram.com/trebound",
            "https://www.youtube.com/channel/treboundchannel"
          ],
          "serviceType": "Team Building Services",
          "areaServed": [{
            "@type": "Country",
            "name": "India"
          }, {
            "@type": "City",
            "name": "Bangalore"
          }, {
            "@type": "City",
            "name": "Mumbai"
          }, {
            "@type": "City",
            "name": "Hyderabad"
          }],
          "knowsAbout": [
            "Team Building",
            "Corporate Events",
            "Virtual Team Building",
            "Outdoor Activities",
            "Corporate Training",
            "Employee Engagement",
            "AI-Powered Recommendations",
            "Team Collaboration",
            "Leadership Development",
            "Work-Life Balance",
            "Remote Team Management",
            "AI Technology in Team Building"
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Team Building Services Catalog",
            "itemListElement": [
              {
                "@type": "OfferCatalog",
                "name": "Virtual Team Building",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Virtual Escape Rooms"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Online Team Challenges"
                    }
                  }
                ]
              },
              {
                "@type": "OfferCatalog",
                "name": "Outdoor Activities",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Adventure Sports"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Team Retreats"
                    }
                  }
                ]
              }
            ]
          },
          "makesOffer": {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "AI-Powered Team Building Solutions",
              "description": "Personalized team building experiences enhanced by artificial intelligence"
            }
          }
        });
        break;

      case 'activity':
        baseSchema["@graph"].push({
          "@type": "Product",
          "@id": `https://www.trebound.com/team-building-activity/${data.slug}#product`,
          "name": data.name,
          "description": data.description || data.tagline,
          "image": data.image || data.activity_image,
          "brand": {
            "@type": "Brand",
            "name": "Trebound"
          },
          "category": "Team Building Activity",
          "additionalType": "https://schema.org/Service",
          "serviceType": data.activity_type || "Team Building",
          "provider": {
            "@id": "https://www.trebound.com/#organization"
          },
          "audience": {
            "@type": "BusinessAudience",
            "audienceType": "Corporate Teams",
            "geographicArea": {
              "@type": "Country",
              "name": "India"
            }
          },
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "price": data.price || "Contact for pricing",
            "priceCurrency": "INR"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "150",
            "bestRating": "5",
            "worstRating": "1"
          },
          "keywords": data.keywords || `${data.name}, team building, corporate activities`,
          "duration": data.duration || "2-3 hours",
          "participants": data.group_size || "10-50 people"
        });
        break;

      case 'venue':
        const venueSchema: any = {
          "@type": ["Place", "TouristAttraction"],
          "@id": `https://www.trebound.com/stays/${data.slug}#place`,
          "name": data.name,
          "description": data.stay_description || data.tagline,
          "image": data.stay_image,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": data.location,
            "addressCountry": "IN"
          },
          "starRating": {
            "@type": "Rating",
            "ratingValue": data.rating || "4.5"
          },
          "priceRange": data.price_range || "₹₹",
          "servesCuisine": data.cuisine || "Multi-cuisine",
          "maximumAttendeeCapacity": data.capacity || 100,
          "isAccessibleForFree": false,
          "publicAccess": true
        };

        if (data.coordinates) {
          venueSchema.geo = {
            "@type": "GeoCoordinates",
            "latitude": data.coordinates.lat,
            "longitude": data.coordinates.lng
          };
        }

        if (data.facilities) {
          venueSchema.amenityFeature = data.facilities.split(',').map((facility: string) => ({
            "@type": "LocationFeatureSpecification",
            "name": facility.trim(),
            "value": true
          }));
        }

        baseSchema["@graph"].push(venueSchema);
        break;

      case 'article':
        baseSchema["@graph"].push({
          "@type": "Article",
          "@id": `https://www.trebound.com/blog/${data.slug}#article`,
          "headline": data.name,
          "description": data.small_description,
          "image": data.main_image,
          "datePublished": data.published_on,
          "dateModified": data.updated_at || data.published_on,
          "author": {
            "@type": "Person",
            "name": data.author || "Trebound Team",
            "url": "https://www.trebound.com/about"
          },
          "publisher": {
            "@id": "https://www.trebound.com/#organization"
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.trebound.com/blog/${data.slug}`
          },
          "articleSection": "Team Building",
          "keywords": data.blog_post_tags || "team building, corporate events",
          "wordCount": data.word_count || 1000,
          "inLanguage": "en-US",
          "about": {
            "@type": "Thing",
            "name": "Team Building",
            "description": "Corporate team building activities and strategies"
          }
        });
        break;

      case 'faq':
        baseSchema["@graph"].push({
          "@type": "FAQPage",
          "@id": `${data.url}#faq`,
          "mainEntity": data.faqs.map((faq: any, index: number) => ({
            "@type": "Question",
            "@id": `${data.url}#faq-${index}`,
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        });
        break;

      case 'homepage':
        // Add both WebSite and WebPage schemas for better AI understanding
        baseSchema["@graph"].push({
          "@type": "WebSite",
          "@id": "https://www.trebound.com/#website",
          "url": "https://www.trebound.com",
          "name": "Trebound - AI-Powered Team Building Solutions",
          "description": "Transform your team with AI-powered team building activities, corporate events, and professional development programs.",
          "inLanguage": "en-US",
          "datePublished": "2018-01-01T00:00:00+00:00",
          "dateModified": new Date().toISOString(),
          "publisher": {
            "@id": "https://www.trebound.com/#organization"
          },
          "potentialAction": [
            {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.trebound.com/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            },
            {
              "@type": "InteractAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.trebound.com/ai-chat",
                "actionPlatform": [
                  "http://schema.org/DesktopWebPlatform",
                  "http://schema.org/MobileWebPlatform"
                ]
              },
              "object": {
                "@type": "SoftwareApplication",
                "name": "AI Chatbot",
                "description": "Get instant recommendations for team building activities"
              }
            },
            {
              "@type": "ConsumeAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.trebound.com/voice-search",
                "actionPlatform": [
                  "http://schema.org/DesktopWebPlatform",
                  "http://schema.org/MobileWebPlatform"
                ]
              },
              "object": {
                "@type": "SoftwareApplication",
                "name": "Voice Search",
                "description": "Search for team building activities using your voice"
              }
            }
          ],
          "mainEntity": {
            "@type": "ItemList",
            "name": "Team Building Services",
            "description": "Comprehensive list of AI-powered team building solutions",
            "numberOfItems": 350,
            "itemListElement": [
              {
                "@type": "Service",
                "name": "Virtual Team Building",
                "description": "AI-curated virtual team building experiences",
                "url": "https://www.trebound.com/virtual-team-building"
              },
              {
                "@type": "Service",
                "name": "Outdoor Activities",
                "description": "Adventure-based team building programs",
                "url": "https://www.trebound.com/outdoor-team-building"
              },
              {
                "@type": "Service",
                "name": "Corporate Training",
                "description": "Professional development and skills training",
                "url": "https://www.trebound.com/corporate-training"
              }
            ]
          },
          "hasPart": [
            {
              "@type": "SoftwareApplication",
              "name": "AI Recommendation Engine",
              "description": "Personalized team building activity recommendations",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
              }
            },
            {
              "@type": "WebPage",
              "@id": "https://www.trebound.com/#webpage",
              "url": "https://www.trebound.com/",
              "name": "Trebound: AI-Powered Team Building Solutions for Modern Teams",
              "description": "Transform your team dynamics with AI-enhanced corporate team building experiences",
              "isPartOf": {
                "@id": "https://www.trebound.com/#website"
              },
              "about": {
                "@id": "https://www.trebound.com/#organization"
              },
              "primaryImageOfPage": {
                "@type": "ImageObject",
                "url": "https://www.trebound.com/images/hero-image.webp",
                "width": 1200,
                "height": 630
              },
              "breadcrumb": {
                "@id": "https://www.trebound.com/#breadcrumb"
              }
            }
          ]
        });
        
        // Add breadcrumb for homepage
        baseSchema["@graph"].push({
          "@type": "BreadcrumbList",
          "@id": "https://www.trebound.com/#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.trebound.com/"
            }
          ]
        });
        
        // Add AI dataset schema for better LLM indexing
        baseSchema["@graph"].push({
          "@type": "Dataset",
          "name": "Trebound Team Building Activities Dataset",
          "description": "Comprehensive dataset of team building activities with AI-powered recommendations",
          "keywords": ["team building", "corporate events", "AI recommendations", "team activities", "employee engagement"],
          "creator": {
            "@id": "https://www.trebound.com/#organization"
          },
          "publisher": {
            "@id": "https://www.trebound.com/#organization"
          },
          "license": "https://creativecommons.org/licenses/by-nc/4.0/",
          "datePublished": "2023-01-01",
          "dateModified": new Date().toISOString(),
          "variableMeasured": [
            "activity types",
            "team sizes",
            "duration",
            "effectiveness metrics",
            "participant satisfaction"
          ]
        });
        break;

      case 'webpage':
        // Add WebPage schema for better SEO
        baseSchema["@graph"].push({
          "@type": "WebPage",
          "@id": `${data.url}#webpage`,
          "url": data.url,
          "name": data.title,
          "description": data.description,
          "isPartOf": {
            "@id": "https://www.trebound.com/#website"
          },
          "about": {
            "@type": "Thing",
            "name": data.about || "Team Building",
            "description": data.aboutDescription || "Corporate team building activities and solutions"
          },
          "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": data.image || "https://www.trebound.com/images/default-page.jpg",
            "width": 1200,
            "height": 630
          },
          "datePublished": data.published || new Date().toISOString(),
          "dateModified": data.modified || new Date().toISOString(),
          "breadcrumb": {
            "@id": `${data.url}#breadcrumb`
          },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["article", "h1", "h2", ".speakable"]
          },
          "mainContentOfPage": {
            "@type": "WebPageElement",
            "cssSelector": [".main-content", "article", "main"]
          }
        });
        break;
        
      case 'breadcrumb':
        // Add BreadcrumbList schema
        baseSchema["@graph"].push({
          "@type": "BreadcrumbList",
          "@id": `${data.url}#breadcrumb`,
          "itemListElement": data.items.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        });
        break;
        
      case 'dataset':
        // Add Dataset schema for AI indexing
        baseSchema["@graph"].push({
          "@type": "Dataset",
          "name": data.name,
          "description": data.description,
          "keywords": data.keywords,
          "url": data.url,
          "creator": {
            "@id": "https://www.trebound.com/#organization"
          },
          "publisher": {
            "@id": "https://www.trebound.com/#organization"
          },
          "license": data.license || "https://creativecommons.org/licenses/by-nc/4.0/",
          "datePublished": data.published,
          "dateModified": data.modified || new Date().toISOString(),
          "variableMeasured": data.variables || []
        });
        break;
        
      case 'ai-service':
        // Add schema for AI services (custom schema for better LLM indexing)
        baseSchema["@graph"].push({
          "@type": ["Service", "SoftwareApplication"],
          "name": data.name,
          "description": data.description,
          "applicationCategory": "AIService",
          "offers": {
            "@type": "Offer",
            "price": data.price || "0",
            "priceCurrency": data.currency || "INR"
          },
          "provider": {
            "@id": "https://www.trebound.com/#organization"
          },
          "serviceOutput": {
            "@type": "Thing",
            "name": data.outputName || "AI Recommendations",
            "description": data.outputDescription || "Personalized team building recommendations"
          },
          "potentialAction": {
            "@type": "UseAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": data.url,
              "actionPlatform": [
                "http://schema.org/DesktopWebPlatform",
                "http://schema.org/MobileWebPlatform"
              ]
            }
          }
        });
        break;
        
      default:
        return null;
    }

    return baseSchema;
  };

  const schema = generateSchema();
  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema, null, 2)}
      </script>
    </Helmet>
  );
};

export default SchemaMarkup; 