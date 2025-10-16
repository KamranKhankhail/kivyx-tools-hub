import { Stack, Typography } from "@mui/material";
import React from "react";
import SectionMainHeading from "../../components/common/SectionMainHeading";
import SectionMainPara from "../../components/common/SectionMainPara";
import theme from "../../styles/theme";
import WhyToolsCrossIcon from "../_components/icons/WhyToolsCrossIcon";
import WhyToolsTickIcon from "../_components/icons/WhyToolsTickIcon";
const whyToolshubData = [
  {
    primaryText: "Tired of searching multiple websites for different tools?",
    secondaryText: "Tools Hub brings them all together.",
  },
  {
    primaryText: "Struggling with complex interfaces?",
    secondaryText: "Enjoy a clean, simple experience.",
  },
  {
    primaryText: "Waiting forever for results?",
    secondaryText: "Get instant outputs in seconds.",
  },
];
export default function WhytoolshubSection() {
  return (
    <Stack
      sx={{
        background:
          "radial-gradient(278.82% 508.63% at -133.28% -141.92%, rgba(204, 230, 230, 0.93) 0%, #09123A 50%, #80C0C0 100%)",

        px: { lg: "40px", md: "40px", sm: "100px", xs: "50px", mob: "0px" },
        py: "120px",

        position: "relative", // IMPORTANT: This Stack needs to be relative for absolute children
        alignItems: "center", // Center content horizontally
      }}
    >
      <SectionMainHeading color="#DDFDFDED">
        Get Results in Just 3 Steps
      </SectionMainHeading>
      <SectionMainPara pt="10px" color="#ddfdfdb3">
        We’ve designed our process to be effortless and efficient — no
        confusion, no delays, just results.
      </SectionMainPara>
      <Stack
        direction="column"
        gap={8}
        sx={{ justifyContent: "center", pt: "80px" }}
      >
        {whyToolshubData.map((tool, i) => (
          <Stack
            key={i}
            sx={{
              background:
                "linear-gradient(180deg, rgba(175, 236, 255, 0.157059) 0%, rgba(204, 230, 230, 0.186) 50%, rgba(128, 192, 192, 0.2) 100%)",
              borderRadius: "30px",
              padding: "40px",
              px: "50px",
              pr: "100px",
              border: "0.5px solid #DDFDFDED",
              width: "100%",
              alignItems: "start",
              gap: "20px",
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
                color: theme.palette.primary.thirdMain,

                zIndex: 5,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "20px",
              }}
            >
              {<WhyToolsCrossIcon />} {tool.primaryText}
            </Typography>
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
                color: theme.palette.primary.thirdMain,

                zIndex: 5,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "20px",
              }}
            >
              {<WhyToolsTickIcon />} {tool.secondaryText}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
