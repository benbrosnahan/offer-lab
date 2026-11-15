import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://offer-lab-ivory.vercel.app/",
      lastModified: new Date("2026-11-15"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
