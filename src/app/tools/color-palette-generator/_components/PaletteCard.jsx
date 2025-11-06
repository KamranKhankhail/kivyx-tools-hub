// src/components/PaletteCard.jsx
import React from "react";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function PaletteCard({
  hex,
  index,
  locked,
  onToggleLock,
  onCopy,
  sampleTextColor,
}) {
  return (
    <Box
      sx={{
        width: "100%",
        height: 160,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        boxShadow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, bgcolor: hex }} />
      <Box sx={{ position: "relative", zIndex: 2, p: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: sampleTextColor, fontWeight: 700 }}
          >
            {hex}
          </Typography>
          <Box>
            <Tooltip title={locked ? "Unlock" : "Lock"}>
              <IconButton
                size="small"
                onClick={() => onToggleLock(index)}
                sx={{ color: sampleTextColor }}
              >
                {locked ? (
                  <LockIcon fontSize="small" />
                ) : (
                  <LockOpenIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy hex">
              <IconButton
                size="small"
                onClick={() => onCopy(hex)}
                sx={{ color: sampleTextColor }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box
          sx={{
            mt: 1,
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: sampleTextColor, fontWeight: 600 }}
          >
            Aa
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: sampleTextColor, opacity: 0.9 }}
          >
            Preview
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
