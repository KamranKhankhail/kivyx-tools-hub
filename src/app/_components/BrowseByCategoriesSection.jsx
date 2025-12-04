import React from "react";
import { Box, Stack, Typography } from "@mui/material"; // Import Stack and Typography
import SectionMainHeading from "../../components/common/SectionMainHeading";
import SectionMainPara from "../../components/common/SectionMainPara";
import theme from "../../styles/theme";
import CodeToolsIcon from "../_components/icons/CodeToolsIcon";
import PdfMergeIcon from "./icons/PdfMergeIcon";
import Image from "next/image";
const getResultsData = [
  {
    primaryText: "PDF Tools – Merge, Split, Rotate, Extract & Delete",
    secondaryText:
      "Handle all your PDF tasks in one place. Merge, split, rotate, and delete pages with simple, fast, and reliable tools:",
    features: [
      "Merge multiple PDFs into one organized file",
      "Split PDFs into individual pages or custom ranges",
      "Rotate PDF pages left, right, or 180°",
      "Delete unwanted or blank pages from PDFs",
    ],
    popularPicks:
      "Try popular picks: Merge PDFs, Split PDFs, Rotate PDFs, Delete PDFs",
    icon: PdfMergeIcon,
  },

  {
    primaryText: "Image Tools – Convert & Optimize",
    secondaryText:
      "Work with images effortlessly. Convert image formats instantly and prepare files for web or design use:",
    features: [
      "Convert JPG, PNG, WEBP, and GIF formats",
      "Maintain high-quality output while converting",
      "Ideal for designers, developers, and editors",
    ],
    popularPicks: "Try popular picks: Image Format Converter",
    icon: "/images/homepageIcons/imageFormatConverterIcon.png",
  },

  {
    primaryText: "Essential Utility Tools",
    secondaryText:
      "Useful everyday tools that help you generate passwords, create QR codes, convert units, and explore color palettes:",
    features: [
      "Generate secure, random passwords instantly",
      "Create custom QR codes for links, WiFi, and more",
      "Convert units like temperature, weight, currency, etc.",
      "Find beautiful nature-inspired color palettes",
    ],
    popularPicks:
      "Try popular picks: Password Generator, QR Code Generator, Unit Converter",
    icon: "/images/homepageIcons/passwordGeneratorIcon.png",
  },
];

export default function BrowseByCategoriesSection() {
  return (
    <Stack
      sx={{
        px: { lg: "100px", md: "40px", sm: "100px", xs: "50px", mob: "0px" },
        my: { lg: "180px", md: "180px", sm: "160px", xs: "130px", mob: "90px" },

        position: "relative",
        alignItems: "center",
      }}
    >
      <Box sx={{ px: "30px" }}>
        <SectionMainHeading>Browse by Categories</SectionMainHeading>
        <SectionMainPara pt="10px">
          Easily navigate Tools Hub with well structured categories designed to
          guide you straight to the tool you need
        </SectionMainPara>
      </Box>
      <Stack
        direction="column"
        gap={8}
        sx={{
          flexWrap: "wrap",
          justifyContent: "center",
          pt: { lg: "80px", md: "80px", sm: "80px", xs: "50px", mob: "20px" },

          flex: 1,
        }}
      >
        {getResultsData.map((tool, i) => (
          <Stack
            key={i}
            sx={{
              flex: 1,
              background:
                "linear-gradient(180deg, rgba(175, 236, 255, 0.157059) 0%, rgba(204, 230, 230, 0.186) 50%, rgba(128, 192, 192, 0.2) 100%)",
              borderRadius: {
                lg: "40px",
                md: "40px",
                sm: "40px",
                xs: "30px",
                mob: "20px",
              },
              padding: {
                lg: "30px",
                md: "30px",
                sm: "30px",
                xs: "28px",
                mob: "26px",
              },
              border: "0.5px solid #09123A",

              alignItems: "start",
              gap: "10px",
              py: "60px",
              px: "70px",
              mx: "10px",
            }}
          >
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

                zIndex: 5,
                display: "flex",
                flexDirection: "row",
                gap: "20px",
                pb: "18px",
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
                color: theme.palette.primary.main,

                zIndex: "5",
                mb: tool.features ? "20px" : "0px", // Add bottom margin if features exist
              }}
            >
              {tool.secondaryText}
            </Typography>
            {/* Features List */}
            {tool.features && (
              <Stack
                sx={{
                  alignItems: "start",
                  gap: "10px",
                  width: "100%",
                  //   px: "20px",
                }}
              >
                {tool.features.map((feature, idx) => (
                  <Stack
                    key={idx}
                    direction="row"
                    alignItems="flex-start"
                    gap="10px"
                  >
                    <Box
                      sx={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        bgcolor: theme.palette.primary.main, // Dot color
                        mt: "8px", // Align with text
                      }}
                    />
                    <Typography
                      component="li"
                      variant="body2"
                      sx={{
                        fontSize: {
                          xl: "16px",
                          lg: "16px",
                          md: "20px",
                          sm: "18px",
                          xs: "16px",
                          mob: "14px",
                        },
                        fontWeight: "300",
                        lineHeight: "150%",
                        color: theme.palette.primary.main,
                        textAlign: "start", // Align text to start
                      }}
                    >
                      {feature}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
            {/* Popular Picks */}
            {tool.popularPicks && (
              <Typography
                component="p"
                variant="body2"
                sx={{
                  fontSize: {
                    xl: "16px",
                    lg: "16px",
                    md: "20px",
                    sm: "18px",
                    xs: "16px",
                    mob: "14px",
                  },
                  fontWeight: "300",
                  lineHeight: "150%",
                  p: "20px",
                  border: "0.4px solid #09123A",
                  borderRadius: "70px",
                  px: "40px",
                  color: theme.palette.primary.main,
                  textAlign: "center",
                  mt: "14px",
                  "& strong": {
                    fontWeight: "600",
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <strong>Try popular picks:</strong> {tool.popularPicks}
              </Typography>
            )}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
