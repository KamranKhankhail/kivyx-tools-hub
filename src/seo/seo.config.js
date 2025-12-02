// src/app/toolshubSEO.js (Recommended new file)

// Base URL for Toolshub
const TOOLSHUB_BASE_URL = "https://www.toolshub.kivyx.com";
const KIVYX_MAIN_URL = "https://www.kivyx.com";
const KIVYX_FAVICON_URL = "https://www.kivyx.com/favicon.ico";

// =====================================================================
// Toolshub Homepage SEO
// =====================================================================

export const metadataToolshubHome = {
  title: "ToolsHub | Your Essential Online Toolkit for Everyday Tasks",
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
  ],
  openGraph: {
    title: "ToolsHub | Your Essential Online Toolkit for Everyday Tasks",
    description:
      "Access a wide range of free online tools for daily digital needs including password generation, QR codes, PDF manipulation, unit conversion, and more. Simplify your workflow with ToolsHub.",
    url: TOOLSHUB_BASE_URL,
    siteName: "Kivyx Technologies ToolsHub",
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

export const jsonLdToolshubHome = {
  "@context": "https://schema.org",
  "@type": "WebSite", // Use WebSite for a general collection/homepage
  name: "ToolsHub by Kivyx Technologies",
  url: TOOLSHUB_BASE_URL,
  description:
    "ToolsHub offers a comprehensive suite of free online tools for everyday digital tasks, enhancing productivity and simplifying workflows. Explore password, QR code, PDF, unit conversion, and color palette tools.",
  publisher: {
    "@type": "Organization",
    name: "Kivyx Technologies",
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
};

export const breadcrumbsToolshubHome = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: KIVYX_MAIN_URL, // Assuming kivyx.com is the main home
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "ToolsHub",
      item: TOOLSHUB_BASE_URL,
    },
  ],
};

export const faqSchemasToolshubHome = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is ToolsHub?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ToolsHub by Kivyx Technologies is a free online platform offering a wide array of digital utilities, including password generators, QR code creators, PDF merger/splitter, unit converters, and more, all designed to streamline your daily tasks.",
      },
    },
    {
      "@type": "Question",
      name: "Are the tools on ToolsHub free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all tools available on ToolsHub are completely free to use without any hidden costs or subscriptions.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to register to use ToolsHub?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, you can use most of our tools instantly without any registration or account creation, ensuring quick and anonymous access.",
      },
    },
    {
      "@type": "Question",
      name: "How often are new tools added to ToolsHub?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We are continuously developing and adding new tools to ToolsHub. Keep an eye on our updates for the latest additions to your digital toolkit!",
      },
    },
  ],
};

export const speakableAEOToolshubHome = {
  "@context": "https://schema.org",
  "@type": "SpeakableSpecification",
  xpath: ["/html/head/title", "/html/body//h1", "/html/body//p[1]"],
};

// =====================================================================
// Password Generator SEO
// =====================================================================

export const metadataPasswordGenerator = {
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
    siteName: "Kivyx Technologies ToolsHub",
    images: [
      {
        url: `${TOOLSHUB_BASE_URL}/images/password-generator-banner.png`, // TODO: Replace with a specific banner for Password Generator
        width: 1200,
        height: 630,
        alt: "Online Password Generator Tool",
      },
    ],
    type: "WebPage",
  },
};

export const jsonLdPasswordGenerator = {
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
};

export const breadcrumbsPasswordGenerator = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: KIVYX_MAIN_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "ToolsHub",
      item: TOOLSHUB_BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Password Generator",
      item: `${TOOLSHUB_BASE_URL}/tools/password-generator`,
    },
  ],
};

export const faqSchemasPasswordGenerator = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does the Password Generator create secure passwords?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our Password Generator uses cryptographically secure random number generation to create unique passwords. You can customize the length and include various character types (uppercase, lowercase, numbers, symbols) to increase complexity.",
      },
    },
    {
      "@type": "Question",
      name: "Is it safe to use this online password generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, it is safe. Passwords are generated locally within your browser and are never sent to our servers. This ensures your generated passwords remain private and secure.",
      },
    },
    {
      "@type": "Question",
      name: "Can I customize the generated password?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! You can specify the desired password length and choose whether to include uppercase letters, lowercase letters, numbers, and special symbols to meet specific security requirements.",
      },
    },
    {
      "@type": "Question",
      name: "What makes a strong password?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A strong password is typically long (12+ characters), unique, and combines a mix of uppercase and lowercase letters, numbers, and special symbols. Avoid using easily guessable information or common words.",
      },
    },
  ],
};

