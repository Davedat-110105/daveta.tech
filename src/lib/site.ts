import { links } from "@/data/content";

/**
 * Absolute base URL for canonical, sitemap, and Open Graph tags.
 *
 * The apex domain is the canonical host. NEXT_PUBLIC_SITE_URL overrides it so
 * preview deployments can point at themselves without a code change.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://daveta.tech"
).replace(/\/$/, "");

export const site = {
  name: "Dave Ta",
  legalName: "Ta Tan Dat",
  role: "Software Engineer",
  locality: "Toronto",
  region: "ON",
  country: "CA",
  description:
    "Software engineer in Toronto building web products, AI tools, and the systems that keep them working.",
} as const;

/**
 * Person and WebSite graph. Every value here is stated elsewhere on the page;
 * nothing is asserted that the site itself does not show.
 */
export function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: site.name,
        alternateName: site.legalName,
        url: siteUrl,
        email: `mailto:${links.email}`,
        jobTitle: site.role,
        description: site.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: site.locality,
          addressRegion: site.region,
          addressCountry: site.country,
        },
        affiliation: {
          "@type": "EducationalOrganization",
          name: "Seneca Polytechnic",
          url: "https://www.senecapolytechnic.ca",
        },
        knowsAbout: [
          "Full-stack web development",
          "Next.js",
          "TypeScript",
          "PostgreSQL",
          "Docker",
          "Proxmox",
          "Self-hosted infrastructure",
          "Model Context Protocol",
          "Retrieval-augmented generation",
          "Telemetry ingestion",
        ],
        sameAs: [links.github, links.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: `${site.name}, ${site.role.toLowerCase()}`,
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: `${site.name}, ${site.role.toLowerCase()}`,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#person` },
        inLanguage: "en",
      },
    ],
  };
}
