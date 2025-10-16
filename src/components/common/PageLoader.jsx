"use client";

import React, { useState, useEffect } from "react";
import { Box, keyframes } from "@mui/material";
import { usePathname } from "next/navigation";

const bounceY = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-18px); }
`;

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const PageLoader = () => {
  const [loading, setLoading] = useState(false);
  const [fading, setFading] = useState(false);
  const [targetPath, setTargetPath] = useState(null);
  const pathname = usePathname();

  // Prevent body scroll when loader is active
  useEffect(() => {
    if (loading) {
      const scrollY = window.scrollY;

      const preventScroll = (e) => {
        e.preventDefault();
        window.scrollTo(0, scrollY);
      };

      document.addEventListener("wheel", preventScroll, { passive: false });
      document.addEventListener("touchmove", preventScroll, { passive: false });
      document.addEventListener("keydown", (e) => {
        if (
          [
            "ArrowUp",
            "ArrowDown",
            "PageUp",
            "PageDown",
            "Home",
            "End",
          ].includes(e.key)
        ) {
          e.preventDefault();
        }
      });

      return () => {
        document.removeEventListener("wheel", preventScroll);
        document.removeEventListener("touchmove", preventScroll);
      };
    }
  }, [loading]);

  useEffect(() => {
    if (loading && targetPath) {
      const targetPathWithoutHash = targetPath.split("#")[0];
      const currentPathWithoutHash = pathname.split("#")[0];

      const isAnchorNavigation = targetPath.includes("#");

      let shouldCloseLoader = false;
      // let closeDelay = 800;
      let closeDelay = 400;

      if (!isAnchorNavigation) {
        shouldCloseLoader = pathname === targetPath;
      } else {
        shouldCloseLoader = currentPathWithoutHash === targetPathWithoutHash;
        // closeDelay = 500;
        closeDelay = 200;
      }

      if (shouldCloseLoader) {
        const timer = setTimeout(() => {
          setFading(true);
          setTimeout(() => {
            setLoading(false);
            setFading(false);
            setTargetPath(null);
          }, 100);
        }, closeDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [pathname, loading, targetPath]);

  useEffect(() => {
    const handleClick = (e) => {
      const linkElement = e.target.closest("a[href]");
      if (linkElement) {
        const href = linkElement.getAttribute("href");

        if (
          href &&
          href.startsWith("/") &&
          !href.startsWith("//") &&
          href !== pathname
        ) {
          setLoading(true);
          setFading(false);
          setTargetPath(href);

          requestAnimationFrame(() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          );
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  if (!loading) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background:
          "radial-gradient(235.53% 235.53% at 4.6% 4.14%, #FFFFFF 0%, #CCE6E6 33.29%, #AAD5D5 59.74%, #80C0C0 85.16%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)",
        animation: fading ? `${fadeOut} 0.2s ease-out forwards` : "none",
      }}
    >
      <Box sx={{ display: "flex", gap: "16px" }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: "#008081",
              animation: `${bounceY} 0.6s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PageLoader;
