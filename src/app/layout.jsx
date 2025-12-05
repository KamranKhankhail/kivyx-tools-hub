import {
  Roboto,
  Bebas_Neue,
  Mulish,
  Geist,
  Geist_Mono,
  Inter,
  Jaro,
  Chakra_Petch,
} from "next/font/google";
import "@/styles/global.css";
import ThemeRegistry from "@/styles/ThemeRegistry";
import NavigationWrapper from "@/components/common/NavigationWrapper";
import PageLoader from "@/components/common/PageLoader";
import NavbarWrapper from "@/components/common/NavbarWrapper";
import { Stack } from "@mui/material";
import "@/styles/global.css";
import { Suspense } from "react";
import {
  breadcrumbsToolshubHome,
  faqSchemasToolshubHome,
  speakableAEOToolshubHome,
} from "@/app/toolshubSEO"; // Adjust path if needed
import Head from "next/head";
const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const jaro = Jaro({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jaro",
  display: "swap",
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const mulish = Mulish({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mulish",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const TOOLSHUB_BASE_URL = "https://www.toolshub.kivyx.com";
const KIVYX_MAIN_URL = "https://www.kivyx.com";
const KIVYX_FAVICON_URL = "https://www.kivyx.com/favicon.ico";

export const metadata = {
  title: {
    default: "ToolsHub | Your Essential Online Toolkit for Everyday Tasks",
    template: "%s | ToolsHub by Kivyx Technologies",
  },
  description:
    "Discover ToolsHub, a comprehensive collection of free online tools designed to simplify your digital life. From productivity and creativity to essential utilities like password and QR code generators, merge/split PDFs, and unit converters. Fast, smart, and easy to use.",
  keywords: [
    "ToolsHub",
    "online tools",
    "free online tools",
    "digital toolkit",
    "productivity tools",
    "utility tools",
    "web tools",
    "password generator",
    "QR code generator",
    "PDF tools",
    "unit converter",
    "color palette generator",
    "online utilities",
    "kivyx tools",
    "PDF Merge Tools",
    "PDF Split Tools",
    "Only PDF Tools",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "ToolsHub | Your Essential Online Toolkit for Everyday Tasks",
    description:
      "Access a wide range of free online tools for daily digital needs including password generation, QR codes, PDF manipulation, unit conversion, and more. Simplify your workflow with ToolsHub.",
    url: TOOLSHUB_BASE_URL,
    siteName: "Toolshub | Kivyx Technologies",
    images: [
      {
        url: `${TOOLSHUB_BASE_URL}/images/toolshub-banner.png`, // TODO: Replace with a compelling banner image for the ToolsHub homepage
        width: 1200,
        height: 630,
        alt: "ToolsHub - Free Online Tools Collection",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite", // Use WebSite for a general collection/homepage
              name: "ToolsHub",
              url: TOOLSHUB_BASE_URL,
              description:
                "ToolsHub offers a comprehensive suite of free online tools for everyday digital tasks, enhancing productivity and simplifying workflows. Explore password, QR code, PDF, unit conversion, and color palette tools.",
              publisher: {
                "@type": "Organization",
                name: "Toolshub",
                url: KIVYX_MAIN_URL,
                logo: {
                  "@type": "ImageObject",
                  url: KIVYX_FAVICON_URL,
                },
              },
              potentialAction: {
                "@type": "SearchAction",
                target: `${TOOLSHUB_BASE_URL}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbsToolshubHome),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchemasToolshubHome),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(speakableAEOToolshubHome),
          }}
        />
      </Head>
      <body
        className={`${chakraPetch.className} ${inter.variable} ${jaro.variable} ${geistSans.variable} ${geistMono.variable} antialiased ${roboto.variable} ${bebasNeue.variable} ${mulish.variable} `} // Add notoNastaliqUrdu.variable
      >
        <ThemeRegistry>
          <PageLoader />

          <NavigationWrapper>
            <Stack
              sx={{
                background:
                  "radial-gradient(425.23% 208% at -81.08% -22.7%, rgba(255, 255, 255, 0.870588) 0%, rgba(175, 236, 255, 0.785294) 65.51%, rgba(204, 230, 230, 0.93) 100%)",
              }}
            >
              <Suspense>
                {" "}
                <NavbarWrapper />
                {children}
              </Suspense>
            </Stack>
          </NavigationWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
