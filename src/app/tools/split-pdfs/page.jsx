import {
  breadcrumbsSplitPdfs,
  faqSchemasSplitPdfs,
  speakableAEOSplitPdfs,
} from "@/app/toolshubSEO"; // Adjust path if needed
import SplitPdfsClient from "./_components/SplitPdfsClient";
import Head from "next/head";

const TOOLSHUB_BASE_URL = "https://www.toolshub.kivyx.com";
const KIVYX_MAIN_URL = "https://www.kivyx.com";
const KIVYX_FAVICON_URL = "https://www.kivyx.com/favicon.ico";
export const metadata = {
  title: "Split PDFs Online | Extract Pages from PDF for Free - ToolsHub",
  description:
    "Easily split large PDF documents into smaller files or extract specific pages with ToolsHub's free online PDF Splitter. Fast, secure, and user-friendly, perfect for managing your documents.",
  keywords: [
    "split PDFs",
    "extract PDF pages",
    "PDF splitter",
    "free PDF split",
    "online PDF extractor",
    "PDF tools",
    "separate PDF",
    "divide PDF",
    "document management",
    "kivyx PDF splitter",
  ],
  openGraph: {
    title: "Split PDFs Online | Free PDF Page Extractor",
    description:
      "Quickly split PDF files by pages or extract custom page ranges using ToolsHub's free and efficient online PDF splitter. No installation required.",
    url: `${TOOLSHUB_BASE_URL}/tools/split-pdfs`,
    siteName: "Toolshub | Kivyx Technologies",
    images: [
      {
        url: `${TOOLSHUB_BASE_URL}/images/split-pdfs-banner.png`, // TODO: Replace with a specific banner for Split PDFs
        width: 1200,
        height: 630,
        alt: "Online PDF Split Tool",
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
              name: "Online PDF Splitter",
              description:
                "Split PDF documents into individual pages or custom page ranges with ToolsHub's free online tool, simplifying your document management.",
              url: `${TOOLSHUB_BASE_URL}/tools/split-pdfs`,
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
                "@id": `${TOOLSHUB_BASE_URL}/tools/split-pdfs`,
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbsSplitPdfs),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchemasSplitPdfs),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(speakableAEOSplitPdfs),
          }}
        />
      </Head>
      <SplitPdfsClient />
    </>
  );
}
