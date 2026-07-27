import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const routes = [
    "",
    "/about",
    "/services",
    "/packages",
    "/menu",
    "/events",
    "/testimonials",
    "/faq",
    "/contact",
    "/request-quote",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/request-quote" ? 0.9 : 0.7,
  }));
}