export const speakableAEOPasswordGenerator = {
  "@context": "https://schema.org",
  "@type": "SpeakableSpecification",
  xpath: ["/html/head/title", "/html/body//h1", "/html/body//p[1]"],
};

// =====================================================================
// QR Code Generator SEO
// =====================================================================

export const metadataQrCodeGenerator = {
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
    type: "WebPage",
  },
};

export const jsonLdQrCodeGenerator = {
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
};

export const breadcrumbsQrCodeGenerator = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: KIVYX_MAIN_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "ToolsHub",
      item: TOOLSHUB_BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "QR Code Generator",
      item: `${TOOLSHUB_BASE_URL}/tools/qr-code-generator`,
    },
  ],
};

export const faqSchemasQrCodeGenerator = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What kind of QR codes can I create?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can generate QR codes for URLs, plain text, email addresses, phone numbers, SMS messages, WiFi access, vCards, and more.",
      },
    },
    {
      "@type": "Question",
      name: "Is the QR code generator free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our QR Code Generator is completely free and you can create as many QR codes as you need without any limitations.",
      },
    },
    {
      "@type": "Question",
      name: "Are the generated QR codes permanent?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the QR codes generated are static and will work permanently as long as the linked content (e.g., URL) remains active.",
      },
    },
  ],
};

export const speakableAEOPassQrCodeGenerator = {
  "@context": "https://schema.org",
  "@type": "SpeakableSpecification",
  xpath: ["/html/head/title", "/html/body//h1", "/html/body//p[1]"],
};

// =====================================================================
// Nature Color Palette SEO
// =====================================================================

export const metadataNatureColorPalette = {
  title: "Nature Color Palette Generator | Discover Beautiful Color Schemes",
  description:
    "Generate stunning color palettes inspired by nature with ToolsHub's free online tool. Find harmonious color combinations for your design projects, complete with hex and RGB codes.",
  keywords: [
    "nature color palette",
    "color palette generator",
    "design colors",
    "hex codes",
    "RGB colors",
    "free color tool",
    "online color picker",
    "color combinations",
    "web design colors",
    "graphic design palette",
    "kivyx color palette",
  ],
  openGraph: {
    title: "Nature Color Palette Generator | Design with Natural Colors",
    description:
      "Explore and create beautiful, natural color palettes for any design project. Get instant hex and RGB values from ToolsHub's easy-to-use online tool.",
    url: `${TOOLSHUB_BASE_URL}/tools/nature-color-palette`,
    siteName: "Kivyx Technologies ToolsHub",
    images: [
      {
        url: `${TOOLSHUB_BASE_URL}/images/nature-color-palette-banner.png`, // TODO: Replace with a specific banner for Nature Color Palette
        width: 1200,
        height: 630,
        alt: "Nature Inspired Color Palette Generator",
      },
    ],
    type: "WebPage",
  },
};

export const jsonLdNatureColorPalette = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Nature Color Palette Generator",
  description:
    "Discover and generate harmonious color palettes inspired by the beauty of nature, complete with hex and RGB color codes for designers.",
  url: `${TOOLSHUB_BASE_URL}/tools/nature-color-palette`,
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
    "@id": `${TOOLSHUB_BASE_URL}/tools/nature-color-palette`,
  },
};

export const breadcrumbsNatureColorPalette = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: KIVYX_MAIN_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "ToolsHub",
      item: TOOLSHUB_BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Nature Color Palette",
      item: `${TOOLSHUB_BASE_URL}/tools/nature-color-palette`,
    },
  ],
};

