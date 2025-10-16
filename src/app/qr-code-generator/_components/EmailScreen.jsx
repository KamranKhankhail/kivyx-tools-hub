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
        sx: { zIndex: 1500 }, // Retaining zIndex from VcardScreen's original Tooltip
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
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  subject: yup.string().required("Subject is required").min(2, "Too short"),
  message: yup
    .string()
    .required("Message is required")
    .max(1000, "Message too long (max 1000 chars)"),
});

export default function EmailScreen({ setValue }) {
  const {
    control,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { email: "", subject: "", message: "" },
  });

  const values = watch();

  // ✅ Generate QR code data
  useEffect(() => {
    if (isValid) {
      const formatted = `MATMSG:TO:${values.email};SUB:${values.subject};BODY:${values.message};;`;
      setValue(formatted);
    } else {
      setValue("");
    }
  }, [values, isValid, setValue]);

  return (
    <Stack sx={{ flex: "1", p: "0px" }} spacing={2}>
      <Typography
        variant="body2"
        sx={{
          fontSize: "20px",
          fontWeight: "500",
          lineHeight: "21.78px", // Added from VcardScreen
          color: "#253164",
          pb: "20px", // Adjusted padding for consistency
        }}
      >
        Email QR Code
      </Typography>

      {/* Email */}
      <FieldRow
        label="Email:"
        name="email"
        control={control}
        error={errors.email}
        placeholder="Your Email"
      />

      {/* Subject */}
      <FieldRow
        label="Subject:"
        name="subject"
        control={control}
        error={errors.subject}
        placeholder="Enter email subject"
      />

      {/* Message */}
      <FieldRow
        label="Message:"
        name="message"
        control={control}
        error={errors.message}
        placeholder="Enter your message"
        multiline
      />
    </Stack>
  );
}

// ✅ Reusable FieldRow with updated styling
// function FieldRow({ label, name, control, error, placeholder, multiline }) {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "row",
//         gap: "20px",
//         alignItems: "start",
//       }}
//     >
//       <Typography
//         variant="body2"
//         sx={{
//           fontWeight: "400",
//           fontSize: "18px",
//           lineHeight: "21.78px", // Added from VcardScreen
//           color: "#253164",
//           minWidth: "120px",
//           pt: "6px", // Retained for multiline alignment
//         }}
//       >
//         {label}
//       </Typography>

//       <Controller
//         name={name}
//         control={control}
//         render={({ field }) => (
//           <ErrorTooltip
//             open={!!error}
//             title={error?.message || ""}
//             placement="top"
//             arrow
//           >
//             <TextField
//               {...field}
//               placeholder={placeholder}
//               multiline={multiline}
//               rows={multiline ? 3 : 1}
//               maxRows={multiline ? 6 : undefined}
//               error={!!error}
//               variant="outlined"
//               fullWidth
//               sx={{
//                 flex: 1, // Ensure TextField takes available space
//                 input: {
//                   bgcolor: "#ffffff",
//                   color: "#61698b",
//                   fontSize: "14px",
//                   px: "4px",
//                   py: "10px",
//                 },
//                 "& .MuiOutlinedInput-root": {
//                   px: "8px",
//                   borderRadius: "8px", // Changed to 8px from 10px to match VcardScreen
//                   bgcolor: "#ffffff",
//                   "& fieldset": {
//                     border: !!error ? "2px solid #e53935" : "2px solid #adf2fa", // Dynamic error border from VcardScreen
//                   },
//                   "&:hover fieldset": {
//                     border: !!error
//                       ? "2px solid #e53935"
//                       : "1.5px solid #adf2fa", // Dynamic error border from VcardScreen
//                   },
//                   "&.Mui-focused fieldset": {
//                     border: !!error
//                       ? "2px solid #e53935"
//                       : "1.5px solid #adf2fa", // Dynamic error border from VcardScreen
//                   },
//                   "& textarea": {
//                     height: "100% !important", // Consistent multiline height
//                     resize: "none",
//                     overflowY: "scroll",
//                     scrollbarWidth: "none",
//                     msOverflowStyle: "none",
//                     "&::-webkit-scrollbar": { display: "none" },
//                   },
//                 },
//               }}
//             />
//           </ErrorTooltip>
//         )}
//       />
//     </Box>
//   );
// }

// ... existing code ...
function FieldRow({ label, name, control, error, placeholder, multiline }) {
  return (
    <Box
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
        alignItems: { lg: "start", xs: "center", mob: "center" }, // Align items to start on lg, center on xs and mob
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: "400",
          fontSize: "18px",
          lineHeight: "21.78px", // Added from VcardScreen
          color: "#253164",
          minWidth: { xs: "100%", sm: "120px" }, // Changed minWidth to 100% on xs
          pt: "6px", // Retained for multiline alignment
          textAlign: {
            xs: "start",
            sm: "start",
            mob: "center",
          }, // Align text to center on xs and mob
          mb: { xs: 1, sm: 0 }, // Add margin bottom on xs
        }}
      >
        {label}
      </Typography>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ErrorTooltip
            open={!!error}
            title={error?.message || ""}
            placement="top"
            arrow
          >
            <TextField
              {...field}
              placeholder={placeholder}
              multiline={multiline}
              rows={multiline ? 3 : 1}
              maxRows={multiline ? 6 : undefined}
              error={!!error}
              variant="outlined"
              fullWidth
              sx={{
                flex: 1, // Ensure TextField takes available space
                input: {
                  bgcolor: "#ffffff",
                  color: "#61698b",
                  fontSize: "14px",
                  px: "4px",
                  py: "10px",
                },
                "& .MuiOutlinedInput-root": {
                  px: "8px",
                  borderRadius: "8px", // Changed to 8px from 10px to match VcardScreen
                  bgcolor: "#ffffff",
                  "& fieldset": {
                    border: !!error ? "2px solid #e53935" : "2px solid #adf2fa", // Dynamic error border from VcardScreen
                  },
                  "&:hover fieldset": {
                    border: !!error
                      ? "2px solid #e53935"
                      : "1.5px solid #adf2fa", // Dynamic error border from VcardScreen
                  },
                  "&.Mui-focused fieldset": {
                    border: !!error
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
  );
}
