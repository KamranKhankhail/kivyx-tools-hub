// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   ArrowRightLeft,
//   Star,
//   History,
//   X,
//   ChevronDown,
//   ChevronUp,
//   Copy, // Import Copy icon for the copy button
// } from "lucide-react";
// import { Box, Stack } from "@mui/material";
// import Link from "next/link";
// import ToolsHubsIcon from "@/icons/ToolsHubsIcon";
// import theme from "@/styles/theme";
// import ThemeRegistry from "@/styles/ThemeRegistry";

// // Helper to parse time strings (HH:MM) into Date objects
// const parseTime = (timeString) => {
//   if (!timeString || !timeString.includes(":")) return new Date(NaN); // Handle invalid time format
//   const [hours, minutes] = timeString.split(":").map(Number);
//   if (
//     isNaN(hours) ||
//     isNaN(minutes) ||
//     hours < 0 ||
//     hours > 23 ||
//     minutes < 0 ||
//     minutes > 59
//   ) {
//     return new Date(NaN); // Invalid hour/minute values
//   }
//   const d = new Date(); // Use current date, only time matters here for comparison
//   d.setHours(hours, minutes, 0, 0);
//   return d;
// };

// // ===== COMPLETE CONVERSION LOGIC WITH ALL YOUR CONVERTERS =====
// const converters = {
//   "Length / Distance": {
//     units: ["m", "cm", "mm", "km", "in", "ft", "yd", "mi"],
//     factors: {
//       m: 1,
//       cm: 0.01,
//       mm: 0.001,
//       km: 1000,
//       in: 0.0254,
//       ft: 0.3048,
//       yd: 0.9144,
//       mi: 1609.34,
//     },
//     type: "unit",
//   },
//   "Weight / Mass": {
//     units: ["kg", "g", "mg", "t", "lb", "oz"],
//     factors: {
//       kg: 1,
//       g: 0.001,
//       mg: 0.000001,
//       t: 1000,
//       lb: 0.453592,
//       oz: 0.0283495,
//     },
//     type: "unit",
//   },
//   Temperature: {
//     units: ["°C", "°F", "K"],
//     convert: (value, from, to) => {
//       let celsius;
//       if (from === "°C") celsius = value;
//       else if (from === "°F") celsius = ((value - 32) * 5) / 9;
//       else if (from === "K") celsius = value - 273.15;
//       else return NaN;

//       if (to === "°C") return celsius;
//       if (to === "°F") return (celsius * 9) / 5 + 32;
//       if (to === "K") return celsius + 273.15;
//       return NaN;
//     },
//     type: "unit",
//   },
//   Area: {
//     units: ["m²", "cm²", "km²", "ha", "ac", "ft²", "in²"],
//     factors: {
//       "m²": 1,
//       "cm²": 0.0001,
//       "km²": 1e6,
//       ha: 10000,
//       ac: 4046.86,
//       "ft²": 0.092903,
//       "in²": 0.00064516,
//     },
//     type: "unit",
//   },
//   Volume: {
//     units: ["L", "mL", "m³", "gal", "qt", "pt", "fl oz"],
//     factors: {
//       L: 1,
//       mL: 0.001,
//       "m³": 1000,
//       gal: 3.78541,
//       qt: 0.946353,
//       pt: 0.473176,
//       "fl oz": 0.0295735,
//     },
//     type: "unit",
//   },
//   Speed: {
//     units: ["m/s", "km/h", "mph", "kn", "ft/s"],
//     factors: {
//       "m/s": 1,
//       "km/h": 0.277778,
//       mph: 0.44704,
//       kn: 0.514444,
//       "ft/s": 0.3048,
//     },
//     type: "unit",
//   },
//   Time: {
//     units: ["s", "ms", "min", "h", "day", "week", "year"],
//     factors: {
//       s: 1,
//       ms: 0.001,
//       min: 60,
//       h: 3600,
//       day: 86400,
//       week: 604800,
//       year: 31536000,
//     },
//     type: "unit",
//   },
//   Pressure: {
//     units: ["Pa", "kPa", "bar", "atm", "psi", "mmHg"],
//     factors: {
//       Pa: 1,
//       kPa: 1000,
//       bar: 100000,
//       atm: 101325,
//       psi: 6894.76,
//       mmHg: 133.322,
//     },
//     type: "unit",
//   },
//   "Energy / Heat": {
//     units: ["J", "kJ", "cal", "kcal", "Wh", "kWh", "BTU"],
//     factors: {
//       J: 1,
//       kJ: 1000,
//       cal: 4.184,
//       kcal: 4184,
//       Wh: 3600,
//       kWh: 3600000,
//       BTU: 1055.06,
//     },
//     type: "unit",
//   },
//   Power: {
//     units: ["W", "kW", "MW", "hp", "BTU/h"],
//     factors: { W: 1, kW: 1000, MW: 1000000, hp: 745.7, "BTU/h": 0.293071 },
//     type: "unit",
//   },
//   Force: {
//     units: ["N", "kN", "lbf", "dyn"],
//     factors: { N: 1, kN: 1000, lbf: 4.44822, dyn: 0.00001 },
//     type: "unit",
//   },
//   Angle: {
//     units: ["rad", "deg", "grad", "rev"],
//     factors: {
//       rad: 1,
//       deg: Math.PI / 180,
//       grad: Math.PI / 200,
//       rev: 2 * Math.PI,
//     },
//     type: "unit",
//   },
//   Density: {
//     units: ["kg/m³", "g/cm³", "lb/ft³"],
//     factors: { "kg/m³": 1, "g/cm³": 1000, "lb/ft³": 16.0185 },
//     type: "unit",
//   },
//   Torque: {
//     units: ["Nm", "lb-ft", "lb-in"],
//     factors: { Nm: 1, "lb-ft": 1.35582, "lb-in": 0.112985 },
//     type: "unit",
//   },
//   Acceleration: {
//     units: ["m/s²", "g", "ft/s²"],
//     factors: { "m/s²": 1, g: 9.80665, "ft/s²": 0.3048 },
//     type: "unit",
//   },
//   "Data Storage": {
//     units: ["B", "KB", "MB", "GB", "TB", "PB"],
//     factors: {
//       B: 1,
//       KB: 1024,
//       MB: 1024 ** 2,
//       GB: 1024 ** 3,
//       TB: 1024 ** 4,
//       PB: 1024 ** 5,
//     },
//     type: "unit",
//   },
//   "Data Transfer Rate": {
//     units: ["bps", "Kbps", "Mbps", "Gbps", "MB/s"],
//     factors: {
//       bps: 1,
//       Kbps: 1000,
//       Mbps: 1000000,
//       Gbps: 1000000000,
//       "MB/s": 8000000,
//     },
//     type: "unit",
//   },
//   Frequency: {
//     units: ["Hz", "kHz", "MHz", "GHz"],
//     factors: { Hz: 1, kHz: 1000, MHz: 1000000, GHz: 1000000000 },
//     type: "unit",
//   },
//   "Bit/Byte Converter": {
//     units: ["bit", "byte"],
//     factors: { bit: 1, byte: 8 },
//     type: "unit",
//   },
//   "Electric Voltage": {
//     units: ["V", "mV", "kV"],
//     factors: { V: 1, mV: 0.001, kV: 1000 },
//     type: "unit",
//   },
//   "Electric Current": {
//     units: ["A", "mA", "kA"],
//     factors: { A: 1, mA: 0.001, kA: 1000 },
//     type: "unit",
//   },
//   "Electric Resistance": {
//     units: ["Ω", "kΩ", "MΩ"],
//     factors: { Ω: 1, kΩ: 1000, MΩ: 1000000 },
//     type: "unit",
//   },
//   "Electric Power": {
//     units: ["W", "kW", "MW"],
//     factors: { W: 1, kW: 1000, MW: 1000000 },
//     type: "unit",
//   },
//   Capacitance: {
//     units: ["F", "μF", "pF"],
//     factors: { F: 1, μF: 0.000001, pF: 0.000000000001 },
//     type: "unit",
//   },
//   Inductance: {
//     units: ["H", "mH", "μH"],
//     factors: { H: 1, mH: 0.001, μH: 0.000001 },
//     type: "unit",
//   },
//   "Electric Charge": {
//     units: ["C", "mAh"],
//     factors: { C: 1, mAh: 0.0036 },
//     type: "unit",
//   },
//   "Magnetic Field Strength": {
//     units: ["T", "G"],
//     factors: { T: 1, G: 0.0001 },
//     type: "unit",
//   },
//   Illuminance: {
//     // Lux (lx) is lumens per square meter. Lumens (lm) is luminous flux.
//     // They are not directly convertible without knowing the area or distance from light source.
//     units: ["lx", "lm"],
//     convert: () =>
//       "Requires surface area for conversion or distance from source.",
//     type: "unit",
//   },
//   "Specific Heat Capacity": {
//     units: ["J/kg·K", "cal/g·°C"],
//     factors: { "J/kg·K": 1, "cal/g·°C": 4.184 },
//     type: "unit",
//   },
//   "Fuel Efficiency": {
//     units: ["km/l", "mpg"],
//     factors: { "km/l": 1, mpg: 0.425144 },
//     type: "unit",
//   },
//   "Pace / Running Speed": {
//     units: ["km/h", "mph", "min/km", "min/mi"],
//     convert: (value, from, to) => {
//       let kmh;
//       if (from === "km/h") kmh = value;
//       else if (from === "mph") kmh = value * 1.60934;
//       else if (from === "min/km") kmh = 60 / value;
//       else if (from === "min/mi") kmh = (60 / value) * 1.60934;
//       else return NaN;

//       if (to === "km/h") return kmh;
//       if (to === "mph") return kmh / 1.60934;
//       if (to === "min/km") return 60 / kmh;
//       if (to === "min/mi") return 96.5606 / kmh;
//       return NaN;
//     },
//     type: "unit",
//   },
//   "Cooking Volume": {
//     units: ["ml", "cup", "tbsp", "tsp", "L"],
//     factors: { ml: 1, cup: 236.588, tbsp: 14.7868, tsp: 4.92892, L: 1000 },
//     type: "unit",
//   },
//   "Cooking Weight": {
//     units: ["g", "oz", "lb"],
//     factors: { g: 1, oz: 28.3495, lb: 453.592 },
//     type: "unit",
//   },
//   "Oven Temperature": {
//     units: ["°C", "°F", "Gas Mark"],
//     convert: (value, from, to) => {
//       let celsius;
//       if (from === "°C") celsius = value;
//       else if (from === "°F") celsius = ((value - 32) * 5) / 9;
//       else if (from === "Gas Mark") {
//         if (value === 0) celsius = 110;
//         else if (value === 0.5) celsius = 120;
//         else if (value === 1) celsius = 140;
//         else if (value === 2) celsius = 150;
//         else if (value === 3) celsius = 170;
//         else if (value === 4) celsius = 180;
//         else if (value === 5) celsius = 190;
//         else if (value === 6) celsius = 200;
//         else if (value === 7) celsius = 220;
//         else if (value === 8) celsius = 230;
//         else if (value === 9) celsius = 240;
//         else celsius = value * 14 + 121;
//       } else return NaN;

//       if (to === "°C") return celsius;
//       if (to === "°F") return (celsius * 9) / 5 + 32;
//       if (to === "K") return celsius + 273.15;
//       if (to === "Gas Mark") {
//         if (celsius <= 110) return 0;
//         if (celsius <= 120) return 0.5;
//         if (celsius <= 140) return 1;
//         if (celsius <= 150) return 2;
//         if (celsius <= 170) return 3;
//         if (celsius <= 180) return 4;
//         if (celsius <= 190) return 5;
//         if (celsius <= 200) return 6;
//         if (celsius <= 220) return 7;
//         if (celsius <= 230) return 8;
//         if (celsius <= 240) return 9;
//         return (celsius - 121) / 14;
//       }
//       return NaN;
//     },
//     type: "unit",
//   },
//   "Engine Power": {
//     units: ["kW", "HP"],
//     factors: { kW: 1, HP: 0.7457 },
//     type: "unit",
//   },
//   Concentration: {
//     units: ["mol/L", "%", "ppm"],
//     convert: (value, from, to) => {
//       let molL;
//       if (from === "mol/L") molL = value;
//       else if (from === "%") molL = value / 100;
//       else if (from === "ppm") molL = value * 0.000001;
//       else return NaN;

