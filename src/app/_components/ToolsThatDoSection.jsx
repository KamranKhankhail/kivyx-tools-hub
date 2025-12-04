// import { Box, Stack, Typography } from "@mui/material";
// import React from "react";
// import theme from "../../styles/theme";
// import PasswordGeneratorIcon from "../_components/icons/PasswordGeneratorIcon";
// import QrCodeGeneratorIcon from "../_components/icons/QrCodeGeneratorIcon";
// import ColorPaletteGeneratorIcon from "../_components/icons/ColorPaletteGenerator";
// import JsonFormatterValidatorIcon from "../_components/icons/JsonFormatterValidatorIcon";
// import LoremIpsumGeneratorIcon from "../_components/icons/LoremIpsumGeneratorIcon";
// import UnitConverterIcon from "../_components/icons/UnitConverterIcon";
// import SectionMajorButton from "../../components/common/SectionMajorButton";
// import Link from "next/link";
// const toolsThatDoMoreToolsData = [
//   {
//     primaryText: "Password Generator",
//     secondaryText:
//       "Create strong, secure, and random passwords to keep your accounts safe",
//     icon: PasswordGeneratorIcon,
//     href: "/password-generator",
//   },
//   {
//     primaryText: "QR Code Generator",
//     secondaryText:
//       "Instantly create custom QR codes for links, text, or contact info",
//     icon: QrCodeGeneratorIcon,
//     href: "/qr-code-generator",
//   },
//   {
//     primaryText: "Color Palette Generator",
//     secondaryText:
//       "Build beautiful color combinations for your designs in one click",
//     icon: ColorPaletteGeneratorIcon,
//     href: "",
//   },
//   {
//     primaryText: "JSON Formatter Validator",
//     secondaryText:
//       "Format, validate, and beautify JSON data for easy debugging",
//     icon: JsonFormatterValidatorIcon,
//     href: "",
//   },
//   {
//     primaryText: "Lorem Ipsum Generator",
//     secondaryText:
//       "Quickly generate dummy text for your designs, mockups, and layouts",
//     icon: LoremIpsumGeneratorIcon,
//     href: "",
//   },
//   {
//     primaryText: "Unit Converter",
//     secondaryText:
//       "Convert measurements like length, weight, and temperature instantly.",
//     icon: UnitConverterIcon,
//     href: "",
//   },
// ];
// export default function ToolsThatDoSection() {
//   return (
//     <Stack sx={{ alignItems: "center", justifyContent: "center" }}>
//       {" "}
//       <Typography
//         component="h1"
//         variant="body2"
//         sx={{
//           fontSize: {
//             xl: "65px",
//             lg: "60px",
//             md: "52px",
//             sm: "42px",
//             xs: "32px",
//             mob: "28px",
//           },
//           fontWeight: "600",
//           lineHeight: { md: "130%", sm: "120%", xs: "100%", mob: "100%" },

//           color: theme.palette.primary.main,
//           textAlign: "center",
//           zIndex: 5,
//         }}
//       >
//         ToolsHub — Your Toolkit for the
//         <span
//           style={{
//             background:
//               "linear-gradient(90deg, #050935 18.27%, #0C4E78 58.17%, #0C4E78 71.15%, #1393BA 86.06%)",

