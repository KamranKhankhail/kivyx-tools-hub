"use client";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
  tooltipClasses,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import CustomizedRadios from "./icons/CustomizedRadios";

// ✅ Custom styled tooltip
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

export default function WifiScreen({ setValue }) {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA"); // default WPA
  const [hidden, setHidden] = useState(false);

  // 🔹 Errors
  const [errors, setErrors] = useState({ ssid: "", password: "" });
  // 🔹 New touched states
  const [touchedSsid, setTouchedSsid] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);

  // Build the wifi QR string whenever values change
  useEffect(() => {
    let hasError = false;
    const newErrors = { ssid: "", password: "" };

    // SSID validation
    if (!ssid.trim()) {
      newErrors.ssid = "Network name (SSID) is required";
      hasError = true;
    }

    // Password validation (only if encryption is not "None")
    if (encryption !== "None" && password.trim().length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      setValue(""); // invalid → no QR
      return;
    }

    const enc = encryption === "None" ? "nopass" : encryption;
    const wifiString = `WIFI:T:${enc};S:${ssid};P:${password};H:${hidden};;`;

    setValue(wifiString);
  }, [ssid, password, encryption, hidden, setValue]);

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
        Wifi QR Code
      </Typography>

      {/* SSID + Hidden Checkbox */}
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              lg: "row",
              md: "row",
              sm: "row",
              xs: "column",
              mob: "column",
            },
            gap: "20px",
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
            Network Name:
          </Typography>
          <Stack
            direction="row"
            spacing={5}
            sx={{ alignItems: "center", flex: 1 }}
          >
            {/* 🔹 SSID with tooltip and updated TextField style */}
            <ErrorTooltip
              open={!!errors.ssid && touchedSsid} // Only show if error and touched
              title={errors.ssid || ""}
              placement="top"
              arrow
            >
              <TextField
                variant="outlined"
                placeholder="Enter WiFi name"
                fullWidth
                value={ssid}
                onChange={(e) => {
                  setSsid(e.target.value);
                  if (!touchedSsid) setTouchedSsid(true); // Mark as touched on first change
                }}
                onBlur={() => setTouchedSsid(true)} // Mark as touched on blur
                error={!!errors.ssid && touchedSsid} // Only show error style if error and touched
                sx={{
                  flex: { lg: 3, md: 3, sm: 3, xs: 3, mob: 3 },
                  input: {
                    bgcolor: "#ffffff",
                    color: "#61698b",
                    fontSize: "14px",
                    px: "4px",
                    py: "10px",
                  },
                  "& .MuiOutlinedInput-root": {
                    px: "8px",
                    borderRadius: "8px",
                    bgcolor: "#ffffff",
                    "& fieldset": {
                      border:
                        !!errors.ssid && touchedSsid
                          ? "2px solid #e53935"
                          : "2px solid #adf2fa", // Dynamic error border
                    },
                    "&:hover fieldset": {
                      border:
                        !!errors.ssid && touchedSsid
                          ? "2px solid #e53935"
                          : "1.5px solid #adf2fa", // Dynamic error border
                    },
                    "&.Mui-focused fieldset": {
                      border:
                        !!errors.ssid && touchedSsid
                          ? "2px solid #e53935"
                          : "1.5px solid #adf2fa", // Dynamic error border
                    },
                  },
                }}
              />
            </ErrorTooltip>

            <FormGroup sx={{ flex: { lg: 1, md: 1, sm: 1, xs: 1, mob: 0 } }}>
              <FormControlLabel
                sx={{ display: "flex", flexDirection: "row", mr: 0 }}
                control={
                  <Checkbox
                    disableRipple
                    checked={hidden}
                    onChange={(e) => setHidden(e.target.checked)}
                    icon={
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          border: "3px solid #adf2fa",
                          borderRadius: "4px",
                          backgroundColor: "transparent",
                        }}
                      />
                    }
                    checkedIcon={
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          border: "3px solid #adf2fa",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CheckIcon sx={{ fontSize: 16, color: "#adf2fa" }} />
                      </Box>
                    }
                    sx={{
                      p: 0,
                      pr: "10px",
                      "&:hover": { backgroundColor: "transparent" },
                      "&.Mui-focusVisible": { outline: "none" },
                    }}
                  />
                }
                label={
                  <span
                    style={{
                      color: "#96999F",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Hidden
                    <Tooltip
                      title="Is this a hidden WiFi network?"
                      placement="right"
                      arrow
                    >
                      <HelpOutlinedIcon
                        sx={{
                          fontSize: 18,
                          color: "#96999f",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  </span>
                }
              />
            </FormGroup>
          </Stack>
        </Box>
      </Stack>

      {/* Password */}
      <Stack>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              lg: "row",
              md: "row",
              sm: "row",
              xs: "column",
              mob: "column",
            },
            pt: { lg: 0, md: 0, sm: 0, xs: 0, mob: "20px" },
            gap: { sm: "31px", xs: "10px" },
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
            Password:
          </Typography>
          <Stack
            direction="row"
            spacing={5}
            sx={{ alignItems: "center", flex: 1, py: "10px" }}
          >
            {/* 🔹 Password with tooltip and updated TextField style */}
            <ErrorTooltip
              open={!!errors.password && touchedPassword} // Only show if error and touched
              title={errors.password || ""}
              placement="top"
              arrow
            >
              <TextField
                variant="outlined"
                placeholder="Enter Your Password"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (!touchedPassword) setTouchedPassword(true); // Mark as touched on first change
                }}
                onBlur={() => setTouchedPassword(true)} // Mark as touched on blur
                error={!!errors.password && touchedPassword} // Only show error style if error and touched
                sx={{
                  flex: 3,
                  input: {
                    bgcolor: "#ffffff",
                    color: "#61698b",
                    fontSize: "14px",
                    px: "4px",
                    py: "10px",
                  },
                  "& .MuiOutlinedInput-root": {
                    px: "8px",
                    borderRadius: "8px",
                    bgcolor: "#ffffff",
                    "& fieldset": {
                      border:
                        !!errors.password && touchedPassword
                          ? "2px solid #e53935"
                          : "2px solid #adf2fa", // Dynamic error border
                    },
                    "&:hover fieldset": {
                      border:
                        !!errors.password && touchedPassword
                          ? "2px solid #e53935"
                          : "1.5px solid #adf2fa", // Dynamic error border
                    },
                    "&.Mui-focused fieldset": {
                      border:
                        !!errors.password && touchedPassword
                          ? "2px solid #e53935"
                          : "1.5px solid #adf2fa", // Dynamic error border
                    },
                  },
                }}
              />
            </ErrorTooltip>
          </Stack>
        </Box>
      </Stack>

      {/* Encryption */}
      <Stack>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              lg: "row",
              md: "row",
              sm: "row",
              xs: "column",
              mob: "column",
            },
            pt: { lg: 0, md: 0, sm: 0, xs: 0, mob: "20px" },
            gap: { sm: "31px", xs: "10px" },
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
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              Encryption
              <Tooltip
                title="The type of security protocol on your network"
                placement="bottom"
                arrow
              >
                <HelpOutlinedIcon
                  sx={{ fontSize: 18, color: "#96999f", cursor: "pointer" }}
                />
              </Tooltip>
            </span>
          </Typography>
          <Stack
            direction="row"
            spacing={5}
            sx={{ alignItems: "center", flex: 1, py: "10px" }}
          >
            <CustomizedRadios
              lables={["None", "WPA", "WEP"]}
              value={encryption}
              onChange={(val) => setEncryption(val)}
            />
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
}
