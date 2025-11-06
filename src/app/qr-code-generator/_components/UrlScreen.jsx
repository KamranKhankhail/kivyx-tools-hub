// "use client";
// import { Box, Stack, TextField } from "@mui/material";
// import React, { useState } from "react";

// export default function UrlScreen({ value, setValue }) {
//   const [error, setError] = useState("");

//   // ✅ URL validation (http(s):// OR www.)
//   const validateUrl = (url) => {
//     if (!url) return false;

//     // Normalize: add protocol if missing but starts with www
//     const normalized = url.startsWith("www.") ? "http://" + url : url;

//     try {
//       const parsed = new URL(normalized);
//       return !!parsed.hostname;
//     } catch {
//       return false;
//     }
//   };

//   const handleChange = (e) => {
//     const newValue = e.target.value;
//     setValue(newValue); // always push up to parent

//     if (!newValue.trim()) {
//       setError("Please enter a website URL");
//       return;
//     }

//     if (!validateUrl(newValue.trim())) {
//       setError(
//         "Invalid URL format (try starting with http://, https://, or www.)"
//       );
//       return;
//     }

//     setError(""); // valid input
//   };

//   return (
//     <Stack>
//       <TextField
//         multiline
//         fullWidth
//         rows={10}
//         maxRows={15}
//         value={value}
//         onChange={handleChange}
//         variant="outlined"
//         error={!!error}
//         helperText={error}
//         InputProps={{
//           startAdornment: !value && (
//             <Box
//               sx={{
//                 position: "absolute",
//                 top: "20px",
//                 left: "20px",
//                 pointerEvents: "none",
//                 color: "#9e9e9e",
//               }}
//             >
//               <Box sx={{ fontSize: "24px", fontWeight: 800, pb: "10px" }}>
//                 Enter your Website
//               </Box>
//               <Box sx={{ fontSize: "14px", fontWeight: 400 }}>
//                 (Your QR Code will be generated automatically)
//               </Box>
//             </Box>
//           ),
//         }}
//         sx={{
//           flex: 1,
//           width: "100%",
//           minWidth: "200px",
//           "& .MuiOutlinedInput-root": {
//             px: "8px",
//             borderRadius: "12px",
//             bgcolor: "#ffffff",
//             color: "#61698b",
//             height: "100%",
//             "& fieldset": { border: "2px solid #adf2fa" },
//             "&:hover fieldset": { border: "1.5px solid #adf2fa" },
//             "&.Mui-focused fieldset": { border: "1.5px solid #adf2fa" },
//             "& .MuiInputBase-input": {
//               fontSize: "24px",
//               fontWeight: 600,
//               fontFamily: "Arial, sans-serif",
//               px: "6px",
//             },
//             "& textarea": {
//               height: "100% !important",
//               resize: "none",
//               overflowY: "scroll",
//               scrollbarWidth: "none",
//               msOverflowStyle: "none",
//               "&::-webkit-scrollbar": { display: "none" },
//             },
//           },
//         }}
//       />
//     </Stack>
//   );
// }
import { Box, Stack, TextField, Tooltip, tooltipClasses } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import theme from "@/styles/theme";

// Styled tooltip (copied from SmsScreen.jsx) with gray arrow
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
              offset: [0, 0], // Adjust offset to align arrow more closely to the TextField
            },
          },
        ],
      },
      arrow: {
        sx: {
          color: "#e53935", // Gray color for the arrow
        },
      },
    }}
  />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#e53935",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 500,
    padding: "6px 12px",
    borderRadius: "8px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.25)",
    maxWidth: 300,
    textAlign: "center",
  },
}));

export default function UrlScreen({ value, setValue }) {
  const [error, setError] = useState("");

  // ✅ URL validation (http(s):// OR www.)
  const validateUrl = (url) => {
    if (!url) return false;

    // Normalize: add protocol if missing but starts with www
    const normalized = url.startsWith("www.") ? "http://" + url : url;

    try {
      const parsed = new URL(normalized);
      return !!parsed.hostname;
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue); // always push up to parent

    if (!newValue.trim()) {
      setError("Please enter a website URL");
      return;
    }

    if (!validateUrl(newValue.trim())) {
      setError(
        "Invalid URL format (try starting with http://, https://, or www.)"
      );
      return;
    }

    setError(""); // valid input
  };

  return (
    <Stack>
      <ErrorTooltip open={!!error} title={error} placement="top" arrow>
        <TextField
          multiline
          fullWidth
          rows={10}
          maxRows={15}
          value={value}
          onChange={handleChange}
          variant="outlined"
          error={!!error}
          // Removed helperText as error is now shown in Tooltip
          InputProps={{
            startAdornment: !value && (
              <Box
                sx={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  pointerEvents: "none",
                  color: theme.palette.primary.main,
                }}
              >
                <Box sx={{ fontSize: "24px", fontWeight: 800, pb: "10px" }}>
                  Enter your Website
                </Box>
                <Box sx={{ fontSize: "14px", fontWeight: 400 }}>
                  (Your QR Code will be generated automatically)
                </Box>
              </Box>
            ),
          }}
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
                borderWidth: "2px",
                borderColor: !!error
                  ? theme.palette.ui.delete
                  : theme.palette.secondary.secondMain,
              },
              "&:hover fieldset": {
                borderWidth: "2px",
                borderColor: !!error
                  ? theme.palette.ui.delete
                  : theme.palette.secondary.secondMain,
              },
              "&.Mui-focused fieldset": {
                borderWidth: "2px",
                borderColor: !!error
                  ? theme.palette.ui.delete
                  : theme.palette.secondary.secondMain,
              },
              "& .MuiInputBase-input": {
                fontSize: "24px",
                fontWeight: 600,
                fontFamily: "Arial, sans-serif",
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
    </Stack>
  );
}
