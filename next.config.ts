import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // The apex is canonical. Anyone who types www gets a permanent redirect
  // rather than a second indexable copy of the site.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.daveta.tech" }],
        destination: "https://daveta.tech/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
