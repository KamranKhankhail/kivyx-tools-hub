"use client";
import { useSearchParams } from "next/navigation";
import { Box, Stack, Typography } from "@mui/material";

export default function GalleryView() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("data");

  if (!encoded) {
    return <Typography>No gallery data found</Typography>;
  }

  let payload;
  try {
    payload = JSON.parse(atob(encoded));
  } catch (e) {
    return <Typography>Invalid gallery data</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "500", color: "#253164", mb: 2 }}
      >
        Image Gallery
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 2,
        }}
      >
        {payload.images.map((url, i) => (
          <Box
            key={i}
            component="img"
            src={url}
            alt={`Gallery ${i}`}
            sx={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "2px solid #adf2fa",
            }}
          />
        ))}
      </Box>
    </Stack>
  );
}