//       if (to === "mol/L") return molL;
//       if (to === "%") return molL * 100;
//       if (to === "ppm") return molL / 0.000001;
//       return NaN;
//     },
//     type: "unit",
//   },
//   "Radiation Units": {
//     units: ["Gy", "Sv"],
//     factors: { Gy: 1, Sv: 1 },
//     type: "unit",
//   },
//   "Shoe Size Converter": {
//     units: ["US", "EU", "UK", "Asia (cm)"],
//     convert: (value, from, to) => {
//       let us;
//       if (from === "US") us = value;
//       else if (from === "EU") us = value - 33;
//       else if (from === "UK") us = value + 1;
//       else if (from === "Asia (cm)") us = (value - 15) / 2.54;
//       else return NaN;

//       if (to === "US") return us;
//       if (to === "EU") return us + 33;
//       if (to === "UK") return us - 1;
//       if (to === "Asia (cm)") return us * 2.54 + 15;
//       return NaN;
//     },
//     type: "unit",
//   },
//   "Clothing Size Converter": {
//     units: ["US", "EU", "UK"],
//     convert: (value, from, to) => {
//       let us;
//       if (from === "US") us = value;
//       else if (from === "EU") us = value - 32;
//       else if (from === "UK") us = value - 4;
//       else return NaN;

//       if (to === "US") return us;
//       if (to === "EU") return us + 32;
//       if (to === "UK") return us + 4;
//       return NaN;
//     },
//     type: "unit",
//   },
//   // B. Digital & Computer Converters
//   "File Size Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Duration", unit: "seconds" },
//       { name: "Bitrate", unit: "bps" },
//       { name: "Size", unit: "bits" },
//     ],
//   },

//   // C. Financial & Business Converters
//   "Currency Converter": {
//     type: "unit",
//     api: true,
//     units: ["USD", "EUR", "GBP", "JPY", "PKR", "CAD", "AUD", "INR"],
//     convert: (value, from, to) => "Requires live API rates for conversion.",
//   },
//   "Loan / EMI Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Principal Amount", unit: "currency" },
//       { name: "Annual Interest Rate", unit: "%" },
//       { name: "Loan Tenure", unit: "months" },
//     ],
//   },
//   "Interest Rate Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Principal", unit: "currency" },
//       { name: "Rate", unit: "% per period" },
//       { name: "Time", unit: "periods" },
//     ],
//   },
//   "Discount Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Original Price", unit: "currency" },
//       { name: "Discount Percentage", unit: "%" },
//     ],
//   },
//   "Sales Tax / VAT Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Net Price", unit: "currency" },
//       { name: "Tax Rate", unit: "%" },
//     ],
//   },
//   "Investment Return Calculator (ROI)": {
//     type: "calculator",
//     inputs: [
//       { name: "Initial Investment", unit: "currency" },
//       { name: "Final Value", unit: "currency" },
//     ],
//   },

//   // D. Engineering & Science Converters
//   "Fuel Consumption Cost Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Distance", unit: "km" },
//       { name: "Fuel Efficiency", unit: "km/L" },
//       { name: "Fuel Price", unit: "currency/L" },
//     ],
//   },

//   // E. Construction & Material Converters
//   "Concrete Volume Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Length", unit: "m" },
//       { name: "Width", unit: "m" },
//       { name: "Depth", unit: "m" },
//     ],
//   },
//   "Lumber / Wood Board Feet": {
//     type: "calculator",
//     inputs: [
//       { name: "Thickness", unit: "inches" },
//       { name: "Width", unit: "inches" },
//       { name: "Length", unit: "feet" },
//       { name: "Quantity", unit: "pieces" },
//     ],
//   },
//   "Steel Weight Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Length", unit: "m" },
//       { name: "Width", unit: "m" },
//       { name: "Height", unit: "m" },
//     ],
//   },
//   "Tile & Flooring Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Room Length", unit: "m" },
//       { name: "Room Width", unit: "m" },
//       { name: "Tile Length", unit: "cm" },
//       { name: "Tile Width", unit: "cm" },
//       { name: "Grout Gap", unit: "mm" },
//       { name: "Waste Percentage", unit: "%" },
//     ],
//   },
//   "Paint Coverage Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Wall Length", unit: "m" },
//       { name: "Wall Height", unit: "m" },
//       { name: "Number of Coats", unit: "coats" },
//       { name: "Coverage per Liter", unit: "m²/L" },
//     ],
//   },

//   // F. Health, Fitness & Nutrition
//   "BMI Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Weight", unit: "kg" },
//       { name: "Height", unit: "m" },
//     ],
//   },
//   "Body Fat Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Weight", unit: "kg" },
//       { name: "Height", unit: "cm" },
//       { name: "Age", unit: "years" },
//       { name: "Gender", unit: "select", options: ["Male", "Female"] },
//     ],
//   },
//   "Calorie Burn Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Weight", unit: "kg" },
//       {
//         name: "Activity Type",
//         unit: "select",
//         options: [
//           "Running",
//           "Walking",
//           "Cycling",
//           "Swimming",
//           "Aerobics",
//           "Sitting",
//           "Custom",
//         ],
//       },
//       { name: "Duration", unit: "minutes" },
//       {
//         name: "MET Value",
//         unit: "METs",
//         optional: true,
//         dependsOn: "Activity Type",
//         dependsOnValue: "Custom",
//       },
//     ],
//   },
//   "Water Intake Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Weight", unit: "kg" },
//       {
//         name: "Activity Level",
//         unit: "select",
//         options: ["Low", "Medium", "High"],
//       },
//     ],
//   },

//   // G. Cooking & Food Converters
//   "Ingredient-Specific Converter": {
//     type: "calculator",
//     inputs: [
//       { name: "Amount", unit: "value" },
//       { name: "Ingredient", unit: "text" },
//       { name: "From Unit", unit: "text" },
//       { name: "To Unit", unit: "text" },
//     ],
//     calculate: () =>
//       "Advanced logic required for ingredient densities and conversion.",
//   },

//   // H. Transport & Automotive Converters
//   "Mileage / Distance Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Start Odometer", unit: "km" },
//       { name: "End Odometer", unit: "km" },
//       { name: "Fuel Used", unit: "Liters" },
//       { name: "Fuel Price", unit: "currency/L" },
//     ],
//   },
//   "Tire Size Converter": {
//     type: "calculator",
//     inputs: [
//       { name: "Tire Width", unit: "mm" },
//       { name: "Aspect Ratio", unit: "%" },
//       { name: "Rim Diameter", unit: "inches" },
//     ],
//   },

//   // I. Physics & Chemistry Converters
//   "Molar Mass Calculator": {
//     type: "calculator",
//     inputs: [{ name: "Chemical Formula", unit: "text" }],
//     calculate: () =>
//       "Complex parsing of chemical formula and atomic weights required.",
//   },
//   "Pressure Drop (engineering)": {
//     type: "calculator",
//     inputs: [
//       { name: "Flow Rate", unit: "m³/s" },
//       { name: "Pipe Diameter", unit: "m" },
//       { name: "Pipe Length", unit: "m" },
//       { name: "Fluid Viscosity", unit: "Pa·s" },
//       { name: "Fluid Density", unit: "kg/m³" },
//     ],
//     calculate: () =>
//       "Complex engineering calculations required (e.g., Darcy-Weisbach equation).",
//   },

//   // J. Date, Time & Planning Tools
//   "Age Calculator": {
//     type: "calculator",
//     inputs: [{ name: "Date of Birth", unit: "date" }],
//   },
//   "Date Difference Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Start Date", unit: "date" },
//       { name: "End Date", unit: "date" },
//     ],
//   },
//   "Time Zone Converter": {
//     type: "calculator",
//     inputs: [
//       { name: "Date", unit: "date" },
//       { name: "Time", unit: "time" },
//       { name: "From Time Zone", unit: "text" },
//       { name: "To Time Zone", unit: "text" },
//     ],
//     calculate: () =>
//       "Time zone conversion requires an external API or library for accuracy.",
//   },
//   "Work Hour Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Start Time", unit: "time" },
//       { name: "End Time", unit: "time" },
//       { name: "Break Duration", unit: "minutes" },
//     ],
//   },
//   "Countdown Calculator": {
//     type: "calculator",
//     inputs: [
//       { name: "Target Date", unit: "date" },
//       { name: "Target Time", unit: "time" },
//     ],
//   },

//   // K. Miscellaneous Converters
//   "Number System Converter": {
//     type: "unit", // Keep as unit type, but with strong input validation
//     units: ["Decimal", "Binary", "Hexadecimal", "Octal"],
//     convert: (value, from, to) => {
//       let decValue;
//       try {
//         const cleanedValue = String(value).trim();
//         if (cleanedValue === "") return "Invalid input value";

//         // --- Input Validation based on 'from' unit ---
//         // Allow negative sign for decimal and hexadecimal for parseInt, but validate digits.
//         // Binary and Octal typically don't use negative signs in direct representation; handled by parseInt.
//         if (from === "Binary" && !/^-?[01]+$/.test(cleanedValue)) {
//           return "Invalid input for Binary (0s and 1s only)";
//         }
//         if (from === "Octal" && !/^-?[0-7]+$/.test(cleanedValue)) {
//           return "Invalid input for Octal (0-7 only)";
//         }
//         if (from === "Decimal" && !/^-?\d+$/.test(cleanedValue)) {
//           return "Invalid input for Decimal (digits 0-9 only)";
//         }
//         if (from === "Hexadecimal" && !/^-?[0-9A-Fa-f]+$/.test(cleanedValue)) {
//           return "Invalid input for Hexadecimal (0-9, A-F only)";
//         }
//         // --- End Input Validation ---

//         if (from === "Decimal") decValue = parseInt(cleanedValue, 10);
//         else if (from === "Binary") decValue = parseInt(cleanedValue, 2);
//         else if (from === "Hexadecimal") decValue = parseInt(cleanedValue, 16);
//         else if (from === "Octal") decValue = parseInt(cleanedValue, 8);
//         else return "Invalid 'From' unit selected"; // Should not happen with dropdown

//         if (isNaN(decValue)) return "Invalid input value after parsing"; // More specific message

//         if (to === "Decimal") return decValue.toString(10);
//         else if (to === "Binary") return decValue.toString(2);
//         else if (to === "Hexadecimal")
//           return decValue.toString(16).toUpperCase();
//         else if (to === "Octal") return decValue.toString(8);
//         return "Invalid 'To' unit selected"; // Should not happen with dropdown
//       } catch (error) {
//         return "Error in conversion: " + error.message;
//       }
//     },
//   },
//   "Text Case Converter": {
//     type: "calculator",
//     inputs: [{ name: "Text", unit: "text" }],
//   },
//   "Roman Numeral Converter": {
//     type: "calculator", // CONFIRMED: Keep as calculator type for separate inputs
//     inputs: [
//       { name: "Decimal Input", unit: "number", optional: true },
//       { name: "Roman Input", unit: "text", optional: true },
//     ],
//     calculate: (values) => {
//       const decimalInput = String(values["Decimal Input"] || "").trim(); // Ensure string, handle undefined/null
//       const romanInput = String(values["Roman Input"] || "").trim(); // Ensure string, handle undefined/null

//       const toRoman = (num) => {
//         if (!Number.isInteger(num) || num < 1 || num > 3999)
//           return "Invalid Decimal (1-3999)";
//         const numerals = {
//           1000: "M",
//           900: "CM",
//           500: "D",
//           400: "CD",
//           100: "C",
//           90: "XC",
//           50: "L",
//           40: "XL",
//           10: "X",
//           9: "IX",
//           5: "V",
//           4: "IV",
//           1: "I",
//         };
//         let result = "";
//         for (const val of Object.keys(numerals).sort((a, b) => b - a)) {
//           while (num >= parseInt(val, 10)) {
//             result += numerals[val];
//             num -= parseInt(val, 10);
//           }
//         }
//         return result;
//       };

//       const fromRoman = (roman) => {
//         const romanMap = {
//           I: 1,
//           V: 5,
//           X: 10,
//           L: 50,
//           C: 100,
//           D: 500,
//           M: 1000,
//         };
//         let num = 0;
//         const upperRoman = roman.toUpperCase();
//         if (upperRoman === "") return NaN; // Explicitly handle empty input

