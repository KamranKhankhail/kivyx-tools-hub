"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Modal,
  TextField,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

// -------------------- Color utility functions --------------------
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const v = parseInt(clean, 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}
function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((n) => Math.round(n).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s,
    l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}
function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hk = h / 360;
  const t = [hk + 1 / 3, hk, hk - 1 / 3];
  const rgb = t.map((tt) => {
    let x = tt;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  });
  return {
    r: Math.round(rgb[0] * 255),
    g: Math.round(rgb[1] * 255),
    b: Math.round(rgb[2] * 255),
  };
}

function rotateHue(h, deg) {
  return (((h + deg) % 360) + 360) % 360;
}

function lightenHsl(hsl, percent) {
  return { h: hsl.h, s: hsl.s, l: clamp(hsl.l + percent, 0, 100) };
}
function darkenHsl(hsl, percent) {
  return { h: hsl.h, s: hsl.s, l: clamp(hsl.l - percent, 0, 100) };
}

// given base hex, produce N shades from light->dark (10 levels)
function generateShadesFromHex(hex, levels = 10) {
  const rgb = hexToRgb(hex);
  const baseHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const shades = [];
  // from lighter to darker: start l at min(95, base.l+40) down to max(5, base.l-40)
  const top = clamp(baseHsl.l + 40, 95, 95);
  const bottom = clamp(baseHsl.l - 40, 5, 5);
  for (let i = 0; i < levels; i++) {
    const t = i / (levels - 1);
    const l = top + (bottom - top) * t;
    const hsl = { h: baseHsl.h, s: baseHsl.s, l };
    const rgb2 = hslToRgb(hsl.h, hsl.s, hsl.l);
    shades.push({
      hex: rgbToHex(rgb2.r, rgb2.g, rgb2.b),
      rgb: `rgb(${rgb2.r}, ${rgb2.g}, ${rgb2.b})`,
    });
  }
  return shades;
}

// generate complementary, triad, analogous, tetrad, monochrome schemes (returns array of arrays of hex)
function generateSchemesFromHex(hex) {
  const rgb = hexToRgb(hex);
  const base = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const schemes = [];

  // Monochrome (vary lightness)
  const mono = [];
  for (let i = -2; i <= 2; i++) {
    const l = clamp(base.l + i * 8, 5, 95);
    const rgb2 = hslToRgb(base.h, base.s, l);
    mono.push(rgbToHex(rgb2.r, rgb2.g, rgb2.b));
  }
  schemes.push({ key: "Monochrome", colors: mono });

  // Complementary
  const compH = rotateHue(base.h, 180);
  const comp = [
    rgbToHex(
      ...Object.values(hslToRgb(base.h, base.s, clamp(base.l + 8, 5, 95)))
    ),
    rgbToHex(
      ...Object.values(hslToRgb(base.h, base.s, clamp(base.l - 6, 5, 95)))
    ),
    hex.toUpperCase(),
    rgbToHex(
      ...Object.values(hslToRgb(compH, base.s, clamp(base.l + 6, 5, 95)))
    ),
    rgbToHex(
      ...Object.values(hslToRgb(compH, base.s, clamp(base.l - 6, 5, 95)))
    ),
  ];
  schemes.push({ key: "Complementary", colors: comp });

  // Analogous (±30 & ±60)
  const analogous = [
    rgbToHex(
      ...Object.values(hslToRgb(rotateHue(base.h, -60), base.s, base.l))
    ),
    rgbToHex(
      ...Object.values(hslToRgb(rotateHue(base.h, -30), base.s, base.l))
    ),
    hex.toUpperCase(),
    rgbToHex(...Object.values(hslToRgb(rotateHue(base.h, 30), base.s, base.l))),
    rgbToHex(...Object.values(hslToRgb(rotateHue(base.h, 60), base.s, base.l))),
  ];
  schemes.push({ key: "Analogous", colors: analogous });

  // Triad (±120)
  const triad = [
    rgbToHex(
      ...Object.values(hslToRgb(rotateHue(base.h, -120), base.s, base.l))
    ),
    rgbToHex(
      ...Object.values(hslToRgb(rotateHue(base.h, -60), base.s, base.l))
    ),
    hex.toUpperCase(),
    rgbToHex(...Object.values(hslToRgb(rotateHue(base.h, 60), base.s, base.l))),
    rgbToHex(
      ...Object.values(hslToRgb(rotateHue(base.h, 120), base.s, base.l))
    ),
  ];
  schemes.push({ key: "Triad", colors: triad });

  // Tetrad (square) - 90 deg shifts
  const tetrad = [
    rgbToHex(
      ...Object.values(hslToRgb(rotateHue(base.h, -90), base.s, base.l))
    ),
    rgbToHex(
      ...Object.values(hslToRgb(rotateHue(base.h, -30), base.s, base.l))
    ),
    hex.toUpperCase(),
    rgbToHex(...Object.values(hslToRgb(rotateHue(base.h, 60), base.s, base.l))),
    rgbToHex(
      ...Object.values(hslToRgb(rotateHue(base.h, 150), base.s, base.l))
    ),
  ];
  schemes.push({ key: "Tetrad", colors: tetrad });

  return schemes;
}

