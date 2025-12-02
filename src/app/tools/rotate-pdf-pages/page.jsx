import {
  breadcrumbsRotatePdf,
  faqSchemasRotatePdf,
  speakableAEORotatePdf,
} from "@/app/toolshubSEO"; // Adjust path if needed

import Head from "next/head";
import RotatePdfClient from "./_components/RotatePdfClient";

const TOOLSHUB_BASE_URL = "https://www.toolshub.kivyx.com";
const KIVYX_MAIN_URL = "https://www.kivyx.com";
const KIVYX_FAVICON_URL = "https://www.kivyx.com/favicon.ico";

export const metadata = {
  title: "Rotate PDF Pages Online | Free PDF Rotator - ToolsHub",
  description:
    "Rotate your PDF pages easily online with ToolsHub's free PDF Rotator. Rotate PDF left, right, or 180° in seconds without installing software.",
  keywords: [
    "rotate PDF pages",
    "PDF rotator",
    "online PDF rotate",
    "rotate PDF free",
    "PDF editor",
    "ToolsHub PDF",
  ],
  openGraph: {
    title: "Rotate PDF Pages Online | Free PDF Rotator",
    description:
      "Quickly rotate PDF pages online using ToolsHub's free PDF Rotator tool. Secure, fast, and easy to use.",
    url: `${TOOLSHUB_BASE_URL}/tools/rotate-pdf-pages`,
    siteName: "Toolshub | Kivyx Technologies",
    images: [
      {
        url: `${TOOLSHUB_BASE_URL}/images/rotate-pdf-banner.png`,
        width: 1200,
        height: 630,
        alt: "Online PDF Rotator",
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
              name: "Online PDF Rotator",
              description:
                "Rotate your PDF pages easily and quickly using ToolsHub's free online PDF Rotator tool.",
              url: `${TOOLSHUB_BASE_URL}/tools/rotate-pdf-pages`,
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
                "@id": `${TOOLSHUB_BASE_URL}/tools/rotate-pdf-pages`,
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbsRotatePdf),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchemasRotatePdf),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(speakableAEORotatePdf),
          }}
        />
      </Head>
      <RotatePdfClient />
    </>
  );
}
