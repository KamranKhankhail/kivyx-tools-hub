"use client";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  FormGroup,
  tooltipClasses,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { styled } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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

// ✅ URL validation helper function (consistent with other screens)
const validateUrl = (url) => {
  if (!url) return false;
  const urlRegex =
    /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})$/i;
  return urlRegex.test(url);
};

export default function ImagesGalleryScreen({ setValue }) {
  const [images, setImages] = useState([""]); // Array of URLs
  const [touchedImages, setTouchedImages] = useState([false]); // Touched state for each URL input
  const [layout, setLayout] = useState("Grid");
  const [errors, setErrors] = useState([]); // Array of error messages

  // 🔹 Handle upload (convert file to object URL for preview)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...urls]);
    setTouchedImages((prev) => [...prev, ...Array(urls.length).fill(true)]); // Mark new uploads as touched
  };

  // 🔹 Update QR code value when data changes
  useEffect(() => {
    const newErrors = [];
    let hasOverallError = false;

    images.forEach((url, i) => {
      let errorMsg = "";
      if (touchedImages[i]) {
        // Only validate if touched
        if (!url.trim()) {
          errorMsg = "Image URL is required";
          hasOverallError = true;
        } else if (!validateUrl(url.trim())) {
          errorMsg =
            "Enter a valid image URL (e.g., https://example.com/image.jpg or www.example.com/image.png)";
          hasOverallError = true;
        }
      }
      newErrors[i] = errorMsg;
    });

    setErrors(newErrors);

    const validImages = images.filter(
      (url, i) => url.trim() !== "" && !newErrors[i]
    );

    if (hasOverallError || validImages.length === 0) {
      setValue("");
      return;
    }

    // Encode images in query string (use encodeURIComponent for safety)
    const encoded = encodeURIComponent(validImages.join(","));
    const qrLink = `/gallery?layout=${layout.toLowerCase()}&images=${encoded}`;
    setValue(qrLink);
  }, [images, layout, setValue, touchedImages]);

  // TextField URL change
  const handleChange = useCallback(
    (val, idx) => {
      const newImgs = [...images];
      newImgs[idx] = val;
      setImages(newImgs);
      if (!touchedImages[idx]) {
        setTouchedImages((prev) => {
          const newTouched = [...prev];
          newTouched[idx] = true;
          return newTouched;
        });
      }
    },
    [images, touchedImages]
  );

  const handleBlur = useCallback((idx) => {
    setTouchedImages((prev) => {
      const newTouched = [...prev];
      newTouched[idx] = true;
      return newTouched;
    });
  }, []);

  const handleAddImage = useCallback(() => {
    setImages((prev) => [...prev, ""]);
    setTouchedImages((prev) => [...prev, false]);
  }, []);

  const handleRemove = useCallback((idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setTouchedImages((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  return (
    <Stack sx={{ flex: 1, p: "0px" }} spacing={3}>
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
        Images Gallery QR Code
      </Typography>

      {/* Upload option */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <input
          accept="image/*"
          id="image-upload"
          type="file"
          multiple
          hidden
          onChange={handleFileUpload}
        />
        <label htmlFor="image-upload">
          <IconButton
            component="span"
            sx={{
              bgcolor: theme.palette.primary.main,
              borderRadius: "8px",
              p: 2,
              "&:hover": { bgcolor: theme.palette.primary.main },
            }}
          >
            <CloudUploadIcon
              sx={{
                fontSize: "32px",
                color: theme.palette.secondary.secondMain,
              }}
            />
          </IconButton>
        </label>
        <Typography variant="body2" sx={{ color: "#61698b" }}>
          Upload images or paste URLs below
        </Typography>
      </Stack>

      {/* Image URLs */}
      <Stack spacing={2}>
        {images.map((url, i) => (
          <Stack
            key={i}
            direction="row"
            spacing="20px" // Adjusted gap for consistency
            alignItems="center"
            sx={{ flex: 1 }}
          >
            <ErrorTooltip
              open={!!errors[i] && touchedImages[i]} // Only show if error and touched
              title={errors[i] || ""}
              placement="top"
              arrow
            >
              <TextField
                variant="outlined"
                placeholder={`Enter image URL ${i + 1}`}
                value={url}
                onChange={(e) => handleChange(e.target.value, i)}
                onBlur={() => handleBlur(i)}
                fullWidth
                error={!!errors[i] && touchedImages[i]} // Show error style only if error and touched
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
                        !!errors[i] && touchedImages[i]
                          ? theme.palette.ui.delete
                          : theme.palette.secondary.secondMain,
                    },
                    "&:hover fieldset": {
                      borderWidth: "2px",
                      borderColor:
                        !!errors[i] && touchedImages[i]
                          ? theme.palette.ui.delete
                          : theme.palette.secondary.secondMain,
                    },
                    "&.Mui-focused fieldset": {
                      borderWidth: "2px",
                      borderColor:
                        !!errors[i] && touchedImages[i]
                          ? theme.palette.ui.delete
                          : theme.palette.secondary.secondMain,
                    },
                  },
                }}
              />
            </ErrorTooltip>

            {images.length > 1 && (
              <IconButton onClick={() => handleRemove(i)}>
                <DeleteOutlineIcon sx={{ color: "#e53935" }} />
              </IconButton>
            )}
          </Stack>
        ))}
        {/* Updated "Add another image" button */}
        <Button
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddImage}
          variant="contained"
          sx={{
            alignSelf: "flex-start",
            textTransform: "none",
            bgcolor: theme.palette.primary.main, // Light blue background
            color: theme.palette.primary.fourthMain, // Dark text color
            borderRadius: "8px", // Consistent border radius
            px: "15px",
            py: "8px",
            boxShadow: "none", // Remove default button shadow
            "&:hover": {
              bgcolor: theme.palette.primary.main, // Light blue background
              color: theme.palette.primary.fourthMain, // Dark text color
              boxShadow: "none",
            },
          }}
        >
          <Tooltip title="Add another image URL field" placement="right" arrow>
            <span>Add another image</span> {/* Wrap text in span for tooltip */}
          </Tooltip>
        </Button>
      </Stack>

      {/* Layout radios */}
      <Stack spacing={1} sx={{ mt: 3 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: "400",
            fontSize: "18px",
            lineHeight: "21.78px", // Added for consistency
            color: "#253164",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            Gallery Layout:
            <Tooltip
              title="How images will be shown when scanning"
              placement="right"
              arrow
            >
              <HelpOutlinedIcon
                sx={{ fontSize: 18, color: "#96999f", cursor: "pointer" }}
              />
            </Tooltip>
          </span>
        </Typography>

        <FormGroup>
          <CustomizedRadios
            lables={["Grid", "Carousel", "Masonry"]}
            value={layout}
            onChange={(val) => setLayout(val)}
          />
        </FormGroup>
      </Stack>
    </Stack>
  );
}