export const faqSchemasNatureColorPalette = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does the Nature Color Palette tool work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our tool generates color palettes by drawing inspiration from natural landscapes, seasons, and elements, providing you with aesthetically pleasing and harmonious combinations.",
      },
    },
    {
      "@type": "Question",
      name: "Can I get hex and RGB codes for the colors?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, for every color in the generated palette, you will instantly receive its corresponding Hexadecimal and RGB values for easy use in your design software.",
      },
    },
    {
      "@type": "Question",
      name: "Who can benefit from this tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This tool is perfect for graphic designers, web developers, artists, marketers, and anyone looking for creative and natural color scheme inspiration for their projects.",
      },
    },
  ],
};

export const speakableAEONatureColorPalette = {
  "@context": "https://schema.org",
  "@type": "SpeakableSpecification",
  xpath: ["/html/head/title", "/html/body//h1", "/html/body//p[1]"],
};

// =====================================================================
// Merge PDFs SEO
// =====================================================================

export const metadataMergePdfs = {
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
    siteName: "Kivyx Technologies ToolsHub",
    images: [
      {
        url: `${TOOLSHUB_BASE_URL}/images/merge-pdfs-banner.png`, // TODO: Replace with a specific banner for Merge PDFs
        width: 1200,
        height: 630,
        alt: "Online PDF Merge Tool",
      },
    ],
    type: "WebPage",
  },
};

export const jsonLdMergePdfs = {
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
};

export const breadcrumbsMergePdfs = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: KIVYX_MAIN_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "ToolsHub",
      item: TOOLSHUB_BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Merge PDFs",
      item: `${TOOLSHUB_BASE_URL}/tools/merge-pdfs`,
    },
  ],
};

export const faqSchemasMergePdfs = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I merge PDF files using ToolsHub?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply upload your PDF files to our tool, arrange them in the desired order, and click the 'Merge' button. Your combined PDF will be ready for download in seconds.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a limit to the number or size of PDFs I can merge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our tool supports merging multiple PDF files, typically up to a reasonable file size. Please check the tool's interface for any specific limits.",
      },
    },
    {
      "@type": "Question",
      name: "Is merging PDFs online secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, your files are processed securely and deleted from our servers shortly after processing to ensure your privacy.",
      },
    },
  ],
};

export const speakableAEOMergePdfs = {
  "@context": "https://schema.org",
  "@type": "SpeakableSpecification",
  xpath: ["/html/head/title", "/html/body//h1", "/html/body//p[1]"],
};

// =====================================================================
// Split PDFs SEO
// =====================================================================

export const metadataSplitPdfs = {
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
    siteName: "Kivyx Technologies ToolsHub",
    images: [
      {
        url: `${TOOLSHUB_BASE_URL}/images/split-pdfs-banner.png`, // TODO: Replace with a specific banner for Split PDFs
        width: 1200,
        height: 630,
        alt: "Online PDF Split Tool",
      },
    ],
    type: "WebPage",
  },
};

export const jsonLdSplitPdfs = {
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
};

export const breadcrumbsSplitPdfs = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: KIVYX_MAIN_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "ToolsHub",
      item: TOOLSHUB_BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Split PDFs",
      item: `${TOOLSHUB_BASE_URL}/tools/split-pdfs`,
    },
  ],
};

export const faqSchemasSplitPdfs = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I split a PDF file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload your PDF, choose whether to split by individual pages or custom page ranges, and click 'Split'. The new PDF files will be available for download.",
      },
    },
    {
      "@type": "Question",
      name: "Can I extract specific pages from a PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our tool allows you to specify exact page numbers or ranges to extract, giving you full control over the splitting process.",
      },
    },
    {
      "@type": "Question",
      name: "Is it safe to split PDF documents online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We ensure the security of your documents. All uploaded files are processed over a secure connection and are automatically deleted from our servers after a short period.",
      },
    },
  ],
};

export const speakableAEOSplitPdfs = {
  "@context": "https://schema.org",
  "@type": "SpeakableSpecification",
  xpath: ["/html/head/title", "/html/body//h1", "/html/body//p[1]"],
};

// =====================================================================
// Unit Converter SEO
// =====================================================================

export const metadataUnitConverter = {
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
    siteName: "Kivyx Technologies ToolsHub",
    images: [
      {
        url: `${TOOLSHUB_BASE_URL}/images/unit-converter-banner.png`, // TODO: Replace with a specific banner for Unit Converter
        width: 1200,
        height: 630,
        alt: "Online Universal Unit Converter Tool",
      },
    ],
    type: "WebPage",
  },
};

