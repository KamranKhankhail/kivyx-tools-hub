"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Button,
  IconButton,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import {
  generatePalette,
  hslToHex,
  contrastRatio,
  MOODS,
} from "@/app/tools/color-palette-generator/_components/colorUtils";
import PaletteCard from "./PaletteCard";

const DEFAULT_COUNT = 5;

function getTextColorForBg(hex) {
  // choose black or white based on contrast
  const darkContrast = contrastRatio(hex, "#000000");
  const whiteContrast = contrastRatio(hex, "#FFFFFF");
  return whiteContrast >= darkContrast ? "#FFFFFF" : "#000000";
}

export default function PaletteGenerator() {
  const [palette, setPalette] = useState(() =>
    generatePalette({ count: DEFAULT_COUNT })
  );
  const [locks, setLocks] = useState(() => Array(DEFAULT_COUNT).fill(false));
  const [mood, setMood] = useState("cool");
  const [count, setCount] = useState(DEFAULT_COUNT);

  const regenerate = useCallback(
    (opts = {}) => {
      // if some colors are locked, keep them
      const gen = generatePalette({ count, mood, randomness: 6, ...opts });
      if (locks.every((l) => !l)) {
        setPalette(gen);
        return;
      }
      // keep locked colors from current palette
      const currentHSL = palette.hsl || [];
      const newHsl = gen.hsl.slice();
      for (let i = 0; i < count; i++) {
        if (locks[i] && currentHSL[i]) {
          newHsl[i] = currentHSL[i];
        }
      }
      // ensure balanced and new meta
      setPalette({
        hsl: newHsl,
        hex: newHsl.map((c) => hslToHex(c.h, c.s, c.l)),
        meta: gen.meta,
      });
    },
    [locks, count, mood, palette]
  );

  // keybinding: space -> regenerate
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        regenerate();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [regenerate]);

  useEffect(() => {
    // update palette when mood changes
    regenerate();
  }, [mood]); // eslint-disable-line

  function toggleLock(i) {
    setLocks((prev) => {
      const copy = [...prev];
      copy[i] = !copy[i];
      return copy;
    });
  }

  function copyToClipboard(hex) {
    navigator.clipboard
      .writeText(hex)
      .then(() => {
        // small ephemeral feedback could be added
      })
      .catch(() => {});
  }

  function savePalette() {
    const stored = JSON.parse(
      localStorage.getItem("toolshub_palettes") || "[]"
    );
    stored.unshift(palette);
    localStorage.setItem(
      "toolshub_palettes",
      JSON.stringify(stored.slice(0, 50))
    );
    alert(
      'Palette saved to localStorage (ToolsHub) — open console or "Saved Palettes" panel to view.'
    );
  }

  function exportAsCss() {
    const vars = palette.hex
      .map((h, i) => `  --color-${i + 1}: ${h};`)
      .join("\n");
    const css = `:root {\n${vars}\n}`;
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "palette.css";
    a.click();
    URL.revokeObjectURL(url);
  }

  function shareLink() {
    const q = palette.hex.join(",");
    const url = `${location.origin}${
      location.pathname
    }?colors=${encodeURIComponent(q)}`;
    navigator.clipboard
      .writeText(url)
      .then(() => alert("Share link copied to clipboard!"));
  }

  // If page loaded with ?colors=... we should load them
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("colors");
    if (c) {
      const arr = c
        .split(",")
        .map((x) => x.trim())
        .filter((x) => x.length);
      if (arr.length >= 2) {
        // quick convert hex -> hsl using utility if present
        try {
          const fromUtils = arr.map((h) => {
            // ensure uppercase and # prefix
            const hx = h.startsWith("#")
              ? h.toUpperCase()
              : "#" + h.toUpperCase();
            const {
              h: hh,
              s,
              l,
            } = require("@/app/tools/color-palette-generator/_components/colorUtils")
              .hexToHsl
              ? {}
              : {}; // fallback (we don't need this)
            return hx;
          });
        } catch (e) {
          // ignore; we simply set palette hex
        }
        // fallback: set palette hex directly
        setPalette((prev) => ({ ...prev, hex: arr.slice(0, count) }));
      }
    }
  }, []); // run once

  // render
  const hexs =
    palette.hex ||
    (palette.hsl ? palette.hsl.map((c) => hslToHex(c.h, c.s, c.l)) : []);
  const score = palette.meta ? palette.meta.score : null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
        <Button
          startIcon={<ShuffleIcon />}
          variant="contained"
          onClick={() => regenerate()}
          sx={{ px: 2 }}
        >
          Generate (Space)
        </Button>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="mood-select-label">Mood</InputLabel>
          <Select
            labelId="mood-select-label"
            value={mood}
            label="Mood"
            onChange={(e) => setMood(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            {Object.keys(MOODS).map((k) => (
              <MenuItem key={k} value={k}>
                {k}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          startIcon={<SaveIcon />}
          variant="outlined"
          onClick={savePalette}
          sx={{ ml: "auto" }}
        >
          Save
        </Button>

        <Tooltip title="Export CSS variables">
          <IconButton onClick={exportAsCss}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Copy share link">
          <IconButton onClick={shareLink}>
            <ShareIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${count}, 1fr)`,
          gap: 2,
        }}
      >
        {Array.from({ length: count }).map((_, i) => {
          const hex = hexs[i] || "#CCCCCC";
          const sampleText = getTextColorForBg(hex);
          return (
            <PaletteCard
              key={i}
              hex={hex}
              index={i}
              locked={locks[i]}
              onToggleLock={toggleLock}
              onCopy={copyToClipboard}
              sampleTextColor={sampleText}
            />
          );
        })}
      </Box>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Score: <strong>{score ?? "—"}</strong>
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          (higher is better — hue spread, contrast, saturation balance)
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Button
          variant="outlined"
          onClick={() => {
            // export JSON
            const j = JSON.stringify(palette, null, 2);
            const blob = new Blob([j], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "palette.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export JSON
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            // quick copy hex list
            navigator.clipboard.writeText((hexs || []).join(", "));
            alert("HEX list copied to clipboard");
          }}
        >
          Copy HEX List
        </Button>
      </Box>
    </Box>
  );
}
