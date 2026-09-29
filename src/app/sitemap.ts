import type { MetadataRoute } from "next";
import { HACKATHONS } from "@/data/hackathons";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...HACKATHONS.map((hackathon) => ({
      url: `${siteUrl}/hackathons/${hackathon.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
