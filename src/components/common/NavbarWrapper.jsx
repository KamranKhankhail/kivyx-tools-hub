"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Stack } from "@mui/material";

const NavbarWrapper = () => {
  const pathname = usePathname();

  // Add all routes where navbar should be hidden
  const hiddenRoutes = [
    "/tools/merge-pdfs",
    "/tools/split-pdfs",
    "/tools/compress-pdfs",
    "/tools/convert-pdf",
    "/tools/universal-unit-converter",
    "/tools/rotate-pdf-pages",
    "/tools/delete-pdf-pages",
    "/tools/image-format-converter",
  ];

  const shouldShowNavbar = !hiddenRoutes.includes(pathname);

  return shouldShowNavbar ? (
    <Stack sx={{ pt: "85px", overflow: "hidden" }}>
      <Navbar />
    </Stack>
  ) : null;
};

export default NavbarWrapper;
