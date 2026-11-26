import type { Metadata } from "next";
import "./cv.css";

export const metadata: Metadata = {
  title: "CV | Kenneth Andersen",
  description:
    "Full CV for Kenneth Andersen: corporate venture builder og kommersiell leder i energi og teknologi. Skagerak Energi, OneCo, Otera Ratel, ABB Marine. Master NTNU.",
  alternates: { canonical: "https://kennethandersen.no/cv" },
  openGraph: {
    type: "profile",
    url: "https://kennethandersen.no/cv",
    title: "CV — Kenneth Andersen",
    description: "Corporate venture builder, kommersiell leder og styremedlem i energi og teknologi.",
    images: [{ url: "https://kennethandersen.no/assets/kenneth-studio.jpg", width: 1200, height: 800 }],
  },
};

export default function CvLayout({ children }: { children: React.ReactNode }) {
  return children;
}
