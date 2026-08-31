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

export default function SeoUpdater() {
  const { data: seo } = useSeo();

  useEffect(() => {
    if (!seo) return;
    if (seo.title) document.title = seo.title;
    setMeta("name", "description", seo.description);
    setMeta("name", "keywords", seo.keywords);
    setMeta("name", "author", seo.author);
    setMeta("property", "og:title", seo.title);
    setMeta("property", "og:description", seo.description);
    setMeta("property", "og:image", seo.ogImage);
    setMeta("property", "og:type", "website");
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
