import {
  breadcrumbsUnitConverter,
  faqSchemasUnitConverter,
  speakableAEOUnitConverter,
} from "@/app/toolshubSEO"; // Adjust path if needed
import UniversalUnitConverterClient from "./_components/UniversalUnitConverterClient";
import Head from "next/head";
const TOOLSHUB_BASE_URL = "https://www.toolshub.kivyx.com";
const KIVYX_MAIN_URL = "https://www.kivyx.com";
const KIVYX_FAVICON_URL = "https://www.kivyx.com/favicon.ico";
export const metadata = {
  title: "Universal Unit Converter Online | Length, Weight, Temp, Currency",
  description:
    "Convert units instantly with ToolsHub's free online Universal Unit Converter. Easily convert length, weight, temperature, currency, volume, and many more. Perfect for students, professionals, and everyday use.",
  keywords: [
    "unit converter",
    "universal converter",
    "online unit converter",
    "length converter",
    "weight converter",
    "temperature converter",
    "currency converter",
    "volume converter",
    "measurement converter",
    "free unit tool",
    "kivyx unit converter",
  ],
  openGraph: {
    title: "Universal Unit Converter Online | Convert Any Measurement",
    description:
      "Access a free and comprehensive online unit converter for length, weight, temperature, currency, and more. ToolsHub makes converting measurements simple and accurate.",
    url: `${TOOLSHUB_BASE_URL}/tools/universal-unit-converter`,
    siteName: "Toolshub | Kivyx Technologies",
    images: [
      {
        url: `${TOOLSHUB_BASE_URL}/images/unit-converter-banner.png`, // TODO: Replace with a specific banner for Unit Converter
        width: 1200,
        height: 630,
        alt: "Online Universal Unit Converter Tool",
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
              name: "Universal Unit Converter",
              description:
                "Convert various units of measurement online, including length, weight, temperature, and currency, with ToolsHub's accurate and free unit converter.",
              url: `${TOOLSHUB_BASE_URL}/tools/universal-unit-converter`,
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
                "@id": `${TOOLSHUB_BASE_URL}/tools/universal-unit-converter`,
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbsUnitConverter),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchemasUnitConverter),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(speakableAEOUnitConverter),
          }}
        />
      </Head>
      <UniversalUnitConverterClient />
    </>
  );
}
