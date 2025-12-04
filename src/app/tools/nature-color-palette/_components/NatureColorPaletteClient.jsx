"use client";
import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Modal,
  IconButton,
  Snackbar,
  Alert,
  Stack,
  Fade,
} from "@mui/material";
import { Close, ContentCopy, Download } from "@mui/icons-material";
import Image from "next/image";
import theme from "@/styles/theme";
import Head from "next/head"; // ← Added
import Lottie from "lottie-react"; // ← Added
import copiedGif from "/public/images/sample.gif";
const colorPalettesData = [
  {
    paletteImageSrc: "color-palette-1.jpg",
    colorPalette: ["#494006", "#4C121B", "#D4850B", "#402F05", "#7D0C0C"],
    paletteName: "Earthy Brown",
    boxShadow: "0 8px 16px rgba(73, 64, 6, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-2.png",
    colorPalette: ["#0F7A09", "#189B7C", "#0C3E69", "#0EC00C", "#DEAF09"],
    paletteName: "Forest Green",
    boxShadow: "0 8px 16px rgba(15, 122, 9, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-3.png",
    colorPalette: ["#2D1F27", "#3A090B", "#2E4457", "#F55603", "#170815"],
    paletteName: "Dark Mystery",
    boxShadow: "0 8px 16px rgba(45, 31, 39, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-4.png",
    colorPalette: ["#1C4B6D", "#FFDE00", "#322B0A", "#DB4203", "#EF7D4A"],
    paletteName: "Vintage Gold",
    boxShadow: "0 8px 16px rgba(28, 75, 109, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-5.png",
    colorPalette: ["#0D3354", "#1B91D1", "#FFEB05", "#07192C", "#CC7606"],
    paletteName: "Ocean Blue",
    boxShadow: "0 8px 16px rgba(13, 51, 84, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-6.png",
    colorPalette: ["#05221C", "#2A4112", "#2E8078", "#9C8824", "#902009"],
    paletteName: "Nature Tones",
    boxShadow: "0 8px 16px rgba(5, 34, 28, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-7.png",
    colorPalette: ["#C30FBF", "#F0910A", "#F6A609", "#3472E6", "#9A3811"],
    paletteName: "Vibrant Mix",
    boxShadow: "0 8px 16px rgba(195, 15, 191, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-8.png",
    colorPalette: ["#E29533", "#032526", "#318387", "#2D1C09", "#84795F"],
    paletteName: "Sunset Orange",
    boxShadow: "0 8px 16px rgba(226, 149, 51, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-9.png",
    colorPalette: ["#863827", "#04A4EE", "#F581ED", "#000001", "#5D8ACB"],
    paletteName: "Pink Dream",
    boxShadow: "0 8px 16px rgba(134, 56, 39, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-10.png",
    colorPalette: ["#14305B", "#192E33", "#C61805", "#78500E", "#DE506D"],
    paletteName: "Deep Red",
    boxShadow: "0 8px 16px rgba(20, 48, 91, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-11.png",
    colorPalette: ["#268BB8", "#F01004", "#FE9C28", "#8D0C0B", "#080718"],
    paletteName: "Tech Red",
    boxShadow: "0 8px 16px rgba(38, 139, 184, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-12.png",
    colorPalette: ["#DF8E02", "#4E3206", "#141F08", "#FBB404", "#965507"],
    paletteName: "Mustard Yellow",
    boxShadow: "0 8px 16px rgba(223, 142, 2, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-13.png",
    colorPalette: ["#2F313A", "#27120F", "#F6CB38", "#A22E0B", "#EBD6A2"],
    paletteName: "Gold Accent",
    boxShadow: "0 8px 16px rgba(47, 49, 58, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-14.png",
    colorPalette: ["#0668A0", "#034A7C", "#3294C7", "#065E6D", "#197810"],
    paletteName: "Blue Green",
    boxShadow: "0 8px 16px rgba(6, 104, 160, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-15.png",
    colorPalette: ["#0864A4", "#12284E", "#05468D", "#740B18", "#DF298D"],
    paletteName: "Navy Purple",
    boxShadow: "0 8px 16px rgba(8, 100, 164, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-16.png",
    colorPalette: ["#890403", "#EE3105", "#A90704", "#2F1E37", "#FE6502"],
    paletteName: "Crimson Fire",
    boxShadow: "0 8px 16px rgba(137, 4, 3, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-17.png",
    colorPalette: ["#4B4EB1", "#1A7CD8", "#B295C4", "#3B4C87", "#14256F"],
    paletteName: "Royal Purple",
    boxShadow: "0 8px 16px rgba(75, 78, 177, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-18.png",
    colorPalette: ["#347A68", "#383325", "#032D15", "#A7C3CA", "#8FB5AD"],
    paletteName: "Sage Green",
    boxShadow: "0 8px 16px rgba(52, 122, 104, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-19.png",
    colorPalette: ["#E24A40", "#E9BCA1", "#913D29", "#ED7027", "#412B29"],
    paletteName: "Terracotta",
    boxShadow: "0 8px 16px rgba(226, 74, 64, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-20.png",
    colorPalette: ["#4A140C", "#4A6790", "#54393A", "#FEE521", "#E53A0C"],
    paletteName: "Electric Yellow",
    boxShadow: "0 8px 16px rgba(74, 20, 12, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-21.png",
    colorPalette: ["#033883", "#5D3088", "#F49084", "#04020D", "#381727"],
    paletteName: "Midnight Coral",
    boxShadow: "0 8px 16px rgba(3, 56, 131, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-22.png",
    colorPalette: ["#C6A768", "#22282A", "#6B6857", "#C95A14", "#8B6D4F"],
    paletteName: "Warm Beige",
    boxShadow: "0 8px 16px rgba(198, 167, 104, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-23.png",
    colorPalette: ["#0D1D26", "#0E8320", "#4A5137", "#37C697", "#35255F"],
    paletteName: "Mint Fresh",
    boxShadow: "0 8px 16px rgba(13, 29, 38, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-24.png",
    colorPalette: ["#6D6F7E", "#CD3F2F", "#392938", "#7CC61D", "#1B406C"],
    paletteName: "Lime Pop",
    boxShadow: "0 8px 16px rgba(109, 111, 126, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-25.png",
    colorPalette: ["#E0F8CD", "#7C7157", "#CDEE9B", "#B49493", "#47515B"],
    paletteName: "Pale Spring",
    boxShadow: "0 8px 16px rgba(224, 248, 205, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-26.png",
    colorPalette: ["#570BA9", "#96995E", "#D6D7E5", "#170B3C", "#110C09"],
    paletteName: "Deep Purple",
    boxShadow: "0 8px 16px rgba(87, 11, 169, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-27.png",
    colorPalette: ["#1C2526", "#5B412A", "#C5B598", "#302418", "#AC906C"],
    paletteName: "Wood Tone",
    boxShadow: "0 8px 16px rgba(28, 37, 38, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-28.png",
    colorPalette: ["#7F187F", "#0F3C4F", "#3D0C09", "#0A0D11", "#D32ED6"],
    paletteName: "Neon Magenta",
    boxShadow: "0 8px 16px rgba(127, 24, 127, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-29.png",
    colorPalette: ["#93683E", "#18DBE6", "#E4B43F", "#526A6D", "#664113"],
    paletteName: "Cyan Burst",
    boxShadow: "0 8px 16px rgba(147, 104, 62, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-30.png",
    colorPalette: ["#3F312C", "#9B0304", "#9B0304", "#B78B85", "#3E0703"],
    paletteName: "Maroon Deep",
    boxShadow: "0 8px 16px rgba(63, 49, 44, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-31.png",
    colorPalette: ["#034235", "#01414B", "#C10002", "#4F2C09", "#314508"],
    paletteName: "Teal Crimson",
    boxShadow: "0 8px 16px rgba(3, 66, 53, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-32.png",
    colorPalette: ["#006ADB", "#00E6B9", "#193750", "#183C03", "#FF0200"],
    paletteName: "Bright Turquoise",
    boxShadow: "0 8px 16px rgba(0, 106, 219, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-33.png",
    colorPalette: ["#FFEBDC", "#DC4B1C", "#202635", "#A52F14", "#6BC8D0"],
    paletteName: "Peach Sunset",
    boxShadow: "0 8px 16px rgba(255, 235, 220, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-34.png",
    colorPalette: ["#074A73", "#357D98", "#FCD15C", "#0D5A7D", "#EA8033"],
    paletteName: "Navy Gold",
    boxShadow: "0 8px 16px rgba(7, 74, 115, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-35.png",
    colorPalette: ["#221239", "#633DA4", "#FB8A59", "#60235B", "#4A1738"],
    paletteName: "Purple Peach",
    boxShadow: "0 8px 16px rgba(34, 18, 57, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-36.jpg",
    colorPalette: ["#CC7B33", "#3F1609", "#AB988A", "#DDAC88", "#383637"],
    paletteName: "Burnt Orange",
    boxShadow: "0 8px 16px rgba(204, 123, 51, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-37.jpg",
    colorPalette: ["#ECB990", "#AB7614", "#7A4A64", "#AA87B8", "#C89DBA"],
    paletteName: "Dusty Rose",
    boxShadow: "0 8px 16px rgba(236, 185, 144, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-38.jpg",
    colorPalette: ["#192533", "#944A0D", "#F9AF24", "#0C1830", "#261F1C"],
    paletteName: "Mocha Gold",
    boxShadow: "0 8px 16px rgba(25, 37, 51, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-39.jpg",
    colorPalette: ["#A6759F", "#DB879D", "#F88847", "#141F3B", "#1D5F82"],
    paletteName: "Plum Coral",
    boxShadow: "0 8px 16px rgba(166, 117, 159, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-40.jpg",
    colorPalette: ["#0B0501", "#412402", "#064900", "#2F1C05", "#F4C507"],
    paletteName: "Golden Dark",
    boxShadow: "0 8px 16px rgba(11, 5, 1, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-41.jpg",
    colorPalette: ["#364460", "#0B1C38", "#F18228", "#F18228", "#F45D08"],
    paletteName: "Tangerine Fire",
    boxShadow: "0 8px 16px rgba(54, 68, 96, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-42.jpg",
    colorPalette: ["#E996CB", "#942258", "#652955", "#CD4F94", "#0A0103"],
    paletteName: "Wine Pink",
    boxShadow: "0 8px 16px rgba(233, 150, 203, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-43.jpg",
    colorPalette: ["#BD761A", "#9C560F", "#13130B", "#251D14", "#5A2F0D"],
    paletteName: "Chocolate Brown",
    boxShadow: "0 8px 16px rgba(189, 118, 26, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-44.jpg",
    colorPalette: ["#0B88EB", "#0072FB", "#1B8A31", "#066EDD", "#6DB6F8"],
    paletteName: "Sky Blue",
    boxShadow: "0 8px 16px rgba(11, 136, 235, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-45.jpg",
    colorPalette: ["#0A0A0A", "#E8CC64", "#0E0D0D", "#915E19", "#C2C2C2"],
    paletteName: "Charcoal Gold",
    boxShadow: "0 8px 16px rgba(10, 10, 10, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-46.jpg",
    colorPalette: ["#C99D94", "#5B93AF", "#F16006", "#013145", "#C03B06"],
    paletteName: "Burnt Coral",
    boxShadow: "0 8px 16px rgba(201, 157, 148, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-47.jpg",
    colorPalette: ["#A81F6C", "#65066D", "#0D0218", "#15022C", "#712F62"],
    paletteName: "Deep Magenta",
    boxShadow: "0 8px 16px rgba(168, 31, 108, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-48.jpg",
    colorPalette: ["#0E5EEE", "#D11006", "#6CBAFE", "#0F2756", "#077C06"],
    paletteName: "Vibrant Blue Red",
    boxShadow: "0 8px 16px rgba(14, 94, 238, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-49.jpg",
    colorPalette: ["#361601", "#403101", "#C0B994", "#1B1301", "#F0DC9B"],
    paletteName: "Vanilla Brown",
    boxShadow: "0 8px 16px rgba(54, 22, 1, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-50.jpg",
    colorPalette: ["#A1A1C3", "#36232C", "#139893", "#B30606", "#002A21"],
    paletteName: "Teal Burgundy",
    boxShadow: "0 8px 16px rgba(161, 161, 195, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-51.png",
    colorPalette: ["#03080A", "#114963", "#0487A7", "#05C4EE", "#A64230"],
    paletteName: "Cyan Ocean",
    boxShadow: "0 8px 16px rgba(3, 8, 10, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-52.png",
    colorPalette: ["#190220", "#3B0D19", "#C68F86", "#64787F", "#129919"],
    paletteName: "Dusty Mauve",
    boxShadow: "0 8px 16px rgba(25, 2, 32, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-53.jpg",
    colorPalette: ["#263B56", "#585970", "#885B93", "#894B16", "#95A741"],
    paletteName: "Muted Earth",
    boxShadow: "0 8px 16px rgba(38, 59, 86, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-54.jpg",
    colorPalette: ["#171019", "#2D2F3D", "#656B70", "#D2B675", "#E3D196"],
    paletteName: "Taupe Cream",
    boxShadow: "0 8px 16px rgba(23, 16, 25, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-55.jpg",
    colorPalette: ["#50341F", "#692949", "#0C5360", "#6F995A", "#9DD0E5"],
    paletteName: "Seafoam Sage",
    boxShadow: "0 8px 16px rgba(80, 52, 31, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-56.jpg",
    colorPalette: ["#210213", "#0955E7", "#09DDD0", "#C9083D", "#E9F635"],
    paletteName: "Neon Cyan Pink",
    boxShadow: "0 8px 16px rgba(33, 2, 19, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-57.jpg",
    colorPalette: ["#020307", "#834FA4", "#B277BF", "#B277BF", "#FAFAFA"],
    paletteName: "Lavender Dream",
    boxShadow: "0 8px 16px rgba(2, 3, 7, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-58.png",
    colorPalette: ["#04040D", "#122C56", "#1AE6EB", "#BA376F", "#D32618"],
    paletteName: "Aqua Rose",
    boxShadow: "0 8px 16px rgba(4, 4, 13, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-59.jpg",
    colorPalette: ["#154140", "#4C3813", "#1F753A", "#039C66", "#DD9E5B"],
    paletteName: "Forest Peach",
    boxShadow: "0 8px 16px rgba(21, 65, 64, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-60.jpg",
    colorPalette: ["#051314", "#003138", "#592F00", "#CF8E0F", "#D3B53C"],
    paletteName: "Mustard Teal",
    boxShadow: "0 8px 16px rgba(5, 19, 20, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-61.png",
    colorPalette: ["#154572", "#578397", "#1F2E00", "#BEAE0D", "#A6A16C"],
    paletteName: "Sage Blue",
    boxShadow: "0 8px 16px rgba(21, 69, 114, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-62.jpg",
    colorPalette: ["#141135", "#174D5B", "#32263C", "#552A50", "#CD86C5"],
    paletteName: "Teal Purple",
    boxShadow: "0 8px 16px rgba(20, 17, 53, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-63.jpg",
    colorPalette: ["#141315", "#461832", "#AD305B", "#D83D04", "#DD9C40"],
    paletteName: "Wine Orange",
    boxShadow: "0 8px 16px rgba(20, 19, 21, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-64.jpg",
    colorPalette: ["#0E3C84", "#0486F9", "#477A7A", "#C91604", "#F1E6F0"],
    paletteName: "Bright Blue Red",
    boxShadow: "0 8px 16px rgba(14, 60, 132, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-65.png",
    colorPalette: ["#0367C9", "#0388F8", "#4B1644", "#A16592", "#DEB203"],
    paletteName: "Blue Purple Gold",
    boxShadow: "0 8px 16px rgba(3, 103, 201, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-66.jpg",
    colorPalette: ["#002333", "#035A60", "#027451", "#1C9FB7", "#CAD0C7"],
    paletteName: "Ocean Green",
    boxShadow: "0 8px 16px rgba(0, 35, 51, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-67.jpg",
    colorPalette: ["#5C1A24", "#D56708", "#B65A79", "#5C4C72", "#9774A4"],
    paletteName: "Wine Orange Purple",
    boxShadow: "0 8px 16px rgba(92, 26, 36, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-68.jpg",
    colorPalette: ["#0A1C23", "#551A0F", "#BF2A23", "#4B4C4C", "#C4C9CD"],
    paletteName: "Dark Red Brick",
    boxShadow: "0 8px 16px rgba(10, 28, 35, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-69.png",
    colorPalette: ["#0B2440", "#656F79", "#83433B", "#E09B4A", "#F9FDC4"],
    paletteName: "Blue Brown Cream",
    boxShadow: "0 8px 16px rgba(11, 36, 64, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-70.jpg",
    colorPalette: ["#3B2538", "#6E343A", "#3662C3", "#D16F6F", "#F2CA59"],
    paletteName: "Plum Rose Gold",
    boxShadow: "0 8px 16px rgba(59, 37, 56, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-71.jpg",
    colorPalette: ["#29281A", "#7E6B19", "#B69C05", "#867B71", "#DA9B2C"],
    paletteName: "Earthy Gold",
    boxShadow: "0 8px 16px rgba(41, 40, 26, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-72.jpg",
    colorPalette: ["#1C3643", "#356689", "#E79259", "#4D8E4A", "#BE292E"],
    paletteName: "Navy Orange Green",
    boxShadow: "0 8px 16px rgba(28, 54, 67, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-73.png",
    colorPalette: ["#541237", "#B1397B", "#619D4B", "#B9330B", "#E7CE36"],
    paletteName: "Berry Gold",
    boxShadow: "0 8px 16px rgba(84, 18, 55, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-74.png",
    colorPalette: ["#192326", "#235282", "#B05042", "#8198AA", "#DAD8B5"],
    paletteName: "Navy Terracotta",
    boxShadow: "0 8px 16px rgba(25, 35, 38, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-75.png",
    colorPalette: ["#030D1B", "#1D99C9", "#31C8F0", "#EF4920", "#FAD936"],
    paletteName: "Cyan Orange Gold",
    boxShadow: "0 8px 16px rgba(3, 13, 27, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-76.jpg",
    colorPalette: ["#251C0E", "#463506", "#816A70", "#B59100", "#EFB200"],
    paletteName: "Golden Brown",
    boxShadow: "0 8px 16px rgba(37, 28, 14, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-77.jpg",
    colorPalette: ["#013E2F", "#17967B", "#3AE0B8", "#893DC8", "#DA93F3"],
    paletteName: "Teal Purple Pink",
    boxShadow: "0 8px 16px rgba(1, 62, 47, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-78.jpg",
    colorPalette: ["#191AD3", "#A906B0", "#DC44A1", "#E2B445", "#00AFEA"],
    paletteName: "Vivid Rainbow",
    boxShadow: "0 8px 16px rgba(25, 26, 211, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-79.jpg",
    colorPalette: ["#38230D", "#5C3D10", "#BA8B1D", "#BEAA8F", "#849D19"],
    paletteName: "Warm Olive",
    boxShadow: "0 8px 16px rgba(56, 35, 13, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-80.jpg",
    colorPalette: ["#4E3B21", "#A98EAC", "#C8F0EF", "#D8CE15", "#DAF1BF"],
    paletteName: "Lavender Mint",
    boxShadow: "0 8px 16px rgba(78, 59, 33, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-81.jpg",
    colorPalette: ["#17231D", "#185544", "#6FA132", "#BE8301", "#86195E"],
    paletteName: "Dark Forest",
    boxShadow: "0 8px 16px rgba(23, 35, 29, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-82.jpg",
    colorPalette: ["#121B40", "#560544", "#9664AC", "#C598C4", "#D2E35D"],
    paletteName: "Lavender Lime",
    boxShadow: "0 8px 16px rgba(18, 27, 64, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-83.jpg",
    colorPalette: ["#04367D", "#0872BD", "#1A522A", "#3CDB55", "#E967D0"],
    paletteName: "Blue Green Magenta",
    boxShadow: "0 8px 16px rgba(4, 54, 125, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-84.jpg",
    colorPalette: ["#237718", "#38BCC9", "#029E98", "#92D146", "#F174A3"],
    paletteName: "Lime Cyan Pink",
    boxShadow: "0 8px 16px rgba(35, 119, 24, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-85.jpg",
    colorPalette: ["#051C29", "#69221E", "#C2284F", "#0C7381", "#BEA447"],
    paletteName: "Crimson Teal",
    boxShadow: "0 8px 16px rgba(5, 28, 41, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-86.jpg",
    colorPalette: ["#2C121F", "#8A181F", "#A77C7C", "#DCAEA5", "#949CA1"],
    paletteName: "Rose Mauve",
    boxShadow: "0 8px 16px rgba(44, 18, 31, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-87.jpg",
    colorPalette: ["#263E63", "#33DBFB", "#582614", "#9D3607", "#FE7F0D"],
    paletteName: "Cyan Orange",
    boxShadow: "0 8px 16px rgba(38, 62, 99, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-88.jpg",
    colorPalette: ["#1F214F", "#2A3516", "#E23D03", "#C56780", "#D9D1C0"],
    paletteName: "Orange Mauve",
    boxShadow: "0 8px 16px rgba(31, 33, 79, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-89.jpg",
    colorPalette: ["#030E16", "#784F49", "#A86040", "#17486B", "#2C78AA"],
    paletteName: "Blue Brown",
    boxShadow: "0 8px 16px rgba(3, 14, 22, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-90.png",
    colorPalette: ["#033159", "#0F9FAB", "#0E6993", "#3AB7D9", "#B0E2FA"],
    paletteName: "Sky Aqua",
    boxShadow: "0 8px 16px rgba(3, 49, 89, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-91.jpg",
    colorPalette: ["#6D4E35", "#7C7720", "#928E79", "#F24D39", "#FDADB0"],
    paletteName: "Coral Brown",
    boxShadow: "0 8px 16px rgba(109, 78, 53, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-92.png",
    colorPalette: ["#163813", "#075C3C", "#6D8238", "#18DE77", "#873C01"],
    paletteName: "Lime Green",
    boxShadow: "0 8px 16px rgba(22, 56, 19, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-93.jpg",
    colorPalette: ["#491D18", "#E55421", "#203D37", "#25C2DA", "#DBAD3D"],
    paletteName: "Coral Cyan",
    boxShadow: "0 8px 16px rgba(73, 29, 24, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-94.jpg",
    colorPalette: ["#420646", "#AB0F58", "#05A2F5", "#279F0D", "#DBC200"],
    paletteName: "Magenta Blue Green",
    boxShadow: "0 8px 16px rgba(66, 6, 70, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-95.jpg",
    colorPalette: ["#152B82", "#0E6997", "#9DC0DB", "#732F12", "#F58D19"],
    paletteName: "Blue Orange",
    boxShadow: "0 8px 16px rgba(21, 43, 130, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-96.jpg",
    colorPalette: ["#1A2948", "#BE8D0C", "#EAD738", "#19389C", "#7691C6"],
    paletteName: "Gold Blue",
    boxShadow: "0 8px 16px rgba(26, 41, 72, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-97.png",
    colorPalette: ["#0034BF", "#F93529", "#1089F2", "#968BDC", "#EFCC01"],
    paletteName: "Electric Mix",
    boxShadow: "0 8px 16px rgba(0, 52, 191, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-98.jpg",
    colorPalette: ["#530401", "#903129", "#F65609", "#FA9820", "#D1D9D6"],
    paletteName: "Sunset Vintage",
    boxShadow: "0 8px 16px rgba(83, 4, 1, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-99.jpg",
    colorPalette: ["#141623", "#144A84", "#7F3D29", "#D6B49F", "#D1D9D6"],
    paletteName: "Navy Taupe",
    boxShadow: "0 8px 16px rgba(20, 22, 35, 0.3)",
  },
  {
    paletteImageSrc: "color-palette-100.jpg",
    colorPalette: ["#530401", "#903129", "#F65609", "#FA9820", "#D1D9D6"],
    paletteName: "Warm Sunset",
    boxShadow: "0 8px 16px rgba(83, 4, 1, 0.3)",
  },
];

