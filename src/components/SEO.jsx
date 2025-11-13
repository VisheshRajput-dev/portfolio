import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title = "Vishesh Rajput - Software Engineer | Full-Stack Developer Portfolio",
  description = "Vishesh Rajput - Software Engineer & Full-Stack Developer. Explore my portfolio showcasing innovative projects like RealDesk, DevSync, and Vishti Shop. Specialized in React, Node.js, TypeScript, and modern web technologies.",
  keywords = "Vishesh, Vishesh Rajput, Vishesh Rajput dev, Vishesh Rajput developer, Vishesh Rajput software engineer, Vishesh Rajput portfolio, Vishesh Rajput website, Vishesh Rajput GitHub, Vishesh Rajput LinkedIn, Vishesh Rajput Twitter, Vishesh Rajput X, Vishesh Rajput Instagram, Vishesh Rajput email, Vishesh Rajput photos, Vishesh Rajput images, full-stack developer, React developer, Node.js developer, TypeScript developer, web developer portfolio, software engineer portfolio, frontend developer, backend developer, MERN stack developer",
  image = "/avatar.png",
  type = "website"
}) => {
  const location = useLocation();
  const baseUrl = "https://visheshrajputdev-portfolio.vercel.app";
  const url = `${baseUrl}${location.pathname}`;

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

    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:image', `${baseUrl}${image}`, true);
    updateMetaTag('og:type', type, true);

    // Update Twitter tags
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:url', url, true);
    updateMetaTag('twitter:image', `${baseUrl}${image}`, true);
    updateMetaTag('twitter:creator', '@vishesh_ra3046', true);
    updateMetaTag('twitter:site', '@vishesh_ra3046', true);
    
    // Update Open Graph image dimensions
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '1200', true);
    updateMetaTag('og:image:type', 'image/png', true);
    updateMetaTag('og:image:alt', 'Vishesh Rajput - Software Engineer & Full-Stack Developer', true);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

  }, [title, description, keywords, image, type, url]);

  return null;
};

export default SEO;

