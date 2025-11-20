import Head from "next/head";
import PasswordGeneratorClient from "./_components/PasswordGeneratorClient";
import {
  breadcrumbsPasswordGenerator,
  faqSchemasPasswordGenerator,
  speakableAEOPasswordGenerator,
} from "@/app/toolshubSEO"; // Adjust path if needed
const TOOLSHUB_BASE_URL = "https://www.toolshub.kivyx.com";
const KIVYX_MAIN_URL = "https://www.kivyx.com";
const KIVYX_FAVICON_URL = "https://www.kivyx.com/favicon.ico";
export const metadata = {
  title: "Password Generator | Create Strong, Secure, Random Passwords Online",
  description:
    "Generate highly secure, random passwords instantly with ToolsHub's free online Password Generator. Customize length, include special characters, numbers, and symbols for ultimate account protection.",
  keywords: [
    "password generator",
    "secure password",
    "random password",
    "strong password",
    "online password generator",
    "password creator",
    "generate password",
    "free password tool",
    "cyber security",
    "account protection",
    "password safety",
    "password management",
    "kivyx password",
  ],
  openGraph: {
    title: "Password Generator | Create Strong, Secure, Random Passwords",
    description:
      "Instantly create strong, unique, and random passwords tailored to your needs. ToolsHub's Password Generator helps secure your digital life with customizable options.",
    url: `${TOOLSHUB_BASE_URL}/tools/password-generator`,
    siteName: "Toolshub | Kivyx Technologies",
    images: [
      {
        url: `${TOOLSHUB_BASE_URL}/images/password-generator-banner.png`, // TODO: Replace with a specific banner for Password Generator
        width: 1200,
        height: 630,
        alt: "Online Password Generator Tool",
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
              "@type": "WebPage", // Or "SoftwareApplication"
              name: "Online Password Generator",
              description:
                "Generate strong, secure, and random passwords quickly and easily with ToolsHub's free online tool. Customize length and character types for robust security.",
              url: `${TOOLSHUB_BASE_URL}/tools/password-generator`,
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
                "@id": `${TOOLSHUB_BASE_URL}/tools/password-generator`,
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbsPasswordGenerator),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchemasPasswordGenerator),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(speakableAEOPasswordGenerator),
          }}
        />
      </Head>
      <PasswordGeneratorClient />
    </>
  );
}
