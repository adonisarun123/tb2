import React from 'react';
import { Helmet } from 'react-helmet-async';

interface AIMetaTagsProps {
  title: string;
  description: string;
  keywords?: string[];
  type?: 'webpage' | 'article' | 'product' | 'service';
  url?: string;
  image?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  // AI-specific properties
  aiContentType?: string;
  aiPrimaryFunction?: string;
  aiFeatures?: string[];
  aiKnowledgeDomain?: string[];
  aiContentQuality?: string[];
  aiDatasetSource?: string;
  aiSearchTerms?: string[];
  aiUpdateFrequency?: string;
}

/**
 * AIMetaTags - A component that generates enhanced meta tags for AI and LLM indexing
 * 
 * This component creates meta tags that help large language models and AI crawlers
 * better understand your content, improving search results and content discovery.
 */
const AIMetaTags: React.FC<AIMetaTagsProps> = ({
  title,
  description,
  keywords = [],
  type = 'webpage',
  url,
  image,
  author,
  publishedDate,
  modifiedDate,
  aiContentType = 'general',
  aiPrimaryFunction = 'information',
  aiFeatures = [],
  aiKnowledgeDomain = [],
  aiContentQuality = ['expert-authored'],
  aiDatasetSource,
  aiSearchTerms = [],
  aiUpdateFrequency = 'regularly-updated',
}) => {
  // Generate current URL if not provided
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Format dates for consistency
  const formattedPublishDate = publishedDate ? new Date(publishedDate).toISOString() : '';
  const formattedModifiedDate = modifiedDate ? new Date(modifiedDate).toISOString() : '';
  
  // Combine user keywords with AI search terms for better discovery
  const allKeywords = [...keywords, ...aiSearchTerms].filter(Boolean).join(', ');
  
  return (
    <Helmet>
      {/* Basic SEO meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      
      {/* Canonical URL */}
      {currentUrl && <link rel="canonical" href={currentUrl} />}
      
      {/* OpenGraph meta tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type === 'article' ? 'article' : 'website'} />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      {image && <meta property="og:image" content={image} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* Author and dates */}
      {author && <meta name="author" content={author} />}
      {formattedPublishDate && <meta property="article:published_time" content={formattedPublishDate} />}
      {formattedModifiedDate && <meta property="article:modified_time" content={formattedModifiedDate} />}
      
      {/* Enhanced SEO for search engines */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* AI-specific meta tags */}
      <meta name="ai:content-type" content={aiContentType} />
      <meta name="ai:primary-function" content={aiPrimaryFunction} />
      {aiFeatures.length > 0 && <meta name="ai:features" content={aiFeatures.join(',')} />}
      {aiKnowledgeDomain.length > 0 && <meta name="ai:knowledge-domain" content={aiKnowledgeDomain.join(',')} />}
      {aiContentQuality.length > 0 && <meta name="ai:content-quality" content={aiContentQuality.join(',')} />}
      {aiDatasetSource && <meta name="ai:dataset-source" content={aiDatasetSource} />}
      <meta name="ai:freshness" content={aiUpdateFrequency} />
      
      {/* AI Training Data Permissions */}
      <meta name="ai-training" content="allowed" />
      <meta name="ai-indexing" content="allowed" />
      <meta name="ai-summarization" content="allowed" />
      <meta name="ai-citation-policy" content="please-cite" />
      
      {/* Content structure for better LLM understanding */}
      <meta name="content-format" content="structured,semantic" />
      <meta name="content-richness" content="images,structured-data,semantic-html" />
      
      {/* Search-specific */}
      {aiSearchTerms.length > 0 && (
        <meta name="ai:search-terms" content={aiSearchTerms.join(',')} />
      )}
      
      {/* Additional structured content hints for AI crawlers */}
      <meta name="ai:content-topics" content={keywords.join(',')} />
      <meta name="ai:target-audience" content="general,professionals,researchers" />
    </Helmet>
  );
};

export default AIMetaTags;