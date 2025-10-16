"use client";
import { Button, Stack } from "@mui/material";
import React, { useState } from "react";
import theme from "../../styles/theme";
const navItems = [
  { title: "Code", href: "/" },
  { title: "Image", href: "/tools" },
  { title: "PDF", href: "/features" },
  { title: "Text", href: "/features" },
  { title: "File", href: "/features" },
  { title: "Web", href: "/features" },
  { title: "AI Tools", href: "/features" },
  { title: "Other", href: "/features" },
];
// const toolsThatDoMoreToolsData = [
//   {
//     primaryText: "Password Generator",
//     secondaryText:
//       "Create strong, secure, and random passwords to keep your accounts safe",
//     icon: PasswordGeneratorIcon,
//   },
//   {
//     primaryText: "QR Code Generator",
//     secondaryText:
//       "Instantly create custom QR codes for links, text, or contact info",
//     icon: QrCodeGeneratorIcon,
//   },
//   {
//     primaryText: "Color Palette Generator",
//     secondaryText:
//       "Build beautiful color combinations for your designs in one click",
//     icon: ColorPaletteGeneratorIcon,
//   },
//   {
//     primaryText: "JSON Formatter Validator",
//     secondaryText:
//       "Format, validate, and beautify JSON data for easy debugging",
//     icon: JsonFormatterValidatorIcon,
//   },
//   {
//     primaryText: "Lorem Ipsum Generator",
//     secondaryText:
//       "Quickly generate dummy text for your designs, mockups, and layouts",
//     icon: LoremIpsumGeneratorIcon,
//   },
//   {
//     primaryText: "Unit Converter",
//     secondaryText:
//       "Convert measurements like length, weight, and temperature instantly.",
//     icon: UnitConverterIcon,
//   },
// ];
export default function page() {
  const [acitveButton, setActiveButton] = useState(0);
  return (
    <Stack sx={{ alignItems: "center" }}>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          gap: "30px",
          display: { mob: "none", xs: "none", md: "none", lg: "flex" },
          border: "0.4px solid #09123a8f",
          p: "40px",
          borderRadius: "70px",
          py: "20px",
        }}
      >
        {navItems.map((item, i) => {
          const activeIndex = acitveButton === i;

          return (
            <Button
              key={i}
              //   component={Link}
              //   href={item.href}
              variant="text"
              sx={{
                color: activeIndex ? "#CCE6E6ED" : theme.palette.primary.main,
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "30px",
                textTransform: "none",
                borderRadius: "50px",
                "&:hover": {
                  color: activeIndex ? "#CCE6E6ED" : theme.palette.primary.main,
                },
                p: "20px",
                py: activeIndex ? "16px" : "0px",
                px: activeIndex ? "50px" : "0px",
                bgcolor: activeIndex ? theme.palette.primary.main : "none",
              }}
              onClick={() => setActiveButton(i)}
            >
              {item.title}
            </Button>
          );
        })}
      </Stack>
      {/* <Stack
        direction="row"
        gap={8}
        sx={{ flexWrap: "wrap", px: "40px", justifyContent: "center" }}
      >
        {toolsThatDoMoreToolsData.map((tool, i) => (
          <Stack
            key={i}
            component="button"
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
            <Box sx={{ pb: "20px" }}>
              <tool.icon />
            </Box>
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
      </Stack> */}
    </Stack>
  );
}
