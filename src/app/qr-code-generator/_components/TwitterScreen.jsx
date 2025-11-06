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

const twitterOptions = ["Link to your profile", "Post a tweet"];

export default function TwitterScreen({ setValue }) {
  const [option, setOption] = useState("Link to your profile");
  const [form, setForm] = useState({ username: "", tweet: "" });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({ username: "", tweet: "" });

  // 🔹 Handle input changes
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Validation + QR Builder
  useEffect(() => {
    const newErrors = { username: "", tweet: "" };
    let hasError = false;

    if (option === "Link to your profile") {
      if (touched.username && !form.username.trim()) {
        newErrors.username = "Username is required";
        hasError = true;
      }
    }

    if (option === "Post a tweet") {
      if (touched.tweet && !form.tweet.trim()) {
        newErrors.tweet = "Tweet text is required";
        hasError = true;
      }
    }

    setErrors(newErrors);

    // If valid → build QR string
    if (option === "Link to your profile" && !newErrors.username) {
      const username = form.username.replace(/^@/, ""); // remove leading @
      setValue?.(`https://twitter.com/${username}`);
    } else if (option === "Post a tweet" && !newErrors.tweet) {
      setValue?.(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          form.tweet
        )}`
      );
    } else {
      setValue?.("");
    }
  }, [form, touched, option, setValue]);

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
        Twitter QR Code
      </Typography>

      {/* Options selection */}
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
          Choose an option:
        </Typography>
        <Stack
          direction="row"
          spacing={5}
          sx={{ alignItems: "center", flex: 1, py: "10px" }}
        >
          <CustomizedRadios
            lables={twitterOptions}
            value={option}
            onChange={(val) => setOption(val)}
          />
        </Stack>
      </Box>

      {/* Username or Tweet input */}
      {option === "Link to your profile" && (
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
            Username:
          </Typography>

          <ErrorTooltip // Replaced Tooltip with ErrorTooltip
            open={!!errors.username && touched.username} // Only show if error and touched
            title={errors.username || ""}
            placement="top"
            arrow
          >
            <TextField
              variant="outlined"
              placeholder="@username"
              fullWidth
              value={form.username}
              onChange={(e) => {
                handleChange("username", e.target.value);
                if (!touched.username)
                  setTouched((prev) => ({ ...prev, username: true })); // Mark as touched
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, username: true }))} // Mark as touched on blur
              error={!!errors.username && touched.username} // Show error style only if error and touched
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
                      !!errors.username && touched.username
                        ? theme.palette.ui.delete
                        : theme.palette.secondary.secondMain,
                  },
                  "&:hover fieldset": {
                    borderWidth: "2px",
                    borderColor:
                      !!errors.username && touched.username
                        ? theme.palette.ui.delete
                        : theme.palette.secondary.secondMain,
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: "2px",
                    borderColor:
                      !!errors.username && touched.username
                        ? theme.palette.ui.delete
                        : theme.palette.secondary.secondMain,
                  },
                },
              }}
            />
          </ErrorTooltip>
        </Box>
      )}

      {option === "Post a tweet" && (
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
              mob: "20px",
            },
            alignItems: "start", // Changed to 'start' for multiline consistency
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
              pt: "6px", // Adjusted padding for text alignment
            }}
          >
            Your tweet:
          </Typography>

          <ErrorTooltip // Replaced Tooltip with ErrorTooltip
            open={!!errors.tweet && touched.tweet} // Only show if error and touched
            title={errors.tweet || ""}
            placement="top"
            arrow
          >
            <TextField
              variant="outlined"
              placeholder="What's happening?"
              fullWidth
              multiline // Added multiline as tweets can be long
              rows={3} // Sensible default rows for tweets
              maxRows={6} // Sensible max rows for tweets
              value={form.tweet}
              onChange={(e) => {
                handleChange("tweet", e.target.value);
                if (!touched.tweet)
                  setTouched((prev) => ({ ...prev, tweet: true })); // Mark as touched
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, tweet: true }))} // Mark as touched on blur
              error={!!errors.tweet && touched.tweet} // Show error style only if error and touched
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
                      !!errors.tweet && touched.tweet
                        ? theme.palette.ui.delete
                        : theme.palette.secondary.secondMain,
                  },
                  "&:hover fieldset": {
                    borderWidth: "2px",
                    borderColor:
                      !!errors.tweet && touched.tweet
                        ? theme.palette.ui.delete
                        : theme.palette.secondary.secondMain,
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: "2px",
                    borderColor:
                      !!errors.tweet && touched.tweet
                        ? theme.palette.ui.delete
                        : theme.palette.secondary.secondMain,
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
        </Box>
      )}
    </Stack>
  );
}
