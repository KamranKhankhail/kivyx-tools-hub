"use client";
import { Button } from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter

export default function SectionMajorButton({
  children,
  my = { lg: "90px", md: "90px", sm: "70px", xs: "60px", mob: "30px" },
  iosLink = "https://apple.co/3xfPeyW", // Default iOS link
  androidLink = "https://play.google.com/store/apps/details?id=com.kivyx.islamencyclo&hl=en",
  href = "",
}) {
  const router = useRouter();

  // Platform detection logic (for "Download Now" functionality)
  const getDownloadLink = () => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent || navigator.vendor;
      if (/android/i.test(ua)) return androidLink;
      if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return iosLink;
    }
    return androidLink; // Default to Android if platform not detected or not in browser
  };

  const handleAction = () => {
    if (children === "Download Now") {
      const link = getDownloadLink();
      if (link) window.open(link, "_blank");
    } else if (children === "Explore More") {
      router.push("/tools"); // Navigate to the features page
    }
    // Add other conditional actions here if needed for other children text
  };

  return (
    <Button
      variant="contained"
      onClick={handleAction} // Use the new handleAction function
      sx={{
        minWidth: "auto",
        width: "auto",
        textTransform: "none",
        color: "#ffffff",
        bgcolor: "#09123A",
        boxShadow: " 0px 10px 50px 0px #00000040",
        fontSize: {
          lg: "30px",
          md: "30px",
          sm: "28px",
          xs: "24px",
          mob: "22px",
        },
        fontWeight: "500",
        borderRadius: "10px",
        px: "70px",
        height: "max-content",
        py: "30px",
        lineHeight: "109%",
        "&:hover": {
          bgcolor: "#09123abf",
          color: "#ffffff",
          boxShadow: " 0px 10px 50px 0px #00000040",
          transition: "all .5s cubic-bezier(0.4, 0, 0.2, 1)",
        },
        "&:active": {
          boxShadow: "none",
          transition: "none",
        },
        "&:focus": {
          boxShadow: "none",
          transition: "none",
        },
        my: my,
      }}
    >
      {children}
    </Button>
  );
}
