"use client";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";

// For Carousel
import Carousel from "react-material-ui-carousel";

// For Masonry
import Masonry from "@mui/lab/Masonry";

export default function GalleryPage() {
  const searchParams = useSearchParams();

  const { layout, images } = useMemo(() => {
    const layout = searchParams.get("layout") || "grid";
    const images = searchParams.get("images")
      ? decodeURIComponent(searchParams.get("images")).split(",")
      : [];
    return { layout, images };
  }, [searchParams]);

  if (!images || images.length === 0) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Typography variant="h6" sx={{ color: "#616568" }}>
          No images provided in QR Code
        </Typography>
      </Stack>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ mb: 4, fontWeight: 600, color: "#253164" }}
      >
        Image Gallery ({layout})
      </Typography>

      {layout === "grid" && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 2,
          }}
        >
          {images.map((src, i) => (
            <Box
              key={i}
              component="img"
              src={src}
              alt={`img-${i}`}
              sx={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderRadius: "8px",
                boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
              }}
            />
          ))}
        </Box>
      )}

      {layout === "carousel" && (
        <Carousel
          autoPlay
          indicators
          navButtonsAlwaysVisible
          sx={{ maxWidth: 800, mx: "auto" }}
        >
          {images.map((src, i) => (
            <Box
              key={i}
              component="img"
              src={src}
              alt={`img-${i}`}
              sx={{
                width: "100%",
                height: 400,
                objectFit: "cover",
                borderRadius: "8px",
                boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
              }}
            />
          ))}
        </Carousel>
      )}

      {layout === "masonry" && (
        <Masonry columns={{ xs: 2, md: 3 }} spacing={2}>
          {images.map((src, i) => (
            <Box
              key={i}
              component="img"
              src={src}
              alt={`img-${i}`}
              sx={{
                width: "100%",
                display: "block",
                borderRadius: "8px",
                boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
              }}
            />
          ))}
        </Masonry>
      )}
    </Box>
  );
}