//         // Comprehensive validation for valid Roman characters and common invalid patterns
//         if (!/^[MDCLXVI]+$/.test(upperRoman)) return NaN; // Only valid Roman characters
//         // Invalid subtractive pairs or excessive repeats
//         if (
//           /(IIII|VV|XXXX|LL|CCCC|DD)/.test(upperRoman) || // e.g., IIII, XXXX, LLLL
//           /(I[VXLC]|X[LCDM]|C[DM])/g.test(
//             upperRoman.replace(/CD|CM|XL|XC/g, "")
//           ) // ensure only one I before V/X, one X before L/C, one C before D/M
//         ) {
//           return NaN;
//         }

//         for (let i = 0; i < upperRoman.length; i++) {
//           const current = romanMap[upperRoman[i]];
//           const next = romanMap[upperRoman[i + 1]];
//           if (current === undefined) return NaN; // Should be caught by regex, but safety check

//           if (next && current < next) {
//             if (current >= next) return NaN; // e.g., IL (I should not precede L directly, only V or X) - more refined
//             num += next - current;
//             i++;
//           } else {
//             num += current;
//           }
//         }
//         return num;
//       };

//       if (decimalInput !== "" && !isNaN(parseFloat(decimalInput))) {
//         const num = parseInt(decimalInput, 10);
//         return `Roman: ${toRoman(num)}`;
//       } else if (romanInput !== "") {
//         // Check for non-empty Roman input
//         const result = fromRoman(romanInput);
//         if (isNaN(result)) return "Invalid Roman numeral or sequence";
//         return `Decimal: ${result}`;
//       } else {
//         return ""; // No valid input provided in either field
//       }
//     },
//   },
// };

// // Group categories (no change needed here, just for context)
// const categoryGroups = {
//   "Core Daily Converters": [
//     "Length / Distance",
//     "Weight / Mass",
//     "Temperature",
//     "Area",
//     "Volume",
//     "Speed",
//     "Time",
//     "Pressure",
//     "Energy / Heat",
//     "Power",
//     "Force",
//     "Angle",
//     "Density",
//     "Torque",
//     "Acceleration",
//   ],
//   "Digital & Computer Converters": [
//     "Data Storage",
//     "Data Transfer Rate",
//     "Frequency",
//     "Bit/Byte Converter",
//     "File Size Calculator",
//   ],
//   "Financial & Business Converters": [
//     "Currency Converter",
//     "Loan / EMI Calculator",
//     "Interest Rate Calculator",
//     "Discount Calculator",
//     "Sales Tax / VAT Calculator",
//     "Investment Return Calculator (ROI)",
//   ],
//   "Engineering & Science Converters": [
//     "Electric Voltage",
//     "Electric Current",
//     "Electric Resistance",
//     "Electric Power",
//     "Capacitance",
//     "Inductance",
//     "Electric Charge",
//     "Magnetic Field Strength",
//     "Illuminance",
//     "Specific Heat Capacity",
//     "Fuel Efficiency",
//     "Fuel Consumption Cost Calculator",
//     "Concentration",
//     "Radiation Units",
//     // "Molar Mass Calculator",
//     // "Pressure Drop (engineering)",
//   ],
//   "Construction & Material Converters": [
//     "Concrete Volume Calculator",
//     "Lumber / Wood Board Feet",
//     "Steel Weight Calculator",
//     "Tile & Flooring Calculator",
//     "Paint Coverage Calculator",
//   ],
//   "Health, Fitness & Nutrition": [
//     "BMI Calculator",
//     "Body Fat Calculator",
//     "Calorie Burn Calculator",
//     "Pace / Running Speed",
//     "Water Intake Calculator",
//   ],
//   "Cooking & Food Converters": [
//     "Cooking Volume",
//     "Cooking Weight",
//     "Ingredient-Specific Converter",
//     "Oven Temperature",
//   ],
//   "Transport & Automotive Converters": [
//     "Mileage / Distance Calculator",
//     "Tire Size Converter",
//     "Engine Power",
//   ],
//   "Date, Time & Planning Tools": [
//     "Age Calculator",
//     "Date Difference Calculator",
//     "Time Zone Converter",
//     "Work Hour Calculator",
//     "Countdown Calculator",
//   ],
//   "Miscellaneous Converters": [
//     "Shoe Size Converter",
//     "Clothing Size Converter",
//     "Number System Converter",
//     "Text Case Converter",
//     "Roman Numeral Converter",
//   ],
// };

// // ===== SMART FORMATTING =====
// const formatNumber = (num) => {
//   if (
//     num === null ||
//     num === undefined ||
//     (typeof num === "string" && num.trim() === "")
//   )
//     return "";
//   if (typeof num === "string" && num.includes("\n")) return num; // Return multi-line strings directly for UI to split
//   if (typeof num === "string") return num; // Return other strings directly
//   if (isNaN(num)) return "Invalid Input";

//   const absNum = Math.abs(num);

//   if (absNum < 0.000001 && absNum !== 0) return num.toExponential(4);
//   if (absNum >= 1e9) return num.toExponential(4);
//   if (absNum < 0.01 && absNum !== 0)
//     return num.toFixed(8).replace(/\.?0+$/, "");
//   if (absNum < 1) return num.toFixed(6).replace(/\.?0+$/, "");
//   if (Math.abs(num - Math.round(num)) < 0.0001)
//     return Math.round(num).toLocaleString();

//   return num.toFixed(4).replace(/\.?0+$/, "");
// };

// // ===== CONVERSION ENGINE =====
// const convertValue = (value, from, to, categoryName) => {
//   const converter = converters[categoryName];
//   if (!converter || converter.type !== "unit") return NaN;

//   if (converter.convert) {
//     const result = converter.convert(value, from, to);
//     // If the custom convert function returns a string (like "Requires..."), return it directly
//     if (typeof result === "string") return result;
//     return isNaN(result) ? "Invalid conversion" : result;
//   }

//   const factors = converter.factors;
//   if (!factors || !factors[from] || !factors[to])
//     return "Invalid units for conversion";

//   const baseValue = value * factors[from];
//   return baseValue / factors[to];
// };

// // ===== CALCULATOR ENGINE =====
// const calculate = (categoryName, values) => {
//   const currentConverter = converters[categoryName];
//   if (!currentConverter || currentConverter.type !== "calculator") {
//     return "";
//   }

//   if (currentConverter.calculate) {
//     return currentConverter.calculate(values);
//   }

//   switch (categoryName) {
//     case "File Size Calculator": {
//       const duration = parseFloat(values.Duration);
//       const bitrate = parseFloat(values.Bitrate);
//       const size = parseFloat(values.Size);

//       const numValidInputs = [duration, bitrate, size].filter(
//         (val) => !isNaN(val)
//       ).length;
//       if (numValidInputs < 2) {
//         return ""; // Require at least two inputs to attempt any calculation
//       }

//       if (!isNaN(duration) && !isNaN(bitrate) && duration > 0 && bitrate > 0) {
//         return `Size: ${(duration * bitrate).toFixed(0)} bits`;
//       } else if (!isNaN(size) && !isNaN(bitrate) && size > 0 && bitrate > 0) {
//         return `Duration: ${(size / bitrate).toFixed(2)} seconds`;
//       } else if (!isNaN(size) && !isNaN(duration) && size > 0 && duration > 0) {
//         return `Bitrate: ${(size / duration).toFixed(2)} bps`;
//       }
//       return "Enter at least two valid positive values";
//     }

//     case "Loan / EMI Calculator": {
//       const principal = parseFloat(values["Principal Amount"]);
//       const annualRate = parseFloat(values["Annual Interest Rate"]);
//       const tenureMonths = parseFloat(values["Loan Tenure"]);

//       if (isNaN(principal) || isNaN(annualRate) || isNaN(tenureMonths))
//         return "";

//       if (principal <= 0 || annualRate < 0 || tenureMonths <= 0) {
//         return "Invalid inputs: Principal & Tenure must be > 0, Rate >= 0";
//       }

//       const monthlyRate = annualRate / 100 / 12;
//       if (monthlyRate === 0) {
//         return `EMI: ${(principal / tenureMonths).toFixed(2)}`;
//       }
//       const emi =
//         (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
//         (Math.pow(1 + monthlyRate, tenureMonths) - 1);
//       return isFinite(emi) ? `EMI: ${emi.toFixed(2)}` : "Calculation error";
//     }
//     case "Interest Rate Calculator": {
//       const principal = parseFloat(values.Principal);
//       const rate = parseFloat(values.Rate);
//       const time = parseFloat(values.Time);

//       if (isNaN(principal) || isNaN(rate) || isNaN(time)) return "";

//       if (principal <= 0 || rate < 0 || time <= 0) {
//         return "Invalid inputs: Principal & Time must be > 0, Rate >= 0";
//       }

//       const interest = (principal * rate * time) / 100; // Simple Interest
//       const finalAmount = principal + interest;
//       return `Interest: ${interest.toFixed(
//         2
//       )}\nFinal Amount: ${finalAmount.toFixed(2)}`;
//     }
//     case "Discount Calculator": {
//       const originalPrice = parseFloat(values["Original Price"]);
//       const discountPercentage = parseFloat(values["Discount Percentage"]);

//       if (isNaN(originalPrice) || isNaN(discountPercentage)) return "";

//       if (
//         originalPrice < 0 ||
//         discountPercentage < 0 ||
//         discountPercentage > 100
//       ) {
//         return "Invalid inputs: Price >= 0, Discount % between 0-100";
//       }

//       const discountAmount = originalPrice * (discountPercentage / 100);
//       const finalPrice = originalPrice - discountAmount;
//       return `Discount: ${discountAmount.toFixed(
//         2
//       )}\nFinal Price: ${finalPrice.toFixed(2)}`;
//     }
//     case "Sales Tax / VAT Calculator": {
//       const netPrice = parseFloat(values["Net Price"]);
//       const taxRate = parseFloat(values["Tax Rate"]);

//       if (isNaN(netPrice) || isNaN(taxRate)) return "";

//       if (netPrice < 0 || taxRate < 0) {
//         return "Invalid inputs: Price & Tax Rate must be >= 0";
//       }

//       const taxAmount = netPrice * (taxRate / 100);
//       const grossPrice = netPrice + taxAmount;
//       return `Tax: ${taxAmount.toFixed(2)}\nGross Price: ${grossPrice.toFixed(
//         2
//       )}`;
//     }
//     case "Investment Return Calculator (ROI)": {
//       const initialInvestment = parseFloat(values["Initial Investment"]);
//       const finalValue = parseFloat(values["Final Value"]);

//       if (isNaN(initialInvestment) || isNaN(finalValue)) return "";

//       if (initialInvestment <= 0 || finalValue < 0) {
//         return "Invalid inputs: Initial Investment > 0, Final Value >= 0";
//       }

//       const roi = ((finalValue - initialInvestment) / initialInvestment) * 100;
//       return `ROI: ${roi.toFixed(2)}%`;
//     }
//     case "Fuel Consumption Cost Calculator": {
//       const distance = parseFloat(values.Distance);
//       const fuelEfficiency = parseFloat(values["Fuel Efficiency"]);
//       const fuelPrice = parseFloat(values["Fuel Price"]);

//       if (isNaN(distance) || isNaN(fuelEfficiency) || isNaN(fuelPrice))
//         return "";

//       if (distance <= 0 || fuelEfficiency <= 0 || fuelPrice <= 0) {
//         return "Invalid inputs: All values must be > 0";
//       }

//       const fuelNeeded = distance / fuelEfficiency;
//       const totalCost = fuelNeeded * fuelPrice;
//       return `Fuel Needed: ${fuelNeeded.toFixed(
//         2
//       )} L\nTotal Cost: ${totalCost.toFixed(2)}`;
//     }
//     case "Concrete Volume Calculator": {
//       const length = parseFloat(values.Length);
//       const width = parseFloat(values.Width);
//       const depth = parseFloat(values.Depth);

//       if (isNaN(length) || isNaN(width) || isNaN(depth)) return "";

//       if (length <= 0 || width <= 0 || depth <= 0) {
//         return "Invalid inputs: All dimensions must be > 0";
//       }