//             WebkitBackgroundClip: "text",
//             backgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             color: "transparent",
//             paddingLeft: "10px",
//           }}
//         >
//           Digital Era
//         </span>
//       </Typography>{" "}
//       <Typography
//         component="p"
//         variant="body2"
//         sx={{
//           fontSize: {
//             xl: "28px",
//             lg: "26px",
//             md: "24px",
//             sm: "22px",
//             xs: "20px",
//             mob: "18px",
//           },
//           fontWeight: "300",
//           lineHeight: {
//             lg: "130%",
//             md: "120%",
//             sm: "110%",
//             xs: "100%",
//             mob: "100%",
//           },
//           color: theme.palette.primary.secondMain,
//           textAlign: "center",
//           zIndex: "5",
//           pb: "40px",
//           pt: "24px",
//           px: "60px",
//         }}
//       >
//         ToolsHub is a complete collection of online utilities designed to
//         simplify everyday tasks. From creation to productivity, explore 100+
//         tools that make your digital work faster and smarter.
//       </Typography>
//       <Stack
//         direction="row"
//         gap={8}
//         sx={{
//           flexWrap: "wrap",
//           px: "40px",
//           justifyContent: "center",
//           pt: "50px",
//         }}
//       >
//         {toolsThatDoMoreToolsData.map((tool, i) => (
//           <Stack
//             key={i}
//             component={Link}
//             href={tool.href}
//             sx={{
//               background:
//                 "linear-gradient(180deg, rgba(175, 236, 255, 0.157059) 0%, rgba(204, 230, 230, 0.186) 50%, rgba(128, 192, 192, 0.2) 100%)",
//               borderRadius: "60px",
//               padding: "30px",
//               backgroundClip: "padding-box, border-box",
//               backgroundOrigin: "padding-box, border-box",
//               backgroundImage: `
//               linear-gradient(180deg, rgba(175, 236, 255, 0.157059) 0%, rgba(204, 230, 230, 0.186) 50%, rgba(128, 192, 192, 0.2) 100%),
//               linear-gradient(180deg, #80C0C0 0%, rgba(204, 230, 230, 0.93) 50%, #80C0C0 100%)
//             `,
//               border: "1px solid transparent",
//               maxWidth: "432px", // Keeping existing maxWidth
//               alignItems: "center",
//               gap: "10px",
//               py: "60px",
//               cursor: "pointer",
//             }}
//           >
//             <Box sx={{ pb: "20px" }}>
//               <tool.icon />
//             </Box>
//             <Typography
//               component="h1"
//               variant="body2"
//               sx={{
//                 fontSize: {
//                   xl: "35px",
//                   lg: "25px",
//                   md: "52px",
//                   sm: "42px",
//                   xs: "32px",
//                   mob: "28px",
//                 },
//                 fontWeight: "600",
//                 lineHeight: { md: "130%", sm: "120%", xs: "100%", mob: "100%" },

//                 color: theme.palette.primary.main,
//                 textAlign: "center",
//                 zIndex: 5,
//               }}
//             >
//               {tool.primaryText}
//             </Typography>{" "}
//             <Typography
//               component="p"
//               variant="body2"
//               sx={{
//                 fontSize: {
//                   xl: "18px",
//                   lg: "18px",
//                   md: "24px",
//                   sm: "22px",
//                   xs: "20px",
//                   mob: "18px",
//                 },
//                 fontWeight: "300",
//                 lineHeight: {
//                   lg: "130%",
//                   md: "120%",
//                   sm: "110%",
//                   xs: "100%",
//                   mob: "100%",
//                 },
//                 color: theme.palette.primary.secondMain,
//                 textAlign: "center",
//                 zIndex: "5",
//               }}
//             >
//               {tool.secondaryText}
//             </Typography>
//           </Stack>
//         ))}
//       </Stack>
//       <SectionMajorButton>Explore More</SectionMajorButton>
//     </Stack>
//   );
// }

"use client"; // Add "use client" directive
import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import theme from "../../styles/theme";
import PasswordGeneratorIcon from "../_components/icons/PasswordGeneratorIcon";
import QrCodeGeneratorIcon from "../_components/icons/QrCodeGeneratorIcon";
import ColorPaletteGeneratorIcon from "../_components/icons/ColorPaletteGenerator";
import PdfMergeIcon from "@/app/_components/icons/PdfMergeIcon";
import PdfSplitIcon from "@/app/_components/icons/PdfSplitIcon";
import UnitConverterIcon from "../_components/icons/UnitConverterIcon";
import SectionMajorButton from "../../components/common/SectionMajorButton";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import Image from "next/image";

