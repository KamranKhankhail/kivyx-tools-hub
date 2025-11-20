// "use client";
// import React, { useState, useEffect, useCallback } from "react";

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

// // API Configuration for Currency Converter
// const EXCHANGE_RATE_API_KEY = "07b08cdc2c129775d2b8f0c0"; // Your provided API key
// const EXCHANGE_RATE_API_BASE_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/`;

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
//     api: true, // Indicate that this converter requires API
//     units: ["USD", "EUR", "GBP", "JPY", "PKR", "CAD", "AUD", "INR"], // Currencies to display
//     convert: (value, from, to, allRates) => {
//       if (!allRates || Object.keys(allRates).length === 0) {
//         return "Loading rates...";
//       }
//       if (!allRates[from] || !allRates[to]) {
//         return "Invalid currency or rates not available.";
//       }

//       // ExchangeRate-API.com's /latest/USD endpoint provides rates where each rate
//       // is how many of that currency you get per 1 USD.
//       // E.g., allRates['EUR'] is the value of 1 USD in EUR.
//       // So, to convert 'value' from 'from' to 'to':
//       // 1. Convert 'value' from 'from' to USD: value / allRates[from]
//       // 2. Convert that USD value to 'to': (value / allRates[from]) * allRates[to]
//       const valueInUSD = value / allRates[from];
//       const convertedValue = valueInUSD * allRates[to];

//       return convertedValue;
//     },
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
//       { name: "From Time Zone", unit: "select", options: [] }, //
//       { name: "To Time Zone", unit: "select", options: [] }, //
//     ],
//     calculate: async (values) => {
//       const date = values["Date"];
//       const time = values["Time"];
//       const fromTimeZone = values["From Time Zone"];
//       const toTimeZone = values["To Time Zone"];

//       if (!date || !time || !fromTimeZone || !toTimeZone) {
//         return "Please fill all fields.";
//       }

//       try {
//         // Fetch datetime in the "From" time zone
//         const fromResponse = await fetch(
//           `https://worldtimeapi.org/api/timezone/${fromTimeZone}`
//         );
//         const fromData = await fromResponse.json();

//         if (fromData.error) {
//           return `Error in From Time Zone: ${fromData.error}`;
//         }

//         // Combine user's date and time with the 'from' timezone's offset to create a UTC datetime string
//         // This is a simplified approach. A full-fledged solution would involve a date library.
//         const userDateTime = new Date(`${date}T${time}:00`); // Assuming input time is local to 'from' timezone
//         const fromOffsetSeconds =
//           fromData.raw_offset + (fromData.dst ? fromData.dst_offset : 0);
//         const userDateTimeUTC = new Date(
//           userDateTime.getTime() - fromOffsetSeconds * 1000
//         );

//         // Fetch datetime in the "To" time zone
//         const toResponse = await fetch(
//           `https://worldtimeapi.org/api/timezone/${toTimeZone}`
//         );
//         const toData = await toResponse.json();

//         if (toData.error) {
//           return `Error in To Time Zone: ${toData.error}`;
//         }

//         const toOffsetSeconds =
//           toData.raw_offset + (toData.dst ? toData.dst_offset : 0);
//         const convertedDateTime = new Date(
//           userDateTimeUTC.getTime() + toOffsetSeconds * 1000
//         );

//         const convertedDate = convertedDateTime.toISOString().split("T")[0];
//         const convertedTime = convertedDateTime
//           .toTimeString()
//           .split(" ")[0]
//           .substring(0, 5);

//         return `Converted Time: ${convertedDate} ${convertedTime} (${toTimeZone})`;
//       } catch (error) {
//         console.error("Time zone conversion error:", error);
//         return "Error during conversion. Check timezones or network.";
//       }
//     },
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
//             // Further refine validation for subtractive pairs: only I can precede V or X, X can precede L or C, C can precede D or M.
//             // And each can only do so once.
//             if (
//               (current === 1 && (next === 5 || next === 10)) || // IV, IX
//               (current === 10 && (next === 50 || next === 100)) || // XL, XC
//               (current === 100 && (next === 500 || next === 1000)) // CD, CM
//             ) {
//               num += next - current;
//               i++;
//             } else {
//               return NaN; // Invalid subtractive combination (e.g., IL, IC, XD, XM)
//             }
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

//   // NEW: Scientific Calculator
//   "Scientific Calculator": {
//     type: "calculator",
//     inputs: [], // No explicit inputs, managed internally
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
//     // "Illuminance",
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
//     // "Ingredient-Specific Converter",
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
//     "Scientific Calculator", // NEW: Added Scientific Calculator
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
// // Modified to accept exchangeRates for Currency Converter
// const convertValue = (value, from, to, categoryName, exchangeRates) => {
//   const converter = converters[categoryName];
//   if (!converter || converter.type !== "unit") return NaN;

//   if (converter.convert) {
//     // Pass exchangeRates specifically to the Currency Converter's convert function
//     if (categoryName === "Currency Converter" && converter.api) {
//       const result = converter.convert(value, from, to, exchangeRates); // Pass exchangeRates
//       if (typeof result === "string") return result; // Loading/error message
//       return isNaN(result) ? "Invalid conversion" : result;
//     } else {
//       const result = converter.convert(value, from, to);
//       if (typeof result === "string") return result;
//       return isNaN(result) ? "Invalid conversion" : result;
//     }
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
//     // For Time Zone Converter, the calculate function is async.
//     // We'll handle its call in useEffect and update state.
//     // For other custom calculators, call directly.
//     if (categoryName !== "Time Zone Converter") {
//       return currentConverter.calculate(values);
//     }
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
//       const fuelPrice = parseFloat(values.FuelPrice);

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

// export default function UniversalUnitConverterClient() {
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

//   // New state for currency exchange rates
//   const [exchangeRates, setExchangeRates] = useState({});
//   const [ratesLoading, setRatesLoading] = useState(false); // Set to false initially, only load when needed
//   const [ratesError, setRatesError] = useState(null);

//   // New state for Time Zone Converter
//   const [timezones, setTimezones] = useState([]);
//   const [timeZoneLoading, setTimeZoneLoading] = useState(false);
//   const [timeZoneError, setTimeZoneError] = useState(null);

//   // New states for Scientific Calculator
//   const [calcCurrentInput, setCalcCurrentInput] = useState("0"); // What's shown in the main display
//   const [calcExpression, setCalcExpression] = useState(""); // The full expression
//   const [calcResult, setCalcResult] = useState(null); // The result of the current expression
//   const [lastButtonWasEquals, setLastButtonWasEquals] = useState(false); // To handle chaining operations
//   const [trigMode, setTrigMode] = useState("rad"); // 'rad' or 'deg'
//   const [inverseMode, setInverseMode] = useState(false); // true for Inv functions

//   const currentConverter = converters[selectedCategory];

//   const numValue = parseFloat(value) || 0;
//   const mainResult =
//     currentConverter.type === "unit"
//       ? convertValue(
//           numValue,
//           fromUnit,
//           toUnit,
//           selectedCategory,
//           exchangeRates
//         ) // Pass exchangeRates
//       : null;

//   const allResults =
//     currentConverter.type === "unit"
//       ? currentConverter.units.map((unit) => ({
//           unit,
//           value: convertValue(
//             numValue,
//             fromUnit,
//             unit,
//             selectedCategory,
//             exchangeRates // Pass exchangeRates here too
//           ),
//         }))
//       : [];

//   // Helper to evaluate scientific expressions
//   const evaluateScientificExpression = useCallback(
//     (expression) => {
//       try {
//         if (!expression.trim()) return "";

//         let cleanedExpression = expression;

//         // --- Implicit Multiplication ---
//         // Cases: Number followed by π, Number followed by function, ) followed by Number, π followed by (
//         cleanedExpression = cleanedExpression
//           .replace(/(\d+)(π)/g, "$1*$2") // e.g., 2π -> 2*π
//           .replace(/(\d+)([a-zA-Z]+\()/g, "$1*$2") // e.g., 2sin( -> 2*sin(
//           .replace(/(\))(\d+)/g, "$1*$2") // e.g., (2+3)5 -> (2+3)*5
//           .replace(/(π)(\()/g, "$1*$2") // e.g., π(2) -> π*(2)
//           .replace(
//             /(\d+\.?\d*)\s*(?:e|E)\s*(\-?\d+)/g,
//             (match, p1, p2) =>
//               `${parseFloat(p1)}*Math.pow(10,${parseInt(p2, 10)})`
//           ); // Handle scientific notation like 2e3