//       const volume = length * width * depth;
//       return `Volume: ${volume.toFixed(2)} m³`;
//     }
//     case "Lumber / Wood Board Feet": {
//       const thickness = parseFloat(values.Thickness);
//       const width = parseFloat(values.Width);
//       const length = parseFloat(values.Length);
//       const quantity = parseFloat(values.Quantity);

//       if (isNaN(thickness) || isNaN(width) || isNaN(length) || isNaN(quantity))
//         return "";

//       if (thickness <= 0 || width <= 0 || length <= 0 || quantity <= 0) {
//         return "Invalid inputs: All values must be > 0";
//       }
//       const boardFeet = (thickness * width * length * quantity) / 12;
//       return `Board Feet: ${boardFeet.toFixed(2)}`;
//     }
//     case "Steel Weight Calculator": {
//       const length = parseFloat(values.Length);
//       const width = parseFloat(values.Width);
//       const height = parseFloat(values.Height);
//       const steelDensity = 7850; // kg/m³

//       if (isNaN(length) || isNaN(width) || isNaN(height)) return "";

//       if (length <= 0 || width <= 0 || height <= 0) {
//         return "Invalid inputs: All dimensions must be > 0";
//       }
//       const volume = length * width * height;
//       const weight = volume * steelDensity;
//       return `Weight: ${weight.toFixed(2)} kg`;
//     }
//     case "Tile & Flooring Calculator": {
//       const roomLength = parseFloat(values["Room Length"]); // m
//       const roomWidth = parseFloat(values["Room Width"]); // m
//       const tileLength = parseFloat(values["Tile Length"]); // cm
//       const tileWidth = parseFloat(values["Tile Width"]); // cm
//       const groutGap = parseFloat(values["Grout Gap"]); // mm
//       const wastePercentage = parseFloat(values["Waste Percentage"]);

//       if (
//         isNaN(roomLength) ||
//         isNaN(roomWidth) ||
//         isNaN(tileLength) ||
//         isNaN(tileWidth) ||
//         isNaN(groutGap) ||
//         isNaN(wastePercentage)
//       )
//         return "";

//       if (
//         roomLength <= 0 ||
//         roomWidth <= 0 ||
//         tileLength <= 0 ||
//         tileWidth <= 0 ||
//         groutGap < 0 ||
//         wastePercentage < 0
//       ) {
//         return "Invalid inputs: Room/Tile dimensions > 0, Grout/Waste >= 0";
//       }

//       const roomArea = roomLength * roomWidth; // m²
//       const tileArea = (tileLength / 100) * (tileWidth / 100); // convert cm to m for tile area

//       const tileLengthWithGrout = (tileLength + groutGap / 10) / 100; // cm to m
//       const tileWidthWithGrout = (tileWidth + groutGap / 10) / 100; // cm to m
//       const tileAreaWithGrout = tileLengthWithGrout * tileWidthWithGrout;

//       let tilesNeeded = roomArea / tileArea;
//       if (tileAreaWithGrout > 0) {
//         tilesNeeded = roomArea / tileAreaWithGrout;
//       }

//       const totalTiles = tilesNeeded * (1 + wastePercentage / 100);
//       return `Tiles Needed: ${Math.ceil(totalTiles)} (approx)`;
//     }
//     case "Paint Coverage Calculator": {
//       const wallLength = parseFloat(values["Wall Length"]);
//       const wallHeight = parseFloat(values["Wall Height"]);
//       const numberOfCoats = parseFloat(values["Number of Coats"]);
//       const coveragePerLiter = parseFloat(values["Coverage per Liter"]);

//       if (
//         isNaN(wallLength) ||
//         isNaN(wallHeight) ||
//         isNaN(numberOfCoats) ||
//         isNaN(coveragePerLiter)
//       )
//         return "";

//       if (
//         wallLength <= 0 ||
//         wallHeight <= 0 ||
//         numberOfCoats <= 0 ||
//         coveragePerLiter <= 0
//       ) {
//         return "Invalid inputs: All values must be > 0";
//       }

//       const wallArea = wallLength * wallHeight;
//       const totalAreaToPaint = wallArea * numberOfCoats;
//       const litersNeeded = totalAreaToPaint / coveragePerLiter;
//       return `Liters Needed: ${litersNeeded.toFixed(2)} L`;
//     }
//     case "BMI Calculator": {
//       const weight = parseFloat(values.Weight);
//       const height = parseFloat(values.Height);

//       if (isNaN(weight) || isNaN(height)) return "";

//       if (weight <= 0 || height <= 0) {
//         return "Invalid inputs: Weight & Height must be > 0";
//       }

//       const bmi = weight / (height * height);
//       let classification = "";
//       if (bmi < 18.5) classification = "Underweight";
//       else if (bmi >= 18.5 && bmi <= 24.9) classification = "Normal weight";
//       else if (bmi >= 25 && bmi <= 29.9) classification = "Overweight";
//       else classification = "Obesity";

//       return `BMI: ${bmi.toFixed(2)} (${classification})`;
//     }
//     case "Body Fat Calculator": {
//       const weightKg = parseFloat(values.Weight);
//       const heightCm = parseFloat(values.Height);
//       const age = parseFloat(values.Age);
//       const gender = (values.Gender || "").toLowerCase(); // "male" or "female"

//       if (
//         isNaN(weightKg) ||
//         isNaN(heightCm) ||
//         isNaN(age) ||
//         !(gender === "male" || gender === "female")
//       ) {
//         return "";
//       }

//       if (weightKg <= 0 || heightCm <= 0 || age <= 0) {
//         return "Invalid inputs: Weight, Height, Age must be > 0";
//       }

//       const heightM = heightCm / 100;
//       const bmi = weightKg / (heightM * heightM);

//       let bodyFatPercentage;
//       // Using the simplified Deurenberg equation for estimation based on BMI, Age, and Gender
//       if (gender === "male") {
//         bodyFatPercentage = 1.2 * bmi + 0.23 * age - 16.2;
//       } else {
//         // female
//         bodyFatPercentage = 1.2 * bmi + 0.23 * age - 5.4;
//       }

//       // Clamp values to a reasonable range
//       if (bodyFatPercentage < 5) bodyFatPercentage = 5;
//       if (bodyFatPercentage > 50) bodyFatPercentage = 50;

//       let category = "";
//       if (gender === "male") {
//         if (bodyFatPercentage <= 5) category = "Essential Fat";
//         else if (bodyFatPercentage <= 13) category = "Athletes";
//         else if (bodyFatPercentage <= 17) category = "Fitness";
//         else if (bodyFatPercentage <= 24) category = "Average";
//         else category = "Obese";
//       } else {
//         // female
//         if (bodyFatPercentage <= 13) category = "Essential Fat";
//         else if (bodyFatPercentage <= 20) category = "Athletes";
//         else if (bodyFatPercentage <= 24) category = "Fitness";
//         else if (bodyFatPercentage <= 31) category = "Average";
//         else category = "Obese";
//       }

//       return `Body Fat: ${bodyFatPercentage.toFixed(
//         2
//       )}%\nCategory: ${category} (Estimation)`; // Added Estimation clarity
//     }
//     case "Calorie Burn Calculator": {
//       const weight = parseFloat(values.Weight);
//       const duration = parseFloat(values.Duration); // minutes
//       const activityType = (values["Activity Type"] || "").toLowerCase();
//       const customMetValue = parseFloat(values["MET Value"]);

//       if (isNaN(weight) || isNaN(duration) || !activityType.trim()) {
//         return "";
//       }

//       if (weight <= 0 || duration <= 0) {
//         return "Invalid inputs: Weight & Duration must be > 0";
//       }

//       let metValue = 0;
//       if (
//         activityType === "custom" &&
//         !isNaN(customMetValue) &&
//         customMetValue > 0
//       ) {
//         metValue = customMetValue;
//       } else {
//         switch (activityType) {
//           case "running":
//             metValue = 8.0;
//             break;
//           case "walking":
//             metValue = 3.5;
//             break;
//           case "cycling":
//             metValue = 7.5;
//             break;
//           case "swimming":
//             metValue = 6.0;
//             break;
//           case "aerobics":
//             metValue = 5.0;
//             break;
//           case "sitting":
//             metValue = 1.5;
//             break;
//           default:
//             return "Please select a valid activity or enter a custom MET value.";
//         }
//       }

//       if (metValue === 0) return ""; // Should not happen with validation above

//       const durationHours = duration / 60;
//       const caloriesBurned = metValue * weight * durationHours;

//       return `Calories Burned: ${caloriesBurned.toFixed(0)} kcal (approx)`;
//     }
//     case "Water Intake Calculator": {
//       const weight = parseFloat(values.Weight);
//       const activityLevel = (values["Activity Level"] || "").toLowerCase();

//       if (isNaN(weight) || !activityLevel.trim()) {
//         return "";
//       }

//       if (weight <= 0) {
//         return "Invalid inputs: Weight must be > 0";
//       }

//       // Base recommendation: ~33ml per kg of body weight
//       let recommendedIntakeMl = weight * 33;

//       if (activityLevel === "medium") {
//         recommendedIntakeMl *= 1.1; // 10% more for medium activity
//       } else if (activityLevel === "high") {
//         recommendedIntakeMl *= 1.25; // 25% more for high activity
//       }

//       return `Recommended Intake: ${(recommendedIntakeMl / 1000).toFixed(
//         2
//       )} Liters/day (Guideline)`; // Added Guideline clarity
//     }
//     case "Mileage / Distance Calculator": {
//       const startOdometer = parseFloat(values["Start Odometer"]);
//       const endOdometer = parseFloat(values["End Odometer"]);
//       const fuelUsed = parseFloat(values["Fuel Used"]);
//       const fuelPrice = parseFloat(values["Fuel Price"]);

//       if (
//         isNaN(startOdometer) ||
//         isNaN(endOdometer) ||
//         isNaN(fuelUsed) ||
//         isNaN(fuelPrice)
//       )
//         return "";

//       if (
//         startOdometer < 0 ||
//         endOdometer < startOdometer ||
//         fuelUsed <= 0 ||
//         fuelPrice <= 0
//       ) {
//         return "Invalid inputs: Odometer >= 0, End Odometer >= Start Odometer, Fuel Used & Price > 0";
//       }

//       const distanceDriven = endOdometer - startOdometer;
//       const fuelEconomy = distanceDriven / fuelUsed;
//       const tripCost = fuelUsed * fuelPrice;

//       return `Distance: ${distanceDriven.toFixed(
//         2
//       )} km\nEconomy: ${fuelEconomy.toFixed(2)} km/L\nCost: ${tripCost.toFixed(
//         2
//       )}`;
//     }
//     case "Tire Size Converter": {
//       const tireWidth = parseFloat(values["Tire Width"]);
//       const aspectRatio = parseFloat(values["Aspect Ratio"]);
//       const rimDiameter = parseFloat(values["Rim Diameter"]);

//       if (isNaN(tireWidth) || isNaN(aspectRatio) || isNaN(rimDiameter))
//         return "";

//       if (tireWidth <= 0 || aspectRatio <= 0 || rimDiameter <= 0) {
//         return "Invalid inputs: All values must be > 0";
//       }

//       const sidewallHeight = tireWidth * (aspectRatio / 100);
//       const overallDiameter = rimDiameter * 25.4 + 2 * sidewallHeight;
//       const circumference = overallDiameter * Math.PI;

//       return `Overall Diameter: ${(overallDiameter / 25.4).toFixed(
//         2
//       )} inches\nCircumference: ${(circumference / 25.4).toFixed(2)} inches`;
//     }
//     case "Age Calculator": {
//       const dob = values["Date of Birth"];
//       if (!dob || dob.trim() === "") return "";

//       const birthDate = new Date(dob);
//       const today = new Date();

//       if (isNaN(birthDate.getTime()))
//         return "Invalid Date of Birth format (YYYY-MM-DD)";

//       let age = today.getFullYear() - birthDate.getFullYear();
//       const m = today.getMonth() - birthDate.getMonth();
//       if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//         age--;
//       }
//       return `Age: ${age} years`;
//     }
//     case "Date Difference Calculator": {
//       const startDateStr = values["Start Date"];
//       const endDateStr = values["End Date"];