const toolsThatDoMoreToolsData = [
  {
    primaryText: "Password Generator",
    secondaryText:
      "Create strong, secure, and random passwords to protect your accounts.",
    icon: "/images/homepageIcons/passwordGeneratorIcon.png",
    href: "/tools/password-generator",
  },
  {
    primaryText: "QR Code Generator",
    secondaryText:
      "Generate custom QR codes for links, text, WiFi, and contact information.",
    icon: "/images/homepageIcons/qrCodeGeneratorIcon.png",
    href: "tools/qr-code-generator",
  },
  {
    primaryText: "Nature Color Palette",
    secondaryText:
      "Choose beautiful color palettes inspired by nature for your designs.",
    icon: "/images/homepageIcons/colorPaletteIcon.png",
    href: "/tools/nature-color-palette",
  },
  {
    primaryText: "Merge PDFs",
    secondaryText:
      "Easily combine multiple PDF files into one clean, organized document.",
    icon: PdfMergeIcon, // Replace with your actual icon name
    href: "/tools/merge-pdfs",
  },
  {
    primaryText: "Split PDFs",
    secondaryText:
      "Quickly split a PDF into separate pages or custom page ranges.",
    icon: PdfSplitIcon, // Replace with your actual icon name
    href: "/tools/split-pdfs",
  },
  {
    primaryText: "Unit Converter",
    secondaryText:
      "Convert units like length, weight, temperature, currency, and more.",
    icon: "/images/homepageIcons/unitConverterIcon.png",
    href: "/tools/universal-unit-converter",
  },
  {
    primaryText: "Rotate PDF Pages",
    secondaryText:
      "Quickly rotate your PDF pages to the correct angle with a fast and easy online PDF rotation tool.",
    icon: "/images/homepageIcons/rotatePdfIcon.png",
    href: "/tools/rotate-pdf-pages",
  },
  {
    primaryText: "Delete PDF Pages",
    secondaryText:
      "Remove unwanted or blank PDF pages instantly using a simple online tool designed for fast PDF page deletion.",
    icon: "/images/homepageIcons/deletePdfIcon.png",
    href: "/tools/delete-pdf-pages",
  },
  {
    primaryText: "Image Format Converter",
    secondaryText:
      "Convert images between formats like JPG, PNG, WEBP, and GIF instantly with this fast and easy online tool.",
    icon: "/images/homepageIcons/imageFormatConverterIcon.png",
    href: "/tools/image-format-converter",
  },
  {
    primaryText: "Image Compressor",
    secondaryText:
      "Convert images between formats like JPG, PNG, WEBP, and GIF instantly with this fast and easy online tool.",
    icon: "/images/homepageIcons/imageFormatConverterIcon.png",
    href: "/tools/image-compressor",
  },
];

