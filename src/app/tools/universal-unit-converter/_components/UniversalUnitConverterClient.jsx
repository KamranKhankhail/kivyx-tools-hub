"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";

import {
  Search,
  ArrowRightLeft,
  Star,
  History,
  X,
  ChevronDown,
  ChevronUp,
  Copy, // Import Copy icon for the copy button
} from "lucide-react";
import { Box, Stack } from "@mui/material";
import Link from "next/link";
import ToolsHubsIcon from "@/icons/ToolsHubsIcon";
import theme from "@/styles/theme";
import ThemeRegistry from "@/styles/ThemeRegistry";

// API Configuration for Currency Converter
const EXCHANGE_RATE_API_KEY = "07b08cdc2c129775d2b8f0c0"; // Your provided API key
const EXCHANGE_RATE_API_BASE_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/`;

// Helper to parse time strings (HH:MM) into Date objects
const parseTime = (timeString) => {
  if (!timeString || !timeString.includes(":")) return new Date(NaN); // Handle invalid time format
  const [hours, minutes] = timeString.split(":").map(Number);
  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return new Date(NaN); // Invalid hour/minute values
  }
  const d = new Date(); // Use current date, only time matters here for comparison
  d.setHours(hours, minutes, 0, 0);
  return d;
};
const factorial = (n) => {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // Prevent overflow
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};
// ===== COMPLETE CONVERSION LOGIC WITH ALL YOUR CONVERTERS =====
const converters = {
  "Length / Distance": {
    units: [
      "Meter (m)",
      "Kilometer (km)",
      "Decimeter (dm)", // Added
      "Centimeter (cm)",
      "Millimeter (mm)",
      "Micrometer (µm)",
      "Nanometer (nm)",
      "Mile (mi, mi(Int))", // Added (international mile, assuming same as statute mile)
      "Yard (yd)",
      "Foot (ft)",
      "Inch (in)",
      "Light year (ly)", // Added
      "Exameter (Em)", // Added
      "Petameter (Pm)", // Added
      "Terameter (Tm)", // Added
      "Gigameter (Gm)", // Added
      "Megameter (Mm)", // Added
      "Hectometer (hm)", // Added
      "Dekameter (dam)", // Added
      "Micron (µ)", // Added (same as micrometer)
      "Picometer (pm)", // Added
      "Femtometer (fm)", // Added
      "Attometer (am)", // Added
      "Megaparsec (Mpc)", // Added
      "Kiloparsec (kpc)", // Added
      "Parsec (pc)", // Added
      "Astronomical unit (AU, UA)", // Added
      "League (lea)", // Added
      "Nautical league (UK)", // Added
      "Nautical league (int.)", // Added
      "League (statute) (st.league)", // Added
      "Nautical mile (UK) (NM (UK))", // Added
      "Nautical mile (international)", // Added
      "Mile (statute) (mi, mi (US))", // Added (assuming US statute mile for mi (US))
      "Mile (US survey) (mi)", // Added
      "Mile (Roman)", // Added
      "Kiloyard (kyd)", // Added
      "Furlong (fur)", // Added
      "Furlong (US survey) (fur)", // Added
      "Chain (ch)", // Added
      "Chain (US survey) (ch)", // Added
      "Rope", // Added
      "Rod (rd)", // Added
      "Rod (US survey) (rd)", // Added
      "Perch", // Added (same as rod)
      "Pole", // Added (same as rod)
      "Fathom (fath)", // Added
      "Fathom (US survey) (fath)", // Added
      "Ell", // Added
      "Foot (US survey) (ft)", // Added
      "Link (li)", // Added
      "Link (US survey) (li)", // Added
      "Cubit (UK)", // Added
      "Handspan (cloth)", // Added
      "Finger (cloth)", // Added
      "Nail (cloth)", // Added
      "Inch (US survey) (in)", // Added
      "Barleycorn", // Added
      "Mil (mil, thou)", // Added
      "Microinch", // Added
      "Angstrom (A)", // Added
      "A.u. of length (a.u., b)", // Added (Bohr radius)
      "X-unit (X)", // Added
      "Fermi (F, f)", // Added
      "Arpent", // Added
      "Pica", // Added
      "Point", // Added
      "Twip", // Added
      "Nfamn", // Added (assuming a placeholder if not a standard unit)
      "Caliber (cl)", // Added
      "Centiinch (cin)", // Added
      "Ken", // Added
      "Russian archin", // Added
      "Roman actus", // Added
      "Vara de tarea", // Added (assuming a placeholder if not a standard unit)
      "Vara conuquera", // Added (assuming a placeholder if not a standard unit)
      "Vara castellana", // Added (assuming a placeholder if not a standard unit)
      "Cubit (Greek)", // Added
      "Long reed", // Added (assuming a placeholder if not a standard unit)
      "Reed", // Added (assuming a placeholder if not a standard unit)
      "Long cubit", // Added (assuming a placeholder if not a standard unit)
      "Handbreadth", // Added
      "Fingerbreadth", // Added
      "Planck length", // Added
      "Electron radius (classical)", // Added
      "Bohr radius (b, a.u.)", // Added (same as a.u. of length)
      "Earth's equatorial radius", // Added
      "Earth's polar radius", // Added
      "Earth's distance from sun", // Added
      "Sun's radius", // Added
    ],
    factors: {
      "Meter (m)": 1,
      "Centimeter (cm)": 0.01,
      "Millimeter (mm)": 0.001,
      "Kilometer (km)": 1000,
      "Inch (in)": 0.0254,
      "Foot (ft)": 0.3048,
      "Yard (yd)": 0.9144,
      "Mile (mi)": 1609.34,
      "Nautical mile (nmi)": 1852,
      "Micrometer (µm)": 0.000001,
      "Nanometer (nm)": 0.000000001,
      "Decimeter (dm)": 0.1,
      "Mile (mi, mi(Int))": 1609.344, // International mile
      "Light year (ly)": 9.4607e15,
      "Exameter (Em)": 1e18,
      "Petameter (Pm)": 1e15,
      "Terameter (Tm)": 1e12,
      "Gigameter (Gm)": 1e9,
      "Megameter (Mm)": 1e6,
      "Hectometer (hm)": 100,
      "Dekameter (dam)": 10,
      "Micron (µ)": 1e-6, // Same as micrometer
      "Picometer (pm)": 1e-12,
      "Femtometer (fm)": 1e-15,
      "Attometer (am)": 1e-18,
      "Megaparsec (Mpc)": 3.085677581e22,
      "Kiloparsec (kpc)": 3.085677581e19,
      "Parsec (pc)": 3.085677581e16,
      "Astronomical unit (AU, UA)": 1.495978707e11,
      "League (lea)": 4828.032, // 3 miles
      "Nautical league (UK)": 5556, // 3 UK nautical miles
      "Nautical league (int.)": 5556, // 3 international nautical miles
      "League (statute) (st.league)": 4828.032, // Same as league
      "Nautical mile (UK) (NM (UK))": 1853.184,
      "Nautical mile (international)": 1852, // Already present, kept for consistency
      "Mile (statute) (mi, mi (US))": 1609.344,
      "Mile (US survey) (mi)": 1609.347,
      "Mile (Roman)": 1481.5,
      "Kiloyard (kyd)": 914.4, // 1000 yards
      "Furlong (fur)": 201.168, // 1/8 mile
      "Furlong (US survey) (fur)": 201.1684, // US survey furlong
      "Chain (ch)": 20.1168, // 1/10 furlong
      "Chain (US survey) (ch)": 20.11684, // US survey chain
      Rope: 6.096, // 20 feet
      "Rod (rd)": 5.0292, // 16.5 feet
      "Rod (US survey) (rd)": 5.02921, // US survey rod
      Perch: 5.0292, // Same as rod
      Pole: 5.0292, // Same as rod
      "Fathom (fath)": 1.8288, // 6 feet
      "Fathom (US survey) (fath)": 1.828804, // US survey fathom
      Ell: 1.143, // 45 inches
      "Foot (US survey) (ft)": 0.3048006, // US survey foot
      "Link (li)": 0.201168, // 7.92 inches
      "Link (US survey) (li)": 0.2011684, // US survey link
      "Cubit (UK)": 0.4572, // 18 inches
      "Handspan (cloth)": 0.2286, // 9 inches
      "Finger (cloth)": 0.1143, // 4.5 inches
      "Nail (cloth)": 0.05715, // 2.25 inches
      "Inch (US survey) (in)": 0.02540005, // US survey inch
      Barleycorn: 0.008466666, // 1/3 inch
      "Mil (mil, thou)": 0.0000254, // 1/1000 inch
      Microinch: 2.54e-8, // 10^-6 inch
      "Angstrom (A)": 1e-10,
      "A.u. of length (a.u., b)": 5.29177210903e-11, // Bohr radius
      "X-unit (X)": 1.0021e-13,
      "Fermi (F, f)": 1e-15,
      Arpent: 58.47, // Parisian arpent approx 58.47m (historical)
      Pica: 0.004233333, // DTP pica, 1/72 foot
      Point: 0.0003527777, // DTP point, 1/12 pica
      Twip: 0.00001763888, // 1/20 point
      Nfamn: 0.3048, // Assuming 1 foot
      "Caliber (cl)": 0.0000254, // 1/1000 inch, same as mil
      "Centiinch (cin)": 0.000254, // 1/100 inch
      Ken: 1.818, // Japanese unit, ~1.818 meters
      "Russian archin": 0.7112, // ~0.7112 meters
      "Roman actus": 35.48, // ~35.48 meters
      "Vara de tarea": 0.8359, // ~0.8359 meters (Spanish/Portuguese unit)
      "Vara conuquera": 0.8359, // Assuming same as Vara de tarea
      "Vara castellana": 0.8359, // Assuming same as Vara de tarea
      "Cubit (Greek)": 0.462, // ~0.462 meters
      "Long reed": 3.2, // Assuming a common historical "reed" length
      Reed: 2.5, // Assuming a common historical "reed" length
      "Long cubit": 0.525, // Assuming a longer variation of cubit
      Handbreadth: 0.0762, // 3 inches
      Fingerbreadth: 0.01905, // 0.75 inches
      "Planck length": 1.616255e-35,
      "Electron radius (classical)": 2.8179403262e-15,
      "Bohr radius (b, a.u.)": 5.29177210903e-11, // Already listed as a.u. of length
      "Earth's equatorial radius": 6.378137e6,
      "Earth's polar radius": 6.356752e6,
      "Earth's distance from sun": 1.496e11, // Astronomical Unit (average)
      "Sun's radius": 6.957e8,
    },
    type: "unit",
    keywords: [
      "distance",
      "length",
      "nautical mile",
      "micrometer",
      "nanometer",
      "meter",
      "centimeter",
      "millimeter",
      "kilometer",
      "inch",
      "foot",
      "yard",
      "mile",
      "light year",
      "exameter",
      "petameter",
      "terameter",
      "gigameter",
      "megameter",
      "hectometer",
      "dekameter",
      "micron",
      "picometer",
      "femtometer",
      "attometer",
      "parsec",
      "astronomical unit",
      "league",
      "furlong",
      "chain",
      "rod",
      "perch",
      "pole",
      "fathom",
      "ell",
      "link",
      "cubit",
      "handspan",
      "finger",
      "nail",
      "barleycorn",
      "mil",
      "thou",
      "microinch",
      "angstrom",
      "bohr radius",
      "x-unit",
      "fermi",
      "arpent",
      "pica",
      "point",
      "twip",
      "nfamn",
      "caliber",
      "centiinch",
      "ken",
      "russian archin",
      "roman actus",
      "vara",
      "greek cubit",
      "reed",
      "handbreadth",
      "fingerbreadth",
      "planck length",
      "electron radius",
      "earth radius",
      "sun radius",
    ],
  },
  "Weight / Mass": {
    units: [
      "Kilogram (kg)",
      "Gram (g)",
      "Milligram (mg)",
      "Microgram (µg)",
      "Tonne (t)",
      "Pound (lb)",
      "Ounce (oz)",
      "Imperial ton (LT)",
      "US ton (ST)",
      "Stone (st)",
      "Carat (car, ct)", // Added
      "Atomic mass unit (u)", // Added
      "Exagram (Eg)", // Added
      "Petagram (Pg)", // Added
      "Teragram (Tg)", // Added
      "Gigagram (Gg)", // Added
      "Megagram (Mg)", // Added
      "Hectogram (hg)", // Added
      "Dekagram (dag)", // Added
      "Decigram (dg)", // Added
      "Centigram (cg)", // Added
      "Nanogram (ng)", // Added
      "Picogram (pg)", // Added
      "Femtogram (fg)", // Added
      "Attogram (ag)", // Added
      "Dalton", // Added (same as Atomic mass unit)
      "Kilopound (kip)", // Added
      "Slug", // Added
      "Pound (troy or apothecary)", // Added
      "Poundal (pdl)", // Added
      "Ton (assay) (US) (AT (US))", // Added
      "Ton (assay) (UK) (AT (UK))", // Added
      "Kiloton (metric) (kt)", // Added
      "Quintal (metric) (cwt)", // Added
      "Hundredweight (US)", // Added
      "Hundredweight (UK)", // Added
      "Quarter (US) (qr (US))", // Added
      "Quarter (UK) (qr (UK))", // Added
      "Stone (US)", // Added
      "Stone (UK)", // Added
      "Pennyweight (pwt)", // Added
      "Scruple (apothecary) (s.ap)", // Added
      "Grain (gr)", // Added
      "Gamma", // Added (same as Microgram)
      "Talent (Biblical Hebrew)", // Added
      "Mina (Biblical Hebrew)", // Added
      "Shekel (Biblical Hebrew)", // Added
      "Bekan (Biblical Hebrew)", // Added
      "Gerah (Biblical Hebrew)", // Added
      "Talent (Biblical Greek)", // Added
      "Mina (Biblical Greek)", // Added
      "Tetradrachma (Biblical Greek)", // Added
      "Didrachma (Biblical Greek)", // Added
      "Drachma (Biblical Greek)", // Added
      "Denarius (Biblical Roman)", // Added
      "Assarion (Biblical Roman)", // Added
      "Quadrans (Biblical Roman)", // Added
      "Lepton (Biblical Roman)", // Added
      "Planck mass", // Added
      "Electron mass (rest)", // Added
      "Muon mass", // Added
      "Proton mass", // Added
      "Neutron mass", // Added
      "Deuteron mass", // Added
      "Earth's mass", // Added
      "Sun's mass", // Added
    ],
    factors: {
      "Kilogram (kg)": 1,
      "Gram (g)": 0.001,
      "Milligram (mg)": 0.000001,
      "Microgram (µg)": 0.000000001,
      "Tonne (t)": 1000,
      "Pound (lb)": 0.453592,
      "Ounce (oz)": 0.0283495,
      "Imperial ton (LT)": 1016.0469088,
      "US ton (ST)": 907.18474,
      "Stone (st)": 6.35029318,
      "Carat (car, ct)": 0.0002, // 1 carat = 0.2 grams = 0.0002 kg
      "Atomic mass unit (u)": 1.6605390666e-27, // 1 u in kg
      "Exagram (Eg)": 1e18, // 1 Eg = 10^18 g = 10^15 kg
      "Petagram (Pg)": 1e15, // 1 Pg = 10^15 g = 10^12 kg
      "Teragram (Tg)": 1e12, // 1 Tg = 10^12 g = 10^9 kg
      "Gigagram (Gg)": 1e9, // 1 Gg = 10^9 g = 10^6 kg
      "Megagram (Mg)": 1e6, // 1 Mg = 10^6 g = 10^3 kg (same as tonne)
      "Hectogram (hg)": 0.1, // 1 hg = 100 g = 0.1 kg
      "Dekagram (dag)": 0.01, // 1 dag = 10 g = 0.01 kg
      "Decigram (dg)": 0.0001, // 1 dg = 0.1 g = 0.0001 kg
      "Centigram (cg)": 0.00001, // 1 cg = 0.01 g = 0.00001 kg
      "Nanogram (ng)": 1e-12, // 1 ng = 10^-9 g = 10^-12 kg
      "Picogram (pg)": 1e-15, // 1 pg = 10^-12 g = 10^-15 kg
      "Femtogram (fg)": 1e-18, // 1 fg = 10^-15 g = 10^-18 kg
      "Attogram (ag)": 1e-21, // 1 ag = 10^-18 g = 10^-21 kg
      Dalton: 1.6605390666e-27, // Same as Atomic mass unit
      "Kilopound (kip)": 453.592, // 1 kip = 1000 lbf, but as mass 1 kip = 1000 lb = 453.592 kg
      Slug: 14.5939, // 1 slug in kg
      "Pound (troy or apothecary)": 0.3732417216, // 1 troy pound = 0.3732417216 kg
      "Poundal (pdl)": 0.138254954376, // 1 poundal = 0.138254954376 N, related to force not mass directly, but often used in context. Using value for mass equivalent in earth gravity. (approx)
      "Ton (assay) (US) (AT (US))": 0.0291666666667, // 1 assay ton (US) = 29.1666666667 g
      "Ton (assay) (UK) (AT (UK))": 0.0326666666667, // 1 assay ton (UK) = 32.6666666667 g
      "Kiloton (metric) (kt)": 1000000, // 1 kiloton = 1,000,000 kg
      "Quintal (metric) (cwt)": 100, // 1 quintal = 100 kg
      "Hundredweight (US)": 45.3592, // 1 US hundredweight = 100 lb = 45.3592 kg
      "Hundredweight (UK)": 50.8023, // 1 UK hundredweight = 112 lb = 50.8023 kg
      "Quarter (US) (qr (US))": 11.3398, // 1 US quarter = 25 lb = 11.3398 kg
      "Quarter (UK) (qr (UK))": 12.7006, // 1 UK quarter = 28 lb = 12.7006 kg
      "Stone (US)": 6.35029, // 1 US stone = 14 lb = 6.35029 kg
      "Stone (UK)": 6.35029318, // 1 UK stone = 14 lb = 6.35029318 kg (already present, kept for consistency)
      "Pennyweight (pwt)": 0.00155517384, // 1 pwt = 1.55517384 g = 0.00155517384 kg
      "Scruple (apothecary) (s.ap)": 0.0012959782, // 1 scruple = 1.2959782 g = 0.0012959782 kg
      "Grain (gr)": 0.00006479891, // 1 grain = 0.06479891 g = 0.00006479891 kg
      Gamma: 1e-9, // 1 gamma = 1 microgram (µg) = 1e-9 kg
      "Talent (Biblical Hebrew)": 34.2, // ~34.2 kg (approximation)
      "Mina (Biblical Hebrew)": 0.57, // ~0.57 kg (approximation)
      "Shekel (Biblical Hebrew)": 0.0114, // ~0.0114 kg (approximation)
      "Bekan (Biblical Hebrew)": 0.0057, // ~0.0057 kg (approximation)
      "Gerah (Biblical Hebrew)": 0.00057, // ~0.00057 kg (approximation)
      "Talent (Biblical Greek)": 20.4, // ~20.4 kg (approximation)
      "Mina (Biblical Greek)": 0.34, // ~0.34 kg (approximation)
      "Tetradrachma (Biblical Greek)": 0.0136, // ~0.0136 kg (approximation)
      "Didrachma (Biblical Greek)": 0.0068, // ~0.0068 kg (approximation)
      "Drachma (Biblical Greek)": 0.0034, // ~0.0034 kg (approximation)
      "Denarius (Biblical Roman)": 0.0039, // ~0.0039 kg (approximation)
      "Assarion (Biblical Roman)": 0.0008, // ~0.0008 kg (approximation)
      "Quadrans (Biblical Roman)": 0.0002, // ~0.0002 kg (approximation)
      "Lepton (Biblical Roman)": 0.00005, // ~0.00005 kg (approximation)
      "Planck mass": 2.17647e-8, // Planck mass in kg
      "Electron mass (rest)": 9.1093837015e-31, // Electron rest mass in kg
      "Muon mass": 1.883531594e-28, // Muon mass in kg
      "Proton mass": 1.67262192369e-27, // Proton mass in kg
      "Neutron mass": 1.67492749804e-27, // Neutron mass in kg
      "Deuteron mass": 3.3435837724e-27, // Deuteron mass in kg
      "Earth's mass": 5.972e24, // Earth's mass in kg
      "Sun's mass": 1.989e30, // Sun's mass in kg
    },
    type: "unit",
    keywords: [
      "mass",
      "weight",
      "tonne",
      "microgram",
      "nanogram",
      "picogram",
      "femtogram",
      "attogram",
      "dalton",
      "kiloton",
      "quintal",
      "hundredweight",
      "quarter",
      "stone",
      "pennyweight",
      "scruple",
      "grain",
      "gamma",
      "talent",
      "mina",
      "shekel",
      "bekan",
      "gerah",
      "tetradrachma",
      "didrachma",
      "drachma",
      "denarius",
      "assarion",
      "quadrans",
      "lepton",
      "planck mass",
      "electron mass",
      "muon mass",
      "proton mass",
      "neutron mass",
      "deuteron mass",
      "earth's mass",
      "sun's mass",
      "ton",
      "stone",
      "pound",
      "ounce",
      "kilogram",
      "gram",
      "milligram",
      "carat",
      "atomic mass unit",
      "exagram",
      "petagram",
      "teragram",
      "gigagram",
      "megagram",
      "hectogram",
      "dekagram",
      "decigram",
      "centigram",
      "kip",
      "slug",
      "poundal",
      "troy",
      "apothecary",
      "assay",
      "biblical",
      "greek",
      "roman",
    ],
  },
  Temperature: {
    units: [
      "Degree Celsius (°C)",
      "Fahrenheit (°F)",
      "Kelvin (K)",
      "Rankine (°R)", // Added
      "Reaumur (°r)", // Added
    ],
    convert: (value, from, to) => {
      let celsius;
      if (from === "Degree Celsius (°C)") celsius = value;
      else if (from === "Fahrenheit (°F)") celsius = ((value - 32) * 5) / 9;
      else if (from === "Kelvin (K)") celsius = value - 273.15;
      else if (from === "Rankine (°R)")
        celsius = ((value - 491.67) * 5) / 9; // Convert Rankine to Celsius
      else if (from === "Reaumur (°r)")
        celsius = (value * 5) / 4; // Convert Reaumur to Celsius
      else return NaN;

      if (to === "Degree Celsius (°C)") return celsius;
      if (to === "Fahrenheit (°F)") return (celsius * 9) / 5 + 32;
      if (to === "Kelvin (K)") return celsius + 273.15;
      if (to === "Rankine (°R)") return ((celsius + 273.15) * 9) / 5; // Convert Celsius to Rankine
      if (to === "Reaumur (°r)") return (celsius * 4) / 5; // Convert Celsius to Reaumur
      return NaN;
    },
    type: "unit",
    keywords: [
      "degree",
      "celsius",
      "fahrenheit",
      "kelvin",
      "rankine", // Added
      "reaumur", // Added
      "hot",
      "cold",
      "temp",
      "temperature",
      "triple point of water", // Added as keyword for searchability
    ],
  },
  Area: {
    units: [
      "Square meter (m²)",
      "Square kilometer (km²)", // Added
      "Square centimeter (cm²)",
      "Square millimeter (mm²)", // Added
      "Square micrometer (µm²)", // Added
      "Hectare (ha)",
      "Acre (ac)",
      "Square mile (mi²)",
      "Square yard (yd²)",
      "Square foot (ft²)",
      "Square inch (in²)",
      "Square hectometer (hm²)", // Added
      "Square dekameter (dam²)", // Added
      "Square decimeter (dm²)", // Added
      "Square nanometer (nm²)", // Added
      "Are (a)", // Added
      "Barn (b)", // Added
      "Square mile (US survey)", // Added
      "Square foot (US survey)", // Added
      "Circular inch", // Added
      "Township", // Added
      "Section", // Added
      "Acre (US survey) (ac)", // Added
      "Rood", // Added
      "Square chain (ch²)", // Added
      "Square rod", // Added
      "Square rod (US survey)", // Added
      "Square perch", // Added (same as square rod)
      "Square pole", // Added (same as square rod)
      "Square mil (mil²)", // Added
      "Circular mil", // Added
      "Homestead", // Added
      "Sabin", // Added (unit of sound absorption)
      "Arpent", // Added (unit of land area)
      "Cuerda", // Added (unit of land area)
      "Plaza", // Added (unit of land area)
      "Varas castellanas cuad", // Added (historical unit)
      "Varas conuqueras cuad", // Added (historical unit)
      "Electron cross section", // Added (specific physics unit)
    ],
    factors: {
      "Square meter (m²)": 1,
      "Square centimeter (cm²)": 0.0001,
      "Square kilometre (km²)": 1000000,
      "Hectare (ha)": 10000,
      "Acre (ac)": 4046.86,
      "Square foot (ft²)": 0.092903,
      "Square inch (in²)": 0.00064516,
      "Square mile (mi²)": 2589988.11,
      "Square yard (yd²)": 0.83612736,
      "Square kilometer (km²)": 1000000,
      "Square millimeter (mm²)": 1e-6,
      "Square micrometer (µm²)": 1e-12,
      "Square hectometer (hm²)": 10000, // Same as hectare
      "Square dekameter (dam²)": 100, // Are
      "Square decimeter (dm²)": 0.01,
      "Square nanometer (nm²)": 1e-18,
      "Are (a)": 100,
      "Barn (b)": 1e-28, // 1 barn = 10^-28 m²
      "Square mile (US survey)": 2589998.47, // 1 US survey mile²
      "Square foot (US survey)": 0.09290341161, // 1 US survey foot²
      "Circular inch": 0.000506707479, // π/4 square inch
      Township: 93239571.972, // 36 square miles
      Section: 2589988.11, // 1 square mile
      "Acre (US survey) (ac)": 4046.8726, // 1 US survey acre
      Rood: 1011.7141, // 1/4 acre
      "Square chain (ch²)": 404.686, // 1 chain = 20.1168 m, so (20.1168)^2
      "Square rod": 25.2929, // 1 rod = 5.0292 m, so (5.0292)^2
      "Square rod (US survey)": 25.293, // 1 US survey rod squared
      "Square perch": 25.2929, // Same as square rod
      "Square pole": 25.2929, // Same as square rod
      "Square mil (mil²)": 6.4516e-10, // (0.0000254 m)^2
      "Circular mil": 5.06707479e-10, // (π/4) * (0.0000254 m)^2
      Homestead: 647497, // 160 acres
      Sabin: 0.092903, // unit of sound absorption, often equated to square foot
      Arpent: 3418.89, // approx, depending on region
      Cuerda: 3930.39, // Puerto Rican unit
      Plaza: 6400, // Historical Spanish unit
      "Varas castellanas cuad": 0.698737, // (0.8359 m)^2
      "Varas conuqueras cuad": 0.698737, // Assuming same as varas castellanas
      "Electron cross section": 1e-30, // A typical value for a small cross-section in physics
    },
    type: "unit",
    keywords: [
      "square",
      "land",
      "meter",
      "centimeter",
      "kilometer",
      "millimeter",
      "micrometer",
      "hectare",
      "acre",
      "foot",
      "inch",
      "mile",
      "yard",
      "hectometer",
      "dekameter",
      "decimeter",
      "nanometer",
      "are",
      "barn",
      "survey",
      "circular inch",
      "township",
      "section",
      "rood",
      "chain",
      "rod",
      "perch",
      "pole",
      "mil",
      "homestead",
      "sabin",
      "arpent",
      "cuerda",
      "plaza",
      "vara",
      "electron cross section",
    ],
  },
  Volume: {
    units: [
      "Litre (L)",
      "Milliliter (mL)",
      "Cubic meter (m³)",
      "US gallon (US gal)",
      "US quart (US qt)",
      "US pint (US pt)",
      "US cup (US cup)",
      "US fluid ounce (US fl oz)",
      "US tablespoon (US tbsp)",
      "US teaspoon (US tsp)",
      "Imperial gallon (Imp gal)",
      "Imperial quart (Imp qt)",
      "Imperial pint (Imp pt)",
      "Imperial cup (Imp cup)",
      "Imperial fluid ounce (Imp fl oz)",
      "Imperial tablespoon (Imp tbsp)",
      "Imperial teaspoon (Imp tsp)",
      "Cubic foot (ft³)",
      "Cubic inch (in³)",
      "Cubic kilometer (km³)", // Added
      "Cubic centimeter (cm³)", // Added (same as cc)
      "Cubic millimeter (mm³)", // Added
      "Cubic decimeter (dm³)", // Added
      "Exaliter (EL)", // Added
      "Petaliter (PL)", // Added
      "Teraliter (TL)", // Added
      "Gigaliter (GL)", // Added
      "Megaliter (ML)", // Added
      "Kiloliter (kL)", // Added
      "Hectoliter (hL)", // Added
      "Dekaliter (daL)", // Added
      "Deciliter (dL)", // Added
      "Centiliter (cL)", // Added
      "Microliter (µL)", // Added
      "Nanoliter (nL)", // Added
      "Picoliter (pL)", // Added
      "Femtoliter (fL)", // Added
      "Attoliter (aL)", // Added
      "cc (cc, cm³)", // Added (alias for cubic centimeter)
      "Drop", // Added (approximate)
      "Barrel (oil) (bbl (oil))", // Added
      "Barrel (US) (bbl (US))", // Added
      "Barrel (UK) (bbl (UK))", // Added
      "Gallon (UK) (gal (UK))", // Added (Imperial gallon already present)
      "Quart (UK) (qt (UK))", // Added (Imperial quart already present)
      "Pint (UK) (pt (UK))", // Added (Imperial pint already present)
      "Cup (metric)", // Added
      "Cup (UK)", // Added (Imperial cup already present)
      "Fluid ounce (US) (fl oz (US))", // Added (US fluid ounce already present)
      "Fluid ounce (UK) (fl oz (UK))", // Added (Imperial fluid ounce already present)
      "Tablespoon (metric)", // Added
      "Tablespoon (UK)", // Added (Imperial tablespoon already present)
      "Dessertspoon (US)", // Added
      "Dessertspoon (UK)", // Added
      "Teaspoon (metric)", // Added
      "Teaspoon (UK)", // Added (Imperial teaspoon already present)
      "Gill (US) (gi)", // Added
      "Gill (UK) (gi (UK))", // Added
      "Minim (US)", // Added
      "Minim (UK)", // Added
      "Ton register (ton reg)", // Added
      "ccf", // Added (hundred-cubic foot)
      "Hundred-cubic foot", // Added (alias for ccf)
      "Acre-foot (ac*ft)", // Added
      "Acre-foot (US survey)", // Added
      "Acre-inch (ac*in)", // Added
      "Dekaster", // Added (same as 10 cubic meters)
      "Stere (st)", // Added (same as cubic meter)
      "Decistere", // Added
      "Cord (cd)", // Added
      "Tun", // Added
      "Hogshead", // Added
      "Board foot", // Added
      "Dram (dr)", // Added (fluid dram)
      "Cor (Biblical)", // Added
      "Homer (Biblical)", // Added
      "Bath (Biblical)", // Added
      "Hin (Biblical)", // Added
      "Cab (Biblical)", // Added
      "Log (Biblical)", // Added
      "Taza (Spanish)", // Added
      "Earth's volume", // Added
    ],
    factors: {
      "Litre (L)": 1,
      "Milliliter (mL)": 0.001,
      "Cubic meter (m³)": 1000,
      "US gallon (US gal)": 3.78541,
      "US quart (US qt)": 0.9463525,
      "US pint (US pt)": 0.47317625,
      "US cup (US cup)": 0.236588125,
      "US fluid ounce (US fl oz)": 0.0295735,
      "US tablespoon (US tbsp)": 0.01478675,
      "US teaspoon (US tsp)": 0.00492891667,
      "Imperial gallon (Imp gal)": 4.54609,
      "Imperial quart (Imp qt)": 1.1365225,
      "Imperial pint (Imp pt)": 0.56826125,
      "Imperial cup (Imp cup)": 0.284130625,
      "Imperial fluid ounce (Imp fl oz)": 0.0284130625,
      "Imperial tablespoon (Imp tbsp)": 0.01420653125,
      "Imperial teaspoon (Imp tsp)": 0.007103265625,
      "Cubic foot (ft³)": 28.3168,
      "Cubic inch (in³)": 0.0163871,
      "Cubic kilometer (km³)": 1e12, // 10^9 m^3 = 10^12 L
      "Cubic centimeter (cm³)": 0.001, // 1 cm^3 = 1 mL = 0.001 L
      "Cubic millimeter (mm³)": 1e-6, // 1 mm^3 = 1 uL = 10^-6 L
      "Cubic decimeter (dm³)": 1, // 1 dm^3 = 1 L
      "Exaliter (EL)": 1e18,
      "Petaliter (PL)": 1e15,
      "Teraliter (TL)": 1e12,
      "Gigaliter (GL)": 1e9,
      "Megaliter (ML)": 1e6,
      "Kiloliter (kL)": 1000, // 1 kL = 1 m^3
      "Hectoliter (hL)": 100,
      "Dekaliter (daL)": 10,
      "Deciliter (dL)": 0.1,
      "Centiliter (cL)": 0.01,
      "Microliter (µL)": 1e-6,
      "Nanoliter (nL)": 1e-9,
      "Picoliter (pL)": 1e-12,
      "Femtoliter (fL)": 1e-15,
      "Attoliter (aL)": 1e-18,
      "cc (cc, cm³)": 0.001, // Same as cubic centimeter
      Drop: 0.00005, // Approximation: 1 drop = 0.05 mL = 0.00005 L
      "Barrel (oil) (bbl (oil))": 158.987, // ~158.987 liters
      "Barrel (US) (bbl (US))": 119.24047, // 31.5 US gallons
      "Barrel (UK) (bbl (UK))": 163.65924, // 36 Imperial gallons
      "Gallon (UK) (gal (UK))": 4.54609, // Imperial gallon
      "Quart (UK) (qt (UK))": 1.13652, // Imperial quart
      "Pint (UK) (pt (UK))": 0.568261, // Imperial pint
      "Cup (metric)": 0.25, // 250 mL
      "Cup (UK)": 0.284130625, // Imperial cup
      "Fluid ounce (US) (fl oz (US))": 0.0295735, // US fluid ounce
      "Fluid ounce (UK) (fl oz (UK))": 0.0284130625, // Imperial fluid ounce
      "Tablespoon (metric)": 0.015, // 15 mL
      "Tablespoon (UK)": 0.01420653125, // Imperial tablespoon
      "Dessertspoon (US)": 0.01, // 10 mL
      "Dessertspoon (UK)": 0.007103265625, // Half an Imperial tablespoon
      "Teaspoon (metric)": 0.005, // 5 mL
      "Teaspoon (UK)": 0.00492891667, // Imperial teaspoon
      "Gill (US) (gi)": 0.118294, // 4 US fluid ounces
      "Gill (UK) (gi (UK))": 0.142065, // 5 Imperial fluid ounces
      "Minim (US)": 0.0000616115, // ~0.0616 mL
      "Minim (UK)": 0.0000591939, // ~0.0592 mL
      "Ton register (ton reg)": 2831.68, // 100 cubic feet (approx, varies)
      ccf: 2831.68, // 100 cubic feet
      "Hundred-cubic foot": 2831.68, // 100 cubic feet
      "Acre-foot (ac*ft)": 1233481.8, // 1233.48 cubic meters
      "Acre-foot (US survey)": 1233489.238, // US survey acre-foot
      "Acre-inch (ac*in)": 10279.015, // 1/12 acre-foot
      Dekaster: 10000, // 10 m³
      "Stere (st)": 1000, // 1 m³
      Decistere: 100, // 0.1 m³
      "Cord (cd)": 3624.556, // 128 cubic feet
      Tun: 953.924, // 252 US gallons (wine)
      Hogshead: 238.481, // 63 US gallons (wine)
      "Board foot": 2.359737, // 1/12 cubic foot in liters
      "Dram (dr)": 0.00369669, // Fluid dram (US)
      "Cor (Biblical)": 220, // ~220 liters (approx)
      "Homer (Biblical)": 220, // Same as Cor (approx)
      "Bath (Biblical)": 22, // ~22 liters (approx)
      "Hin (Biblical)": 3.667, // ~3.667 liters (approx)
      "Cab (Biblical)": 1.22, // ~1.22 liters (approx)
      "Log (Biblical)": 0.305, // ~0.305 liters (approx)
      "Taza (Spanish)": 0.2, // ~0.2 liters (cup)
      "Earth's volume": 1.08321e21, // Earth's volume in m³, converted to L
    },
    type: "unit",
    keywords: [
      "liquid",
      "capacity",
      "gallon",
      "quart",
      "pint",
      "cup",
      "ounce",
      "tablespoon",
      "teaspoon",
      "cubic",
      "meter",
      "liter",
      "milliliter",
      "foot",
      "inch",
      "imperial",
      "us",
      "kilometer",
      "centimeter",
      "millimeter",
      "decimeter",
      "exaliter",
      "petaliter",
      "teraliter",
      "gigaliter",
      "megaliter",
      "kiloliter",
      "hectoliter",
      "dekaliter",
      "deciliter",
      "centiliter",
      "microliter",
      "nanoliter",
      "picoliter",
      "femtoliter",
      "attoliter",
      "cc",
      "drop",
      "barrel",
      "metric cup",
      "dessertspoon",
      "gill",
      "minim",
      "ton register",
      "ccf",
      "acre-foot",
      "acre-inch",
      "dekaster",
      "stere",
      "decistere",
      "cord",
      "tun",
      "hogshead",
      "board foot",
      "dram",
      "biblical",
      "cor",
      "homer",
      "bath",
      "hin",
      "cab",
      "log",
      "taza",
      "earth's volume",
    ],
  },
  Speed: {
    units: [
      "Metre per second (m/s)",
      "Kilometre per hour (km/h)",
      "Mile per hour (mph)",
      "Foot per second (ft/s)",
      "Knot (kn)",
      "Meter per hour (m/h)", // Added
      "Meter per minute (m/min)", // Added
      "Kilometer per minute (km/min)", // Added
      "Kilometer per second (km/s)", // Added
      "Centimeter per hour (cm/h)", // Added
      "Centimeter per minute (cm/min)", // Added
      "Centimeter per second (cm/s)", // Added
      "Millimeter per hour (mm/h)", // Added
      "Millimeter per minute (mm/min)", // Added
      "Millimeter per second (mm/s)", // Added
      "Foot per hour (ft/h)", // Added
      "Foot per minute (ft/min)", // Added
      "Yard per hour (yd/h)", // Added
      "Yard per minute (yd/min)", // Added
      "Yard per second (yd/s)", // Added
      "Mile per minute (mi/min)", // Added
      "Mile per second (mi/s)", // Added
      "Knot (UK) (kt (UK))", // Added
      "Mach (20°C, 1 atm)", // Added
      "Mach (SI standard)", // Added
    ],
    factors: {
      "Metre per second (m/s)": 1,
      "Kilometre per hour (km/h)": 0.277778,
      "Mile per hour (mph)": 0.44704,
      "Foot per second (ft/s)": 0.3048,
      "Knot (kn)": 0.514444,
      "Meter per hour (m/h)": 1 / 3600,
      "Meter per minute (m/min)": 1 / 60,
      "Kilometer per minute (km/min)": 1000 / 60,
      "Kilometer per second (km/s)": 1000,
      "Centimeter per hour (cm/h)": 0.01 / 3600,
      "Centimeter per minute (cm/min)": 0.01 / 60,
      "Centimeter per second (cm/s)": 0.01,
      "Millimeter per hour (mm/h)": 0.001 / 3600,
      "Millimeter per minute (mm/min)": 0.001 / 60,
      "Millimeter per second (mm/s)": 0.001,
      "Foot per hour (ft/h)": 0.3048 / 3600,
      "Foot per minute (ft/min)": 0.3048 / 60,
      "Yard per hour (yd/h)": 0.9144 / 3600,
      "Yard per minute (yd/min)": 0.9144 / 60,
      "Yard per second (yd/s)": 0.9144,
      "Mile per minute (mi/min)": 1609.344 / 60,
      "Mile per second (mi/s)": 1609.344,
      "Knot (UK) (kt (UK))": 0.514773, // 1 UK knot = 1853.184 m/h = 0.514773 m/s
      "Mach (20°C, 1 atm)": 343, // Approx speed of sound in dry air at 20°C in m/s
      "Mach (SI standard)": 340.29, // Speed of sound in dry air at 15°C at sea level in m/s
    },
    type: "unit",
    keywords: [
      "velocity",
      "speed",
      "meter",
      "kilometre",
      "mile",
      "foot",
      "knot",
      "hour",
      "minute",
      "second",
      "centimeter",
      "millimeter",
      "yard",
      "mach",
      "velocity of light in vacuum", // Added as keyword
      "cosmic velocity - first", // Added as keyword
      "cosmic velocity - second", // Added as keyword
      "cosmic velocity - third", // Added as keyword
      "earth's velocity", // Added as keyword
      "velocity of sound in pure water", // Added as keyword
      "velocity of sound in sea water", // Added as keyword
    ],
  },
  Time: {
    units: [
      "Nanosecond (ns)",
      "Microsecond (µs)",
      "Millisecond (ms)",
      "Second (s)",
      "Minute (min)",
      "Hour (h)",
      "Day (day)",
      "Week (week)",
      "Month (month)",
      "Calendar year (year)",
      "Decade (decade)",
      "Century (century)",
      "Millennium", // Added
      "Picosecond (ps)", // Added
      "Femtosecond (fs)", // Added
      "Attosecond (as)", // Added
      "Shake", // Added
      "Month (synodic)", // Added
      "Year (Julian)", // Added
      "Year (leap)", // Added
      "Year (tropical)", // Added
      "Year (sidereal)", // Added
      "Day (sidereal)", // Added
      "Hour (sidereal)", // Added
      "Minute (sidereal)", // Added
      "Second (sidereal)", // Added
      "Fortnight", // Added
      "Septennial", // Added
      "Octennial", // Added
      "Novennial", // Added
      "Quindecennial", // Added
      "Quinquennial", // Added
      "Planck time", // Added
    ],
    factors: {
      "Nanosecond (ns)": 0.000000001,
      "Microsecond (µs)": 0.000001,
      "Millisecond (ms)": 0.001,
      "Second (s)": 1,
      "Minute (min)": 60,
      "Hour (h)": 3600,
      "Day (day)": 86400,
      "Week (week)": 604800,
      "Month (month)": 2629800, // Average month (approx 365.25 days / 12 months)
      "Calendar year (year)": 31557600, // 365.25 days
      "Decade (decade)": 315576000, // 10 years
      "Century (century)": 3155760000, // 100 years
      Millennium: 31557600000, // 1000 years
      "Picosecond (ps)": 1e-12,
      "Femtosecond (fs)": 1e-15,
      "Attosecond (as)": 1e-18,
      Shake: 1e-8,
      "Month (synodic)": 2551442.8, // 29.530588 days in seconds
      "Year (Julian)": 31557600, // 365.25 days in seconds
      "Year (leap)": 31622400, // 366 days in seconds
      "Year (tropical)": 31556925.2, // 365.24219 days in seconds
      "Year (sidereal)": 31558149.5, // 365.25636 days in seconds
      "Day (sidereal)": 86164.091, // 23 hours, 56 minutes, 4.091 seconds
      "Hour (sidereal)": 3590.1705, // Day (sidereal) / 24
      "Minute (sidereal)": 59.836175, // Hour (sidereal) / 60
      "Second (sidereal)": 0.99726956, // Minute (sidereal) / 60
      Fortnight: 1209600, // 14 days
      Septennial: 220903200, // 7 years
      Octennial: 252460800, // 8 years
      Novennial: 283996800, // 9 years
      Quindecennial: 473364000, // 15 years
      Quinquennial: 157788000, // 5 years
      "Planck time": 5.391247e-44,
    },
    type: "unit",
    keywords: [
      "nanosecond",
      "microsecond",
      "millisecond",
      "second",
      "minute",
      "hour",
      "day",
      "week",
      "month",
      "calendar year",
      "year",
      "decade",
      "century",
      "millennium",
      "picosecond",
      "femtosecond",
      "attosecond",
      "shake",
      "synodic month",
      "Julian year",
      "leap year",
      "tropical year",
      "sidereal year",
      "fortnight",
      "septennial",
      "octennial",
      "novennial",
      "quindecennial",
      "quinquennial",
      "planck time",
    ],
  },
  Pressure: {
    units: [
      "Pascal (Pa)",
      "Kilopascal (kPa)",
      "Bar (bar)",
      "Psi (psi)",
      "Ksi (ksi)", // Added
      "Standard atmosphere (atm)",
      "Exapascal (EPa)", // Added
      "Petapascal (PPa)", // Added
      "Terapascal (TPa)", // Added
      "Gigapascal (GPa)", // Added
      "Megapascal (MPa)", // Added
      "Hectopascal (hPa)", // Added
      "Dekapascal (daPa)", // Added
      "Decipascal (dPa)", // Added
      "Centipascal (cPa)", // Added
      "Millipascal (mPa)", // Added
      "Micropascal (µPa)", // Added
      "Nanopascal (nPa)", // Added
      "Picopascal (pPa)", // Added
      "Femtopascal (fPa)", // Added
      "Attopascal (aPa)", // Added
      "Newton/square meter", // Added
      "Newton/square centimeter", // Added
      "Newton/square millimeter", // Added
      "Kilonewton/square meter", // Added
      "Millibar (mbar)", // Added
      "Microbar (µbar)", // Added
      "Dyne/square centimeter", // Added
      "Kilogram-force/square meter", // Added
      "Kilogram-force/sq. cm", // Added
      "Kilogram-force/sq. millimeter", // Added
      "Gram-force/sq. centimeter", // Added
      "Ton-force (short)/sq. foot", // Added
      "Ton-force (short)/sq. inch", // Added
      "Ton-force (long)/square foot", // Added
      "Ton-force (long)/square inch", // Added
      "Kip-force/square inch", // Added
      "Pound-force/square foot", // Added
      "Poundal/square foot", // Added
      "Torr (Torr)",
      "Centimeter mercury (0°C)", // Added
      "Millimeter mercury (0°C)", // Added (same as Torr, but kept for explicit listing)
      "Inch mercury (32°F) (inHg)", // Added
      "Inch mercury (60°F) (inHg)", // Added
      "Centimeter water (4°C)", // Added
      "Millimeter water (4°C)", // Added
      "Inch water (4°C) (inAq)", // Added
      "Foot water (4°C) (ftAq)", // Added
      "Inch water (60°F) (inAq)", // Added
      "Foot water (60°F) (ftAq)", // Added
      "Atmosphere technical (at)", // Added
    ],
    factors: {
      "Pascal (Pa)": 1,
      "Kilopascal (kPa)": 1000,
      "Bar (bar)": 100000,
      "Pound per square inch (psi)": 6894.76,
      "Standard atmosphere (atm)": 101325,
      "Torr (Torr)": 133.322,
      "Millimeter of mercury (mmHg)": 133.322, // Same as Torr
      "Ksi (ksi)": 6894757.29, // 1000 * psi
      "Exapascal (EPa)": 1e18,
      "Petapascal (PPa)": 1e15,
      "Terapascal (TPa)": 1e12,
      "Gigapascal (GPa)": 1e9,
      "Megapascal (MPa)": 1e6,
      "Hectopascal (hPa)": 100,
      "Dekapascal (daPa)": 10,
      "Decipascal (dPa)": 0.1,
      "Centipascal (cPa)": 0.01,
      "Millipascal (mPa)": 0.001,
      "Micropascal (µPa)": 1e-6,
      "Nanopascal (nPa)": 1e-9,
      "Picopascal (pPa)": 1e-12,
      "Femtopascal (fPa)": 1e-15,
      "Attopascal (aPa)": 1e-18,
      "Newton/square meter": 1, // Definition of Pascal
      "Newton/square centimeter": 10000, // 1 N / (0.01 m)^2
      "Newton/square millimeter": 1000000, // 1 N / (0.001 m)^2
      "Kilonewton/square meter": 1000,
      "Millibar (mbar)": 100,
      "Microbar (µbar)": 0.1,
      "Dyne/square centimeter": 0.1, // 1 dyn = 10^-5 N, 1 cm^2 = 10^-4 m^2
      "Kilogram-force/square meter": 9.80665,
      "Kilogram-force/sq. cm": 98066.5, // 9.80665 * 10000
      "Kilogram-force/sq. millimeter": 9806650, // 9.80665 * 1000000
      "Gram-force/sq. centimeter": 98.0665, // (9.80665 / 1000) * 10000
      "Ton-force (short)/sq. foot": 95760.5, // (2000 lbf * 4.44822 N/lbf) / (0.3048 m)^2
      "Ton-force (short)/sq. inch": 13789515, // (2000 lbf * 4.44822 N/lbf) / (0.0254 m)^2
      "Ton-force (long)/square foot": 107316.7, // (2240 lbf * 4.44822 N/lbf) / (0.3048 m)^2
      "Ton-force (long)/square inch": 15444988, // (2240 lbf * 4.44822 N/lbf) / (0.0254 m)^2
      "Kip-force/square inch": 6894757.29, // (1000 lbf * 4.44822 N/lbf) / (0.0254 m)^2
      "Pound-force/square foot": 47.8803, // (1 lbf * 4.44822 N/lbf) / (0.3048 m)^2
      "Poundal/square foot": 1.48816, // (1 pdl * 0.138255 N/pdl) / (0.3048 m)^2
      "Centimeter mercury (0°C)": 1333.22,
      "Inch mercury (32°F) (inHg)": 3386.389,
      "Inch mercury (60°F) (inHg)": 3376.85,
      "Centimeter water (4°C)": 98.0638,
      "Millimeter water (4°C)": 9.80638,
      "Inch water (4°C) (inAq)": 249.082,
      "Foot water (4°C) (ftAq)": 2989.01,
      "Inch water (60°F) (inAq)": 248.84,
      "Foot water (60°F) (ftAq)": 2986.08,
      "Atmosphere technical (at)": 98066.5,
    },
    type: "unit",
    keywords: [
      "force",
      "barometric",
      "pascal",
      "kilopascal",
      "bar",
      "psi",
      "ksi",
      "atmosphere",
      "torr",
      "millimeter of mercury",
      "exapascal",
      "petapascal",
      "terapascal",
      "gigapascal",
      "megapascal",
      "hectopascal",
      "dekapascal",
      "decipascal",
      "centipascal",
      "millipascal",
      "micropascal",
      "nanopascal",
      "picopascal",
      "femtopascal",
      "attopascal",
      "newton",
      "millibar",
      "microbar",
      "dyne",
      "kilogram-force",
      "gram-force",
      "ton-force",
      "kip-force",
      "pound-force",
      "poundal",
      "centimeter mercury",
      "inch mercury",
      "centimeter water",
      "millimeter water",
      "inch water",
      "foot water",
      "atmosphere technical",
    ],
  },
  "Energy / Heat": {
    units: [
      "Joule (J)", // Changed from J
      "Kilojoule (kJ)",
      "Kilowatt-hour (kW·h)", // Changed from kWh
      "Watt-hour (W·h)", // Changed from Wh
      "Calorie (nutritional)",
      "Horsepower (metric) hour", // Added
      "Btu (IT)", // Changed from BTU
      "Btu (th)", // Added
      "Gigajoule (GJ)", // Added
      "Megajoule (MJ)", // Added
      "Millijoule (mJ)", // Added
      "Microjoule (µJ)", // Added
      "Nanojoule (nJ)", // Added
      "Attojoule (aJ)", // Added
      "Megaelectron-volt (MeV)", // Added
      "Kiloelectron-volt (keV)", // Added
      "Electron-volt (eV)", // Added
      "Erg", // Added
      "Gigawatt-hour (GW·h)", // Added
      "Megawatt-hour (MW·h)", // Added
      "Kilowatt-second (kW·s)", // Added
      "Watt-second (W·s)", // Added
      "Newton meter (N·m)", // Added
      "Horsepower hour (hp·h)", // Added
      "Kilocalorie (IT) (kcal (IT))", // Added
      "Kilocalorie (th) (kcal (th))", // Added
      "Calorie (IT) (cal (IT))", // Added
      "Calorie (th) (cal (th))", // Added
      "Mega Btu (IT) (MBtu (IT))", // Added
      "Ton-hour (refrigeration)", // Added
      "Fuel oil equivalent @kiloliter", // Added
      "Fuel oil equivalent @barrel (US)", // Added
      "Gigaton (explosives)", // Added (TNT equivalent)
      "Megaton (explosives)", // Added (TNT equivalent)
      "Kiloton (explosives)", // Added (TNT equivalent)
      "Ton (explosives)", // Added (TNT equivalent)
      "Dyne centimeter (dyn·cm)", // Added
      "Gram-force meter (gf·m)", // Added
      "Gram-force centimeter", // Added
      "Kilogram-force centimeter", // Added
      "Kilogram-force meter (kgf·m)", // Added
      "Kilopond meter (kp·m)", // Added
      "Pound-force foot (lbf·ft)", // Added
      "Pound-force inch (lbf·in)", // Added
      "Ounce-force inch (ozf·in)", // Added
      "Foot-pound (ft·lbf)", // Added
      "Inch-pound (in·lbf)", // Added
      "Inch-ounce (in·ozf)", // Added
      "Poundal foot (pdl·ft)", // Added
      "Therm", // Added
      "Therm (EC)", // Added
      "Therm (US)", // Added
      "Hartree energy", // Added
      "Rydberg constant (energy)", // Added
    ],
    factors: {
      "Joule (J)": 1,
      "Kilojoule (kJ)": 1000,
      "Kilowatt-hour (kW·h)": 3600000,
      "Watt-hour (W·h)": 3600,
      "Calorie (nutritional)": 4184, // Often used interchangeably with kcal
      "Horsepower (metric) hour": 2647795.5, // 0.73549875 kW * 3600 s
      "Btu (IT)": 1055.06,
      "Btu (th)": 1054.35,
      "Gigajoule (GJ)": 1e9,
      "Megajoule (MJ)": 1e6,
      "Millijoule (mJ)": 0.001,
      "Microjoule (µJ)": 1e-6,
      "Nanojoule (nJ)": 1e-9,
      "Attojoule (aJ)": 1e-18,
      "Megaelectron-volt (MeV)": 1.602176634e-13,
      "Kiloelectron-volt (keV)": 1.602176634e-16,
      "Electron-volt (eV)": 1.602176634e-19,
      Erg: 1e-7,
      "Gigawatt-hour (GW·h)": 3.6e12,
      "Megawatt-hour (MW·h)": 3.6e9,
      "Kilowatt-second (kW·s)": 1000,
      "Watt-second (W·s)": 1,
      "Newton meter (N·m)": 1,
      "Horsepower hour (hp·h)": 2684519.53, // 745.7 W * 3600 s
      "Kilocalorie (IT) (kcal (IT))": 4186.8,
      "Kilocalorie (th) (kcal (th))": 4184,
      "Calorie (IT) (cal (IT))": 4.1868,
      "Calorie (th) (cal (th))": 4.184,
      "Mega Btu (IT) (MBtu (IT))": 1.05506e9,
      "Ton-hour (refrigeration)": 12660672,
      "Fuel oil equivalent @kiloliter": 3.57e10, // Approx. 1 kL * 0.85 kg/L * 42 MJ/kg
      "Fuel oil equivalent @barrel (US)": 5.67e9, // Approx. 1 bbl * 0.85 kg/L * 42 MJ/kg
      "Gigaton (explosives)": 4.184e18, // TNT equivalent
      "Megaton (explosives)": 4.184e15, // TNT equivalent
      "Kiloton (explosives)": 4.184e12, // TNT equivalent
      "Ton (explosives)": 4.184e9, // TNT equivalent (1 ton TNT)
      "Dyne centimeter (dyn·cm)": 1e-7,
      "Gram-force meter (gf·m)": 0.00980665,
      "Gram-force centimeter": 0.0000980665,
      "Kilogram-force centimeter": 0.0980665,
      "Kilogram-force meter (kgf·m)": 9.80665,
      "Kilopond meter (kp·m)": 9.80665,
      "Pound-force foot (lbf·ft)": 1.35581795,
      "Pound-force inch (lbf·in)": 0.112984829,
      "Ounce-force inch (ozf·in)": 0.007061551875,
      "Foot-pound (ft·lbf)": 1.35581795,
      "Inch-pound (in·lbf)": 0.112984829,
      "Inch-ounce (in·ozf)": 0.007061551875,
      "Poundal foot (pdl·ft)": 0.04214011,
      Therm: 1.05506e8, // US therm
      "Therm (EC)": 1.05506e8, // EC therm, usually refers to US therm
      "Therm (US)": 1.05506e8, // US therm
      "Hartree energy": 4.3597447222071e-18,
      "Rydberg constant (energy)": 2.1798723611035e-18, // Rydberg energy
    },
    type: "unit",
    keywords: [
      "joules",
      "calories",
      "kilowatt",
      "btu",
      "energy",
      "heat",
      "horsepower",
      "electron-volt",
      "erg",
      "watt-second",
      "newton meter",
      "kilocalorie",
      "mega btu",
      "ton-hour",
      "fuel oil",
      "explosives",
      "dyne",
      "gram-force",
      "kilogram-force",
      "pound-force",
      "ounce-force",
      "foot-pound",
      "inch-pound",
      "inch-ounce",
      "poundal",
      "therm",
      "hartree",
      "rydberg",
    ],
  },
  Power: {
    units: [
      "Watt (W)",
      "Kilowatt (kW)",
      "Megawatt (MW)",
      "Exawatt (EW)", // Added
      "Petawatt (PW)", // Added
      "Terawatt (TW)", // Added
      "Gigawatt (GW)", // Added
      "Hectowatt (hW)", // Added
      "Dekawatt (daW)", // Added
      "Deciwatt (dW)", // Added
      "Centiwatt (cW)", // Added
      "Milliwatt (mW)", // Added
      "Microwatt (µW)", // Added
      "Nanowatt (nW)", // Added
      "Picowatt (pW)", // Added
      "Femtowatt (fW)", // Added
      "Attowatt (aW)", // Added
      "Horsepower (hp)", // Changed from hp
      "Horsepower (UK) (hp (UK))", // Added
      "Horsepower (550 ft·lbf/s)", // Added (often the definition of mechanical hp)
      "Horsepower (metric)", // Added
      "Horsepower (boiler)", // Added
      "Horsepower (electric)", // Added
      "Horsepower (water)", // Added
      "Pferdestärke (ps)", // Added (metric horsepower)
      "Btu (IT)/hour (Btu/h)", // Changed from BTU/h
      "Btu (IT)/minute (Btu/min)", // Added
      "Btu (IT)/second (Btu/s)", // Added
      "Btu (th)/hour (Btu (th)/h)", // Added
      "Btu (th)/minute", // Added
      "Btu (th)/second (Btu (th)/s)", // Added
      "MBtu (IT)/hour (MBtu/h)", // Added
      "MBH", // Added (alias for MBtu/h)
      "Ton (refrigeration)", // Added
      "Kilocalorie (IT)/hour (kcal/h)", // Added
      "Kilocalorie (IT)/minute", // Added
      "Kilocalorie (IT)/second", // Added
      "Kilocalorie (th)/hour", // Added
      "Kilocalorie (th)/minute", // Added
      "Kilocalorie (th)/second", // Added
      "Calorie (IT)/hour (cal/h)", // Added
      "Calorie (IT)/minute (cal/min)", // Added
      "Calorie (IT)/second (cal/s)", // Added
      "Calorie (th)/hour (cal (th)/h)", // Added
      "Calorie (th)/minute", // Added
      "Calorie (th)/second", // Added
      "Foot pound-force/hour", // Added
      "Foot pound-force/minute", // Added
      "Foot pound-force/second", // Added
      "Pound-foot/hour (lbf·ft/h)", // Added
      "Pound-foot/minute", // Added
      "Pound-foot/second", // Added
      "Erg/second (erg/s)", // Added
      "Kilovolt ampere (kV·A)", // Added (for apparent power)
      "Volt ampere (V·A)", // Added (for apparent power)
      "Newton meter/second", // Added
      "Joule/second (J/s)", // Added (definition of Watt)
      "Exajoule/second (EJ/s)", // Added
      "Petajoule/second (PJ/s)", // Added
      "Terajoule/second (TJ/s)", // Added
      "Gigajoule/second (GJ/s)", // Added
      "Megajoule/second (MJ/s)", // Added
      "Kilojoule/second (kJ/s)", // Added
      "Hectojoule/second (hJ/s)", // Added
      "Dekajoule/second (daJ/s)", // Added
      "Decijoule/second (dJ/s)", // Added
      "Centijoule/second (cJ/s)", // Added
      "Millijoule/second (mJ/s)", // Added
      "Microjoule/second (µJ/s)", // Added
      "Nanojoule/second (nJ/s)", // Added
      "Picojoule/second (pJ/s)", // Added
      "Femtojoule/second (fJ/s)", // Added
      "Attojoule/second (aJ/s)", // Added
      "Joule/hour (J/h)", // Added
      "Joule/minute (J/min)", // Added
      "Kilojoule/hour (kJ/h)", // Added
      "Kilojoule/minute (kJ/min)", // Added
    ],
    factors: {
      "Watt (W)": 1,
      "Kilowatt (kW)": 1000,
      "Megawatt (MW)": 1000000,
      "Horsepower (hp)": 745.7,
      "Btu (IT)/hour (Btu/h)": 0.293071,
      "Exawatt (EW)": 1e18,
      "Petawatt (PW)": 1e15,
      "Terawatt (TW)": 1e12,
      "Gigawatt (GW)": 1e9,
      "Hectowatt (hW)": 100,
      "Dekawatt (daW)": 10,
      "Deciwatt (dW)": 0.1,
      "Centiwatt (cW)": 0.01,
      "Milliwatt (mW)": 0.001,
      "Microwatt (µW)": 1e-6,
      "Nanowatt (nW)": 1e-9,
      "Picowatt (pW)": 1e-12,
      "Femtowatt (fW)": 1e-15,
      "Attowatt (aW)": 1e-18,
      "Horsepower (UK) (hp (UK))": 745.7,
      "Horsepower (550 ft·lbf/s)": 745.69987158227,
      "Horsepower (metric)": 735.49875,
      "Horsepower (boiler)": 9809.5,
      "Horsepower (electric)": 746,
      "Horsepower (water)": 745.7, // Often equivalent to mechanical horsepower
      "Pferdestärke (ps)": 735.49875, // Same as metric horsepower
      "Btu (IT)/minute (Btu/min)": 17.584264, // 1055.06 J / 60 s
      "Btu (IT)/second (Btu/s)": 1055.06,
      "Btu (th)/hour (Btu (th)/h)": 0.292875,
      "Btu (th)/minute": 17.5725,
      "Btu (th)/second (Btu (th)/s)": 1054.35,
      "MBtu (IT)/hour (MBtu/h)": 293.071, // 1,000,000 Btu/h
      MBH: 293.071, // Alias for MBtu/h
      "Ton (refrigeration)": 3517, // 12,000 Btu/h
      "Kilocalorie (IT)/hour (kcal/h)": 1.163, // 4186.8 J / 3600 s
      "Kilocalorie (IT)/minute": 69.78, // 4186.8 J / 60 s
      "Kilocalorie (IT)/second": 4186.8,
      "Kilocalorie (th)/hour": 1.16222,
      "Kilocalorie (th)/minute": 69.7333,
      "Kilocalorie (th)/second": 4184,
      "Calorie (IT)/hour (cal/h)": 0.001163,
      "Calorie (IT)/minute (cal/min)": 0.06978,
      "Calorie (IT)/second (cal/s)": 4.1868,
      "Calorie (th)/hour (cal (th)/h)": 0.00116222,
      "Calorie (th)/minute": 0.0697333,
      "Calorie (th)/second": 4.184,
      "Foot pound-force/hour": 0.0003766, // 1.35581795 J / 3600 s
      "Foot pound-force/minute": 0.02259696, // 1.35581795 J / 60 s
      "Foot pound-force/second": 1.35581795,
      "Pound-foot/hour (lbf·ft/h)": 0.0003766, // Same as foot pound-force/hour
      "Pound-foot/minute": 0.02259696, // Same as foot pound-force/minute
      "Pound-foot/second": 1.35581795, // Same as foot pound-force/second
      "Erg/second (erg/s)": 1e-7,
      "Kilovolt ampere (kV·A)": 1000, // For apparent power, assuming unity power factor for direct comparison to Watts
      "Volt ampere (V·A)": 1, // For apparent power, assuming unity power factor
      "Newton meter/second": 1, // Definition of Watt
      "Joule/second (J/s)": 1, // Definition of Watt
      "Exajoule/second (EJ/s)": 1e18,
      "Petajoule/second (PJ/s)": 1e15,
      "Terajoule/second (TJ/s)": 1e12,
      "Gigajoule/second (GJ/s)": 1e9,
      "Megajoule/second (MJ/s)": 1e6,
      "Kilojoule/second (kJ/s)": 1000,
      "Hectojoule/second (hJ/s)": 100,
      "Dekajoule/second (daJ/s)": 10,
      "Decijoule/second (dJ/s)": 0.1,
      "Centijoule/second (cJ/s)": 0.01,
      "Millijoule/second (mJ/s)": 0.001,
      "Microjoule/second (µJ/s)": 1e-6,
      "Nanojoule/second (nJ/s)": 1e-9,
      "Picojoule/second (pJ/s)": 1e-12,
      "Femtojoule/second (fJ/s)": 1e-15,
      "Attojoule/second (aJ/s)": 1e-18,
      "Joule/hour (J/h)": 1 / 3600,
      "Joule/minute (J/min)": 1 / 60,
      "Kilojoule/hour (kJ/h)": 1000 / 3600,
      "Kilojoule/minute (kJ/min)": 1000 / 60,
    },
    type: "unit",
    keywords: [
      "watt",
      "horsepower",
      "power",
      "exawatt",
      "petawatt",
      "terawatt",
      "gigawatt",
      "megawatt",
      "kilowatt",
      "hectowatt",
      "dekawatt",
      "deciwatt",
      "centiwatt",
      "milliwatt",
      "microwatt",
      "nanowatt",
      "picowatt",
      "femtowatt",
      "attowatt",
      "pferdestarke",
      "btu",
      "mbh",
      "ton refrigeration",
      "kilocalorie",
      "calorie",
      "foot pound-force",
      "pound-foot",
      "erg",
      "kilovolt ampere",
      "volt ampere",
      "newton meter per second",
      "joule per second",
      "exajoule per second",
      "petajoule per second",
      "terajoule per second",
      "gigajoule per second",
      "megajoule per second",
      "kilojoule per second",
      "hectojoule per second",
      "dekajoule per second",
      "decijoule per second",
      "centijoule per second",
      "millijoule per second",
      "microjoule per second",
      "nanojoule per second",
      "picojoule per second",
      "femtojoule per second",
      "attojoule per second",
      "joule per hour",
      "joule per minute",
      "kilojoule per hour",
      "kilojoule per minute",
    ],
  },
  Force: {
    units: [
      "Newton (N)",
      "Kilonewton (kN)",
      "Gram-force (gf)", // Added
      "Kilogram-force (kgf)", // Added
      "Ton-force (metric) (tf)", // Added
      "Exanewton (EN)", // Added
      "Petanewton (PN)", // Added
      "Teranewton (TN)", // Added
      "Giganewton (GN)", // Added
      "Meganewton (MN)", // Added
      "Hectonewton (hN)", // Added
      "Dekanewton (daN)", // Added
      "Decinewton (dN)", // Added
      "Centinewton (cN)", // Added
      "Millinewton (mN)", // Added
      "Micronewton (µN)", // Added
      "Nanonewton (nN)", // Added
      "Piconewton (pN)", // Added
      "Femtonewton (fN)", // Added
      "Attonewton (aN)", // Added
      "Dyne (dyn)",
      "Joule/meter (J/m)", // Added
      "Joule/centimeter (J/cm)", // Added
      "Ton-force (short)", // Added
      "Ton-force (long) (tonf (UK))", // Added
      "Kip-force (kipf)", // Added
      "Kilopound-force (kipf)", // Added (same as Kip-force)
      "Pound-force (lbf)",
      "Ounce-force (ozf)", // Added
      "Poundal (pdl)", // Added
      "Pond (p)", // Added
      "Kilopond (kp)", // Added
    ],
    factors: {
      "Newton (N)": 1,
      "Kilonewton (kN)": 1000,
      "Gram-force (gf)": 0.00980665,
      "Kilogram-force (kgf)": 9.80665,
      "Ton-force (metric) (tf)": 9806.65,
      "Exanewton (EN)": 1e18,
      "Petanewton (PN)": 1e15,
      "Teranewton (TN)": 1e12,
      "Giganewton (GN)": 1e9,
      "Meganewton (MN)": 1e6,
      "Hectonewton (hN)": 100,
      "Dekanewton (daN)": 10,
      "Decinewton (dN)": 0.1,
      "Centinewton (cN)": 0.01,
      "Millinewton (mN)": 0.001,
      "Micronewton (µN)": 1e-6,
      "Nanonewton (nN)": 1e-9,
      "Piconewton (pN)": 1e-12,
      "Femtonewton (fN)": 1e-15,
      "Attonewton (aN)": 1e-18,
      "Dyne (dyn)": 0.00001,
      "Joule/meter (J/m)": 1,
      "Joule/centimeter (J/cm)": 100,
      "Ton-force (short)": 8896.4432,
      "Ton-force (long) (tonf (UK))": 9964.0164,
      "Kip-force (kipf)": 4448.22,
      "Kilopound-force (kipf)": 4448.22, // Same as Kip-force
      "Pound-force (lbf)": 4.44822,
      "Ounce-force (ozf)": 0.27801385,
      "Poundal (pdl)": 0.13825495,
      "Pond (p)": 0.00980665, // Same as gram-force
      "Kilopond (kp)": 9.80665, // Same as kilogram-force
    },
    type: "unit",
    keywords: [
      "newton",
      "kilonewton",
      "gram-force",
      "kilogram-force",
      "ton-force",
      "exanewton",
      "petanewton",
      "teranewton",
      "giganewton",
      "meganewton",
      "hectonewton",
      "dekanewton",
      "decinewton",
      "centinewton",
      "millinewton",
      "micronewton",
      "nanonewton",
      "piconewton",
      "femtonewton",
      "attonewton",
      "dyne",
      "joule per meter",
      "joule per centimeter",
      "kip-force",
      "pound-force",
      "ounce-force",
      "poundal",
      "pond",
      "kilopond",
    ],
  },
  Angle: {
    units: [
      "Degree (°)",
      "Arcsecond (″)",
      "Gradian (gon)",
      "Milliradian (mrad)",
      "Minute of arc (′)",
      "Radian (rad)",
      "Revolution (rev)",
      "Grad (^g)", // Added, alias for Gradian
      "Minute (')", // Added, alias for Minute of arc
      'Second (")', // Added, alias for Arcsecond
      "Gon", // Added, alias for Gradian
      "Sign", // Added
      "Mil", // Added (assuming artillery mil)
      "Circle", // Added, alias for Revolution
      "Turn", // Added, alias for Revolution
      "Quadrant", // Added
      "Right angle", // Added, alias for Quadrant
      "Sextant", // Added
    ],
    factors: {
      "Degree (°)": Math.PI / 180,
      "Arcsecond (″)": Math.PI / 180 / 3600,
      "Gradian (gon)": Math.PI / 200,
      "Milliradian (mrad)": 0.001,
      "Minute of arc (′)": Math.PI / 180 / 60,
      "Radian (rad)": 1,
      "Revolution (rev)": 2 * Math.PI,
      "Grad (^g)": Math.PI / 200, // Same as Gradian
      "Minute (')": Math.PI / 180 / 60, // Same as Minute of arc
      'Second (")': Math.PI / 180 / 3600, // Same as Arcsecond
      Gon: Math.PI / 200, // Same as Gradian
      Sign: Math.PI / 6, // 30 degrees
      Mil: (2 * Math.PI) / 6400, // Artillery mil (approx 0.0009817 rad)
      Circle: 2 * Math.PI, // Same as Revolution
      Turn: 2 * Math.PI, // Same as Revolution
      Quadrant: Math.PI / 2, // 90 degrees
      "Right angle": Math.PI / 2, // Same as Quadrant
      Sextant: Math.PI / 3, // 60 degrees
    },
    type: "unit",
    keywords: [
      "radian",
      "degree",
      "gradian",
      "revolution",
      "arcsecond",
      "milliradian",
      "minute of arc",
      "gon",
      "mil",
      "sign",
      "circle",
      "turn",
      "quadrant",
      "right angle",
      "sextant",
    ],
  },
  Density: {
    units: [
      "Kilogram/cubic meter (kg/m³)", // Changed from kg/m³
      "Gram/cubic centimeter (g/cm³)",
      "Kilogram/cubic centimeter", // Added
      "Gram/cubic meter (g/m³)", // Added
      "Gram/cubic millimeter", // Added
      "Milligram/cubic meter", // Added
      "Milligram/cubic centimeter", // Added
      "Milligram/cubic millimeter", // Added
      "Exagram/liter (Eg/L)", // Added
      "Petagram/liter (Pg/L)", // Added
      "Teragram/liter (Tg/L)", // Added
      "Gigagram/liter (Gg/L)", // Added
      "Megagram/liter (Mg/L)", // Added
      "Kilogram/liter (kg/L)", // Added
      "Hectogram/liter (hg/L)", // Added
      "Dekagram/liter (dag/L)", // Added
      "Gram/liter (g/L)", // Added
      "Decigram/liter (dg/L)", // Added
      "Centigram/liter (cg/L)", // Added
      "Milligram/liter (mg/L)", // Added
      "Microgram/liter (µg/L)", // Added
      "Nanogram/liter (ng/L)", // Added
      "Picogram/liter (pg/L)", // Added
      "Femtogram/liter (fg/L)", // Added
      "Attogram/liter (ag/L)", // Added
      "Pound/cubic inch (lb/in³)", // Added
      "Pound/cubic foot (lb/ft³)", // Changed from lb/ft³
      "Pound/cubic yard (lb/yd³)", // Added
      "Pound/gallon (US)", // Added
      "Pound/gallon (UK)", // Added
      "Ounce/cubic inch (oz/in³)", // Added
      "Ounce/cubic foot (oz/ft³)", // Added
      "Ounce/gallon (US)", // Added
      "Ounce/gallon (UK)", // Added
      "Grain/gallon (US)", // Added
      "Grain/gallon (UK)", // Added
      "Grain/cubic foot (gr/ft³)", // Added
      "Ton (short)/cubic yard", // Added
      "Ton (long)/cubic yard", // Added
      "Slug/cubic foot (slug/ft³)", // Added
    ],
    factors: {
      "Kilogram/cubic meter (kg/m³)": 1,
      "Gram/cubic centimeter (g/cm³)": 1000,
      "Pound/cubic foot (lb/ft³)": 16.0185,
      "Kilogram/cubic centimeter": 1000000, // 1 kg / (0.01 m)^3
      "Gram/cubic meter (g/m³)": 0.001,
      "Gram/cubic millimeter": 1000000, // 1 g / (0.001 m)^3
      "Milligram/cubic meter": 1e-6,
      "Milligram/cubic centimeter": 1, // 1 mg / (0.01 m)^3 = 1 g/m^3
      "Milligram/cubic millimeter": 1000, // 1 mg / (0.001 m)^3
      "Exagram/liter (Eg/L)": 1e18, // 1 Eg = 10^18 g = 10^15 kg, 1 L = 0.001 m^3
      "Petagram/liter (Pg/L)": 1e15,
      "Teragram/liter (Tg/L)": 1e12,
      "Gigagram/liter (Gg/L)": 1e9,
      "Megagram/liter (Mg/L)": 1e6, // 1 Mg = 1000 kg, 1 L = 0.001 m^3 => 1000 kg / 0.001 m^3 = 1e6 kg/m^3
      "Kilogram/liter (kg/L)": 1000, // 1 kg / 0.001 m^3
      "Hectogram/liter (hg/L)": 100,
      "Dekagram/liter (dag/L)": 10,
      "Gram/liter (g/L)": 1,
      "Decigram/liter (dg/L)": 0.1,
      "Centigram/liter (cg/L)": 0.01,
      "Milligram/liter (mg/L)": 0.001,
      "Microgram/liter (µg/L)": 1e-6,
      "Nanogram/liter (ng/L)": 1e-9,
      "Picogram/liter (pg/L)": 1e-12,
      "Femtogram/liter (fg/L)": 1e-15,
      "Attogram/liter (ag/L)": 1e-18,
      "Pound/cubic inch (lb/in³)": 27679.9047, // 1 lb = 0.453592 kg, 1 in^3 = 1.63871e-5 m^3
      "Pound/cubic yard (lb/yd³)": 0.593276, // 1 lb = 0.453592 kg, 1 yd^3 = 0.764555 m^3
      "Pound/gallon (US)": 119.826, // 1 lb / 3.78541 L
      "Pound/gallon (UK)": 99.7764, // 1 lb / 4.54609 L
      "Ounce/cubic inch (oz/in³)": 1729.994, // 1 oz = 0.0283495 kg, 1 in^3 = 1.63871e-5 m^3
      "Ounce/cubic foot (oz/ft³)": 1.00115, // 1 oz = 0.0283495 kg, 1 ft^3 = 0.0283168 m^3
      "Ounce/gallon (US)": 7.48915, // 1 oz / 3.78541 L
      "Ounce/gallon (UK)": 6.236, // 1 oz / 4.54609 L
      "Grain/gallon (US)": 0.0171181, // 1 gr = 0.00006479891 kg, 1 US gal = 3.78541 L
      "Grain/gallon (UK)": 0.01426, // 1 gr / 4.54609 L
      "Grain/cubic foot (gr/ft³)": 0.00228835, // 1 gr / 0.0283168 m^3
      "Ton (short)/cubic yard": 786.58, // 1 short ton = 907.185 kg, 1 yd^3 = 0.764555 m^3
      "Ton (long)/cubic yard": 880.89, // 1 long ton = 1016.05 kg, 1 yd^3 = 0.764555 m^3
      "Slug/cubic foot (slug/ft³)": 515.379, // 1 slug = 14.5939 kg, 1 ft^3 = 0.0283168 m^3
    },
    type: "unit",
    keywords: [
      "mass",
      "volume",
      "density",
      "kilogram",
      "gram",
      "milligram",
      "exagram",
      "petagram",
      "teragram",
      "gigagram",
      "megagram",
      "hectogram",
      "dekagram",
      "decigram",
      "centigram",
      "microgram",
      "nanogram",
      "picogram",
      "femtogram",
      "attogram",
      "pound",
      "ounce",
      "grain",
      "ton",
      "slug",
      "psi/1000 feet", // Added as keyword
      "earth's density (mean)", // Added as keyword
    ],
  },
  Torque: {
    units: [
      "Newton meter (N·m)", // Changed from Nm
      "Pound-force foot (lbf·ft)", // Changed from lb-ft
      "Pound-force inch (lbf·in)", // Changed from lb-in
      "Newton centimeter (N·cm)", // Added
      "Newton millimeter (N·mm)", // Added
      "Kilonewton meter (kN·m)", // Added
      "Dyne meter (dyn·m)", // Added
      "Dyne centimeter (dyn·cm)", // Added
      "Dyne millimeter (dyn·mm)", // Added
      "Kilogram-force meter", // Added
      "Kilogram-force centimeter", // Added
      "Kilogram-force millimeter", // Added
      "Gram-force meter (gf·m)", // Added
      "Gram-force centimeter", // Added
      "Gram-force millimeter", // Added
      "Ounce-force foot (ozf·ft)", // Added
      "Ounce-force inch (ozf·in)", // Added
    ],
    factors: {
      "Newton meter (N·m)": 1,
      "Pound-force foot (lbf·ft)": 1.35582,
      "Pound-force inch (lbf·in)": 0.112985,
      "Newton centimeter (N·cm)": 0.01,
      "Newton millimeter (N·mm)": 0.001,
      "Kilonewton meter (kN·m)": 1000,
      "Dyne meter (dyn·m)": 1e-5, // 1 dyne = 1e-5 N
      "Dyne centimeter (dyn·cm)": 1e-7, // 1 dyne = 1e-5 N, 1 cm = 0.01 m
      "Dyne millimeter (dyn·mm)": 1e-8, // 1 dyne = 1e-5 N, 1 mm = 0.001 m
      "Kilogram-force meter": 9.80665, // 1 kgf = 9.80665 N
      "Kilogram-force centimeter": 0.0980665, // 1 kgf = 9.80665 N, 1 cm = 0.01 m
      "Kilogram-force millimeter": 0.00980665, // 1 kgf = 9.80665 N, 1 mm = 0.001 m
      "Gram-force meter (gf·m)": 0.00980665, // 1 gf = 0.00980665 N
      "Gram-force centimeter": 0.0000980665, // 1 gf = 0.00980665 N, 1 cm = 0.01 m
      "Gram-force millimeter": 0.00000980665, // 1 gf = 0.00980665 N, 1 mm = 0.001 m
      "Ounce-force foot (ozf·ft)": 0.084738, // 1 ozf = 0.27801385 N, 1 ft = 0.3048 m
      "Ounce-force inch (ozf·in)": 0.00706155, // 1 ozf = 0.27801385 N, 1 in = 0.0254 m
    },
    type: "unit",
    keywords: [
      "newton-meter",
      "pound-foot",
      "torque",
      "newton centimeter",
      "newton millimeter",
      "kilonewton meter",
      "dyne meter",
      "dyne centimeter",
      "dyne millimeter",
      "kilogram-force meter",
      "kilogram-force centimeter",
      "kilogram-force millimeter",
      "gram-force meter",
      "gram-force centimeter",
      "gram-force millimeter",
      "ounce-force foot",
      "ounce-force inch",
      "pound-force inch",
    ],
  },
  Acceleration: {
    units: [
      "Meter/square second (m/s²)",
      "Decimeter/square second (dm/s²)", // Added long and short
      "Kilometer/square second (km/s²)", // Added long and short
      "Hectometer/square second (hm/s²)", // Added long and short
      "Dekameter/square second (dam/s²)", // Added long and short
      "Centimeter/square second (cm/s²)", // Added long and short
      "Millimeter/square second (mm/s²)", // Added long and short
      "Micrometer/square second (µm/s²)", // Added long and short
      "Nanometer/square second (nm/s²)", // Added long and short
      "Picometer/square second (pm/s²)", // Added long and short
      "Femtometer/square second (fm/s²)", // Added long and short
      "Attometer/square second (am/s²)", // Added long and short
      "Gal (Gal)",
      "Mile/square second (mi/s²)", // Added long and short
      "Yard/square second (yd/s²)", // Added long and short
      "Foot/square second (ft/s²)",
      "Inch/square second (in/s²)", // Added long and short
      "Standard gravity (g)", // Added long and short
    ],
    factors: {
      "Meter/square second (m/s²)": 1,
      "Standard gravity (g)": 9.80665,
      "Foot/square second (ft/s²)": 0.3048,
      "Decimeter/square second (dm/s²)": 0.1,
      "Kilometer/square second (km/s²)": 1000,
      "Hectometer/square second (hm/s²)": 100,
      "Dekameter/square second (dam/s²)": 10,
      "Centimeter/square second (cm/s²)": 0.01,
      "Millimeter/square second (mm/s²)": 0.001,
      "Micrometer/square second (µm/s²)": 1e-6,
      "Nanometer/square second (nm/s²)": 1e-9,
      "Picometer/square second (pm/s²)": 1e-12,
      "Femtometer/square second (fm/s²)": 1e-15,
      "Attometer/square second (am/s²)": 1e-18,
      "Gal (Gal)": 0.01,
      "Mile/square second (mi/s²)": 1609.344,
      "Yard/square second (yd/s²)": 0.9144,
      "Inch/square second (in/s²)": 0.0254,
    },
    type: "unit",
    keywords: [
      "gravity",
      "acceleration",
      "meter per square second",
      "decimeter per square second",
      "kilometer per square second",
      "hectometer per square second",
      "dekameter per square second",
      "centimeter per square second",
      "millimeter per square second",
      "micrometer per square second",
      "nanometer per square second",
      "picometer per square second",
      "femtometer per square second",
      "attometer per square second",
      "gal",
      "galileo",
      "mile per square second",
      "yard per square second",
      "foot per square second",
      "inch per square second",
      "acceleration of gravity",
    ],
  },
  "Data Storage": {
    units: [
      "Byte (B)", // Changed from B
      "Kilobyte (KB)",
      "Megabyte (MB)",
      "Gigabyte (GB)",
      "Terabyte (TB)",
      "Petabyte (PB)",
      "Bit (b)", // Added
      "Nibble", // Added
      "Character", // Added (assuming 1 byte)
      "Word", // Added (assuming 2 bytes, but can vary)
      "MAPM-word", // Added (placeholder, assuming 4 bytes for generic large word)
      "Quadruple-word", // Added (placeholder, assuming 8 bytes)
      "Block", // Added (placeholder, assuming 512 bytes)
      "Kilobit (kb)", // Added
      "Kilobyte (10^3 bytes)", // Added (decimal KB)
      "Megabit (Mb)", // Added
      "Megabyte (10^6 bytes)", // Added (decimal MB)
      "Gigabit (Gb)", // Added
      "Gigabyte (10^9 bytes)", // Added (decimal GB)
      "Terabit (Tb)", // Added
      "Terabyte (10^12 bytes)", // Added (decimal TB)
      "Petabit (Pb)", // Added
      "Petabyte (10^15 bytes)", // Added (decimal PB)
      "Exabit (Eb)", // Added
      "Exabyte (EB)", // Added
      "Exabyte (10^18 bytes)", // Added (decimal EB)
      'Floppy disk (3.5", DD)', // Added (Double Density, 720 KB)
      'Floppy disk (3.5", HD)', // Added (High Density, 1.44 MB)
      'Floppy disk (3.5", ED)', // Added (Extra-high Density, 2.88 MB)
      'Floppy disk (5.25", DD)', // Added (Double Density, 360 KB)
      'Floppy disk (5.25", HD)', // Added (High Density, 1.2 MB)
      "Zip 100", // Added
      "Zip 250", // Added
      "Jaz 1GB", // Added
      "Jaz 2GB", // Added
      "CD (74 minute)", // Added
      "CD (80 minute)", // Added
      "DVD (1 layer, 1 side)", // Added
      "DVD (2 layer, 1 side)", // Added
      "DVD (1 layer, 2 side)", // Added
      "DVD (2 layer, 2 side)", // Added
    ],
    factors: {
      "Byte (B)": 1,
      "Kilobyte (KB)": 1024,
      "Megabyte (MB)": 1024 ** 2,
      "Gigabyte (GB)": 1024 ** 3,
      "Terabyte (TB)": 1024 ** 4,
      "Petabyte (PB)": 1024 ** 5,
      "Bit (b)": 1 / 8,
      Nibble: 0.5, // 4 bits = 0.5 bytes
      Character: 1, // Assuming 1 byte per character (ASCII/UTF-8 single-byte)
      Word: 2, // Assuming a 16-bit word
      "MAPM-word": 4, // Placeholder for a multi-precision arithmetic word, assuming 32-bit
      "Quadruple-word": 8, // Assuming 64-bit
      Block: 512, // Common block size
      "Kilobit (kb)": 1000 / 8, // 1000 bits
      "Kilobyte (10^3 bytes)": 1000, // Decimal Kilobyte
      "Megabit (Mb)": 1000000 / 8, // 10^6 bits
      "Megabyte (10^6 bytes)": 1000000, // Decimal Megabyte
      "Gigabit (Gb)": 1000000000 / 8, // 10^9 bits
      "Gigabyte (10^9 bytes)": 1000000000, // Decimal Gigabyte
      "Terabit (Tb)": 1e12 / 8, // 10^12 bits
      "Terabyte (10^12 bytes)": 1e12, // Decimal Terabyte
      "Petabit (Pb)": 1e15 / 8, // 10^15 bits
      "Petabyte (10^15 bytes)": 1e15, // Decimal Petabyte
      "Exabit (Eb)": 1e18 / 8, // 10^18 bits
      "Exabyte (EB)": 1e18, // Decimal Exabyte (10^18 bytes)
      'Floppy disk (3.5", DD)': 720 * 1024, // 720 KB
      'Floppy disk (3.5", HD)': 1.44 * 1024 * 1024, // 1.44 MB
      'Floppy disk (3.5", ED)': 2.88 * 1024 * 1024, // 2.88 MB
      'Floppy disk (5.25", DD)': 360 * 1024, // 360 KB
      'Floppy disk (5.25", HD)': 1.2 * 1024 * 1024, // 1.2 MB
      "Zip 100": 100 * 1000 * 1000, // 100 MB (decimal)
      "Zip 250": 250 * 1000 * 1000, // 250 MB (decimal)
      "Jaz 1GB": 1 * 1000 * 1000 * 1000, // 1 GB (decimal)
      "Jaz 2GB": 2 * 1000 * 1000 * 1000, // 2 GB (decimal)
      "CD (74 minute)": 650 * 1024 * 1024, // 650 MB (binary)
      "CD (80 minute)": 700 * 1024 * 1024, // 700 MB (binary)
      "DVD (1 layer, 1 side)": 4.7 * 1e9, // 4.7 GB (decimal)
      "DVD (2 layer, 1 side)": 8.5 * 1e9, // 8.5 GB (decimal)
      "DVD (1 layer, 2 side)": 9.4 * 1e9, // 9.4 GB (decimal)
      "DVD (2 layer, 2 side)": 17 * 1e9, // 17 GB (decimal)
    },
    type: "unit",
    keywords: [
      "bytes",
      "gigabytes",
      "megabytes",
      "terabytes",
      "data storage",
      "bit",
      "nibble",
      "character",
      "word",
      "kilobit",
      "megabit",
      "gigabit",
      "terabit",
      "petabit",
      "exabit",
      "floppy disk",
      "zip drive",
      "jaz drive",
      "cd",
      "dvd",
      "block",
      "quadruple-word",
      "mapm-word",
    ],
  },
  "Data Transfer Rate": {
    units: [
      "Bit per second (bps)",
      "Kilobit per second (kbps)",
      "Kilobyte per second (KBps)",
      "Kibibit per second (Kibps)",
      "Megabit per second (Mbps)",
      "Megabyte per second (MBps)",
      "Mebibit per second (Mibps)",
      "Gigabit per second (Gbps)",
      "Gigabyte per second (GBps)",
      "Gibibit per second (Gibps)",
      "Terabit per second (Tbps)",
      "Terabyte per second (TBps)",
      "Tebibit per second (Tibps)",
    ],
    factors: {
      "Bit per second (bps)": 1,
      "Kilobit per second (kbps)": 1000,
      "Kilobyte per second (KBps)": 8000, // 1 KB = 1000 Bytes, 1 Byte = 8 bits
      "Kibibit per second (Kibps)": 1024,
      "Megabit per second (Mbps)": 1000000,
      "Megabyte per second (MBps)": 8000000,
      "Mebibit per second (Mibps)": 1048576,
      "Gigabit per second (Gbps)": 1000000000,
      "Gigabyte per second (GBps)": 8000000000,
      "Gibibit per second (Gibps)": 1073741824,
      "Terabit per second (Tbps)": 1000000000000,
      "Terabyte per second (TBps)": 8000000000000,
      "Tebibit per second (Tibps)": 1099511627776,
    },
    type: "unit",
    keywords: [
      "bandwidth",
      "speed",
      "bit",
      "byte",
      "kilo",
      "mega",
      "giga",
      "tera",
      "kibi",
      "mebi",
      "gibi",
      "tebi",
      "per second",
    ],
  },
  "Frequency / Wavelength": {
    type: "unit",
    units: [
      "Hertz (Hz)",
      "Exahertz (EHz)",
      "Petahertz (PHz)",
      "Terahertz (THz)",
      "Gigahertz (GHz)",
      "Megahertz (MHz)",
      "Kilohertz (kHz)",
      "Hectohertz (hHz)",
      "Dekahertz (daHz)",
      "Decihertz (dHz)",
      "Centihertz (cHz)",
      "Millihertz (mHz)",
      "Microhertz (µHz)",
      "Nanohertz (nHz)",
      "Picohertz (pHz)",
      "Femtohertz (fHz)",
      "Attohertz (aHz)",
      "Cycle/second",
      "Wavelength in exametres (Em)",
      "Wavelength in petametres (Pm)",
      "Wavelength in terametres (Tm)",
      "Wavelength in gigametres (Gm)",
      "Wavelength in megametres (Mm)",
      "Wavelength in kilometres (km)",
      "Wavelength in hectometres (hm)",
      "Wavelength in dekametres (dam)",
      "Wavelength in metres (m)",
      "Wavelength in decimetres (dm)",
      "Wavelength in centimetres (cm)",
      "Wavelength in millimetres (mm)",
      "Wavelength in micrometres (µm)",
      "Wavelength in nanometres (nm)",
      "Electron Compton wavelength", // Added as a unit
      "Proton Compton wavelength", // Added as a unit
      "Neutron Compton wavelength", // Added as a unit
    ],
    convert: (value, fromUnit, toUnit) => {
      const speedOfLight = 299792458; // m/s (speed of light in vacuum)
      const h = 6.62607015e-34; // Planck constant in J·s
      const me = 9.1093837015e-31; // Electron mass in kg
      const mp = 1.67262192369e-27; // Proton mass in kg
      const mn = 1.67492749804e-27; // Neutron mass in kg

      const frequencyFactorsToHz = {
        "Hertz (Hz)": 1,
        "Exahertz (EHz)": 1e18,
        "Petahertz (PHz)": 1e15,
        "Terahertz (THz)": 1e12,
        "Gigahertz (GHz)": 1e9,
        "Megahertz (MHz)": 1e6,
        "Kilohertz (kHz)": 1e3,
        "Hectohertz (hHz)": 100,
        "Dekahertz (daHz)": 10,
        "Decihertz (dHz)": 0.1,
        "Centihertz (cHz)": 0.01,
        "Millihertz (mHz)": 0.001,
        "Microhertz (µHz)": 1e-6,
        "Nanohertz (nHz)": 1e-9,
        "Picohertz (pHz)": 1e-12,
        "Femtohertz (fHz)": 1e-15,
        "Attohertz (aHz)": 1e-18,
        "Cycle/second": 1,
      };

      const wavelengthFactorsToMeters = {
        "Wavelength in metres (m)": 1,
        "Wavelength in exametres (Em)": 1e18,
        "Wavelength in petametres (Pm)": 1e15,
        "Wavelength in terametres (Tm)": 1e12,
        "Wavelength in gigametres (Gm)": 1e9,
        "Wavelength in megametres (Mm)": 1e6,
        "Wavelength in kilometres (km)": 1e3,
        "Wavelength in hectometres (hm)": 100,
        "Wavelength in dekametres (dam)": 10,
        "Wavelength in decimetres (dm)": 0.1,
        "Wavelength in centimetres (cm)": 0.01,
        "Wavelength in millimetres (mm)": 0.001,
        "Wavelength in micrometres (µm)": 1e-6,
        "Wavelength in nanometres (nm)": 1e-9,
        "Electron Compton wavelength": h / (me * speedOfLight),
        "Proton Compton wavelength": h / (mp * speedOfLight),
        "Neutron Compton wavelength": h / (mn * speedOfLight),
      };

      // Determine if fromUnit is frequency or wavelength, and convert to base Hz or meters
      let valueInBaseUnit;
      let fromUnitType; // 'frequency' or 'wavelength'

      if (frequencyFactorsToHz[fromUnit] !== undefined) {
        valueInBaseUnit = value * frequencyFactorsToHz[fromUnit]; // Value in Hz
        fromUnitType = "frequency";
      } else if (wavelengthFactorsToMeters[fromUnit] !== undefined) {
        valueInBaseUnit = value * wavelengthFactorsToMeters[fromUnit]; // Value in meters
        fromUnitType = "wavelength";
      } else {
        return NaN; // Invalid 'From Unit'
      }

      // Determine if toUnit is frequency or wavelength
      let toUnitType;
      if (frequencyFactorsToHz[toUnit] !== undefined) {
        toUnitType = "frequency";
      } else if (wavelengthFactorsToMeters[toUnit] !== undefined) {
        toUnitType = "wavelength";
      } else {
        return NaN; // Invalid 'To Unit'
      }

      let result;

      if (fromUnitType === "frequency" && toUnitType === "frequency") {
        // Frequency to Frequency
        result = valueInBaseUnit / frequencyFactorsToHz[toUnit];
      } else if (fromUnitType === "wavelength" && toUnitType === "wavelength") {
        // Wavelength to Wavelength
        result = valueInBaseUnit / wavelengthFactorsToMeters[toUnit];
      } else if (fromUnitType === "frequency" && toUnitType === "wavelength") {
        // Frequency (Hz) to Wavelength (meters)
        const wavelengthInMeters = speedOfLight / valueInBaseUnit;
        result = wavelengthInMeters / wavelengthFactorsToMeters[toUnit];
      } else if (fromUnitType === "wavelength" && toUnitType === "frequency") {
        // Wavelength (meters) to Frequency (Hz)
        const frequencyInHz = speedOfLight / valueInBaseUnit;
        result = frequencyInHz / frequencyFactorsToHz[toUnit];
      } else {
        return NaN; // Should not be reached with the above logic
      }

      return result;
    },
    keywords: [
      "frequency",
      "wavelength",
      "light",
      "spectrum",
      "hertz",
      "exahertz",
      "petahertz",
      "terahertz",
      "gigahertz",
      "megahertz",
      "kilohertz",
      "hectohertz",
      "dekahertz",
      "decihertz",
      "centihertz",
      "millihertz",
      "microhertz",
      "nanohertz",
      "picohertz",
      "femtohertz",
      "attohertz",
      "cycle per second",
      "meter",
      "exameter",
      "petameter",
      "terameter",
      "gigameter",
      "megameter",
      "kilometer",
      "hectometer",
      "dekameter",
      "decimeter",
      "centimeter",
      "millimeter",
      "micrometer",
      "nanometer",
      "electron compton wavelength",
      "proton compton wavelength",
      "neutron compton wavelength",
    ],
  },
  "Bit/Byte Converter": {
    units: ["bit", "byte"],
    factors: { bit: 1, byte: 8 },
    type: "unit",
    keywords: ["binary"],
  },
  "Electric Voltage": {
    units: ["V", "mV", "kV"],
    factors: { V: 1, mV: 0.001, kV: 1000 },
    type: "unit",
    keywords: ["volt", "electricity"],
  },
  "Electric Current": {
    units: [
      "Ampere (A)",
      "Kiloampere (kA)",
      "Milliampere (mA)",
      "Biot (Bi)", // Added (same as abampere)
      "Abampere (abA)", // Added
      "EMU of current", // Added (electromagnetic unit, same as abampere)
      "Statampere (stA)", // Added (electrostatic unit)
      "ESU of current", // Added (electrostatic unit, same as statampere)
      "CGS e.m. unit", // Added (CGS electromagnetic unit, same as abampere)
      "CGS e.s. unit", // Added (CGS electrostatic unit, same as statampere)
    ],
    factors: {
      "Ampere (A)": 1,
      "Milliampere (mA)": 0.001,
      "Kiloampere (kA)": 1000,
      "Biot (Bi)": 10, // 1 Biot = 10 Amperes
      "Abampere (abA)": 10, // 1 Abampere = 10 Amperes
      "EMU of current": 10, // Electromagnetic unit of current
      "Statampere (stA)": 3.33564e-10, // 1 Statampere = 1 / (c * 10) A, where c is speed of light in cm/s
      "ESU of current": 3.33564e-10, // Electrostatic unit of current
      "CGS e.m. unit": 10, // CGS electromagnetic unit
      "CGS e.s. unit": 3.33564e-10, // CGS electrostatic unit
    },
    type: "unit",
    keywords: [
      "current",
      "flow of charge",
      "ampere",
      "electricity",
      "kiloampere",
      "milliampere",
      "biot",
      "abampere",
      "emu of current",
      "statampere",
      "esu of current",
      "cgs e.m. unit",
      "cgs e.s. unit",
    ],
  },
  "Electric Resistance": {
    units: [
      "Ohm (Ω)",
      "Megohm (MΩ)", // Added
      "Microhm (µΩ)", // Added
      "Volt/ampere (V/A)", // Added (same as Ohm)
      "Reciprocal siemens (1/S)", // Added (same as Ohm)
      "Abohm (abΩ)", // Added
      "EMU of resistance", // Added (same as abohm)
      "Statohm (stΩ)", // Added
      "ESU of resistance", // Added (same as statohm)
      "Quantized Hall resistance", // Added
    ],
    factors: {
      "Ohm (Ω)": 1,
      "Megohm (MΩ)": 1e6,
      "Microhm (µΩ)": 1e-6,
      "Volt/ampere (V/A)": 1,
      "Reciprocal siemens (1/S)": 1,
      "Abohm (abΩ)": 1e-9, // 1 Abohm = 10^-9 Ohms
      "EMU of resistance": 1e-9, // 1 EMU of resistance = 10^-9 Ohms
      "Statohm (stΩ)": 8.987551787e11, // 1 Statohm ≈ (2.99792458 × 10^10)^2 / 10^9 Ohms
      "ESU of resistance": 8.987551787e11, // 1 ESU of resistance ≈ 8.987551787 × 10^11 Ohms
      "Quantized Hall resistance": 25812.807, // Approximately 25812.807 Ohms
    },
    type: "unit",
    keywords: [
      "ohm",
      "megohm",
      "microhm",
      "volt per ampere",
      "reciprocal siemens",
      "abohm",
      "emu of resistance",
      "statohm",
      "esu of resistance",
      "quantized hall resistance",
    ],
  },
  "Electric Power": {
    units: ["W", "kW", "MW"],
    factors: { W: 1, kW: 1000, MW: 1000000 },
    type: "unit",
    keywords: ["watt", "electricity"],
  },
  Capacitance: {
    units: [
      "Farad (F)",
      "Exafarad (EF)", // Added
      "Petafarad (PF)", // Added
      "Terafarad (TF)", // Added
      "Gigafarad (GF)", // Added
      "Megafarad (MF)", // Added
      "Kilofarad (kF)", // Added
      "Hectofarad (hF)", // Added
      "Dekafarad (daF)", // Added
      "Decifarad (dF)", // Added
      "Centifarad (cF)", // Added
      "Millifarad (mF)", // Added
      "Microfarad (µF)",
      "Nanofarad (nF)", // Added
      "Picofarad (pF)",
      "Femtofarad (fF)", // Added
      "Attofarad (aF)", // Added
      "Coulomb/volt (C/V)", // Added (same as Farad)
      "Abfarad (abF)", // Added (electromagnetic unit)
      "EMU of capacitance", // Added (same as abfarad)
      "Statfarad (stF)", // Added (electrostatic unit)
      "ESU of capacitance", // Added (same as statfarad)
    ],
    factors: {
      "Farad (F)": 1,
      "Exafarad (EF)": 1e18,
      "Petafarad (PF)": 1e15,
      "Terafarad (TF)": 1e12,
      "Gigafarad (GF)": 1e9,
      "Megafarad (MF)": 1e6,
      "Kilofarad (kF)": 1e3,
      "Hectofarad (hF)": 1e2,
      "Dekafarad (daF)": 1e1,
      "Decifarad (dF)": 1e-1,
      "Centifarad (cF)": 1e-2,
      "Millifarad (mF)": 1e-3,
      "Microfarad (µF)": 1e-6,
      "Nanofarad (nF)": 1e-9,
      "Picofarad (pF)": 1e-12,
      "Femtofarad (fF)": 1e-15,
      "Attofarad (aF)": 1e-18,
      "Coulomb/volt (C/V)": 1,
      "Abfarad (abF)": 1e9, // 1 Abfarad = 10^9 Farads
      "EMU of capacitance": 1e9, // 1 EMU of capacitance = 10^9 Farads
      "Statfarad (stF)": 1.11265e-12, // 1 Statfarad ≈ 1.11265 x 10^-12 Farads
      "ESU of capacitance": 1.11265e-12, // 1 ESU of capacitance ≈ 1.11265 x 10^-12 Farads
    },
    type: "unit",
    keywords: [
      "farad",
      "exafarad",
      "petafarad",
      "terafarad",
      "gigafarad",
      "megafarad",
      "kilofarad",
      "hectofarad",
      "dekafarad",
      "decifarad",
      "centifarad",
      "millifarad",
      "microfarad",
      "nanofarad",
      "picofarad",
      "femtofarad",
      "attofarad",
      "coulomb per volt",
      "abfarad",
      "emu of capacitance",
      "statfarad",
      "esu of capacitance",
    ],
  },
  Inductance: {
    units: [
      "Henry (H)",
      "Exahenry (EH)", // Added
      "Petahenry (PH)", // Added
      "Terahenry (TH)", // Added
      "Gigahenry (GH)", // Added
      "Megahenry (MH)", // Added
      "Kilohenry (kH)", // Added
      "Hectohenry (hH)", // Added
      "Dekahenry (daH)", // Added
      "Decihenry (dH)", // Added
      "Centihenry (cH)", // Added
      "Millihenry (mH)",
      "Microhenry (µH)",
      "Nanohenry (nH)", // Added
      "Picohenry (pH)", // Added
      "Femtohenry (fH)", // Added
      "Attohenry (aH)", // Added
      "Weber/ampere (Wb/A)", // Added (same as Henry)
      "Abhenry (abH)", // Added (electromagnetic unit)
      "EMU of inductance", // Added (same as abhenry)
      "Stathenry (stH)", // Added (electrostatic unit)
      "ESU of inductance", // Added (same as stathenry)
    ],
    factors: {
      "Henry (H)": 1,
      "Exahenry (EH)": 1e18,
      "Petahenry (PH)": 1e15,
      "Terahenry (TH)": 1e12,
      "Gigahenry (GH)": 1e9,
      "Megahenry (MH)": 1e6,
      "Kilohenry (kH)": 1e3,
      "Hectohenry (hH)": 1e2,
      "Dekahenry (daH)": 1e1,
      "Decihenry (dH)": 1e-1,
      "Centihenry (cH)": 1e-2,
      "Millihenry (mH)": 1e-3,
      "Microhenry (µH)": 1e-6,
      "Nanohenry (nH)": 1e-9,
      "Picohenry (pH)": 1e-12,
      "Femtohenry (fH)": 1e-15,
      "Attohenry (aH)": 1e-18,
      "Weber/ampere (Wb/A)": 1,
      "Abhenry (abH)": 1e-9, // 1 Abhenry = 10^-9 Henrys
      "EMU of inductance": 1e-9, // 1 EMU of inductance = 10^-9 Henrys
      "Stathenry (stH)": 8.98755e11, // 1 Stathenry ≈ 8.98755 x 10^11 Henrys
      "ESU of inductance": 8.98755e11, // 1 ESU of inductance ≈ 8.98755 x 10^11 Henrys
    },
    type: "unit",
    keywords: [
      "henry",
      "exahenry",
      "petahenry",
      "terahenry",
      "gigahenry",
      "megahenry",
      "kilohenry",
      "hectohenry",
      "dekahenry",
      "decihenry",
      "centihenry",
      "millihenry",
      "microhenry",
      "nanohenry",
      "picohenry",
      "femtohenry",
      "attohenry",
      "weber per ampere",
      "abhenry",
      "emu of inductance",
      "stathenry",
      "esu of inductance",
    ],
  },
  "Electric Charge": {
    units: [
      "Coulomb (C)",
      "Megacoulomb (MC)", // Added
      "Kilocoulomb (kC)", // Added
      "Millicoulomb (mC)", // Added
      "Microcoulomb (µC)", // Added
      "Nanocoulomb (nC)", // Added
      "Picocoulomb (pC)", // Added
      "Abcoulomb (abC)", // Added
      "EMU of charge", // Added (same as abcoulomb)
      "Statcoulomb (stC)", // Added
      "ESU of charge", // Added (same as statcoulomb)
      "Franklin (Fr)", // Added (same as statcoulomb)
      "Ampere-hour (A·h)", // Added
      "Ampere-minute (A·min)", // Added
      "Ampere-second (A·s)", // Added
      "Faraday (based on carbon 12)", // Added
      "Elementary charge (e)", // Added
    ],
    factors: {
      "Coulomb (C)": 1,
      "Megacoulomb (MC)": 1e6,
      "Kilocoulomb (kC)": 1e3,
      "Millicoulomb (mC)": 1e-3,
      "Microcoulomb (µC)": 1e-6,
      "Nanocoulomb (nC)": 1e-9,
      "Picocoulomb (pC)": 1e-12,
      "Abcoulomb (abC)": 10, // 1 Abcoulomb = 10 Coulombs
      "EMU of charge": 10, // 1 EMU of charge = 10 Coulombs
      "Statcoulomb (stC)": 3.33564e-10, // 1 Statcoulomb ≈ 3.33564 × 10^-10 Coulombs
      "ESU of charge": 3.33564e-10, // 1 ESU of charge ≈ 3.33564 × 10^-10 Coulombs
      "Franklin (Fr)": 3.33564e-10, // 1 Franklin ≈ 3.33564 × 10^-10 Coulombs
      "Ampere-hour (A·h)": 3600, // 1 Ampere-hour = 3600 Coulombs
      "Ampere-minute (A·min)": 60, // 1 Ampere-minute = 60 Coulombs
      "Ampere-second (A·s)": 1, // 1 Ampere-second = 1 Coulomb
      "Faraday (based on carbon 12)": 96485.3321, // 1 Faraday ≈ 96485.3321 Coulombs
      "Elementary charge (e)": 1.602176634e-19, // 1 Elementary charge ≈ 1.602176634 × 10^-19 Coulombs
    },
    type: "unit",
    keywords: [
      "coulomb",
      "megacoulomb",
      "kilocoulomb",
      "millicoulomb",
      "microcoulomb",
      "nanocoulomb",
      "picocoulomb",
      "abcoulomb",
      "emu of charge",
      "statcoulomb",
      "esu of charge",
      "franklin",
      "ampere-hour",
      "ampere-minute",
      "ampere-second",
      "faraday",
      "elementary charge",
    ],
  },
  "Magnetic Field Strength": {
    type: "unit",
    units: [
      "Ampere/meter (A/m)",
      "Ampere turn/meter (At/m)", // Added (same as A/m)
      "Kiloampere/meter (kA/m)", // Added
      "Oersted (Oe)", // Added
    ],
    factors: {
      "Ampere/meter (A/m)": 1,
      "Ampere turn/meter (At/m)": 1,
      "Kiloampere/meter (kA/m)": 1000,
      "Oersted (Oe)": 1000 / (4 * Math.PI), // 1 Oersted = 1000 / (4π) A/m ≈ 79.57747 A/m
    },
    keywords: [
      "magnetic",
      "field",
      "strength",
      "ampere per meter",
      "ampere turn per meter",
      "kiloampere per meter",
      "oersted",
    ],
  },
  Illuminance: {
    units: ["lx", "lm"],
    convert: () =>
      "Requires surface area for conversion or distance from source.",
    type: "unit",
    keywords: ["lux", "lumen", "light"],
  },
  "Specific Heat Capacity": {
    units: [
      "Joule/kilogram/K (J/(kg·K))", // Changed from J/kg·K
      "Joule/kilogram/°C (J/(kg·°C))", // Added (same as J/kg·K)
      "Joule/gram/°C (J/(g·°C))", // Added
      "Kilojoule/kilogram/K (kJ/(kg·K))", // Added
      "Kilojoule/kilogram/°C (kJ/(kg·°C))", // Added
      "Calorie (IT)/gram/°C (cal (IT)/(g·°C))", // Added
      "Calorie (IT)/gram/°F (cal (IT)/(g·°F))", // Added
      "Calorie (th)/gram/°C (cal (th)/(g·°C))", // Added
      "Kilocalorie (IT)/kilogram/°C (kcal (IT)/(kg·°C))", // Added
      "Kilocalorie (th)/kilogram/°C (kcal (th)/(kg·°C))", // Added
      "Kilocalorie (IT)/kilogram/K (kcal (IT)/(kg·K))", // Added
      "Kilocalorie (th)/kilogram/K (kcal (th)/(kg·K))", // Added
      "Kilogram-force meter/kilogram/K (kgf·m/(kg·K))", // Added
      "Pound-force foot/pound/°R (lbf·ft/(lb·°R))", // Added
      "Btu (IT)/pound/°F (Btu (IT)/(lb·°F))", // Added
      "Btu (th)/pound/°F (Btu (th)/(lb·°F))", // Added
      "Btu (IT)/pound/°R (Btu (IT)/(lb·°R))", // Added
      "Btu (th)/pound/°R (Btu (th)/(lb·°R))", // Added
      "Btu (IT)/pound/°C (Btu (IT)/(lb·°C))", // Added
      "CHU/pound/°C (CHU/(lb·°C))", // Added
    ],
    factors: {
      "Joule/kilogram/K (J/(kg·K))": 1,
      "Joule/kilogram/°C (J/(kg·°C))": 1, // ΔK = Δ°C, so same factor
      "Joule/gram/°C (J/(g·°C))": 1000, // 1 J/(g·°C) = 1000 J/(kg·°C)
      "Kilojoule/kilogram/K (kJ/(kg·K))": 1000,
      "Kilojoule/kilogram/°C (kJ/(kg·°C))": 1000,
      "Calorie (IT)/gram/°C (cal (IT)/(g·°C))": 4186.8, // 1 cal (IT) = 4.1868 J, 1 g = 0.001 kg
      "Calorie (IT)/gram/°F (cal (IT)/(g·°F))": 7536.24, // 1 cal (IT)/(g·°F) = 4.1868 J/(g·(5/9)°C) = 4.1868 * (9/5) * 1000 J/(kg·°C)
      "Calorie (th)/gram/°C (cal (th)/(g·°C))": 4184, // 1 cal (th) = 4.184 J, 1 g = 0.001 kg
      "Kilocalorie (IT)/kilogram/°C (kcal (IT)/(kg·°C))": 4186.8, // 1 kcal (IT) = 4186.8 J
      "Kilocalorie (th)/kilogram/°C (kcal (th)/(kg·°C))": 4184, // 1 kcal (th) = 4184 J
      "Kilocalorie (IT)/kilogram/K (kcal (IT)/(kg·K))": 4186.8,
      "Kilocalorie (th)/kilogram/K (kcal (th)/(kg·K))": 4184,
      "Kilogram-force meter/kilogram/K (kgf·m/(kg·K))": 9.80665, // 1 kgf·m = 9.80665 J
      "Pound-force foot/pound/°R (lbf·ft/(lb·°R))": 538.032, // 1 lbf·ft = 1.35581795 J, 1 lb = 0.453592 kg, 1 °R = 5/9 K
      "Btu (IT)/pound/°F (Btu (IT)/(lb·°F))": 4186.8, // 1 Btu (IT) = 1055.06 J, 1 lb = 0.453592 kg, 1 °F = 5/9 K
      "Btu (th)/pound/°F (Btu (th)/(lb·°F))": 4184, // 1 Btu (th) = 1054.35 J, 1 lb = 0.453592 kg, 1 °F = 5/9 K
      "Btu (IT)/pound/°R (Btu (IT)/(lb·°R))": 4186.8, // Same as Btu (IT)/pound/°F
      "Btu (th)/pound/°R (Btu (th)/(lb·°R))": 4184, // Same as Btu (th)/pound/°F
      "Btu (IT)/pound/°C (Btu (IT)/(lb·°C))": 7536.24, // 1 Btu (IT)/(lb·°C) = 1 Btu (IT)/(lb·(9/5)°F) = 4186.8 * (9/5)
      "CHU/pound/°C (CHU/(lb·°C))": 4186.8, // 1 CHU = 1.8 Btu (IT) = 1899.108 J (approx 4186.8 J/(kg·°C))
    },
    type: "unit",
    keywords: [
      "heat",
      "energy",
      "specific heat capacity",
      "joule",
      "kilojoule",
      "calorie",
      "kilocalorie",
      "kilogram-force meter",
      "pound-force foot",
      "btu",
      "chu",
      "kelvin",
      "celsius",
      "fahrenheit",
      "rankine",
    ],
  },
  "Fuel Efficiency": {
    units: ["km/l", "mpg"],
    factors: { "km/l": 1, mpg: 0.425144 },
    type: "unit",
    keywords: ["mileage", "gas"],
  },
  "Pace / Running Speed": {
    units: ["km/h", "mph", "min/km", "min/mi"],
    convert: (value, from, to) => {
      let kmh;
      if (from === "km/h") kmh = value;
      else if (from === "mph") kmh = value * 1.60934;
      else if (from === "min/km") kmh = 60 / value;
      else if (from === "min/mi") kmh = (60 / value) * 1.60934;
      else return NaN;

      if (to === "km/h") return kmh;
      if (to === "mph") return kmh / 1.60934;
      if (to === "min/km") return 60 / kmh;
      if (to === "min/mi") return 96.5606 / kmh;
      return NaN;
    },
    type: "unit",
    keywords: ["running", "jogging", "speed"],
  },
  "Cooking Volume": {
    units: ["ml", "cup", "tbsp", "tsp", "L"],
    factors: { ml: 1, cup: 236.588, tbsp: 14.7868, tsp: 4.92892, L: 1000 },
    type: "unit",
    keywords: ["recipes", "ingredients"],
  },
  "Cooking Weight": {
    units: ["g", "oz", "lb"],
    factors: { g: 1, oz: 28.3495, lb: 453.592 },
    type: "unit",
    keywords: ["recipes", "ingredients"],
  },
  "Oven Temperature": {
    units: ["°C", "°F", "Gas Mark"],
    convert: (value, from, to) => {
      let celsius;
      if (from === "°C") celsius = value;
      else if (from === "°F") celsius = ((value - 32) * 5) / 9;
      else if (from === "K") celsius = value - 273.15;
      else return NaN;

      if (to === "°C") return celsius;
      if (to === "°F") return (celsius * 9) / 5 + 32;
      if (to === "K") return celsius + 273.15;
      if (to === "Gas Mark") {
        if (value === 0) celsius = 110;
        else if (value === 0.5) celsius = 120;
        else if (value === 1) celsius = 140;
        else if (value === 2) celsius = 150;
        else if (value === 3) celsius = 170;
        else if (value === 4) celsius = 180;
        else if (value === 5) celsius = 190;
        else if (value === 6) celsius = 200;
        else if (value === 7) celsius = 220;
        else if (value === 8) celsius = 230;
        else if (value === 9) celsius = 240;
        else celsius = value * 14 + 121;
      } else return NaN;

      if (to === "°C") return celsius;
      if (to === "°F") return (celsius * 9) / 5 + 32;
      if (to === "K") return celsius + 273.15;
      if (to === "Gas Mark") {
        if (celsius <= 110) return 0;
        if (celsius <= 120) return 0.5;
        if (celsius <= 140) return 1;
        if (celsius <= 150) return 2;
        if (celsius <= 170) return 3;
        if (celsius <= 180) return 4;
        if (celsius <= 190) return 5;
        if (celsius <= 200) return 6;
        if (celsius <= 220) return 7;
        if (celsius <= 230) return 8;
        if (celsius <= 240) return 9;
        return (celsius - 121) / 14;
      }
      return NaN;
    },
    type: "unit",
    keywords: ["baking", "cooking", "heat"],
  },
  "Engine Power": {
    units: ["kW", "HP"],
    factors: { kW: 1, HP: 0.7457 },
    type: "unit",
    keywords: ["horsepower", "kilowatt"],
  },
  // Concentration: {
  //   units: ["mol/L", "%", "ppm"],
  //   convert: (value, from, to) => {
  //     let molL;
  //     if (from === "mol/L") molL = value;
  //     else if (from === "%") molL = value / 100;
  //     else if (from === "ppm") molL = value * 0.000001;
  //     else return NaN;

  //     if (to === "mol/L") return molL;
  //     if (to === "%") return molL * 100;
  //     if (to === "ppm") return molL / 0.000001;
  //     return NaN;
  //   },
  //   type: "unit",
  //   keywords: ["solution", "chemistry"],
  // },
  "Absorbed & Equivalent Dose": {
    // Renamed from "Radiation Units"
    units: ["Gray (Gy)", "Sievert (Sv)"],
    factors: {
      "Gray (Gy)": 1,
      "Sievert (Sv)": 1, // Assumes a radiation weighting factor (W_R) of 1 for general conversion
    },
    type: "unit",
    keywords: [
      "gray",
      "sievert",
      "absorbed dose",
      "equivalent dose",
      "radiation",
    ],
  },

  "Radiation Dose Rate": {
    type: "unit",
    units: [
      "Gray/second (Gy/s)",
      "Exagray/second (EGy/s)", // Added
      "Petagray/second (PGy/s)", // Added
      "Teragray/second (TGy/s)", // Added
      "Gigagray/second (GGy/s)", // Added
      "Megagray/second (MGy/s)", // Added
      "Kilogray/second (kGy/s)", // Added
      "Hectogray/second (hGy/s)", // Added
      "Dekagray/second (daGy/s)", // Added
      "Decigray/second (dGy/s)", // Added
      "Centigray/second (cGy/s)", // Added
      "Milligray/second (mGy/s)", // Added
      "Microgray/second (µGy/s)", // Added
      "Nanogray/second (nGy/s)", // Added
      "Picogray/second (pGy/s)", // Added
      "Femtogray/second (fGy/s)", // Added
      "Attogray/second (aGy/s)", // Added
      "Rad/second (rad/s)", // Added
      "Joule/kilogram/second (J/(kg·s))", // Added (same as Gy/s)
      "Watt/kilogram (W/kg)", // Added (same as Gy/s)
      "Sievert/second (Sv/s)", // Added
      "Rem/second (rem/s)", // Added
    ],
    factors: {
      "Gray/second (Gy/s)": 1,
      "Exagray/second (EGy/s)": 1e18,
      "Petagray/second (PGy/s)": 1e15,
      "Teragray/second (TGy/s)": 1e12,
      "Gigagray/second (GGy/s)": 1e9,
      "Megagray/second (MGy/s)": 1e6,
      "Kilogray/second (kGy/s)": 1e3,
      "Hectogray/second (hGy/s)": 1e2,
      "Dekagray/second (daGy/s)": 1e1,
      "Decigray/second (dGy/s)": 1e-1,
      "Centigray/second (cGy/s)": 1e-2,
      "Milligray/second (mGy/s)": 1e-3,
      "Microgray/second (µGy/s)": 1e-6,
      "Nanogray/second (nGy/s)": 1e-9,
      "Picogray/second (pGy/s)": 1e-12,
      "Femtogray/second (fGy/s)": 1e-15,
      "Attogray/second (aGy/s)": 1e-18,
      "Rad/second (rad/s)": 0.01, // 1 Gy = 100 rad
      "Joule/kilogram/second (J/(kg·s))": 1,
      "Watt/kilogram (W/kg)": 1,
      "Sievert/second (Sv/s)": 1, // Assumes W_R = 1
      "Rem/second (rem/s)": 0.01, // 1 Sv = 100 rem, assumes W_R = 1
    },
    keywords: [
      "radiation",
      "dose rate",
      "gray per second",
      "rad per second",
      "joule per kilogram per second",
      "watt per kilogram",
      "sievert per second",
      "rem per second",
    ],
  },
  "Shoe Size Converter": {
    units: ["US", "EU", "UK", "Asia (cm)"],
    convert: (value, from, to) => {
      let us;
      if (from === "US") us = value;
      else if (from === "EU") us = value - 33;
      else if (from === "UK") us = value + 1;
      else if (from === "Asia (cm)") us = (value - 15) / 2.54;
      else return NaN;

      if (to === "US") return us;
      if (to === "EU") return us + 33;
      if (to === "UK") return us - 1;
      if (to === "Asia (cm)") return us * 2.54 + 15;
      return NaN;
    },
    type: "unit",
    keywords: ["footwear", "shoe"],
  },
  "Clothing Size Converter": {
    units: ["US", "EU", "UK"],
    convert: (value, from, to) => {
      let us;
      if (from === "US") us = value;
      else if (from === "EU") us = value - 32;
      else if (from === "UK") us = value - 4;
      else return NaN;

      if (to === "US") return us;
      if (to === "EU") return us + 32;
      if (to === "UK") return us + 4;
      return NaN;
    },
    type: "unit",
    keywords: ["apparel", "dress"],
  },
  // B. Digital & Computer Converters
  "File Size Calculator": {
    type: "calculator",
    inputs: [
      { name: "Duration", unit: "seconds" },
      { name: "Bitrate", unit: "bps" },
      { name: "Size", unit: "bits" },
    ],
    keywords: ["storage", "data", "file"],
  },

  // C. Financial & Business Converters
  "Currency Converter": {
    type: "unit",
    api: true, // Indicate that this converter requires API
    units: ["USD", "EUR", "GBP", "JPY", "PKR", "CAD", "AUD", "INR"], // Currencies to display
    convert: (value, from, to, allRates) => {
      if (!allRates || Object.keys(allRates).length === 0) {
        return "Loading rates...";
      }
      if (!allRates[from] || !allRates[to]) {
        return "Invalid currency or rates not available.";
      }

      const valueInUSD = value / allRates[from];
      const convertedValue = valueInUSD * allRates[to];

      return convertedValue;
    },
    keywords: ["money", "exchange", "dollars", "euros", "rupees"],
  },
  "Loan / EMI Calculator": {
    type: "calculator",
    inputs: [
      { name: "Principal Amount", unit: "currency" },
      { name: "Annual Interest Rate", unit: "%" },
      { name: "Loan Tenure", unit: "months" },
    ],
    keywords: ["mortgage", "finance", "emi"],
  },
  "Interest Rate Calculator": {
    type: "calculator",
    inputs: [
      { name: "Principal", unit: "currency" },
      { name: "Rate", unit: "% per period" },
      { name: "Time", unit: "periods" },
    ],
    keywords: ["finance", "compound"],
  },
  "Discount Calculator": {
    type: "calculator",
    inputs: [
      { name: "Original Price", unit: "currency" },
      { name: "Discount Percentage", unit: "%" },
    ],
    keywords: ["sale", "price", "reduction"],
  },
  "Sales Tax / VAT Calculator": {
    type: "calculator",
    inputs: [
      { name: "Net Price", unit: "currency" },
      { name: "Tax Rate", unit: "%" },
    ],
    keywords: ["gst", "vat", "tax"],
  },
  "Investment Return Calculator (ROI)": {
    type: "calculator",
    inputs: [
      { name: "Initial Investment", unit: "currency" },
      { name: "Final Value", unit: "currency" },
    ],
    keywords: ["roi", "stock", "profit"],
  },

  // D. Engineering & Science Converters
  "Fuel Consumption Cost Calculator": {
    type: "calculator",
    inputs: [
      { name: "Distance", unit: "km" },
      { name: "Fuel Efficiency", unit: "km/L" },
      { name: "Fuel Price", unit: "currency/L" },
    ],
    calculate: (values) => {
      const distance = parseFloat(values.Distance);
      const fuelEfficiency = parseFloat(values["Fuel Efficiency"]);
      const fuelPrice = parseFloat(values["Fuel Price"]);

      if (
        isNaN(distance) ||
        isNaN(fuelEfficiency) ||
        isNaN(fuelPrice) ||
        fuelEfficiency === 0
      ) {
        return "Please enter valid positive numbers for all inputs.";
      }

      const fuelConsumed = distance / fuelEfficiency;
      const totalCost = fuelConsumed * fuelPrice;

      return `Total Fuel Cost: ${totalCost.toFixed(2)}`;
    },
    keywords: ["gasoline", "petrol", "mileage", "cost", "trip", "fuel"],
  },

  // E. Construction & Material Converters
  "Concrete Volume Calculator": {
    type: "calculator",
    inputs: [
      { name: "Length", unit: "m" },
      { name: "Width", unit: "m" },
      { name: "Depth", unit: "m" },
    ],
    keywords: ["cement", "mix", "slab"],
  },
  "Lumber / Wood Board Feet": {
    type: "calculator",
    inputs: [
      { name: "Thickness", unit: "inches" },
      { name: "Width", unit: "inches" },
      { name: "Length", unit: "feet" },
      { name: "Quantity", unit: "pieces" },
    ],
    keywords: ["timber", "wood", "board"],
  },
  "Steel Weight Calculator": {
    type: "calculator",
    inputs: [
      { name: "Length", unit: "m" },
      { name: "Width", unit: "m" },
      { name: "Height", unit: "m" },
    ],
    keywords: ["metal", "iron", "beam"],
  },
  "Tile & Flooring Calculator": {
    type: "calculator",
    inputs: [
      { name: "Room Length", unit: "m" },
      { name: "Room Width", unit: "m" },
      { name: "Tile Length", unit: "cm" },
      { name: "Tile Width", unit: "cm" },
      { name: "Grout Gap", unit: "mm" },
      { name: "Waste Percentage", unit: "%" },
    ],
    keywords: ["floor", "grout"],
  },
  "Paint Coverage Calculator": {
    type: "calculator",
    inputs: [
      { name: "Wall Length", unit: "m" },
      { name: "Wall Height", unit: "m" },
      { name: "Number of Coats", unit: "coats" },
      { name: "Coverage per Liter", unit: "m²/L" },
    ],
    keywords: ["wall", "liter"],
  },

  // F. Health, Fitness & Nutrition
  "BMI Calculator": {
    type: "calculator",
    inputs: [
      { name: "Weight", unit: "kg" },
      { name: "Height", unit: "m" },
    ],
    keywords: ["body mass index", "health"],
  },
  "Body Fat Calculator": {
    type: "calculator",
    inputs: [
      { name: "Weight", unit: "kg" },
      { name: "Height", unit: "cm" },
      { name: "Age", unit: "years" },
      { name: "Gender", unit: "select", options: ["Male", "Female"] },
    ],
    keywords: ["fat percentage", "fitness"],
  },
  "Calorie Burn Calculator": {
    type: "calculator",
    inputs: [
      { name: "Weight", unit: "kg" },
      {
        name: "Activity Type",
        unit: "select",
        options: [
          "Running",
          "Walking",
          "Cycling",
          "Swimming",
          "Aerobics",
          "Sitting",
          "Custom",
        ],
      },
      { name: "Duration", unit: "minutes" },
      {
        name: "MET Value",
        unit: "METs",
        optional: true,
        dependsOn: "Activity Type",
        dependsOnValue: "Custom",
      },
    ],
    keywords: ["exercise", "calories", "workout"],
  },
  "Water Intake Calculator": {
    type: "calculator",
    inputs: [
      { name: "Weight", unit: "kg" },
      {
        name: "Activity Level",
        unit: "select",
        options: ["Low", "Medium", "High"],
      },
    ],
    keywords: ["hydration", "water", "drink"],
  },

  // G. Cooking & Food Converters
  // "Ingredient-Specific Converter": {
  //   type: "calculator",
  //   inputs: [
  //     { name: "Amount", unit: "value" },
  //     { name: "Ingredient", unit: "text" },
  //     { name: "From Unit", unit: "text" },
  //     { name: "To Unit", unit: "text" },
  //   ],
  //   calculate: () =>
  //     "Advanced logic required for ingredient densities and conversion.",
  //   keywords: ["recipe", "food"],
  // },

  // H. Transport & Automotive Converters
  "Mileage / Distance Calculator": {
    type: "calculator",
    inputs: [
      { name: "Start Odometer", unit: "km" },
      { name: "End Odometer", unit: "km" },
      { name: "Fuel Used", unit: "Liters" },
      { name: "Fuel Price", unit: "currency/L" },
    ],
    keywords: ["car", "gas", "fuel", "trip"],
  },
  "Tire Size Converter": {
    type: "calculator",
    inputs: [
      { name: "Tire Width", unit: "mm" },
      { name: "Aspect Ratio", unit: "%" },
      { name: "Rim Diameter", unit: "inches" },
    ],
    keywords: ["car", "wheel"],
  },

  // I. Physics & Chemistry Converters
  // "Molar Mass Calculator": {
  //   type: "calculator",
  //   inputs: [{ name: "Chemical Formula", unit: "text" }],
  //   calculate: () =>
  //     "Complex parsing of chemical formula and atomic weights required.",
  //   keywords: ["chemistry", "molecule"],
  // },
  // "Pressure Drop (engineering)": {
  //   type: "calculator",
  //   inputs: [
  //     { name: "Flow Rate", unit: "m³/s" },
  //     { name: "Pipe Diameter", unit: "m" },
  //     { name: "Pipe Length", unit: "m" },
  //     { name: "Fluid Viscosity", unit: "Pa·s" },
  //     { name: "Fluid Density", unit: "kg/m³" },
  //   ],
  //   calculate: () =>
  //     "Complex engineering calculations required (e.g., Darcy-Weisbach equation).",
  //   keywords: ["fluid", "pipe", "engineering"],
  // },

  // J. Date, Time & Planning Tools
  "Age Calculator": {
    type: "calculator",
    inputs: [{ name: "Date of Birth", unit: "date" }],
    keywords: ["birthday", "birth", "years"],
  },
  "Date Difference Calculator": {
    type: "calculator",
    inputs: [
      { name: "Start Date", unit: "date" },
      { name: "End Date", unit: "date" },
    ],
    keywords: ["days", "duration"],
  },
  "Time Zone Converter": {
    type: "calculator",
    inputs: [
      { name: "Date", unit: "date" },
      { name: "Time", unit: "time" },
      { name: "From Time Zone", unit: "select", options: [] }, //
      { name: "To Time Zone", unit: "select", options: [] }, //
    ],
    calculate: async (values) => {
      const date = values["Date"];
      const time = values["Time"];
      const fromTimeZone = values["From Time Zone"];
      const toTimeZone = values["To Time Zone"];

      if (!date || !time || !fromTimeZone || !toTimeZone) {
        return "Please fill all fields.";
      }

      try {
        // Fetch datetime in the "From" time zone
        const fromResponse = await fetch(
          `https://worldtimeapi.org/api/timezone/${fromTimeZone}`
        );
        const fromData = await fromResponse.json();

        if (fromData.error) {
          return `Error in From Time Zone: ${fromData.error}`;
        }

        // Combine user's date and time with the 'from' timezone's offset to create a UTC datetime string
        // This is a simplified approach. A full-fledged solution would involve a date library.
        const userDateTime = new Date(`${date}T${time}:00`); // Assuming input time is local to 'from' timezone
        const fromOffsetSeconds =
          fromData.raw_offset + (fromData.dst ? fromData.dst_offset : 0);
        const userDateTimeUTC = new Date(
          userDateTime.getTime() - fromOffsetSeconds * 1000
        );

        // Fetch datetime in the "To" time zone
        const toResponse = await fetch(
          `https://worldtimeapi.org/api/timezone/${toTimeZone}`
        );
        const toData = await toResponse.json();

        if (toData.error) {
          return `Error in To Time Zone: ${toData.error}`;
        }

        const toOffsetSeconds =
          toData.raw_offset + (toData.dst ? toData.dst_offset : 0);
        const convertedDateTime = new Date(
          userDateTimeUTC.getTime() + toOffsetSeconds * 1000
        );

        const convertedDate = convertedDateTime.toISOString().split("T")[0];
        const convertedTime = convertedDateTime
          .toTimeString()
          .split(" ")[0]
          .substring(0, 5);

        return `Converted Time: ${convertedDate} ${convertedTime} (${toTimeZone})`;
      } catch (error) {
        console.error("Time zone conversion error:", error);
        return "Error during conversion. Check timezones or network.";
      }
    },
    keywords: ["utc", "gmt", "clock"],
  },
  "Work Hour Calculator": {
    type: "calculator",
    inputs: [
      { name: "Start Time", unit: "time" },
      { name: "End Time", unit: "time" },
      { name: "Break Duration", unit: "minutes" },
    ],
    keywords: ["work", "hours", "shift"],
  },
  "Countdown Calculator": {
    type: "calculator",
    inputs: [
      { name: "Target Date", unit: "date" },
      { name: "Target Time", unit: "time" },
    ],
    keywords: ["timer", "event", "deadline"],
  },

  // K. Miscellaneous Converters
  "Number System Converter": {
    type: "unit", // Keep as unit type, but with strong input validation
    units: ["Decimal", "Binary", "Hexadecimal", "Octal"],
    convert: (value, from, to) => {
      let decValue;
      try {
        const cleanedValue = String(value).trim();
        if (cleanedValue === "") return "Invalid input value";

        // --- Input Validation based on 'from' unit ---
        // Allow negative sign for decimal and hexadecimal for parseInt, but validate digits.
        // Binary and Octal typically don't use negative signs in direct representation; handled by parseInt.
        if (from === "Binary" && !/^-?[01]+$/.test(cleanedValue)) {
          return "Invalid input for Binary (0s and 1s only)";
        }
        if (from === "Octal" && !/^-?[0-7]+$/.test(cleanedValue)) {
          return "Invalid input for Octal (0-7 only)";
        }
        if (from === "Decimal" && !/^-?\\d+$/.test(cleanedValue)) {
          return "Invalid input for Decimal (digits 0-9 only)";
        }
        if (from === "Hexadecimal" && !/^-?[0-9A-Fa-f]+$/.test(cleanedValue)) {
          return "Invalid input for Hexadecimal (0-9, A-F only)";
        }
        // --- End Input Validation ---

        if (from === "Decimal") decValue = parseInt(cleanedValue, 10);
        else if (from === "Binary") decValue = parseInt(cleanedValue, 2);
        else if (from === "Hexadecimal") decValue = parseInt(cleanedValue, 16);
        else if (from === "Octal") decValue = parseInt(cleanedValue, 8);
        else return "Invalid 'From' unit selected"; // Should not happen with dropdown

        if (isNaN(decValue)) return "Invalid input value after parsing"; // More specific message

        if (to === "Decimal") return decValue.toString(10);
        else if (to === "Binary") return decValue.toString(2);
        else if (to === "Hexadecimal")
          return decValue.toString(16).toUpperCase();
        else if (to === "Octal") return decValue.toString(8);
        return "Invalid 'To' unit selected"; // Should not happen with dropdown
      } catch (error) {
        return "Error in conversion: " + error.message;
      }
    },
    keywords: ["base", "binary", "hex", "oct"],
  },
  "Text Case Converter": {
    type: "calculator",
    inputs: [{ name: "Text", unit: "text" }],
    keywords: ["upper", "lower", "title", "string"],
  },
  "Roman Numeral Converter": {
    type: "calculator", // CONFIRMED: Keep as calculator type for separate inputs
    inputs: [
      { name: "Decimal Input", unit: "number", optional: true },
      // { name: "Roman Input", unit: "text", optional: true },
    ],
    calculate: (values) => {
      const decimalInput = String(values["Decimal Input"] || "").trim(); // Ensure string, handle undefined/null
      const romanInput = String(values["Roman Input"] || "").trim(); // Ensure string, handle undefined/null

      const toRoman = (num) => {
        if (!Number.isInteger(num) || num < 1 || num > 3999)
          return "Invalid Decimal (1-3999)";
        const numerals = {
          1000: "M",
          900: "CM",
          500: "D",
          400: "CD",
          100: "C",
          90: "XC",
          50: "L",
          40: "XL",
          10: "X",
          9: "IX",
          5: "V",
          4: "IV",
          1: "I",
        };
        let result = "";
        for (const val of Object.keys(numerals).sort((a, b) => b - a)) {
          while (num >= parseInt(val, 10)) {
            result += numerals[val];
            num -= parseInt(val, 10);
          }
        }
        return result;
      };

      const fromRoman = (roman) => {
        const romanMap = {
          I: 1,
          V: 5,
          X: 10,
          L: 50,
          C: 100,
          D: 500,
          M: 1000,
        };
        let num = 0;
        const upperRoman = roman.toUpperCase();
        if (upperRoman === "") return NaN; // Explicitly handle empty input

        // Comprehensive validation for valid Roman characters and common invalid patterns
        if (!/^[MDCLXVI]+$/.test(upperRoman)) return NaN; // Only valid Roman characters
        // Invalid subtractive pairs or excessive repeats
        if (
          /(IIII|VV|XXXX|LL|CCCC|DD)/.test(upperRoman) || // e.g., IIII, XXXX, LLLL
          /(I[VXLC]|X[LCDM]|C[DM])/g.test(
            upperRoman.replace(/CD|CM|XL|XC/g, "")
          ) // ensure only one I before V/X, one X before L/C, one C before D/M
        ) {
          return NaN;
        }

        for (let i = 0; i < upperRoman.length; i++) {
          const current = romanMap[upperRoman[i]];
          const next = romanMap[upperRoman[i + 1]];
          if (current === undefined) return NaN; // Should be caught by regex, but safety check

          if (next && current < next) {
            // Further refine validation for subtractive pairs: only I can precede V or X, X can precede L or C, C can precede D or M.
            // And each can only do so once.
            if (
              (current === 1 && (next === 5 || next === 10)) || // IV, IX
              (current === 10 && (next === 50 || next === 100)) || // XL, XC
              (current === 100 && (next === 500 || next === 1000)) // CD, CM
            ) {
              num += next - current;
              i++;
            } else {
              return NaN; // Invalid subtractive combination (e.g., IL, IC, XD, XM)
            }
          } else {
            num += current;
          }
        }
        return num;
      };

      if (decimalInput !== "" && !isNaN(parseFloat(decimalInput))) {
        const num = parseInt(decimalInput, 10);
        return `Roman: ${toRoman(num)}`;
      } else if (romanInput !== "") {
        // Check for non-empty Roman input
        const result = fromRoman(romanInput);
        if (isNaN(result)) return "Invalid Roman numeral or sequence";
        return `Decimal: ${result}`;
      } else {
        return ""; // No valid input provided in either field
      }
    },
    keywords: ["roman", "numerals"],
  },

  // NEW: Scientific Calculator
  "Scientific Calculator": {
    type: "calculator",
    inputs: [], // No explicit inputs, managed internally
    keywords: ["math", "calculator", "science", "trigonometry"],
  },
  "Number Base Converter": {
    type: "unit",
    units: [
      "Binary (Base-2)",
      "Octal (Base-8)",
      "Decimal (Base-10)",
      "Hexadecimal (Base-16)",
      "Base-2",
      "Base-3",
      "Base-4",
      "Base-5",
      "Base-6",
      "Base-7",
      "Base-8",
      "Base-9",
      "Base-10",
      "Base-11",
      "Base-12",
      "Base-13",
      "Base-14",
      "Base-15",
      "Base-16",
      "Base-17",
      "Base-18",
      "Base-19",
      "Base-20",
      "Base-21",
      "Base-22",
      "Base-23",
      "Base-24",
      "Base-25",
      "Base-26",
      "Base-27",
      "Base-28",
      "Base-29",
      "Base-30",
      "Base-31",
      "Base-32",
      "Base-33",
      "Base-34",
      "Base-35",
      "Base-36",
    ],
    convert: (value, fromUnit, toUnit) => {
      let decValue;
      try {
        const cleanedValue = String(value).trim();
        if (cleanedValue === "") return "Invalid input value";

        // Helper to extract base from unit string (e.g., "Binary (Base-2)" -> 2, "Base-16" -> 16)
        const getBase = (unitString) => {
          if (unitString.includes("Base-")) {
            return parseInt(unitString.split("Base-")[1], 10);
          }
          switch (unitString) {
            case "Binary (Base-2)":
              return 2;
            case "Octal (Base-8)":
              return 8;
            case "Decimal (Base-10)":
              return 10;
            case "Hexadecimal (Base-16)":
              return 16;
            default:
              return NaN; // Should not happen with predefined units
          }
        };

        const fromBase = getBase(fromUnit);
        const toBase = getBase(toUnit);

        if (
          isNaN(fromBase) ||
          isNaN(toBase) ||
          fromBase < 2 ||
          fromBase > 36 ||
          toBase < 2 ||
          toBase > 36
        ) {
          return "Invalid base selected.";
        }

        // --- Input Validation based on 'fromBase' ---
        const validChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i = 0; i < cleanedValue.length; i++) {
          const char = cleanedValue[i].toUpperCase();
          if (char === "-" && i === 0) continue; // Allow negative sign at start
          const charValue = validChars.indexOf(char);
          if (charValue === -1 || charValue >= fromBase) {
            return `Invalid input for Base-${fromBase} (contains character not valid for this base)`;
          }
        }
        // --- End Input Validation ---

        decValue = parseInt(cleanedValue, fromBase);

        if (isNaN(decValue)) return "Invalid input value after parsing";

        return decValue.toString(toBase).toUpperCase();
      } catch (error) {
        return "Error in conversion: " + error.message;
      }
    },
    keywords: [
      "base",
      "binary",
      "octal",
      "decimal",
      "hexadecimal",
      "base conversion",
      "number system",
      "radix",
      "base-2",
      "base-3",
      "base-4",
      "base-5",
      "base-6",
      "base-7",
      "base-8",
      "base-9",
      "base-10",
      "base-11",
      "base-12",
      "base-13",
      "base-14",
      "base-15",
      "base-16",
      "base-17",
      "base-18",
      "base-19",
      "base-20",
      "base-21",
      "base-22",
      "base-23",
      "base-24",
      "base-25",
      "base-26",
      "base-27",
      "base-28",
      "base-29",
      "base-30",
      "base-31",
      "base-32",
      "base-33",
      "base-34",
      "base-35",
      "base-36",
    ],
  },
  "Volume - Dry": {
    type: "unit",
    units: [
      "Liter (L)", // Changed from Liter
      "Barrel dry (US) (bbl dry (US))", // Added
      "Pint dry (US) (pt dry (US))", // Added
      "Quart dry (US) (qt dry (US))", // Added
      "Peck (US) (pk (US))",
      "Peck (UK) (pk (UK))", // Added
      "Bushel (US) (bu (US))",
      "Bushel (UK) (bu (UK))", // Added
      "Cor (Biblical)", // Added
      "Homer (Biblical)", // Added (same as Cor)
      "Ephah (Biblical)", // Added
      "Seah (Biblical)", // Added
      "Omer (Biblical)", // Added
      "Cab (Biblical)", // Added
      "Log (Biblical)", // Added
    ],
    factors: {
      "Liter (L)": 1,
      "Dry Quart (US)": 1.101221, // Liters (already present, kept for consistency)
      "Peck (US) (pk (US))": 8.809768, // Liters (already present, kept for consistency)
      "Bushel (US) (bu (US))": 35.23907, // Liters (already present, kept for consistency)
      "Barrel dry (US) (bbl dry (US))": 115.627, // 1 US dry barrel = 115.627 liters
      "Pint dry (US) (pt dry (US))": 0.5506105, // 1 US dry pint = 0.5506105 liters
      "Quart dry (US) (qt dry (US))": 1.101221, // 1 US dry quart = 1.101221 liters
      "Peck (UK) (pk (UK))": 9.09218, // 1 UK peck = 9.09218 liters
      "Bushel (UK) (bu (UK))": 36.3687, // 1 UK bushel = 36.3687 liters
      "Cor (Biblical)": 220, // Approx. 220 liters
      "Homer (Biblical)": 220, // Approx. 220 liters (same as Cor)
      "Ephah (Biblical)": 22, // Approx. 22 liters
      "Seah (Biblical)": 7.33, // Approx. 7.33 liters
      "Omer (Biblical)": 2.2, // Approx. 2.2 liters
      "Cab (Biblical)": 1.22, // Approx. 1.22 liters
      "Log (Biblical)": 0.305, // Approx. 0.305 liters
    },
    type: "unit",
    keywords: [
      "dry",
      "volume",
      "grain",
      "liter",
      "barrel dry",
      "pint dry",
      "quart dry",
      "peck",
      "bushel",
      "biblical",
      "cor",
      "homer",
      "ephah",
      "seah",
      "omer",
      "cab",
      "log",
    ],
  },
  Case: {
    type: "calculator",
    inputs: [{ name: "Text", unit: "text" }],
    calculate: (values) => {
      const text = values.Text || "";
      if (text.trim() === "") return "";
      return `UPPER: ${text.toUpperCase()}\nlower: ${text.toLowerCase()}\nTitle: ${text.replace(
        /\b\w/g,
        (s) => s.toUpperCase()
      )}`;
    },
    keywords: ["text", "case", "upper", "lower"],
  },

  // Digital & Computer Converters (missing from converters object)
  "Digital Image Resolution": {
    type: "calculator",
    inputs: [
      { name: "Width", unit: "pixels" },
      { name: "Height", unit: "pixels" },
      { name: "DPI", unit: "dots per inch" },
    ],
    calculate: (values) => {
      const width = parseFloat(values.Width);
      const height = parseFloat(values.Height);
      const dpi = parseFloat(values.DPI);

      if (
        isNaN(width) ||
        isNaN(height) ||
        isNaN(dpi) ||
        width <= 0 ||
        height <= 0 ||
        dpi <= 0
      ) {
        return "Invalid inputs: All values must be positive numbers.";
      }

      const megapixels = (width * height) / 1000000;
      const widthInInches = width / dpi;
      const heightInInches = height / dpi;

      return `Megapixels: ${megapixels.toFixed(
        2
      )}\nPrint Size: ${widthInInches.toFixed(2)}in x ${heightInInches.toFixed(
        2
      )}in`;
    },
    keywords: ["image", "resolution", "pixels", "dpi"],
  },
  "Digital Resolution": {
    type: "unit",
    units: [
      "Dot/meter (dot/m)",
      "Dot/millimeter (dot/mm)",
      "Dot/inch (dot/in)",
      "Pixel/inch (pixel/in)",
    ],
    factors: {
      "Dot/meter (dot/m)": 1, // Base unit
      "Dot/millimeter (dot/mm)": 1000, // 1 dot/mm = 1000 dot/m
      "Dot/inch (dot/in)": 39.3701, // 1 inch = 0.0254 m, so 1 dot/in = 1/0.0254 dot/m = 39.3701 dot/m
      "Pixel/inch (pixel/in)": 39.3701, // Assuming 1 pixel = 1 dot for conversion purposes
    },
    keywords: ["resolution", "dpi", "ppi", "dots", "pixels", "image"],
  },
  // Engineering & Science Converters (missing from converters object)
  "Velocity - Angular": {
    type: "unit",
    units: [
      "Radian/second (rad/s)", // Changed from Radians per second
      "Radian/day (rad/d)", // Added
      "Radian/hour (rad/h)", // Added
      "Radian/minute (rad/min)", // Added
      "Degree/day (°/d)", // Added
      "Degree/hour (°/h)", // Added
      "Degree/minute (°/min)", // Added
      "Degree/second (°/s)", // Changed from Degrees per second
      "Revolution/day (r/d)", // Added
      "Revolution/hour (r/h)", // Added
      "Revolution/minute (r/min)", // Changed from Revolutions per minute
      "Revolution/second (r/s)", // Added
    ],
    factors: {
      "Radian/second (rad/s)": 1,
      "Radian/day (rad/d)": 1 / 86400, // 1 day = 86400 seconds
      "Radian/hour (rad/h)": 1 / 3600, // 1 hour = 3600 seconds
      "Radian/minute (rad/min)": 1 / 60, // 1 minute = 60 seconds
      "Degree/day (°/d)": Math.PI / 180 / 86400,
      "Degree/hour (°/h)": Math.PI / 180 / 3600,
      "Degree/minute (°/min)": Math.PI / 180 / 60,
      "Degree/second (°/s)": Math.PI / 180,
      "Revolution/day (r/d)": (2 * Math.PI) / 86400,
      "Revolution/hour (r/h)": (2 * Math.PI) / 3600,
      "Revolution/minute (r/min)": (2 * Math.PI) / 60,
      "Revolution/second (r/s)": 2 * Math.PI,
    },
    type: "unit",
    keywords: [
      "angular",
      "velocity",
      "rotation",
      "radian per second",
      "radian per day",
      "radian per hour",
      "radian per minute",
      "degree per day",
      "degree per hour",
      "degree per minute",
      "degree per second",
      "revolution per day",
      "revolution per hour",
      "revolution per minute",
      "revolution per second",
    ],
  },
  "Acceleration - Angular": {
    type: "unit",
    units: [
      "Radian/square second (rad/s²)", // Changed from Radians per second squared
      "Radian/square minute (rad/min²)", // Added
      "Revolution/square second (r/s²)", // Added
      "Revolution/minute/second (r/(min·s))", // Added
      "Revolution/square minute (r/min²)", // Added
      "Degree/square second (°/s²)", // Changed from Degrees per second squared
      "Revolutions per minute squared (rpm²)",
    ],
    factors: {
      "Radian/square second (rad/s²)": 1,
      "Degree/square second (°/s²)": Math.PI / 180,
      "Revolutions per minute squared (rpm²)": (2 * Math.PI) / (60 * 60),
      "Radian/square minute (rad/min²)": 1 / (60 * 60), // 1 rad / (60s)^2
      "Revolution/square second (r/s²)": 2 * Math.PI, // 1 revolution = 2π radians
      "Revolution/minute/second (r/(min·s))": (2 * Math.PI) / 60, // 1 revolution / (1 minute * 1 second)
      "Revolution/square minute (r/min²)": (2 * Math.PI) / (60 * 60), // 1 revolution / (60s)^2
    },
    type: "unit",
    keywords: [
      "angular",
      "acceleration",
      "rotation",
      "radian per square second",
      "radian per square minute",
      "revolution per square second",
      "revolution per minute per second",
      "revolution per square minute",
      "degree per square second",
      "revolutions per minute squared",
    ],
  },
  "Specific Volume": {
    type: "unit",
    units: [
      "Cubic meter/kilogram (m³/kg)", // Changed from Cubic meter per kilogram
      "Cubic centimeter/gram (cm³/g)", // Added
      "Liter/kilogram (L/kg)", // Added
      "Liter/gram (L/g)", // Added
      "Cubic foot/kilogram (ft³/kg)", // Added
      "Cubic foot/pound (ft³/lb)",
      "Gallon (US)/pound (gal (US)/lb)", // Added
      "Gallon (UK)/pound (gal (UK)/lb)", // Added
    ],
    factors: {
      "Cubic meter/kilogram (m³/kg)": 1,
      "Cubic foot/pound (ft³/lb)": 0.06242796,
      "Cubic centimeter/gram (cm³/g)": 0.001, // 1 cm^3 = 1e-6 m^3, 1 g = 1e-3 kg => (1e-6)/(1e-3) = 1e-3
      "Liter/kilogram (L/kg)": 0.001, // 1 L = 0.001 m^3
      "Liter/gram (L/g)": 1, // 1 L = 0.001 m^3, 1 g = 0.001 kg => (0.001)/(0.001) = 1
      "Cubic foot/kilogram (ft³/kg)": 0.0283168, // 1 ft^3 = 0.0283168 m^3
      "Gallon (US)/pound (gal (US)/lb)": 0.0083454, // 1 US gal = 0.00378541 m^3, 1 lb = 0.453592 kg => (0.00378541)/(0.453592)
      "Gallon (UK)/pound (gal (UK)/lb)": 0.0100224, // 1 Imp gal = 0.00454609 m^3, 1 lb = 0.453592 kg => (0.00454609)/(0.453592)
    },
    type: "unit",
    keywords: [
      "specific",
      "volume",
      "density",
      "cubic meter per kilogram",
      "cubic centimeter per gram",
      "liter per kilogram",
      "liter per gram",
      "cubic foot per kilogram",
      "cubic foot per pound",
      "gallon per pound",
    ],
  },
  "Moment of Inertia": {
    type: "unit",
    units: [
      "Kilogram meter squared (kg·m²)",
      "Kilogram centimeter squared (kg·cm²)", // Added
      "Kilogram millimeter squared (kg·mm²)", // Added
      "Gram centimeter squared (g·cm²)", // Added
      "Gram millimeter squared (g·mm²)", // Added
      "Pound foot squared (lb·ft²)",
      "Pound inch squared (lb·in²)", // Added
      "Ounce inch squared (oz·in²)", // Added
      "Slug foot squared (slug·ft²)", // Added
    ],
    factors: {
      "Kilogram meter squared (kg·m²)": 1,
      "Pound foot squared (lb·ft²)": 0.04214011, // 1 lb = 0.453592 kg, 1 ft = 0.3048 m
      "Kilogram centimeter squared (kg·cm²)": 0.0001, // 1 kg * (0.01 m)^2
      "Kilogram millimeter squared (kg·mm²)": 1e-6, // 1 kg * (0.001 m)^2
      "Gram centimeter squared (g·cm²)": 1e-7, // 0.001 kg * (0.01 m)^2
      "Gram millimeter squared (g·mm²)": 1e-9, // 0.001 kg * (0.001 m)^2
      "Pound inch squared (lb·in²)": 0.00029263965, // 1 lb = 0.453592 kg, 1 in = 0.0254 m
      "Ounce inch squared (oz·in²)": 1.8289978e-5, // 1 oz = 0.0283495 kg, 1 in = 0.0254 m
      "Slug foot squared (slug·ft²)": 1.35581795, // 1 slug = 14.5939 kg, 1 ft = 0.3048 m
    },
    type: "unit",
    keywords: [
      "inertia",
      "rotational",
      "mass",
      "kilogram meter squared",
      "kilogram centimeter squared",
      "kilogram millimeter squared",
      "gram centimeter squared",
      "gram millimeter squared",
      "pound foot squared",
      "pound inch squared",
      "ounce inch squared",
      "slug foot squared",
    ],
  },
  "Moment of Force": {
    type: "unit",
    units: [
      "Newton meter (N·m)",
      "Kilonewton meter (kN·m)", // Added
      "Millinewton meter (mN·m)", // Added
      "Micronewton meter (µN·m)", // Added
      "Ton-force (short) meter", // Added
      "Ton-force (long) meter", // Added
      "Ton-force (metric) meter", // Added
      "Kilogram-force meter (kgf·m)", // Added
      "Gram-force centimeter", // Added
      "Pound-force foot (lbf·ft)",
      "Poundal foot (pdl·ft)", // Added
      "Poundal inch (pdl·in)", // Added
    ],
    factors: {
      "Newton meter (N·m)": 1,
      "Pound-force foot (lbf·ft)": 1.35581795,
      "Kilonewton meter (kN·m)": 1000,
      "Millinewton meter (mN·m)": 0.001,
      "Micronewton meter (µN·m)": 1e-6,
      "Ton-force (short) meter": 8896.4432, // 1 short ton-force = 2000 lbf
      "Ton-force (long) meter": 9964.0164, // 1 long ton-force = 2240 lbf
      "Ton-force (metric) meter": 9806.65, // 1 metric ton-force = 1000 kgf
      "Kilogram-force meter (kgf·m)": 9.80665,
      "Gram-force centimeter": 0.0000980665, // 1 gf = 0.00980665 N, 1 cm = 0.01 m
      "Poundal foot (pdl·ft)": 0.04214011,
      "Poundal inch (pdl·in)": 0.003511675, // 1 pdl·ft = 0.04214011 N·m, 1 inch = 1/12 foot
    },
    type: "unit",
    keywords: [
      "moment",
      "force",
      "torque",
      "newton meter",
      "kilonewton meter",
      "millinewton meter",
      "micronewton meter",
      "ton-force meter",
      "kilogram-force meter",
      "gram-force centimeter",
      "pound-force foot",
      "poundal foot",
      "poundal inch",
    ],
  },

  // Heat & Thermal Converters (missing from converters object)
  "Fuel Efficiency - Mass": {
    type: "unit",
    units: [
      "Joule/kilogram (J/kg)",
      "Kilojoule/kilogram (kJ/kg)",
      "Calorie (IT)/gram (cal (IT)/g)",
      "Calorie (th)/gram (cal (th)/g)",
      "Btu (IT)/pound (Btu (IT)/lb)",
      "Btu (th)/pound (Btu (th)/lb)",
      "Kilogram/joule (kg/J)",
      "Kilogram/kilojoule (kg/kJ)",
      "Gram/calorie (IT) (g/cal (IT))",
      "Gram/calorie (th) (g/cal (th))",
      "Pound/Btu (IT) (lb/Btu (IT))",
      "Pound/Btu (th) (lb/Btu (th))",
      "Pound/horsepower/hour (lb/(hp·h))",
      "Gram/horsepower (metric)/hour (g/(ps·h))",
      "Gram/kilowatt/hour (g/(kW·h))",
    ],
    convert: (value, fromUnit, toUnit) => {
      // Define factors relative to J/kg for energy/mass units, and kg/J for mass/energy units.
      const unitConversionMap = {
        "Joule/kilogram (J/kg)": { type: "energy/mass", factor: 1 },
        "Kilojoule/kilogram (kJ/kg)": { type: "energy/mass", factor: 1000 },
        "Calorie (IT)/gram (cal (IT)/g)": {
          type: "energy/mass",
          factor: 4186.8,
        }, // 1 cal(IT)/g = 4186.8 J/kg
        "Calorie (th)/gram (cal (th)/g)": { type: "energy/mass", factor: 4184 }, // 1 cal(th)/g = 4184 J/kg
        "Btu (IT)/pound (Btu (IT)/lb)": { type: "energy/mass", factor: 2326.0 }, // 1 Btu(IT)/lb = 2326.0 J/kg
        "Btu (th)/pound (Btu (th)/lb)": { type: "energy/mass", factor: 2324.4 }, // 1 Btu(th)/lb = 2324.4 J/kg

        "Kilogram/joule (kg/J)": { type: "mass/energy", factor: 1 },
        "Kilogram/kilojoule (kg/kJ)": { type: "mass/energy", factor: 0.001 }, // 1 kg / 1000 J
        "Gram/calorie (IT) (g/cal (IT))": {
          type: "mass/energy",
          factor: 0.001 / 4.1868,
        }, // 1 g / 1 cal(IT) = 0.001 kg / 4.1868 J
        "Gram/calorie (th) (g/cal (th))": {
          type: "mass/energy",
          factor: 0.001 / 4.184,
        }, // 1 g / 1 cal(th) = 0.001 kg / 4.184 J
        "Pound/Btu (IT) (lb/Btu (IT))": {
          type: "mass/energy",
          factor: 0.453592 / 1055.06,
        }, // 1 lb / 1 Btu(IT)
        "Pound/Btu (th) (lb/Btu (th))": {
          type: "mass/energy",
          factor: 0.453592 / 1054.35,
        }, // 1 lb / 1 Btu(th)

        "Pound/horsepower/hour (lb/(hp·h))": {
          type: "mass/energy",
          factor: 0.453592 / 2684519.53,
        }, // 1 lb / (1 mechanical hp·h)
        "Gram/horsepower (metric)/hour (g/(ps·h))": {
          type: "mass/energy",
          factor: 0.001 / 2647795.5,
        }, // 1 g / (1 metric hp·h)
        "Gram/kilowatt/hour (g/(kW·h))": {
          type: "mass/energy",
          factor: 0.001 / 3600000,
        }, // 1 g / (1 kW·h)
      };

      const fromUnitData = unitConversionMap[fromUnit];
      const toUnitData = unitConversionMap[toUnit];

      if (!fromUnitData || !toUnitData) {
        return NaN; // Invalid unit selected
      }

      let valueInBaseEnergyPerMass; // Internal base for calculation: J/kg

      // Step 1: Convert the input value to J/kg equivalent
      if (fromUnitData.type === "energy/mass") {
        valueInBaseEnergyPerMass = value * fromUnitData.factor;
      } else if (fromUnitData.type === "mass/energy") {
        // If fromUnit is kg/J-like, convert it to J/kg
        valueInBaseEnergyPerMass = 1 / (value * fromUnitData.factor);
      } else {
        return NaN; // Should not happen
      }

      let result;

      // Step 2: Convert from internal J/kg equivalent to the target unit
      if (toUnitData.type === "energy/mass") {
        result = valueInBaseEnergyPerMass / toUnitData.factor;
      } else if (toUnitData.type === "mass/energy") {
        // If toUnit is kg/J-like, convert J/kg to kg/J and then scale
        result = 1 / valueInBaseEnergyPerMass / toUnitData.factor;
      } else {
        return NaN; // Should not happen
      }

      return result;
    },
    keywords: [
      "fuel",
      "efficiency",
      "mass",
      "consumption",
      "energy",
      "joule per kilogram",
      "kilojoule per kilogram",
      "calorie per gram",
      "btu per pound",
      "kilogram per joule",
      "kilogram per kilojoule",
      "gram per calorie",
      "pound per btu",
      "pound per horsepower hour",
      "gram per horsepower hour",
      "gram per kilowatt hour",
    ],
  },
  "Fuel Efficiency - Volume": {
    type: "unit",
    units: [
      "Joule/cubic meter (J/m³)",
      "Joule/liter (J/L)",
      "Megajoule/cubic meter (MJ/m³)",
      "Kilojoule/cubic meter (kJ/m³)",
      "Kilocalorie (IT)/cubic meter",
      "Calorie (IT)/cubic centimeter",
      "Therm/cubic foot (therm/ft³)",
      "Therm/gallon (UK)",
      "Btu (IT)/cubic foot (Btu (IT)/ft³)",
      "Btu (th)/cubic foot (Btu (th)/ft³)",
      "CHU/cubic foot (CHU/ft³)",
      "Cubic meter/joule (m³/J)",
      "Liter/joule (L/J)",
      "Gallon (US)/horsepower-hour (gal (US)/hp·h)",
      "Gallon (US)/horsepower (gal (US)/hp)", // Assuming per unit of power/time, like per hour
      "Kilometer per liter (km/L)", // Original
      "Mile per gallon (mpg)", // Original
    ],
    convert: (value, fromUnit, toUnit) => {
      // Define factors relative to J/m³ for energy/volume units, and m³/J for volume/energy units.
      // 1 L = 0.001 m³
      // 1 gal (US) = 0.00378541 m³
      // 1 gal (UK) = 0.00454609 m³
      const unitConversionMap = {
        "Joule/cubic meter (J/m³)": { type: "energy/volume", factor: 1 },
        "Joule/liter (J/L)": { type: "energy/volume", factor: 1000 }, // 1 J/L = 1000 J/m³
        "Megajoule/cubic meter (MJ/m³)": { type: "energy/volume", factor: 1e6 },
        "Kilojoule/cubic meter (kJ/m³)": {
          type: "energy/volume",
          factor: 1000,
        },
        "Kilocalorie (IT)/cubic meter": {
          type: "energy/volume",
          factor: 4186.8,
        }, // 1 kcal(IT)/m³ = 4186.8 J/m³
        "Calorie (IT)/cubic centimeter": {
          type: "energy/volume",
          factor: 4.1868 * 1e6,
        }, // 1 cal(IT)/cm³ = 4.1868 J / (1e-6 m³)
        "Therm/cubic foot (therm/ft³)": {
          type: "energy/volume",
          factor: 1.05506e8 / 0.0283168,
        }, // 1 therm(US) = 1.05506e8 J, 1 ft³ = 0.0283168 m³
        "Therm/gallon (UK)": {
          type: "energy/volume",
          factor: 1.05506e8 / 0.00454609,
        }, // 1 therm(US) / 1 Imp gal
        "Btu (IT)/cubic foot (Btu (IT)/ft³)": {
          type: "energy/volume",
          factor: 1055.06 / 0.0283168,
        }, // 1 Btu(IT) / 1 ft³
        "Btu (th)/cubic foot (Btu (th)/ft³)": {
          type: "energy/volume",
          factor: 1054.35 / 0.0283168,
        }, // 1 Btu(th) / 1 ft³
        "CHU/cubic foot (CHU/ft³)": {
          type: "energy/volume",
          factor: 1899.108 / 0.0283168,
        }, // 1 CHU = 1.8 Btu(IT) = 1899.108 J (approx)

        "Cubic meter/joule (m³/J)": { type: "volume/energy", factor: 1 },
        "Liter/joule (L/J)": { type: "volume/energy", factor: 0.001 }, // 1 L = 0.001 m³
        "Gallon (US)/horsepower-hour (gal (US)/hp·h)": {
          type: "volume/energy",
          factor: 0.00378541 / 2684519.53,
        }, // 1 US gal / (1 hp·h)
        "Gallon (US)/horsepower (gal (US)/hp)": {
          type: "volume/energy",
          factor: 0.00378541 / (745.7 * 3600),
        }, // Assuming per hour, 1 US gal / (1 hp * 1 hour)
        "Kilometer per liter (km/L)": { type: "distance/volume", factor: 1000 }, // Base: m/m^3
        "Mile per gallon (mpg)": {
          type: "distance/volume",
          factor: 1609.34 / 0.00378541,
        }, // Base: m/m^3
      };

      const fromUnitData = unitConversionMap[fromUnit];
      const toUnitData = unitConversionMap[toUnit];

      if (!fromUnitData || !toUnitData) {
        return NaN; // Invalid unit selected
      }

      let valueInBase; // Internal base for calculation

      // Step 1: Convert the input value to a common base
      if (fromUnitData.type === "energy/volume") {
        valueInBase = value * fromUnitData.factor; // Value in J/m³
      } else if (fromUnitData.type === "volume/energy") {
        valueInBase = 1 / (value * fromUnitData.factor); // Value in J/m³ (reciprocal)
      } else if (fromUnitData.type === "distance/volume") {
        // Convert distance/volume to energy/volume (requires an assumed energy content per unit distance, which is not available)
        // For simplicity and direct conversion only, we'll assume a direct relation to another unit within this type.
        // For fuel efficiency, km/L and mpg are measures of distance traveled per unit volume of fuel.
        // To relate this to J/m³, we would need a "fuel energy density" (J/m³), which isn't part of these units.
        // Therefore, direct inter-conversion between 'distance/volume' and 'energy/volume' is not feasible without more input.
        // For now, we'll handle only conversions within the 'distance/volume' group, and between 'energy/volume' and 'volume/energy' groups.
        if (toUnitData.type === "distance/volume") {
          // If converting within distance/volume, we can use a direct conversion factor based on m/m^3 equivalent
          // For km/L (1000 m / 0.001 m^3 = 1,000,000 m^-2)
          // For mpg (1609.34 m / 0.00378541 m^3 = 425144.3 m^-2)
          const kmPerL_in_m_per_m3 = fromUnitData.factor; // This factor is already in m/m^3
          valueInBase = value * kmPerL_in_m_per_m3;
        } else {
          return NaN; // Cannot convert distance/volume to energy/volume directly
        }
      } else {
        return NaN; // Should not happen
      }

      let result;

      // Step 2: Convert from internal base to the target unit
      if (toUnitData.type === "energy/volume") {
        result = valueInBase / toUnitData.factor;
      } else if (toUnitData.type === "volume/energy") {
        result = 1 / valueInBase / toUnitData.factor;
      } else if (toUnitData.type === "distance/volume") {
        // If converting from distance/volume to distance/volume
        if (fromUnitData.type === "distance/volume") {
          const to_m_per_m3_factor = toUnitData.factor;
          result = valueInBase / to_m_per_m3_factor;
        } else {
          return NaN; // Cannot convert from energy/volume to distance/volume directly
        }
      } else {
        return NaN; // Should not happen
      }

      return result;
    },
    keywords: [
      "fuel",
      "efficiency",
      "volume",
      "consumption",
      "energy",
      "joule per cubic meter",
      "joule per liter",
      "megajoule per cubic meter",
      "kilojoule per cubic meter",
      "kilocalorie per cubic meter",
      "calorie per cubic centimeter",
      "therm per cubic foot",
      "therm per gallon",
      "btu per cubic foot",
      "chu per cubic foot",
      "cubic meter per joule",
      "liter per joule",
      "gallon per horsepower",
      "kilometer per liter",
      "mile per gallon",
    ],
  },
  Interval: {
    type: "unit",
    units: ["Second", "Minute", "Hour", "Day"],
    factors: {
      Second: 1,
      Minute: 60,
      Hour: 3600,
      Day: 86400,
    },
    keywords: ["time", "duration", "period"],
  },
  "Thermal Expansion": {
    type: "unit",
    units: [
      "Length/length/Kelvin (1/K)", // Added
      "Length/length/degree Celsius (1/°C)", // Added, same as 1/K for change in temperature
      "Length/length/degree Fahrenheit (1/°F)", // Added
      "Length/length/degree Rankine (1/°R)", // Added
      "Length/length/degree Reaumur (1/°r)", // Added
      "Coefficient of linear thermal expansion (1/°C)", // Existing
      "Coefficient of linear thermal expansion (1/°F)", // Existing
    ],
    factors: {
      "Length/length/Kelvin (1/K)": 1,
      "Length/length/degree Celsius (1/°C)": 1,
      "Length/length/degree Fahrenheit (1/°F)": 1.8, // 1/°F = (9/5) * 1/°C = 1.8 * 1/K
      "Length/length/degree Rankine (1/°R)": 1.8, // 1/°R = (9/5) * 1/K
      "Length/length/degree Reaumur (1/°r)": 1.25, // 1/°r = (5/4) * 1/°C = 1.25 * 1/K
      "Coefficient of linear thermal expansion (1/°C)": 1,
      "Coefficient of linear thermal expansion (1/°F)": 1.8,
    },
    type: "unit",
    keywords: [
      "thermal",
      "expansion",
      "temperature",
      "coefficient of thermal expansion",
      "kelvin",
      "celsius",
      "fahrenheit",
      "rankine",
      "reaumur",
    ],
  },
  "Thermal Resistance": {
    type: "unit",
    units: [
      "Kelvin per Watt (K/W)",
      "Degree Celsius per Watt (°C/W)",
      "Fahrenheit hour per BTU (IT) (°F·h/BTU (IT))", // Changed from BTU to BTU (IT)
      "Fahrenheit hour per BTU (th) (°F·h/BTU (th))", // Added
      "Fahrenheit second per BTU (IT) (°F·s/BTU (IT))", // Added
      "Fahrenheit second per BTU (th) (°F·s/BTU (th))", // Added
    ],
    factors: {
      "Kelvin per Watt (K/W)": 1,
      "Degree Celsius per Watt (°C/W)": 1, // ΔK = Δ°C, so same factor
      "Fahrenheit hour per BTU (IT) (°F·h/BTU (IT))":
        ((5 / 9) * 3600) / 1055.06, // 1.89563 from previous, recalculated for precision
      "Fahrenheit hour per BTU (th) (°F·h/BTU (th))":
        ((5 / 9) * 3600) / 1054.35,
      "Fahrenheit second per BTU (IT) (°F·s/BTU (IT))": 5 / 9 / 1055.06,
      "Fahrenheit second per BTU (th) (°F·s/BTU (th))": 5 / 9 / 1054.35,
    },
    type: "unit",
    keywords: [
      "thermal",
      "resistance",
      "heat",
      "kelvin per watt",
      "degree celsius per watt",
      "fahrenheit hour per btu",
      "fahrenheit second per btu",
      "btu (it)",
      "btu (th)",
    ],
  },
  "Thermal Conductivity": {
    type: "unit",
    units: [
      "Watt/meter/K (W/(m·K))", // Changed from W/m·K
      "Watt/centimeter/°C (W/(cm·°C))", // Added
      "Kilowatt/meter/K (kW/(m·K))", // Added
      "Calorie (IT)/second/cm/°C (cal (IT)/(s·cm·°C))", // Added
      "Calorie (th)/second/cm/°C (cal (th)/(s·cm·°C))", // Added
      "Kilocalorie (IT)/hour/meter/°C (kcal (IT)/(h·m·°C))", // Added
      "Kilocalorie (th)/hour/meter/°C (kcal (th)/(h·m·°C))", // Added
      "Btu (IT) inch/second/sq. foot/°F (Btu (IT)·in/(s·ft²·°F))", // Added
      "Btu (th) inch/second/sq. foot/°F (Btu (th)·in/(s·ft²·°F))", // Added
      "Btu (IT) foot/hour/sq. foot/°F (Btu (IT)·ft/(h·ft²·°F))", // Existing, simplified
      "Btu (th) foot/hour/sq. foot/°F (Btu (th)·ft/(h·ft²·°F))", // Added
      "Btu (IT) inch/hour/sq. foot/°F (Btu (IT)·in/(h·ft²·°F))", // Added
      "Btu (th) inch/hour/sq. foot/°F (Btu (th)·in/(h·ft²·°F))", // Added
    ],
    factors: {
      "Watt/meter/K (W/(m·K))": 1,
      "Btu (IT) foot/hour/sq. foot/°F (Btu (IT)·ft/(h·ft²·°F))": 1.730735, // This is 1 BTU/(h·ft·°F)
      "Watt/centimeter/°C (W/(cm·°C))": 100, // 1 W / (0.01 m * 1 K)
      "Kilowatt/meter/K (kW/(m·K))": 1000,
      "Calorie (IT)/second/cm/°C (cal (IT)/(s·cm·°C))": 418.68, // (4.1868 J) / (1 s * 0.01 m * 1 K)
      "Calorie (th)/second/cm/°C (cal (th)/(s·cm·°C))": 418.4, // (4.184 J) / (1 s * 0.01 m * 1 K)
      "Kilocalorie (IT)/hour/meter/°C (kcal (IT)/(h·m·°C))": 1.163, // (4186.8 J) / (3600 s * 1 m * 1 K)
      "Kilocalorie (th)/hour/meter/°C (kcal (th)/(h·m·°C))": 1.16222, // (4184 J) / (3600 s * 1 m * 1 K)
      "Btu (IT) inch/second/sq. foot/°F (Btu (IT)·in/(s·ft²·°F))": 518.8732, // (1055.06 J * 0.0254 m) / (1 s * (0.3048 m)² * (5/9) K)
      "Btu (th) inch/second/sq. foot/°F (Btu (th)·in/(s·ft²·°F))": 518.5259, // (1054.35 J * 0.0254 m) / (1 s * (0.3048 m)² * (5/9) K)
      "Btu (th) foot/hour/sq. foot/°F (Btu (th)·ft/(h·ft²·°F))": 1.72958, // (1054.35 J) / (3600 s * 0.3048 m * (5/9) K)
      "Btu (IT) inch/hour/sq. foot/°F (Btu (IT)·in/(h·ft²·°F))": 0.1442275, // (1055.06 J * 0.0254 m) / (3600 s * (0.3048 m)² * (5/9) K)
      "Btu (th) inch/hour/sq. foot/°F (Btu (th)·in/(h·ft²·°F))": 0.144133, // (1054.35 J * 0.0254 m) / (3600 s * (0.3048 m)² * (5/9) K)
    },
    type: "unit",
    keywords: [
      "thermal",
      "conductivity",
      "heat",
      "watt per meter kelvin",
      "watt per centimeter celsius",
      "kilowatt per meter kelvin",
      "calorie per second centimeter celsius",
      "kilocalorie per hour meter celsius",
      "btu inch per second square foot fahrenheit",
      "btu foot per hour square foot fahrenheit",
      "btu inch per hour square foot fahrenheit",
      "btu (it)",
      "btu (th)",
    ],
  },
  "Volumetric Heat Density": {
    // Keeping this name for clarity as it's truly volumetric
    type: "unit",
    units: ["Joule per cubic meter (J/m³)", "BTU per cubic foot (BTU/ft³)"],
    factors: {
      "Joule per cubic meter (J/m³)": 1,
      "BTU per cubic foot (BTU/ft³)": 37258.946,
    },
    keywords: ["heat", "density", "energy", "volumetric heat"],
  },
  "Heat Flux": {
    type: "unit",
    units: [
      "Joule/square meter (J/m²)",
      "Calorie (th)/square centimeter (cal (th)/cm²)",
      "Langley",
      "Btu (IT)/square foot (Btu (IT)/ft²)",
      "Btu (th)/square foot (Btu (th)/ft²)",
    ],
    factors: {
      "Joule/square meter (J/m²)": 1,
      "Calorie (th)/square centimeter (cal (th)/cm²)": 41840, // 1 cal (th) = 4.184 J, 1 cm² = 1e-4 m²
      Langley: 41840, // 1 Langley = 1 cal (th)/cm²
      "Btu (IT)/square foot (Btu (IT)/ft²)": 11356.52, // 1 Btu (IT) = 1055.06 J, 1 ft² = 0.092903 m²
      "Btu (th)/square foot (Btu (th)/ft²)": 11349.33, // 1 Btu (th) = 1054.35 J, 1 ft² = 0.092903 m²
    },
    keywords: ["heat", "flux", "energy per area", "radiation"],
  },
  "Heat Flux Density": {
    type: "unit",
    units: [
      "Watt/square meter (W/m²)",
      "Kilowatt/square meter (kW/m²)",
      "Watt/square centimeter (W/cm²)",
      "Watt/square inch (W/in²)",
      "Joule/second/square meter (J/(s·m²))",
      "Kilocalorie (IT)/hour/square meter (kcal (IT)/(h·m²))",
      "Kilocalorie (IT)/hour/square foot (kcal (IT)/(h·ft²))",
      "Calorie (IT)/second/square centimeter (cal (IT)/(s·cm²))",
      "Calorie (IT)/minute/square centimeter (cal (IT)/(min·cm²))",
      "Calorie (IT)/hour/square centimeter (cal (IT)/(h·cm²))",
      "Calorie (th)/second/square centimeter (cal (th)/(s·cm²))",
      "Calorie (th)/minute/square centimeter (cal (th)/(min·cm²))",
      "Calorie (th)/hour/square centimeter (cal (th)/(h·cm²))",
      "Dyne/hour/centimeter (dyn/(h·cm))",
      "Erg/hour/square millimeter (erg/(h·mm²))",
      "Foot pound/minute/square foot (ft·lbf/(min·ft²))",
      "Horsepower/square foot (hp/ft²)",
      "Horsepower (metric)/square foot (ps/ft²)",
      "Btu (IT)/second/square foot (Btu (IT)/(s·ft²))",
      "Btu (IT)/minute/square foot (Btu (IT)/(min·ft²))",
      "Btu (IT)/hour/square foot (Btu (IT)/(h·ft²))",
      "Btu (th)/second/square inch (Btu (th)/(s·in²))",
      "Btu (th)/second/square foot (Btu (th)/(s·ft²))",
      "Btu (th)/minute/square foot (Btu (th)/(min·ft²))",
      "Btu (th)/hour/square foot (Btu (th)/(h·ft²))",
      "CHU/hour/square foot (CHU/(h·ft²))",
    ],
    factors: {
      "Watt/square meter (W/m²)": 1,
      "Kilowatt/square meter (kW/m²)": 1000,
      "Watt/square centimeter (W/cm²)": 10000,
      "Watt/square inch (W/in²)": 1550.003, // 1 W / (0.0254 m)^2
      "Joule/second/square meter (J/(s·m²))": 1, // Same as W/m²
      "Kilocalorie (IT)/hour/square meter (kcal (IT)/(h·m²))": 1.163, // 4186.8 J / (3600 s * 1 m^2)
      "Kilocalorie (IT)/hour/square foot (kcal (IT)/(h·ft²))": 12.518, // 4186.8 J / (3600 s * 0.092903 m^2)
      "Calorie (IT)/second/square centimeter (cal (IT)/(s·cm²))": 41868, // 4.1868 J / (1 s * 1e-4 m^2)
      "Calorie (IT)/minute/square centimeter (cal (IT)/(min·cm²))": 697.8, // (4.1868 J) / (60 s * 1e-4 m^2)
      "Calorie (IT)/hour/square centimeter (cal (IT)/(h·cm²))": 11.63, // (4.1868 J) / (3600 s * 1e-4 m^2)
      "Calorie (th)/second/square centimeter (cal (th)/(s·cm²))": 41840, // 4.184 J / (1 s * 1e-4 m^2)
      "Calorie (th)/minute/square centimeter (cal (th)/(min·cm²))": 697.333, // (4.184 J) / (60 s * 1e-4 m^2)
      "Calorie (th)/hour/square centimeter (cal (th)/(h·cm²))": 11.6222, // (4.184 J) / (3600 s * 1e-4 m^2)
      "Dyne/hour/centimeter (dyn/(h·cm))": 2.77778e-9, // (1e-5 N) / (3600 s * 0.01 m) - this is force per length per time, not flux density
      "Erg/hour/square millimeter (erg/(h·mm²))": 2.77778e-6, // (1e-7 J) / (3600 s * 1e-6 m^2)
      "Foot pound/minute/square foot (ft·lbf/(min·ft²))": 22.59696, // (1.35581795 J) / (60 s * 0.092903 m^2)
      "Horsepower/square foot (hp/ft²)": 8026.56, // 745.7 W / 0.092903 m^2
      "Horsepower (metric)/square foot (ps/ft²)": 7916.63, // 735.49875 W / 0.092903 m^2
      "Btu (IT)/second/square foot (Btu (IT)/(s·ft²))": 11356.52, // 1055.06 J / (1 s * 0.092903 m^2)
      "Btu (IT)/minute/square foot (Btu (IT)/(min·ft²))": 189.275, // 1055.06 J / (60 s * 0.092903 m^2)
      "Btu (IT)/hour/square foot (Btu (IT)/(h·ft²))": 3.1546,
      "Btu (th)/second/square inch (Btu (th)/(s·in²))": 6894757, // 1054.35 J / (1 s * (0.0254 m)^2)
      "Btu (th)/second/square foot (Btu (th)/(s·ft²))": 11349.33, // 1054.35 J / (1 s * 0.092903 m^2)
      "Btu (th)/minute/square foot (Btu (th)/(min·ft²))": 189.155, // 1054.35 J / (60 s * 0.092903 m^2)
      "Btu (th)/hour/square foot (Btu (th)/(h·ft²))": 3.15248, // 1054.35 J / (3600 s * 0.092903 m^2)
      "CHU/hour/square foot (CHU/(h·ft²))": 5.67826, // 1 CHU = 1.8 Btu (IT) = 1899.108 J (approx) per hour per square foot
    },
    keywords: [
      "heat",
      "flux",
      "density",
      "transfer",
      "watt",
      "kilowatt",
      "joule",
      "calorie",
      "btu",
      "chu",
      "horsepower",
      "erg",
      "dyne",
    ],
  },
  "Heat Transfer Coefficient": {
    type: "unit",
    units: [
      "Watt/square meter/K (W/(m²·K))", // Changed from W/m²·K
      "Watt/square meter/°C (W/(m²·°C))", // Added
      "Joule/second/square meter/K (J/(s·m²·K))", // Added
      "Calorie (IT)/second/square centimeter/°C (cal (IT)/(s·cm²·°C))", // Added
      "Kilocalorie (IT)/hour/square meter/°C (kcal (IT)/(h·m²·°C))", // Added
      "Kilocalorie (IT)/hour/square foot/°C (kcal (IT)/(h·ft²·°C))", // Added
      "Btu (IT)/second/square foot/°F (Btu (IT)/(s·ft²·°F))", // Added
      "Btu (th)/second/square foot/°F (Btu (th)/(s·ft²·°F))", // Added
      "Btu (IT)/hour/square foot/°F (Btu (IT)/(h·ft²·°F))",
      "Btu (th)/hour/square foot/°F (Btu (th)/(h·ft²·°F))", // Added
      "CHU/hour/square foot/°C (CHU/(h·ft²·°C))", // Added
    ],
    factors: {
      "Watt/square meter/K (W/(m²·K))": 1,
      "BTU per hour square foot Fahrenheit (BTU/h·ft²·°F)": 5.67826, // Existing, now for IT
      "Watt/square meter/°C (W/(m²·°C))": 1, // ΔK = Δ°C
      "Joule/second/square meter/K (J/(s·m²·K))": 1, // 1 W = 1 J/s
      "Calorie (IT)/second/square centimeter/°C (cal (IT)/(s·cm²·°C))": 41868, // 4.1868 J / (1 s * 1e-4 m² * 1 K)
      "Kilocalorie (IT)/hour/square meter/°C (kcal (IT)/(h·m²·°C))": 1.163, // 4186.8 J / (3600 s * 1 m² * 1 K)
      "Kilocalorie (IT)/hour/square foot/°C (kcal (IT)/(h·ft²·°C))": 12.518, // 4186.8 J / (3600 s * 0.092903 m² * 1 K)
      "Btu (IT)/second/square foot/°F (Btu (IT)/(s·ft²·°F))": 20430.7, // 1055.06 J / (1 s * 0.092903 m² * (5/9) K)
      "Btu (th)/second/square foot/°F (Btu (th)/(s·ft²·°F))": 20417.2, // 1054.35 J / (1 s * 0.092903 m² * (5/9) K)
      "Btu (th)/hour/square foot/°F (Btu (th)/(h·ft²·°F))": 5.67448, // 1054.35 J / (3600 s * 0.092903 m² * (5/9) K)
      "CHU/hour/square foot/°C (CHU/(h·ft²·°C))": 5.67826, // 1 CHU = 1.8 Btu (IT) = 1899.108 J (approx)
    },
    type: "unit",
    keywords: [
      "heat",
      "transfer",
      "coefficient",
      "watt per square meter kelvin",
      "watt per square meter celsius",
      "joule per second square meter kelvin",
      "calorie per second square centimeter celsius",
      "kilocalorie per hour square meter celsius",
      "kilocalorie per hour square foot celsius",
      "btu per second square foot fahrenheit",
      "btu per hour square foot fahrenheit",
      "chu per hour square foot celsius",
    ],
  },

  // Fluids Converters (missing from converters object)
  Flow: {
    type: "unit",
    units: [
      "Cubic meter/second (m³/s)",
      "Cubic meter/day (m³/d)", // Added
      "Cubic meter/hour (m³/h)", // Added
      "Cubic meter/minute (m³/min)", // Added
      "Cubic centimeter/day (cm³/d)", // Added
      "Cubic centimeter/hour (cm³/h)", // Added
      "Cubic centimeter/minute (cm³/min)", // Added
      "Cubic centimeter/second (cm³/s)", // Added
      "Liter/day (L/d)", // Added
      "Liter/hour (L/h)", // Added
      "Liter/minute (L/min)", // Added
      "Liter/second (L/s)",
      "Milliliter/day (mL/d)", // Added
      "Milliliter/hour (mL/h)", // Added
      "Milliliter/minute (mL/min)", // Added
      "Milliliter/second (mL/s)", // Added
      "Gallon (US)/day (gal (US)/d)", // Added
      "Gallon (US)/hour (gal (US)/h)", // Added
      "Gallon (US)/minute (gal (US)/min)", // Changed from gal/min to gal (US)/min
      "Gallon (US)/second (gal (US)/s)", // Added
      "Gallon (UK)/day (gal (UK)/d)", // Added
      "Gallon (UK)/hour (gal (UK)/h)", // Added
      "Gallon (UK)/minute (gal (UK)/min)", // Added
      "Gallon (UK)/second (gal (UK)/s)", // Added
      "Kilobarrel (US)/day (kbbl (US)/d)", // Added
      "Barrel (US)/day (bbl (US)/d)", // Added
      "Barrel (US)/hour (bbl (US)/h)", // Added
      "Barrel (US)/minute (bbl (US)/min)", // Added
      "Barrel (US)/second (bbl (US)/s)", // Added
      "Acre-foot/year (ac·ft/y)", // Added
      "Acre-foot/day (ac·ft/d)", // Added
      "Acre-foot/hour (ac·ft/h)", // Added
      "Hundred-cubic foot/day (ccf/d)", // Added
      "Hundred-cubic foot/hour (ccf/h)", // Added
      "Hundred-cubic foot/minute (ccf/min)", // Added
      "Ounce (US fluid)/hour (fl oz (US)/h)", // Added
      "Ounce (US fluid)/minute (fl oz (US)/min)", // Added
      "Ounce (US fluid)/second (fl oz (US)/s)", // Added
      "Ounce (UK fluid)/hour (fl oz (UK)/h)", // Added
      "Ounce (UK fluid)/minute (fl oz (UK)/min)", // Added
      "Ounce (UK fluid)/second (fl oz (UK)/s)", // Added
      "Cubic yard/hour (yd³/h)", // Added
      "Cubic yard/minute (yd³/min)", // Added
      "Cubic yard/second (yd³/s)", // Added
      "Cubic foot/hour (ft³/h)", // Added
      "Cubic foot/minute (ft³/min)", // Added
      "Cubic foot/second (ft³/s)", // Added
      "Cubic inch/hour (in³/h)", // Added
      "Cubic inch/minute (in³/min)", // Added
      "Cubic inch/second (in³/s)", // Added
      // Mass flow units (converted to volumetric assuming gasoline density)
      "Pound/second (Gasoline at 15.5°C) (lb/s)", // Added (assuming 720 kg/m^3 gasoline density)
      "Pound/minute (Gasoline at 15.5°C) (lb/min)", // Added
      "Pound/hour (Gasoline at 15.5°C) (lb/h)", // Added
      "Pound/day (Gasoline at 15.5°C) (lb/d)", // Added
      "Kilogram/second (Gasoline at 15.5°C) (kg/s)", // Added
      "Kilogram/minute (Gasoline at 15.5°C) (kg/min)", // Added
      "Kilogram/hour (Gasoline at 15.5°C) (kg/h)", // Added
      "Kilogram/day (Gasoline at 15.5°C) (kg/d)", // Added
    ],
    factors: {
      "Cubic meter/second (m³/s)": 1,
      "Liter/second (L/s)": 0.001,
      "Gallon (US)/minute (gal (US)/min)": 0.0000630902,
      "Cubic meter/day (m³/d)": 1 / 86400,
      "Cubic meter/hour (m³/h)": 1 / 3600,
      "Cubic meter/minute (m³/min)": 1 / 60,
      "Cubic centimeter/day (cm³/d)": 1e-6 / 86400,
      "Cubic centimeter/hour (cm³/h)": 1e-6 / 3600,
      "Cubic centimeter/minute (cm³/min)": 1e-6 / 60,
      "Cubic centimeter/second (cm³/s)": 1e-6,
      "Liter/day (L/d)": 0.001 / 86400,
      "Liter/hour (L/h)": 0.001 / 3600,
      "Liter/minute (L/min)": 0.001 / 60,
      "Milliliter/day (mL/d)": 1e-6 / 86400,
      "Milliliter/hour (mL/h)": 1e-6 / 3600,
      "Milliliter/minute (mL/min)": 1e-6 / 60,
      "Milliliter/second (mL/s)": 1e-6,
      "Gallon (US)/day (gal (US)/d)": 0.00378541 / 86400,
      "Gallon (US)/hour (gal (US)/h)": 0.00378541 / 3600,
      "Gallon (US)/second (gal (US)/s)": 0.00378541,
      "Gallon (UK)/day (gal (UK)/d)": 0.00454609 / 86400,
      "Gallon (UK)/hour (gal (UK)/h)": 0.00454609 / 3600,
      "Gallon (UK)/minute (gal (UK)/min)": 0.00454609 / 60,
      "Gallon (UK)/second (gal (UK)/s)": 0.00454609,
      "Kilobarrel (US)/day (kbbl (US)/d)": (1000 * 0.11924047) / 86400,
      "Barrel (US)/day (bbl (US)/d)": 0.11924047 / 86400,
      "Barrel (US)/hour (bbl (US)/h)": 0.11924047 / 3600,
      "Barrel (US)/minute (bbl (US)/min)": 0.11924047 / 60,
      "Barrel (US)/second (bbl (US)/s)": 0.11924047,
      "Acre-foot/year (ac·ft/y)": 1233.48 / 31557600, // 1 year approx 365.25 days
      "Acre-foot/day (ac·ft/d)": 1233.48 / 86400,
      "Acre-foot/hour (ac·ft/h)": 1233.48 / 3600,
      "Hundred-cubic foot/day (ccf/d)": 2.83168 / 86400,
      "Hundred-cubic foot/hour (ccf/h)": 2.83168 / 3600,
      "Hundred-cubic foot/minute (ccf/min)": 2.83168 / 60,
      "Ounce (US fluid)/hour (fl oz (US)/h)": 2.95735e-5 / 3600,
      "Ounce (US fluid)/minute (fl oz (US)/min)": 2.95735e-5 / 60,
      "Ounce (US fluid)/second (fl oz (US)/s)": 2.95735e-5,
      "Ounce (UK fluid)/hour (fl oz (UK)/h)": 2.84131e-5 / 3600,
      "Ounce (UK fluid)/minute (fl oz (UK)/min)": 2.84131e-5 / 60,
      "Ounce (UK fluid)/second (fl oz (UK)/s)": 2.84131e-5,
      "Cubic yard/hour (yd³/h)": 0.764555 / 3600,
      "Cubic yard/minute (yd³/min)": 0.764555 / 60,
      "Cubic yard/second (yd³/s)": 0.764555,
      "Cubic foot/hour (ft³/h)": 0.0283168 / 3600,
      "Cubic foot/minute (ft³/min)": 0.0283168 / 60,
      "Cubic foot/second (ft³/s)": 0.0283168,
      "Cubic inch/hour (in³/h)": 1.63871e-5 / 3600,
      "Cubic inch/minute (in³/min)": 1.63871e-5 / 60,
      "Cubic inch/second (in³/s)": 1.63871e-5,
      // Conversions for gasoline mass flow (assuming density of 720 kg/m^3)
      "Pound/second (Gasoline at 15.5°C) (lb/s)": 0.453592 / 720, // (kg/s) / (kg/m^3) = m^3/s
      "Pound/minute (Gasoline at 15.5°C) (lb/min)": 0.453592 / 720 / 60,
      "Pound/hour (Gasoline at 15.5°C) (lb/h)": 0.453592 / 720 / 3600,
      "Pound/day (Gasoline at 15.5°C) (lb/d)": 0.453592 / 720 / 86400,
      "Kilogram/second (Gasoline at 15.5°C) (kg/s)": 1 / 720,
      "Kilogram/minute (Gasoline at 15.5°C) (kg/min)": 1 / 720 / 60,
      "Kilogram/hour (Gasoline at 15.5°C) (kg/h)": 1 / 720 / 3600,
      "Kilogram/day (Gasoline at 15.5°C) (kg/d)": 1 / 720 / 86400,
    },
    type: "unit",
    keywords: [
      "flow",
      "volume",
      "liquid",
      "cubic meter",
      "liter",
      "milliliter",
      "gallon",
      "barrel",
      "acre-foot",
      "hundred-cubic foot",
      "ounce",
      "cubic yard",
      "cubic foot",
      "cubic inch",
      "pound per second",
      "kilogram per second",
      "gasoline",
      "mass flow",
    ],
  },
  "Flow - Mass": {
    type: "unit",
    units: ["Kilogram per second (kg/s)", "Pound per second (lb/s)"],
    factors: {
      "Kilogram per second (kg/s)": 1,
      "Pound per second (lb/s)": 0.453592,
    },
    keywords: ["flow", "mass", "liquid"],
  },
  "Flow - Molar": {
    type: "unit",
    units: [
      "Mole per second (mol/s)",
      "Millimole per second (mmol/s)",
      "Examol/second (Emol/s)", // Added
      "Petamol/second (Pmol/s)", // Added
      "Teramol/second (Tmol/s)", // Added
      "Gigamol/second (Gmol/s)", // Added
      "Megamol/second (Mmol/s)", // Added
      "Kilomol/second (kmol/s)", // Added
      "Hectomol/second (hmol/s)", // Added
      "Dekamol/second (damol/s)", // Added
      "Decimol/second (dmol/s)", // Added
      "Centimol/second (cmol/s)", // Added
      "Micromol/second (µmol/s)", // Added
      "Nanomol/second (nmol/s)", // Added
      "Picomol/second (pmol/s)", // Added
      "Femtomol/second (fmol/s)", // Added
      "Attomol/second (amol/s)", // Added
      "Mole/minute (mol/min)", // Added
      "Mole/hour (mol/h)", // Added
      "Mole/day (mol/d)", // Added
      "Millimol/minute (mmol/min)", // Added
      "Millimol/hour (mmol/h)", // Added
      "Millimol/day (mmol/d)", // Added
      "Kilomol/minute (kmol/min)", // Added
      "Kilomol/hour (kmol/h)", // Added
      "Kilomol/day (kmol/d)", // Added
    ],
    factors: {
      "Mole per second (mol/s)": 1,
      "Millimole per second (mmol/s)": 0.001,
      "Examol/second (Emol/s)": 1e18,
      "Petamol/second (Pmol/s)": 1e15,
      "Teramol/second (Tmol/s)": 1e12,
      "Gigamol/second (Gmol/s)": 1e9,
      "Megamol/second (Mmol/s)": 1e6,
      "Kilomol/second (kmol/s)": 1000,
      "Hectomol/second (hmol/s)": 100,
      "Dekamol/second (damol/s)": 10,
      "Decimol/second (dmol/s)": 0.1,
      "Centimol/second (cmol/s)": 0.01,
      "Micromol/second (µmol/s)": 1e-6,
      "Nanomol/second (nmol/s)": 1e-9,
      "Picomol/second (pmol/s)": 1e-12,
      "Femtomol/second (fmol/s)": 1e-15,
      "Attomol/second (amol/s)": 1e-18,
      "Mole/minute (mol/min)": 1 / 60,
      "Mole/hour (mol/h)": 1 / 3600,
      "Mole/day (mol/d)": 1 / 86400,
      "Millimol/minute (mmol/min)": 0.001 / 60,
      "Millimol/hour (mmol/h)": 0.001 / 3600,
      "Millimol/day (mmol/d)": 0.001 / 86400,
      "Kilomol/minute (kmol/min)": 1000 / 60,
      "Kilomol/hour (kmol/h)": 1000 / 3600,
      "Kilomol/day (kmol/d)": 1000 / 86400,
    },
    type: "unit",
    keywords: [
      "flow",
      "molar",
      "chemistry",
      "mole per second",
      "millimole per second",
      "examol per second",
      "petamol per second",
      "teramol per second",
      "gigamol per second",
      "megamol per second",
      "kilomol per second",
      "hectomol per second",
      "dekamol per second",
      "decimol per second",
      "centimol per second",
      "micromol per second",
      "nanomol per second",
      "picomol per second",
      "femtomol per second",
      "attomol per second",
      "mole per minute",
      "mole per hour",
      "mole per day",
      "millimol per minute",
      "millimol per hour",
      "millimol per day",
      "kilomol per minute",
      "kilomol per hour",
      "kilomol per day",
    ],
  },
  "Mass Flux Density": {
    type: "unit",
    units: [
      "Kilogram/square meter second (kg/(m²·s))",
      "Gram/second/square meter (g/(s·m²))", // Added
      "Kilogram/hour/square meter (kg/(h·m²))", // Added
      "Kilogram/hour/square foot (kg/(h·ft²))", // Added
      "Gram/second/sq. centimeter (g/(s·cm²))", // Added
      "Pound/hour/square foot (lb/(h·ft²))", // Added
      "Pound/second/square foot (lb/(s·ft²))",
    ],
    factors: {
      "Kilogram/square meter second (kg/(m²·s))": 1,
      "Pound/second/square foot (lb/(s·ft²))": 4.8824, // 1 lb/(ft²·s) = 4.8824 kg/(m²·s)
      "Gram/second/square meter (g/(s·m²))": 0.001,
      "Kilogram/hour/square meter (kg/(h·m²))": 1 / 3600,
      "Kilogram/hour/square foot (kg/(h·ft²))": 1 / (3600 * 0.092903), // 1 kg / (3600 s * 0.092903 m^2)
      "Gram/second/sq. centimeter (g/(s·cm²))": 10, // 0.001 kg / (1 s * 1e-4 m^2)
      "Pound/hour/square foot (lb/(h·ft²))": 0.453592 / (3600 * 0.092903), // 1 lb / (3600 s * 1 ft^2)
    },
    type: "unit",
    keywords: [
      "mass",
      "flux",
      "density",
      "kilogram per square meter second",
      "gram per second square meter",
      "kilogram per hour square meter",
      "kilogram per hour square foot",
      "gram per second square centimeter",
      "pound per hour square foot",
      "pound per second square foot",
    ],
  },
  "Concentration - Molar": {
    type: "unit",
    units: [
      "Mole per liter (mol/L)",
      "Mole per cubic meter (mol/m³)", // Added
      "Mole per cubic centimeter (mol/cm³)", // Added
      "Mole per cubic millimeter (mol/mm³)", // Added
      "Kilomole per cubic meter (kmol/m³)", // Added
      "Kilomole per liter (kmol/L)", // Added
      "Kilomole per cubic centimeter (kmol/cm³)", // Added
      "Kilomole per cubic millimeter (kmol/mm³)", // Added
      "Millimole per cubic meter (mmol/m³)", // Added
      "Millimole per liter (mmol/L)",
      "Millimole per cubic centimeter (mmol/cm³)", // Added
      "Millimole per cubic millimeter (mmol/mm³)", // Added
    ],
    factors: {
      "Mole per liter (mol/L)": 1,
      "Millimole per liter (mmol/L)": 0.001,
      "Mole per cubic meter (mol/m³)": 0.001, // 1 mol/m³ = 0.001 mol/L
      "Mole per cubic centimeter (mol/cm³)": 1000, // 1 mol/cm³ = 1000 mol/L
      "Mole per cubic millimeter (mol/mm³)": 1e6, // 1 mol/mm³ = 1,000,000 mol/L
      "Kilomole per cubic meter (kmol/m³)": 1, // 1 kmol/m³ = 1000 mol/m³ = 1 mol/L
      "Kilomole per liter (kmol/L)": 1000, // 1 kmol/L = 1000 mol/L
      "Kilomole per cubic centimeter (kmol/cm³)": 1e6, // 1 kmol/cm³ = 1000 mol/cm³ = 1,000,000 mol/L
      "Kilomole per cubic millimeter (kmol/mm³)": 1e9, // 1 kmol/mm³ = 1000 mol/mm³ = 1,000,000,000 mol/L
      "Millimole per cubic meter (mmol/m³)": 1e-6, // 1 mmol/m³ = 0.001 mol/m³ = 1e-6 mol/L
      "Millimole per cubic centimeter (mmol/cm³)": 1, // 1 mmol/cm³ = 0.001 mol/cm³ = 1 mol/L
      "Millimole per cubic millimeter (mmol/mm³)": 1000, // 1 mmol/mm³ = 0.001 mol/mm³ = 1000 mol/L
    },
    type: "unit",
    keywords: [
      "molar",
      "concentration",
      "chemistry",
      "mole per liter",
      "mole per cubic meter",
      "mole per cubic centimeter",
      "mole per cubic millimeter",
      "kilomole",
      "millimole",
    ],
  },
  "Concentration - Solution": {
    type: "unit",
    units: [
      "Kilogram/liter (kg/L)", // Added
      "Gram/liter (g/L)",
      "Milligram/liter (mg/L)",
      "Part/million (ppm)", // Added (assuming ppm by mass in water, roughly 1 mg/L)
      "Grain/gallon (US) (gr/gal (US))", // Added
      "Grain/gallon (UK) (gr/gal (UK))", // Added
      "Pound/gallon (US) (lb/gal (US))", // Added
      "Pound/gallon (UK) (lb/gal (UK))", // Added
      "Pound/million gallon (US)", // Added
      "Pound/million gallon (UK)", // Added
      "Pound/cubic foot (lb/ft³)", // Added
    ],
    factors: {
      "Gram/liter (g/L)": 1,
      "Milligram/liter (mg/L)": 0.001,
      "Kilogram/liter (kg/L)": 1000,
      "Part/million (ppm)": 0.001, // Assuming 1 ppm = 1 mg/L for water solutions
      "Grain/gallon (US) (gr/gal (US))": 0.0171181, // 1 gr = 0.06479891 g, 1 US gal = 3.78541 L => 0.06479891 g / 3.78541 L
      "Grain/gallon (UK) (gr/gal (UK))": 0.01426, // 1 gr = 0.06479891 g, 1 UK gal = 4.54609 L => 0.06479891 g / 4.54609 L
      "Pound/gallon (US) (lb/gal (US))": 119.826, // 1 lb = 453.592 g, 1 US gal = 3.78541 L => 453.592 g / 3.78541 L
      "Pound/gallon (UK) (lb/gal (UK))": 99.7764, // 1 lb = 453.592 g, 1 UK gal = 4.54609 L => 453.592 g / 4.54609 L
      "Pound/million gallon (US)": 0.000119826, // (1 lb / 10^6 US gal) = (453.592 g) / (10^6 * 3.78541 L)
      "Pound/million gallon (UK)": 0.0000997764, // (1 lb / 10^6 UK gal) = (453.592 g) / (10^6 * 4.54609 L)
      "Pound/cubic foot (lb/ft³)": 16.0185, // 1 lb = 453.592 g, 1 ft³ = 28.3168 L => 453.592 g / 28.3168 L
    },
    type: "unit",
    keywords: [
      "solution",
      "concentration",
      "chemistry",
      "kilogram per liter",
      "gram per liter",
      "milligram per liter",
      "part per million",
      "grain per gallon",
      "pound per gallon",
      "pound per million gallon",
      "pound per cubic foot",
    ],
  },
  "Viscosity - Dynamic": {
    type: "unit",
    units: [
      "Pascal second (Pa·s)",
      "Kilogram-force second/square meter (kgf·s/m²)", // Added
      "Newton second/square meter (N·s/m²)", // Added (same as Pa·s)
      "Millinewton second/sq. meter (mN·s/m²)", // Added
      "Dyne second/sq. centimeter (dyn·s/cm²)", // Added
      "Poise (P)",
      "Exapoise (EP)", // Added
      "Petapoise (PP)", // Added
      "Terapoise (TP)", // Added
      "Gigapoise (GP)", // Added
      "Megapoise (MP)", // Added
      "Kilopoise (kP)", // Added
      "Hectopoise (hP)", // Added
      "Dekapoise (daP)", // Added
      "Decipoise (dP)", // Added
      "Centipoise (cP)",
      "Millipoise (mP)", // Added
      "Micropoise (µP)", // Added
      "Nanopoise (nP)", // Added
      "Picopoise (pP)", // Added
      "Femtopoise (fP)", // Added
      "Attopoise (aP)", // Added
      "Pound-force second/sq. inch (lbf·s/in²)", // Added
      "Pound-force second/sq. foot (lbf·s/ft²)", // Added
      "Poundal second/square foot (pdl·s/ft²)", // Added
      "Gram/centimeter/second (g/(cm·s))", // Added (same as Poise)
      "Slug/foot/second (slug/(ft·s))", // Added
      "Pound/foot/second (lb/(ft·s))", // Added
      "Pound/foot/hour (lb/(ft·h))", // Added
    ],
    factors: {
      "Pascal second (Pa·s)": 1,
      "Poise (P)": 0.1,
      "Centipoise (cP)": 0.001,
      "Kilogram-force second/square meter (kgf·s/m²)": 9.80665,
      "Newton second/square meter (N·s/m²)": 1,
      "Millinewton second/sq. meter (mN·s/m²)": 0.001,
      "Dyne second/sq. centimeter (dyn·s/cm²)": 0.1, // 1 dyn·s/cm² = 1 Poise
      "Exapoise (EP)": 1e17, // 1 EP = 10^18 P = 10^17 Pa·s
      "Petapoise (PP)": 1e14,
      "Terapoise (TP)": 1e11,
      "Gigapoise (GP)": 1e8,
      "Megapoise (MP)": 1e5,
      "Kilopoise (kP)": 100,
      "Hectopoise (hP)": 10,
      "Dekapoise (daP)": 1,
      "Decipoise (dP)": 0.01,
      "Millipoise (mP)": 0.0001,
      "Micropoise (µP)": 1e-8,
      "Nanopoise (nP)": 1e-11,
      "Picopoise (pP)": 1e-14,
      "Femtopoise (fP)": 1e-17,
      "Attopoise (aP)": 1e-20,
      "Pound-force second/sq. inch (lbf·s/in²)": 6894.757, // 1 lbf = 4.44822 N, 1 in² = 0.00064516 m²
      "Pound-force second/sq. foot (lbf·s/ft²)": 47.880258, // 1 lbf = 4.44822 N, 1 ft² = 0.092903 m²
      "Poundal second/square foot (pdl·s/ft²)": 1.488164, // 1 pdl = 0.138255 N, 1 ft² = 0.092903 m²
      "Gram/centimeter/second (g/(cm·s))": 0.1, // Same as Poise
      "Slug/foot/second (slug/(ft·s))": 47.880258, // 1 slug = 14.5939 kg, 1 ft = 0.3048 m
      "Pound/foot/second (lb/(ft·s))": 1.488164, // 1 lb = 0.453592 kg, 1 ft = 0.3048 m
      "Pound/foot/hour (lb/(ft·h))": 0.000413379, // 1.488164 / 3600
    },
    type: "unit",
    keywords: [
      "viscosity",
      "dynamic",
      "fluid",
      "pascal second",
      "kilogram-force second per square meter",
      "newton second per square meter",
      "millinewton second per square meter",
      "dyne second per square centimeter",
      "poise",
      "exapoise",
      "petapoise",
      "terapoise",
      "gigapoise",
      "megapoise",
      "kilopoise",
      "hectopoise",
      "dekapoise",
      "decipoise",
      "centipoise",
      "millipoise",
      "micropoise",
      "nanopoise",
      "picopoise",
      "femtopoise",
      "attopoise",
      "pound-force second per square inch",
      "pound-force second per square foot",
      "poundal second per square foot",
      "gram per centimeter second",
      "slug per foot second",
      "pound per foot second",
      "pound per foot hour",
    ],
  },
  "Viscosity - Kinematic": {
    type: "unit",
    units: [
      "Square meter/second (m²/s)", // Changed from Square meter per second
      "Square meter/hour (m²/h)", // Added
      "Square centimeter/second (cm²/s)", // Added
      "Square millimeter/second (mm²/s)", // Added
      "Square foot/second (ft²/s)", // Changed from Square foot per second
      "Square foot/hour (ft²/h)", // Added
      "Square inch/second (in²/s)", // Added
      "Stokes (St)", // Changed from Stoke
      "Exastokes (ESt)", // Added
      "Petastokes (PSt)", // Added
      "Terastokes (TSt)", // Added
      "Gigastokes (GSt)", // Added
      "Megastokes (MSt)", // Added
      "Kilostokes (kSt)", // Added
      "Hectostokes (hSt)", // Added
      "Dekastokes (daSt)", // Added
      "Decistokes (dSt)", // Added
      "Centistokes (cSt)",
      "Millistokes (mSt)", // Added
      "Microstokes (µSt)", // Added
      "Nanostokes (nSt)", // Added
      "Picostokes (pSt)", // Added
      "Femtostokes (fSt)", // Added
      "Attostokes (aSt)", // Added
    ],
    factors: {
      "Square meter/second (m²/s)": 1,
      "Stokes (St)": 0.0001,
      "Centistokes (cSt)": 0.000001,
      "Square meter/hour (m²/h)": 1 / 3600,
      "Square centimeter/second (cm²/s)": 0.0001,
      "Square millimeter/second (mm²/s)": 1e-6,
      "Square foot/second (ft²/s)": 0.092903,
      "Square foot/hour (ft²/h)": 0.092903 / 3600,
      "Square inch/second (in²/s)": 0.00064516,
      "Exastokes (ESt)": 1e14, // 1 ESt = 10^18 St = 10^14 m^2/s
      "Petastokes (PSt)": 1e11,
      "Terastokes (TSt)": 1e8,
      "Gigastokes (GSt)": 1e5,
      "Megastokes (MSt)": 100,
      "Kilostokes (kSt)": 0.1,
      "Hectostokes (hSt)": 0.01,
      "Dekastokes (daSt)": 0.001,
      "Decistokes (dSt)": 1e-5,
      "Millistokes (mSt)": 1e-7,
      "Microstokes (µSt)": 1e-10,
      "Nanostokes (nSt)": 1e-13,
      "Picostokes (pSt)": 1e-16,
      "Femtostokes (fSt)": 1e-19,
      "Attostokes (aSt)": 1e-22,
    },
    type: "unit",
    keywords: [
      "viscosity",
      "kinematic",
      "fluid",
      "square meter per second",
      "square meter per hour",
      "square centimeter per second",
      "square millimeter per second",
      "square foot per second",
      "square foot per hour",
      "square inch per second",
      "stokes",
      "exastokes",
      "petastokes",
      "terastokes",
      "gigastokes",
      "megastokes",
      "kilostokes",
      "hectostokes",
      "dekastokes",
      "decistokes",
      "centistokes",
      "millistokes",
      "microstokes",
      "nanostokes",
      "picostokes",
      "femtostokes",
      "attostokes",
    ],
  },
  "Surface Tension": {
    type: "unit",
    units: [
      "Newton/meter (N/m)",
      "Millinewton/meter (mN/m)", // Added
      "Gram-force/centimeter (gf/cm)", // Added
      "Dyne/centimeter (dyn/cm)",
      "Erg/square centimeter (erg/cm²)", // Added (equivalent to dyn/cm)
      "Erg/square millimeter (erg/mm²)", // Added
      "Poundal/inch (pdl/in)", // Added
      "Pound-force/inch (lbf/in)", // Added
    ],
    factors: {
      "Newton/meter (N/m)": 1,
      "Dyne/centimeter (dyn/cm)": 0.001,
      "Millinewton/meter (mN/m)": 0.001,
      "Gram-force/centimeter (gf/cm)": 0.00980665, // 1 gf = 0.00980665 N, 1 cm = 0.01 m => 0.00980665 N / 0.01 m
      "Erg/square centimeter (erg/cm²)": 0.001, // 1 erg/cm² = 1 dyn/cm = 0.001 N/m
      "Erg/square millimeter (erg/mm²)": 0.01, // 1 erg/mm² = 10 dyn/cm = 0.01 N/m
      "Poundal/inch (pdl/in)": 0.054431, // 1 pdl = 0.138255 N, 1 inch = 0.0254 m
      "Pound-force/inch (lbf/in)": 175.1268, // 1 lbf = 4.44822 N, 1 inch = 0.0254 m
    },
    type: "unit",
    keywords: [
      "surface",
      "tension",
      "fluid",
      "newton per meter",
      "millinewton per meter",
      "gram-force per centimeter",
      "dyne per centimeter",
      "erg per square centimeter",
      "erg per square millimeter",
      "poundal per inch",
      "pound-force per inch",
    ],
  },
  "Intrinsic Permeability": {
    // Renamed for clarity
    type: "unit",
    units: [
      "Darcy",
      "Millidarcy",
      "Square meter (m²)",
      "Square centimeter (cm²)",
    ], // Added m^2 and cm^2 as intrinsic permeability units
    factors: {
      Darcy: 9.869233e-13, // 1 Darcy = 0.9869233 × 10^-12 m²
      Millidarcy: 9.869233e-16, // 1 mD = 0.001 Darcy
      "Square meter (m²)": 1,
      "Square centimeter (cm²)": 1e-4,
    },
    keywords: ["intrinsic permeability", "porosity", "fluid", "rock"],
  },
  // NEW: Permeability Coefficient converter
  "Permeability Coefficient": {
    type: "unit",
    units: [
      "Kilogram/Pascal/second/square meter (kg/(Pa·s·m²))", // Base unit for this type
      "Gram/Pascal/second/square centimeter (g/(Pa·s·cm²))", // Added
    ],
    factors: {
      "Kilogram/Pascal/second/square meter (kg/(Pa·s·m²))": 1,
      "Gram/Pascal/second/square centimeter (g/(Pa·s·cm²))": 0.1, // 1 g/(Pa·s·cm²) = 0.001 kg / (1 Pa·s * 1e-4 m^2) = 10 kg/(Pa·s·m^2)
    },
    keywords: [
      "permeability coefficient",
      "hydraulic conductivity",
      "fluid flow",
      "porous media",
      "permeability (0°C)",
      "permeability (23°C)",
      "permeability inches (0°C)",
      "permeability inches (23°C)",
    ],
  },

  // Light Converters (missing from converters object)
  Luminance: {
    type: "unit",
    units: [
      "Candela/square meter (cd/m²)",
      "Candela/square centimeter (cd/cm²)", // Added
      "Candela/square foot (cd/ft²)", // Added
      "Candela/square inch (cd/in²)", // Added
      "Kilocandela/square meter (kcd/m²)", // Added
      "Stilb (sb)", // Added
      "Lumen/sq. meter/steradian (lm/(m²·sr))", // Added (same as cd/m²)
      "Lumen/sq. cm/steradian (lm/(cm²·sr))", // Added (same as cd/cm²)
      "Lumen/square foot/steradian (lm/(ft²·sr))", // Added (same as cd/ft²)
      "Watt/sq. cm/steradian (at 555 nm)", // Added (specific to 555 nm wavelength)
      "Nit (nt)",
      "Millinit (mnt)", // Added
      "Lambert (L)", // Added
      "Millilambert (mL)", // Added
      "Foot-lambert (fL)",
      "Apostilb (asb)", // Added
      "Blondel", // Added (same as apostilb)
      "Bril", // Added (older unit)
      "Skot", // Added (older unit)
    ],
    factors: {
      "Candela/square meter (cd/m²)": 1,
      "Foot-lambert (fL)": 3.426259,
      "Nit (nt)": 1, // Same as cd/m²
      "Candela/square centimeter (cd/cm²)": 10000,
      "Candela/square foot (cd/ft²)": 10.7639, // 1 cd/ft² = 10.7639 cd/m²
      "Candela/square inch (cd/in²)": 1550.003, // 1 cd/in² = 1550.003 cd/m²
      "Kilocandela/square meter (kcd/m²)": 1000,
      "Stilb (sb)": 10000, // 1 sb = 1 cd/cm²
      "Lumen/sq. meter/steradian (lm/(m²·sr))": 1, // 1 lm/sr = 1 cd
      "Lumen/sq. cm/steradian (lm/(cm²·sr))": 10000, // 1 lm/sr = 1 cd
      "Lumen/square foot/steradian (lm/(ft²·sr))": 10.7639, // 1 lm/sr = 1 cd
      "Watt/sq. cm/steradian (at 555 nm)": 6830000, // 1 W at 555nm ~ 683 lm, so 1 W/(cm²·sr) = 6830000 cd/m²
      "Millinit (mnt)": 0.001,
      "Lambert (L)": 3183.099, // 1 L = 1/π cd/cm² = (1/π) * 10000 cd/m²
      "Millilambert (mL)": 3.183099, // 1 mL = 0.001 L
      "Apostilb (asb)": 0.3183099, // 1 asb = 1/π cd/m²
      Blondel: 0.3183099, // Same as apostilb
      Bril: 1e-7, // 1 bril = 10^-7 apostilb = 3.183099e-8 cd/m² (approx)
      Skot: 0.001, // 1 skot = 1 millilambert (approx)
    },
    type: "unit",
    keywords: [
      "luminance",
      "light",
      "brightness",
      "candela per square meter",
      "nit",
      "foot-lambert",
      "stilb",
      "lambert",
      "apostilb",
      "blondel",
      "bril",
      "skot",
      "lumen per square meter steradian",
      "watt per square centimeter steradian",
      "kilocandela per square meter",
    ],
  },
  "Luminous Intensity": {
    type: "unit",
    units: [
      "Candela (cd)",
      "Candlepower (cp)",
      "Candle (international) (c)", // Added
      "Candle (German) (c (German))", // Added
      "Candle (UK) (c (UK))", // Added
      "Decimal candle", // Added (same as Hefner candle or similar old standard)
      "Candle (pentane)", // Added (old standard)
      "Pentane candle (10 candle power)", // Added (old standard)
      "Hefner candle", // Added
      "Carcel unit", // Added (old standard)
      "Bougie decimal", // Added (old standard, French)
      "Lumen/steradian (lm/sr)", // Added (same as Candela)
    ],
    factors: {
      "Candela (cd)": 1,
      "Candlepower (cp)": 0.981, // Approximate, varies by definition
      "Candle (international) (c)": 1, // International Candle is essentially Candela
      "Candle (German) (c (German))": 0.903, // Approximate
      "Candle (UK) (c (UK))": 1.018, // Approximate
      "Decimal candle": 0.903, // Assuming Hefner candle
      "Candle (pentane)": 1, // Reference standard, ~1 candela
      "Pentane candle (10 candle power)": 10, // 10 * 1 candela
      "Hefner candle": 0.903, // Hefner unit = 0.903 cd
      "Carcel unit": 9.77, // Carcel = 9.77 cd (approx)
      "Bougie decimal": 1, // French unit, essentially candela
      "Lumen/steradian (lm/sr)": 1, // Definition of Candela
    },
    type: "unit",
    keywords: [
      "luminous",
      "intensity",
      "light",
      "candela",
      "candlepower",
      "candle",
      "hefner",
      "carcel",
      "bougie",
      "lumen per steradian",
    ],
  },
  Illuminance: {
    // Kept original name "Illuminance" as it's more common
    type: "unit",
    units: [
      "Lux (lx)",
      "Meter-candle (m·c)", // Added (same as Lux)
      "Centimeter-candle (cm·c)", // Added (same as phot)
      "Foot-candle (fc)",
      "Phot (ph)", // Added
      "Nox", // Added
      "Candela steradian/sq. meter (cd·sr/m²)", // Added (same as Lux)
      "Lumen/square meter (lm/m²)", // Added (same as Lux)
      "Lumen/square centimeter (lm/cm²)", // Added (same as phot)
      "Lumen/square foot (lm/ft²)", // Added (same as foot-candle)
      "Watt/sq. cm (at 555 nm)", // Added (specific to 555 nm wavelength)
    ],
    factors: {
      "Lux (lx)": 1,
      "Foot-candle (fc)": 10.764,
      "Meter-candle (m·c)": 1, // Same as Lux
      "Centimeter-candle (cm·c)": 10000, // 1 cm·c = 1 Phot = 10000 Lux
      "Phot (ph)": 10000, // 1 ph = 1 lumen/cm²
      Nox: 0.001, // 1 nox = 0.001 lux
      "Candela steradian/sq. meter (cd·sr/m²)": 1, // 1 cd·sr = 1 lm
      "Lumen/square meter (lm/m²)": 1, // Same as Lux
      "Lumen/square centimeter (lm/cm²)": 10000, // Same as Phot
      "Lumen/square foot (lm/ft²)": 10.764, // Same as Foot-candle
      "Watt/sq. cm (at 555 nm)": 6830000, // 1 W at 555nm ~ 683 lm, so 1 W/cm² = 6830000 lm/m²
    },
    type: "unit",
    keywords: [
      "illumination",
      "light",
      "lux",
      "foot-candle",
      "phot",
      "nox",
      "meter-candle",
      "centimeter-candle",
      "candela steradian per square meter",
      "lumen per square meter",
      "lumen per square centimeter",
      "lumen per square foot",
      "watt per square centimeter",
    ],
  },

  // Electricity Converters (missing from converters object)
  Charge: {
    type: "unit",
    units: ["Coulomb (C)", "Ampere-hour (Ah)", "Milliampere-hour (mAh)"],
    factors: {
      "Coulomb (C)": 1,
      "Ampere-hour (Ah)": 3600,
      "Milliampere-hour (mAh)": 3.6,
    },
    keywords: ["charge", "electric", "coulomb", "battery"],
  },
  "Linear Charge Density": {
    type: "unit",
    units: [
      "Coulomb/meter (C/m)",
      "Coulomb/centimeter (C/cm)",
      "Coulomb/inch (C/in)", // Added
      "Abcoulomb/meter (abC/m)", // Added
      "Abcoulomb/centimeter (abC/cm)", // Added
      "Abcoulomb/inch (abC/in)", // Added
    ],
    factors: {
      "Coulomb/meter (C/m)": 1,
      "Coulomb/centimeter (C/cm)": 100,
      "Coulomb/inch (C/in)": 39.37007874, // 1 inch = 0.0254 meters, so 1/0.0254
      "Abcoulomb/meter (abC/m)": 10, // 1 Abcoulomb = 10 Coulombs
      "Abcoulomb/centimeter (abC/cm)": 10 * 100, // 10 C/cm = 1000 C/m
      "Abcoulomb/inch (abC/in)": 10 * 39.37007874, // 10 C/inch = 393.7007874 C/m
    },
    keywords: [
      "linear",
      "charge",
      "density",
      "coulomb per meter",
      "coulomb per centimeter",
      "coulomb per inch",
      "abcoulomb per meter",
      "abcoulomb per centimeter",
      "abcoulomb per inch",
    ],
  },
  "Surface Charge Density": {
    type: "unit",
    units: [
      "Coulomb/square meter (C/m²)",
      "Coulomb/square centimeter (C/cm²)",
      "Coulomb/square inch (C/in²)", // Added
      "Abcoulomb/square meter (abC/m²)", // Added
      "Abcoulomb/square centimeter (abC/cm²)", // Added
      "Abcoulomb/square inch (abC/in²)", // Added
    ],
    factors: {
      "Coulomb/square meter (C/m²)": 1,
      "Coulomb/square centimeter (C/cm²)": 10000, // 1 m = 100 cm, 1 m² = 10000 cm²
      "Coulomb/square inch (C/in²)": 1 / (0.0254 * 0.0254), // 1 inch = 0.0254 m
      "Abcoulomb/square meter (abC/m²)": 10, // 1 Abcoulomb = 10 Coulombs
      "Abcoulomb/square centimeter (abC/cm²)": 10 * 10000,
      "Abcoulomb/square inch (abC/in²)": 10 * (1 / (0.0254 * 0.0254)),
    },
    keywords: [
      "surface",
      "charge",
      "density",
      "coulomb per square meter",
      "coulomb per square centimeter",
      "coulomb per square inch",
      "abcoulomb per square meter",
      "abcoulomb per square centimeter",
      "abcoulomb per square inch",
    ],
  },
  "Volume Charge Density": {
    type: "unit",
    units: [
      "Coulomb/cubic meter (C/m³)",
      "Coulomb/cubic centimeter (C/cm³)",
      "Coulomb/cubic inch (C/in³)", // Added
      "Abcoulomb/cubic meter (abC/m³)", // Added
      "Abcoulomb/cubic centimeter (abC/cm³)", // Added
      "Abcoulomb/cubic inch (abC/in³)", // Added
    ],
    factors: {
      "Coulomb/cubic meter (C/m³)": 1,
      "Coulomb/cubic centimeter (C/cm³)": 1e6, // 1 m = 100 cm, so 1 m³ = 10^6 cm³
      "Coulomb/cubic inch (C/in³)": 1 / 0.0254 ** 3, // 1 inch = 0.0254 m
      "Abcoulomb/cubic meter (abC/m³)": 10, // 1 Abcoulomb = 10 Coulombs
      "Abcoulomb/cubic centimeter (abC/cm³)": 10 * 1e6,
      "Abcoulomb/cubic inch (abC/in³)": 10 * (1 / 0.0254 ** 3),
    },
    keywords: [
      "volume",
      "charge",
      "density",
      "coulomb per cubic meter",
      "coulomb per cubic centimeter",
      "coulomb per cubic inch",
      "abcoulomb per cubic meter",
      "abcoulomb per cubic centimeter",
      "abcoulomb per cubic inch",
    ],
  },
  Current: {
    type: "unit",
    units: ["Ampere (A)", "Milliampere (mA)", "Kiloampere (kA)"],
    factors: {
      "Ampere (A)": 1,
      "Milliampere (mA)": 0.001,
      "Kiloampere (kA)": 1000,
    },
    keywords: ["current", "electric", "ampere"],
  },
  "Linear Current Density": {
    type: "unit",
    units: [
      "Ampere/meter (A/m)",
      "Ampere/centimeter (A/cm)", // Added
      "Ampere/inch (A/in)", // Added
      "Abampere/meter (abA/m)", // Added
      "Abampere/centimeter (abA/cm)", // Added
      "Abampere/inch (abA/in)", // Added
      "Oersted (Oe)", // Added
      "Gilbert/centimeter (Gi/cm)", // Added
    ],
    factors: {
      "Ampere/meter (A/m)": 1,
      "Ampere/centimeter (A/cm)": 100, // 1 A/cm = 100 A/m
      "Ampere/inch (A/in)": 39.37007874, // 1 A/inch = 1 / 0.0254 A/m
      "Abampere/meter (abA/m)": 10, // 1 Abampere = 10 Amperes
      "Abampere/centimeter (abA/cm)": 10 * 100, // 10 AbA/cm = 1000 A/m
      "Abampere/inch (abA/in)": 10 * 39.37007874, // 10 AbA/inch = 393.7007874 A/m
      "Oersted (Oe)": 79.5774715, // 1 Oersted = 1000/(4π) A/m
      "Gilbert/centimeter (Gi/cm)": 79.5774715, // 1 Gilbert/centimeter = 1 Oersted
    },
    keywords: [
      "linear",
      "current",
      "density",
      "ampere per meter",
      "ampere per centimeter",
      "ampere per inch",
      "abampere per meter",
      "abampere per centimeter",
      "abampere per inch",
      "oersted",
      "gilbert per centimeter",
    ],
  },
  "Surface Current Density": {
    type: "unit",
    units: [
      "Ampere/square meter (A/m²)",
      "Ampere/square centimeter (A/cm²)",
      "Ampere/square inch (A/in²)", // Added
      "Ampere/square mil (A/mil²)", // Added
      "Ampere/circular mil (A/circ mil)", // Added
      "Abampere/square centimeter (abA/cm²)", // Added
    ],
    factors: {
      "Ampere/square meter (A/m²)": 1,
      "Ampere/square centimeter (A/cm²)": 10000, // 1 A/cm² = 1 A / (0.01 m)² = 10000 A/m²
      "Ampere/square inch (A/in²)": 1 / (0.0254 * 0.0254), // 1 A/in² = 1 A / (0.0254 m)²
      "Ampere/square mil (A/mil²)": 1 / (2.54e-5 * 2.54e-5), // 1 mil = 2.54e-5 m
      "Ampere/circular mil (A/circ mil)":
        (4 / Math.PI) * (1 / (2.54e-5 * 2.54e-5)), // 1 circular mil = (pi/4) square mil
      "Abampere/square centimeter (abA/cm²)": 10 * 10000, // 1 Abampere = 10 Amperes
    },
    keywords: [
      "surface",
      "current",
      "density",
      "ampere per square meter",
      "ampere per square centimeter",
      "ampere per square inch",
      "ampere per square mil",
      "ampere per circular mil",
      "abampere per square centimeter",
    ],
  },
  "Electric Field Strength": {
    type: "unit",
    units: [
      "Volt/meter (V/m)",
      "Kilovolt/meter (kV/m)", // Added
      "Kilovolt/centimeter (kV/cm)", // Added
      "Volt/centimeter (V/cm)", // Added
      "Millivolt/meter (mV/m)", // Added
      "Microvolt/meter (µV/m)", // Added (assuming µ/m was a typo for µV/m)
      "Kilovolt/inch (kV/in)", // Added
      "Volt/inch (V/in)", // Added
      "Volt/mil (V/mil)", // Added
      "Abvolt/centimeter (abV/cm)", // Added
      "Statvolt/centimeter (stV/cm)", // Added
      "Statvolt/inch (stV/in)", // Added
      "Newton/coulomb (N/C)", // Added (same as V/m)
    ],
    factors: {
      "Volt/meter (V/m)": 1,
      "Kilovolt/meter (kV/m)": 1000,
      "Kilovolt/centimeter (kV/cm)": 1000 / 0.01,
      "Volt/centimeter (V/cm)": 1 / 0.01,
      "Millivolt/meter (mV/m)": 0.001,
      "Microvolt/meter (µV/m)": 1e-6,
      "Kilovolt/inch (kV/in)": 1000 / 0.0254,
      "Volt/inch (V/in)": 1 / 0.0254,
      "Volt/mil (V/mil)": 1 / 2.54e-5,
      "Abvolt/centimeter (abV/cm)": 1e-8 / 0.01, // 1 Abvolt = 10^-8 Volt
      "Statvolt/centimeter (stV/cm)": 299.792458 / 0.01, // 1 Statvolt ≈ 299.792458 Volt
      "Statvolt/inch (stV/in)": 299.792458 / 0.0254,
      "Newton/coulomb (N/C)": 1,
    },
    keywords: [
      "electric",
      "field",
      "strength",
      "volt per meter",
      "kilovolt per meter",
      "kilovolt per centimeter",
      "volt per centimeter",
      "millivolt per meter",
      "microvolt per meter",
      "kilovolt per inch",
      "volt per inch",
      "volt per mil",
      "abvolt per centimeter",
      "statvolt per centimeter",
      "statvolt per inch",
      "newton per coulomb",
    ],
  },
  "Electric Potential": {
    type: "unit",
    units: [
      "Volt (V)",
      "Millivolt (mV)",
      "Kilovolt (kV)",
      "Watt/ampere (W/A)", // Added (same as Volt)
      "Abvolt (abV)", // Added
      "EMU of electric potential", // Added (same as abvolt)
      "Statvolt (stV)", // Added
      "ESU of electric potential", // Added (same as statvolt)
    ],
    factors: {
      "Volt (V)": 1,
      "Millivolt (mV)": 0.001,
      "Kilovolt (kV)": 1000,
      "Watt/ampere (W/A)": 1,
      "Abvolt (abV)": 1e-8, // 1 Abvolt = 10^-8 Volts
      "EMU of electric potential": 1e-8, // 1 EMU of electric potential = 10^-8 Volts
      "Statvolt (stV)": 299.792458, // 1 Statvolt ≈ 299.792458 Volts
      "ESU of electric potential": 299.792458, // 1 ESU of electric potential ≈ 299.792458 Volts
    },
    keywords: [
      "electric",
      "potential",
      "voltage",
      "volt",
      "watt per ampere",
      "abvolt",
      "emu of electric potential",
      "statvolt",
      "esu of electric potential",
    ],
  },
  "Electric Resistivity": {
    type: "unit",
    units: [
      "Ohm meter (Ω·m)",
      "Ohm centimeter (Ω·cm)", // Added
      "Ohm inch (Ω·in)", // Added
      "Microhm centimeter (µΩ·cm)", // Added
      "Microhm inch (µΩ·in)", // Added
      "Abohm centimeter (abΩ·cm)", // Added
      "Statohm centimeter (stΩ·cm)", // Added
      "Circular mil ohm/foot (CM·Ω/ft)", // Added
    ],
    factors: {
      "Ohm meter (Ω·m)": 1,
      "Ohm centimeter (Ω·cm)": 0.01,
      "Ohm inch (Ω·in)": 0.0254, // 1 inch = 0.0254 meters
      "Microhm centimeter (µΩ·cm)": 1e-8, // 1 µΩ·cm = 1e-6 Ω·cm = 1e-6 * 0.01 Ω·m
      "Microhm inch (µΩ·in)": 1e-6 * 0.0254, // 1 µΩ·in = 1e-6 Ω·in = 1e-6 * 0.0254 Ω·m
      "Abohm centimeter (abΩ·cm)": 1e-11, // 1 abohm = 1e-9 ohm, so 1e-9 * 0.01
      "Statohm centimeter (stΩ·cm)": 8.987551787e9, // 1 statohm ≈ 8.98755e11 Ω, so 8.98755e11 * 0.01
      "Circular mil ohm/foot (CM·Ω/ft)": 1.662426e-9, // Approx. conversion: 1 CM·Ω/ft ≈ 1.662426e-9 Ω·m
    },
    keywords: [
      "electric",
      "resistivity",
      "resistance",
      "ohm meter",
      "ohm centimeter",
      "ohm inch",
      "microhm centimeter",
      "microhm inch",
      "abohm centimeter",
      "statohm centimeter",
      "circular mil ohm per foot",
    ],
  },
  "Electric Conductance": {
    type: "unit",
    units: [
      "Siemens (S)",
      "Megasiemens (MS)", // Added
      "Kilosiemens (kS)", // Added
      "Millisiemens (mS)", // Added
      "Microsiemens (µS)", // Added
      "Ampere/volt (A/V)", // Added (same as Siemens)
      "Mho (℧)", // Added (alias for Siemens)
      "Gemmho", // Added (same as micromho)
      "Micromho (µ℧)", // Added
      "Abmho (ab℧)", // Added
      "Statmho (st℧)", // Added
      "Quantized Hall conductance", // Added
    ],
    factors: {
      "Siemens (S)": 1,
      "Megasiemens (MS)": 1e6,
      "Kilosiemens (kS)": 1e3,
      "Millisiemens (mS)": 1e-3,
      "Microsiemens (µS)": 1e-6,
      "Ampere/volt (A/V)": 1,
      "Mho (℧)": 1,
      Gemmho: 1e-6,
      "Micromho (µ℧)": 1e-6,
      "Abmho (ab℧)": 1e9, // 1 abmho = 1 / 1 abohm = 1 / 1e-9 Ohm = 1e9 S
      "Statmho (st℧)": 1 / 8.987551787e11, // 1 statmho = 1 / 1 statohm
      "Quantized Hall conductance": 1 / 25812.807, // 1 / Quantized Hall resistance
    },
    keywords: [
      "electric",
      "conductance",
      "siemens",
      "megasiemens",
      "kilosiemens",
      "millisiemens",
      "microsiemens",
      "ampere per volt",
      "mho",
      "gemmho",
      "micromho",
      "abmho",
      "statmho",
      "quantized hall conductance",
    ],
  },
  "Electric Conductivity": {
    type: "unit",
    units: [
      "Siemens/meter (S/m)",
      "Picosiemens/meter (pS/m)", // Added
      "Mho/meter (mho/m)", // Added (same as S/m)
      "Mho/centimeter (mho/cm)", // Added
      "Abmho/meter (abmho/m)", // Added
      "Abmho/centimeter (abmho/cm)", // Added
      "Statmho/meter (stmho/m)", // Added
      "Statmho/centimeter (stmho/cm)", // Added
    ],
    factors: {
      "Siemens/meter (S/m)": 1,
      "Picosiemens/meter (pS/m)": 1e-12,
      "Mho/meter (mho/m)": 1,
      "Mho/centimeter (mho/cm)": 100, // 1 m = 100 cm
      "Abmho/meter (abmho/m)": 1e9, // 1 abmho = 1e9 S
      "Abmho/centimeter (abmho/cm)": 1e9 * 100, // 1 abmho/cm = 1e11 S/m
      "Statmho/meter (stmho/m)": 1 / 8.987551787e11, // 1 statmho = 1 / 1 statohm ≈ 1 / 8.98755e11 S
      "Statmho/centimeter (stmho/cm)": (1 / 8.987551787e11) * 100, // 1 statmho/cm ≈ (1 / 8.98755e11) * 100 S/m
    },
    keywords: [
      "electric",
      "conductivity",
      "siemens",
      "siemens per meter",
      "picosiemens per meter",
      "mho per meter",
      "mho per centimeter",
      "abmho per meter",
      "abmho per centimeter",
      "statmho per meter",
      "statmho per centimeter",
    ],
  },
  "Electrostatic Capacitance": {
    type: "unit",
    units: ["Farad (F)", "Microfarad (μF)", "Picofarad (pF)"],
    factors: {
      "Farad (F)": 1,
      "Microfarad (μF)": 0.000001,
      "Picofarad (pF)": 0.000000000001,
    },
    keywords: ["capacitance", "farad", "electric"],
  },

  // Magnetism Converters (missing from converters object)
  "Magnetomotive Force": {
    type: "unit",
    units: ["Ampere-turn (At)", "Gilbert (Gb)"],
    factors: {
      "Ampere-turn (At)": 1,
      "Gilbert (Gb)": 0.795775,
    },
    keywords: ["magnetomotive", "force", "magnetic"],
  },
  "Magnetic Flux": {
    type: "unit",
    units: [
      "Weber (Wb)",
      "Milliweber (mWb)", // Added
      "Microweber (µWb)", // Added
      "Volt second (V·s)", // Added (same as Weber)
      "Megaline", // Added
      "Kiloline", // Added
      "Line", // Added (same as Maxwell)
      "Maxwell (Mx)",
      "Tesla square meter (T·m²)", // Added (same as Weber)
      "Tesla square centimeter (T·cm²)", // Added
      "Gauss square centimeter (G·cm²)", // Added (same as Maxwell)
      "Magnetic flux quantum (Φ₀)", // Added
    ],
    factors: {
      "Weber (Wb)": 1,
      "Milliweber (mWb)": 1e-3,
      "Microweber (µWb)": 1e-6,
      "Volt second (V·s)": 1,
      Megaline: 1e-2, // 1 Megaline = 10^6 Maxwell = 10^6 * 1e-8 Wb = 1e-2 Wb
      Kiloline: 1e-5, // 1 Kiloline = 10^3 Maxwell = 10^3 * 1e-8 Wb = 1e-5 Wb
      Line: 1e-8, // 1 Line = 1 Maxwell = 1e-8 Wb
      "Maxwell (Mx)": 1e-8,
      "Tesla square meter (T·m²)": 1,
      "Tesla square centimeter (T·cm²)": 1e-4, // 1 T·cm² = 1 T * (0.01 m)² = 1e-4 Wb
      "Gauss square centimeter (G·cm²)": 1e-8, // 1 G = 1e-4 T, so 1 G·cm² = 1e-4 T * (0.01 m)² = 1e-8 Wb
      "Magnetic flux quantum (Φ₀)": 2.067833848e-15, // Approximately h/(2e) in Webers
    },
    keywords: [
      "magnetic",
      "flux",
      "weber",
      "milliweber",
      "microweber",
      "volt second",
      "megaline",
      "kiloline",
      "line",
      "maxwell",
      "tesla square meter",
      "tesla square centimeter",
      "gauss square centimeter",
      "magnetic flux quantum",
    ],
  },
  "Magnetic Flux Density": {
    type: "unit",
    units: [
      "Tesla (T)",
      "Weber/square meter (Wb/m²)", // Added (same as Tesla)
      "Weber/square centimeter (Wb/cm²)", // Added
      "Weber/square inch (Wb/in²)", // Added
      "Maxwell/square meter (Mx/m²)", // Added
      "Maxwell/square centimeter (Mx/cm²)", // Added
      "Maxwell/square inch (Mx/in²)", // Added
      "Gauss (G)",
      "Line/square centimeter (line/cm²)", // Added (same as Maxwell/cm²)
      "Line/square inch (line/in²)", // Added (same as Maxwell/in²)
      "Gamma (γ)", // Added
    ],
    factors: {
      "Tesla (T)": 1,
      "Weber/square meter (Wb/m²)": 1,
      "Weber/square centimeter (Wb/cm²)": 10000, // 1 Wb/cm² = 1 Wb / (0.01 m)² = 10000 Wb/m²
      "Weber/square inch (Wb/in²)": 1 / (0.0254 * 0.0254), // 1 Wb/in² = 1 Wb / (0.0254 m)²
      "Maxwell/square meter (Mx/m²)": 1e-8, // 1 Maxwell = 1e-8 Weber
      "Maxwell/square centimeter (Mx/cm²)": 1e-8 * 10000, // 1 Mx/cm² = 1e-8 Wb / (0.01 m)² = 1e-4 Wb/m²
      "Maxwell/square inch (Mx/in²)": 1e-8 / (0.0254 * 0.0254), // 1 Mx/in² = 1e-8 Wb / (0.0254 m)²
      "Gauss (G)": 1e-4, // 1 Gauss = 10^-4 Tesla
      "Line/square centimeter (line/cm²)": 1e-8 * 10000, // Same as Maxwell/cm²
      "Line/square inch (line/in²)": 1e-8 / (0.0254 * 0.0254), // Same as Maxwell/in²
      "Gamma (γ)": 1e-9, // 1 Gamma = 1 Nanotesla = 10^-9 Tesla
    },
    keywords: [
      "magnetic",
      "flux",
      "density",
      "tesla",
      "weber per square meter",
      "weber per square centimeter",
      "weber per square inch",
      "maxwell per square meter",
      "maxwell per square centimeter",
      "maxwell per square inch",
      "gauss",
      "line per square centimeter",
      "line per square inch",
      "gamma",
    ],
  },

  // Radiology Converters (missing from converters object)
  Radiation: {
    type: "unit",
    units: ["Gray (Gy)", "Rad (rd)"],
    factors: {
      "Gray (Gy)": 1,
      "Rad (rd)": 0.01,
    },
    keywords: ["radiation", "gray", "rad"],
  },
  "Radiation - Activity": {
    type: "unit",
    units: [
      "Becquerel (Bq)",
      "Terabecquerel (TBq)", // Added
      "Gigabecquerel (GBq)", // Added
      "Megabecquerel (MBq)", // Added
      "Kilobecquerel (kBq)", // Added
      "Millibecquerel (mBq)", // Added
      "Curie (Ci)",
      "Kilocurie (kCi)", // Added
      "Millicurie (mCi)", // Added
      "Microcurie (µCi)", // Added
      "Nanocurie (nCi)", // Added
      "Picocurie (pCi)", // Added
      "Rutherford (Rd)", // Added
      "One/second (1/s)", // Added (same as Bq)
      "Disintegrations/second (dis/s)", // Added (same as Bq)
      "Disintegrations/minute (dis/min)", // Added
    ],
    factors: {
      "Becquerel (Bq)": 1,
      "Terabecquerel (TBq)": 1e12,
      "Gigabecquerel (GBq)": 1e9,
      "Megabecquerel (MBq)": 1e6,
      "Kilobecquerel (kBq)": 1e3,
      "Millibecquerel (mBq)": 1e-3,
      "Curie (Ci)": 3.7e10, // 1 Curie = 3.7 x 10^10 Bq
      "Kilocurie (kCi)": 3.7e13, // 1 kCi = 3.7 x 10^13 Bq
      "Millicurie (mCi)": 3.7e7, // 1 mCi = 3.7 x 10^7 Bq
      "Microcurie (µCi)": 3.7e4, // 1 µCi = 3.7 x 10^4 Bq
      "Nanocurie (nCi)": 3.7e1, // 1 nCi = 3.7 x 10^1 Bq
      "Picocurie (pCi)": 3.7e-2, // 1 pCi = 3.7 x 10^-2 Bq
      "Rutherford (Rd)": 1e6, // 1 Rutherford = 10^6 Bq
      "One/second (1/s)": 1,
      "Disintegrations/second (dis/s)": 1,
      "Disintegrations/minute (dis/min)": 1 / 60,
    },
    keywords: [
      "radiation",
      "activity",
      "becquerel",
      "terabecquerel",
      "gigabecquerel",
      "megabecquerel",
      "kilobecquerel",
      "millibecquerel",
      "curie",
      "kilocurie",
      "millicurie",
      "microcurie",
      "nanocurie",
      "picocurie",
      "rutherford",
      "one per second",
      "disintegrations per second",
      "disintegrations per minute",
    ],
  },
  "Radiation - Exposure": {
    type: "unit",
    units: [
      "Coulomb/kilogram (C/kg)",
      "Millicoulomb/kilogram (mC/kg)", // Added
      "Microcoulomb/kilogram (µC/kg)", // Added
      "Roentgen (R)",
      "Tissue roentgen", // Added (assuming same as Roentgen for air for simplicity in general converter)
      "Parker", // Added (assuming same as Roentgen for simplicity)
      "Rep (roentgen equivalent physical)", // Added (assuming 1 rep ≈ 0.0093 C/kg)
    ],
    factors: {
      "Coulomb/kilogram (C/kg)": 1,
      "Millicoulomb/kilogram (mC/kg)": 1e-3,
      "Microcoulomb/kilogram (µC/kg)": 1e-6,
      "Roentgen (R)": 0.000258, // 1 R = 2.58 × 10^-4 C/kg
      "Tissue roentgen": 0.000258, // Assuming 1 Tissue Roentgen ≈ 1 Roentgen for air exposure
      Parker: 0.000258, // Assuming 1 Parker = 1 Roentgen
      "Rep (roentgen equivalent physical)": 0.0093, // 1 rep ≈ 93 erg/g ≈ 0.0093 J/kg
    },
    keywords: [
      "radiation",
      "exposure",
      "coulomb per kilogram",
      "millicoulomb per kilogram",
      "microcoulomb per kilogram",
      "roentgen",
      "tissue roentgen",
      "parker",
      "rep",
    ],
  },
  "Absorbed & Equivalent Dose": {
    // Renamed from "Radiation Units"
    units: [
      "Gray (Gy)",
      "Exagray (EGy)", // Added
      "Petagray (PGy)", // Added
      "Teragray (TGy)", // Added
      "Gigagray (GGy)", // Added
      "Megagray (MGy)", // Added
      "Kilogray (kGy)", // Added
      "Hectogray (hGy)", // Added
      "Dekagray (daGy)", // Added
      "Decigray (dGy)", // Added
      "Centigray (cGy)", // Added
      "Milligray (mGy)", // Added
      "Microgray (µGy)", // Added
      "Nanogray (nGy)", // Added
      "Picogray (pGy)", // Added
      "Femtogray (fGy)", // Added
      "Attogray (aGy)", // Added
      "Rad (rd)",
      "Millirad (mrd)", // Added
      "Joule/kilogram (J/kg)", // Added (same as Gy)
      "Joule/gram (J/g)", // Added
      "Joule/centigram (J/cg)", // Added
      "Joule/milligram (J/mg)", // Added
      "Sievert (Sv)",
    ],
    factors: {
      "Gray (Gy)": 1,
      "Exagray (EGy)": 1e18,
      "Petagray (PGy)": 1e15,
      "Teragray (TGy)": 1e12,
      "Gigagray (GGy)": 1e9,
      "Megagray (MGy)": 1e6,
      "Kilogray (kGy)": 1e3,
      "Hectogray (hGy)": 1e2,
      "Dekagray (daGy)": 1e1,
      "Decigray (dGy)": 1e-1,
      "Centigray (cGy)": 1e-2,
      "Milligray (mGy)": 1e-3,
      "Microgray (µGy)": 1e-6,
      "Nanogray (nGy)": 1e-9,
      "Picogray (pGy)": 1e-12,
      "Femtogray (fGy)": 1e-15,
      "Attogray (aGy)": 1e-18,
      "Rad (rd)": 0.01, // 1 Gy = 100 rad
      "Millirad (mrd)": 0.00001, // 1 mrd = 0.001 rad = 0.00001 Gy
      "Joule/kilogram (J/kg)": 1,
      "Joule/gram (J/g)": 1000,
      "Joule/centigram (J/cg)": 100000,
      "Joule/milligram (J/mg)": 1000000,
      "Sievert (Sv)": 1, // Assumes a radiation weighting factor (W_R) of 1 for general conversion
    },
    type: "unit",
    keywords: [
      "gray",
      "sievert",
      "absorbed dose",
      "equivalent dose",
      "radiation",
      "rad",
      "millirad",
      "joule per kilogram",
      "joule per gram",
      "joule per centigram",
      "joule per milligram",
      "exagray",
      "petagray",
      "teragray",
      "gigagray",
      "megagray",
      "kilogray",
      "hectogray",
      "dekagray",
      "decigray",
      "centigray",
      "milligray",
      "microgray",
      "nanogray",
      "picogray",
      "femtogray",
      "attogray",
    ],
  },
};
// Group categories (no change needed here, just for context)
const categoryGroups = {
  "Core Daily Converters": [
    "Length / Distance",
    "Weight / Mass",
    "Temperature",
    "Area",
    "Volume",
    "Speed",
    "Time",
    "Pressure",
    "Energy / Heat",
    "Power",
    "Force",
    "Angle",
    "Density",
    "Torque",
    "Acceleration",
    "Number Base Converter",
    "Volume - Dry",
    "Text Case Converter",
    "Roman Numeral Converter",
    "Scientific Calculator",
  ],

  "Digital & Computer Converters": [
    "Data Storage",
    "Data Transfer Rate",
    "Frequency",
    "Bit/Byte Converter",
    "File Size Calculator",
    "Digital Image Resolution",
    "Digital Resolution",
  ],

  "Financial & Business Converters": [
    "Currency Converter",
    "Loan / EMI Calculator",
    "Interest Rate Calculator",
    "Discount Calculator",
    "Sales Tax / VAT Calculator",
    "Investment Return Calculator (ROI)",
  ],

  "Engineering & Science Converters": [
    // "Concentration",
    // "Molar Mass Calculator",
    // "Pressure Drop (engineering)",
    "Velocity - Angular",
    "Acceleration - Angular",
    "Specific Volume",
    "Moment of Inertia",
    "Moment of Force",
  ],

  "Heat & Thermal Converters": [
    "Fuel Efficiency - Mass",
    "Fuel Efficiency - Volume",
    "Interval",
    "Thermal Expansion",
    "Thermal Resistance",
    "Thermal Conductivity",
    "Specific Heat Capacity",
    "Volumetric Heat Density",
    "Heat Flux",
    "Heat Flux Density",
    "Heat Transfer Coefficient",
  ],

  "Fluids Converters": [
    "Flow",
    "Flow - Mass",
    "Flow - Molar",
    "Mass Flux Density",
    "Concentration - Molar",
    "Concentration - Solution",
    "Viscosity - Dynamic",
    "Viscosity - Kinematic",
    "Surface Tension",
    "Intrinsic Permeability", // Renamed
    "Permeability Coefficient", // Added new converter
  ],

  "Light Converters": [
    "Luminance",
    "Luminous Intensity",
    "Illuminance",
    "Frequency / Wavelength",
  ],

  "Electricity Converters": [
    "Electric Voltage",
    "Electric Current",
    "Electric Power",
    "Capacitance",
    "Inductance",
    "Electric Charge",
    "Linear Charge Density",
    "Surface Charge Density",
    "Volume Charge Density",
    "Linear Current Density",
    "Surface Current Density",
    "Electric Field Strength",
    "Electric Potential",
    "Electric Resistance",
    "Electric Resistivity",
    "Electric Conductance",
    "Electric Conductivity",
  ],

  "Magnetism Converters": [
    "Magnetomotive Force",
    "Magnetic Field Strength",
    "Magnetic Flux",
    "Magnetic Flux Density",
  ],

  "Radiology Converters": [
    "Absorbed & Equivalent Dose", // Renamed
    "Radiation Dose Rate", // Added
    "Radiation - Activity",
    "Radiation - Exposure",
    "Radiation - Absorbed Dose",
  ],

  "Construction & Material Converters": [
    "Concrete Volume Calculator",
    "Lumber / Wood Board Feet",
    "Steel Weight Calculator",
    "Tile & Flooring Calculator",
    "Paint Coverage Calculator",
  ],

  "Health, Fitness & Nutrition": [
    "BMI Calculator",
    "Body Fat Calculator",
    "Calorie Burn Calculator",
    "Pace / Running Speed",
    "Water Intake Calculator",
  ],

  "Cooking & Food Converters": [
    "Cooking Volume",
    "Cooking Weight",
    "Oven Temperature",
    // "Ingredient-Specific Converter",
  ],

  "Transport & Automotive Converters": [
    "Mileage / Distance Calculator",
    "Tire Size Converter",
    "Engine Power",
    "Fuel Efficiency",
    "Fuel Consumption Cost Calculator",
  ],

  "Date, Time & Planning Tools": [
    "Age Calculator",
    "Date Difference Calculator",
    "Time Zone Converter",
    "Work Hour Calculator",
    "Countdown Calculator",
  ],

  "Miscellaneous Converters": [
    "Shoe Size Converter",
    "Clothing Size Converter",
  ],
};

// Map to quickly find a category's group
const categoryToGroupMap = {};
for (const group in categoryGroups) {
  categoryGroups[group].forEach((category) => {
    categoryToGroupMap[category] = group;
  });
}
// ===== SMART FORMATTING =====
const formatNumber = (num) => {
  if (
    num === null ||
    num === undefined ||
    (typeof num === "string" && num.trim() === "")
  )
    return "";
  if (typeof num === "string" && num.includes("\n")) return num; // Return multi-line strings directly for UI to split
  if (typeof num === "string") return num; // Return other strings directly
  if (isNaN(num)) return "Invalid Input";

  const absNum = Math.abs(num);

  if (absNum < 0.000001 && absNum !== 0) return num.toExponential(4);
  if (absNum >= 1e9) return num.toExponential(4);
  if (absNum < 0.01 && absNum !== 0)
    return num.toFixed(8).replace(/\.?0+$/, "");
  if (absNum < 1) return num.toFixed(6).replace(/\.?0+$/, "");
  if (Math.abs(num - Math.round(num)) < 0.0001)
    return Math.round(num).toLocaleString();

  return num.toFixed(4).replace(/\.?0+$/, "");
};

// ===== CONVERSION ENGINE =====
// Modified to accept exchangeRates for Currency Converter
const convertValue = (value, from, to, categoryName, exchangeRates) => {
  const converter = converters[categoryName];
  if (!converter || converter.type !== "unit") return NaN;

  if (converter.convert) {
    // Pass exchangeRates specifically to the Currency Converter's convert function
    if (categoryName === "Currency Converter" && converter.api) {
      const result = converter.convert(value, from, to, exchangeRates); // Pass exchangeRates
      if (typeof result === "string") return result; // Loading/error message
      return isNaN(result) ? "Invalid conversion" : result;
    } else {
      const result = converter.convert(value, from, to);
      if (typeof result === "string") return result;
      return isNaN(result) ? "Invalid conversion" : result;
    }
  }

  const factors = converter.factors;
  if (!factors || !factors[from] || !factors[to])
    return "Invalid units for conversion";

  const baseValue = value * factors[from];
  return baseValue / factors[to];
};

// ===== CALCULATOR ENGINE =====
const calculate = (categoryName, values) => {
  const currentConverter = converters[categoryName];
  if (!currentConverter || currentConverter.type !== "calculator") {
    return "";
  }

  if (currentConverter.calculate) {
    // For Time Zone Converter, the calculate function is async.
    // We'll handle its call in useEffect and update state.
    // For other custom calculators, call directly.
    if (categoryName !== "Time Zone Converter") {
      return currentConverter.calculate(values);
    }
  }

  switch (categoryName) {
    case "File Size Calculator": {
      const duration = parseFloat(values.Duration);
      const bitrate = parseFloat(values.Bitrate);
      const size = parseFloat(values.Size);

      const isDurationValid = !isNaN(duration) && duration > 0;
      const isBitrateValid = !isNaN(bitrate) && bitrate > 0;
      const isSizeValid = !isNaN(size) && size > 0;

      const validInputsCount = [
        isDurationValid,
        isBitrateValid,
        isSizeValid,
      ].filter(Boolean).length;

      if (validInputsCount < 2) {
        return ""; // Need at least two valid inputs to perform any calculation
      }

      let results = [];

      // Calculate Size if Duration and Bitrate are available
      if (isDurationValid && isBitrateValid) {
        const calculatedSize = duration * bitrate;
        results.push(
          `Size: ${calculatedSize.toFixed(0)} bits (from Duration and Bitrate)`
        );
      }

      // Calculate Bitrate if Size and Duration are available
      if (isSizeValid && isDurationValid) {
        const calculatedBitrate = size / duration;
        results.push(
          `Bitrate: ${calculatedBitrate.toFixed(
            2
          )} bps (from Size and Duration)`
        );
      }

      // Calculate Duration if Size and Bitrate are available
      if (isSizeValid && isBitrateValid) {
        const calculatedDuration = size / bitrate;
        results.push(
          `Duration: ${calculatedDuration.toFixed(
            2
          )} seconds (from Size and Bitrate)`
        );
      }

      if (results.length === 0) {
        return "Enter at least two valid positive values";
      }

      return results.join("\n");
    }
    case "Loan / EMI Calculator": {
      const principal = parseFloat(values["Principal Amount"]);
      const annualRate = parseFloat(values["Annual Interest Rate"]);
      const tenureMonths = parseFloat(values["Loan Tenure"]);

      if (isNaN(principal) || isNaN(annualRate) || isNaN(tenureMonths))
        return "";

      if (principal <= 0 || annualRate < 0 || tenureMonths <= 0) {
        return "Invalid inputs: Principal & Tenure must be > 0, Rate >= 0";
      }

      const monthlyRate = annualRate / 100 / 12;
      if (monthlyRate === 0) {
        return `EMI: ${(principal / tenureMonths).toFixed(2)}`;
      }
      const emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);
      return isFinite(emi) ? `EMI: ${emi.toFixed(2)}` : "Calculation error";
    }
    case "Interest Rate Calculator": {
      const principal = parseFloat(values.Principal);
      const rate = parseFloat(values.Rate);
      const time = parseFloat(values.Time);

      if (isNaN(principal) || isNaN(rate) || isNaN(time)) return "";

      if (principal <= 0 || rate < 0 || time <= 0) {
        return "Invalid inputs: Principal & Time must be > 0, Rate >= 0";
      }

      const interest = (principal * rate * time) / 100; // Simple Interest
      const finalAmount = principal + interest;
      return `Interest: ${interest.toFixed(
        2
      )}\nFinal Amount: ${finalAmount.toFixed(2)}`;
    }
    case "Discount Calculator": {
      const originalPrice = parseFloat(values["Original Price"]);
      const discountPercentage = parseFloat(values["Discount Percentage"]);

      if (isNaN(originalPrice) || isNaN(discountPercentage)) return "";

      if (
        originalPrice < 0 ||
        discountPercentage < 0 ||
        discountPercentage > 100
      ) {
        return "Invalid inputs: Price >= 0, Discount % between 0-100";
      }

      const discountAmount = originalPrice * (discountPercentage / 100);
      const finalPrice = originalPrice - discountAmount;
      return `Discount: ${discountAmount.toFixed(
        2
      )}\nFinal Price: ${finalPrice.toFixed(2)}`;
    }
    case "Sales Tax / VAT Calculator": {
      const netPrice = parseFloat(values["Net Price"]);
      const taxRate = parseFloat(values["Tax Rate"]);

      if (isNaN(netPrice) || isNaN(taxRate)) return "";

      if (netPrice < 0 || taxRate < 0) {
        return "Invalid inputs: Price & Tax Rate must be >= 0";
      }

      const taxAmount = netPrice * (taxRate / 100);
      const grossPrice = netPrice + taxAmount;
      return `Tax: ${taxAmount.toFixed(2)}\nGross Price: ${grossPrice.toFixed(
        2
      )}`;
    }
    case "Investment Return Calculator (ROI)": {
      const initialInvestment = parseFloat(values["Initial Investment"]);
      const finalValue = parseFloat(values["Final Value"]);

      if (isNaN(initialInvestment) || isNaN(finalValue)) return "";

      if (initialInvestment <= 0 || finalValue < 0) {
        return "Invalid inputs: Initial Investment > 0, Final Value >= 0";
      }

      const roi = ((finalValue - initialInvestment) / initialInvestment) * 100;
      return `ROI: ${roi.toFixed(2)}%`;
    }
    case "Fuel Consumption Cost Calculator": {
      const distance = parseFloat(values.Distance);
      const fuelEfficiency = parseFloat(values["Fuel Efficiency"]);
      const fuelPrice = parseFloat(values.FuelPrice);

      if (isNaN(distance) || isNaN(fuelEfficiency) || isNaN(fuelPrice))
        return "";

      if (distance <= 0 || fuelEfficiency <= 0 || fuelPrice <= 0) {
        return "Invalid inputs: All values must be > 0";
      }

      const fuelNeeded = distance / fuelEfficiency;
      const totalCost = fuelNeeded * fuelPrice;
      return `Fuel Needed: ${fuelNeeded.toFixed(
        2
      )} L\nTotal Cost: ${totalCost.toFixed(2)}`;
    }
    case "Concrete Volume Calculator": {
      const length = parseFloat(values.Length);
      const width = parseFloat(values.Width);
      const depth = parseFloat(values.Depth);

      if (isNaN(length) || isNaN(width) || isNaN(depth)) return "";

      if (length <= 0 || width <= 0 || depth <= 0) {
        return "Invalid inputs: All dimensions must be > 0";
      }

      const volume = length * width * depth;
      return `Volume: ${volume.toFixed(2)} m³`;
    }
    case "Lumber / Wood Board Feet": {
      const thickness = parseFloat(values.Thickness);
      const width = parseFloat(values.Width);
      const length = parseFloat(values.Length);
      const quantity = parseFloat(values.Quantity);

      if (isNaN(thickness) || isNaN(width) || isNaN(length) || isNaN(quantity))
        return "";

      if (thickness <= 0 || width <= 0 || length <= 0 || quantity <= 0) {
        return "Invalid inputs: All values must be > 0";
      }
      const boardFeet = (thickness * width * length * quantity) / 12;
      return `Board Feet: ${boardFeet.toFixed(2)}`;
    }
    case "Steel Weight Calculator": {
      const length = parseFloat(values.Length);
      const width = parseFloat(values.Width);
      const height = parseFloat(values.Height);
      const steelDensity = 7850; // kg/m³

      if (isNaN(length) || isNaN(width) || isNaN(height)) return "";

      if (length <= 0 || width <= 0 || height <= 0) {
        return "Invalid inputs: All dimensions must be > 0";
      }
      const volume = length * width * height;
      const weight = volume * steelDensity;
      return `Weight: ${weight.toFixed(2)} kg`;
    }
    case "Tile & Flooring Calculator": {
      const roomLength = parseFloat(values["Room Length"]); // m
      const roomWidth = parseFloat(values["Room Width"]); // m
      const tileLength = parseFloat(values["Tile Length"]); // cm
      const tileWidth = parseFloat(values["Tile Width"]); // cm
      const groutGap = parseFloat(values["Grout Gap"]); // mm
      const wastePercentage = parseFloat(values["Waste Percentage"]);

      if (
        isNaN(roomLength) ||
        isNaN(roomWidth) ||
        isNaN(tileLength) ||
        isNaN(tileWidth) ||
        isNaN(groutGap) ||
        isNaN(wastePercentage)
      )
        return "";

      if (
        roomLength <= 0 ||
        roomWidth <= 0 ||
        tileLength <= 0 ||
        tileWidth <= 0 ||
        groutGap < 0 ||
        wastePercentage < 0
      ) {
        return "Invalid inputs: Room/Tile dimensions > 0, Grout/Waste >= 0";
      }

      const roomArea = roomLength * roomWidth; // m²
      const tileArea = (tileLength / 100) * (tileWidth / 100); // convert cm to m for tile area

      const tileLengthWithGrout = (tileLength + groutGap / 10) / 100; // cm to m
      const tileWidthWithGrout = (tileWidth + groutGap / 10) / 100; // cm to m
      const tileAreaWithGrout = tileLengthWithGrout * tileWidthWithGrout;

      let tilesNeeded = roomArea / tileArea;
      if (tileAreaWithGrout > 0) {
        tilesNeeded = roomArea / tileAreaWithGrout;
      }

      const totalTiles = tilesNeeded * (1 + wastePercentage / 100);
      return `Tiles Needed: ${Math.ceil(totalTiles)} (approx)`;
    }
    case "Paint Coverage Calculator": {
      const wallLength = parseFloat(values["Wall Length"]);
      const wallHeight = parseFloat(values["Wall Height"]);
      const numberOfCoats = parseFloat(values["Number of Coats"]);
      const coveragePerLiter = parseFloat(values["Coverage per Liter"]);

      if (
        isNaN(wallLength) ||
        isNaN(wallHeight) ||
        isNaN(numberOfCoats) ||
        isNaN(coveragePerLiter)
      )
        return "";

      if (
        wallLength <= 0 ||
        wallHeight <= 0 ||
        numberOfCoats <= 0 ||
        coveragePerLiter <= 0
      ) {
        return "Invalid inputs: All values must be > 0";
      }

      const wallArea = wallLength * wallHeight;
      const totalAreaToPaint = wallArea * numberOfCoats;
      const litersNeeded = totalAreaToPaint / coveragePerLiter;
      return `Liters Needed: ${litersNeeded.toFixed(2)} L`;
    }
    case "BMI Calculator": {
      const weight = parseFloat(values.Weight);
      const height = parseFloat(values.Height);

      if (isNaN(weight) || isNaN(height)) return "";

      if (weight <= 0 || height <= 0) {
        return "Invalid inputs: Weight & Height must be > 0";
      }

      const bmi = weight / (height * height);
      let classification = "";
      if (bmi < 18.5) classification = "Underweight";
      else if (bmi >= 18.5 && bmi <= 24.9) classification = "Normal weight";
      else if (bmi >= 25 && bmi <= 29.9) classification = "Overweight";
      else classification = "Obesity";

      return `BMI: ${bmi.toFixed(2)} (${classification})`;
    }
    case "Body Fat Calculator": {
      const weightKg = parseFloat(values.Weight);
      const heightCm = parseFloat(values.Height);
      const age = parseFloat(values.Age);
      const gender = (values.Gender || "").toLowerCase(); // "male" or "female"

      if (
        isNaN(weightKg) ||
        isNaN(heightCm) ||
        isNaN(age) ||
        !(gender === "male" || gender === "female")
      ) {
        return "";
      }

      if (weightKg <= 0 || heightCm <= 0 || age <= 0) {
        return "Invalid inputs: Weight, Height, Age must be > 0";
      }

      const heightM = heightCm / 100;
      const bmi = weightKg / (heightM * heightM);

      let bodyFatPercentage;
      // Using the simplified Deurenberg equation for estimation based on BMI, Age, and Gender
      if (gender === "male") {
        bodyFatPercentage = 1.2 * bmi + 0.23 * age - 16.2;
      } else {
        // female
        bodyFatPercentage = 1.2 * bmi + 0.23 * age - 5.4;
      }

      // Clamp values to a reasonable range
      if (bodyFatPercentage < 5) bodyFatPercentage = 5;
      if (bodyFatPercentage > 50) bodyFatPercentage = 50;

      let category = "";
      if (gender === "male") {
        if (bodyFatPercentage <= 5) category = "Essential Fat";
        else if (bodyFatPercentage <= 13) category = "Athletes";
        else if (bodyFatPercentage <= 17) category = "Fitness";
        else if (bodyFatPercentage <= 24) category = "Average";
        else category = "Obese";
      } else {
        // female
        if (bodyFatPercentage <= 13) category = "Essential Fat";
        else if (bodyFatPercentage <= 20) category = "Athletes";
        else if (bodyFatPercentage <= 24) category = "Fitness";
        else if (bodyFatPercentage <= 31) category = "Average";
        else category = "Obese";
      }

      return `Body Fat: ${bodyFatPercentage.toFixed(
        2
      )}%\nCategory: ${category} (Estimation)`; // Added Estimation clarity
    }
    case "Calorie Burn Calculator": {
      const weight = parseFloat(values.Weight);
      const duration = parseFloat(values.Duration); // minutes
      const activityType = (values["Activity Type"] || "").toLowerCase();
      const customMetValue = parseFloat(values["MET Value"]);

      if (isNaN(weight) || isNaN(duration) || !activityType.trim()) {
        return "";
      }

      if (weight <= 0 || duration <= 0) {
        return "Invalid inputs: Weight & Duration must be > 0";
      }

      let metValue = 0;
      if (
        activityType === "custom" &&
        !isNaN(customMetValue) &&
        customMetValue > 0
      ) {
        metValue = customMetValue;
      } else {
        switch (activityType) {
          case "running":
            metValue = 8.0;
            break;
          case "walking":
            metValue = 3.5;
            break;
          case "cycling":
            metValue = 7.5;
            break;
          case "swimming":
            metValue = 6.0;
            break;
          case "aerobics":
            metValue = 5.0;
            break;
          case "sitting":
            metValue = 1.5;
            break;
          default:
            return "Please select a valid activity or enter a custom MET value.";
        }
      }

      if (metValue === 0) return ""; // Should not happen with validation above

      const durationHours = duration / 60;
      const caloriesBurned = metValue * weight * durationHours;

      return `Calories Burned: ${caloriesBurned.toFixed(0)} kcal (approx)`;
    }
    case "Water Intake Calculator": {
      const weight = parseFloat(values.Weight);
      const activityLevel = (values["Activity Level"] || "").toLowerCase();

      if (isNaN(weight) || !activityLevel.trim()) {
        return "";
      }

      if (weight <= 0) {
        return "Invalid inputs: Weight must be > 0";
      }

      // Base recommendation: ~33ml per kg of body weight
      let recommendedIntakeMl = weight * 33;

      if (activityLevel === "medium") {
        recommendedIntakeMl *= 1.1; // 10% more for medium activity
      } else if (activityLevel === "high") {
        recommendedIntakeMl *= 1.25; // 25% more for high activity
      }

      return `Recommended Intake: ${(recommendedIntakeMl / 1000).toFixed(
        2
      )} Liters/day (Guideline)`; // Added Guideline clarity
    }
    case "Mileage / Distance Calculator": {
      const startOdometer = parseFloat(values["Start Odometer"]);
      const endOdometer = parseFloat(values["End Odometer"]);
      const fuelUsed = parseFloat(values["Fuel Used"]);
      const fuelPrice = parseFloat(values["Fuel Price"]);

      if (
        isNaN(startOdometer) ||
        isNaN(endOdometer) ||
        isNaN(fuelUsed) ||
        isNaN(fuelPrice)
      )
        return "";

      if (
        startOdometer < 0 ||
        endOdometer < startOdometer ||
        fuelUsed <= 0 ||
        fuelPrice <= 0
      ) {
        return "Invalid inputs: Odometer >= 0, End Odometer >= Start Odometer, Fuel Used & Price > 0";
      }

      const distanceDriven = endOdometer - startOdometer;
      const fuelEconomy = distanceDriven / fuelUsed;
      const tripCost = fuelUsed * fuelPrice;

      return `Distance: ${distanceDriven.toFixed(
        2
      )} km\nEconomy: ${fuelEconomy.toFixed(2)} km/L\nCost: ${tripCost.toFixed(
        2
      )}`;
    }
    case "Tire Size Converter": {
      const tireWidth = parseFloat(values["Tire Width"]);
      const aspectRatio = parseFloat(values["Aspect Ratio"]);
      const rimDiameter = parseFloat(values["Rim Diameter"]);

      if (isNaN(tireWidth) || isNaN(aspectRatio) || isNaN(rimDiameter))
        return "";

      if (tireWidth <= 0 || aspectRatio <= 0 || rimDiameter <= 0) {
        return "Invalid inputs: All values must be > 0";
      }

      const sidewallHeight = tireWidth * (aspectRatio / 100);
      const overallDiameter = rimDiameter * 25.4 + 2 * sidewallHeight;
      const circumference = overallDiameter * Math.PI;

      return `Overall Diameter: ${(overallDiameter / 25.4).toFixed(
        2
      )} inches\nCircumference: ${(circumference / 25.4).toFixed(2)} inches`;
    }
    case "Age Calculator": {
      const dob = values["Date of Birth"];
      if (!dob || dob.trim() === "") return "";

      const birthDate = new Date(dob);
      const today = new Date();

      if (isNaN(birthDate.getTime()))
        return "Invalid Date of Birth format (YYYY-MM-DD)";

      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return `Age: ${age} years`;
    }
    case "Date Difference Calculator": {
      const startDateStr = values["Start Date"];
      const endDateStr = values["End Date"];

      if (
        !startDateStr ||
        startDateStr.trim() === "" ||
        !endDateStr ||
        endDateStr.trim() === ""
      )
        return "";

      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
        return "Invalid date format (YYYY-MM-DD)";

      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const diffYears = endDate.getFullYear() - startDate.getFullYear();
      const diffMonths =
        endDate.getMonth() - startDate.getMonth() + diffYears * 12;

      let output = `Difference: ${diffDays} days`;
      if (diffYears > 0) output += `\nYears: ${diffYears}`;
      else if (diffMonths > 0) output += `\nMonths: ${diffMonths}`;

      return output;
    }
    case "Work Hour Calculator": {
      const startTimeStr = values["Start Time"];
      const endTimeStr = values["End Time"];
      const breakDuration = parseFloat(values["Break Duration"]);

      if (
        !startTimeStr ||
        startTimeStr.trim() === "" ||
        !endTimeStr ||
        endTimeStr.trim() === "" ||
        isNaN(breakDuration)
      )
        return "";

      const startTime = parseTime(startTimeStr);
      let endTime = parseTime(endTimeStr);

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime()))
        return "Invalid time format (HH:MM)";
      if (isNaN(breakDuration) || breakDuration < 0)
        return "Break duration must be a non-negative number";

      if (endTime.getTime() < startTime.getTime()) {
        endTime.setDate(endTime.getDate() + 1);
      }

      let totalWorkMs = endTime.getTime() - startTime.getTime();
      let totalWorkHours = totalWorkMs / (1000 * 60 * 60);

      const actualWorkHours = totalWorkHours - breakDuration / 60;

      if (actualWorkHours < 0)
        return "Actual work hours cannot be negative (check times/break)";

      const hours = Math.floor(actualWorkHours);
      const minutes = Math.round((actualWorkHours - hours) * 60);

      return `Total Work: ${hours}h ${minutes}m`;
    }
    case "Countdown Calculator": {
      // This calculator's result is handled by the useEffect for live updates.
      // The `calculate` function here returns a static string or initial value.
      const targetDateStr = values["Target Date"];
      const targetTimeStr = values["Target Time"];

      if (
        !targetDateStr ||
        targetDateStr.trim() === "" ||
        !targetTimeStr ||
        targetTimeStr.trim() === ""
      )
        return "";

      const targetDateTime = new Date(
        `${targetDateStr}T${targetTimeStr || "00:00:00"}`
      );
      const now = new Date();

      if (isNaN(targetDateTime.getTime()))
        return "Invalid Target Date/Time format";

      const difference = targetDateTime.getTime() - now.getTime();
      if (difference < 0) return "Date has passed";

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
      if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

      return `Countdown: ${parts.join(" ")}`;
    }
    case "Text Case Converter": {
      const text = values.Text || "";
      if (text.trim() === "") return "";
      return `UPPER: ${text.toUpperCase()}\nlower: ${text.toLowerCase()}\nTitle: ${text.replace(
        /\b\w/g,
        (s) => s.toUpperCase()
      )}`;
    }
    default:
      return "";
  }
};
const filterAndSortCalculators = (query, allConverters) => {
  if (!query) {
    return Object.keys(allConverters); // Return all if query is empty
  }

  const lowerCaseQuery = query.toLowerCase();
  const queryWords = lowerCaseQuery.split(" ").filter(Boolean); // Split query into words, remove empty strings

  const results = [];

  for (const categoryName of Object.keys(allConverters)) {
    const converter = allConverters[categoryName];
    const lowerCaseCategoryName = categoryName.toLowerCase();
    let score = 0;

    // Highest priority: Exact match of category name
    if (lowerCaseCategoryName === lowerCaseQuery) {
      score = 100;
    }
    // Very high priority: Category name starts with query
    else if (lowerCaseCategoryName.startsWith(lowerCaseQuery)) {
      score = 95;
    }
    // High priority: Exact match of query with any keyword
    else if (
      converter.keywords &&
      converter.keywords.some(
        (keyword) => keyword.toLowerCase() === lowerCaseQuery
      )
    ) {
      score = 90;
    }
    // Good priority: Category name includes query (as a substring)
    else if (lowerCaseCategoryName.includes(lowerCaseQuery)) {
      score = 85;
    }
    // Moderate priority: All query words are present in category name (not necessarily contiguous)
    else if (queryWords.every((word) => lowerCaseCategoryName.includes(word))) {
      score = 80;
    }
    // Another moderate priority: Any keyword includes query (as a substring)
    else if (
      converter.keywords &&
      converter.keywords.some((keyword) =>
        keyword.toLowerCase().includes(lowerCaseQuery)
      )
    ) {
      score = 75;
    }
    // Check if all query words are present in any of the keywords
    else if (
      converter.keywords &&
      queryWords.every((queryWord) =>
        converter.keywords.some((keyword) =>
          keyword.toLowerCase().includes(queryWord)
        )
      )
    ) {
      score = 70;
    }
    // Match in units (for unit converters) - single word query
    else if (converter.type === "unit" && Array.isArray(converter.units)) {
      if (
        converter.units.some((unit) =>
          unit.toLowerCase().includes(lowerCaseQuery)
        )
      ) {
        score = 50;
      }
    }
    // Match in input names (for calculators) - single word query
    else if (
      converter.type === "calculator" &&
      Array.isArray(converter.inputs)
    ) {
      if (
        converter.inputs.some((input) =>
          input.name.toLowerCase().includes(lowerCaseQuery)
        )
      ) {
        score = 40;
      }
    }

    if (score > 0) {
      results.push({
        categoryName,
        score,
        originalLength: categoryName.length,
      });
    }
  }

  // Sort results: highest score first, then shortest name first
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.originalLength - b.originalLength;
  });

  return results.map((result) => result.categoryName);
};

export default function UniversalUnitConverterClient() {
  const [selectedCategory, setSelectedCategory] = useState("Length / Distance");
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("Meter (m)"); // Initialized with default unit
  const [toUnit, setToUnit] = useState("Kilometer (km)"); // Initialized with default unit
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllResults, setShowAllResults] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({
    "Core Daily Converters": true,
  });

  const [calculatorValues, setCalculatorValues] = useState({});
  const [calculatorResult, setCalculatorResult] = useState(null);
  const [showCopyMessage, setShowCopyMessage] = useState(false); // State for copy message

  // New state for currency exchange rates
  const [exchangeRates, setExchangeRates] = useState({});
  const [ratesLoading, setRatesLoading] = useState(false); // Set to false initially, only load when needed
  const [ratesError, setRatesError] = useState(null);

  // New state for Time Zone Converter
  const [timezones, setTimezones] = useState([]);
  const [timeZoneLoading, setTimeZoneLoading] = useState(false);
  const [timeZoneError, setTimeZoneError] = useState(null);

  // New states for Scientific Calculator
  const [calcCurrentInput, setCalcCurrentInput] = useState("0"); // What's shown in the main display
  const [calcExpression, setCalcExpression] = useState(""); // The full expression
  const [calcResult, setCalcResult] = useState(null); // The result of the current expression
  const [lastButtonWasEquals, setLastButtonWasEquals] = useState(false); // To handle chaining operations
  const [trigMode, setTrigMode] = useState("rad"); // 'rad' or 'deg'
  const [inverseMode, setInverseMode] = useState(false); // true for Inv functions
  // NEW: Ref for search input and state for filtered categories
  const searchInputRef = useRef(null);
  const [filteredCategories, setFilteredCategories] = useState(
    Object.keys(converters)
  );
  const currentConverter = converters[selectedCategory];

  const numValue = parseFloat(value) || 0;
  const mainResult =
    currentConverter.type === "unit"
      ? convertValue(
          numValue,
          fromUnit,
          toUnit,
          selectedCategory,
          exchangeRates
        ) // Pass exchangeRates
      : null;

  const allResults =
    currentConverter.type === "unit"
      ? currentConverter.units.map((unit) => ({
          unit,
          value: convertValue(
            numValue,
            fromUnit,
            unit,
            selectedCategory,
            exchangeRates // Pass exchangeRates here too
          ),
        }))
      : [];

  // Helper to evaluate scientific expressions
  const evaluateScientificExpression = useCallback(
    (expression) => {
      try {
        if (!expression.trim()) return "";

        let cleanedExpression = expression;
        cleanedExpression = cleanedExpression.replace(
          /(\d+\.?\d*|\([^)]+\))!/g,
          (match, p1) => {
            // If p1 contains parentheses, evaluate it first
            if (p1.startsWith("(")) {
              try {
                const innerValue = Function(`"use strict"; return (${p1})`)();
                return `(${factorial(Math.floor(innerValue))})`;
              } catch {
                return "Error";
              }
            }
            // For simple numbers
            return `(${factorial(parseFloat(p1))})`;
          }
        );
        // --- Implicit Multiplication ---
        // Cases: Number followed by π, Number followed by function, ) followed by Number, π followed by (
        cleanedExpression = cleanedExpression
          .replace(/(\d+)(π)/g, "$1*$2") // e.g., 2π -> 2*π
          .replace(/(\d+)([a-zA-Z]+\()/g, "$1*$2") // e.g., 2sin( -> 2*sin(
          .replace(/(\))(\d+)/g, "$1*$2") // e.g., (2+3)5 -> (2+3)*5
          .replace(/(π)(\()/g, "$1*$2") // e.g., π(2) -> π*(2)
          .replace(
            /(\d+\.?\d*)\s*(?:e|E)\s*(\-?\d+)/g,
            (match, p1, p2) =>
              `${parseFloat(p1)}*Math.pow(10,${parseInt(p2, 10)})`
          ); // Handle scientific notation like 2e3

        // --- Function mapping and trig mode ---
        cleanedExpression = cleanedExpression
          .replace(/sin\(/g, `Math.${inverseMode ? "asin" : "sin"}(`)
          .replace(/cos\(/g, `Math.${inverseMode ? "acos" : "cos"}(`)
          .replace(/tan\(/g, `Math.${inverseMode ? "atan" : "tan"}(`)
          .replace(/log\(/g, `Math.${inverseMode ? "pow(10," : "log10"}(`) // log base 10
          .replace(/ln\(/g, `Math.${inverseMode ? "exp" : "log"}(`) // natural log (ln)
          .replace(/sqrt\(/g, "Math.sqrt(")
          .replace(/exp\(/g, "Math.exp(") // Explicit exp() for e^x
          .replace(/\^/g, "**")
          .replace(/π/g, "Math.PI");

        // Convert degrees to radians if trigMode is 'deg' for trigonometric functions
        if (trigMode === "deg") {
          cleanedExpression = cleanedExpression.replace(
            /(Math\.(?:sin|cos|tan)\([^)]*\))/g,
            (match) => {
              const arg = match.substring(
                match.indexOf("(") + 1,
                match.lastIndexOf(")")
              );
              // Temporarily evaluate the argument to convert it to radians
              // This is a simplified approach, a full parser would be more robust
              let argInRadians;
              try {
                argInRadians = (eval(arg) * Math.PI) / 180;
              } catch {
                return "Error"; // If argument itself is invalid
              }
              return match.replace(arg, argInRadians);
            }
          );
        }

        // Auto-close any open parenthesis
        const openParens = (cleanedExpression.match(/\(/g) || []).length;
        const closeParens = (cleanedExpression.match(/\)/g) || []).length;
        for (let i = 0; i < openParens - closeParens; i++) {
          cleanedExpression += ")";
        }

        // Attempt to evaluate
        // Using a Function constructor for safer evaluation than direct eval
        const result = Function(
          `"use strict"; return (${cleanedExpression})`
        )();

        if (isNaN(result) || !isFinite(result)) {
          return "Error";
        }
        return String(result);
      } catch (e) {
        return "Error";
      }
    },
    [trigMode, inverseMode]
  );

  // Effect for updating calculator results and fetching currency rates
  useEffect(() => {
    let intervalId;
    if (currentConverter && currentConverter.type === "calculator") {
      // Special handling for Countdown Calculator
      if (selectedCategory === "Countdown Calculator") {
        const updateCountdown = () => {
          setCalculatorResult(calculate(selectedCategory, calculatorValues));
        };

        updateCountdown(); // Initial call
        intervalId = setInterval(updateCountdown, 1000); // Update every second

        return () => clearInterval(intervalId); // Cleanup interval
      } else if (selectedCategory === "Time Zone Converter") {
        // Handle Time Zone Converter as it has an async calculate function
        const updateTimeZoneConversion = async () => {
          setCalculatorResult("Calculating...");
          const result = await calculate(selectedCategory, calculatorValues);
          setCalculatorResult(result);
        };
        updateTimeZoneConversion();
      } else if (selectedCategory !== "Scientific Calculator") {
        // Only run for non-scientific calculators
        const result = calculate(selectedCategory, calculatorValues);
        setCalculatorResult(result);
      }
    } else {
      setCalculatorResult(null);
    }

    // Fetch currency rates when Currency Converter is selected
    if (selectedCategory === "Currency Converter") {
      const fetchRates = async () => {
        setRatesLoading(true);
        setRatesError(null);
        try {
          // Hardcode USD as the base for fetching, as per the example API call.
          // The API returns conversion rates *from* the base currency (USD) to others.
          const response = await fetch(`${EXCHANGE_RATE_API_BASE_URL}USD`);
          const data = await response.json();

          if (data.result === "success") {
            setExchangeRates(data.conversion_rates);
          } else {
            setRatesError(
              data["error-type"] || "Failed to fetch currency rates."
            );
            console.error("Error fetching currency rates:", data);
          }
        } catch (error) {
          setRatesError("Network error or failed to fetch rates.");
          console.error("Network error fetching currency rates:", error);
        } finally {
          setRatesLoading(false);
        }
      };
      fetchRates();
    }

    // Fetch time zones when Time Zone Converter is selected
    if (selectedCategory === "Time Zone Converter" && timezones.length === 0) {
      const fetchTimezones = async () => {
        setTimeZoneLoading(true);
        setTimeZoneError(null);
        try {
          const response = await fetch("https://worldtimeapi.org/api/timezone");
          const data = await response.json();
          if (response.ok) {
            setTimezones(data);
          } else {
            setTimeZoneError("Failed to fetch time zones.");
            console.error("Error fetching time zones:", data);
          }
        } catch (error) {
          setTimeZoneError("Network error or failed to fetch time zones.");
          console.error("Network error fetching time zones:", error);
        } finally {
          setTimeZoneLoading(false);
        }
      };
      fetchTimezones();
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [
    calculatorValues,
    selectedCategory,
    timezones.length,
    currentConverter,
    evaluateScientificExpression,
  ]); // Added evaluateScientificExpression

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const converter = converters[category];
    if (converter.type === "unit") {
      setValue("1");
      setFromUnit(converter.units[0]);
      setToUnit(converter.units[1] || converter.units[0]);
      setCalculatorValues({});
      setCalculatorResult(null);
      // Reset scientific calculator states
      setCalcCurrentInput("0");
      setCalcExpression("");
      setCalcResult(null);
      setLastButtonWasEquals(false);
      setTrigMode("rad");
      setInverseMode(false);
    } else {
      setValue(""); // For calculators, value input is not generally used the same way
      setFromUnit("");
      setToUnit("");
      // Reset scientific calculator states
      setCalcCurrentInput("0");
      setCalcExpression("");
      setCalcResult(null);
      setLastButtonWasEquals(false);
      setTrigMode("rad");
      setInverseMode(false);

      // Initialize calculator inputs with empty strings for text/date/time or default for select
      const initialCalcValues = {};
      // Only iterate if inputs exist (Scientific Calculator has no explicit inputs)
      if (converter.inputs) {
        converter.inputs.forEach((input) => {
          if (input.unit === "select") {
            initialCalcValues[input.name] = input.options[0];
          } else {
            initialCalcValues[input.name] = "";
          }
        });
      }
      setCalculatorValues(initialCalcValues);
      setCalculatorResult(null);
    }

    // Specific defaults for Currency Converter
    if (category === "Currency Converter") {
      setValue("1");
      setFromUnit("USD");
      setToUnit("PKR");
    }

    // Specific defaults for Time Zone Converter
    if (category === "Time Zone Converter") {
      // Set default values for date and time to current date and time
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const day = now.getDate().toString().padStart(2, "0");
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");

      setCalculatorValues({
        Date: `${year}-${month}-${day}`,
        Time: `${hours}:${minutes}`,
        "From Time Zone": "Etc/UTC", // Default to UTC
        "To Time Zone": "America/New_York", // Default to a common timezone
      });
      setCalculatorResult(null);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // NEW: Use the intelligent filtering and sorting for calculator suggestions
    const newFilteredCategories = filterAndSortCalculators(query, converters);
    setFilteredCategories(newFilteredCategories);

    // Keep the direct unit conversion parsing for specific patterns
    const match = query.match(
      /([\\d.]+)\\s*([^\\d\\s]+)\\s*(?:to|in)\\s*([^\\d\\s]+)/i
    );

    if (match) {
      const val = match[1];
      const from = match[2].trim();
      const to = match[3].trim();

      for (const [cat, conv] of Object.entries(converters)) {
        if (
          conv.type === "unit" &&
          Array.isArray(conv.units) &&
          conv.units.includes(from) &&
          conv.units.includes(to)
        ) {
          setSelectedCategory(cat);
          setValue(val);
          setFromUnit(from);
          setToUnit(to);
          setSearchQuery(""); // Clear search query if direct conversion is applied
          break;
        }
      }
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleCalculatorInputChange = (inputName, val) => {
    setCalculatorValues((prev) => ({ ...prev, [inputName]: val }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setShowCopyMessage(true);
        setTimeout(() => setShowCopyMessage(false), 2000); // Hide after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // Updated handleCalculatorButtonClick function with fixes
  const handleCalculatorButtonClick = useCallback(
    (buttonValue) => {
      const operators = ["+", "-", "*", "/", "^"];
      const scientificFunctions = [
        "sin(",
        "cos(",
        "tan(",
        "log(",
        "ln(",
        "sqrt(",
        "exp(",
        "asin(",
        "acos(",
        "atan(",
      ];
      const specialValues = ["π"];

      let newExpression = calcExpression;
      let newCurrentInput = calcCurrentInput;
      let newLastButtonWasEquals = false;

      // Helper function to count parenthesis
      const countParens = (str) => {
        const open = (str.match(/\(/g) || []).length;
        const close = (str.match(/\)/g) || []).length;
        return { open, close };
      };

      // Helper function to auto-close parenthesis
      const autoCloseParens = (expr) => {
        const { open, close } = countParens(expr);
        let result = expr;
        for (let i = 0; i < open - close; i++) {
          result += ")";
        }
        return result;
      };

      if (buttonValue === "C") {
        newCurrentInput = "0";
        newExpression = "";
        setCalcResult(null);
      } else if (buttonValue === "Bksp") {
        if (lastButtonWasEquals) {
          newCurrentInput = "0";
          newExpression = "";
          setCalcResult(null);
        } else if (newCurrentInput.length > 0 && newCurrentInput !== "0") {
          newCurrentInput = newCurrentInput.slice(0, -1);
          newExpression = newExpression.slice(0, -1);
          if (newCurrentInput === "") {
            newCurrentInput = "0";
          }
        } else if (newExpression.length > 0) {
          newExpression = newExpression.slice(0, -1);
        }
      } else if (buttonValue === "=") {
        newLastButtonWasEquals = true;
        try {
          // Auto-close any open parenthesis before evaluating
          let finalExpression = autoCloseParens(newExpression);
          const finalResult = evaluateScientificExpression(finalExpression);
          if (finalResult !== "Error") {
            newCurrentInput = formatNumber(parseFloat(finalResult));
            newExpression = finalResult;
            setCalcResult(null);
          } else {
            newCurrentInput = "Error";
            newExpression = "";
          }
        } catch (e) {
          newCurrentInput = "Error";
          newExpression = "";
        }
      } else if (buttonValue === "±") {
        if (newCurrentInput === "0" && newExpression === "") {
          newCurrentInput = "-0";
          newExpression = "-";
        } else if (newCurrentInput.startsWith("-")) {
          newCurrentInput = newCurrentInput.substring(1);
          newExpression = newExpression.replace(/^-/, "");
        } else {
          newCurrentInput = "-" + newCurrentInput;
          newExpression = "-" + newExpression;
        }
      } else if (buttonValue === "%") {
        try {
          // Apply % to the current input number
          const currentValue = parseFloat(newCurrentInput);
          if (!isNaN(currentValue)) {
            const percentValue = currentValue / 100;
            newCurrentInput = String(percentValue);
            // Replace the last number in the expression with its percentage value
            newExpression = newExpression.replace(
              /(\d+\.?\d*)$/,
              String(percentValue)
            );
          }
        } catch (e) {
          newCurrentInput = "Error";
          newExpression = "";
        }
      } else if (buttonValue === "1/x") {
        try {
          let valueToReciprocal = newCurrentInput;
          if (
            lastButtonWasEquals &&
            calcResult !== null &&
            calcResult !== "Error"
          ) {
            valueToReciprocal = String(calcResult);
          }

          const currentValue = parseFloat(valueToReciprocal);
          if (!isNaN(currentValue) && currentValue !== 0) {
            newCurrentInput = String(1 / currentValue);
            // If the expression ends with a number, replace that number with its reciprocal.
            // Otherwise, apply 1/ to the entire current expression (e.g., if it's a function).
            if (/\d$/.test(newExpression)) {
              newExpression = newExpression.replace(
                /(\d+\.?\d*)$/,
                `(1/${currentValue})`
              );
            } else {
              newExpression = `(1/${newExpression})`;
            }
          } else {
            newCurrentInput = "Error";
            newExpression = "";
          }
        } catch (e) {
          newCurrentInput = "Error";
          newExpression = "";
        }
      } else if (buttonValue === "x²") {
        try {
          const currentValue = parseFloat(newCurrentInput);
          if (!isNaN(currentValue)) {
            newCurrentInput = String(currentValue * currentValue);
            if (/\d$/.test(newExpression)) {
              newExpression = newExpression.replace(
                /(\d+\.?\d*)$/,
                `(${currentValue}**2)`
              );
            } else {
              newExpression = `(${newExpression}**2)`;
            }
          } else {
            newCurrentInput = "Error";
            newExpression = "";
          }
        } catch (e) {
          newCurrentInput = "Error";
          newExpression = "";
        }
      } else if (buttonValue === "√") {
        // If a number is currently displayed, multiply it by sqrt(
        if (
          calcCurrentInput !== "0" &&
          !isNaN(parseFloat(calcCurrentInput)) &&
          !operators.includes(calcExpression.slice(-1))
        ) {
          newExpression += "*sqrt(";
          newCurrentInput = "sqrt(";
        } else {
          newExpression += "sqrt(";
          newCurrentInput = "sqrt(";
        }
        newLastButtonWasEquals = false;
      } else if (buttonValue === "Rad") {
        setTrigMode("rad");
        return;
      } else if (buttonValue === "Deg") {
        setTrigMode("deg");
        return;
      } else if (buttonValue === "Inv") {
        setInverseMode((prev) => !prev);
        return;
      } else if (!isNaN(Number(buttonValue)) || buttonValue === ".") {
        if (lastButtonWasEquals) {
          newExpression = buttonValue;
          newCurrentInput = buttonValue;
        } else if (buttonValue === ".") {
          if (!newCurrentInput.includes(".")) {
            if (newCurrentInput === "0" || newCurrentInput === "") {
              newCurrentInput = "0.";
              newExpression += "0.";
            } else {
              newCurrentInput += ".";
              newExpression += ".";
            }
          }
        } else {
          // If the last character in the expression is a closing parenthesis or π,
          // and a number is pressed, it implies multiplication.
          const lastChar = newExpression.slice(-1);
          if (lastChar === ")" || lastChar === "π") {
            newExpression += "*" + buttonValue;
            newCurrentInput = buttonValue;
          } else if (newCurrentInput === "0" && newExpression === "0") {
            // If only "0" is present, replace it with the new digit
            newCurrentInput = buttonValue;
            newExpression = buttonValue;
          } else if (
            newCurrentInput === "0" &&
            newExpression.endsWith("0") &&
            operators.includes(newExpression.slice(-2, -1))
          ) {
            // Replace trailing "0" after an operator
            newCurrentInput = buttonValue;
            newExpression = newExpression.slice(0, -1) + buttonValue;
          } else if (
            scientificFunctions.some((fn) => newExpression.endsWith(fn))
          ) {
            // Inside a function call, just append the number
            newCurrentInput =
              newCurrentInput === "0"
                ? buttonValue
                : newCurrentInput + buttonValue;
            newExpression += buttonValue;
          } else if (newCurrentInput === "0") {
            newCurrentInput = buttonValue;
            // Only replace the last '0' if it's the beginning of a number or after an operator
            const lastNumRegex = /(\D|^)0$/; // Matches a 0 preceded by non-digit or start of string
            if (lastNumRegex.test(newExpression)) {
              newExpression = newExpression.replace(
                lastNumRegex,
                `$1${buttonValue}`
              );
            } else {
              newExpression += buttonValue;
            }
          } else {
            newCurrentInput += buttonValue;
            newExpression += buttonValue;
          }
        }
      } else if (operators.includes(buttonValue)) {
        // Auto-close open parenthesis before adding operator
        const { open, close } = countParens(newExpression);
        if (open > close) {
          newExpression = autoCloseParens(newExpression);
        }

        if (lastButtonWasEquals) {
          newExpression = calcExpression + buttonValue;
        } else if (
          newExpression.length > 0 &&
          operators.includes(newExpression.slice(-1))
        ) {
          // Replace last operator if an operator is already there
          newExpression = newExpression.slice(0, -1) + buttonValue;
        } else {
          newExpression += buttonValue;
        }
        newCurrentInput = "0";
        newLastButtonWasEquals = false;
      } else if (scientificFunctions.some((fn) => buttonValue.startsWith(fn))) {
        let functionCall = buttonValue;
        // If there's a current number input and it's not "0", assume implicit multiplication
        if (
          newCurrentInput !== "0" &&
          !isNaN(parseFloat(newCurrentInput)) &&
          !operators.includes(newExpression.slice(-1))
        ) {
          newExpression += "*" + functionCall;
        } else {
          newExpression += functionCall;
        }
        newCurrentInput = functionCall;
        newLastButtonWasEquals = false;
      } else if (buttonValue === "(" || buttonValue === ")") {
        // If a number or 'π' precedes an opening parenthesis, add multiplication.
        const lastChar = newExpression.slice(-1);
        if (
          buttonValue === "(" &&
          (/\d/.test(lastChar) || lastChar === "π" || lastChar === ")")
        ) {
          newExpression += "*" + buttonValue;
        } else {
          newExpression += buttonValue;
        }
        newCurrentInput = buttonValue;
        newLastButtonWasEquals = false;
      } else if (specialValues.includes(buttonValue)) {
        const lastChar = newExpression.slice(-1);
        // If a number precedes π, add multiplication.
        if (buttonValue === "π" && /\d/.test(lastChar)) {
          newExpression += "*Math.PI";
        } else {
          newExpression += buttonValue === "π" ? "Math.PI" : buttonValue;
        }
        newCurrentInput = "π"; // Display 'π' directly
        newLastButtonWasEquals = false;
      } else if (buttonValue === "!") {
        try {
          // Apply factorial to the current input number
          const currentValue = parseFloat(newCurrentInput);
          if (
            !isNaN(currentValue) &&
            currentValue >= 0 &&
            Number.isInteger(currentValue)
          ) {
            const factorialValue = factorial(currentValue);
            newCurrentInput = String(factorialValue);
            // Replace the last number in the expression with its factorial
            if (/\d$/.test(newExpression)) {
              newExpression = newExpression.replace(
                /(\d+\.?\d*)$/,
                `${factorialValue}`
              );
            } else {
              newExpression = `(${newExpression})!`;
            }
          } else {
            newCurrentInput = "Error";
            newExpression = "";
          }
        } catch (e) {
          newCurrentInput = "Error";
          newExpression = "";
        }
      }
      setCalcExpression(newExpression);
      setCalcCurrentInput(newCurrentInput);
      setLastButtonWasEquals(newLastButtonWasEquals);

      // Real-time evaluation
      // Only attempt real-time evaluation if the expression doesn't end with an operator or an incomplete function
      if (
        newExpression &&
        newExpression !== "Error" &&
        !operators.includes(newExpression.slice(-1)) &&
        !scientificFunctions.some((fn) =>
          newExpression.endsWith(fn.slice(0, -1))
        ) && // Check for incomplete function names
        newExpression.slice(-1) !== "("
      ) {
        let evalExpression = newExpression;
        // Don't auto-close for real-time eval, let user see incomplete functions
        const realTimeEval = evaluateScientificExpression(evalExpression);
        if (realTimeEval !== "Error") {
          setCalcResult(formatNumber(parseFloat(realTimeEval)));
        } else {
          setCalcResult(null);
        }
      } else {
        setCalcResult(null);
      }
    },
    [
      calcCurrentInput,
      calcExpression,
      lastButtonWasEquals,
      evaluateScientificExpression,
      calcResult,
      trigMode,
      inverseMode,
    ]
  );

  // ... existing code ...

  // Handle keyboard input
  useEffect(() => {
    if (selectedCategory !== "Scientific Calculator") return;

    const handleKeyDown = (event) => {
      // NEW: If search input is focused, prevent calculator from processing key presses
      if (
        searchInputRef.current &&
        searchInputRef.current === document.activeElement
      ) {
        return;
      }

      const key = event.key;
      const validKeys = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "+",
        "-",
        "*",
        "/",
        ".",
        "=",
        "Enter",
        "Backspace",
        "Escape",
        "(",
        ")",
        "p", // For Pi
        "s", // For sin/asin
        "c", // For cos/acos
        "t", // For tan/atan
        "l", // For log/ln
        "q", // For sqrt
        "^", // For x^y
      ];

      if (validKeys.includes(key)) {
        event.preventDefault(); // Prevent default browser actions
        if (key === "Enter") {
          handleCalculatorButtonClick("=");
        } else if (key === "Backspace") {
          handleCalculatorButtonClick("Bksp");
        } else if (key === "Escape") {
          handleCalculatorButtonClick("C");
        } else if (key === "p") {
          handleCalculatorButtonClick("π");
        } else if (key === "s") {
          handleCalculatorButtonClick("sin(");
        } else if (key === "c") {
          handleCalculatorButtonClick("cos(");
        } else if (key === "t") {
          handleCalculatorButtonClick("tan(");
        } else if (key === "l") {
          // This might need more sophisticated handling if 'l' is for both log and ln,
          // but for now, we'll map to 'ln(' as 'log' is usually 'log10'
          if (inverseMode) {
            handleCalculatorButtonClick("exp("); // e^x
          } else {
            handleCalculatorButtonClick("ln("); // ln
          }
        } else if (key === "q") {
          handleCalculatorButtonClick("sqrt(");
        } else {
          handleCalculatorButtonClick(key);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedCategory,
    handleCalculatorButtonClick,
    inverseMode,
    searchInputRef,
  ]); // Added searchInputRef
  // ... existing code ...

  return (
    <div style={{ minHeight: "100vh", background: "#F5F7FA" }}>
      {/* Header - Your Color Scheme */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #E5E7EB",
          padding: "3px 24px",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" sx={{ gap: "20px", alignItems: "center" }}>
            <Box component={Link} href="/" sx={{ cursor: "pointer" }}>
              <ToolsHubsIcon width="147" />
            </Box>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "1000",
                color: theme.palette.primary.main,
                margin: 0,
              }}
            >
              Universal Unit Converter
            </h1>
          </Stack>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "30px",
              alignItems: "center",
            }}
          >
            {" "}
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: theme.palette.primary.main,
              }}
            >
              {selectedCategory}
            </h2>
            <div style={{ position: "relative", flex: "0 0 400px" }}>
              <Search
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  color: "#9CA3AF",
                }}
              />
              <input
                type="text"
                placeholder='Search calculators like "Age"' // Updated placeholder
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)} // Call handleSearch directly on change
                ref={searchInputRef} // NEW: Add ref to the search input
                className="border"
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 40px",
                  borderColor: theme.palette.primary.main,
                  borderRadius: "12px",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            </div>
          </Box>
        </div>
      </div>

      <div
        style={{
          padding: "70px 16px 16px",
          display: "flex",
          gap: "16px",
          minHeight: "calc(100vh - 90px)",
        }}
      >
        {/* Sidebar - Your Style */}
        <div
          style={{
            width: "320px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "16px",
              maxHeight: "calc(100vh - 80px)",
              overflowY: "auto",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              "&::WebkitScrollbar": {
                display: "none",
              },
            }}
          >
            {searchQuery ? (
              // If a search query is active, render only the filtered categories
              <div style={{ paddingTop: "8px" }}>
                {filteredCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background:
                        selectedCategory === category
                          ? "#DBEAFE"
                          : "transparent",
                      color: theme.palette.primary.main,
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      textAlign: "left",
                      marginBottom: "4px",
                      fontSize: "13px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCategory !== category) {
                        e.target.style.background = "#DBEAFE";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== category) {
                        e.target.style.background = "transparent";
                      }
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            ) : (
              // If no search query, render category groups as before
              Object.entries(categoryGroups)
                .filter(([group, categories]) => {
                  const lowerCaseQuery = searchQuery.toLowerCase();
                  if (!lowerCaseQuery) return true;
                  if (group.toLowerCase().includes(lowerCaseQuery)) return true;
                  return categories.some((category) =>
                    filteredCategories.includes(category)
                  );
                })
                .map(([group, categories]) => (
                  <div key={group} style={{ marginBottom: "8px" }}>
                    <button
                      onClick={() => toggleGroup(group)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        background:
                          "radial-gradient(278.82% 508.63% at -133.28% -141.92%, rgba(204, 230, 230, 0.93) 0%, #09123A 70%, #80C0C0 100%)",
                        color: theme.palette.primary.fourthMain,
                        border: "none",
                        borderRadius: "12px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                      }}
                    >
                      {group}
                      {expandedGroups[group] || searchQuery.length > 0 ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                    {(expandedGroups[group] || searchQuery.length > 0) && (
                      <div style={{ paddingTop: "8px" }}>
                        {categories
                          .filter((category) =>
                            filteredCategories.includes(category)
                          )
                          .map((category) => (
                            <button
                              key={category}
                              onClick={() => handleCategoryChange(category)}
                              style={{
                                width: "100%",
                                padding: "10px 12px",
                                background:
                                  selectedCategory === category
                                    ? "#DBEAFE"
                                    : "transparent",
                                color: theme.palette.primary.main,
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                textAlign: "left",
                                marginBottom: "4px",
                                fontSize: "13px",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                if (selectedCategory !== category) {
                                  e.target.style.background = "#DBEAFE";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (selectedCategory !== category) {
                                  e.target.style.background = "transparent";
                                }
                              }}
                            >
                              {category}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Main Converter Panel */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "14px 24px",
              marginBottom: "16px",
              width:
                selectedCategory === "Scientific Calculator" ? "70%" : "100%",
            }}
          >
            {currentConverter.type === "unit" ? (
              <>
                {/* Value Input */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: theme.palette.primary.main,
                      marginBottom: "8px",
                    }}
                  >
                    Value
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^-?\d*\.?\d*e?-?\d*$/i.test(val)) {
                          setValue(val);
                        }
                      }}
                      className="border"
                      style={{
                        width: "100%",
                        padding: "12px 40px 12px 16px",
                        borderColor: "2#D1D5DB",
                        borderRadius: "12px",
                        fontSize: "18px",
                        fontWeight: "600",
                        outline: "none",
                      }}
                      placeholder="Enter value"
                      onFocus={(e) =>
                        (e.target.style.borderColor =
                          theme.palette.primary.main)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor =
                          theme.palette.primary.main)
                      }
                    />
                    {value && (
                      <button
                        onClick={() => setValue("")}
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "#F3F4F6",
                          border: "none",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <X size={14} color="#6B7280" />
                      </button>
                    )}
                  </div>
                </div>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: "end", my: "25px" }}
                >
                  {" "}
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: theme.palette.primary.main,
                        marginBottom: "8px",
                      }}
                    >
                      From
                    </label>
                    <select
                      value={fromUnit}
                      onChange={(e) => setFromUnit(e.target.value)}
                      className="border"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderColor: theme.palette.primary.main,
                        borderRadius: "12px",
                        fontSize: "16px",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      {currentConverter.units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Swap Button */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={swapUnits}
                      style={{
                        padding: "12px",
                        background: theme.palette.primary.main,
                        border: "none",
                        borderRadius: "50%",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      <ArrowRightLeft
                        size={20}
                        color={theme.palette.primary.fourthMain}
                      />
                    </button>
                  </div>
                  {/* To Unit */}
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: theme.palette.primary.main,
                        marginBottom: "8px",
                      }}
                    >
                      To
                    </label>
                    <select
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value)}
                      className="border"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderColor: theme.palette.primary.main,
                        borderRadius: "12px",
                        fontSize: "16px",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      {currentConverter.units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </Stack>
                {/* From Unit */}
              </>
            ) : (
              <>
                {/* Calculator Inputs (excluding Scientific Calculator) */}
                {selectedCategory !== "Scientific Calculator" &&
                  currentConverter.inputs.map((input) =>
                    input.optional &&
                    input.dependsOn &&
                    calculatorValues[input.dependsOn] !==
                      input.dependsOnValue ? null : (
                      <div key={input.name} style={{ marginBottom: "20px" }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: theme.palette.primary.main,
                            marginBottom: "8px",
                          }}
                        >
                          {input.name}{" "}
                          {input.unit && input.unit !== "select"
                            ? `(${input.unit})`
                            : ""}
                        </label>
                        {input.unit === "select" ? (
                          <select
                            value={
                              calculatorValues[input.name] || input.options[0]
                            }
                            onChange={(e) =>
                              handleCalculatorInputChange(
                                input.name,
                                e.target.value
                              )
                            }
                            className="border"
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              borderColor: theme.palette.primary.main,
                              borderRadius: "12px",
                              fontSize: "16px",
                              outline: "none",
                            }}
                          >
                            {/* Render timezones if available and for Time Zone Converter */}
                            {input.name === "From Time Zone" ||
                            input.name === "To Time Zone"
                              ? timeZoneLoading
                                ? [
                                    <option key="loading" value="">
                                      Loading time zones...
                                    </option>,
                                  ]
                                : timeZoneError
                                ? [
                                    <option key="error" value="">
                                      Error loading time zones
                                    </option>,
                                  ]
                                : timezones.map((tz) => (
                                    <option key={tz} value={tz}>
                                      {tz}
                                    </option>
                                  ))
                              : // Original options rendering for other select inputs
                                input.options.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                          </select>
                        ) : (
                          <input
                            type={
                              (input.unit && input.unit.includes("date")) ||
                              (input.unit && input.unit.includes("time"))
                                ? input.unit
                                : input.unit === "number"
                                ? "number"
                                : "text" // Explicitly set type to number for numerical inputs
                            }
                            value={calculatorValues[input.name] || ""}
                            onChange={(e) =>
                              handleCalculatorInputChange(
                                input.name,
                                e.target.value
                              )
                            }
                            className="border"
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              borderColor: theme.palette.primary.main,
                              borderRadius: "12px",
                              color: theme.palette.primary.main,
                              fontSize: "16px",
                              outline: "none",
                            }}
                            placeholder={`Enter ${input.name}`}
                          />
                        )}
                      </div>
                    )
                  )}
              </>
            )}

            {/* Main Result / Calculator Display Area */}
            <div
              style={{
                background: "#09123aea",
                borderRadius: "16px",
                padding: "24px",
                color: "#fff",
                position: "relative",

                cursor:
                  selectedCategory === "Scientific Calculator"
                    ? "default"
                    : "pointer", // No copy on click for calculator
              }}
              onClick={() => {
                if (selectedCategory !== "Scientific Calculator") {
                  // Only copy on click for non-calculator types
                  const textToCopy =
                    currentConverter.type === "unit"
                      ? `${formatNumber(mainResult)} ${toUnit}`
                      : String(calculatorResult).replace(/<[^>]*>?/gm, "");
                  copyToClipboard(textToCopy);
                }
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.9,
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                {currentConverter.type === "unit"
                  ? "Result"
                  : selectedCategory === "Scientific Calculator"
                  ? "Calculator Output"
                  : "Calculation Result"}
              </div>
              {selectedCategory === "Scientific Calculator" && (
                <button
                  onClick={() => {
                    const textToCopy =
                      calcResult !== null && calcResult !== "Error"
                        ? String(calcResult)
                        : calcCurrentInput;
                    copyToClipboard(textToCopy);
                  }}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 10,
                    padding: "12px",
                    background:
                      "radial-gradient(278.82% 508.63% at -133.28% -141.92%, rgba(204, 230, 230, 0.93) 0%, #09123A 50%, #80C0C0 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#3B82F6")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#1E3A8A")
                  }
                >
                  <Copy size={18} /> Copy Calculation
                </button>
              )}
              <div
                style={{
                  fontSize:
                    selectedCategory === "Scientific Calculator"
                      ? "1.2em"
                      : "36px", // Smaller font for expression
                  opacity:
                    selectedCategory === "Scientific Calculator" ? 0.7 : 0.9,
                  wordBreak: "break-all",
                  marginBottom:
                    selectedCategory === "Scientific Calculator"
                      ? "5px"
                      : "8px",
                }}
              >
                {selectedCategory === "Scientific Calculator"
                  ? calcExpression
                  : ""}
              </div>
              <div
                style={{
                  fontSize:
                    selectedCategory === "Scientific Calculator"
                      ? "2.5em"
                      : "36px",
                  fontWeight: "bold",
                  wordBreak: "break-all",
                }}
              >
                {currentConverter.type === "unit"
                  ? ratesLoading && selectedCategory === "Currency Converter"
                    ? "Loading rates..."
                    : ratesError && selectedCategory === "Currency Converter"
                    ? ratesError
                    : formatNumber(mainResult)
                  : selectedCategory === "Scientific Calculator"
                  ? calcResult !== null && calcResult !== "Error"
                    ? formatNumber(calcResult)
                    : formatNumber(calcCurrentInput)
                  : (() => {
                      const resultText = String(calculatorResult); // Ensure it's a string
                      if (
                        selectedCategory === "Time Zone Converter" &&
                        timeZoneLoading
                      ) {
                        return "Loading time zones...";
                      }
                      if (
                        selectedCategory === "Time Zone Converter" &&
                        timeZoneError
                      ) {
                        return timeZoneError;
                      }
                      if (resultText.includes("\n")) {
                        return resultText.split("\n").map((line, index) => {
                          const parts = line.split(":");
                          return (
                            <div key={index}>
                              <span
                                style={{
                                  color: theme.palette.secondary.fifthMain,
                                  marginRight: "8px",
                                }}
                              >
                                {parts[0]}:
                              </span>
                              <span style={{ color: "#fff" }}>
                                {parts.slice(1).join(":")}
                              </span>
                            </div>
                          );
                        });
                      } else if (resultText.includes(":")) {
                        // Handle single line "Label: Value"
                        const parts = resultText.split(":");
                        return (
                          <div>
                            <span
                              style={{ color: "#93C5FD", marginRight: "8px" }}
                            >
                              {parts[0]}:
                            </span>
                            <span style={{ color: "#fff" }}>
                              {parts.slice(1).join(":")}
                            </span>
                          </div>
                        );
                      } else {
                        return formatNumber(calculatorResult); // Fallback for other single-line outputs (e.g., "Invalid Input")
                      }
                    })()}
              </div>
              <div
                style={{
                  fontSize: "18px",
                  opacity: 0.9,
                  color: currentConverter.type === "unit" ? "#93C5FD" : "#fff", // Apply color to unit
                }}
              >
                {currentConverter.type === "unit" &&
                !ratesLoading &&
                !ratesError
                  ? toUnit
                  : ""}
              </div>
              {showCopyMessage && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    background: "rgba(0,0,0,0.7)",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontSize: "12px",
                  }}
                >
                  Copied!
                </div>
              )}
              {(currentConverter.type !== "unit" ||
                (currentConverter.type === "unit" && mainResult)) &&
                selectedCategory !== "Scientific Calculator" && (
                  <button
                    onClick={() => {
                      const textToCopy =
                        currentConverter.type === "unit"
                          ? `${formatNumber(mainResult)} ${toUnit}`
                          : String(calculatorResult).replace(/<[^>]*>?/gm, "");
                      copyToClipboard(textToCopy);
                    }}
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,

                      padding: "12px",
                      background:
                        "radial-gradient(278.82% 508.63% at -133.28% -141.92%, rgba(204, 230, 230, 0.93) 0%, #09123A 50%, #80C0C0 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "background-color 0.2s",
                    }}
                    // onMouseEnter={(e) =>
                    //   (e.target.style.backgroundColor = "#3B82F6")
                    // }
                    // onMouseLeave={(e) =>
                    //   (e.target.style.backgroundColor = "#1E3A8A")
                    // }
                  >
                    <Copy size={18} /> Copy Result
                  </button>
                )}
            </div>

            {/* Scientific Calculator Buttons */}
            {/* Scientific Calculator Buttons - Google Style */}
            {selectedCategory === "Scientific Calculator" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginTop: "16px",
                }}
              >
                {/* First Row: Rad, Deg, xl, (, ), %, AC */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "8px",
                  }}
                >
                  {[
                    // { label: "Rad", value: "Rad", type: "mode" },
                    // { label: "Deg", value: "Deg", type: "mode" },
                    { label: "x²", value: "x²", type: "utility" },
                    { label: "x!", value: "!", type: "operator" }, // Factorial not implemented yet
                    { label: "(", value: "(", type: "paren" },
                    { label: ")", value: ")", type: "paren" },
                    { label: "AC", value: "AC", type: "clear" },
                    { label: "Bksp", value: "Bksp", type: "clear" },
                    { label: "÷", value: "/", type: "operator" },
                  ].map((btn) => (
                    <button
                      key={btn.value}
                      style={{
                        padding: "18px 8px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "none",
                        background: theme.palette.primary.main,
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: "500",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.target.style.background =
                          theme.palette.secondary.secondMain),
                          (e.target.style.color = theme.palette.primary.main);
                      }}
                      onMouseLeave={(e) => {
                        (e.target.style.background =
                          theme.palette.primary.main),
                          (e.target.style.color =
                            theme.palette.primary.fourthMain);
                      }}
                      onClick={() => {
                        if (btn.value === "AC") {
                          handleCalculatorButtonClick("C");
                        } else if (btn.type === "mode") {
                          handleCalculatorButtonClick(btn.value);
                        } else if (btn.value === "!") {
                          handleCalculatorButtonClick(btn.value);
                        } else {
                          handleCalculatorButtonClick(btn.value);
                        }
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Second Row: Inv, sin, ln, 7, 8, 9, ÷ */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "8px",
                  }}
                >
                  {[
                    // { label: "Inv", value: "Inv", type: "mode" },
                    { label: "%", value: "%", type: "operator" },
                    {
                      label: inverseMode ? "sin⁻¹" : "sin",
                      value: "sin(",
                      type: "function",
                    },
                    {
                      label: inverseMode ? "eˣ" : "ln",
                      value: inverseMode ? "exp(" : "ln(",
                      type: "function",
                    },
                    { label: "7", value: "7", type: "number" },
                    { label: "8", value: "8", type: "number" },
                    { label: "9", value: "9", type: "number" },
                    { label: "+", value: "+", type: "operator" },
                  ].map((btn) => (
                    <button
                      key={btn.value}
                      style={{
                        padding: "18px 8px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "none",
                        background: theme.palette.primary.main,
                        // btn.value === "/"
                        //   ? "#1E3A8A"
                        //   : btn.value === "Inv"
                        //   ? inverseMode
                        //     ? "#80C0C0"
                        //     : "#2D3E5F"
                        //   : ["7", "8", "9"].includes(btn.value)
                        //   ? "#3A4A5C"
                        //   : "#2D3E5F",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: ["7", "8", "9"].includes(btn.value)
                          ? "normal"
                          : "500",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.target.style.background =
                          theme.palette.secondary.secondMain),
                          (e.target.style.color = theme.palette.primary.main);
                      }}
                      onMouseLeave={(e) => {
                        (e.target.style.background =
                          theme.palette.primary.main),
                          (e.target.style.color =
                            theme.palette.primary.fourthMain);
                      }}
                      onClick={() => {
                        handleCalculatorButtonClick(btn.value);
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Third Row: π, cos, log, 4, 5, 6, × */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "8px",
                  }}
                >
                  {[
                    { label: "π", value: "π", type: "value" },
                    {
                      label: inverseMode ? "cos⁻¹" : "cos",
                      value: "cos(",
                      type: "function",
                    },
                    {
                      label: inverseMode ? "10ˣ" : "log",
                      value: inverseMode ? "pow(10," : "log(",
                      type: "function",
                    },
                    { label: "4", value: "4", type: "number" },
                    { label: "5", value: "5", type: "number" },
                    { label: "6", value: "6", type: "number" },
                    { label: "×", value: "*", type: "operator" },
                  ].map((btn) => (
                    <button
                      key={btn.value}
                      style={{
                        padding: "18px 8px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "none",
                        // background: btn.value === "*" ? "#1E3A8A" : "#3A4A5C",
                        background: theme.palette.primary.main,
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: ["4", "5", "6"].includes(btn.value)
                          ? "normal"
                          : "500",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.target.style.background =
                          theme.palette.secondary.secondMain),
                          (e.target.style.color = theme.palette.primary.main);
                      }}
                      onMouseLeave={(e) => {
                        (e.target.style.background =
                          theme.palette.primary.main),
                          (e.target.style.color =
                            theme.palette.primary.fourthMain);
                      }}
                      onClick={() => {
                        handleCalculatorButtonClick(btn.value);
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Fourth Row: e, tan, √, 1, 2, 3, − */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "8px",
                  }}
                >
                  {[
                    { label: "e", value: "Math.E", type: "value" }, // Euler's number
                    {
                      label: inverseMode ? "tan⁻¹" : "tan",
                      value: "tan(",
                      type: "function",
                    },
                    { label: "√", value: "sqrt(", type: "function" },
                    { label: "1", value: "1", type: "number" },
                    { label: "2", value: "2", type: "number" },
                    { label: "3", value: "3", type: "number" },
                    { label: "−", value: "-", type: "operator" },
                  ].map((btn) => (
                    <button
                      key={btn.value}
                      style={{
                        padding: "18px 8px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "none",
                        background: theme.palette.primary.main,
                        // background: btn.value === "-" ? "#1E3A8A" : "#3A4A5C",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: ["1", "2", "3"].includes(btn.value)
                          ? "normal"
                          : "500",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.target.style.background =
                          theme.palette.secondary.secondMain),
                          (e.target.style.color = theme.palette.primary.main);
                      }}
                      onMouseLeave={(e) => {
                        (e.target.style.background =
                          theme.palette.primary.main),
                          (e.target.style.color =
                            theme.palette.primary.fourthMain);
                      }}
                      onClick={() => {
                        handleCalculatorButtonClick(btn.value);
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Fifth Row: Ans, EXP, x^y, 0, ., =, + */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "8px",
                  }}
                >
                  {[
                    { label: "Ans", value: "Ans", type: "memory" }, // Answer recall
                    { label: "EXP", value: "exp(", type: "function" }, // e^x, same as inverse ln
                    { label: "xʸ", value: "^", type: "operator" },
                    { label: "0", value: "0", type: "number", span: 2 },
                    { label: ".", value: ".", type: "number" },
                    { label: "=", value: "=", type: "equals" },
                  ].map((btn) => (
                    <button
                      key={btn.value}
                      style={{
                        padding: "18px 8px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "none",
                        background: theme.palette.primary.main,
                        // btn.value === "=" || btn.value === "+"
                        //   ? "#1E3A8A"
                        //   : btn.value === "0"
                        //   ? "#3A4A5C"
                        //   : "#2D3E5F",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight:
                          btn.value === "0" || btn.value === "."
                            ? "normal"
                            : "500",
                        transition: "all 0.2s",
                        gridColumn: btn.span ? `span ${btn.span}` : "auto",
                      }}
                      onMouseEnter={(e) => {
                        (e.target.style.background =
                          theme.palette.secondary.secondMain),
                          (e.target.style.color = theme.palette.primary.main);
                      }}
                      onMouseLeave={(e) => {
                        (e.target.style.background =
                          theme.palette.primary.main),
                          (e.target.style.color =
                            theme.palette.primary.fourthMain);
                      }}
                      onClick={() => {
                        handleCalculatorButtonClick(btn.value);
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Advanced Row: 1/x, x², Bksp */}
                {/* <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "8px",
                  }}
                >
                  {[
                    { label: "1/x", value: "1/x", type: "utility" },

                  
                  ].map((btn) => (
                    <button
                      key={btn.value}
                      style={{
                        padding: "12px 8px",
                        fontSize: "0.9em",
                        borderRadius: "8px",
                        border: "none",
                        background:
                          btn.value === "Bksp" ? "#1E3A8A" : "#2D3E5F",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: "500",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
                      onMouseLeave={(e) => (e.target.style.opacity = "1")}
                      onClick={() => {
                        handleCalculatorButtonClick(btn.value);
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div> */}
              </div>
            )}
          </div>
        </div>

        {/* Results Table */}
        {currentConverter.type === "unit" && showAllResults && (
          <div style={{ width: "390px", flexShrink: 0 }}>
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "16px",
                maxHeight: "calc(100vh - 80px)",
                overflowY: "auto",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                "&::WebkitScrollbar": {
                  display: "none",
                },
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: theme.palette.primary.main,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    margin: 0,
                  }}
                >
                  All Conversions
                </h3>
                <button
                  onClick={() => setShowAllResults(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                >
                  <X size={18} color="#6B7280" />
                </button>
              </div>
              <div>
                {allResults.map(({ unit, value: val }) => (
                  <div
                    key={unit}
                    style={{
                      padding: "12px",
                      marginBottom: "8px",
                      borderRadius: "12px",
                      background: unit === toUnit ? "#DBEAFE" : "#F9FAFB",
                      border:
                        unit === toUnit
                          ? "2px solid #1E3A8A"
                          : "1px solid #E5E7EB",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "500",
                          color: "#374151",
                          fontSize: "14px",
                        }}
                      >
                        {unit}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#111827",
                          color: "#111827",
                          fontWeight: "600",
                          textAlign: "right",
                          wordBreak: "break-all",
                        }}
                      >
                        {formatNumber(val)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentConverter.type === "unit" && !showAllResults && (
          <button
            onClick={() => setShowAllResults(true)}
            style={{
              position: "fixed",
              right: "20px",
              top: "80px",
              background: theme.palette.primary.main,
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "56px",
              height: "56px",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronDown size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