//       if (
//         !startDateStr ||
//         startDateStr.trim() === "" ||
//         !endDateStr ||
//         endDateStr.trim() === ""
//       )
//         return "";

//       const startDate = new Date(startDateStr);
//       const endDate = new Date(endDateStr);

//       if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
//         return "Invalid date format (YYYY-MM-DD)";

//       const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//       const diffYears = endDate.getFullYear() - startDate.getFullYear();
//       const diffMonths =
//         endDate.getMonth() - startDate.getMonth() + diffYears * 12;

//       let output = `Difference: ${diffDays} days`;
//       if (diffYears > 0) output += `\nYears: ${diffYears}`;
//       else if (diffMonths > 0) output += `\nMonths: ${diffMonths}`;

//       return output;
//     }
//     case "Work Hour Calculator": {
//       const startTimeStr = values["Start Time"];
//       const endTimeStr = values["End Time"];
//       const breakDuration = parseFloat(values["Break Duration"]);

//       if (
//         !startTimeStr ||
//         startTimeStr.trim() === "" ||
//         !endTimeStr ||
//         endTimeStr.trim() === "" ||
//         isNaN(breakDuration)
//       )
//         return "";

//       const startTime = parseTime(startTimeStr);
//       let endTime = parseTime(endTimeStr);

//       if (isNaN(startTime.getTime()) || isNaN(endTime.getTime()))
//         return "Invalid time format (HH:MM)";
//       if (isNaN(breakDuration) || breakDuration < 0)
//         return "Break duration must be a non-negative number";

//       if (endTime.getTime() < startTime.getTime()) {
//         endTime.setDate(endTime.getDate() + 1);
//       }

//       let totalWorkMs = endTime.getTime() - startTime.getTime();
//       let totalWorkHours = totalWorkMs / (1000 * 60 * 60);

//       const actualWorkHours = totalWorkHours - breakDuration / 60;

//       if (actualWorkHours < 0)
//         return "Actual work hours cannot be negative (check times/break)";

//       const hours = Math.floor(actualWorkHours);
//       const minutes = Math.round((actualWorkHours - hours) * 60);

//       return `Total Work: ${hours}h ${minutes}m`;
//     }
//     case "Countdown Calculator": {
//       // This calculator's result is handled by the useEffect for live updates.
//       // The `calculate` function here returns a static string or initial value.
//       const targetDateStr = values["Target Date"];
//       const targetTimeStr = values["Target Time"];

//       if (
//         !targetDateStr ||
//         targetDateStr.trim() === "" ||
//         !targetTimeStr ||
//         targetTimeStr.trim() === ""
//       )
//         return "";

//       const targetDateTime = new Date(
//         `${targetDateStr}T${targetTimeStr || "00:00:00"}`
//       );
//       const now = new Date();

//       if (isNaN(targetDateTime.getTime()))
//         return "Invalid Target Date/Time format";

//       const difference = targetDateTime.getTime() - now.getTime();
//       if (difference < 0) return "Date has passed";

//       const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//       const hours = Math.floor(
//         (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//       );
//       const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((difference % (1000 * 60)) / 1000);

//       const parts = [];
//       if (days > 0) parts.push(`${days}d`);
//       if (hours > 0) parts.push(`${hours}h`);
//       if (minutes > 0) parts.push(`${minutes}m`);
//       if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

//       return `Countdown: ${parts.join(" ")}`;
//     }
//     case "Text Case Converter": {
//       const text = values.Text || "";
//       if (text.trim() === "") return "";
//       return `UPPER: ${text.toUpperCase()}\nlower: ${text.toLowerCase()}\nTitle: ${text.replace(
//         /\b\w/g,
//         (s) => s.toUpperCase()
//       )}`;
//     }
//     default:
//       return "";
//   }
// };

// // ===== MAIN COMPONENT =====
// export default function ImprovedUnitConverter() {
//   const [selectedCategory, setSelectedCategory] = useState("Length / Distance");
//   const [value, setValue] = useState("1");
//   const [fromUnit, setFromUnit] = useState("m");
//   const [toUnit, setToUnit] = useState("ft");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showAllResults, setShowAllResults] = useState(true);
//   const [expandedGroups, setExpandedGroups] = useState({
//     "Core Daily Converters": true,
//   });

//   const [calculatorValues, setCalculatorValues] = useState({});
//   const [calculatorResult, setCalculatorResult] = useState(null);
//   const [showCopyMessage, setShowCopyMessage] = useState(false); // State for copy message

//   const currentConverter = converters[selectedCategory];

//   const numValue = parseFloat(value) || 0;
//   const mainResult =
//     currentConverter.type === "unit"
//       ? convertValue(numValue, fromUnit, toUnit, selectedCategory)
//       : null;

//   const allResults =
//     currentConverter.type === "unit"
//       ? currentConverter.units.map((unit) => ({
//           unit,
//           value: convertValue(numValue, fromUnit, unit, selectedCategory),
//         }))
//       : [];

//   // Effect for updating calculator results
//   useEffect(() => {
//     let intervalId;
//     if (currentConverter && currentConverter.type === "calculator") {
//       // Special handling for Countdown Calculator
//       if (selectedCategory === "Countdown Calculator") {
//         const updateCountdown = () => {
//           setCalculatorResult(calculate(selectedCategory, calculatorValues));
//         };

//         updateCountdown(); // Initial call
//         intervalId = setInterval(updateCountdown, 1000); // Update every second

//         return () => clearInterval(intervalId); // Cleanup interval
//       } else {
//         const result = calculate(selectedCategory, calculatorValues);
//         setCalculatorResult(result);
//       }
//     } else {
//       setCalculatorResult(null);
//     }
//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [calculatorValues, selectedCategory]);

//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category);
//     const converter = converters[category];
//     if (converter.type === "unit") {
//       setValue("1");
//       setFromUnit(converter.units[0]);
//       setToUnit(converter.units[1] || converter.units[0]);
//       setCalculatorValues({});
//       setCalculatorResult(null);
//     } else {
//       setValue("");
//       setFromUnit("");
//       setToUnit("");
//       // Initialize calculator inputs with empty strings for text/date/time or default for select
//       const initialCalcValues = {};
//       converter.inputs.forEach((input) => {
//         if (input.unit === "select") {
//           initialCalcValues[input.name] = input.options[0];
//         } else {
//           initialCalcValues[input.name] = "";
//         }
//       });
//       setCalculatorValues(initialCalcValues);
//       setCalculatorResult(null);
//     }
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     const match = query.match(
//       /([\d.]+)\s*([^\d\s]+)\s*(?:to|in)\s*([^\d\s]+)/i
//     );

//     if (match) {
//       const val = match[1];
//       const from = match[2].trim();
//       const to = match[3].trim();

//       for (const [cat, conv] of Object.entries(converters)) {
//         if (
//           conv.type === "unit" &&
//           Array.isArray(conv.units) && // Ensure conv.units is an array
//           conv.units.includes(from) &&
//           conv.units.includes(to)
//         ) {
//           setSelectedCategory(cat);
//           setValue(val);
//           setFromUnit(from);
//           setToUnit(to);
//           setSearchQuery("");
//           break;
//         }
//       }
//     }
//   };

//   const swapUnits = () => {
//     const temp = fromUnit;
//     setFromUnit(toUnit);
//     setToUnit(temp);
//   };

//   const toggleGroup = (group) => {
//     setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
//   };

//   const handleCalculatorInputChange = (inputName, val) => {
//     setCalculatorValues((prev) => ({ ...prev, [inputName]: val }));
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard
//       .writeText(text)
//       .then(() => {
//         setShowCopyMessage(true);
//         setTimeout(() => setShowCopyMessage(false), 2000); // Hide after 2 seconds
//       })
//       .catch((err) => {
//         console.error("Failed to copy: ", err);
//       });
//   };

//   return (
//     <div style={{ minHeight: "100vh", background: "#F5F7FA" }}>
//       {/* Header - Your Color Scheme */}
//       <div
//         style={{
//           background: "#fff",
//           borderBottom: "1px solid #E5E7EB",
//           padding: "3px 24px",
//           position: "fixed",
//           top: 0,
//           left: 0,
//           right: 0,
//           zIndex: 1000,
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <Stack direction="row" sx={{ gap: "20px", alignItems: "center" }}>
//             <Box component={Link} href="/" sx={{ cursor: "pointer" }}>
//               <ToolsHubsIcon width="147" />
//             </Box>
//             <h1
//               style={{
//                 fontSize: "24px",
//                 fontWeight: "bold",
//                 color: "#1E3A8A",
//                 margin: 0,
//               }}
//             >
//               Universal Unit Converter
//             </h1>
//           </Stack>

//           <div style={{ position: "relative", flex: "0 0 400px" }}>
//             <Search
//               style={{
//                 position: "absolute",
//                 left: "12px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 width: "20px",
//                 height: "20px",
//                 color: "#9CA3AF",
//               }}
//             />
//             <input
//               type="text"
//               placeholder='Try: "25 °C to °F" or "5 kg to lb"'
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
//               style={{
//                 width: "100%",
//                 padding: "10px 12px 10px 40px",
//                 border: "2px solid #1E3A8A",
//                 borderRadius: "12px",
//                 outline: "none",
//                 fontSize: "14px",
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       <div
//         style={{
//           padding: "70px 16px 16px",
//           display: "flex",
//           gap: "16px",
//           minHeight: "calc(100vh - 90px)",
//         }}
//       >
//         {/* Sidebar - Your Style */}
//         <div
//           style={{
//             width: "320px",
//             flexShrink: 0,
//           }}
//         >
//           <div
//             style={{
//               background: "#fff",
//               borderRadius: "16px",
//               padding: "16px",
//               maxHeight: "calc(100vh - 80px)",
//               overflowY: "auto",
//               msOverflowStyle: "none",
//               scrollbarWidth: "none",
//               "&::WebkitScrollbar": {
//                 display: "none",
//               },
//             }}
//           >
//             {Object.entries(categoryGroups).map(([group, categories]) => (
//               <div key={group} style={{ marginBottom: "8px" }}>
//                 <button
//                   onClick={() => toggleGroup(group)}
//                   style={{
//                     width: "100%",
//                     padding: "12px",
//                     background:
//                       "radial-gradient(278.82% 508.63% at -133.28% -141.92%, rgba(204, 230, 230, 0.93) 0%, #09123A 70%, #80C0C0 100%)",
//                     color: theme.palette.primary.fourthMain,
//                     border: "none",
//                     borderRadius: "12px",
//                     fontWeight: "bold",
//                     cursor: "pointer",
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     fontSize: "14px",
//                   }}
//                 >
//                   {group}
//                   {expandedGroups[group] ? (
//                     <ChevronUp size={18} />
//                   ) : (
//                     <ChevronDown size={18} />
//                   )}
//                 </button>
//                 {expandedGroups[group] && (
//                   <div style={{ paddingTop: "8px" }}>
//                     {categories.map((category) => (
//                       <button
//                         key={category}
//                         onClick={() => handleCategoryChange(category)}
//                         style={{
//                           width: "100%",
//                           padding: "10px 12px",
//                           background:
//                             selectedCategory === category
//                               ? "#DBEAFE"
//                               : "transparent",
//                           color: theme.palette.primary.main,

//                           border: "none",
//                           borderRadius: "8px",
//                           cursor: "pointer",
//                           textAlign: "left",
//                           marginBottom: "4px",
//                           fontSize: "13px",
//                           transition: "all 0.2s",
//                         }}
//                         onMouseEnter={(e) => {
//                           if (selectedCategory !== category) {
//                             e.target.style.background = "#DBEAFE";
//                           }
//                         }}
//                         onMouseLeave={(e) => {
//                           if (selectedCategory !== category) {
//                             e.target.style.background = "transparent";
//                           }
//                         }}
//                       >
//                         {category}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Main Converter Panel */}
//         <div style={{ flex: 1 }}>
//           <div
//             style={{
//               background: "#fff",
//               borderRadius: "16px",
//               padding: "14px 24px",
//               marginBottom: "16px",
//             }}
//           >
//             <h2
//               style={{
//                 fontSize: "20px",
//                 fontWeight: "bold",
//                 color: theme.palette.primary.main,
//                 marginBottom: "24px",
//                 marginTop: 0,
//               }}
//             >
//               {selectedCategory}
//             </h2>

//             {currentConverter.type === "unit" ? (
//               <>
//                 {/* Value Input */}
//                 <div style={{ marginBottom: "20px" }}>
//                   <label
//                     style={{
//                       display: "block",
//                       fontSize: "14px",
//                       fontWeight: "500",
//                       color: theme.palette.primary.main,
//                       marginBottom: "8px",
//                     }}
//                   >
//                     Value
//                   </label>
//                   <div style={{ position: "relative" }}>
//                     <input
//                       type="text"
//                       value={value}
//                       onChange={(e) => {
//                         const val = e.target.value;
//                         if (val === "" || /^-?\d*\.?\d*e?-?\d*$/i.test(val)) {
//                           setValue(val);
//                         }
//                       }}
//                       className="border"
//                       style={{
//                         width: "100%",
//                         padding: "12px 40px 12px 16px",
//                         borderColor: "2#D1D5DB",
//                         borderRadius: "12px",
//                         fontSize: "18px",
//                         fontWeight: "600",
//                         outline: "none",
//                       }}
//                       placeholder="Enter value"
//                       onFocus={(e) =>
//                         (e.target.style.borderColor =
//                           theme.palette.primary.main)
//                       }
//                       onBlur={(e) =>
//                         (e.target.style.borderColor =
//                           theme.palette.primary.main)
//                       }
//                     />
//                     {value && (
//                       <button
//                         onClick={() => setValue("")}
//                         style={{
//                           position: "absolute",
//                           right: "12px",
//                           top: "50%",
//                           transform: "translateY(-50%)",
//                           background: "#F3F4F6",
//                           border: "none",
//                           borderRadius: "50%",
//                           width: "24px",
//                           height: "24px",
//                           cursor: "pointer",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <X size={14} color="#6B7280" />
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* From Unit */}
//                 <div style={{ marginBottom: "16px" }}>
//                   <label
//                     style={{
//                       display: "block",
//                       fontSize: "14px",
//                       fontWeight: "500",
//                       color: theme.palette.primary.main,
//                       marginBottom: "8px",
//                     }}
//                   >
//                     From
//                   </label>
//                   <select
//                     value={fromUnit}
//                     onChange={(e) => setFromUnit(e.target.value)}
//                     className="border"
//                     style={{
//                       width: "100%",
//                       padding: "12px",
//                       borderColor: theme.palette.primary.main,
//                       borderRadius: "12px",
//                       fontSize: "16px",
//                       outline: "none",
//                       cursor: "pointer",
//                     }}
//                   >
//                     {currentConverter.units.map((unit) => (
//                       <option key={unit} value={unit}>
//                         {unit}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Swap Button */}
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     margin: "16px 0",
//                   }}
//                 >
//                   <button
//                     onClick={swapUnits}
//                     style={{
//                       padding: "12px",
//                       background: theme.palette.primary.main,
//                       border: "none",
//                       borderRadius: "50%",
//                       cursor: "pointer",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       transition: "all 0.2s",
//                     }}
//                   >
//                     <ArrowRightLeft
//                       size={20}
//                       color={theme.palette.primary.fourthMain}
//                     />
//                   </button>
//                 </div>

