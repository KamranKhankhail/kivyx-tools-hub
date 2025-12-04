"use client";
import { usePathname, useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";

export default function NotFoundClient() {
  const pathname = usePathname();
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back(); // ✅ Go to previous page
    } else {
      router.push("/"); // ✅ If no history, go home
    }
  };

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
        gap: "8px",
        background:
          "radial-gradient(425.23% 208% at -81.08% -22.7%, rgba(255, 255, 255, 0.870588) 0%, rgba(175, 236, 255, 0.785294) 65.51%, rgba(204, 230, 230, 0.93) 100%)",
      }}
    >
      {/* Friendly Emoji */}
      <Typography component="div" sx={{ fontSize: "36px", mb: 2 }}>
        🔍
      </Typography>

      {/* Error Code */}
      <Typography
        variant="h1"
        fontWeight="bold"
        sx={{ fontSize: "20px", color: "#253164", mb: 1 }}
      >
        404
      </Typography>

      {/* Title */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Page Not Found
      </Typography>

      {/* Description with badge for pathname */}
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, lineHeight: 1.6, maxWidth: 500 }}
      >
        The page you are looking for{" "}
        <Box
          component="span"
          sx={{
            display: "inline-block",
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            bgcolor: "#253164",
            color: "white",
            fontWeight: "bold",
            fontSize: "0.9rem",
            mx: 0.5,
          }}
        >
          {pathname}
        </Box>{" "}
        does not exist or may have been moved.
      </Typography>

      {/* Back Button */}
      <Button sx={{ borderRadius: 2, px: 4, py: 1.5 }} onClick={handleBack}>
        Go Back
      </Button>
    </Box>
  );
}
