"use client";
import {
  Box,
  Stack,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  tooltipClasses, // Import tooltipClasses
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles"; // Import styled
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

// ✅ URL validation helper function (adapted from FacebookScreen.jsx)
const validateUrl = (url) => {
  if (!url) return false;
  // Regex to check for http(s):// or www. at the beginning
  const urlRegex =
    /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})$/i;
  return urlRegex.test(url);
};

// ✅ Options: Link or Upload
const pdfOptions = ["Link", "Upload"];

export default function PdfScreen({ setValue }) {
  const [option, setOption] = useState("Link");
  const [form, setForm] = useState({ link: "", upload: "" });
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

    if (option === "Link") {
      if (touched.link) {
        if (!form.link.trim()) {
          newErrors.link = "PDF URL is required";
          hasError = true;
        } else if (!validateUrl(form.link.trim())) {
          // Apply URL validation
          newErrors.link =
            "Invalid URL format (try starting with http://, https://, or www.)";
          hasError = true;
        }
      }
    }

    if (option === "Upload") {
      if (touched.upload && !form.upload.trim()) {
        newErrors.upload = "PDF file is required";
        hasError = true;
      }
    }

    setErrors(newErrors);

    // Build QR payload if valid
    if (!hasError) {
      if (option === "Link" && form.link.trim()) {
        setValue?.(form.link);
      } else if (option === "Upload" && form.upload.trim()) {
        // simulate uploaded file public URL (dummy backend)
        setValue?.(`${window.location.origin}/uploads/${form.upload}`);
      } else {
        setValue?.("");
      }
    } else {
      setValue?.("");
    }
  }, [form, touched, option, setValue]);

  // 🔹 Reusable input renderer (for text inputs)
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
          lg: "32px",
          md: "32px",
          sm: "32px",
          xs: "32px",
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

  // 🔹 Special renderer for Upload input with Icon
  const renderUploadInput = (label, name) => (
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
        gap: "20px",
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            borderWidth: "2px",
            borderColor:
              !!errors[name] && touched[name]
                ? theme.palette.ui.delete
                : theme.palette.secondary.secondMain,

            borderRadius: "8px", // Consistent border radius
            bgcolor: "#ffffff",
            px: "8px", // Consistent padding
            py: "10px", // Consistent padding
          }}
        >
          <input
            type="file"
            accept="application/pdf"
            id="pdf-upload"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              handleChange(name, file?.name || "");
              setTouched((prev) => ({ ...prev, [name]: true }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, [name]: true }))} // Mark as touched on blur
          />
          <label htmlFor="pdf-upload">
            <IconButton
              component="span"
              sx={{
                color: theme.palette.secondary.secondMain,
                bgcolor: theme.palette.primary.main,
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                },
              }}
            >
              <CloudUploadIcon />
            </IconButton>
          </label>
          <Typography
            variant="body2"
            sx={{
              ml: 2,
              color: form[name] ? "#253164" : "#61698b",
              fontSize: "14px",
              flex: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {form[name] || "No file selected"}
          </Typography>
        </Box>
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
        PDF QR Code
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
            lg: "20px",
            md: "20px",
            sm: "20px",
            xs: "20px",
            mob: "10px",
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
            lables={pdfOptions}
            value={option}
            onChange={(val) => setOption(val)}
          />
        </Stack>
      </Box>

      {/* Inputs depending on option */}
      {option === "Link" &&
        renderInput("PDF URL", "link", "https://example.com/file.pdf")}

      {option === "Upload" && renderUploadInput("Upload File", "upload")}
    </Stack>
  );
}
