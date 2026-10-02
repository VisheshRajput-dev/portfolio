import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BASE } from '../seo/site.mjs';

const SEO = ({ 
  title = "Vishesh Rajput · Founding Engineer at PointsFly",
  description = "Vishesh Rajput is a Founding Engineer at PointsFly, building PointsFly and AIRA across web, mobile, rewards intelligence, and modern full-stack systems with Next.js, Node.js, Express.js, MongoDB, AWS, and Clerk.",
  keywords = "Vishesh Rajput, Vishesh Rajput developer, Vishesh Rajput portfolio, Vishesh Rajput software engineer, Founding Engineer, Founding Engineer PointsFly, PointsFly, PointsFly developer, PointsFly founding engineer, AIRA, AIRA AI rewards agent, AI rewards platform, fin travel platform, credit card points, credit card rewards, travel rewards, reward redemption, Next.js developer, Node.js developer, Express.js developer, MongoDB developer, AWS developer, Clerk authentication, full-stack developer India, software engineer Noida",
  image = "/og.jpg",
  type = "website",
  structuredData = null
}) => {
  const location = useLocation();
  const url = `${BASE}${location.pathname === "/" ? "/" : location.pathname.replace(/\/$/, "")}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update primary meta tags
    updateMetaTag('title', title);
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Update primary relationship tags
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('author', 'Vishesh Rajput');

    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'Vishesh Rajput', true);
    updateMetaTag('og:locale', 'en_IN', true);

    // Update Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:url', url);
    updateMetaTag('twitter:creator', '@vishesh_ra3046');
    updateMetaTag('twitter:site', '@vishesh_ra3046');
    
    // Keep social previews brand-led instead of using a personal photo
    const absoluteImage = image ? `${BASE}${image}` : '';
    if (absoluteImage) {
      updateMetaTag('og:image', absoluteImage, true);
      updateMetaTag('og:image:secure_url', absoluteImage, true);
      updateMetaTag('og:image:alt', title, true);
      updateMetaTag('twitter:image', absoluteImage);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    let structuredDataScript = document.querySelector('script[data-seo-structured-data="true"]');
    if (structuredData) {
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script');
        structuredDataScript.setAttribute('type', 'application/ld+json');
        structuredDataScript.setAttribute('data-seo-structured-data', 'true');
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(structuredData);
    } else if (structuredDataScript) {
      structuredDataScript.remove();
    }

    return () => {
      const currentStructuredDataScript = document.querySelector('script[data-seo-structured-data="true"]');
      if (currentStructuredDataScript && !structuredData) {
        currentStructuredDataScript.remove();
      }
    };
  }, [title, description, keywords, image, type, url, structuredData]);

  return null;
};

export default SEO;
