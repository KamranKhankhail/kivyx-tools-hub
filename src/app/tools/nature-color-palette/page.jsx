import {
  breadcrumbsNatureColorPalette,
  faqSchemasNatureColorPalette,
  speakableAEONatureColorPalette,
} from "@/app/toolshubSEO"; // Adjust path if needed
import NatureColorPaletteClient from "@/app/tools/nature-color-palette/_components/NatureColorPaletteClient";
import { Suspense } from "react";
import Head from "next/head";
const TOOLSHUB_BASE_URL = "https://www.toolshub.kivyx.com";
const KIVYX_MAIN_URL = "https://www.kivyx.com";
const KIVYX_FAVICON_URL = "https://www.kivyx.com/favicon.ico";
export const metadata = {
  title: "Nature Color Palette Generator | Discover Beautiful Color Schemes",
  description:
    "Generate stunning color palettes inspired by nature with ToolsHub's free online tool. Find harmonious color combinations for your design projects, complete with hex and RGB codes.",
  keywords: [
    "nature color palette",
    "color palette generator",
    "design colors",
    "hex codes",
    "RGB colors",
    "free color tool",
    "online color picker",
    "color combinations",
    "web design colors",
    "graphic design palette",
    "kivyx color palette",
  ],
  openGraph: {
    title: "Nature Color Palette Generator | Design with Natural Colors",
    description:
      "Explore and create beautiful, natural color palettes for any design project. Get instant hex and RGB values from ToolsHub's easy-to-use online tool.",
    url: `${TOOLSHUB_BASE_URL}/tools/nature-color-palette`,
    siteName: "Toolshub | Kivyx Technologies",
    images: [
      {
        url: `${TOOLSHUB_BASE_URL}/images/nature-color-palette-banner.png`, // TODO: Replace with a specific banner for Nature Color Palette
        width: 1200,
        height: 630,
        alt: "Nature Inspired Color Palette Generator",
      },
    ],
    type: "website",
  },
};

export default function page() {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Nature Color Palette Generator",
              description:
                "Discover and generate harmonious color palettes inspired by the beauty of nature, complete with hex and RGB color codes for designers.",
              url: `${TOOLSHUB_BASE_URL}/tools/nature-color-palette`,
              publisher: {
                "@type": "Organization",
                name: "Kivyx Technologies",
                url: KIVYX_MAIN_URL,
                logo: {
                  "@type": "ImageObject",
                  url: KIVYX_FAVICON_URL,
                },
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `${TOOLSHUB_BASE_URL}/tools/nature-color-palette`,
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbsNatureColorPalette),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchemasNatureColorPalette),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(speakableAEONatureColorPalette),
          }}
        />
      </Head>
      <Suspense>
        <NatureColorPaletteClient />
      </Suspense>
    </>
  );
}
