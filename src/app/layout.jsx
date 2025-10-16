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
import ThemeRegistry from "../styles/ThemeRegistry";
import Navbar from "../components/Navbar";
import NavigationWrapper from "../components/common/NavigationWrapper";
import PageLoader from "../components/common/PageLoader";
import { Stack } from "@mui/material";

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

export const metadata = {
  title: {
    default: "Kivyx Technologies",
    template: "%s | Kivyx Technologies", // auto append brand name
  },
  description:
    "Kivyx Technologies builds cutting-edge apps like Islam Encyclo, Vocabster, and WishSphere to empower productivity, learning, and spirituality.",
  metadataBase: new URL("https://www.kivyx.com"), // your domain
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Kivyx Technologies",
    description:
      "Kivyx Technologies builds cutting-edge apps like Islam Encyclo, Vocabster, and WishSphere.",
    url: "https://www.kivyx.com",
    siteName: "Kivyx Technologies",
    images: [
      {
        url: "/og-image.jpg", // TODO: replace with real OG image
        width: 1200,
        height: 630,
        alt: "Kivyx Technologies",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kivyx Technologies",
    description:
      "Explore Islam Encyclo, Vocabster, WishSphere and other apps by Kivyx Technologies.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Organization JSON-LD for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Kivyx Technologies",
              url: "https://www.kivyx.com",
              logo: "https://www.kivyx.com/favicon.ico",
              sameAs: [
                "https://www.linkedin.com/company/kivyx-technologies/?originalSubdomain=pk",
                "https://www.facebook.com/share/1GvYWNTVsC/",
                "https://www.instagram.com/islamencycloofficial?igsh=c2oxMzN5YXd2Z3hh",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "support@kivyx.com", // TODO: replace
                contactType: "customer support",
                availableLanguage: ["English", "Urdu"],
              },
            }),
          }}
        />
      </head>
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
              <Stack sx={{ pt: "180px", overflow: "hidden" }}>
                <Navbar />
              </Stack>

              {children}
            </Stack>
          </NavigationWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
