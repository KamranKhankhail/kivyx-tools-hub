"use client";
import {
  Box,
  Stack,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  tooltipClasses,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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

// ✅ URL validation helper function (consistent with other screens)
const validateUrl = (url) => {
  if (!url) return false;
  // Regex to check for http(s):// or www. at the beginning
  const urlRegex =
    /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})$/i;
  return urlRegex.test(url);
};

const mp3Options = ["Upload File", "Link (URL)"];

export default function Mp3Screen({ setValue }) {
  const [option, setOption] = useState("Upload File");
  const [form, setForm] = useState({ file: null, url: "" });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // handle changes
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));
    if (!touched.file) setTouched((prev) => ({ ...prev, file: true }));
  };

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // validation + QR builder
  useEffect(() => {
    const newErrors = {};
    let hasError = false;

    if (option === "Upload File") {
      if (touched.file && !form.file) {
        newErrors.file = "MP3 file is required";
        hasError = true;
      } else if (
        form.file && // Only check if file exists
        !form.file.name.toLowerCase().endsWith(".mp3")
      ) {
        newErrors.file = "Only MP3 files are allowed";
        hasError = true;
      }
    }

    if (option === "Link (URL)") {
      if (touched.url) {
        const urlValue = form.url.trim();

        if (!urlValue) {
          newErrors.url = "URL is required";
          hasError = true;
        } else if (!validateUrl(urlValue)) {
          // Use consistent validateUrl
          newErrors.url =
            "Invalid URL format (try starting with http://, https://, or www.)";
          hasError = true;
        }
      }
    }

    setErrors(newErrors);

    // build QR payload if valid
    if (!hasError) {
      if (option === "Upload File" && form.file) {
        // simulate dummy backend URL
        const dummyUrl = `https://dummy-server.com/files/${encodeURIComponent(
          form.file.name
        )}`;
        setValue?.(dummyUrl);
      } else if (option === "Link (URL)" && form.url.trim()) {
        setValue?.(form.url.trim());
      } else {
        setValue?.("");
      }
    } else {
      setValue?.("");
    }
  }, [form, touched, option, setValue]);

  // reusable styled textfield
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
          lg: "43px",
          md: "43px",
          sm: "43px",
          xs: "43px",
          mob: "14px",
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
        gap: {
          lg: "40px",
          md: "40px",
          sm: "40px",
          xs: "40px",
          mob: "12px",
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

      <ErrorTooltip
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
            // Dynamic border for error state
            border:
              !!errors[name] && touched[name]
                ? "2px solid #e53935"
                : "2px solid #adf2fa",
            borderRadius: "8px", // Consistent border radius
            bgcolor: "#ffffff",
            px: "8px", // Consistent padding
            py: "10px", // Consistent padding
          }}
        >
          <input
            accept=".mp3"
            id="mp3-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
            onBlur={() => setTouched((prev) => ({ ...prev, [name]: true }))} // Mark as touched on blur
          />
          <label htmlFor="mp3-upload">
            <IconButton
              component="span"
              sx={{
                color: "#253164",
                bgcolor: "#adf2fa",
                "&:hover": { bgcolor: "#89e4ee" },
              }}
            >
              <CloudUploadIcon />
            </IconButton>
          </label>
          <Typography
            variant="body2"
            sx={{
              ml: 2,
              color: form.file ? "#253164" : "#61698b", // Dynamic color based on file selection
              fontSize: "14px",
              flex: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {form.file?.name || "No file selected"}
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
        MP3 QR Code
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
            lables={mp3Options}
            value={option}
            onChange={(val) => setOption(val)}
          />
        </Stack>
      </Box>

      {/* File Upload */}
      {option === "Upload File" && renderUploadInput("Upload MP3", "file")}

      {/* URL Input */}
      {option === "Link (URL)" &&
        renderInput("MP3 URL", "url", "https://www.example.com/file.mp3")}
    </Stack>
  );
}
