import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import SectionMainPara from "../../components/common/SectionMainPara";
import SectionMainHeading from "../../components/common/SectionMainHeading";
import theme from "../../styles/theme";
const getResultsData = [
  {
    primaryText: "Find Your Tool",
    secondaryText:
      "Quickly explore our categories or use the search to locate the exact tool you need",
  },
  {
    primaryText: "Add Your Data",
    secondaryText:
      "Drag, drop, or type in your files and information. Our clean interface makes it smooth and easy.",
  },
  {
    primaryText: "Get Your Output",
    secondaryText:
      "Receive your converted files or results instantly — ready to use without any extra steps.",
  },
];
export default function GetResultsSection() {
  return (
    <Stack
      sx={{
        background:
          "radial-gradient(278.82% 508.63% at -133.28% -141.92%, rgba(204, 230, 230, 0.93) 38.69%, #80C0C0 42.78%, #09123A 84.42%)",

        px: { lg: "0px", md: "0px", sm: "100px", xs: "50px", mob: "0px" },
        py: "100px",
        px: "40px",
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
        direction="row"
        gap={8}
        sx={{ flexWrap: "wrap", justifyContent: "center", pt: "80px" }}
      >
        {getResultsData.map((tool, i) => (
          <Stack
            key={i}
            sx={{
              background:
                "linear-gradient(180deg, rgba(175, 236, 255, 0.157059) 0%, rgba(204, 230, 230, 0.186) 50%, rgba(128, 192, 192, 0.2) 100%)",
              borderRadius: "60px",
              padding: "30px",
              border: "1px solid #DDFDFDED",
              maxWidth: "432px",
              alignItems: "center",
              gap: "10px",
              py: "80px",
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
                px: "40px",
                py: "30px",
                borderRadius: "50%",
                color: theme.palette.primary.main,
                textAlign: "center",
                bgcolor: "#DDFDFDED",
                zIndex: 5,
              }}
            >
              {i + 1}
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

                color: "#DDFDFDED",
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
                color: "#ddfdfdb1",
                textAlign: "center",
                zIndex: "5",
              }}
            >
              {tool.secondaryText}
            </Typography>
          </Stack>
        ))}
      </Stack>
      <Stack
        sx={{
          background:
            "linear-gradient(180deg, rgba(175, 236, 255, 0.157059) 0%, rgba(204, 230, 230, 0.186) 50%, rgba(128, 192, 192, 0.2) 100%)",
          borderRadius: "30px",
          width: "100%",
          border: "1px solid #DDFDFDED",
          p: "44px",
          alignItems: "center",
          mt: "90px",
          mb: "30px",
        }}
      >
        <Typography
          component="p"
          variant="body2"
          sx={{
            fontSize: {
              xl: "35px",
              lg: "35px",
              md: "35px",
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
            color: "#ddfdfdb1",
            textAlign: "center",
            zIndex: "5",
            px: "280px",
          }}
        >
          Finish tasks in minutes, no setup required. Pure efficiency, zero
          hassle.
        </Typography>
      </Stack>
    </Stack>
  );
}
