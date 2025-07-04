import React from 'react';

interface SemanticStructureProps {
  type: 'article' | 'product' | 'service' | 'faq' | 'howto' | 'review';
  title: string;
  children: React.ReactNode;
  description?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  keywords?: string[];
  className?: string;
}

/**
 * SemanticStructure - A component to enhance content with semantic HTML5 elements
 * for better SEO and LLM discovery. This component wraps content in appropriate
 * semantic tags based on the content type.
 */
const SemanticStructure: React.FC<SemanticStructureProps> = ({
  type,
  title,
  children,
  description,
  author,
  datePublished,
  dateModified,
  image,
  keywords,
  className = '',
}) => {
  // Generate data attributes for AI/LLM understanding
  const dataAttributes = {
    'data-ai-content-type': type,
    'data-ai-title': title,
    ...(description && { 'data-ai-description': description }),
    ...(author && { 'data-ai-author': author }),
    ...(datePublished && { 'data-ai-published': datePublished }),
    ...(dateModified && { 'data-ai-modified': dateModified }),
    ...(keywords?.length && { 'data-ai-keywords': keywords.join(',') }),
  };

  // Render different semantic structures based on type
  switch (type) {
    case 'article':
      return (
        <article className={className} {...dataAttributes}>
          <header>
            <h1 className="article-title">{title}</h1>
            {description && <p className="article-description">{description}</p>}
            <div className="article-meta">
              {author && <span className="article-author">By {author}</span>}
              {datePublished && (
                <time dateTime={datePublished} className="article-date">
                  Published: {new Date(datePublished).toLocaleDateString()}
                </time>
              )}
              {dateModified && dateModified !== datePublished && (
                <time dateTime={dateModified} className="article-updated">
                  Updated: {new Date(dateModified).toLocaleDateString()}
                </time>
              )}
            </div>
            {image && (
              <figure className="article-featured-image">
                <img src={image} alt={title} />
              </figure>
            )}
          </header>
          <div className="article-content">{children}</div>
        </article>
      );

    case 'product':
      return (
        <section className={`product ${className}`} {...dataAttributes}>
          <h1 className="product-title">{title}</h1>
          {description && <p className="product-description">{description}</p>}
          {image && (
            <figure className="product-image">
              <img src={image} alt={title} />
            </figure>
          )}
          <div className="product-details">{children}</div>
        </section>
      );

    case 'service':
      return (
        <section className={`service ${className}`} {...dataAttributes}>
          <h1 className="service-title">{title}</h1>
          {description && <p className="service-description">{description}</p>}
          {image && (
            <figure className="service-image">
              <img src={image} alt={title} />
            </figure>
          )}
          <div className="service-details">{children}</div>
        </section>
      );

    case 'faq':
      return (
        <section className={`faq ${className}`} {...dataAttributes} role="complementary">
          <h2 className="faq-title">{title}</h2>
          {description && <p className="faq-description">{description}</p>}
          <div className="faq-content">
            {children}
          </div>
        </section>
      );

    case 'howto':
      return (
        <section className={`how-to ${className}`} {...dataAttributes} role="main">
          <h2 className="how-to-title">{title}</h2>
          {description && <p className="how-to-description">{description}</p>}
          {image && (
            <figure className="how-to-image">
              <img src={image} alt={title} />
            </figure>
          )}
          <div className="how-to-steps">{children}</div>
        </section>
      );

    case 'review':
      return (
        <section className={`review ${className}`} {...dataAttributes} role="complementary">
          <h3 className="review-title">{title}</h3>
          {author && <p className="review-author">By {author}</p>}
          {datePublished && (
            <time dateTime={datePublished} className="review-date">
              {new Date(datePublished).toLocaleDateString()}
            </time>
          )}
          <div className="review-content">{children}</div>
        </section>
      );

    default:
      return (
        <div className={className} {...dataAttributes}>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
          {children}
        </div>
      );
  }
};

export default SemanticStructure;