export default function NatureColorPaletteClient() {
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [copiedColor, setCopiedColor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleOpenModal = (palette) => {
    setSelectedPalette(palette);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCopiedColor(null);
  };

  const handleCopyColor = (color) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setSnackbar({ open: true, message: "Color copied!" });
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const handleDownloadPalette = () => {
    if (!selectedPalette) return;
    const aseContent = generateASEFile(selectedPalette);
    const blob = new Blob([aseContent], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedPalette.paletteName.replace(
      /[^a-z0-9]/gi,
      "_"
    )}.ase`;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    setSnackbar({ open: true, message: "Palette downloaded!" });
  };

  const generateASEFile = (palette) => {
    const colors = palette.colorPalette;
    const groupName = palette.paletteName;

    let totalSize = 12;
    const gName = new TextEncoder().encode(groupName + "\0");
    totalSize += 2 + 2 + gName.length * 2;
    colors.forEach((c) => {
      const name = new TextEncoder().encode(c + "\0");
      totalSize += 2 + 2 + name.length * 2 + 12 + 2;
    });
    totalSize += 2;

    const buffer = new ArrayBuffer(totalSize);
    const view = new DataView(buffer);
    let offset = 0;

    view.setUint32(offset, 0x41534546);
    offset += 4;
    view.setUint16(offset, 1);
    offset += 2;
    view.setUint16(offset, 0);
    offset += 2;
    view.setUint32(offset, colors.length + 1);
    offset += 4;

    if (offset + 2 <= buffer.byteLength) view.setUint16(offset, 0xc001);
    offset += 2;
    if (offset + 2 <= buffer.byteLength)
      view.setUint16(offset, gName.length * 2);
    offset += 2;
    for (let i = 0; i < gName.length; i++) {
      if (offset + 2 <= buffer.byteLength) view.setUint16(offset, gName[i]);
      offset += 2;
    }

    colors.forEach((c) => {
      if (offset + 2 <= buffer.byteLength) view.setUint16(offset, 0x0001);
      offset += 2;

      const name = new TextEncoder().encode(c + "\0");
      if (offset + 2 <= buffer.byteLength)
        view.setUint16(offset, name.length * 2);
      offset += 2;
      for (let i = 0; i < name.length; i++) {
        if (offset + 2 <= buffer.byteLength) view.setUint16(offset, name[i]);
        offset += 2;
      }

      const r = parseInt(c.slice(1, 3), 16) / 255;
      const g = parseInt(c.slice(3, 5), 16) / 255;
      const b = parseInt(c.slice(5, 7), 16) / 255;

      if (offset + 4 <= buffer.byteLength) view.setFloat32(offset, r, false);
      offset += 4;
      if (offset + 4 <= buffer.byteLength) view.setFloat32(offset, g, false);
      offset += 4;
      if (offset + 4 <= buffer.byteLength) view.setFloat32(offset, b, false);
      offset += 4;

      if (offset + 2 <= buffer.byteLength) view.setUint16(offset, 0x0000);
      offset += 2;
    });

    if (offset + 2 <= buffer.byteLength) view.setUint16(offset, 0xc002);
    offset += 2;

    return buffer.slice(0, offset);
  };

  const handleDownloadPNG = () => {
    if (!selectedPalette) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const colors = selectedPalette.colorPalette;
    const swatchHeight = 80;
    const padding = 20;
    const textHeight = 40;
    canvas.width = 600;
    canvas.height = swatchHeight + padding * 2 + textHeight;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const swatchWidth = (canvas.width - padding * 2) / colors.length;
    colors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(
        padding + i * swatchWidth,
        padding,
        swatchWidth,
        swatchHeight
      );
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 1;
      ctx.strokeRect(
        padding + i * swatchWidth,
        padding,
        swatchWidth,
        swatchHeight
      );
    });

    ctx.font = "14px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    colors.forEach((color, i) => {
      const x = padding + i * swatchWidth + swatchWidth / 2;
      const y = padding + swatchHeight + 25;
      ctx.fillText(color.toUpperCase(), x, y);
    });

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedPalette.paletteName.replace(
        /[^a-z0-9]/gi,
        "_"
      )}.png`;
      link.click();
      URL.revokeObjectURL(url);
      setSnackbar({ open: true, message: "PNG downloaded!" });
    });
  };
  return (
    <>
      {/* Preload all images */}
      <Head>
        {colorPalettesData.map((p) => (
          <link
            key={p.paletteImageSrc}
            rel="preload"
            href={`/images/ColorPaletteImages/${p.paletteImageSrc}`}
            as="image"
          />
        ))}
      </Head>

      <Box sx={{ minHeight: "100vh", p: 2, pt: 0 }}>
        <Box sx={{ maxWidth: "100%", mx: "auto" }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography
              component="h1"
              variant="body2"
              sx={{
                fontSize: {
                  xl: "55px",
                  lg: "45px",
                  md: "45px",
                  sm: "38px",
                  xs: "32px",
                  mob: "28px",
                },
                fontWeight: "600",
                lineHeight: { md: "130%", sm: "120%", xs: "100%", mob: "100%" },
                color: theme.palette.primary.main,
                textAlign: "center",
                zIndex: 5,
                px: "46px",
              }}
            >
              Nature Color
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #050935 18.27%, #0C4E78 58.17%, #0C4E78 71.15%, #1393BA 86.06%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  paddingLeft: "10px",
                }}
              >
                Palettes
              </span>
            </Typography>{" "}
            <Typography
              component="p"
              variant="body2"
              sx={{
                fontSize: {
                  xl: "24px",
                  lg: "22px",
                  md: "22px",
                  sm: "20px",
                  xs: "28px",
                  mob: "16px",
                },
                fontWeight: "300",
                lineHeight: {
                  lg: "130%",
                  md: "120%",
                  sm: "110%",
                  xs: "100%",
                  mob: "100%",
                },
                color: theme.palette.primary.secondMain,
                textAlign: "center",
                zIndex: "5",
                pt: "6px",
                px: "80px",
              }}
            >
              Explore and Copy Nature-Inspired Color Schemes
            </Typography>
          </Box>

          {/* Palette Grid */}
          <Grid container spacing={4}>
            {colorPalettesData.map((palette, i) => (
              <Grid
                role="button"
                onClick={() => handleOpenModal(palette)}
                key={i}
                item
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
              >
                <Card
                  sx={{
                    background: "#fff",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: palette.colorPalette
                      .map((c, i) => `0 ${8 + i * 4}px ${16 + i * 8}px ${c}40`)
                      .join(", "),
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    p: "12px",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: palette.colorPalette
                        .map(
                          (c, i) => `0 ${12 + i * 5}px ${24 + i * 10}px ${c}60`
                        )
                        .join(", "),
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 200,
                      position: "relative",
                      borderRadius: "12px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src={`/images/ColorPaletteImages/${palette.paletteImageSrc}`}
                      alt={palette.paletteName}
                      fill
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      priority={false}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </Box>

                  <Box
                    sx={{
                      position: "absolute",
                      top: "22px",
                      right: "20px",
                      background: "rgba(255, 255, 255, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      py: "6px",
                      px: "10px",
                      color: "#ffffff",
                      borderRadius: "30px",
                      border: "4px solid #ffffff",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(palette);
                    }}
                  >
                    View Details
                  </Box>

                  <Box sx={{ pt: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#1a1a1a", mb: 1.5 }}
                    >
                      {palette.paletteName}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 0.8, mb: 1.5 }}>
                      {palette.colorPalette.map((color, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            flex: 1,
                            height: 44,
                            background: color,
                            borderRadius: "4px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            "&:hover": { transform: "scale(1.05)" },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(palette);
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Modal with Fade */}
        <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition>
          <Fade in={openModal} timeout={300}>
            <Box
              sx={{
                position: "absolute",
                top: "56%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#fff",
                borderRadius: "16px",
                p: 4,
                maxWidth: 600,
                width: "90%",
                boxShadow: "0 20px 80px rgba(0, 0, 0, 0.3)",
              }}
            >
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  color: "#666",
                  "&:hover": { color: "#1a1a1a" },
                }}
              >
                <Close />
              </IconButton>

              <Box
                sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}
              >
                {selectedPalette && (
                  <Box
                    sx={{
                      width: 150,
                      height: 100,
                      borderRadius: "12px",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={`/images/ColorPaletteImages/${selectedPalette.paletteImageSrc}`}
                      alt={selectedPalette.paletteName}
                      width={150}
                      height={100}
                      style={{ objectFit: "cover" }}
                      priority={true} // ← Instant load
                    />
                  </Box>
                )}
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#1a1a1a" }}
                  >
                    {selectedPalette?.paletteName}
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  mb: 1.8,
                  textTransform: "uppercase",
                  fontSize: "14px",
                  letterSpacing: "0.5px",
                }}
              >
                Color Palette
              </Typography>

              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                {selectedPalette?.colorPalette.map((color, idx) => (
                  <Stack
                    direction="column"
                    key={idx}
                    sx={{ gap: "12px", flex: 1 }}
                  >
                    <Box
                      sx={{
                        height: "60px",
                        background: color,
                        borderRadius: "8px",
                        cursor: "pointer",
                        position: "relative", // Changed to relative for absolute positioning of children
                        transition: "all 0.2s",

                        display: "flex", // Added to center the copied message
                        alignItems: "center", // Added to center the copied message
                        justifyContent: "center", // Added to center the copied message
                      }}
                      onClick={() => handleCopyColor(color)}
                    >
                      {/* Moved Copied! message inside the color box */}
                      {copiedColor === color && (
                        <Box
                          sx={{
                            borderRadius: "50px",
                            p: "1px",

                            background: theme.palette.primary.fourthMain, // Slightly transparent background
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: 600,
                            position: "absolute", // Position absolutely within the parent Box
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)", // Center the message
                          }}
                        >
                          <Image
                            src={copiedGif}
                            alt="Copied"
                            width={50} // Adjust width as needed
                            height={50} // Adjust height as needed
                            unoptimized // GIFs are not optimized by Next.js Image component
                          />
                        </Box>
                      )}
                    </Box>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.3,
                        borderRadius: "20px",
                        background: "#fff",
                        fontSize: "16px",
                        textAlign: "center",
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": { background: "#E0F2F1" },
                      }}
                      onClick={() => handleCopyColor(color)}
                    >
                      {color}
                    </Box>
                    {/* Removed the old copied message block */}
                  </Stack>
                ))}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, mt: 4, flexWrap: "wrap" }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleDownloadPalette}
                  sx={{
                    borderColor: "#00BCD4",
                    color: "#00BCD4",
                    fontWeight: 600,
                    py: 1.2,
                    textTransform: "none",
                    borderRadius: "8px",
                    fontSize: "18px",
                    "&:hover": {
                      borderColor: "#0097A7",
                      background: "rgba(0, 188, 212, 0.05)",
                    },
                    display: "flex",
                    flexDirection: "row",
                    gap: "6px",
                  }}
                >
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Palette .ASE
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ContentCopy fontSize="24px" />}
                  onClick={() => {
                    const allColors = selectedPalette.colorPalette.join(", ");
                    navigator.clipboard.writeText(allColors);
                    setSnackbar({ open: true, message: "All colors copied!" });
                  }}
                  sx={{
                    borderColor: "#4CAF50",
                    color: "#4CAF50",
                    fontWeight: 600,
                    py: 1.2,
                    textTransform: "none",
                    borderRadius: "8px",
                    fontSize: "18px",
                    "&:hover": {
                      borderColor: "#388E3C",
                      background: "rgba(76, 175, 80, 0.05)",
                    },
                    display: "flex",
                    flexDirection: "row",
                    gap: "2px",
                  }}
                >
                  Copy All Colors
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleDownloadPNG}
                  sx={{
                    borderColor: "#FF9800",
                    color: "#FF9800",
                    fontWeight: 600,
                    py: 1.2,
                    textTransform: "none",
                    borderRadius: "8px",
                    fontSize: "18px",
                    "&:hover": {
                      borderColor: "#F57C00",
                      background: "rgba(255, 152, 0, 0.05)",
                    },
                    display: "flex",
                    flexDirection: "row",
                    gap: "6px",
                  }}
                >
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download PNG
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleCloseModal}
                  sx={{
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    py: 1.2,
                    textTransform: "none",
                    borderRadius: "8px",
                    fontSize: "18px",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      background: "#f5f5f5",
                    },
                  }}
                >
                  Back to All Palettes
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert severity="success" variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