// small helper to produce "modern-looking random" palettes: pick a pleasing hue and derive shifts
function smartRandomPalette() {
  // pick a base hue from popular ranges (blues, teals, mauves, warm)
  const popularHueRanges = [
    [190, 220], // blue-cyan
    [180, 200], // cyan-teal
    [200, 230], // blue
    [8, 30], // warm oranges
    [320, 350], // pinks
    [40, 60], // yellows
    [260, 290], // purples
  ];
  const range =
    popularHueRanges[Math.floor(Math.random() * popularHueRanges.length)];
  const baseHue = Math.round(range[0] + Math.random() * (range[1] - range[0]));
  const palette = [];
  // central color
  const central = hslToRgb(baseHue, 65, 50);
  palette.push(rgbToHex(central.r, central.g, central.b));
  // accent darker
  const d1 = hslToRgb(rotateHue(baseHue, -20), 60, 35);
  palette.push(rgbToHex(d1.r, d1.g, d1.b));
  // soft neutral
  const n1 = hslToRgb(220, 8, 92);
  palette.push(rgbToHex(n1.r, n1.g, n1.b));
  // mid tone
  const m1 = hslToRgb(rotateHue(baseHue, 35), 55, 60);
  palette.push(rgbToHex(m1.r, m1.g, m1.b));
  // deep accent
  const a1 = hslToRgb(rotateHue(baseHue, 160), 45, 30);
  palette.push(rgbToHex(a1.r, a1.g, a1.b));
  return palette;
}

