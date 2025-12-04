import { TOOLSHUB_BASE_URL } from "./toolshubSEO";

export default function sitemap() {
  return [
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
    // 🔹 Rotate PDFs
    {
      url: `${TOOLSHUB_BASE_URL}/tools/rotate-pdfs`,
      lastModified: new Date(),
      changefreq: "weekly",
      priority: 0.8,
    },
    // 🔹 Delete PDFs
    {
      url: `${TOOLSHUB_BASE_URL}/tools/delete-pdfs`,
      lastModified: new Date(),
      changefreq: "weekly",
      priority: 0.8,
    },
    // 🔹 Image Format Converter
    {
      url: `${TOOLSHUB_BASE_URL}/tools/image-format-converter`,
      lastModified: new Date(),
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      url: `${TOOLSHUB_BASE_URL}/tools/delete-pdf-pages`,
      lastModified: new Date(),
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      url: `${TOOLSHUB_BASE_URL}/tools/rotate-pdf-pages`,
      lastModified: new Date(),
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      url: `${TOOLSHUB_BASE_URL}/tools/image-compressor`,
      lastModified: new Date(),
      changefreq: "weekly",
      priority: 0.8,
    },
  ];
}