//                 {/* To Unit */}
//                 <div style={{ marginBottom: "24px" }}>
//                   <label
//                     style={{
//                       display: "block",
//                       fontSize: "14px",
//                       fontWeight: "500",
//                       color: theme.palette.primary.main,
//                       marginBottom: "8px",
//                     }}
//                   >
//                     To
//                   </label>
//                   <select
//                     value={toUnit}
//                     onChange={(e) => setToUnit(e.target.value)}
//                     className="border"
//                     style={{
//                       width: "100%",
//                       padding: "12px",
//                       borderColor: theme.palette.primary.main,
//                       borderRadius: "12px",
//                       fontSize: "16px",
//                       outline: "none",
//                       cursor: "pointer",
//                     }}
//                   >
//                     {currentConverter.units.map((unit) => (
//                       <option key={unit} value={unit}>
//                         {unit}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </>
//             ) : (
//               <>
//                 {/* Calculator Inputs */}
//                 {currentConverter.inputs.map((input) =>
//                   input.optional &&
//                   input.dependsOn &&
//                   calculatorValues[input.dependsOn] !==
//                     input.dependsOnValue ? null : (
//                     <div key={input.name} style={{ marginBottom: "20px" }}>
//                       <label
//                         style={{
//                           display: "block",
//                           fontSize: "14px",
//                           fontWeight: "500",
//                           color: theme.palette.primary.main,
//                           marginBottom: "8px",
//                         }}
//                       >
//                         {input.name}{" "}
//                         {input.unit && input.unit !== "select"
//                           ? `(${input.unit})`
//                           : ""}
//                       </label>
//                       {input.unit === "select" ? (
//                         <select
//                           value={
//                             calculatorValues[input.name] || input.options[0]
//                           }
//                           onChange={(e) =>
//                             handleCalculatorInputChange(
//                               input.name,
//                               e.target.value
//                             )
//                           }
//                           className="border"
//                           style={{
//                             width: "100%",
//                             padding: "12px 16px",
//                             borderColor: theme.palette.primary.main,
//                             borderRadius: "12px",
//                             fontSize: "16px",
//                             outline: "none",
//                           }}
//                         >
//                           {input.options.map((option) => (
//                             <option key={option} value={option}>
//                               {option}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         <input
//                           type={
//                             (input.unit && input.unit.includes("date")) ||
//                             (input.unit && input.unit.includes("time"))
//                               ? input.unit
//                               : input.unit === "number"
//                               ? "number"
//                               : "text" // Explicitly set type to number for numerical inputs
//                           }
//                           value={calculatorValues[input.name] || ""}
//                           onChange={(e) =>
//                             handleCalculatorInputChange(
//                               input.name,
//                               e.target.value
//                             )
//                           }
//                           className="border"
//                           style={{
//                             width: "100%",
//                             padding: "12px 16px",
//                             borderColor: theme.palette.primary.main,
//                             borderRadius: "12px",
//                             color: theme.palette.primary.main,
//                             fontSize: "16px",
//                             outline: "none",
//                           }}
//                           placeholder={`Enter ${input.name}`}
//                         />
//                       )}
//                     </div>
//                   )
//                 )}
//               </>
//             )}

//             {/* Main Result - Your Color Scheme */}
//             <div
//               style={{
//                 background: "#09123aea",
//                 borderRadius: "16px",
//                 padding: "24px",
//                 color: "#fff",
//                 position: "relative",
//                 cursor: "pointer", // Make it clickable to copy
//               }}
//               onClick={() => {
//                 const textToCopy =
//                   currentConverter.type === "unit"
//                     ? `${formatNumber(mainResult)} ${toUnit}`
//                     : String(calculatorResult).replace(/<[^>]*>?/gm, ""); // Remove HTML if present for calculator results
//                 copyToClipboard(textToCopy);
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: "12px",
//                   opacity: 0.9,
//                   marginBottom: "8px",
//                   fontWeight: "500",
//                 }}
//               >
//                 {currentConverter.type === "unit"
//                   ? "Result"
//                   : "Calculation Result"}
//               </div>
//               <div
//                 style={{
//                   fontSize: "36px",
//                   fontWeight: "bold",
//                   marginBottom: "8px",
//                   wordBreak: "break-all",
//                 }}
//               >
//                 {currentConverter.type === "unit"
//                   ? formatNumber(mainResult)
//                   : (() => {
//                       const resultText = String(calculatorResult); // Ensure it's a string
//                       if (resultText.includes("\n")) {
//                         return resultText.split("\n").map((line, index) => {
//                           const parts = line.split(":");
//                           return (
//                             <div key={index}>
//                               <span
//                                 style={{
//                                   color: theme.palette.secondary.fifthMain,
//                                   marginRight: "8px",
//                                 }}
//                               >
//                                 {parts[0]}:
//                               </span>
//                               <span style={{ color: "#fff" }}>
//                                 {parts.slice(1).join(":")}
//                               </span>
//                             </div>
//                           );
//                         });
//                       } else if (resultText.includes(":")) {
//                         // Handle single line "Label: Value"
//                         const parts = resultText.split(":");
//                         return (
//                           <div>
//                             <span
//                               style={{ color: "#93C5FD", marginRight: "8px" }}
//                             >
//                               {parts[0]}:
//                             </span>
//                             <span style={{ color: "#fff" }}>
//                               {parts.slice(1).join(":")}
//                             </span>
//                           </div>
//                         );
//                       } else {
//                         return formatNumber(calculatorResult); // Fallback for other single-line outputs (e.g., "Invalid Input")
//                       }
//                     })()}
//               </div>
//               <div
//                 style={{
//                   fontSize: "18px",
//                   opacity: 0.9,
//                   color: currentConverter.type === "unit" ? "#93C5FD" : "#fff", // Apply color to unit
//                 }}
//               >
//                 {currentConverter.type === "unit" ? toUnit : ""}
//               </div>
//               {showCopyMessage && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     bottom: "10px",
//                     right: "10px",
//                     background: "rgba(0,0,0,0.7)",
//                     color: "#fff",
//                     padding: "5px 10px",
//                     borderRadius: "5px",
//                     fontSize: "12px",
//                   }}
//                 >
//                   Copied!
//                 </div>
//               )}
//             </div>
//             {(currentConverter.type !== "unit" ||
//               (currentConverter.type === "unit" && mainResult)) && (
//               <button
//                 onClick={() => {
//                   const textToCopy =
//                     currentConverter.type === "unit"
//                       ? `${formatNumber(mainResult)} ${toUnit}`
//                       : String(calculatorResult).replace(/<[^>]*>?/gm, "");
//                   copyToClipboard(textToCopy);
//                 }}
//                 style={{
//                   marginTop: "10px",
//                   width: "100%",
//                   padding: "12px",
//                   background:
//                     "radial-gradient(278.82% 508.63% at -133.28% -141.92%, rgba(204, 230, 230, 0.93) 0%, #09123A 50%, #80C0C0 100%)",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "12px",
//                   fontSize: "16px",
//                   fontWeight: "bold",
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: "8px",
//                   transition: "background-color 0.2s",
//                 }}
//                 onMouseEnter={(e) =>
//                   (e.target.style.backgroundColor = "#3B82F6")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.target.style.backgroundColor = "#1E3A8A")
//                 }
//               >
//                 <Copy size={18} /> Copy Result
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Results Table */}
//         {currentConverter.type === "unit" && showAllResults && (
//           <div style={{ width: "320px", flexShrink: 0 }}>
//             <div
//               style={{
//                 background: "#fff",
//                 borderRadius: "16px",
//                 padding: "16px",
//                 maxHeight: "calc(100vh - 130px)",
//                 overflowY: "auto",
//                 msOverflowStyle: "none",
//                 scrollbarWidth: "none",
//                 "&::WebkitScrollbar": {
//                   display: "none",
//                 },
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: "16px",
//                 }}
//               >
//                 <h3
//                   style={{
//                     fontSize: "14px",
//                     fontWeight: "bold",
//                     color: theme.palette.primary.main,
//                     textTransform: "uppercase",
//                     letterSpacing: "0.05em",
//                     margin: 0,
//                   }}
//                 >
//                   All Conversions
//                 </h3>
//                 <button
//                   onClick={() => setShowAllResults(false)}
//                   style={{
//                     background: "transparent",
//                     border: "none",
//                     cursor: "pointer",
//                     padding: "4px",
//                   }}
//                 >
//                   <X size={18} color="#6B7280" />
//                 </button>
//               </div>
//               <div>
//                 {allResults.map(({ unit, value: val }) => (
//                   <div
//                     key={unit}
//                     style={{
//                       padding: "12px",
//                       marginBottom: "8px",
//                       borderRadius: "12px",
//                       background: unit === toUnit ? "#DBEAFE" : "#F9FAFB",
//                       border:
//                         unit === toUnit
//                           ? "2px solid #1E3A8A"
//                           : "1px solid #E5E7EB",
//                       transition: "all 0.2s",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         gap: "8px",
//                       }}
//                     >
//                       <span
//                         style={{
//                           fontWeight: "500",
//                           color: "#374151",
//                           fontSize: "14px",
//                         }}
//                       >
//                         {unit}
//                       </span>
//                       <span
//                         style={{
//                           fontSize: "13px",
//                           color: "#111827",
//                           color: "#111827",
//                           fontWeight: "600",
//                           textAlign: "right",
//                           wordBreak: "break-all",
//                         }}
//                       >
//                         {formatNumber(val)}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {currentConverter.type === "unit" && !showAllResults && (
//           <button
//             onClick={() => setShowAllResults(true)}
//             style={{
//               position: "fixed",
//               right: "20px",
//               top: "80px",
//               background: theme.palette.primary.main,
//               color: "#fff",
//               border: "none",
//               borderRadius: "50%",
//               width: "56px",
//               height: "56px",
//               cursor: "pointer",
//               boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <ChevronDown size={24} />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// ... existing code ...
"use client";
import React, { useState, useEffect } from "react";

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