// -------------------- Component --------------------
export default function ColorPaletteGenerator({ onPaletteChange }) {
  const [colors, setColors] = useState([]);
  const [builtInPalettes, setBuiltInPalettes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [shadeModal, setShadeModal] = useState({
    open: false,
    shades: [],
    base: "",
  });
  const [schemeModal, setSchemeModal] = useState({
    open: false,
    schemes: [],
    base: "",
  });
  const [userColorInput, setUserColorInput] = useState("");
  const [userColors, setUserColors] = useState([]);

  // init: smart palette + some curated built-ins
  useEffect(() => {
    setColors(
      smartRandomPalette().map((c) => ({
        code: c,
        locked: false,
      }))
    );

    // curated built-in palettes (a few nice sets)
    const curated = [
      ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"],
      ["#0F1724", "#1F2937", "#3B82F6", "#60A5FA", "#F8FAFC"],
      ["#0B3C5D", "#1E656D", "#F6D55C", "#ED553B", "#3CAEA3"],
      ["#1B1F3B", "#4C4F6D", "#7E7F9A", "#D6D7E0", "#FFFFFF"],
      ["#22C7FE", "#1F8FD3", "#253164", "#61698B", "#F7F7F7"],
      ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#3A3A3A"],
    ];
    setBuiltInPalettes(curated);
  }, []);

  useEffect(() => {
    if (colors.length > 0 && typeof onPaletteChange === "function") {
      onPaletteChange(colors.map((c) => c.code));
    }
  }, [colors, onPaletteChange]);

  // actions
  const randomize = () => {
    setColors((prev) =>
      smartRandomPalette().map((c, i) => {
        const old = prev[i];
        return old && old.locked ? old : { code: c, locked: false };
      })
    );
  };

  const toggleLock = (i) =>
    setColors((p) =>
      p.map((c, idx) => (idx === i ? { ...c, locked: !c.locked } : c))
    );

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
  };

  const addColorSlot = () =>
    setColors((prev) =>
      prev.length < 8 ? [...prev, { code: randomColor(), locked: false }] : prev
    );

  const removeColorSlot = (i) =>
    setColors((prev) => prev.filter((_, idx) => idx !== i));

  const applyBuiltInPalette = (p) =>
    setColors(p.map((c) => ({ code: c, locked: false })));

  // **** ONLY CHANGE: clicking a color now opens the SHADES modal ****
  // shades modal
  const openShades = (hex) => {
    const shades = generateShadesFromHex(hex, 10);
    setShadeModal({ open: true, shades, base: hex.toUpperCase() });
  };

  // schemes modal (kept intact — not removed — user can still generate schemes via buttons elsewhere)
  const openSchemesForColor = (hex) => {
    const schemes = generateSchemesFromHex(hex);
    setSchemeModal({ open: true, schemes, base: hex.toUpperCase() });
  };

  // user input handling
  const sanitizeHex = (v) => {
    if (!v) return null;
    let t = v.trim().toUpperCase();
    if (t.startsWith("#")) t = t.slice(1);
    if (t.length === 3)
      t = t
        .split("")
        .map((c) => c + c)
        .join("");
    if (!/^[0-9A-F]{6}$/.test(t)) return null;
    return `#${t}`;
  };

  const addUserColor = () => {
    const hex = sanitizeHex(userColorInput);
    if (!hex) {
      alert("Enter a valid 6-digit hex like #22C7FE or 22C7FE");
      return;
    }
    setUserColors((prev) => (prev.includes(hex) ? prev : [...prev, hex]));
    setUserColorInput("");
  };

  const generateSchemesFromUserColors = () => {
    if (userColors.length === 0)
      return alert("Add at least one color in the top input.");
    const all = [];
    userColors.forEach((c) => {
      const s = generateSchemesFromHex(c);
      s.forEach((item) =>
        all.push({ base: c, mode: item.key, colors: item.colors })
      );
    });
    // show generated schemes in the schemes modal grouped by base
    setSchemeModal({ open: true, schemes: all, base: userColors.join(", ") });
  };

  return (
    <Stack spacing={3} alignItems="center" sx={{ width: "100%" }}>
      <Typography sx={{ fontSize: 24, fontWeight: 600, color: "#253164" }}>
        🎨 Color Palette Generator (Client-only, No APIs)
      </Typography>

      {/* user color input + add */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 1000,
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="#22C7FE or 22C7FE"
          value={userColorInput}
          onChange={(e) => setUserColorInput(e.target.value)}
          size="small"
          sx={{ width: "60%", maxWidth: 380 }}
        />
        <Button
          variant="contained"
          onClick={addUserColor}
          sx={{ bgcolor: "#22C7FE", color: "#fff", textTransform: "none" }}
        >
          Add Color
        </Button>
        <Button
          variant="outlined"
          onClick={generateSchemesFromUserColors}
          sx={{ textTransform: "none" }}
        >
          Generate Schemes from My Colors
        </Button>
      </Box>

      {/* show user colors */}
      {userColors.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ flexWrap: "wrap", maxWidth: 1000 }}
        >
          {userColors.map((c) => (
            <Box
              key={c}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#fff",
                px: 1,
                py: "6px",
                borderRadius: "8px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
              }}
            >
              <Box
                sx={{ width: 28, height: 28, bgcolor: c, borderRadius: "6px" }}
              />
              <Typography sx={{ fontSize: 13, color: "#253164" }}>
                {c}
              </Typography>
              <Tooltip title="Copy HEX">
                <IconButton size="small" onClick={() => copyText(c)}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy RGB">
                <IconButton
                  size="small"
                  onClick={() =>
                    copyText(
                      (() => {
                        const r = hexToRgb(c);
                        return `rgb(${r.r}, ${r.g}, ${r.b})`;
                      })()
                    )
                  }
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Remove">
                <IconButton
                  size="small"
                  onClick={() => setUserColors((p) => p.filter((x) => x !== c))}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Stack>
      )}

      {/* current palette slots */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ flexWrap: "wrap", justifyContent: "center", width: "100%" }}
      >
        {colors.map((c, i) => (
          <Box
            key={i}
            sx={{
              width: { xs: "100%", sm: "150px" },
              height: { xs: "90px", sm: "150px" },
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            {/* <- ONLY change: clicking color now opens shades (not schemes) */}
            <Box
              sx={{ flex: 1, bgcolor: c.code }}
              onClick={() => openShades(c.code)}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "#fff",
                px: 1,
                py: 0.5,
              }}
            >
              <Typography sx={{ fontSize: 13, color: "#253164" }}>
                {c.code.toUpperCase()}
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <Tooltip title="Copy HEX">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyText(c.code);
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy RGB">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      const r = hexToRgb(c.code);
                      copyText(`rgb(${r.r}, ${r.g}, ${r.b})`);
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={c.locked ? "Unlock" : "Lock"}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLock(i);
                    }}
                  >
                    {c.locked ? (
                      <LockIcon fontSize="small" />
                    ) : (
                      <LockOpenIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remove">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeColorSlot(i);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>

      {/* actions */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          startIcon={<ShuffleIcon />}
          onClick={randomize}
          sx={{
            bgcolor: "#22C7FE",
            color: "#fff",
            fontWeight: 600,
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          Randomize (Smart)
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addColorSlot}
          sx={{
            bgcolor: "#90c52d",
            color: "#fff",
            fontWeight: 600,
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          Add Color
        </Button>
      </Stack>

      {/* built-in palettes with search */}
      <Box sx={{ width: "100%", maxWidth: 1000 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "#fff",
              px: 2,
              py: "6px",
              borderRadius: "10px",
              boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
              width: "80%",
              maxWidth: 420,
            }}
          >
            <SearchIcon sx={{ color: "#61698b" }} />
            <input
              placeholder="Search palettes by hex..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                fontSize: 14,
              }}
            />
          </Box>
        </Box>

        <Stack direction="row" flexWrap="wrap" gap={3} justifyContent="center">
          {builtInPalettes
            .filter((p) =>
              p.join(" ").toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((palette, idx) => (
              <Box
                key={idx}
                onClick={() => applyBuiltInPalette(palette)}
                sx={{
                  width: 220,
                  borderRadius: "14px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  "&:hover": { transform: "scale(1.04)" },
                }}
              >
                <Box sx={{ display: "flex", height: 60 }}>
                  {palette.map((c, i) => (
                    <Box
                      key={i}
                      sx={{
                        flex: 1,
                        bgcolor: c,
                        borderRight:
                          i < palette.length - 1
                            ? "1px solid rgba(255,255,255,0.3)"
                            : "none",
                      }}
                    />
                  ))}
                </Box>
                <Box sx={{ bgcolor: "#fff", py: 1 }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#253164",
                      textAlign: "center",
                    }}
                  >
                    Palette #{idx + 1}
                  </Typography>
                </Box>
              </Box>
            ))}
        </Stack>
      </Box>

      {/* generated schemes (modal) */}
      <Modal
        open={schemeModal.open}
        onClose={() => setSchemeModal({ open: false, schemes: [], base: "" })}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#fff",
            borderRadius: 3,
            p: 3,
            boxShadow: 24,
            width: "92%",
            maxWidth: 1000,
          }}
        >
          <Typography
            sx={{ mb: 2, fontWeight: 700, fontSize: 18, color: "#253164" }}
          >
            Generated Schemes — base: {schemeModal.base}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={2}>
            {schemeModal.schemes.map((s, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 220,
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                }}
              >
                <Box sx={{ display: "flex", height: 60 }}>
                  {s.colors.map((c, i) => (
                    <Box
                      key={i}
                      sx={{ flex: 1, bgcolor: c, cursor: "pointer" }}
                      onClick={() => {
                        setSchemeModal({ ...schemeModal, open: false });
                        openSchemesForColor(c);
                      }}
                    />
                  ))}
                </Box>
                <Box sx={{ p: 1, bgcolor: "#fff" }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                    {s.mode}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#61698b" }}>
                    {s.base}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Modal>

      {/* shades modal */}
      <Modal
        open={shadeModal.open}
        onClose={() => setShadeModal({ open: false, shades: [], base: "" })}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#fff",
            borderRadius: 3,
            p: 3,
            boxShadow: 24,
            width: "92%",
            maxWidth: 560,
          }}
        >
          <Typography
            sx={{ mb: 2, fontWeight: 700, fontSize: 18, color: "#253164" }}
          >
            Shades of {shadeModal.base}
          </Typography>
          <Stack spacing={1}>
            {shadeModal.shades.map((s, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: s.hex,
                  color: "#fff",
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                }}
              >
                <Typography sx={{ fontSize: 14 }}>{s.hex}</Typography>
                <Box>
                  <Tooltip title="Copy HEX (6-digit)">
                    <IconButton
                      size="small"
                      onClick={() => copyText(s.hex)}
                      sx={{ color: "#fff" }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy RGB">
                    <IconButton
                      size="small"
                      onClick={() => copyText(s.rgb)}
                      sx={{ color: "#fff" }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Modal>
    </Stack>
  );
}
