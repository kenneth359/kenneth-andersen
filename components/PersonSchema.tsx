/* Strukturerte data for søkemotorer og AI-assistenter.
   Samme regler som resten av siden: kun dokumenterte, offentlige fakta. */
export default function PersonSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://kennethandersen.no/#person",
        name: "Kenneth Andersen",
        givenName: "Kenneth",
        familyName: "Andersen",
        url: "https://kennethandersen.no",
        image: {
          "@type": "ImageObject",
          url: "https://kennethandersen.no/assets/kenneth-studio.jpg",
          caption: "Kenneth Andersen",
        },
        description:
          "Kenneth Andersen er kommersiell leder, selskapsbygger og styremedlem i energi og teknologi, med erfaring fra både etablerte konsern og nye selskaper. Han bygde Skagerak Mobil Energi fra pilot i 2021 til eget selskap i kommersiell drift, og har tidligere vært daglig leder i Otera Ratel og direktør for marked og forretningsutvikling i OneCo. Bakgrunn fra fagbrev som energimontør, bachelor i elkraft og master i strategi og innovasjon fra NTNU.",
        jobTitle: "Senior forretningsutvikler elektrifisering Norden",
        worksFor: { "@type": "Organization", name: "Skagerak Energi AS", url: "https://www.skagerakenergi.no" },
        knowsAbout: [
          "Corporate venture building",
          "Forretningsutvikling",
          "Elektrifisering",
          "Batterilagring og lading",
          "Depotlading for tungtransport",
          "Elkraft og kraftnett",
          "Investeringscase og beslutningsgrunnlag",
          "Go-to-market",
          "Styrearbeid",
          "Praktisk bruk av kunstig intelligens i ledelse",
        ],
        nationality: { "@type": "Country", name: "Norway" },
        address: {
          "@type": "PostalAddress",
          addressCountry: "NO",
          addressLocality: "Langesund",
          addressRegion: "Telemark",
        },
        sameAs: [
          "https://www.linkedin.com/in/kennethandersenstrategy",
          "https://www.wikidata.org/wiki/Q139859833",
          "https://www.crunchbase.com/person/kenneth-andersen-c45b",
        ],
        hasOccupation: [
          {
            "@type": "Occupation",
            name: "Senior forretningsutvikler elektrifisering Norden",
            occupationLocation: { "@type": "Country", name: "Norway" },
            description: "Utvikler og kommersialiserer nye forretningsområder innen elektrifisering, mobil energi og depotlading i Skagerak Energi.",
          },
          {
            "@type": "Occupation",
            name: "Styremedlem",
            occupationLocation: { "@type": "Country", name: "Norway" },
            description: "Sertifisert styremedlem med erfaring fra strategi, vekst og kapitalbeslutninger i energi og teknologi.",
          },
        ],
        alumniOf: [
          { "@type": "CollegeOrUniversity", name: "NTNU", url: "https://www.ntnu.no" },
          { "@type": "CollegeOrUniversity", name: "Handelshøyskolen BI", url: "https://www.bi.no" },
          { "@type": "CollegeOrUniversity", name: "Universitetet i Sørøst-Norge", url: "https://www.usn.no" },
        ],
        hasCredential: [
          { "@type": "EducationalOccupationalCredential", name: "Master i økonomi og ledelse, strategi og innovasjon", recognizedBy: { "@type": "CollegeOrUniversity", name: "NTNU" } },
          { "@type": "EducationalOccupationalCredential", name: "Bachelor i elkraftteknikk", recognizedBy: { "@type": "CollegeOrUniversity", name: "Universitetet i Sørøst-Norge" } },
          { "@type": "EducationalOccupationalCredential", name: "Fagbrev energimontør" },
          { "@type": "EducationalOccupationalCredential", name: "Sertifisert styremedlem", recognizedBy: { "@type": "Organization", name: "Styreforeningen" } },
        ],
        knowsLanguage: ["nb", "en"],
      },
      {
        "@type": "ProfilePage",
        "@id": "https://kennethandersen.no/#profile",
        url: "https://kennethandersen.no",
        name: "Kenneth Andersen",
        mainEntity: { "@id": "https://kennethandersen.no/#person" },
        inLanguage: ["nb", "en"],
      },
      {
        "@type": "WebSite",
        "@id": "https://kennethandersen.no/#website",
        url: "https://kennethandersen.no",
        name: "Kenneth Andersen",
        description: "Kommersiell leder, selskapsbygger og styremedlem i energi og teknologi.",
        inLanguage: ["nb", "en"],
        publisher: { "@id": "https://kennethandersen.no/#person" },
      },
    ],
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
