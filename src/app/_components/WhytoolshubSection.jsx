import { Box, Stack, Typography } from "@mui/material";
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
      <Box sx={{ px: "30px" }}>
        <SectionMainHeading color="#DDFDFDED">
          Why tools hub is different?
        </SectionMainHeading>

        <SectionMainPara pt="10px" color="#ddfdfdb3">
          Because we focus on speed and simplicity, so you get results without
          the usual hassle.
        </SectionMainPara>
      </Box>
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
              borderRadius: {
                lg: "40px",
                md: "40px",
                sm: "40px",
                xs: "30px",
                mob: "20px",
              },
              padding: {
                lg: "40px",
                md: "40px",
                sm: "30px",
                xs: "28px",
                mob: "26px",
              },
              px: "50px",
              pr: "100px",
              border: "0.5px solid #DDFDFDED",
              width: {
                lg: "100%",
                md: "100%",
                sm: "100%",
                xs: "100%",
                mob: "auto",
              },
              alignItems: "start",
              gap: "20px",
              mx: "10px",
            }}
          >
            <Typography
              component="h1"
              variant="body2"
              sx={{
                fontSize: {
                  xl: "30px",
                  lg: "28px",
                  md: "26px",
                  sm: "22px",
                  xs: "20px",
                  mob: "18px",
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
                  xl: "30px",
                  lg: "28px",
                  md: "26px",
                  sm: "22px",
                  xs: "20px",
                  mob: "18px",
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
