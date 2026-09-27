import { useEffect } from "react";
import { useSeo } from "../hooks/usePortfolio.js";

function setMeta(attr, key, value) {
  if (!value) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

// Open Graph / Twitter require absolute URLs; the admin stores paths like
// "/Souad.jpg", so resolve them against the canonical URL (or current origin).
function absolute(url, base) {
  if (!url) return "";
  try {
    return new URL(url, base || window.location.origin).href;
  } catch {
    return url;
  }
}

export default function SeoUpdater() {
  const { data: seo } = useSeo();

  useEffect(() => {
    if (!seo) return;
    const pageUrl = seo.canonicalUrl || `${window.location.origin}${window.location.pathname}`;
    const image = absolute(seo.ogImage, seo.canonicalUrl);

    if (seo.title) document.title = seo.title;
    setMeta("name", "description", seo.description);
    setMeta("name", "keywords", seo.keywords);
    setMeta("name", "author", seo.author);
    setMeta("property", "og:title", seo.title);
    setMeta("property", "og:description", seo.description);
    setMeta("property", "og:image", image);
    setMeta("property", "og:url", pageUrl);
    setMeta("property", "og:type", "website");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", seo.title);
    setMeta("name", "twitter:description", seo.description);
    setMeta("name", "twitter:image", image);
    if (seo.canonicalUrl) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", seo.canonicalUrl);
    }
  }, [seo]);

  return null;
}
