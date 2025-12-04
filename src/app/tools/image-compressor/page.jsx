// import {
//   breadcrumbsImageFormatConverter,
//   faqSchemasImageFormatConverter,
//   speakableAEOImageFormatConverter,
// } from "@/app/toolshubSEO"; // Adjust path if needed
import ImageCompressorClient from "./_components/ImageCompressorClient";
import Head from "next/head";

const TOOLSHUB_BASE_URL = "https://www.toolshub.kivyx.com";
const KIVYX_MAIN_URL = "https://www.kivyx.com";
const KIVYX_FAVICON_URL = "https://www.kivyx.com/favicon.ico";
// export const metadata = {
//   title:
//     "Image Format Converter | Convert JPG, PNG, WEBP, GIF Online - ToolsHub",
//   description:
//     "Convert images between formats like JPG, PNG, WEBP, GIF, BMP, and more instantly with ToolsHub's free online Image Format Converter.",
//   keywords: [
//     "image format converter",
//     "convert jpg to png",
//     "convert png to jpg",
//     "convert webp to jpg",
//     "convert image online",
//     "free image converter",
//     "jpg to webp",
//     "png to webp",
//   ],
//   openGraph: {
//     title: "Image Format Converter | Free Online JPG, PNG, WEBP Converter",
//     description:
//       "Easily convert images between formats like JPG, PNG, WEBP, and GIF using ToolsHub’s fast and free online converter.",
//     url: `${TOOLSHUB_BASE_URL}/tools/image-format-converter`,
//     siteName: "ToolsHub | Kivyx Technologies",
//     images: [
//       {
//         url: `${TOOLSHUB_BASE_URL}/images/image-format-converter-banner.png`,
//         width: 1200,
//         height: 630,
//         alt: "Online Image Format Converter Tool",
//       },
//     ],
//     type: "website",
//   },
// };

export default function page() {
  return (
    <>
      {/* <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Image Format Converter",
              description:
                "Convert images between JPG, PNG, WEBP, GIF, and other formats instantly using ToolsHub’s free online converter.",
              url: `${TOOLSHUB_BASE_URL}/tools/image-format-converter`,
              publisher: {
                "@type": "Organization",
                name: "Kivyx Technologies",
                url: KIVYX_MAIN_URL,
                logo: {
                  "@type": "ImageObject",
                  url: KIVYX_FAVICON_URL,
                },
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbsImageFormatConverter),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchemasImageFormatConverter),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(speakableAEOImageFormatConverter),
          }}
        />
      </Head> */}
      <ImageCompressorClient />
    </>
  );
}
