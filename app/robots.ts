import { MetadataRoute } from "next";

/* Personlig profilside: målet er å bli funnet og sitert, både i vanlige
   søk, Google AI Overviews og AI-assistenter. Derfor slipper vi inn alle
   seriøse søke- og AI-roboter, også de som bygger opp kunnskapen i
   språkmodellene. Bare rene SEO-skrapere holdes ute. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      { userAgent: "AhrefsBot", disallow: "/" },
      { userAgent: "SemrushBot", disallow: "/" },
      { userAgent: "Bytespider", disallow: "/" },
    ],
    sitemap: "https://kennethandersen.no/sitemap.xml",
    host: "https://kennethandersen.no",
  };
}
