import theme from "../../styles/theme";
import { Typography } from "@mui/material";
import React from "react";

export default function SectionMainHeading({
  children,
  px = {
    xl: "60px",
    lg: "50px",
    md: "40px",
    sm: "30px",
    xs: "20px",
    mob: "10px",
  },
  color = "",
}) {
  return (
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

        color: color === "" ? theme.palette.primary.main : color,
        textAlign: "center",
        zIndex: 5,
        px: px,
      }}
    >
      {children}
    </Typography>
  );
}