export const jsonLdUnitConverter = {
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
};

export const breadcrumbsUnitConverter = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: KIVYX_MAIN_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "ToolsHub",
      item: TOOLSHUB_BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Unit Converter",
      item: `${TOOLSHUB_BASE_URL}/tools/universal-unit-converter`,
    },
  ],
};

export const faqSchemasUnitConverter = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What types of units can I convert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our Universal Unit Converter supports a wide range of categories including length, weight/mass, temperature, volume, area, speed, time, currency, and more.",
      },
    },
    {
      "@type": "Question",
      name: "Is the unit converter accurate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our converter uses precise conversion factors to ensure high accuracy for all unit transformations.",
      },
    },
    {
      "@type": "Question",
      name: "How often is the currency converter updated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The currency conversion rates are updated regularly to provide you with the most current exchange values.",
      },
    },
  ],
};

export const speakableAEOUnitConverter = {
  "@context": "https://schema.org",
  "@type": "SpeakableSpecification",
  xpath: ["/html/head/title", "/html/body//h1", "/html/body//p[1]"],
};

// =====================================================================
// Image Format Converter SEO
// =====================================================================

export const breadcrumbsImageFormatConverter = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "ToolsHub",
      item: TOOLSHUB_BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Image Tools",
      item: `${TOOLSHUB_BASE_URL}/tools/image-format-converter`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Image Format Converter",
      item: `${TOOLSHUB_BASE_URL}/tools/image-format-converter`,
    },
  ],
};

export const faqSchemasImageFormatConverter = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is the image format converter free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, ToolsHub’s image format converter is completely free with no signup required.",
      },
    },
    {
      "@type": "Question",
      name: "Which image formats are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can convert JPG, PNG, WEBP, GIF, BMP, TIFF, and more.",
      },
    },
    {
      "@type": "Question",
      name: "Does converting an image reduce its quality?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ToolsHub keeps the highest possible quality during conversion, but changing formats like JPG may cause compression.",
      },
    },
    {
      "@type": "Question",
      name: "Is my uploaded image safe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all conversions happen on your device or are deleted instantly after processing.",
      },
    },
  ],
};

export const speakableAEOImageFormatConverter = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [".tool-heading", ".tool-description"],
  },
  url: `${TOOLSHUB_BASE_URL}/tools/image-format-converter`,
};

// =====================================================================
// Sitemap Entries for Toolshub (Append to app/sitemap.js)
// =====================================================================

// You will need to add these entries to your existing `app/sitemap.js` file.
// Make sure to merge this with your existing sitemap array.
export const toolshubSitemapEntries = [
  // 🔹 Toolshub Homepage
  {
    url: `${TOOLSHUB_BASE_URL}/`,
    lastModified: new Date(),
    changefreq: "daily",
    priority: 1.0,
  },
  // 🔹 Password Generator
  {
    url: `${TOOLSHUB_BASE_URL}/tools/password-generator`,
    lastModified: new Date(),
    changefreq: "weekly",
    priority: 0.8,
  },
  // 🔹 QR Code Generator
  {
    url: `${TOOLSHUB_BASE_URL}/tools/qr-code-generator`,
    lastModified: new Date(),
    changefreq: "weekly",
    priority: 0.8,
  },
  // 🔹 Nature Color Palette
  {
    url: `${TOOLSHUB_BASE_URL}/tools/nature-color-palette`,
    lastModified: new Date(),
    changefreq: "monthly",
    priority: 0.7,
  },
  // 🔹 Merge PDFs
  {
    url: `${TOOLSHUB_BASE_URL}/tools/merge-pdfs`,
    lastModified: new Date(),
    changefreq: "weekly",
    priority: 0.8,
  },
  // 🔹 Split PDFs
  {
    url: `${TOOLSHUB_BASE_URL}/tools/split-pdfs`,
    lastModified: new Date(),
    changefreq: "weekly",
    priority: 0.8,
  },
  // 🔹 Universal Unit Converter
  {
    url: `${TOOLSHUB_BASE_URL}/tools/universal-unit-converter`,
    lastModified: new Date(),
    changefreq: "weekly",
    priority: 0.8,
  },
];
