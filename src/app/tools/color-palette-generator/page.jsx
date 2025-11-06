// app/page.js
import React from "react";
import PaletteGenerator from "@/app/tools/color-palette-generator/_components/PaletteGenerator";
import { Box } from "@mui/material";

export default function Page() {
  return (
    <Box>
      <PaletteGenerator />
    </Box>
  );
}
