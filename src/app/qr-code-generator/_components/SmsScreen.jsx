"use client";
import React, { useEffect } from "react";
import {
  Box,
  Stack,
  TextField,
  Typography,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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

// ✅ Validation schema
const schema = yup.object().shape({
  number: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9+\s-]+$/, "Only digits, +, - and spaces allowed")
    .min(6, "Number too short"),
  message: yup
    .string()
    .required("Message is required")
    .max(500, "Max 500 chars"),
});

const vCardTextFieldsData = [
  {
    key: "number",
    title: "Number:",
    multiline: false,
    placeholder: "your phone number",
  },
  {
    key: "message",
    title: "Message:",
    multiline: true,
    placeholder: "Enter your text here",
  },
];

export default function SmsScreen({ setValue }) {
  const {
    control,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { number: "", message: "" },
  });

  const values = watch();

  // ✅ Build QR Code value when valid
  useEffect(() => {
    if (isValid) {
      const formatted = `SMSTO:${values.number}:${values.message}`;
      setValue(formatted);
    } else {
      setValue("");
    }
  }, [values, isValid, setValue]);

  return (
    <Stack sx={{ flex: "1", p: "0px" }}>
      <Typography
        variant="body2"
        sx={{
          fontSize: "20px",
          fontWeight: "500",
          lineHeight: "21.78px", // Added from VcardScreen for consistency
          color: "#253164",
          pb: "20px", // Adjusted padding for consistency
        }}
      >
        SMS QR Code
      </Typography>
      <Stack spacing={2}>
        {vCardTextFieldsData.map((field, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              flexDirection: {
                lg: "row",
                md: "row",
                sm: "row",
                xs: "column", // Changed from row to column on xs
                mob: "column",
              },
              gap: "20px",
              alignItems: { lg: "start", xs: "start", mob: "center" },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: "400",
                fontSize: "18px",
                lineHeight: "21.78px", // Added from VcardScreen for consistency
                color: "#253164",
                minWidth: { xs: "100%", sm: "120px" }, // Changed minWidth to 100% on xs
                pt: "6px", // Adjusted padding for text alignment
                textAlign: {
                  xs: "start",
                  sm: "start",
                  mob: "center",
                }, // Align text to center on xs and mob
                mb: { xs: 1, sm: 0 }, // Add margin bottom on xs
              }}
            >
              {field.title}
            </Typography>

            {/* ✅ Controlled field with error tooltip */}
            <Controller
              name={field.key}
              control={control}
              render={({ field: controllerField }) => (
                <ErrorTooltip // Using the updated ErrorTooltip
                  open={!!errors[field.key]}
                  title={errors[field.key]?.message || ""}
                  placement="top"
                  arrow
                >
                  <TextField
                    {...controllerField}
                    placeholder={field.placeholder}
                    multiline={field.multiline}
                    rows={field.multiline ? 3 : 1} // Explicitly set rows for multiline
                    maxRows={field.multiline ? 6 : undefined} // Explicitly set maxRows
                    error={!!errors[field.key]}
                    variant="outlined"
                    fullWidth
                    sx={{
                      flex: 1, // Ensure TextField takes available space
                      input: {
                        bgcolor: "#ffffff",
                        color: "#61698b",
                        fontSize: "14px",
                        boxSizing: "content-box",
                        px: "4px",
                        py: "10px",
                        "&::placeholder": { color: "#61698b", opacity: 1 },
                      },
                      "& .MuiOutlinedInput-root": {
                        px: "8px",
                        borderRadius: "8px", // Changed to 8px for consistency
                        bgcolor: "#ffffff",
                        "& fieldset": {
                          border: !!errors[field.key]
                            ? "2px solid #e53935"
                            : "2px solid #adf2fa", // Dynamic error border from VcardScreen
                        },
                        "&:hover fieldset": {
                          border: !!errors[field.key]
                            ? "2px solid #e53935"
                            : "1.5px solid #adf2fa", // Dynamic error border from VcardScreen
                        },
                        "&.Mui-focused fieldset": {
                          border: !!errors[field.key]
                            ? "2px solid #e53935"
                            : "1.5px solid #adf2fa", // Dynamic error border from VcardScreen
                        },
                        "& textarea": {
                          height: "100% !important", // Consistent multiline height
                          resize: "none",
                          overflowY: "scroll",
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                          "&::-webkit-scrollbar": { display: "none" },
                        },
                      },
                    }}
                  />
                </ErrorTooltip>
              )}
            />
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
