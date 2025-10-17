import React from "react";
import theme from "../../styles/theme";
import { Typography } from "@mui/material";
export default function SectionMainPara({
  children,
  color = "",
  pb = "40px",
  pt = "23px",
}) {
  return (
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
        color: color.length > 1 ? color : theme.palette.primary.secondMain,
        textAlign: "center",
        zIndex: "5",
        pb: pb,
        pt: pt,
      }}
    >
      {children}
    </Typography>
  );
}
