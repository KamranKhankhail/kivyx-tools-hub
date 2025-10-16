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
              offset: [0, -10], // Adjusted offset for consistent alignment
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

// 🔹 Supported coins mapping
const coinProtocols = {
  Bitcoin: "bitcoin",
  "Bitcoin Cash": "bitcoincash",
  Ether: "ethereum",
  "Lite coin": "litecoin",
  Dash: "dash",
};

const bitcoinTextFieldsData = [
  { name: "amount", title: "Amount", placeholder: "Enter Amount" },
  { name: "receiver", title: "Receiver", placeholder: "Wallet Address" },
  { name: "message", title: "Message", placeholder: "Optional" },
];

export default function BitcoinScreen({ setValue }) {
  const [coin, setCoin] = useState("Bitcoin");
  const [form, setForm] = useState({ amount: "", receiver: "", message: "" });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({ amount: "", receiver: "" });

  // 🔹 Handle input changes
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Validation + QR Builder
  useEffect(() => {
    const newErrors = { amount: "", receiver: "" };
    let hasError = false;

    if (touched.amount && !form.amount.trim()) {
      newErrors.amount = "Amount is required";
      hasError = true;
    } else if (form.amount.trim() && isNaN(Number(form.amount.trim()))) {
      newErrors.amount = "Amount must be a number";
      hasError = true;
    }

    if (touched.receiver && !form.receiver.trim()) {
      newErrors.receiver = "Receiver address is required";
      hasError = true;
    }

    setErrors(newErrors);

    // If valid → build QR string
    if (!hasError && form.receiver.trim()) {
      // Ensure receiver is present for QR generation
      const protocol = coinProtocols[coin] || coin.toLowerCase();
      let qrString = `${protocol}:${form.receiver}`;

      const params = [];
      if (form.amount.trim() && !isNaN(Number(form.amount.trim())))
        params.push(`amount=${form.amount.trim()}`);
      if (form.message.trim())
        params.push(`message=${encodeURIComponent(form.message.trim())}`);

      if (params.length) qrString += `?${params.join("&")}`;

      setValue?.(qrString);
    } else {
      setValue?.("");
    }
  }, [form, touched, coin, setValue]);

  return (
    <Stack sx={{ flex: "1", p: "0px" }}>
      <Typography
        variant="body2"
        sx={{
          fontSize: "20px",
          fontWeight: "500",
          lineHeight: "21.78px", // Added for consistency
          color: "#253164",
          pb: "30px", // Adjusted padding for consistency
        }}
      >
        Crypto QR Code
      </Typography>

      {/* Coin selection */}
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
          gap: { xs: "31px", mob: "10px" },
          alignItems: "center",
        }}
        pb={{ xs: "0px", mob: "20px" }}
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
          CryptoCurrency
        </Typography>
        <Stack
          direction="row"
          spacing={5}
          sx={{ alignItems: "center", flex: 1, py: { xs: "10px", mob: "0px" } }}
        >
          <CustomizedRadios
            lables={Object.keys(coinProtocols)}
            value={coin}
            onChange={(val) => setCoin(val)}
          />
        </Stack>
      </Box>

      {/* Inputs */}
      <Stack spacing={2}>
        {bitcoinTextFieldsData.map((field, i) => (
          <Box
            key={i}
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
              justifyContent: { mob: "center" },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: "400",
                fontSize: "18px",
                lineHeight: "21.78px", // Added for consistency
                color: "#253164",
                minWidth: {
                  lg: "120px",
                  md: "120px",
                  sm: "120px",
                  xs: "120px",
                  mob: "100%",
                },
                textAlign: {
                  lg: "start",
                  md: "start",
                  sm: "start",
                  xs: "start",
                  mob: "center",
                },
              }}
            >
              {field.title}:
            </Typography>

            {/* Tooltip for errors */}
            <ErrorTooltip
              open={!!errors[field.name] && touched[field.name]} // Show error only if field has error and is touched
              title={errors[field.name] || ""}
              placement="top"
              arrow
            >
              <TextField
                variant="outlined"
                placeholder={field.placeholder}
                fullWidth
                value={form[field.name]}
                onChange={(e) => {
                  handleChange(field.name, e.target.value);
                  if (!touched[field.name])
                    setTouched((prev) => ({ ...prev, [field.name]: true })); // Mark as touched on first change
                }}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, [field.name]: true }))
                }
                error={!!errors[field.name] && touched[field.name]} // Show error style only if field has error and is touched
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
                        !!errors[field.name] && touched[field.name]
                          ? "2px solid #e53935"
                          : "2px solid #adf2fa", // Dynamic error border
                    },
                    "&:hover fieldset": {
                      border:
                        !!errors[field.name] && touched[field.name]
                          ? "2px solid #e53935"
                          : "1.5px solid #adf2fa", // Dynamic error border
                    },
                    "&.Mui-focused fieldset": {
                      border:
                        !!errors[field.name] && touched[field.name]
                          ? "2px solid #e53935"
                          : "1.5px solid #adf2fa", // Dynamic error border
                    },
                  },
                }}
              />
            </ErrorTooltip>
          </Box>
        ))}
      </Stack>

      {/* Selected Coin Display */}
      <Typography
        sx={{
          mt: 3,
          fontSize: "14px",
          fontWeight: "500",
          color: "#61698b",
          textAlign: "center",
        }}
      >
        Selected Coin: <span style={{ color: "#253164" }}>{coin}</span>
      </Typography>
    </Stack>
  );
}
