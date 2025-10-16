// import React, { useEffect, useState } from "react";
// import {
//   Stack,
//   TextField,
//   Typography,
//   Tooltip,
//   tooltipClasses,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// // ✅ Validation schema
// const schema = yup.object().shape({
//   message: yup
//     .string()
//     .required("Message is required")
//     .max(1000, "Message too long (max 1000 chars)"),
// });

// // ✅ Custom styled tooltip
// const ErrorTooltip = styled(({ className, ...props }) => (
//   <Tooltip {...props} classes={{ popper: className }} />
// ))(() => ({
//   [`& .${tooltipClasses.tooltip}`]: {
//     backgroundColor: "#ff4d4f", // softer red
//     color: "#fff",
//     fontSize: "13px",
//     fontWeight: 500,
//     padding: "6px 12px",
//     borderRadius: "8px",
//     textAlign: "center",
//     boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
//   },
//   [`& .${tooltipClasses.arrow}`]: {
//     color: "#ff4d4f",
//   },
// }));

// export default function TextScreen({ setValue }) {
//   const {
//     control,
//     watch,
//     formState: { errors, isValid },
//   } = useForm({
//     resolver: yupResolver(schema),
//     mode: "onChange", // validate as typing
//     defaultValues: { message: "" },
//   });

//   const message = watch("message");
//   const [touched, setTouched] = useState(false);

//   // ✅ Update QR value only if valid
//   useEffect(() => {
//     if (isValid) {
//       setValue(message.trim());
//     } else {
//       setValue("");
//     }
//   }, [message, isValid, setValue]);

//   return (
//     <Stack spacing={2} sx={{ flex: 1 }}>
//       <Typography
//         sx={{
//           fontSize: "20px",
//           fontWeight: 600,
//           color: "#253164",
//         }}
//       >
//         Text QR Code
//       </Typography>

//       <Controller
//         name="message"
//         control={control}
//         render={({ field }) => (
//           <ErrorTooltip
//             open={touched && !!errors.message} // ✅ show only after typing
//             title={errors.message?.message || ""}
//             placement="top"
//             arrow
//           >
//             <TextField
//               {...field}
//               multiline
//               fullWidth
//               rows={10}
//               // placeholder="Enter your message..."
//               error={!!errors.message}
//               variant="outlined"
//               onChange={(e) => {
//                 setTouched(true); // ✅ user typed
//                 field.onChange(e);
//               }}
//               InputProps={{
//                 startAdornment: !control && (
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       top: "20px",
//                       left: "20px",
//                       pointerEvents: "none",
//                       color: "#9e9e9e",
//                     }}
//                   >
//                     <Box sx={{ fontSize: "24px", fontWeight: 800, pb: "10px" }}>
//                       Enter your Website
//                     </Box>
//                     <Box sx={{ fontSize: "14px", fontWeight: 400 }}>
//                       (Your QR Code will be generated automatically)
//                     </Box>
//                   </Box>
//                 ),
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   px: "8px",
//                   borderRadius: "12px",
//                   bgcolor: "#ffffff",
//                   "& fieldset": { border: "2px solid #adf2fa" },
//                   "&:hover fieldset": { border: "1.5px solid #adf2fa" },
//                   "&.Mui-focused fieldset": { border: "1.5px solid #adf2fa" },
//                   "& textarea": {
//                     fontSize: "18px",
//                     fontWeight: 500,
//                     lineHeight: 1.5,
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
//     </Stack>
//   );
// }

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
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 0], // Adjusted offset
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

// Validation schema
const schema = yup.object().shape({
  text: yup.string().required("Text is required").max(500, "Max 500 chars"),
});

export default function TextScreen({ setValue, value }) {
  const {
    control,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { text: "" },
  });

  const values = watch();

  // Build QR Code value when valid
  useEffect(() => {
    if (isValid) {
      setValue(values.text);
    } else {
      setValue("");
    }
  }, [values.text, isValid, setValue]);

  return (
    <Stack sx={{ flex: "1" }}>
      <Typography
        variant="body2"
        sx={{
          fontSize: "20px",
          fontWeight: "500",
          lineHeight: "21.78px",
          color: "#253164",
          pb: "20px",
        }}
      >
        TEXT QR Code
      </Typography>

      {/* ✅ Controlled field with error tooltip and UrlScreen TextField styles */}
      <Controller
        name="text"
        control={control}
        render={({ field }) => (
          <ErrorTooltip
            open={!!errors.text}
            title={errors.text?.message || ""}
            placement="top"
            arrow
          >
            <TextField
              {...field}
              multiline
              fullWidth
              rows={10}
              maxRows={15}
              // placeholder={`Enter your Text\n(Your QR Code will be generated automatically)`}
              variant="outlined"
              InputProps={{
                startAdornment: !value && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "20px",
                      left: "20px",
                      pointerEvents: "none",
                      color: "#9e9e9e",
                    }}
                  >
                    <Box sx={{ fontSize: "24px", fontWeight: 800, pb: "10px" }}>
                      Enter your Text
                    </Box>
                    <Box sx={{ fontSize: "14px", fontWeight: 400 }}>
                      (Your QR Code will be generated automatically)
                    </Box>
                  </Box>
                ),
              }}
              error={!!errors.text}
              sx={{
                flex: 1,
                width: "100%",
                minWidth: "200px",
                "& .MuiOutlinedInput-root": {
                  px: "8px",
                  borderRadius: "12px",
                  bgcolor: "#ffffff",
                  color: "#61698b",
                  height: "100%",
                  "& fieldset": {
                    border: !!errors.text
                      ? "2px solid #e53935"
                      : "2px solid #adf2fa",
                  },
                  "&:hover fieldset": {
                    border: !!errors.text
                      ? "2px solid #e53935"
                      : "1.5px solid #adf2fa",
                  },
                  "&.Mui-focused fieldset": {
                    border: !!errors.text
                      ? "2px solid #e53935"
                      : "1.5px solid #adf2fa",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "24px", // Matches UrlScreen
                    fontWeight: 600, // Matches UrlScreen
                    fontFamily: "Arial, sans-serif", // Matches UrlScreen
                    px: "6px",
                  },
                  "& textarea": {
                    height: "100% !important",
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
    </Stack>
  );
}
