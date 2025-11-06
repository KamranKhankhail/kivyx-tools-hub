// src/utils/colorUtils.js
// Color utilities and palette generator for ToolsHub (no external deps)

// clamp helper
function clamp(v, a, b) {
  return Math.min(b, Math.max(a, v));
}

// HSL -> RGB (0..255)
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
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  const r = hue2rgb(p, q, hk + 1 / 3);
  const g = hue2rgb(p, q, hk);
  const b = hue2rgb(p, q, hk - 1 / 3);
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToHex({ r, g, b }) {
  const toHex = (v) => v.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function hslToHex(h, s, l) {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb);
}

export function hexToHsl(hex) {
  const h = hex.replace("#", "");
  if (h.length !== 6) throw new Error("hex must be 6-digit");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let hh = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        hh = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        hh = (b - r) / d + 2;
        break;
      case b:
        hh = (r - g) / d + 4;
        break;
    }
    hh *= 60;
  }
  return { h: Math.round(hh), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// luminance & contrast
function srgbToLin(v) {
  if (v <= 0.03928) return v / 12.92;
  return Math.pow((v + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
}

export function contrastRatio(hexA, hexB) {
  const L1 = relativeLuminance(hexA);
  const L2 = relativeLuminance(hexB);
  const light = Math.max(L1, L2),
    dark = Math.min(L1, L2);
  return (light + 0.05) / (dark + 0.05);
}

// helpers
function normalizeHue(h) {
  return ((h % 360) + 360) % 360;
}
function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

// harmony generators
function generateHarmony(
  baseHSL,
  type = "analogous",
  count = 5,
  opts = { randomness: 6 }
) {
  const { h, s, l } = baseHSL;
  const rr = opts.randomness || 6;
  const out = [];
  function slight(val, delta) {
    return val + (Math.random() * 2 - 1) * delta;
  }
  if (type === "monochrome") {
    const lights = [
      clamp(l - 20, 0, 100),
      clamp(l - 8, 0, 100),
      l,
      clamp(l + 8, 0, 100),
      clamp(l + 20, 0, 100),
    ];
    for (let i = 0; i < count; i++) {
      const li = lights[i % lights.length];
      const ss = clamp(slight(s, rr * 1.1), 10, 95);
      out.push({ h: normalizeHue(h), s: Math.round(ss), l: Math.round(li) });
    }
  } else if (type === "analogous") {
    const spread = 30;
    const step = spread / Math.max(1, count - 1);
    const start = h - spread / 2;
    for (let i = 0; i < count; i++) {
      const hh = normalizeHue(start + step * i + (Math.random() * rr - rr / 2));
      const ss = clamp(s + (Math.random() * rr - rr / 2), 15, 95);
      const ll = clamp(l + (Math.random() * rr - rr / 2), 8, 95);
      out.push({ h: Math.round(hh), s: Math.round(ss), l: Math.round(ll) });
    }
  } else if (type === "complementary") {
    const opp = normalizeHue(h + 180);
    out.push({
      h: Math.round(h),
      s: Math.round(clamp(s + (Math.random() * rr - rr / 2), 15, 95)),
      l: Math.round(clamp(l + (Math.random() * rr - rr / 2), 8, 95)),
    });
    out.push({
      h: Math.round(opp),
      s: Math.round(clamp(s + (Math.random() * rr - rr / 2), 15, 95)),
      l: Math.round(clamp(l + (Math.random() * rr - rr / 2), 8, 95)),
    });
    for (let i = 2; i < count; i++) {
      const anchor = i % 2 === 0 ? h : opp;
      out.push({
        h: normalizeHue(anchor + (Math.random() * rr - rr / 2)),
        s: Math.round(clamp(s * 0.9, 10, 95)),
        l: Math.round(clamp(l + (i % 2 ? 10 : -10), 5, 95)),
      });
    }
  } else if (type === "split") {
    const a = normalizeHue(h + 150),
      b = normalizeHue(h + 210);
    out.push({ h: Math.round(h), s: Math.round(s), l: Math.round(l) });
    out.push({
      h: Math.round(a),
      s: Math.round(clamp(s - 5, 15, 95)),
      l: Math.round(clamp(l + (Math.random() * 8 - 4), 8, 95)),
    });
    out.push({
      h: Math.round(b),
      s: Math.round(clamp(s - 5, 15, 95)),
      l: Math.round(clamp(l + (Math.random() * 8 - 4), 8, 95)),
    });
    for (let i = 3; i < count; i++)
      out.push({
        h: normalizeHue(h + i * 15 + (Math.random() * rr - rr / 2)),
        s: Math.round(clamp(s - 10, 15, 95)),
        l: Math.round(clamp(l + i * 3, 5, 95)),
      });
  } else if (type === "triadic") {
    const a = normalizeHue(h + 120),
      b = normalizeHue(h + 240);
    const bases = [h, a, b];
    for (let i = 0; i < count; i++) {
      const anchor = bases[i % 3];
      out.push({
        h: Math.round(anchor + (Math.random() * rr - rr / 2)),
        s: Math.round(clamp(s + (i % 2 ? 5 : -5), 15, 95)),
        l: Math.round(clamp(l + (i % 3 === 0 ? 5 : -5), 8, 95)),
      });
    }
  } else if (type === "tetradic") {
    const a = normalizeHue(h + 90),
      b = normalizeHue(h + 180),
      c = normalizeHue(h + 270);
    const bases = [h, a, b, c];
    for (let i = 0; i < count; i++) {
      const anchor = bases[i % 4];
      out.push({
        h: Math.round(anchor + (Math.random() * rr - rr / 2)),
        s: Math.round(clamp(s + (Math.random() * 8 - 4), 15, 95)),
        l: Math.round(clamp(l + (Math.random() * 8 - 4), 8, 95)),
      });
    }
  } else {
    return generateHarmony(baseHSL, "analogous", count, opts);
  }
  return out
    .slice(0, count)
    .map((c) => ({
      h: normalizeHue(c.h),
      s: clamp(Math.round(c.s), 0, 100),
      l: clamp(Math.round(c.l), 0, 100),
    }));
}

export const MOODS = {
  warm: { hueRange: [0, 60], satRange: [55, 90], lightRange: [35, 75] },
  cool: { hueRange: [180, 240], satRange: [35, 80], lightRange: [40, 80] },
  minimal: { hueRange: [0, 360], satRange: [0, 20], lightRange: [70, 95] },
  luxury: { hueRange: [250, 300], satRange: [35, 85], lightRange: [20, 55] },
  playful: { hueRange: [0, 360], satRange: [65, 100], lightRange: [45, 75] },
  nature: { hueRange: [60, 160], satRange: [35, 85], lightRange: [30, 70] },
  pastel: { hueRange: [0, 360], satRange: [15, 50], lightRange: [75, 95] },
  dark: { hueRange: [0, 360], satRange: [30, 90], lightRange: [8, 30] },
};

export function applyMood(paletteHSL, moodKey = "cool") {
  const mood = MOODS[moodKey] || MOODS["cool"];
  return paletteHSL.map((c) => {
    const h = (function () {
      const [a, b] = mood.hueRange;
      if (a <= b)
        return Math.round(
          clamp(Math.max(Math.min(c.h, b), a) + (Math.random() * 10 - 5), a, b)
        );
      const lowWrap =
        c.h >= a || c.h <= b ? c.h : a + Math.random() * (b + 360 - a);
      return Math.round(normalizeHue(lowWrap + (Math.random() * 10 - 5)));
    })();
    const s = Math.round(
      clamp(c.s + (Math.random() * 8 - 4), mood.satRange[0], mood.satRange[1])
    );
    const l = Math.round(
      clamp(
        c.l + (Math.random() * 8 - 4),
        mood.lightRange[0],
        mood.lightRange[1]
      )
    );
    return { h, s, l };
  });
}

function lightStep(l, step) {
  return l + step;
}

export function balancePalette(hslArray, opts = {}) {
  const arr = hslArray.slice();
  let hasLight = arr.some((c) => c.l >= 70);
  let hasDark = arr.some((c) => c.l <= 30);
  if (!hasLight) {
    const idx = arr.length - 1;
    arr[idx].l = clamp(arr[idx].l + 30, 60, 95);
  }
  if (!hasDark) {
    arr[0].l = clamp(arr[0].l - 30, 5, 35);
  }
  const avgSat = arr.reduce((s, c) => s + c.s, 0) / arr.length;
  if (avgSat > 70 && opts.injectNeutral !== false) {
    const mid = arr[Math.floor(arr.length / 2)];
    const neutral = {
      h: mid.h,
      s: clamp(Math.round(mid.s * 0.15), 0, 30),
      l: clamp(Math.round(mid.l + 10), 50, 95),
    };
    arr[Math.floor(arr.length / 2)] = neutral;
  }
  arr.sort((a, b) => b.l - a.l);
  return arr;
}

export function hslPaletteToHex(hslArr) {
  return hslArr.map((c) => hslToHex(c.h, c.s, c.l));
}

export function scorePalette(hslArr) {
  if (!hslArr || hslArr.length === 0) return 0;
  const hues = hslArr.map((c) => c.h);
  const sorted = [...hues].sort((a, b) => a - b);
  let gaps = [];
  for (let i = 0; i < sorted.length; i++) {
    const a = sorted[i],
      b = sorted[(i + 1) % sorted.length];
    const gap = i === sorted.length - 1 ? sorted[0] + 360 - sorted[i] : b - a;
    gaps.push(gap);
  }
  const maxGap = Math.max(...gaps);
  const hueSpreadScore = clamp((maxGap / 180) * 40, 0, 40);
  const hasLight = hslArr.some((c) => c.l >= 70);
  const hasDark = hslArr.some((c) => c.l <= 30);
  const contrastScore = hasLight && hasDark ? 20 : hasLight || hasDark ? 10 : 0;
  const sats = hslArr.map((c) => c.s);
  const avgSat = sats.reduce((a, b) => a + b, 0) / sats.length;
  const satScore = clamp(30 - Math.abs(avgSat - 55) * 0.5, 0, 30);
  const total = Math.round(hueSpreadScore + contrastScore + satScore);
  return clamp(total, 0, 100);
}

/**
 * generatePalette(options)
 * options = {
 *   baseHue: number (0..360) optional,
 *   type: 'analogous'|'complementary'|'triadic'|'tetradic'|'monochrome'|'split',
 *   count: number (default 5),
 *   mood: 'warm'|'cool'|...,
 *   randomness: number (0..20)
 * }
 */
export function generatePalette(options = {}) {
  const count = options.count || 5;
  const baseHue =
    typeof options.baseHue === "number"
      ? normalizeHue(options.baseHue)
      : Math.floor(Math.random() * 360);
  const baseS = clamp(
    options.baseS || Math.round(randomBetween(40, 80)),
    10,
    95
  );
  const baseL = clamp(
    options.baseL || Math.round(randomBetween(35, 65)),
    5,
    95
  );
  const base = { h: baseHue, s: baseS, l: baseL };
  const types = [
    "analogous",
    "complementary",
    "triadic",
    "tetradic",
    "monochrome",
    "split",
  ];
  const type = options.type || types[Math.floor(Math.random() * types.length)];
  const raw = generateHarmony(base, type, count, {
    randomness: options.randomness || 6,
  });
  const mooded = options.mood ? applyMood(raw, options.mood) : raw;
  const balanced = balancePalette(mooded, {
    injectNeutral: options.injectNeutral !== false,
  });
  const hex = hslPaletteToHex(balanced);
  const score = scorePalette(balanced);
  return {
    hsl: balanced,
    hex,
    meta: {
      base,
      type,
      mood: options.mood || null,
      randomness: options.randomness || 6,
      score,
    },
  };
}
