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
import { styled } from "@mui/material/styles";
import CustomizedRadios from "./icons/CustomizedRadios";
import theme from "@/styles/theme";

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

// ✅ Only Profile and Page (removed Post)
const facebookOptions = ["Profile", "Page"];

// ✅ URL validation helper function (adapted from UrlScreen.jsx)
const validateUrl = (url) => {
  if (!url) return false;
  // Regex to check for http(s):// or www. at the beginning
  const urlRegex =
    /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})$/i;
  // A simpler check for `http(s)://` or `www.` at the start
  return urlRegex.test(url);
};

export default function FacebookScreen({ setValue }) {
  const [option, setOption] = useState("Profile");
  const [form, setForm] = useState({ username: "", page: "" });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // 🔹 Handle input changes
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Validation + QR Builder
  useEffect(() => {
    const newErrors = {};
    let hasError = false;

    if (option === "Profile") {
      if (touched.username && !form.username.trim()) {
        newErrors.username = "Username is required";
        hasError = true;
      }
    }

    if (option === "Page") {
      if (touched.page) {
        // Only validate if field has been touched
        if (!form.page.trim()) {
          newErrors.page = "Page URL is required";
          hasError = true;
        } else if (!validateUrl(form.page.trim())) {
          // New URL format validation
          newErrors.page =
            "Invalid URL format (try starting with http://, https://, or www.)";
          hasError = true;
        }
      }
    }

    setErrors(newErrors);

    // Build QR payload if valid
    if (!hasError) {
      if (option === "Profile" && form.username.trim()) {
        const username = form.username.replace(/^@/, ""); // remove @ if entered
        setValue?.(`https://facebook.com/${username}`);
      } else if (option === "Page" && form.page.trim()) {
        setValue?.(
          form.page.startsWith("http")
            ? form.page
            : `https://facebook.com/${form.page}`
        );
      } else {
        setValue?.("");
      }
    } else {
      setValue?.("");
    }
  }, [form, touched, option, setValue]);

  // 🔹 Reusable input renderer
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
          mob: "20px",
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
              color: theme.palette.primary.main,
              fontSize: "14px",
              px: "4px",
              py: "10px",
              "&::placeholder": {
                color: theme.palette.primary.main,
                opacity: 1,
              },
            },
            "& .MuiOutlinedInput-root": {
              px: "8px",
              borderRadius: "8px",
              bgcolor: "#ffffff",
              "& fieldset": {
                borderWidth: "2px",
                borderColor:
                  !!errors[name] && touched[name]
                    ? theme.palette.ui.delete
                    : theme.palette.secondary.secondMain,
              },
              "&:hover fieldset": {
                borderWidth: "2px",
                borderColor:
                  !!errors[name] && touched[name]
                    ? theme.palette.ui.delete
                    : theme.palette.secondary.secondMain,
              },
              "&.Mui-focused fieldset": {
                borderWidth: "2px",
                borderColor:
                  !!errors[name] && touched[name]
                    ? theme.palette.ui.delete
                    : theme.palette.secondary.secondMain,
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
        Facebook QR Code
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
            lg: "30px",
            md: "30px",
            sm: "30px",
            xs: "30px",
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
          Choose Option:
        </Typography>
        <Stack
          direction="row"
          spacing={5}
          sx={{ alignItems: "center", flex: 1, py: "10px" }}
        >
          <CustomizedRadios
            lables={facebookOptions}
            value={option}
            onChange={(val) => setOption(val)}
          />
        </Stack>
      </Box>

      {/* Inputs depending on option */}
      {option === "Profile" && renderInput("Username", "username", "@username")}

      {option === "Page" &&
        renderInput("Page URL", "page", "https://facebook.com/page")}
    </Stack>
  );
}