//         // --- Function mapping and trig mode ---
//         cleanedExpression = cleanedExpression
//           .replace(/sin\(/g, `Math.${inverseMode ? "asin" : "sin"}(`)
//           .replace(/cos\(/g, `Math.${inverseMode ? "acos" : "cos"}(`)
//           .replace(/tan\(/g, `Math.${inverseMode ? "atan" : "tan"}(`)
//           .replace(/log\(/g, `Math.${inverseMode ? "pow(10," : "log10"}(`) // log base 10
//           .replace(/ln\(/g, `Math.${inverseMode ? "exp" : "log"}(`) // natural log (ln)
//           .replace(/sqrt\(/g, "Math.sqrt(")
//           .replace(/exp\(/g, "Math.exp(") // Explicit exp() for e^x
//           .replace(/\^/g, "**")
//           .replace(/π/g, "Math.PI");

//         // Convert degrees to radians if trigMode is 'deg' for trigonometric functions
//         if (trigMode === "deg") {
//           cleanedExpression = cleanedExpression.replace(
//             /(Math\.(?:sin|cos|tan)\([^)]*\))/g,
//             (match) => {
//               const arg = match.substring(
//                 match.indexOf("(") + 1,
//                 match.lastIndexOf(")")
//               );
//               // Temporarily evaluate the argument to convert it to radians
//               // This is a simplified approach, a full parser would be more robust
//               let argInRadians;
//               try {
//                 argInRadians = (eval(arg) * Math.PI) / 180;
//               } catch {
//                 return "Error"; // If argument itself is invalid
//               }
//               return match.replace(arg, argInRadians);
//             }
//           );
//         }

//         // Auto-close any open parenthesis
//         const openParens = (cleanedExpression.match(/\(/g) || []).length;
//         const closeParens = (cleanedExpression.match(/\)/g) || []).length;
//         for (let i = 0; i < openParens - closeParens; i++) {
//           cleanedExpression += ")";
//         }

//         // Attempt to evaluate
//         // Using a Function constructor for safer evaluation than direct eval
//         const result = Function(
//           `"use strict"; return (${cleanedExpression})`
//         )();

//         if (isNaN(result) || !isFinite(result)) {
//           return "Error";
//         }
//         return String(result);
//       } catch (e) {
//         return "Error";
//       }
//     },
//     [trigMode, inverseMode]
//   );

//   // Effect for updating calculator results and fetching currency rates
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
//       } else if (selectedCategory === "Time Zone Converter") {
//         // Handle Time Zone Converter as it has an async calculate function
//         const updateTimeZoneConversion = async () => {
//           setCalculatorResult("Calculating...");
//           const result = await calculate(selectedCategory, calculatorValues);
//           setCalculatorResult(result);
//         };
//         updateTimeZoneConversion();
//       } else if (selectedCategory !== "Scientific Calculator") {
//         // Only run for non-scientific calculators
//         const result = calculate(selectedCategory, calculatorValues);
//         setCalculatorResult(result);
//       }
//     } else {
//       setCalculatorResult(null);
//     }

//     // Fetch currency rates when Currency Converter is selected
//     if (selectedCategory === "Currency Converter") {
//       const fetchRates = async () => {
//         setRatesLoading(true);
//         setRatesError(null);
//         try {
//           // Hardcode USD as the base for fetching, as per the example API call.
//           // The API returns conversion rates *from* the base currency (USD) to others.
//           const response = await fetch(`${EXCHANGE_RATE_API_BASE_URL}USD`);
//           const data = await response.json();

//           if (data.result === "success") {
//             setExchangeRates(data.conversion_rates);
//           } else {
//             setRatesError(
//               data["error-type"] || "Failed to fetch currency rates."
//             );
//             console.error("Error fetching currency rates:", data);
//           }
//         } catch (error) {
//           setRatesError("Network error or failed to fetch rates.");
//           console.error("Network error fetching currency rates:", error);
//         } finally {
//           setRatesLoading(false);
//         }
//       };
//       fetchRates();
//     }

