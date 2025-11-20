import {
  breadcrumbsMergePdfs,
  faqSchemasMergePdfs,
  speakableAEOMergePdfs,
} from "@/app/toolshubSEO"; // Adjust path if needed
import MergePdfClient from "./_components/MergePdfClient";
import Head from "next/head";

const TOOLSHUB_BASE_URL = "https://www.toolshub.kivyx.com";
const KIVYX_MAIN_URL = "https://www.kivyx.com";
const KIVYX_FAVICON_URL = "https://www.kivyx.com/favicon.ico";
export const metadata = {
  title: "Merge PDFs Online | Combine PDF Files for Free - ToolsHub",
  description:
    "Combine multiple PDF files into one single document instantly with ToolsHub's free online PDF Merger. Easy to use, secure, and no software installation required. Merge your PDFs quickly and efficiently.",
  keywords: [
    "merge PDFs",
    "combine PDF files",
    "PDF merger",
    "free PDF merge",
    "online PDF combiner",
    "PDF tools",
    "join PDFs",
    "collate PDFs",
    "document management",
    "kivyx PDF merger",
  ],
  openGraph: {
    title: "Merge PDFs Online | Free PDF File Combiner",
    description:
      "Effortlessly merge multiple PDF documents into a single, organized file with ToolsHub's free online PDF merger. Secure, fast, and user-friendly.",
    url: `${TOOLSHUB_BASE_URL}/tools/merge-pdfs`,
    siteName: "Toolshub | Kivyx Technologies",
    images: [
      {
        url: `${TOOLSHUB_BASE_URL}/images/merge-pdfs-banner.png`, // TODO: Replace with a specific banner for Merge PDFs
        width: 1200,
        height: 630,
        alt: "Online PDF Merge Tool",
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
              name: "Online PDF Merger",
              description:
                "Combine multiple PDF documents into one single file quickly and securely with ToolsHub's free online PDF merging tool.",
              url: `${TOOLSHUB_BASE_URL}/tools/merge-pdfs`,
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
                "@id": `${TOOLSHUB_BASE_URL}/tools/merge-pdfs`,
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbsMergePdfs),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchemasMergePdfs),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(speakableAEOMergePdfs),
          }}
        />
      </Head>
      <MergePdfClient />
    </>
  );
}
