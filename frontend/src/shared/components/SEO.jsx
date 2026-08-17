import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function SEO({ title, description, noindex = false, robots }) {
  const location = useLocation();

  useEffect(() => {
    // 1. Title
    const baseTitle = "DayTree — Brutalist Habit Tracker";
    document.title = title ? `${title} | DayTree` : baseTitle;

    // Helper to find or create a meta tag
    const setMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper to find or create a link tag
    const setLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // 2. Description
    const defaultDesc = "A minimal, brutalist habit tracker designed for high performers. Plan your day, track your consistency, and grow your personal tree of daily disciplines.";
    const activeDesc = description || defaultDesc;
    setMetaTag("name", "description", activeDesc);

    // 3. Robots
    let robotsValue = "index, follow";
    if (robots) {
      robotsValue = robots;
    } else if (noindex) {
      robotsValue = "noindex, nofollow";
    }
    setMetaTag("name", "robots", robotsValue);

    // 4. Canonical URL
    const baseUrl = "https://daytree.paanipoorie.com";
    const canonicalUrl = `${baseUrl}${location.pathname}`;
    setLinkTag("canonical", canonicalUrl);

    // 5. Open Graph
    setMetaTag("property", "og:title", title ? `${title} | DayTree` : baseTitle);
    setMetaTag("property", "og:description", activeDesc);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:image", `${baseUrl}/auth-tree.webp`);

    // 6. Twitter
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title ? `${title} | DayTree` : baseTitle);
    setMetaTag("name", "twitter:description", activeDesc);
    setMetaTag("name", "twitter:image", `${baseUrl}/auth-tree.webp`);
  }, [title, description, noindex, robots, location.pathname]);

  return null;
}

export default SEO;
