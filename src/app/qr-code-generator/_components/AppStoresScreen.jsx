"use client";
import {
  Box,
  Stack,
  TextField,
  Typography,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles"; // Import styled
import CustomizedRadios from "./icons/CustomizedRadios";

// ✅ Custom styled tooltip (as provided by user)
const ErrorTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    slotProps={{
      popper: {
        sx: { zIndex: 1500 }, // Ensure tooltip is on top
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 0], // Adjusted offset for consistent alignment
            },
          },
        ],
      },
      arrow: {
        sx: {
          color: "#ff4d4f", // Matching softer red for the arrow
        },
      },
    }}
  />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#ff4d4f", // softer red
    color: "#fff",
    fontSize: "13px",
    fontWeight: 500,
    padding: "6px 12px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
    maxWidth: 300,
  },
}));

const appOptions = ["Google Play", "App Store"];

export default function AppStoresScreen({ setValue }) {
  const [option, setOption] = useState("Google Play");
  const [form, setForm] = useState({ url: "" });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // 🔹 Handle input changes
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Validation + QR builder
  useEffect(() => {
    const newErrors = {};
    const urlValue = form.url.trim();
    let hasError = false;

    if (touched.url) {
      if (!urlValue) {
        newErrors.url = "App store URL is required";
        hasError = true;
      } else {
        if (option === "Google Play") {
          const playPattern = /^https:\/\/play\.google\.com\/[^\s]+$/i;
          if (!playPattern.test(urlValue)) {
            newErrors.url =
              "Enter a valid Google Play URL (e.g., https://play.google.com/store/apps/details?id=...)";
            hasError = true;
          }
        } else if (option === "App Store") {
          const appStorePattern = /^https:\/\/apps\.apple\.com\/[^\s]+$/i;
          if (!appStorePattern.test(urlValue)) {
            newErrors.url =
              "Enter a valid App Store URL (e.g., https://apps.apple.com/us/app/...)";
            hasError = true;
          }
        }
      }
    }

    setErrors(newErrors);

    // Set QR value if valid
    if (!hasError && urlValue) {
      setValue?.(urlValue);
    } else {
      setValue?.("");
    }
  }, [form, touched, option, setValue]);

  // 🔹 Reusable styled input
  const renderInput = (label, name, placeholder) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          lg: "row",
          md: "row",
          sm: "row",
          xs: "row",
          mob: "column",
        },
        gap: {
          lg: "40px",
          md: "40px",
          sm: "40px",
          xs: "40px",
          mob: "16px",
        },
        alignItems: "center",
        mt: 2,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: "400",
          fontSize: "18px",
          lineHeight: "21.78px", // Added for consistency
          color: "#253164",
          minWidth: "120px",
        }}
      >
        {label}:
      </Typography>

      <ErrorTooltip // Replaced Tooltip with ErrorTooltip
        open={!!errors[name] && touched[name]} // Only show if error and touched
        title={errors[name] || ""}
        placement="top"
        arrow
      >
        <TextField
          variant="outlined"
          placeholder={placeholder}
          fullWidth
          value={form[name]}
          onChange={(e) => {
            handleChange(name, e.target.value);
            if (!touched[name])
              setTouched((prev) => ({ ...prev, [name]: true })); // Mark as touched
          }}
          onBlur={() => setTouched((prev) => ({ ...prev, [name]: true }))} // Mark as touched on blur
          error={!!errors[name] && touched[name]} // Show error style only if error and touched
          sx={{
            flex: 1,
            input: {
              bgcolor: "#ffffff",
              color: "#61698b",
              fontSize: "14px",
              px: "4px",
              py: "10px",
              "&::placeholder": { color: "#61698b", opacity: 1 },
            },
            "& .MuiOutlinedInput-root": {
              px: "8px",
              borderRadius: "8px",
              bgcolor: "#ffffff",
              "& fieldset": {
                border:
                  !!errors[name] && touched[name]
                    ? "2px solid #e53935"
                    : "2px solid #adf2fa", // Dynamic error border
              },
              "&:hover fieldset": {
                border:
                  !!errors[name] && touched[name]
                    ? "2px solid #e53935"
                    : "1.5px solid #adf2fa", // Dynamic error border
              },
              "&.Mui-focused fieldset": {
                border:
                  !!errors[name] && touched[name]
                    ? "2px solid #e53935"
                    : "1.5px solid #adf2fa", // Dynamic error border
              },
            },
          }}
        />
      </ErrorTooltip>
    </Box>
  );

  return (
    <Stack sx={{ flex: "1", p: "0px" }}>
      <Typography
        variant="body2"
        sx={{
          fontSize: "20px",
          fontWeight: "500",
          lineHeight: "21.78px", // Added for consistency
          color: "#253164",
          pb: "20px", // Adjusted padding for consistency
        }}
      >
        App Stores QR Code
      </Typography>

      {/* Options */}
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            lg: "row",
            md: "row",
            sm: "row",
            xs: "row",
            mob: "column",
          },
          gap: {
            lg: "60px",
            md: "60px",
            sm: "60px",
            xs: "60px",
            mob: "0px",
          },
          alignItems: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: "400",
            fontSize: "18px",
            lineHeight: "21.78px", // Added for consistency
            color: "#253164",
            minWidth: "120px",
          }}
        >
          Choose Store:
        </Typography>
        <Stack
          direction="row"
          spacing={5}
          sx={{ alignItems: "center", flex: 1, py: "10px" }}
        >
          <CustomizedRadios
            lables={appOptions}
            value={option}
            onChange={(val) => setOption(val)}
          />
        </Stack>
      </Box>

      {/* URL Input */}
      {renderInput(
        `${option} URL`,
        "url",
        option === "Google Play"
          ? "https://play.google.com/store/apps/details?id=your.app"
          : "https://apps.apple.com/us/app/your-app/id123456789"
      )}
    </Stack>
  );
}
