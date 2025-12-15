import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  courseSchema?: {
    name: string;
    description: string;
    provider?: string;
    educationalLevel?: string;
  };
}

const SEO = ({ 
  title = "Drona - Interactive Computer Science Visualization Platform",
  description = "Master computer science concepts through interactive visualizations. Learn data structures, algorithms, CPU scheduling, memory management, and AI algorithms with hands-on simulations.",
  keywords = "computer science visualization, algorithm visualizer, data structure visualizer, learn algorithms, interactive CS education",
  image = "https://drona.ikshvaku-innovations.in/DronaLogo.png",
  type = "website",
  breadcrumbs,
  courseSchema
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
      const structuredData: any = {
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

      // Add breadcrumb structured data if provided
      if (breadcrumbs && breadcrumbs.length > 0) {
        structuredData.breadcrumb = {
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": crumb.url
          }))
        };
      }

      // Add Course schema if provided
      if (courseSchema) {
        const courseData = {
          "@context": "https://schema.org",
          "@type": "Course",
          "name": courseSchema.name,
          "description": courseSchema.description,
          "provider": {
            "@type": "Organization",
            "name": courseSchema.provider || "Drona",
            "url": baseUrl
          },
          "educationalLevel": courseSchema.educationalLevel || "All Levels",
          "learningResourceType": "Interactive Visualization",
          "url": currentUrl,
          "inLanguage": "en-US"
        };

        const courseScript = document.createElement('script');
        courseScript.type = 'application/ld+json';
        courseScript.id = 'course-ld';
        courseScript.textContent = JSON.stringify(courseData);
        document.head.appendChild(courseScript);
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'page-specific-ld';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    };

    addStructuredData();
  }, [title, description, keywords, image, type, currentUrl, breadcrumbs, courseSchema]);

  return null;
};

export default SEO;