export default function ToolsThatDoSection({ searchTerm }) {
  const [sortedTools, setSortedTools] = useState(toolsThatDoMoreToolsData);
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentSearchQuery = searchParams.get("search") || "";

    const newSortedTools = [...toolsThatDoMoreToolsData].sort((a, b) => {
      if (!currentSearchQuery) return 0; // No search query, maintain original order

      const lowerCaseSearchQuery = currentSearchQuery.toLowerCase();

      const aMatches = a.primaryText
        .toLowerCase()
        .includes(lowerCaseSearchQuery);
      const bMatches = b.primaryText
        .toLowerCase()
        .includes(lowerCaseSearchQuery);

      if (aMatches && !bMatches) {
        return -1; // A comes before B if A matches and B doesn't
      }
      if (!aMatches && bMatches) {
        return 1; // B comes before A if B matches and A doesn't
      }
      return 0; // Maintain original order if both match or neither match
    });
    setSortedTools(newSortedTools);
  }, [searchParams]);

  return (
    <Stack sx={{ alignItems: "center", justifyContent: "center" }}>
      {" "}
      <Typography
        component="h1"
        variant="body2"
        sx={{
          fontSize: {
            xl: "55px",
            lg: "45px",
            md: "45px",
            sm: "38px",
            xs: "32px",
            mob: "28px",
          },
          fontWeight: "600",
          lineHeight: { md: "130%", sm: "120%", xs: "100%", mob: "100%" },

          color: theme.palette.primary.main,
          textAlign: "center",
          zIndex: 5,
          px: "46px",
        }}
      >
        ToolsHub — Your Toolkit for the
        <span
          style={{
            background:
              "linear-gradient(90deg, #050935 18.27%, #0C4E78 58.17%, #0C4E78 71.15%, #1393BA 86.06%)",

            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            paddingLeft: "10px",
          }}
        >
          Digital Era
        </span>
      </Typography>{" "}
      <Typography
        component="p"
        variant="body2"
        sx={{
          fontSize: {
            xl: "24px",
            lg: "22px",
            md: "22px",
            sm: "20px",
            xs: "28px",
            mob: "16px",
          },
          fontWeight: "300",
          lineHeight: {
            lg: "130%",
            md: "120%",
            sm: "110%",
            xs: "100%",
            mob: "100%",
          },
          color: theme.palette.primary.secondMain,
          textAlign: "center",
          zIndex: "5",

          pt: "12px",
          px: "80px",
        }}
      >
        ToolsHub is a complete collection of online utilities designed to
        simplify everyday tasks. From creation to productivity, explore 100+
        tools that make your digital work faster and smarter.
      </Typography>
      <Stack
        direction="row"
        gap={2}
        sx={{
          flexWrap: "wrap",
          px: "40px",
          justifyContent: "center",
          pt: "20px",
        }}
      >
        {sortedTools.map((tool, i) => (
          <Stack
            key={i}
            component={Link}
            href={tool.href}
            sx={{
              background:
                "linear-gradient(180deg, rgba(175, 236, 255, 0.157059) 0%, rgba(204, 230, 230, 0.186) 50%, rgba(128, 192, 192, 0.2) 100%)",
              borderRadius: "60px",
              padding: "30px",
              backgroundClip: "padding-box, border-box",
              backgroundOrigin: "padding-box, border-box",
              backgroundImage: `
              linear-gradient(180deg, rgba(175, 236, 255, 0.157059) 0%, rgba(204, 230, 230, 0.186) 50%, rgba(128, 192, 192, 0.2) 100%), 
              linear-gradient(180deg, #80C0C0 0%, rgba(204, 230, 230, 0.93) 50%, #80C0C0 100%)
            `,
              border: "1px solid transparent",
              maxWidth: "432px", // Keeping existing maxWidth
              alignItems: "center",
              gap: "10px",
              py: "60px",
              cursor: "pointer",
            }}
          >
            {typeof tool.icon === "string" &&
            tool.icon.startsWith("/images/") ? (
              <Image
                src={tool.icon}
                alt={tool.primaryText}
                width={128} // Adjust width as needed
                height={128} // Adjust height as needed
                quality={100}
              />
            ) : (
              <tool.icon />
            )}
            <Typography
              component="h1"
              variant="body2"
              sx={{
                fontSize: {
                  xl: "35px",
                  lg: "25px",
                  md: "52px",
                  sm: "42px",
                  xs: "32px",
                  mob: "28px",
                },
                fontWeight: "600",
                lineHeight: { md: "130%", sm: "120%", xs: "100%", mob: "100%" },

                color: theme.palette.primary.main,
                textAlign: "center",
                zIndex: 5,
              }}
            >
              {tool.primaryText}
            </Typography>{" "}
            <Typography
              component="p"
              variant="body2"
              sx={{
                fontSize: {
                  xl: "18px",
                  lg: "18px",
                  md: "24px",
                  sm: "22px",
                  xs: "20px",
                  mob: "18px",
                },
                fontWeight: "300",
                lineHeight: {
                  lg: "130%",
                  md: "120%",
                  sm: "110%",
                  xs: "100%",
                  mob: "100%",
                },
                color: theme.palette.primary.secondMain,
                textAlign: "center",
                zIndex: "5",
              }}
            >
              {tool.secondaryText}
            </Typography>
          </Stack>
        ))}
      </Stack>
      <SectionMajorButton>Explore More</SectionMajorButton>
    </Stack>
  );
}
