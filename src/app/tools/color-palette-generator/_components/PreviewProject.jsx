"use client";
import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";

export default function PreviewProject({ palette = [] }) {
  const [primary, secondary, accent, bg, text] = [
    palette[0] || "#22C7FE",
    palette[1] || "#253164",
    palette[2] || "#61698b",
    palette[3] || "#f7f7f7",
    palette[4] || "#ffffff",
  ];

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        bgcolor: bg,
        transition: "all 0.4s ease",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: primary,
          color: text,
          p: { xs: 3, md: 5 },
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: 28, fontWeight: 700 }}>
          ToolsHub Demo Project
        </Typography>
        <Typography sx={{ mt: 1, fontSize: 16, color: text }}>
          See how your palette feels in action!
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 3,
            bgcolor: secondary,
            color: "#fff",
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: "8px",
            "&:hover": { bgcolor: accent },
          }}
        >
          Try it now
        </Button>
      </Box>

      {/* Cards */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          p: 3,
          justifyContent: "center",
          bgcolor: bg,
        }}
      >
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{
              bgcolor: "#fff",
              borderRadius: "12px",
              boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
              p: 2,
              textAlign: "center",
              flex: 1,
              transition: "all 0.3s ease",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <Typography sx={{ color: secondary, fontWeight: 600 }}>
              Card {i}
            </Typography>
            <Typography sx={{ fontSize: 14, color: accent, mt: 1 }}>
              Lorem ipsum dolor sit amet consectetur.
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
