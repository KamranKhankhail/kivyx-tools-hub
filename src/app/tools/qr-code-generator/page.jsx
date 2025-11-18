import {
  breadcrumbsQrCodeGenerator,
  faqSchemasQrCodeGenerator,
  speakableAEOQrCodeGenerator,
} from "@/app/toolshubSEO"; // Adjust path if needed
import QrCodeGeneratorClient from "./_components/QrCodeGeneratorClient";
import Head from "next/head";
const TOOLSHUB_BASE_URL = "https://www.toolshub.kivyx.com";
const KIVYX_MAIN_URL = "https://www.kivyx.com";
const KIVYX_FAVICON_URL = "https://www.kivyx.com/favicon.ico";
export const metadata = {
  title: "QR Code Generator | Create Custom QR Codes for Links, Text & WiFi",
  description:
    "Generate custom QR codes instantly with ToolsHub's free online QR Code Generator. Create QR codes for URLs, text, WiFi networks, contact info, and more. Easy to use and perfect for sharing information.",
  keywords: [
    "QR code generator",
    "create QR code",
    "custom QR code",
    "QR code for link",
    "QR code for text",
    "QR code for WiFi",
    "free QR code tool",
    "online QR code maker",
    "scan QR code",
    "digital sharing",
    "marketing tool",
    "kivyx QR code",
  ],
  openGraph: {
    title: "QR Code Generator | Create Custom QR Codes for Any Data",
    description:
      "Quickly generate personalized QR codes for websites, messages, WiFi, and contact details. ToolsHub offers a free and versatile QR code creation tool.",
    url: `${TOOLSHUB_BASE_URL}/tools/qr-code-generator`,
    siteName: "Kivyx Technologies ToolsHub",
    images: [
      {
        url: `${TOOLSHUB_BASE_URL}/images/qr-code-generator-banner.png`, // TODO: Replace with a specific banner for QR Code Generator
        width: 1200,
        height: 630,
        alt: "Online QR Code Generator Tool",
      },
    ],
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
              name: "Online QR Code Generator",
              description:
                "Create custom QR codes for various data types, including URLs, text, and WiFi credentials, using ToolsHub's free and easy-to-use online generator.",
              url: `${TOOLSHUB_BASE_URL}/tools/qr-code-generator`,
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
                "@id": `${TOOLSHUB_BASE_URL}/tools/qr-code-generator`,
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbsQrCodeGenerator),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchemasQrCodeGenerator),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(speakableAEOQrCodeGenerator),
          }}
        />
      </Head>
      <QrCodeGeneratorClient />
    </>
  );
}
