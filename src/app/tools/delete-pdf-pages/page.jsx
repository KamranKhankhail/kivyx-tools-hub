import {
  breadcrumbsDeletePdf,
  faqSchemasDeletePdf,
  speakableAEODeletePdf,
} from "@/app/toolshubSEO"; // Adjust path if needed

import Head from "next/head";
import DeletePdfClient from "./_components/DeletePdfClient";

const TOOLSHUB_BASE_URL = "https://www.toolshub.kivyx.com";
const KIVYX_MAIN_URL = "https://www.kivyx.com";
const KIVYX_FAVICON_URL = "https://www.kivyx.com/favicon.ico";

export const metadata = {
  title: "Delete PDF Pages Online | Remove PDF Pages Free - ToolsHub",
  description:
    "Remove unwanted pages from your PDF files instantly with ToolsHub's free online Delete PDF Pages tool. Secure, fast, and easy to use.",
  keywords: [
    "delete PDF pages",
    "remove PDF pages",
    "PDF page remover",
    "online PDF tools",
    "PDF editor",
    "ToolsHub PDF",
  ],
  openGraph: {
    title: "Delete PDF Pages Online | Free PDF Page Remover",
    description:
      "Easily delete one or more pages from any PDF document using ToolsHub's free online Delete PDF Pages tool. Quick, secure, and user-friendly.",
    url: `${TOOLSHUB_BASE_URL}/tools/delete-pdf-pages`,
    siteName: "Toolshub | Kivyx Technologies",
    images: [
      {
        url: `${TOOLSHUB_BASE_URL}/images/delete-pdf-banner.png`,
        width: 1200,
        height: 630,
        alt: "Online PDF Page Deleter",
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
              name: "Online PDF Page Deleter",
              description:
                "Remove unwanted pages from your PDF files easily with ToolsHub's free online PDF page remover.",
              url: `${TOOLSHUB_BASE_URL}/tools/delete-pdf-pages`,
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
                "@id": `${TOOLSHUB_BASE_URL}/tools/delete-pdf-pages`,
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbsDeletePdf),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchemasDeletePdf),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(speakableAEODeletePdf),
          }}
        />
      </Head>
      <DeletePdfClient />
    </>
  );
}
