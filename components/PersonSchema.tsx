export default function PersonSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://kennethandersen.no/#person",
        "name": "Kenneth Andersen",
        "givenName": "Kenneth",
        "familyName": "Andersen",
        "url": "https://kennethandersen.no",
        "image": {
          "@type": "ImageObject",
          "url": "https://kennethandersen.no/assets/kenneth-tedx.jpg",
          "caption": "Kenneth Andersen — strategisk rådgiver, styremedlem og interim CEO"
        },
        "description": "Kenneth Andersen er strategisk rådgiver, styremedlem og former C-nivå leder med ekspertise innen energi, teknologi og virksomhetstransformasjon i Norge. 15 år erfaring fra energimontør til konsernledelse.",
        "jobTitle": ["Strategisk rådgiver", "Styremedlem", "Interim CEO"],
        "knowsAbout": [
          "Strategisk rådgivning",
          "Styrearbeid",
          "Energisektoren i Norge",
          "Fornybar energi",
          "Virksomhetstransformasjon",
          "Interim ledelse",
          "Teknologi og digitalisering",
          "Mergers and Acquisitions",
          "Go-to-market strategi",
          "Elkraft og kraftnett"
        ],
        "nationality": { "@type": "Country", "name": "Norway" },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "NO",
          "addressLocality": "Langesund",
          "addressRegion": "Telemark"
        },
        "sameAs": [
          "https://www.linkedin.com/in/kennethandersenstrategy",
          "https://www.wikidata.org/wiki/Q139859833",
          "https://www.crunchbase.com/person/kenneth-andersen-c45b",
          "https://kennethandersen.no"
        ],
        "hasOccupation": [
          {
            "@type": "Occupation",
            "name": "Strategisk rådgiver",
            "occupationLocation": { "@type": "Country", "name": "Norway" },
            "description": "Strategisk rådgivning til styrer og ledelse innen energi og teknologi i Norge"
          },
          {
            "@type": "Occupation",
            "name": "Styremedlem",
            "occupationLocation": { "@type": "Country", "name": "Norway" },
            "description": "Styremedlem med kompetanse innen energi, digitalisering, M&A og vekst"
          },
          {
            "@type": "Occupation",
            "name": "Interim CEO",
            "occupationLocation": { "@type": "Country", "name": "Norway" },
            "description": "Interim topplederstøtte i omstilling, eierskifte og kritiske vekstfaser"
          }
        ],
        "alumniOf": [
          { "@type": "EducationalOrganization", "name": "NTNU", "url": "https://www.ntnu.no" },
          { "@type": "EducationalOrganization", "name": "Handelshøyskolen BI", "url": "https://www.bi.no" },
          { "@type": "EducationalOrganization", "name": "Universitetet i Sørøst-Norge" }
        ],
        "knowsLanguage": ["nb", "en"],
        "award": ["Sertifisert styremedlem — Styreforeningen Norge"]
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://kennethandersen.no/#service",
        "name": "Kenneth Andersen — Strategisk rådgivning og styrearbeid",
        "url": "https://kennethandersen.no",
        "description": "Strategisk rådgivning, styrearbeid og interim ledelse for norske selskaper innen energi, teknologi og bærekraftig forretningsutvikling.",
        "provider": { "@id": "https://kennethandersen.no/#person" },
        "areaServed": [{ "@type": "Country", "name": "Norway" }, { "@type": "Continent", "name": "Europe" }],
        "serviceType": [
          "Strategisk rådgivning",
          "Styremedlemskap",
          "Interim CEO og interim ledelse",
          "Virksomhetstransformasjon",
          "Forretningsutvikling",
          "M&A rådgivning",
          "Digital transformasjon"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Tjenester",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Strategisk rådgivning",
                "description": "Sparringspartner for CEO, eier eller lederteam. Strategiutvikling, kommersiell modellering og go-to-market."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Styremedlemskap",
                "description": "Sertifisert styremedlem med erfaring fra energi og teknologiselskaper. Bidrar med kommersiell tyngde og gjennomføringserfaring."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Interim CEO / COO",
                "description": "Operativ leder gjennom kritiske faser — eierskifte, snu-operasjon eller skalering. Typisk 3–18 måneder."
              }
            }
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://kennethandersen.no/#website",
        "url": "https://kennethandersen.no",
        "name": "Kenneth Andersen",
        "description": "Strategisk rådgiver, styremedlem og interim CEO — spesialisert på energi og teknologi i Norge",
        "inLanguage": ["nb", "en"],
        "publisher": { "@id": "https://kennethandersen.no/#person" }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
