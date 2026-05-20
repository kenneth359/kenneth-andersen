import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect Vercel subdomain to canonical .no domain
      {
        source: "/:path*",
        has: [{ type: "host", value: "kenneth-andersen.vercel.app" }],
        destination: "https://kennethandersen.no/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