//     // Fetch time zones when Time Zone Converter is selected
//     if (selectedCategory === "Time Zone Converter" && timezones.length === 0) {
//       const fetchTimezones = async () => {
//         setTimeZoneLoading(true);
//         setTimeZoneError(null);
//         try {
//           const response = await fetch("https://worldtimeapi.org/api/timezone");
//           const data = await response.json();
//           if (response.ok) {
//             setTimezones(data);
//           } else {
//             setTimeZoneError("Failed to fetch time zones.");
//             console.error("Error fetching time zones:", data);
//           }
//         } catch (error) {
//           setTimeZoneError("Network error or failed to fetch time zones.");
//           console.error("Network error fetching time zones:", error);
//         } finally {
//           setTimeZoneLoading(false);
//         }
//       };
//       fetchTimezones();
//     }

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [
//     calculatorValues,
//     selectedCategory,
//     timezones.length,
//     currentConverter,
//     evaluateScientificExpression,
//   ]); // Added evaluateScientificExpression

//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category);
//     const converter = converters[category];
//     if (converter.type === "unit") {
//       setValue("1");
//       setFromUnit(converter.units[0]);
//       setToUnit(converter.units[1] || converter.units[0]);
//       setCalculatorValues({});
//       setCalculatorResult(null);
//       // Reset scientific calculator states
//       setCalcCurrentInput("0");
//       setCalcExpression("");
//       setCalcResult(null);
//       setLastButtonWasEquals(false);
//       setTrigMode("rad");
//       setInverseMode(false);
//     } else {
//       setValue(""); // For calculators, value input is not generally used the same way
//       setFromUnit("");
//       setToUnit("");
//       // Reset scientific calculator states
//       setCalcCurrentInput("0");
//       setCalcExpression("");
//       setCalcResult(null);
//       setLastButtonWasEquals(false);
//       setTrigMode("rad");
//       setInverseMode(false);

//       // Initialize calculator inputs with empty strings for text/date/time or default for select
//       const initialCalcValues = {};
//       // Only iterate if inputs exist (Scientific Calculator has no explicit inputs)
//       if (converter.inputs) {
//         converter.inputs.forEach((input) => {
//           if (input.unit === "select") {
//             initialCalcValues[input.name] = input.options[0];
//           } else {
//             initialCalcValues[input.name] = "";
//           }
//         });
//       }
//       setCalculatorValues(initialCalcValues);
//       setCalculatorResult(null);
//     }

//     // Specific defaults for Currency Converter
//     if (category === "Currency Converter") {
//       setValue("1");
//       setFromUnit("USD");
//       setToUnit("PKR");
//     }

//     // Specific defaults for Time Zone Converter
//     if (category === "Time Zone Converter") {
//       // Set default values for date and time to current date and time
//       const now = new Date();
//       const year = now.getFullYear();
//       const month = (now.getMonth() + 1).toString().padStart(2, "0");
//       const day = now.getDate().toString().padStart(2, "0");
//       const hours = now.getHours().toString().padStart(2, "0");
//       const minutes = now.getMinutes().toString().padStart(2, "0");

//       setCalculatorValues({
//         Date: `${year}-${month}-${day}`,
//         Time: `${hours}:${minutes}`,
//         "From Time Zone": "Etc/UTC", // Default to UTC
//         "To Time Zone": "America/New_York", // Default to a common timezone
//       });
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

//   // Updated handleCalculatorButtonClick function with fixes
//   const handleCalculatorButtonClick = useCallback(
//     (buttonValue) => {
//       const operators = ["+", "-", "*", "/", "^"];
//       const scientificFunctions = [
//         "sin(",
//         "cos(",
//         "tan(",
//         "log(",
//         "ln(",
//         "sqrt(",
//         "exp(",
//         "asin(",
//         "acos(",
//         "atan(",
//       ];
//       const specialValues = ["π"];

//       let newExpression = calcExpression;
//       let newCurrentInput = calcCurrentInput;
//       let newLastButtonWasEquals = false;

//       // Helper function to count parenthesis
//       const countParens = (str) => {
//         const open = (str.match(/\(/g) || []).length;
//         const close = (str.match(/\)/g) || []).length;
//         return { open, close };
//       };

//       // Helper function to auto-close parenthesis
//       const autoCloseParens = (expr) => {
//         const { open, close } = countParens(expr);
//         let result = expr;
//         for (let i = 0; i < open - close; i++) {
//           result += ")";
//         }
//         return result;
//       };

//       if (buttonValue === "C") {
//         newCurrentInput = "0";
//         newExpression = "";
//         setCalcResult(null);
//       } else if (buttonValue === "Bksp") {
//         if (lastButtonWasEquals) {
//           newCurrentInput = "0";
//           newExpression = "";
//           setCalcResult(null);
//         } else if (newCurrentInput.length > 0 && newCurrentInput !== "0") {
//           newCurrentInput = newCurrentInput.slice(0, -1);
//           newExpression = newExpression.slice(0, -1);
//           if (newCurrentInput === "") {
//             newCurrentInput = "0";
//           }
//         } else if (newExpression.length > 0) {
//           newExpression = newExpression.slice(0, -1);
//         }
//       } else if (buttonValue === "=") {
//         newLastButtonWasEquals = true;
//         try {
//           // Auto-close any open parenthesis before evaluating
//           let finalExpression = autoCloseParens(newExpression);
//           const finalResult = evaluateScientificExpression(finalExpression);
//           if (finalResult !== "Error") {
//             newCurrentInput = formatNumber(parseFloat(finalResult));
//             newExpression = finalResult;
//             setCalcResult(null);
//           } else {
//             newCurrentInput = "Error";
//             newExpression = "";
//           }
//         } catch (e) {
//           newCurrentInput = "Error";
//           newExpression = "";
//         }
//       } else if (buttonValue === "±") {
//         if (newCurrentInput === "0" && newExpression === "") {
//           newCurrentInput = "-0";
//           newExpression = "-";
//         } else if (newCurrentInput.startsWith("-")) {
//           newCurrentInput = newCurrentInput.substring(1);
//           newExpression = newExpression.replace(/^-/, "");
//         } else {
//           newCurrentInput = "-" + newCurrentInput;
//           newExpression = "-" + newExpression;
//         }
//       } else if (buttonValue === "%") {
//         try {
//           // Apply % to the current input number
//           const currentValue = parseFloat(newCurrentInput);
//           if (!isNaN(currentValue)) {
//             const percentValue = currentValue / 100;
//             newCurrentInput = String(percentValue);
//             // Replace the last number in the expression with its percentage value
//             newExpression = newExpression.replace(
//               /(\d+\.?\d*)$/,
//               String(percentValue)
//             );
//           }
//         } catch (e) {
//           newCurrentInput = "Error";
//           newExpression = "";
//         }
//       } else if (buttonValue === "1/x") {
//         try {
//           let valueToReciprocal = newCurrentInput;
//           if (
//             lastButtonWasEquals &&
//             calcResult !== null &&
//             calcResult !== "Error"
//           ) {
//             valueToReciprocal = String(calcResult);
//           }

//           const currentValue = parseFloat(valueToReciprocal);
//           if (!isNaN(currentValue) && currentValue !== 0) {
//             newCurrentInput = String(1 / currentValue);
//             // If the expression ends with a number, replace that number with its reciprocal.
//             // Otherwise, apply 1/ to the entire current expression (e.g., if it's a function).
//             if (/\d$/.test(newExpression)) {
//               newExpression = newExpression.replace(
//                 /(\d+\.?\d*)$/,
//                 `(1/${currentValue})`
//               );
//             } else {
//               newExpression = `(1/${newExpression})`;
//             }
//           } else {
//             newCurrentInput = "Error";
//             newExpression = "";
//           }
//         } catch (e) {
//           newCurrentInput = "Error";
//           newExpression = "";
//         }
//       } else if (buttonValue === "x²") {
//         try {
//           const currentValue = parseFloat(newCurrentInput);
//           if (!isNaN(currentValue)) {
//             newCurrentInput = String(currentValue * currentValue);
//             if (/\d$/.test(newExpression)) {
//               newExpression = newExpression.replace(
//                 /(\d+\.?\d*)$/,
//                 `(${currentValue}**2)`
//               );
//             } else {
//               newExpression = `(${newExpression}**2)`;
//             }
//           } else {
//             newCurrentInput = "Error";
//             newExpression = "";
//           }
//         } catch (e) {
//           newCurrentInput = "Error";
//           newExpression = "";
//         }
//       } else if (buttonValue === "√") {
//         // If a number is currently displayed, multiply it by sqrt(
//         if (
//           calcCurrentInput !== "0" &&
//           !isNaN(parseFloat(calcCurrentInput)) &&
//           !operators.includes(calcExpression.slice(-1))
//         ) {
//           newExpression += "*sqrt(";
//           newCurrentInput = "sqrt(";
//         } else {
//           newExpression += "sqrt(";
//           newCurrentInput = "sqrt(";
//         }
//         newLastButtonWasEquals = false;
//       } else if (buttonValue === "Rad") {
//         setTrigMode("rad");
//         return;
//       } else if (buttonValue === "Deg") {
//         setTrigMode("deg");
//         return;
//       } else if (buttonValue === "Inv") {
//         setInverseMode((prev) => !prev);
//         return;
//       } else if (!isNaN(Number(buttonValue)) || buttonValue === ".") {
//         if (lastButtonWasEquals) {
//           newExpression = buttonValue;
//           newCurrentInput = buttonValue;
//         } else if (buttonValue === ".") {
//           if (!newCurrentInput.includes(".")) {
//             if (newCurrentInput === "0" || newCurrentInput === "") {
//               newCurrentInput = "0.";
//               newExpression += "0.";
//             } else {
//               newCurrentInput += ".";
//               newExpression += ".";
//             }
//           }
//         } else {
//           // If the last character in the expression is a closing parenthesis or π,
//           // and a number is pressed, it implies multiplication.
//           const lastChar = newExpression.slice(-1);
//           if (lastChar === ")" || lastChar === "π") {
//             newExpression += "*" + buttonValue;
//             newCurrentInput = buttonValue;
//           } else if (newCurrentInput === "0" && newExpression === "0") {
//             // If only "0" is present, replace it with the new digit
//             newCurrentInput = buttonValue;
//             newExpression = buttonValue;
//           } else if (
//             newCurrentInput === "0" &&
//             newExpression.endsWith("0") &&
//             operators.includes(newExpression.slice(-2, -1))
//           ) {
//             // Replace trailing "0" after an operator
//             newCurrentInput = buttonValue;
//             newExpression = newExpression.slice(0, -1) + buttonValue;
//           } else if (
//             scientificFunctions.some((fn) => newExpression.endsWith(fn))
//           ) {
//             // Inside a function call, just append the number
//             newCurrentInput =
//               newCurrentInput === "0"
//                 ? buttonValue
//                 : newCurrentInput + buttonValue;
//             newExpression += buttonValue;
//           } else if (newCurrentInput === "0") {
//             newCurrentInput = buttonValue;
//             // Only replace the last '0' if it's the beginning of a number or after an operator
//             const lastNumRegex = /(\D|^)0$/; // Matches a 0 preceded by non-digit or start of string
//             if (lastNumRegex.test(newExpression)) {
//               newExpression = newExpression.replace(
//                 lastNumRegex,
//                 `$1${buttonValue}`
//               );
//             } else {
//               newExpression += buttonValue;
//             }
//           } else {
//             newCurrentInput += buttonValue;
//             newExpression += buttonValue;
//           }
//         }
//       } else if (operators.includes(buttonValue)) {
//         // Auto-close open parenthesis before adding operator
//         const { open, close } = countParens(newExpression);
//         if (open > close) {
//           newExpression = autoCloseParens(newExpression);
//         }

//         if (lastButtonWasEquals) {
//           newExpression = calcExpression + buttonValue;
//         } else if (
//           newExpression.length > 0 &&
//           operators.includes(newExpression.slice(-1))
//         ) {
//           // Replace last operator if an operator is already there
//           newExpression = newExpression.slice(0, -1) + buttonValue;
//         } else {
//           newExpression += buttonValue;
//         }
//         newCurrentInput = "0";
//         newLastButtonWasEquals = false;
//       } else if (scientificFunctions.some((fn) => buttonValue.startsWith(fn))) {
//         let functionCall = buttonValue;
//         // If there's a current number input and it's not "0", assume implicit multiplication
//         if (
//           newCurrentInput !== "0" &&
//           !isNaN(parseFloat(newCurrentInput)) &&
//           !operators.includes(newExpression.slice(-1))
//         ) {
//           newExpression += "*" + functionCall;
//         } else {
//           newExpression += functionCall;
//         }
//         newCurrentInput = functionCall;
//         newLastButtonWasEquals = false;
//       } else if (buttonValue === "(" || buttonValue === ")") {
//         // If a number or 'π' precedes an opening parenthesis, add multiplication.
//         const lastChar = newExpression.slice(-1);
//         if (
//           buttonValue === "(" &&
//           (/\d/.test(lastChar) || lastChar === "π" || lastChar === ")")
//         ) {
//           newExpression += "*" + buttonValue;
//         } else {
//           newExpression += buttonValue;
//         }
//         newCurrentInput = buttonValue;
//         newLastButtonWasEquals = false;
//       } else if (specialValues.includes(buttonValue)) {
//         const lastChar = newExpression.slice(-1);
//         // If a number precedes π, add multiplication.
//         if (buttonValue === "π" && /\d/.test(lastChar)) {
//           newExpression += "*Math.PI";
//         } else {
//           newExpression += buttonValue === "π" ? "Math.PI" : buttonValue;
//         }
//         newCurrentInput = "π"; // Display 'π' directly
//         newLastButtonWasEquals = false;
//       }

//       setCalcExpression(newExpression);
//       setCalcCurrentInput(newCurrentInput);
//       setLastButtonWasEquals(newLastButtonWasEquals);

//       // Real-time evaluation
//       // Only attempt real-time evaluation if the expression doesn't end with an operator or an incomplete function
//       if (
//         newExpression &&
//         newExpression !== "Error" &&
//         !operators.includes(newExpression.slice(-1)) &&
//         !scientificFunctions.some((fn) =>
//           newExpression.endsWith(fn.slice(0, -1))
//         ) && // Check for incomplete function names
//         newExpression.slice(-1) !== "("
//       ) {
//         let evalExpression = newExpression;
//         // Don't auto-close for real-time eval, let user see incomplete functions
//         const realTimeEval = evaluateScientificExpression(evalExpression);
//         if (realTimeEval !== "Error") {
//           setCalcResult(formatNumber(parseFloat(realTimeEval)));
//         } else {
//           setCalcResult(null);
//         }
//       } else {
//         setCalcResult(null);
//       }
//     },
//     [
//       calcCurrentInput,
//       calcExpression,
//       lastButtonWasEquals,
//       evaluateScientificExpression,
//       calcResult,
//       trigMode,
//       inverseMode,
//     ]
//   );

//   // ... existing code ...

//   // Handle keyboard input
//   useEffect(() => {
//     if (selectedCategory !== "Scientific Calculator") return;

//     const handleKeyDown = (event) => {
//       const key = event.key;
//       const validKeys = [
//         "0",
//         "1",
//         "2",
//         "3",
//         "4",
//         "5",
//         "6",
//         "7",
//         "8",
//         "9",
//         "+",
//         "-",
//         "*",
//         "/",
//         ".",
//         "=",
//         "Enter",
//         "Backspace",
//         "Escape",
//         "(",
//         ")",
//         "p", // For Pi
//         "s", // For sin/asin
//         "c", // For cos/acos
//         "t", // For tan/atan
//         "l", // For log/ln
//         "q", // For sqrt
//         "^", // For x^y
//       ];

//       if (validKeys.includes(key)) {
//         event.preventDefault(); // Prevent default browser actions
//         if (key === "Enter") {
//           handleCalculatorButtonClick("=");
//         } else if (key === "Backspace") {
//           handleCalculatorButtonClick("Bksp");
//         } else if (key === "Escape") {
//           handleCalculatorButtonClick("C");
//         } else if (key === "p") {
//           handleCalculatorButtonClick("π");
//         } else if (key === "s") {
//           handleCalculatorButtonClick("sin(");
//         } else if (key === "c") {
//           handleCalculatorButtonClick("cos(");
//         } else if (key === "t") {
//           handleCalculatorButtonClick("tan(");
//         } else if (key === "l") {
//           // This might need more sophisticated handling if 'l' is for both log and ln,
//           // but for now, we'll map to 'ln(' as 'log' is usually 'log10'
//           if (inverseMode) {
//             handleCalculatorButtonClick("exp("); // e^x
//           } else {
//             handleCalculatorButtonClick("ln("); // ln
//           }
//         } else if (key === "q") {
//           handleCalculatorButtonClick("sqrt(");
//         } else {
//           handleCalculatorButtonClick(key);
//         }
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [selectedCategory, handleCalculatorButtonClick, inverseMode]);

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
//                 fontSize: "28px",
//                 fontWeight: "1000",
//                 color: theme.palette.primary.main,
//                 margin: 0,
//               }}
//             >
//               Universal Unit Converter
//             </h1>
//           </Stack>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "row",
//               gap: "30px",
//               alignItems: "center",
//             }}
//           >
//             {" "}
//             <h2
//               style={{
//                 fontSize: "24px",
//                 fontWeight: "bold",
//                 color: theme.palette.primary.main,
//               }}
//             >
//               {selectedCategory}
//             </h2>
//             <div style={{ position: "relative", flex: "0 0 400px" }}>
//               <Search
//                 style={{
//                   position: "absolute",
//                   left: "12px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   width: "20px",
//                   height: "20px",
//                   color: "#9CA3AF",
//                 }}
//               />
//               <input
//                 type="text"
//                 placeholder='Try: "25 °C to °F" or "5 kg to lb"'
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyDown={(e) =>
//                   e.key === "Enter" && handleSearch(searchQuery)
//                 }
//                 className="border"
//                 style={{
//                   width: "100%",
//                   padding: "10px 12px 10px 40px",
//                   borderColor: theme.palette.primary.main,
//                   borderRadius: "12px",
//                   outline: "none",
//                   fontSize: "14px",
//                 }}
//               />
//             </div>
//           </Box>
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
//             {Object.entries(categoryGroups)
//               .filter(([group, categories]) => {
//                 const lowerCaseQuery = searchQuery.toLowerCase();
//                 if (group.toLowerCase().includes(lowerCaseQuery)) return true;
//                 return categories.some((category) =>
//                   category.toLowerCase().includes(lowerCaseQuery)
//                 );
//               })
//               .map(([group, categories]) => (
//                 <div key={group} style={{ marginBottom: "8px" }}>
//                   <button
//                     onClick={() => toggleGroup(group)}
//                     style={{
//                       width: "100%",
//                       padding: "12px",
//                       background:
//                         "radial-gradient(278.82% 508.63% at -133.28% -141.92%, rgba(204, 230, 230, 0.93) 0%, #09123A 70%, #80C0C0 100%)",
//                       color: theme.palette.primary.fourthMain,
//                       border: "none",
//                       borderRadius: "12px",
//                       fontWeight: "bold",
//                       cursor: "pointer",
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       fontSize: "14px",
//                     }}
//                   >
//                     {group}
//                     {expandedGroups[group] ||
//                     (searchQuery.length > 0 && // Auto-expand if there's a search query
//                       (group
//                         .toLowerCase()
//                         .includes(searchQuery.toLowerCase()) ||
//                         categories.some((category) =>
//                           category
//                             .toLowerCase()
//                             .includes(searchQuery.toLowerCase())
//                         ))) ? (
//                       <ChevronUp size={18} />
//                     ) : (
//                       <ChevronDown size={18} />
//                     )}
//                   </button>
//                   {(expandedGroups[group] ||
//                     (searchQuery.length > 0 && // Auto-expand if there's a search query
//                       (group
//                         .toLowerCase()
//                         .includes(searchQuery.toLowerCase()) ||
//                         categories.some((category) =>
//                           category
//                             .toLowerCase()
//                             .includes(searchQuery.toLowerCase())
//                         )))) && (
//                     <div style={{ paddingTop: "8px" }}>
//                       {categories
//                         .filter((category) =>
//                           category
//                             .toLowerCase()
//                             .includes(searchQuery.toLowerCase())
//                         )
//                         .map((category) => (
//                           <button
//                             key={category}
//                             onClick={() => handleCategoryChange(category)}
//                             style={{
//                               width: "100%",
//                               padding: "10px 12px",
//                               background:
//                                 selectedCategory === category
//                                   ? "#DBEAFE"
//                                   : "transparent",
//                               color: theme.palette.primary.main,

//                               border: "none",
//                               borderRadius: "8px",
//                               cursor: "pointer",
//                               textAlign: "left",
//                               marginBottom: "4px",
//                               fontSize: "13px",
//                               transition: "all 0.2s",
//                             }}
//                             onMouseEnter={(e) => {
//                               if (selectedCategory !== category) {
//                                 e.target.style.background = "#DBEAFE";
//                               }
//                             }}
//                             onMouseLeave={(e) => {
//                               if (selectedCategory !== category) {
//                                 e.target.style.background = "transparent";
//                               }
//                             }}
//                           >
//                             {category}
//                           </button>
//                         ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
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
//               width:
//                 selectedCategory === "Scientific Calculator" ? "70%" : "100%",
//             }}
//           >
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
//                 <Stack
//                   direction="row"
//                   spacing={2}
//                   sx={{ alignItems: "end", my: "25px" }}
//                 >
//                   {" "}
//                   <div style={{ flex: 1 }}>
//                     <label
//                       style={{
//                         display: "block",
//                         fontSize: "14px",
//                         fontWeight: "500",
//                         color: theme.palette.primary.main,
//                         marginBottom: "8px",
//                       }}
//                     >
//                       From
//                     </label>
//                     <select
//                       value={fromUnit}
//                       onChange={(e) => setFromUnit(e.target.value)}
//                       className="border"
//                       style={{
//                         width: "100%",
//                         padding: "12px",
//                         borderColor: theme.palette.primary.main,
//                         borderRadius: "12px",
//                         fontSize: "16px",
//                         outline: "none",
//                         cursor: "pointer",
//                       }}
//                     >
//                       {currentConverter.units.map((unit) => (
//                         <option key={unit} value={unit}>
//                           {unit}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   {/* Swap Button */}
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <button
//                       onClick={swapUnits}
//                       style={{
//                         padding: "12px",
//                         background: theme.palette.primary.main,
//                         border: "none",
//                         borderRadius: "50%",
//                         cursor: "pointer",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         transition: "all 0.2s",
//                       }}
//                     >
//                       <ArrowRightLeft
//                         size={20}
//                         color={theme.palette.primary.fourthMain}
//                       />
//                     </button>
//                   </div>
//                   {/* To Unit */}
//                   <div style={{ flex: 1 }}>
//                     <label
//                       style={{
//                         display: "block",
//                         fontSize: "14px",
//                         fontWeight: "500",
//                         color: theme.palette.primary.main,
//                         marginBottom: "8px",
//                       }}
//                     >
//                       To
//                     </label>
//                     <select
//                       value={toUnit}
//                       onChange={(e) => setToUnit(e.target.value)}
//                       className="border"
//                       style={{
//                         width: "100%",
//                         padding: "12px",
//                         borderColor: theme.palette.primary.main,
//                         borderRadius: "12px",
//                         fontSize: "16px",
//                         outline: "none",
//                         cursor: "pointer",
//                       }}
//                     >
//                       {currentConverter.units.map((unit) => (
//                         <option key={unit} value={unit}>
//                           {unit}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </Stack>
//                 {/* From Unit */}
//               </>
//             ) : (
//               <>
//                 {/* Calculator Inputs (excluding Scientific Calculator) */}
//                 {selectedCategory !== "Scientific Calculator" &&
//                   currentConverter.inputs.map((input) =>
//                     input.optional &&
//                     input.dependsOn &&
//                     calculatorValues[input.dependsOn] !==
//                       input.dependsOnValue ? null : (
//                       <div key={input.name} style={{ marginBottom: "20px" }}>
//                         <label
//                           style={{
//                             display: "block",
//                             fontSize: "14px",
//                             fontWeight: "500",
//                             color: theme.palette.primary.main,
//                             marginBottom: "8px",
//                           }}
//                         >
//                           {input.name}{" "}
//                           {input.unit && input.unit !== "select"
//                             ? `(${input.unit})`
//                             : ""}
//                         </label>
//                         {input.unit === "select" ? (
//                           <select
//                             value={
//                               calculatorValues[input.name] || input.options[0]
//                             }
//                             onChange={(e) =>
//                               handleCalculatorInputChange(
//                                 input.name,
//                                 e.target.value
//                               )
//                             }
//                             className="border"
//                             style={{
//                               width: "100%",
//                               padding: "12px 16px",
//                               borderColor: theme.palette.primary.main,
//                               borderRadius: "12px",
//                               fontSize: "16px",
//                               outline: "none",
//                             }}
//                           >
//                             {/* Render timezones if available and for Time Zone Converter */}
//                             {input.name === "From Time Zone" ||
//                             input.name === "To Time Zone"
//                               ? timeZoneLoading
//                                 ? [
//                                     <option key="loading" value="">
//                                       Loading time zones...
//                                     </option>,
//                                   ]
//                                 : timeZoneError
//                                 ? [
//                                     <option key="error" value="">
//                                       Error loading time zones
//                                     </option>,
//                                   ]
//                                 : timezones.map((tz) => (
//                                     <option key={tz} value={tz}>
//                                       {tz}
//                                     </option>
//                                   ))
//                               : // Original options rendering for other select inputs
//                                 input.options.map((option) => (
//                                   <option key={option} value={option}>
//                                     {option}
//                                   </option>
//                                 ))}
//                           </select>
//                         ) : (
//                           <input
//                             type={
//                               (input.unit && input.unit.includes("date")) ||
//                               (input.unit && input.unit.includes("time"))
//                                 ? input.unit
//                                 : input.unit === "number"
//                                 ? "number"
//                                 : "text" // Explicitly set type to number for numerical inputs
//                             }
//                             value={calculatorValues[input.name] || ""}
//                             onChange={(e) =>
//                               handleCalculatorInputChange(
//                                 input.name,
//                                 e.target.value
//                               )
//                             }
//                             className="border"
//                             style={{
//                               width: "100%",
//                               padding: "12px 16px",
//                               borderColor: theme.palette.primary.main,
//                               borderRadius: "12px",
//                               color: theme.palette.primary.main,
//                               fontSize: "16px",
//                               outline: "none",
//                             }}
//                             placeholder={`Enter ${input.name}`}
//                           />
//                         )}
//                       </div>
//                     )
//                   )}
//               </>
//             )}

//             {/* Main Result / Calculator Display Area */}
//             <div
//               style={{
//                 background: "#09123aea",
//                 borderRadius: "16px",
//                 padding: "24px",
//                 color: "#fff",
//                 position: "relative",

//                 cursor:
//                   selectedCategory === "Scientific Calculator"
//                     ? "default"
//                     : "pointer", // No copy on click for calculator
//               }}
//               onClick={() => {
//                 if (selectedCategory !== "Scientific Calculator") {
//                   // Only copy on click for non-calculator types
//                   const textToCopy =
//                     currentConverter.type === "unit"
//                       ? `${formatNumber(mainResult)} ${toUnit}`
//                       : String(calculatorResult).replace(/<[^>]*>?/gm, "");
//                   copyToClipboard(textToCopy);
//                 }
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
//                   : selectedCategory === "Scientific Calculator"
//                   ? "Calculator Output"
//                   : "Calculation Result"}
//               </div>
//               {selectedCategory === "Scientific Calculator" && (
//                 <button
//                   onClick={() => {
//                     const textToCopy =
//                       calcResult !== null && calcResult !== "Error"
//                         ? String(calcResult)
//                         : calcCurrentInput;
//                     copyToClipboard(textToCopy);
//                   }}
//                   style={{
//                     position: "absolute",
//                     right: 10,
//                     top: 10,
//                     padding: "12px",
//                     background:
//                       "radial-gradient(278.82% 508.63% at -133.28% -141.92%, rgba(204, 230, 230, 0.93) 0%, #09123A 50%, #80C0C0 100%)",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: "12px",
//                     fontSize: "16px",
//                     fontWeight: "bold",
//                     cursor: "pointer",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: "8px",
//                     transition: "background-color 0.2s",
//                   }}
//                   onMouseEnter={(e) =>
//                     (e.target.style.backgroundColor = "#3B82F6")
//                   }
//                   onMouseLeave={(e) =>
//                     (e.target.style.backgroundColor = "#1E3A8A")
//                   }
//                 >
//                   <Copy size={18} /> Copy Calculation
//                 </button>
//               )}
//               <div
//                 style={{
//                   fontSize:
//                     selectedCategory === "Scientific Calculator"
//                       ? "1.2em"
//                       : "36px", // Smaller font for expression
//                   opacity:
//                     selectedCategory === "Scientific Calculator" ? 0.7 : 0.9,
//                   wordBreak: "break-all",
//                   marginBottom:
//                     selectedCategory === "Scientific Calculator"
//                       ? "5px"
//                       : "8px",
//                 }}
//               >
//                 {selectedCategory === "Scientific Calculator"
//                   ? calcExpression
//                   : ""}
//               </div>
//               <div
//                 style={{
//                   fontSize:
//                     selectedCategory === "Scientific Calculator"
//                       ? "2.5em"
//                       : "36px",
//                   fontWeight: "bold",
//                   wordBreak: "break-all",
//                 }}
//               >
//                 {currentConverter.type === "unit"
//                   ? ratesLoading && selectedCategory === "Currency Converter"
//                     ? "Loading rates..."
//                     : ratesError && selectedCategory === "Currency Converter"
//                     ? ratesError
//                     : formatNumber(mainResult)
//                   : selectedCategory === "Scientific Calculator"
//                   ? calcResult !== null && calcResult !== "Error"
//                     ? formatNumber(calcResult)
//                     : formatNumber(calcCurrentInput)
//                   : (() => {
//                       const resultText = String(calculatorResult); // Ensure it's a string
//                       if (
//                         selectedCategory === "Time Zone Converter" &&
//                         timeZoneLoading
//                       ) {
//                         return "Loading time zones...";
//                       }
//                       if (
//                         selectedCategory === "Time Zone Converter" &&
//                         timeZoneError
//                       ) {
//                         return timeZoneError;
//                       }
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
//                 {currentConverter.type === "unit" &&
//                 !ratesLoading &&
//                 !ratesError
//                   ? toUnit
//                   : ""}
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
//               {(currentConverter.type !== "unit" ||
//                 (currentConverter.type === "unit" && mainResult)) &&
//                 selectedCategory !== "Scientific Calculator" && (
//                   <button
//                     onClick={() => {
//                       const textToCopy =
//                         currentConverter.type === "unit"
//                           ? `${formatNumber(mainResult)} ${toUnit}`
//                           : String(calculatorResult).replace(/<[^>]*>?/gm, "");
//                       copyToClipboard(textToCopy);
//                     }}
//                     style={{
//                       position: "absolute",
//                       top: 10,
//                       right: 10,

//                       padding: "12px",
//                       background:
//                         "radial-gradient(278.82% 508.63% at -133.28% -141.92%, rgba(204, 230, 230, 0.93) 0%, #09123A 50%, #80C0C0 100%)",
//                       color: "#fff",
//                       border: "none",
//                       borderRadius: "12px",
//                       fontSize: "16px",
//                       fontWeight: "bold",
//                       cursor: "pointer",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: "8px",
//                       transition: "background-color 0.2s",
//                     }}
//                     // onMouseEnter={(e) =>
//                     //   (e.target.style.backgroundColor = "#3B82F6")
//                     // }
//                     // onMouseLeave={(e) =>
//                     //   (e.target.style.backgroundColor = "#1E3A8A")
//                     // }
//                   >
//                     <Copy size={18} /> Copy Result
//                   </button>
//                 )}
//             </div>

//             {/* Scientific Calculator Buttons */}
//             {/* Scientific Calculator Buttons - Google Style */}
//             {selectedCategory === "Scientific Calculator" && (
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "12px",
//                   marginTop: "16px",
//                 }}
//               >
//                 {/* First Row: Rad, Deg, xl, (, ), %, AC */}
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(7, 1fr)",
//                     gap: "8px",
//                   }}
//                 >
//                   {[
//                     // { label: "Rad", value: "Rad", type: "mode" },
//                     // { label: "Deg", value: "Deg", type: "mode" },
//                     { label: "x²", value: "x²", type: "utility" },
//                     { label: "x!", value: "!", type: "operator" }, // Factorial not implemented yet
//                     { label: "(", value: "(", type: "paren" },
//                     { label: ")", value: ")", type: "paren" },
//                     { label: "AC", value: "AC", type: "clear" },
//                     { label: "Bksp", value: "Bksp", type: "clear" },
//                     { label: "÷", value: "/", type: "operator" },
//                   ].map((btn) => (
//                     <button
//                       key={btn.value}
//                       style={{
//                         padding: "18px 8px",
//                         fontSize: "16px",
//                         borderRadius: "8px",
//                         border: "none",
//                         background: theme.palette.primary.main,
//                         color: "#fff",
//                         cursor: "pointer",
//                         fontWeight: "500",
//                         transition: "all 0.2s",
//                       }}
//                       onMouseEnter={(e) => {
//                         (e.target.style.background =
//                           theme.palette.secondary.secondMain),
//                           (e.target.style.color = theme.palette.primary.main);
//                       }}
//                       onMouseLeave={(e) => {
//                         (e.target.style.background =
//                           theme.palette.primary.main),
//                           (e.target.style.color =
//                             theme.palette.primary.fourthMain);
//                       }}
//                       onClick={() => {
//                         if (btn.value === "AC") {
//                           handleCalculatorButtonClick("C");
//                         } else if (btn.type === "mode") {
//                           handleCalculatorButtonClick(btn.value);
//                         } else if (btn.value === "!") {
//                           // Factorial needs to be implemented
//                         } else {
//                           handleCalculatorButtonClick(btn.value);
//                         }
//                       }}
//                     >
//                       {btn.label}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Second Row: Inv, sin, ln, 7, 8, 9, ÷ */}
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(7, 1fr)",
//                     gap: "8px",
//                   }}
//                 >
//                   {[
//                     // { label: "Inv", value: "Inv", type: "mode" },
//                     { label: "%", value: "%", type: "operator" },
//                     {
//                       label: inverseMode ? "sin⁻¹" : "sin",
//                       value: "sin(",
//                       type: "function",
//                     },
//                     {
//                       label: inverseMode ? "eˣ" : "ln",
//                       value: inverseMode ? "exp(" : "ln(",
//                       type: "function",
//                     },
//                     { label: "7", value: "7", type: "number" },
//                     { label: "8", value: "8", type: "number" },
//                     { label: "9", value: "9", type: "number" },
//                     { label: "+", value: "+", type: "operator" },
//                   ].map((btn) => (
//                     <button
//                       key={btn.value}
//                       style={{
//                         padding: "18px 8px",
//                         fontSize: "16px",
//                         borderRadius: "8px",
//                         border: "none",
//                         background: theme.palette.primary.main,
//                         // btn.value === "/"
//                         //   ? "#1E3A8A"
//                         //   : btn.value === "Inv"
//                         //   ? inverseMode
//                         //     ? "#80C0C0"
//                         //     : "#2D3E5F"
//                         //   : ["7", "8", "9"].includes(btn.value)
//                         //   ? "#3A4A5C"
//                         //   : "#2D3E5F",
//                         color: "#fff",
//                         cursor: "pointer",
//                         fontWeight: ["7", "8", "9"].includes(btn.value)
//                           ? "normal"
//                           : "500",
//                         transition: "all 0.2s",
//                       }}
//                       onMouseEnter={(e) => {
//                         (e.target.style.background =
//                           theme.palette.secondary.secondMain),
//                           (e.target.style.color = theme.palette.primary.main);
//                       }}
//                       onMouseLeave={(e) => {
//                         (e.target.style.background =
//                           theme.palette.primary.main),
//                           (e.target.style.color =
//                             theme.palette.primary.fourthMain);
//                       }}
//                       onClick={() => {
//                         handleCalculatorButtonClick(btn.value);
//                       }}
//                     >
//                       {btn.label}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Third Row: π, cos, log, 4, 5, 6, × */}
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(7, 1fr)",
//                     gap: "8px",
//                   }}
//                 >
//                   {[
//                     { label: "π", value: "π", type: "value" },
//                     {
//                       label: inverseMode ? "cos⁻¹" : "cos",
//                       value: "cos(",
//                       type: "function",
//                     },
//                     {
//                       label: inverseMode ? "10ˣ" : "log",
//                       value: inverseMode ? "pow(10," : "log(",
//                       type: "function",
//                     },
//                     { label: "4", value: "4", type: "number" },
//                     { label: "5", value: "5", type: "number" },
//                     { label: "6", value: "6", type: "number" },
//                     { label: "×", value: "*", type: "operator" },
//                   ].map((btn) => (
//                     <button
//                       key={btn.value}
//                       style={{
//                         padding: "18px 8px",
//                         fontSize: "16px",
//                         borderRadius: "8px",
//                         border: "none",
//                         // background: btn.value === "*" ? "#1E3A8A" : "#3A4A5C",
//                         background: theme.palette.primary.main,
//                         color: "#fff",
//                         cursor: "pointer",
//                         fontWeight: ["4", "5", "6"].includes(btn.value)
//                           ? "normal"
//                           : "500",
//                         transition: "all 0.2s",
//                       }}
//                       onMouseEnter={(e) => {
//                         (e.target.style.background =
//                           theme.palette.secondary.secondMain),
//                           (e.target.style.color = theme.palette.primary.main);
//                       }}
//                       onMouseLeave={(e) => {
//                         (e.target.style.background =
//                           theme.palette.primary.main),
//                           (e.target.style.color =
//                             theme.palette.primary.fourthMain);
//                       }}
//                       onClick={() => {
//                         handleCalculatorButtonClick(btn.value);
//                       }}
//                     >
//                       {btn.label}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Fourth Row: e, tan, √, 1, 2, 3, − */}
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(7, 1fr)",
//                     gap: "8px",
//                   }}
//                 >
//                   {[
//                     { label: "e", value: "Math.E", type: "value" }, // Euler's number
//                     {
//                       label: inverseMode ? "tan⁻¹" : "tan",
//                       value: "tan(",
//                       type: "function",
//                     },
//                     { label: "√", value: "sqrt(", type: "function" },
//                     { label: "1", value: "1", type: "number" },
//                     { label: "2", value: "2", type: "number" },
//                     { label: "3", value: "3", type: "number" },
//                     { label: "−", value: "-", type: "operator" },
//                   ].map((btn) => (
//                     <button
//                       key={btn.value}
//                       style={{
//                         padding: "18px 8px",
//                         fontSize: "16px",
//                         borderRadius: "8px",
//                         border: "none",
//                         background: theme.palette.primary.main,
//                         // background: btn.value === "-" ? "#1E3A8A" : "#3A4A5C",
//                         color: "#fff",
//                         cursor: "pointer",
//                         fontWeight: ["1", "2", "3"].includes(btn.value)
//                           ? "normal"
//                           : "500",
//                         transition: "all 0.2s",
//                       }}
//                       onMouseEnter={(e) => {
//                         (e.target.style.background =
//                           theme.palette.secondary.secondMain),
//                           (e.target.style.color = theme.palette.primary.main);
//                       }}
//                       onMouseLeave={(e) => {
//                         (e.target.style.background =
//                           theme.palette.primary.main),
//                           (e.target.style.color =
//                             theme.palette.primary.fourthMain);
//                       }}
//                       onClick={() => {
//                         handleCalculatorButtonClick(btn.value);
//                       }}
//                     >
//                       {btn.label}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Fifth Row: Ans, EXP, x^y, 0, ., =, + */}
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(7, 1fr)",
//                     gap: "8px",
//                   }}
//                 >
//                   {[
//                     { label: "Ans", value: "Ans", type: "memory" }, // Answer recall
//                     { label: "EXP", value: "exp(", type: "function" }, // e^x, same as inverse ln
//                     { label: "xʸ", value: "^", type: "operator" },
//                     { label: "0", value: "0", type: "number", span: 2 },
//                     { label: ".", value: ".", type: "number" },
//                     { label: "=", value: "=", type: "equals" },
//                   ].map((btn) => (
//                     <button
//                       key={btn.value}
//                       style={{
//                         padding: "18px 8px",
//                         fontSize: "16px",
//                         borderRadius: "8px",
//                         border: "none",
//                         background: theme.palette.primary.main,
//                         // btn.value === "=" || btn.value === "+"
//                         //   ? "#1E3A8A"
//                         //   : btn.value === "0"
//                         //   ? "#3A4A5C"
//                         //   : "#2D3E5F",
//                         color: "#fff",
//                         cursor: "pointer",
//                         fontWeight:
//                           btn.value === "0" || btn.value === "."
//                             ? "normal"
//                             : "500",
//                         transition: "all 0.2s",
//                         gridColumn: btn.span ? `span ${btn.span}` : "auto",
//                       }}
//                       onMouseEnter={(e) => {
//                         (e.target.style.background =
//                           theme.palette.secondary.secondMain),
//                           (e.target.style.color = theme.palette.primary.main);
//                       }}
//                       onMouseLeave={(e) => {
//                         (e.target.style.background =
//                           theme.palette.primary.main),
//                           (e.target.style.color =
//                             theme.palette.primary.fourthMain);
//                       }}
//                       onClick={() => {
//                         handleCalculatorButtonClick(btn.value);
//                       }}
//                     >
//                       {btn.label}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Advanced Row: 1/x, x², Bksp */}
//                 {/* <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(3, 1fr)",
//                     gap: "8px",
//                   }}
//                 >
//                   {[
//                     { label: "1/x", value: "1/x", type: "utility" },

//                   ].map((btn) => (
//                     <button
//                       key={btn.value}
//                       style={{
//                         padding: "12px 8px",
//                         fontSize: "0.9em",
//                         borderRadius: "8px",
//                         border: "none",
//                         background:
//                           btn.value === "Bksp" ? "#1E3A8A" : "#2D3E5F",
//                         color: "#fff",
//                         cursor: "pointer",
//                         fontWeight: "500",
//                         transition: "all 0.2s",
//                       }}
//                       onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
//                       onMouseLeave={(e) => (e.target.style.opacity = "1")}
//                       onClick={() => {
//                         handleCalculatorButtonClick(btn.value);
//                       }}
//                     >
//                       {btn.label}
//                     </button>
//                   ))}
//                 </div> */}
//               </div>
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
    keywords: ["distance", "length"],
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
    keywords: ["mass", "weight"],
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
    keywords: [
      "degree",
      "celsius",
      "fahrenheit",
      "kelvin",
      "hot",
      "cold",
      "temp",
    ],
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
    keywords: ["square", "land"],
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
    keywords: ["liquid", "capacity"],
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
    keywords: ["velocity"],
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
    keywords: ["seconds", "minutes", "hours", "days", "weeks", "years"],
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
    keywords: ["force", "barometric"],
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
    keywords: ["joules", "calories", "kilowatt", "btu"],
  },
  Power: {
    units: ["W", "kW", "MW", "hp", "BTU/h"],
    factors: { W: 1, kW: 1000, MW: 1000000, hp: 745.7, "BTU/h": 0.293071 },
    type: "unit",
    keywords: ["watt", "horsepower"],
  },
  Force: {
    units: ["N", "kN", "lbf", "dyn"],
    factors: { N: 1, kN: 1000, lbf: 4.44822, dyn: 0.00001 },
    type: "unit",
    keywords: ["newton", "pound-force"],
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
    keywords: ["radian", "degree", "gradient", "revolution"],
  },
  Density: {
    units: ["kg/m³", "g/cm³", "lb/ft³"],
    factors: { "kg/m³": 1, "g/cm³": 1000, "lb/ft³": 16.0185 },
    type: "unit",
    keywords: ["mass", "volume"],
  },
  Torque: {
    units: ["Nm", "lb-ft", "lb-in"],
    factors: { Nm: 1, "lb-ft": 1.35582, "lb-in": 0.112985 },
    type: "unit",
    keywords: ["newton-meter", "pound-foot"],
  },
  Acceleration: {
    units: ["m/s²", "g", "ft/s²"],
    factors: { "m/s²": 1, g: 9.80665, "ft/s²": 0.3048 },
    type: "unit",
    keywords: ["gravity"],
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
    keywords: ["bytes", "gigabytes", "megabytes", "terabytes"],
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
    keywords: ["bandwidth", "speed"],
  },
  Frequency: {
    units: ["Hz", "kHz", "MHz", "GHz"],
    factors: { Hz: 1, kHz: 1000, MHz: 1000000, GHz: 1000000000 },
    type: "unit",
    keywords: ["hertz"],
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
    units: ["A", "mA", "kA"],
    factors: { A: 1, mA: 0.001, kA: 1000 },
    type: "unit",
    keywords: ["ampere", "electricity"],
  },
  "Electric Resistance": {
    units: ["Ω", "kΩ", "MΩ"],
    factors: { Ω: 1, kΩ: 1000, MΩ: 1000000 },
    type: "unit",
    keywords: ["ohm", "electricity"],
  },
  "Electric Power": {
    units: ["W", "kW", "MW"],
    factors: { W: 1, kW: 1000, MW: 1000000 },
    type: "unit",
    keywords: ["watt", "electricity"],
  },
  Capacitance: {
    units: ["F", "μF", "pF"],
    factors: { F: 1, μF: 0.000001, pF: 0.000000000001 },
    type: "unit",
    keywords: ["farad"],
  },
  Inductance: {
    units: ["H", "mH", "μH"],
    factors: { H: 1, mH: 0.001, μH: 0.000001 },
    type: "unit",
    keywords: ["henry"],
  },
  "Electric Charge": {
    units: ["C", "mAh"],
    factors: { C: 1, mAh: 0.0036 },
    type: "unit",
    keywords: ["coulomb", "milliampere-hour", "battery"],
  },
  "Magnetic Field Strength": {
    units: ["T", "G"],
    factors: { T: 1, G: 0.0001 },
    type: "unit",
    keywords: ["tesla", "gauss"],
  },
  Illuminance: {
    units: ["lx", "lm"],
    convert: () =>
      "Requires surface area for conversion or distance from source.",
    type: "unit",
    keywords: ["lux", "lumen", "light"],
  },
  "Specific Heat Capacity": {
    units: ["J/kg·K", "cal/g·°C"],
    factors: { "J/kg·K": 1, "cal/g·°C": 4.184 },
    type: "unit",
    keywords: ["heat", "energy"],
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
    keywords: ["baking", "cooking", "heat"],
  },
  "Engine Power": {
    units: ["kW", "HP"],
    factors: { kW: 1, HP: 0.7457 },
    type: "unit",
    keywords: ["horsepower", "kilowatt"],
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
    keywords: ["solution", "chemistry"],
  },
  "Radiation Units": {
    units: ["Gy", "Sv"],
    factors: { Gy: 1, Sv: 1 },
    type: "unit",
    keywords: ["gray", "sievert"],
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
    keywords: ["gasoline", "petrol", "mileage"],
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
    keywords: ["recipe", "food"],
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
  "Molar Mass Calculator": {
    type: "calculator",
    inputs: [{ name: "Chemical Formula", unit: "text" }],
    calculate: () =>
      "Complex parsing of chemical formula and atomic weights required.",
    keywords: ["chemistry", "molecule"],
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
    keywords: ["fluid", "pipe", "engineering"],
  },

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
    keywords: ["roman", "numerals"],
  },

  // NEW: Scientific Calculator
  "Scientific Calculator": {
    type: "calculator",
    inputs: [], // No explicit inputs, managed internally
    keywords: ["math", "calculator", "science", "trigonometry"],
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
    // "Illuminance",
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
    // "Ingredient-Specific Converter",
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
    "Scientific Calculator", // NEW: Added Scientific Calculator
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
  const queryWords = lowerCaseQuery.split(" ").filter(Boolean); // Split query into words

  const results = [];

  for (const categoryName of Object.keys(allConverters)) {
    const converter = allConverters[categoryName];
    const lowerCaseCategoryName = categoryName.toLowerCase();
    let score = 0;

    // 1. Exact Category Name Match (Highest priority)
    if (lowerCaseCategoryName === lowerCaseQuery) {
      score = Math.max(score, 1000);
    }
    // 2. Starts With Category Name Match
    else if (lowerCaseCategoryName.startsWith(lowerCaseQuery)) {
      score = Math.max(score, 900);
    }
    // 3. Whole Word Match in Category Name
    else if (
      new RegExp(`\\b${lowerCaseQuery}\\b`).test(lowerCaseCategoryName)
    ) {
      score = Math.max(score, 850);
    }
    // 4. Any Query Word is a Whole Word in Category Name
    else if (
      queryWords.some((word) =>
        new RegExp(`\\b${word}\\b`).test(lowerCaseCategoryName)
      )
    ) {
      score = Math.max(score, 800);
    }
    // 5. Contains Match in Category Name (substring)
    else if (lowerCaseCategoryName.includes(lowerCaseQuery)) {
      score = Math.max(score, 700);
    }
    // 6. Match in dedicated keywords
    if (converter.keywords && Array.isArray(converter.keywords)) {
      if (
        converter.keywords.some((keyword) => {
          const lowerCaseKeyword = keyword.toLowerCase();
          return (
            lowerCaseKeyword === lowerCaseQuery || // Exact keyword match
            lowerCaseKeyword.startsWith(lowerCaseQuery) || // Keyword starts with query
            new RegExp(`\\b${lowerCaseQuery}\\b`).test(lowerCaseKeyword) || // Query is whole word in keyword
            lowerCaseKeyword.includes(lowerCaseQuery) || // Keyword contains query
            queryWords.some((word) =>
              new RegExp(`\\b${word}\\b`).test(lowerCaseKeyword)
            ) // Any query word is a whole word in keyword
          );
        })
      ) {
        score = Math.max(score, 600);
      }
    }

    // 7. Match in units (for unit converters)
    if (converter.type === "unit" && Array.isArray(converter.units)) {
      if (
        converter.units.some((unit) => {
          const lowerCaseUnit = unit.toLowerCase();
          return (
            lowerCaseUnit === lowerCaseQuery || // Exact unit match
            lowerCaseUnit.startsWith(lowerCaseQuery) || // Unit starts with query
            new RegExp(`\\b${lowerCaseQuery}\\b`).test(lowerCaseUnit) || // Query is whole word in unit
            lowerCaseUnit.includes(lowerCaseQuery) || // Unit contains query
            queryWords.some((word) =>
              new RegExp(`\\b${word}\\b`).test(lowerCaseUnit)
            ) // Any query word is a whole word in unit
          );
        })
      ) {
        score = Math.max(score, 500);
      }
    }

    // 8. Match in input names (for calculators)
    if (converter.type === "calculator" && Array.isArray(converter.inputs)) {
      if (
        converter.inputs.some((input) => {
          const lowerCaseInputName = input.name.toLowerCase();
          return (
            lowerCaseInputName === lowerCaseQuery || // Exact input name match
            lowerCaseInputName.startsWith(lowerCaseQuery) || // Input name starts with query
            new RegExp(`\\b${lowerCaseQuery}\\b`).test(lowerCaseInputName) || // Query is whole word in input name
            lowerCaseInputName.includes(lowerCaseQuery) || // Input name contains query
            queryWords.some((word) =>
              new RegExp(`\\b${word}\\b`).test(lowerCaseInputName)
            ) // Any query word is a whole word in input name
          );
        })
      ) {
        score = Math.max(score, 400);
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

  // Sort results: highest score first, then shortest name first for ties
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
  }, [selectedCategory, handleCalculatorButtonClick, inverseMode]);

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
                placeholder='Try: "25 °C to °F" or "5 kg to lb" or search calculators like "Age"' // Updated placeholder
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)} // Call handleSearch directly on change
                ref={searchInputRef} // NEW: Add ref to the search input
                onFocus={() => {
                  if (searchInputRef.current) {
                    searchInputRef.current.isFocused = true; // Custom property to track focus
                  }
                }}
                onBlur={() => {
                  if (searchInputRef.current) {
                    searchInputRef.current.isFocused = false; // Custom property to track focus
                  }
                }}
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
            {Object.entries(categoryGroups)
              .filter(([group, categories]) => {
                const lowerCaseQuery = searchQuery.toLowerCase();
                // If search query is empty, show all groups
                if (!lowerCaseQuery) return true;
                // If group name matches, show group
                if (group.toLowerCase().includes(lowerCaseQuery)) return true;
                // If any category within the group matches, show group
                return categories.some(
                  (category) => filteredCategories.includes(category) // Check against the new filteredCategories
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
                    {expandedGroups[group] || searchQuery.length > 0 ? ( // Always expand if searching
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                  {(expandedGroups[group] || searchQuery.length > 0) && ( // Always expand if searching
                    <div style={{ paddingTop: "8px" }}>
                      {categories
                        .filter((category) =>
                          filteredCategories.includes(category)
                        ) // Filter categories based on search results
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
                          // Factorial needs to be implemented
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
