"use client";
import { Button } from "@mui/material";
import React from "react";

export default function NavbarButton({
  fontSize = "14px",
  px = "30px",
  py = "17px",
  iosLink = "https://apple.co/3xfPeyW", // Added iosLink prop with default
  androidLink = "https://play.google.com/store/apps/details?id=com.kivyx.islamencyclo&hl=en", // Added androidLink prop with default
}) {
  // Platform detection logic
  const getDownloadLink = () => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent || navigator.vendor;
      if (/android/i.test(ua)) return androidLink;
      if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return iosLink;
    }
    return androidLink; // Default to Android if platform not detected or not in browser
  };

  const handleDownload = () => {
    const link = getDownloadLink();
    if (link) window.open(link, "_blank");
  };

  return (
    <Button
      variant="contained"
      // onClick={handleDownload} // Attached the handleDownload function to onClick
      sx={{
        minWidth: "auto",
        width: "auto",
        textTransform: "none",
        color: "#ffffff",
        bgcolor: "#09123A",
        boxShadow: "0px 10px 50px 0px #00000040",
        fontSize: fontSize,
        fontWeight: "500",
        borderRadius: "10px",
        px: px,
        height: "max-content",
        py: py,
        "&:hover": {
          bgcolor: "#09123a80",
          color: "#ffffff",
          boxShadow: "0px 10px 50px 0px #00000040",
        },
        "&:active": {
          boxShadow: "none",
          transition: "none",
        },
        "&:focus": {
          boxShadow: "none",
          transition: "none",
        },
      }}
    >
      Get Started
    </Button>
  );
}