// ===== COMPLETE CONVERSION LOGIC WITH ALL YOUR CONVERTERS =====
const converters = {
  "Length / Distance": {
    units: ["m", "cm", "mm", "km", "in", "ft", "yd", "mi"],
    factors: {
      m: 1,
      cm: 0.01,
      mm: 0.001,
      km: 1000,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.34,
    },
    type: "unit",
  },
  "Weight / Mass": {
    units: ["kg", "g", "mg", "t", "lb", "oz"],
    factors: {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      t: 1000,
      lb: 0.453592,
      oz: 0.0283495,
    },
    type: "unit",
  },
  Temperature: {
    units: ["°C", "°F", "K"],
    convert: (value, from, to) => {
      let celsius;
      if (from === "°C") celsius = value;
      else if (from === "°F") celsius = ((value - 32) * 5) / 9;
      else if (from === "K") celsius = value - 273.15;
      else return NaN;

      if (to === "°C") return celsius;
      if (to === "°F") return (celsius * 9) / 5 + 32;
      if (to === "K") return celsius + 273.15;
      return NaN;
    },
    type: "unit",
  },
  Area: {
    units: ["m²", "cm²", "km²", "ha", "ac", "ft²", "in²"],
    factors: {
      "m²": 1,
      "cm²": 0.0001,
      "km²": 1e6,
      ha: 10000,
      ac: 4046.86,
      "ft²": 0.092903,
      "in²": 0.00064516,
    },
    type: "unit",
  },
  Volume: {
    units: ["L", "mL", "m³", "gal", "qt", "pt", "fl oz"],
    factors: {
      L: 1,
      mL: 0.001,
      "m³": 1000,
      gal: 3.78541,
      qt: 0.946353,
      pt: 0.473176,
      "fl oz": 0.0295735,
    },
    type: "unit",
  },
  Speed: {
    units: ["m/s", "km/h", "mph", "kn", "ft/s"],
    factors: {
      "m/s": 1,
      "km/h": 0.277778,
      mph: 0.44704,
      kn: 0.514444,
      "ft/s": 0.3048,
    },
    type: "unit",
  },
  Time: {
    units: ["s", "ms", "min", "h", "day", "week", "year"],
    factors: {
      s: 1,
      ms: 0.001,
      min: 60,
      h: 3600,
      day: 86400,
      week: 604800,
      year: 31536000,
    },
    type: "unit",
  },
  Pressure: {
    units: ["Pa", "kPa", "bar", "atm", "psi", "mmHg"],
    factors: {
      Pa: 1,
      kPa: 1000,
      bar: 100000,
      atm: 101325,
      psi: 6894.76,
      mmHg: 133.322,
    },
    type: "unit",
  },
  "Energy / Heat": {
    units: ["J", "kJ", "cal", "kcal", "Wh", "kWh", "BTU"],
    factors: {
      J: 1,
      kJ: 1000,
      cal: 4.184,
      kcal: 4184,
      Wh: 3600,
      kWh: 3600000,
      BTU: 1055.06,
    },
    type: "unit",
  },
  Power: {
    units: ["W", "kW", "MW", "hp", "BTU/h"],
    factors: { W: 1, kW: 1000, MW: 1000000, hp: 745.7, "BTU/h": 0.293071 },
    type: "unit",
  },
  Force: {
    units: ["N", "kN", "lbf", "dyn"],
    factors: { N: 1, kN: 1000, lbf: 4.44822, dyn: 0.00001 },
    type: "unit",
  },
  Angle: {
    units: ["rad", "deg", "grad", "rev"],
    factors: {
      rad: 1,
      deg: Math.PI / 180,
      grad: Math.PI / 200,
      rev: 2 * Math.PI,
    },
    type: "unit",
  },
  Density: {
    units: ["kg/m³", "g/cm³", "lb/ft³"],
    factors: { "kg/m³": 1, "g/cm³": 1000, "lb/ft³": 16.0185 },
    type: "unit",
  },
  Torque: {
    units: ["Nm", "lb-ft", "lb-in"],
    factors: { Nm: 1, "lb-ft": 1.35582, "lb-in": 0.112985 },
    type: "unit",
  },
  Acceleration: {
    units: ["m/s²", "g", "ft/s²"],
    factors: { "m/s²": 1, g: 9.80665, "ft/s²": 0.3048 },
    type: "unit",
  },
  "Data Storage": {
    units: ["B", "KB", "MB", "GB", "TB", "PB"],
    factors: {
      B: 1,
      KB: 1024,
      MB: 1024 ** 2,
      GB: 1024 ** 3,
      TB: 1024 ** 4,
      PB: 1024 ** 5,
    },
    type: "unit",
  },
  "Data Transfer Rate": {
    units: ["bps", "Kbps", "Mbps", "Gbps", "MB/s"],
    factors: {
      bps: 1,
      Kbps: 1000,
      Mbps: 1000000,
      Gbps: 1000000000,
      "MB/s": 8000000,
    },
    type: "unit",
  },
  Frequency: {
    units: ["Hz", "kHz", "MHz", "GHz"],
    factors: { Hz: 1, kHz: 1000, MHz: 1000000, GHz: 1000000000 },
    type: "unit",
  },
  "Bit/Byte Converter": {
    units: ["bit", "byte"],
    factors: { bit: 1, byte: 8 },
    type: "unit",
  },
  "Electric Voltage": {
    units: ["V", "mV", "kV"],
    factors: { V: 1, mV: 0.001, kV: 1000 },
    type: "unit",
  },
  "Electric Current": {
    units: ["A", "mA", "kA"],
    factors: { A: 1, mA: 0.001, kA: 1000 },
    type: "unit",
  },
  "Electric Resistance": {
    units: ["Ω", "kΩ", "MΩ"],
    factors: { Ω: 1, kΩ: 1000, MΩ: 1000000 },
    type: "unit",
  },
  "Electric Power": {
    units: ["W", "kW", "MW"],
    factors: { W: 1, kW: 1000, MW: 1000000 },
    type: "unit",
  },
  Capacitance: {
    units: ["F", "μF", "pF"],
    factors: { F: 1, μF: 0.000001, pF: 0.000000000001 },
    type: "unit",
  },
  Inductance: {
    units: ["H", "mH", "μH"],
    factors: { H: 1, mH: 0.001, μH: 0.000001 },
    type: "unit",
  },
  "Electric Charge": {
    units: ["C", "mAh"],
    factors: { C: 1, mAh: 0.0036 },
    type: "unit",
  },
  "Magnetic Field Strength": {
    units: ["T", "G"],
    factors: { T: 1, G: 0.0001 },
    type: "unit",
  },
  Illuminance: {
    // Lux (lx) is lumens per square meter. Lumens (lm) is luminous flux.
    // They are not directly convertible without knowing the area or distance from light source.
    units: ["lx", "lm"],
    convert: () =>
      "Requires surface area for conversion or distance from source.",
    type: "unit",
  },
  "Specific Heat Capacity": {
    units: ["J/kg·K", "cal/g·°C"],
    factors: { "J/kg·K": 1, "cal/g·°C": 4.184 },
    type: "unit",
  },
  "Fuel Efficiency": {
    units: ["km/l", "mpg"],
    factors: { "km/l": 1, mpg: 0.425144 },
    type: "unit",
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
  },
  "Cooking Volume": {
    units: ["ml", "cup", "tbsp", "tsp", "L"],
    factors: { ml: 1, cup: 236.588, tbsp: 14.7868, tsp: 4.92892, L: 1000 },
    type: "unit",
  },
  "Cooking Weight": {
    units: ["g", "oz", "lb"],
    factors: { g: 1, oz: 28.3495, lb: 453.592 },
    type: "unit",
  },
  "Oven Temperature": {
    units: ["°C", "°F", "Gas Mark"],
    convert: (value, from, to) => {
      let celsius;
      if (from === "°C") celsius = value;
      else if (from === "°F") celsius = ((value - 32) * 5) / 9;
      else if (from === "Gas Mark") {
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
  },
  "Engine Power": {
    units: ["kW", "HP"],
    factors: { kW: 1, HP: 0.7457 },
    type: "unit",
  },
  Concentration: {
    units: ["mol/L", "%", "ppm"],
    convert: (value, from, to) => {
      let molL;
      if (from === "mol/L") molL = value;
      else if (from === "%") molL = value / 100;
      else if (from === "ppm") molL = value * 0.000001;
      else return NaN;

      if (to === "mol/L") return molL;
      if (to === "%") return molL * 100;
      if (to === "ppm") return molL / 0.000001;
      return NaN;
    },
    type: "unit",
  },
  "Radiation Units": {
    units: ["Gy", "Sv"],
    factors: { Gy: 1, Sv: 1 },
    type: "unit",
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
  },
  // B. Digital & Computer Converters
  "File Size Calculator": {
    type: "calculator",
    inputs: [
      { name: "Duration", unit: "seconds" },
      { name: "Bitrate", unit: "bps" },
      { name: "Size", unit: "bits" },
    ],
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

      // ExchangeRate-API.com's /latest/USD endpoint provides rates where each rate
      // is how many of that currency you get per 1 USD.
      // E.g., allRates['EUR'] is the value of 1 USD in EUR.
      // So, to convert 'value' from 'from' to 'to':
      // 1. Convert 'value' from 'from' to USD: value / allRates[from]
      // 2. Convert that USD value to 'to': (value / allRates[from]) * allRates[to]
      const valueInUSD = value / allRates[from];
      const convertedValue = valueInUSD * allRates[to];

      return convertedValue;
    },
  },
  "Loan / EMI Calculator": {
    type: "calculator",
    inputs: [
      { name: "Principal Amount", unit: "currency" },
      { name: "Annual Interest Rate", unit: "%" },
      { name: "Loan Tenure", unit: "months" },
    ],
  },
  "Interest Rate Calculator": {
    type: "calculator",
    inputs: [
      { name: "Principal", unit: "currency" },
      { name: "Rate", unit: "% per period" },
      { name: "Time", unit: "periods" },
    ],
  },
  "Discount Calculator": {
    type: "calculator",
    inputs: [
      { name: "Original Price", unit: "currency" },
      { name: "Discount Percentage", unit: "%" },
    ],
  },
  "Sales Tax / VAT Calculator": {
    type: "calculator",
    inputs: [
      { name: "Net Price", unit: "currency" },
      { name: "Tax Rate", unit: "%" },
    ],
  },
  "Investment Return Calculator (ROI)": {
    type: "calculator",
    inputs: [
      { name: "Initial Investment", unit: "currency" },
      { name: "Final Value", unit: "currency" },
    ],
  },

  // D. Engineering & Science Converters
  "Fuel Consumption Cost Calculator": {
    type: "calculator",
    inputs: [
      { name: "Distance", unit: "km" },
      { name: "Fuel Efficiency", unit: "km/L" },
      { name: "Fuel Price", unit: "currency/L" },
    ],
  },

  // E. Construction & Material Converters
  "Concrete Volume Calculator": {
    type: "calculator",
    inputs: [
      { name: "Length", unit: "m" },
      { name: "Width", unit: "m" },
      { name: "Depth", unit: "m" },
    ],
  },
  "Lumber / Wood Board Feet": {
    type: "calculator",
    inputs: [
      { name: "Thickness", unit: "inches" },
      { name: "Width", unit: "inches" },
      { name: "Length", unit: "feet" },
      { name: "Quantity", unit: "pieces" },
    ],
  },
  "Steel Weight Calculator": {
    type: "calculator",
    inputs: [
      { name: "Length", unit: "m" },
      { name: "Width", unit: "m" },
      { name: "Height", unit: "m" },
    ],
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
  },
  "Paint Coverage Calculator": {
    type: "calculator",
    inputs: [
      { name: "Wall Length", unit: "m" },
      { name: "Wall Height", unit: "m" },
      { name: "Number of Coats", unit: "coats" },
      { name: "Coverage per Liter", unit: "m²/L" },
    ],
  },

  // F. Health, Fitness & Nutrition
  "BMI Calculator": {
    type: "calculator",
    inputs: [
      { name: "Weight", unit: "kg" },
      { name: "Height", unit: "m" },
    ],
  },
  "Body Fat Calculator": {
    type: "calculator",
    inputs: [
      { name: "Weight", unit: "kg" },
      { name: "Height", unit: "cm" },
      { name: "Age", unit: "years" },
      { name: "Gender", unit: "select", options: ["Male", "Female"] },
    ],
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
  },

  // G. Cooking & Food Converters
  "Ingredient-Specific Converter": {
    type: "calculator",
    inputs: [
      { name: "Amount", unit: "value" },
      { name: "Ingredient", unit: "text" },
      { name: "From Unit", unit: "text" },
      { name: "To Unit", unit: "text" },
    ],
    calculate: () =>
      "Advanced logic required for ingredient densities and conversion.",
  },

  // H. Transport & Automotive Converters
  "Mileage / Distance Calculator": {
    type: "calculator",
    inputs: [
      { name: "Start Odometer", unit: "km" },
      { name: "End Odometer", unit: "km" },
      { name: "Fuel Used", unit: "Liters" },
      { name: "Fuel Price", unit: "currency/L" },
    ],
  },
  "Tire Size Converter": {
    type: "calculator",
    inputs: [
      { name: "Tire Width", unit: "mm" },
      { name: "Aspect Ratio", unit: "%" },
      { name: "Rim Diameter", unit: "inches" },
    ],
  },

  // I. Physics & Chemistry Converters
  "Molar Mass Calculator": {
    type: "calculator",
    inputs: [{ name: "Chemical Formula", unit: "text" }],
    calculate: () =>
      "Complex parsing of chemical formula and atomic weights required.",
  },
  "Pressure Drop (engineering)": {
    type: "calculator",
    inputs: [
      { name: "Flow Rate", unit: "m³/s" },
      { name: "Pipe Diameter", unit: "m" },
      { name: "Pipe Length", unit: "m" },
      { name: "Fluid Viscosity", unit: "Pa·s" },
      { name: "Fluid Density", unit: "kg/m³" },
    ],
    calculate: () =>
      "Complex engineering calculations required (e.g., Darcy-Weisbach equation).",
  },

  // J. Date, Time & Planning Tools
  "Age Calculator": {
    type: "calculator",
    inputs: [{ name: "Date of Birth", unit: "date" }],
  },
  "Date Difference Calculator": {
    type: "calculator",
    inputs: [
      { name: "Start Date", unit: "date" },
      { name: "End Date", unit: "date" },
    ],
  },
  "Time Zone Converter": {
    type: "calculator",
    inputs: [
      { name: "Date", unit: "date" },
      { name: "Time", unit: "time" },
      { name: "From Time Zone", unit: "text" },
      { name: "To Time Zone", unit: "text" },
    ],
    calculate: () =>
      "Time zone conversion requires an external API or library for accuracy.",
  },
  "Work Hour Calculator": {
    type: "calculator",
    inputs: [
      { name: "Start Time", unit: "time" },
      { name: "End Time", unit: "time" },
      { name: "Break Duration", unit: "minutes" },
    ],
  },
  "Countdown Calculator": {
    type: "calculator",
    inputs: [
      { name: "Target Date", unit: "date" },
      { name: "Target Time", unit: "time" },
    ],
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
        if (from === "Decimal" && !/^-?\d+$/.test(cleanedValue)) {
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
  },
  "Text Case Converter": {
    type: "calculator",
    inputs: [{ name: "Text", unit: "text" }],
  },
  "Roman Numeral Converter": {
    type: "calculator", // CONFIRMED: Keep as calculator type for separate inputs
    inputs: [
      { name: "Decimal Input", unit: "number", optional: true },
      { name: "Roman Input", unit: "text", optional: true },
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
  ],
  "Digital & Computer Converters": [
    "Data Storage",
    "Data Transfer Rate",
    "Frequency",
    "Bit/Byte Converter",
    "File Size Calculator",
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
    "Electric Voltage",
    "Electric Current",
    "Electric Resistance",
    "Electric Power",
    "Capacitance",
    "Inductance",
    "Electric Charge",
    "Magnetic Field Strength",
    "Illuminance",
    "Specific Heat Capacity",
    "Fuel Efficiency",
    "Fuel Consumption Cost Calculator",
    "Concentration",
    "Radiation Units",
    // "Molar Mass Calculator",
    // "Pressure Drop (engineering)",
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
    "Ingredient-Specific Converter",
    "Oven Temperature",
  ],
  "Transport & Automotive Converters": [
    "Mileage / Distance Calculator",
    "Tire Size Converter",
    "Engine Power",
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
    "Number System Converter",
    "Text Case Converter",
    "Roman Numeral Converter",
  ],
};

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
    return currentConverter.calculate(values);
  }

  switch (categoryName) {
    case "File Size Calculator": {
      const duration = parseFloat(values.Duration);
      const bitrate = parseFloat(values.Bitrate);
      const size = parseFloat(values.Size);

      const numValidInputs = [duration, bitrate, size].filter(
        (val) => !isNaN(val)
      ).length;
      if (numValidInputs < 2) {
        return ""; // Require at least two inputs to attempt any calculation
      }

      if (!isNaN(duration) && !isNaN(bitrate) && duration > 0 && bitrate > 0) {
        return `Size: ${(duration * bitrate).toFixed(0)} bits`;
      } else if (!isNaN(size) && !isNaN(bitrate) && size > 0 && bitrate > 0) {
        return `Duration: ${(size / bitrate).toFixed(2)} seconds`;
      } else if (!isNaN(size) && !isNaN(duration) && size > 0 && duration > 0) {
        return `Bitrate: ${(size / duration).toFixed(2)} bps`;
      }
      return "Enter at least two valid positive values";
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
      const fuelPrice = parseFloat(values["Fuel Price"]);

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

export default function UniversalUnitConverterClient() {
	const [selectedCategory, setSelectedCategory] = useState("Length / Distance");
	const [value, setValue] = useState("1");
	const [fromUnit, setFromUnit] = useState("m");
	const [toUnit, setToUnit] = useState("ft");
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
		} else {
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
  
	  return () => {
		if (intervalId) clearInterval(intervalId);
	  };
	}, [calculatorValues, selectedCategory]);
  
	const handleCategoryChange = (category) => {
	  setSelectedCategory(category);
	  const converter = converters[category];
	  if (converter.type === "unit") {
		setValue("1");
		setFromUnit(converter.units[0]);
		setToUnit(converter.units[1] || converter.units[0]);
		setCalculatorValues({});
		setCalculatorResult(null);
	  } else {
		setValue(""); // For calculators, value input is not generally used the same way
		setFromUnit("");
		setToUnit("");
		// Initialize calculator inputs with empty strings for text/date/time or default for select
		const initialCalcValues = {};
		converter.inputs.forEach((input) => {
		  if (input.unit === "select") {
			initialCalcValues[input.name] = input.options[0];
		  } else {
			initialCalcValues[input.name] = "";
		  }
		});
		setCalculatorValues(initialCalcValues);
		setCalculatorResult(null);
	  }
  
	  // Specific defaults for Currency Converter
	  if (category === "Currency Converter") {
		setValue("1");
		setFromUnit("USD");
		setToUnit("PKR");
	  }
	};
  
	const handleSearch = (query) => {
	  setSearchQuery(query);
	  const match = query.match(
		/([\d.]+)\s*([^\d\s]+)\s*(?:to|in)\s*([^\d\s]+)/i
	  );
  
	  if (match) {
		const val = match[1];
		const from = match[2].trim();
		const to = match[3].trim();
  
		for (const [cat, conv] of Object.entries(converters)) {
		  if (
			conv.type === "unit" &&
			Array.isArray(conv.units) && // Ensure conv.units is an array
			conv.units.includes(from) &&
			conv.units.includes(to)
		  ) {
			setSelectedCategory(cat);
			setValue(val);
			setFromUnit(from);
			setToUnit(to);
			setSearchQuery("");
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
					fontSize: "24px",
					fontWeight: "bold",
					color: "#1E3A8A",
					margin: 0,
				  }}
				>
				  Universal Unit Converter
				</h1>
			  </Stack>
	
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
				  placeholder='Try: "25 °C to °F" or "5 kg to lb"'
				  value={searchQuery}
				  onChange={(e) => setSearchQuery(e.target.value)}
				  onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
				  style={{
					width: "100%",
					padding: "10px 12px 10px 40px",
					border: "2px solid #1E3A8A",
					borderRadius: "12px",
					outline: "none",
					fontSize: "14px",
				  }}
				/>
			  </div>
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
				{Object.entries(categoryGroups).map(([group, categories]) => (
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
					  {expandedGroups[group] ? (
						<ChevronUp size={18} />
					  ) : (
						<ChevronDown size={18} />
					  )}
					</button>
					{expandedGroups[group] && (
					  <div style={{ paddingTop: "8px" }}>
						{categories.map((category) => (
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
				))}
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
				}}
			  >
				<h2
				  style={{
					fontSize: "20px",
					fontWeight: "bold",
					color: theme.palette.primary.main,
					marginBottom: "24px",
					marginTop: 0,
				  }}
				>
				  {selectedCategory}
				</h2>
	
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
	
					{/* From Unit */}
					<div style={{ marginBottom: "16px" }}>
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
						margin: "16px 0",
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
					<div style={{ marginBottom: "24px" }}>
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
				  </>
				) : (
				  <>
					{/* Calculator Inputs */}
					{currentConverter.inputs.map((input) =>
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
							  {input.options.map((option) => (
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
	
				{/* Main Result - Your Color Scheme */}
				<div
				  style={{
					background: "#09123aea",
					borderRadius: "16px",
					padding: "24px",
					color: "#fff",
					position: "relative",
					cursor: "pointer", // Make it clickable to copy
				  }}
				  onClick={() => {
					const textToCopy =
					  currentConverter.type === "unit"
						? `${formatNumber(mainResult)} ${toUnit}`
						: String(calculatorResult).replace(/<[^>]*>?/gm, ""); // Remove HTML if present for calculator results
					copyToClipboard(textToCopy);
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
					  : "Calculation Result"}
				  </div>
				  <div
					style={{
					  fontSize: "36px",
					  fontWeight: "bold",
					  marginBottom: "8px",
					  wordBreak: "break-all",
					}}
				  >
					{currentConverter.type === "unit"
					  ? ratesLoading && selectedCategory === "Currency Converter"
						? "Loading rates..."
						: ratesError && selectedCategory === "Currency Converter"
						? ratesError
						: formatNumber(mainResult)
					  : (() => {
						  const resultText = String(calculatorResult); // Ensure it's a string
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
				</div>
				{(currentConverter.type !== "unit" ||
				  (currentConverter.type === "unit" && mainResult)) && (
				  <button
					onClick={() => {
					  const textToCopy =
						currentConverter.type === "unit"
						  ? `${formatNumber(mainResult)} ${toUnit}`
						  : String(calculatorResult).replace(/<[^>]*>?/gm, "");
					  copyToClipboard(textToCopy);
					}}
					style={{
					  marginTop: "10px",
					  width: "100%",
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
					<Copy size={18} /> Copy Result
				  </button>
				)}
			  </div>
			</div>
	
			{/* Results Table */}
			{currentConverter.type === "unit" && showAllResults && (
			  <div style={{ width: "320px", flexShrink: 0 }}>
				<div
				  style={{
					background: "#fff",
					borderRadius: "16px",
					padding: "16px",
					maxHeight: "calc(100vh - 130px)",
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
							gap: "8px",
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
