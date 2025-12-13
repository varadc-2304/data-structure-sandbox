import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
}

const SEO = ({ 
  title = "Drona - Interactive Computer Science Visualization Platform",
  description = "Master computer science concepts through interactive visualizations. Learn data structures, algorithms, CPU scheduling, memory management, and AI algorithms with hands-on simulations.",
  keywords = "computer science visualization, algorithm visualizer, data structure visualizer, learn algorithms, interactive CS education",
  image = "https://drona.ikshvaku-innovations.in/og-image.png",
  type = "website"
}: SEOProps) => {
  const location = useLocation();
  const baseUrl = "https://drona.ikshvaku-innovations.in";
  const currentUrl = `${baseUrl}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Primary meta tags
    updateMetaTag('title', title);
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:type', type, true);

    // Twitter Card tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:card', 'summary_large_image');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Add structured data for current page
    const addStructuredData = () => {
      // Remove existing structured data
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
      existingScripts.forEach(script => {
        if (script.id === 'page-specific-ld') {
          script.remove();
        }
      });

      // Add page-specific structured data
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": title,
        "description": description,
        "url": currentUrl,
        "inLanguage": "en-US",
        "isPartOf": {
          "@type": "WebSite",
          "name": "Drona",
          "url": baseUrl
        },
        "about": {
          "@type": "Thing",
          "name": "Computer Science Education"
        },
        "educationalLevel": "All Levels",
        "learningResourceType": "Interactive Visualization"
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'page-specific-ld';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    };

    addStructuredData();
  }, [title, description, keywords, image, type, currentUrl]);

  return null;
};

export default SEO;

