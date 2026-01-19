"use client";
import {
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import UrlScreen from "./UrlScreen";
import SmsScreen from "./SmsScreen";
import VcardScreen from "./VcardScreen";
import TextScreen from "./TextScreen";
import EmailScreen from "./EmailScreen";
import WifiScreen from "./WifiScreen";
import TwitterScreen from "./TwitterScreen";
import FacebookScreen from "./FacebookScreen";
import Mp3Screen from "./Mp3Screen";
import AppStoresScreen from "./AppStoresScreen";
import ImageGalleryScreen from "./ImageGalleryScreen";

import { useEffect, useState, useRef, useCallback } from "react";
import { AppsOutageSharp } from "@mui/icons-material";
import BitcoinScreen from "./BitcoinScreen";
import QRCodeStyling from "qr-code-styling";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DownloadIcon from "@mui/icons-material/Download";
import PdfScreen from "./PdfScreen";
import html2canvas from "html2canvas";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// 🔹 data for left buttons
// Import Material-UI Icons
import LinkIcon from "@mui/icons-material/Link"; // For URL
import ContactPhoneIcon from "@mui/icons-material/ContactPhone"; // For VCARD
import TextFieldsIcon from "@mui/icons-material/TextFields"; // For TEXT
import EmailIcon from "@mui/icons-material/Email"; // For E-MAIL
import SmsIcon from "@mui/icons-material/Sms"; // For SMS
import WifiIcon from "@mui/icons-material/Wifi"; // For WIFI
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin"; // For BITCOIN
import TwitterIcon from "@mui/icons-material/Twitter"; // For TWITTER
import FacebookIcon from "@mui/icons-material/Facebook"; // For FACEBOOK
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; // For PDF
import AudiotrackIcon from "@mui/icons-material/Audiotrack"; // For MP3
import ShopTwoIcon from "@mui/icons-material/ShopTwo"; // For APP STORES
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary"; // For IMAGES
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner"; // For 2D BARCODES
import theme from "@/styles/theme";

// 🔹 data for left buttons
const qrCodesButtonsData = [
  {
    title: "URL",
    tooltipText: "Opens the URL after scanning",
    openingComponent: UrlScreen,
    icon: LinkIcon, // Replaced with MUI LinkIcon
  },
  {
    title: "VCARD",
    tooltipText: "Saves contact details on the smartphone",
    openingComponent: VcardScreen,
    icon: ContactPhoneIcon, // Replaced with MUI ContactPhoneIcon
  },
  {
    title: "TEXT",
    tooltipText: "Displays a plain text",
    openingComponent: TextScreen,
    icon: TextFieldsIcon, // Replaced with MUI TextFieldsIcon
  },
  {
    title: "E-MAIL",
    tooltipText: "Sends an email with a predefined text",
    openingComponent: EmailScreen,
    icon: EmailIcon, // Replaced with MUI EmailIcon
  },
  {
    title: "SMS",
    tooltipText: "Sends an SMS with a predefined text",
    openingComponent: SmsScreen,
    icon: SmsIcon, // Replaced with MUI SmsIcon
  },
  {
    title: "WIFI",
    tooltipText: "Connects to a WiFi network",
    icon: WifiIcon, // Replaced with MUI WifiIcon
    openingComponent: WifiScreen,
  },
  {
    title: "BITCOIN",
    tooltipText: "Requests crypto payments",
    icon: CurrencyBitcoinIcon, // Replaced with MUI CurrencyBitcoinIcon
    openingComponent: BitcoinScreen,
  },
  {
    title: "TWITTER",
    tooltipText: "Posts a tweet",
    icon: TwitterIcon, // Replaced with MUI TwitterIcon
    openingComponent: TwitterScreen,
  },
  {
    title: "FACEBOOK",
    tooltipText: "Displays a Facebook button",
    icon: FacebookIcon, // Replaced with MUI FacebookIcon
    openingComponent: FacebookScreen,
  },
  // {
  //   title: "PDF",
  //   tooltipText: "Displays a PDF",
  //   icon: PictureAsPdfIcon, // Replaced with MUI PictureAsPdfIcon
  //   openingComponent: PdfScreen,
  // },
  // {
  //   title: "MP3",
  //   tooltipText: "Plays an MP3 file",
  //   icon: AudiotrackIcon, // Replaced with MUI AudiotrackIcon
  //   openingComponent: Mp3Screen,
  // },
  {
    title: "APP STORES",
    tooltipText: "Redirects to different app stores",
    icon: ShopTwoIcon, // Replaced with MUI ShopTwoIcon
    openingComponent: AppStoresScreen,
  },
  // {
  //   title: "IMAGES",
  //   tooltipText: "Shows an image gallery",
  //   icon: PhotoLibraryIcon, // Replaced with MUI PhotoLibraryIcon
  //   openingComponent: ImageGalleryScreen,
  // },
];

// Frame data for the QR code preview container
const frameData = {
  none: {
    // For 'none', we don't use an image, just style the container directly around the QR.
    containerStyles: {
      border: "none",
      padding: "0px",
      backgroundColor: "#ffffff",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    qrStyles: {
      position: "relative", // Not absolute for 'none' to allow direct sizing
      width: "100%", // QR takes full width of its container
      height: "100%", // QR takes full height of its container
    },
    frameAspectRatio: 1, // Default aspect ratio for sizing if no image
  },
  default: {
    // For 'default', we keep the old border styles, no image.
    containerStyles: {
      border: "4px solid #3f51b5", // A simple blue border
      borderRadius: "8px",
      padding: "10px",
      backgroundColor: "#ffffff",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    qrStyles: {
      position: "relative",
      width: "100%",
      height: "100%",
    },
    frameAspectRatio: 1, // Default aspect ratio for sizing if no image
  },
  rounded: {
    containerStyles: {
      border: "4px solid #4caf50", // A green rounded border
      borderRadius: "20px",
      padding: "10px",
      backgroundColor: "#ffffff",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    qrStyles: {
      position: "relative",
      width: "100%",
      height: "100%",
    },
    frameAspectRatio: 1, // Default aspect ratio for sizing if no image
  },
  dashed: {
    containerStyles: {
      border: "4px dashed #ff9800", // An orange dashed border
      borderRadius: "8px",
      padding: "10px",
      backgroundColor: "#ffffff",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    qrStyles: {
      position: "relative",
      width: "100%",
      height: "100%",
    },
    frameAspectRatio: 1, // Default aspect ratio for sizing if no image
  },
  thick: {
    containerStyles: {
      border: "8px solid #f44336", // A thick red border
      borderRadius: "0px",
      padding: "5px",
      backgroundColor: "#ffffff",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    qrStyles: {
      position: "relative",
      width: "100%",
      height: "100%",
    },
    frameAspectRatio: 1, // Default aspect ratio for sizing if no image
  },
  scanMeFrame: {
    imagePath: "/images/frame1.png",
    frameAspectRatio: 0.7142, // Estimated based on 500px width / 700px height
    qrRelativeTop: "7.14%", // (50 / 700) * 100
    qrRelativeLeft: "10%", // (50 / 500) * 100
    qrRelativeSize: "80%", // (400 / 500) * 100 (relative to container width)
    containerStyles: {
      position: "relative",
      backgroundColor: "transparent", // Frame image provides the background
      display: "flex", // Keep for centering if image isn't perfect
      alignItems: "center",
      justifyContent: "center",
    },
  },
  // Add more frame styles as needed
};

export default function QrCodeGeneratorClient() {
  const [activeComponentIndex, setActiveComponentIndex] = useState(0); // New state for active button index, default to URL (index 0)
  const [ActiveComponent, setActiveComponent] = useState(null);

  const [activeValue, setActiveValue] = useState("");
  const [qrValue, setQrValue] = useState("https://example.com");
  const qrCodeRef = useRef(null); // Ref for the QRCodeStyling instance
  const qrCodeContainerRef = useRef(null); // Ref for the div where QR code is appended
  const frameRef = useRef(null); // Ref for the entire QR code preview box (including frame)

  // QR code styling states
  const [dotColor, setDotColor] = useState("#000000");
  const [dotType, setDotType] = useState("square");
  const [cornerSquareType, setCornerSquareType] = useState("square");
  const [cornerDotType, setCornerDotType] = useState("square");
  const [qrLogo, setQrLogo] = useState("");
  const [selectedFrame, setSelectedFrame] = useState("none"); // New state for frame

  // New state for customizable QR code size
  const [qrCodeDisplaySize, setQrCodeDisplaySize] = useState(180); // Default size to 250

  // New state for mobile menu dropdown
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get current frame data based on selection
  const currentFrame = frameData[selectedFrame];

  useEffect(() => {
    // Set initial active component based on activeComponentIndex
    setActiveComponent(
      () => qrCodesButtonsData[activeComponentIndex].openingComponent
    );

    // Initialize QRCodeStyling only once
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        width: qrCodeDisplaySize, // Use new state
        height: qrCodeDisplaySize, // Use new state
        data: qrValue,
        dotsOptions: {
          color: dotColor,
          type: dotType,
        },
        cornersSquareOptions: {
          type: cornerSquareType,
          color: dotColor,
        },
        cornersDotOptions: {
          type: cornerDotType,
          color: dotColor,
        },
        image: qrLogo,
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 0,
        },
      });
      if (qrCodeContainerRef.current) {
        qrCodeRef.current.append(qrCodeContainerRef.current);
      }
    }
  }, []); // Empty dependency array means this runs only once on mount

  useEffect(() => {
    // Update QR code whenever relevant state changes
    if (qrCodeRef.current) {
      // Ensure size is at least 100 to prevent rendering errors
      const safeSize = Math.max(100, Number(qrCodeDisplaySize) || 100); // Handle empty string gracefully
      qrCodeRef.current.update({
        width: safeSize, // Update width
        height: safeSize, // Update height
        data: qrValue,
        dotsOptions: {
          color: dotColor,
          type: dotType,
        },
        cornersSquareOptions: {
          type: cornerSquareType,
          color: dotColor,
        },
        cornersDotOptions: {
          type: cornerDotType,
          color: dotColor,
        },
        image: qrLogo,
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 0,
          imageSize: 0.4,
        },
      });
    }
  }, [
    qrValue,
    dotColor,
    dotType,
    cornerSquareType,
    cornerDotType,
    qrLogo,
    qrCodeDisplaySize,
  ]); // Add qrCodeDisplaySize to dependency array
  useEffect(() => {
    // Reset activeValue when ActiveComponent changes
    setActiveValue("");
  }, [ActiveComponent]);

  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleGenerate = () => {
    if (!activeValue.trim()) {
      setToast({ open: true, message: "Enter some data!", severity: "error" });
      return;
    }

    setQrValue(activeValue);
    setHistory((prev) => [...prev, activeValue]);
    setToast({ open: true, message: "QR generated!", severity: "success" });
  };

  const DOWNLOAD_RESOLUTION = 1200; // Hardcoded high resolution for downloads

  const createDownloadQrCode = useCallback(() => {
    return new QRCodeStyling({
      width: DOWNLOAD_RESOLUTION, // Use hardcoded high resolution
      height: DOWNLOAD_RESOLUTION, // Use hardcoded high resolution
      data: qrValue,
      dotsOptions: {
        color: dotColor,
        type: dotType,
      },
      cornersSquareOptions: {
        type: cornerSquareType,
        color: dotColor,
      },
      cornersDotOptions: {
        type: cornerDotType,
        color: dotColor,
      },
      image: qrLogo,
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 20, // Add 20 pixels of white margin around the entire QR code in the downloaded image
      },
      backgroundOptions: {
        // Explicitly set white background for downloaded QR code
        color: "#ffffff",
      },
      margin: 40,
    });
  }, [qrValue, dotColor, dotType, cornerSquareType, cornerDotType, qrLogo]);

  const handleDownloadJpg = useCallback(() => {
    try {
      const tempQrCode = createDownloadQrCode();
      tempQrCode.download({
        extension: "jpg",
        name: "qrcode",
      });
      setToast({ open: true, message: "JPG downloaded!", severity: "success" });
    } catch (error) {
      console.error("Error generating JPG:", error);
      setToast({
        open: true,
        message: "Failed to download JPG.",
        severity: "error",
      });
    }
  }, [createDownloadQrCode]);

  const handleDownloadPng = useCallback(() => {
    try {
      const tempQrCode = createDownloadQrCode();
      tempQrCode.download({
        extension: "png",
        name: "qrcode",
      });
      setToast({ open: true, message: "PNG downloaded!", severity: "success" });
    } catch (error) {
      console.error("Error generating PNG:", error);
      setToast({
        open: true,
        message: "Failed to download PNG.",
        severity: "error",
      });
    }
  }, [createDownloadQrCode]);
  const handleDownloadSvg = useCallback(() => {
    if (qrCodeRef.current) {
      qrCodeRef.current.download({
        extension: "svg",
        name: "qrcode",
      });
      setToast({ open: true, message: "SVG downloaded!", severity: "success" });
    } else {
      setToast({
        open: true,
        message: "QR code not ready for SVG download.",
        severity: "error",
      });
    }
  }, []);

  // Calculate dynamic dimensions for the frame container based on qrCodeDisplaySize
  const safeQrCodeDisplaySize = Math.max(100, Number(qrCodeDisplaySize) || 100);
  // When using an image frame, the container width is derived from the desired QR size and its relative size within the original frame.
  const frameContainerWidth = currentFrame.imagePath
    ? `${
        safeQrCodeDisplaySize / (parseFloat(currentFrame.qrRelativeSize) / 100)
      }px`
    : `${safeQrCodeDisplaySize}px`; // For non-image frames, it's just QR size
  const frameContainerHeight = currentFrame.imagePath
    ? `${parseFloat(frameContainerWidth) / currentFrame.frameAspectRatio}px`
    : `${safeQrCodeDisplaySize}px`; // For non-image frames, it's just QR size

  return (
    <Stack
      sx={{
        my: { lg: "2px", md: "2px", sm: "2px", xs: "2px", mob: "2px" },
        mx: { lg: "50px", md: "50px", sm: "20px", xs: "10px", mob: "10px" },
        minHeight: "100vh",
      }}
    >
      <Grid
        container
        columns={12}
        spacing={{ lg: 0, md: 0, sm: 0, xs: 0, mob: 0 }}
        sx={{
          // px: { lg: "50px", md: "50px", sm: "44px", xs: "44px", mob: "30px" },
          alignItems: { md: "start", lg: "start" },
          // pt: "40px",/
          bgcolor: "#ffffff",

          borderRadius: "20px",
          alignItems: "stretch",
        }}
      >
        {/* LEFT TEXT BLOCK */}
        <Grid
          item
          size={{ md: 8, sm: 8, xs: 12, mob: 12 }}
          sx={{
            borderRight: { sm: "16px solid #1fd5e92a", xs: "none" },
            borderBottom: {
              sm: "none",
              xs: "16px solid #f1f3f4",
              mob: "16px solid #f1f3f4",
            },

            // borderRadius: "20px",
            p: { lg: "40px", md: "40px", sm: "40px", xs: "40px", mob: "16px" },
          }}
        >
          <Stack direction="column" sx={{ gap: { xs: "10px", sm: "10px" } }}>
            {/* Menu toggle button - visible only on mobile/xs */}
            <Box
              sx={{
                display: { xs: "block", sm: "none" }, // Show on extra small screens, hide on small and up
                width: "100%", // Take full width on mobile
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                startIcon={
                  isMenuOpen ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )
                }
                sx={{
                  textTransform: "none",
                  py: "8px",
                  borderRadius: "8px",
                  bgcolor: isMenuOpen ? "#1fd5e9" : "transparent", // Active background color
                  color: isMenuOpen ? "#ffffff" : "#616568cd", // Active text color
                  borderColor: isMenuOpen ? "#1fd5e9" : "#adf2fa", // Active border color
                  "&:hover": {
                    bgcolor: "#E9FBFD", // Hover background color
                    color: "#1fd5e9", // Hover text color
                    borderColor: "#1fd5e9", // Hover border color
                  },
                  boxShadow: "none",
                }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                Select QR Code Type
              </Button>
            </Box>

            {/* Container for all QR type buttons */}
            <Stack
              direction={{ xs: "column", sm: "row" }} // Column on xs, row on sm and up
              sx={{
                flexWrap: "wrap",
                gap: "10px",
                display: {
                  mob: isMenuOpen ? "flex" : "none", // Show on xs if menu is open, otherwise hide
                  sm: "flex", // Always show on sm and up
                },
                width: { xs: "100%", sm: "auto" }, // Take full width on xs, auto on sm+
              }}
            >
              {qrCodesButtonsData.map((qrCodeButton, index) => {
                const isActiveButton = activeComponentIndex === index;
                return (
                  <Tooltip
                    key={index}
                    title={qrCodeButton.tooltipText}
                    placement="top"
                    arrow
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: "zIndex",
                            enabled: true,
                            phase: "write",
                            fn: ({ state }) => {
                              state.styles.popper.zIndex = 9999;
                            },
                          },
                        ],
                      },
                      tooltip: {
                        sx: {
                          bgcolor: "#333",
                          color: "#fff",
                          fontSize: "14px",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "8px",
                        },
                      },
                      arrow: {
                        sx: { color: "#333" },
                      },
                    }}
                  >
                    <Button
                      variant="outlined" // Start with outlined variant
                      startIcon={<qrCodeButton.icon />}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "3px",
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                        textTransform: "none",
                        py: "8px", // Adjusted padding
                        px: "0px", // Adjusted padding
                        minWidth: { xs: "100%", sm: "135px" }, // Full width on xs, fixed on sm+
                        flex: { xs: "none", sm: "1" }, // No flex grow on xs, flex grow on sm+
                        minHeight: "48px", // Ensure consistent height
                        bgcolor: isActiveButton
                          ? theme.palette.primary.main
                          : "transparent",
                        color: isActiveButton
                          ? "#ffffff"
                          : theme.palette.primary.main,
                        borderColor: isActiveButton
                          ? theme.palette.secondary.secondMain
                          : theme.palette.primary.main, // Active border or textfield border
                        // "&:hover": {
                        //   bgcolor: "#E9FBFD", // Generate button hover bgcolor
                        //   color: "#1fd5e9", // Generate button hover text color
                        //   borderColor: "#1fd5e9", // Generate button hover border color
                        //   boxShadow: "none",
                        // },
                        "& .MuiButton-startIcon": { marginRight: "2px" },
                        boxShadow: "none", // Ensure no shadow by default or on hover
                      }}
                      onClick={() => {
                        setActiveComponent(() => qrCodeButton.openingComponent);
                        setActiveComponentIndex(index);
                        setIsMenuOpen(false); // Close menu after selection on mobile
                      }}
                    >
                      {qrCodeButton.title}
                    </Button>
                  </Tooltip>
                );
              })}
            </Stack>
          </Stack>

          <Stack sx={{ pt: "6px" }}>
            <Stack sx={{ pt: "50px" }}>
              {ActiveComponent === null ? (
                <UrlScreen value={activeValue} setValue={setActiveValue} />
              ) : (
                <ActiveComponent
                  value={activeValue}
                  setValue={setActiveValue}
                />
              )}
            </Stack>
          </Stack>

          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              color: theme.palette.primary.fourthMain,
              bgcolor: theme.palette.primary.main,
              fontSize: "16px",
              fontWeight: "700",
              borderRadius: "50px",
              px: "40px",
              py: "12px",
              boxShadow: "none",
              my: "50px",
              "&:hover": {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.fourthMain,
                transition: "all .5s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "none",
              },
            }}
            onClick={handleGenerate}
          >
            Generate QR code
          </Button>
        </Grid>

        {/* RIGHT IMAGE BLOCK */}
        <Grid
          item
          size={{ md: 4, sm: 4, xs: 12, mob: 12 }}
          sx={{
            // border: "2px solid #787C7F",
            p: "20px",
            borderRadius: "6px",
          }}
        >
          {/* QR Preview Box with Frame */}
          <Box
            ref={frameRef} // Ref to capture for download
            sx={{
              width: "100%",
              // Dynamic height based on QR size and frame aspect ratio
              height: currentFrame.imagePath
                ? frameContainerHeight
                : `${
                    safeQrCodeDisplaySize +
                    (currentFrame.containerStyles?.padding
                      ? parseFloat(currentFrame.containerStyles.padding) * 2
                      : 0) +
                    (currentFrame.containerStyles?.border
                      ? parseFloat(currentFrame.containerStyles.border) * 2
                      : 0)
                  }px`,
              maxWidth: currentFrame.imagePath ? frameContainerWidth : "100%",
              ...currentFrame.containerStyles, // Apply selected frame's container styles
              // Ensure background is transparent if using an image frame for html2canvas
              backgroundColor: currentFrame.imagePath
                ? "transparent"
                : currentFrame.containerStyles?.backgroundColor || "#ffffff",
              position: "relative", // Ensure children can be absolutely positioned
              p: "30px",
            }}
          >
            {currentFrame.imagePath && (
              <Box
                component="img"
                src={currentFrame.imagePath}
                alt="QR Code Frame"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain", // Or 'fill' depending on frame design
                  zIndex: 1, // Keep frame image behind QR for overlay effect, or adjust if frame is truly a mask
                }}
              />
            )}
            <Box
              ref={qrCodeContainerRef} // This is where qr-code-styling appends the QR code
              sx={{
                width: currentFrame.qrRelativeSize
                  ? currentFrame.qrRelativeSize
                  : `${safeQrCodeDisplaySize}px`,
                height: currentFrame.qrRelativeSize
                  ? currentFrame.qrRelativeSize
                  : `${safeQrCodeDisplaySize}px`,
                position: currentFrame.imagePath ? "absolute" : "relative",
                top: currentFrame.qrRelativeTop || "auto",
                left: currentFrame.qrRelativeLeft || "auto",
                // Additional styling for the QR code canvas itself if needed
                zIndex: 2, // QR code on top of the frame image
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // Apply qrStyles for basic frames
                ...(currentFrame.qrStyles || {}),
              }}
            />
          </Box>

          {/* Moved QR Code Size input here */}
          {/* <Box
            sx={{
              mt: "10px",
              mb: "6px",
              p: "10px",
              bgcolor: "#f7f7f7",
              borderRadius: "6px",
            }}
          >
            <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
              QR Code Size (pixels)
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={qrCodeDisplaySize}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue === "") {
                  setQrCodeDisplaySize(""); // Allow empty string for user to clear
                } else if (/^\d+$/.test(inputValue)) {
                  setQrCodeDisplaySize(Number(inputValue));
                }
                // For invalid string (e.g., "abc"), do nothing, keep current valid state
              }}
              inputProps={{ min: 100, max: 200 }} // Sensible min/max values
              sx={{
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
                    borderColor: theme.palette.secondary.secondMain,
                  },
                  "&:hover fieldset": {
                    borderWidth: "2px",
                    borderColor: theme.palette.secondary.secondMain,
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: "2px",
                    borderColor: theme.palette.secondary.secondMain,
                  },
                },
              }}
            />
          </Box> */}

          {/* <FramePart
            selectedFrame={selectedFrame}
            setSelectedFrame={setSelectedFrame}
          /> */}
          <ShapeAndColor
            dotType={dotType}
            setDotType={setDotType}
            cornerSquareType={cornerSquareType}
            setCornerSquareType={setCornerSquareType}
            cornerDotType={cornerDotType}
            setCornerDotType={setCornerDotType}
            dotColor={dotColor}
            setDotColor={setDotColor}
          />
          <LogoPart qrLogo={qrLogo} setQrLogo={setQrLogo} />
          <Stack
            // direction={{
            //   lg: "row",
            //   md: "row",
            //   sm: "column",
            //   sm: "row",
            //   xs: "row",
            // }}
            direction="column"
            spacing={1}
            sx={{ pt: "20px" }}
          >
            {/* Download JPG/PNG Button */}
            {/* Download JPG Button */}
            <Button
              variant="contained"
              onClick={handleDownloadJpg}
              sx={{
                bgcolor: theme.palette.primary.main, // green
                color: "#fff",
                maxHeight: "max-content",
                textTransform: "none",
                boxShadow: "none",

                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "4px",
                px: "10px",
                borderRadius: "4px",
                flex: "1",
              }}
            >
              <DownloadIcon sx={{ fontSize: 24 }} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: "12px" }}>
                  DOWNLOAD
                </Typography>
                <Typography sx={{ fontSize: 10 }}>JPG</Typography>
              </Box>
            </Button>
            {/* Download PNG Button (New) */}
            <Button
              variant="contained"
              onClick={handleDownloadPng} // Use new PNG download handler
              sx={{
                bgcolor: theme.palette.primary.main, // green
                color: "#fff",
                maxHeight: "max-content",
                textTransform: "none",
                boxShadow: "none",

                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "4px",
                px: "10px",
                borderRadius: "4px",
                flex: "1",
              }}
            >
              <DownloadIcon sx={{ fontSize: 24 }} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: "12px" }}>
                  DOWNLOAD
                </Typography>
                <Typography sx={{ fontSize: 10 }}>PNG</Typography>
              </Box>
            </Button>
            {/* Download SVG/EPS Button */}
            <Button
              variant="contained"
              onClick={handleDownloadSvg}
              sx={{
                color: theme.palette.primary.main,
                bgcolor: "#fff",
                maxHeight: "max-content",
                border: "1px solid #09123a",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#ffffff",
                  boxShadow: "none",
                },
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "4px",
                px: "10px",
                borderRadius: "4px",
                flex: "1",
              }}
            >
              <DownloadIcon sx={{ fontSize: 24 }} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: "12px" }}>
                  PRINT QUALITY
                </Typography>
                <Typography sx={{ fontSize: 10 }}>SVG/EPS</Typography>
              </Box>
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* 🔹 History Section */}
      {/* <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          History
        </Typography>
        <Stack spacing={1}>
          {history.length === 0 ? (
            <Typography color="text.secondary">
              No QR codes generated yet.
            </Typography>
          ) : (
            history.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  p: 1,
                  bgcolor: "#fafafa",
                }}
              >
                {item}
              </Box>
            ))
          )}
        </Stack>
      </Box> */}

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position at top-center
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
          sx={{
            width: "120%",
            fontSize: "20px", // Increased font size for notification message
            alignItems: "center", // Ensures all items (icon, text, action) are vertically centered
            "& .MuiAlert-icon": {
              fontSize: "28px", // Larger size for the severity icon (tick, cross)
              mr: 1.5, // Adjust margin right for spacing
            },
            "& .MuiAlert-action": {
              alignSelf: "center", // Ensure the action button is centered
              "& .MuiSvgIcon-root": {
                fontSize: "22px", // Larger size for the close icon
              },
            },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

// FramePart Component (unchanged)
function FramePart({ selectedFrame, setSelectedFrame }) {
  const [openFrame, setOpenFrame] = useState(false);
  const frames = [
    "none",
    "default",
    "rounded",
    "dashed",
    "thick",
    "scanMeFrame",
  ]; // Available frame types

  return (
    <Box sx={{ pb: "6px" }}>
      <Button
        fullWidth
        variant="contained"
        sx={{
          bgcolor: "#f7f7f7",
          color: "#fff",
          fontWeight: 700,
          fontSize: "12px",
          textTransform: "uppercase",
          borderRadius: 0,
          justifyContent: "space-between",
          px: 2,
          py: "1px",
          "&:hover": {
            bgcolor: "#f7f7f7",
            boxShadow: "none",
          },
          boxShadow: "none",
          mt: "10px",
          borderTopLeftRadius: "6px",
          borderTopRightRadius: "6px",
        }}
        onClick={() => setOpenFrame((open) => !open)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "16px",
              color: openFrame ? "#616568" : "#a4a6a7",
            }}
          >
            FRAME
          </Typography>
        </Box>
        {openFrame ? (
          <KeyboardArrowUpIcon
            sx={{ color: openFrame ? "#616568" : "#a4a6a7" }}
          />
        ) : (
          <KeyboardArrowDownIcon
            sx={{ color: openFrame ? "#616568" : "#a4a6a7" }}
          />
        )}
      </Button>
      {openFrame && (
        <Box sx={{ p: "10px", bgcolor: "#f7f7f7" }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
            Select a Frame
          </Typography>
          <Stack direction="row" sx={{ gap: "8px", flexWrap: "wrap", mb: 2 }}>
            {frames.map((frameType, i) => {
              const isActive = selectedFrame === frameType;
              return (
                <Button
                  key={i}
                  sx={{
                    p: "8px",
                    borderWidth: "2px",
                    border: isActive
                      ? "2px solid #09123a"
                      : "1px solid #96b5c6",
                    minWidth: "auto",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      border: "1px solid #09123a",
                    },
                    cursor: "pointer",
                    color: "#000",
                    textTransform: "none",
                    fontSize: "12px",
                  }}
                  onClick={() => setSelectedFrame(frameType)}
                >
                  {frameType.charAt(0).toUpperCase() + frameType.slice(1)}
                </Button>
              );
            })}
          </Stack>
        </Box>
      )}
    </Box>
  );
}

// Updated ShapeAndColor Component
function ShapeAndColor({
  dotType,
  setDotType,
  cornerSquareType,
  setCornerSquareType,
  cornerDotType,
  setCornerDotType,
  dotColor,
  setDotColor,
}) {
  const [openShapeAndColor, setOpenShapeAndColor] = useState(false);
  const colorInputRef = useRef(null); // Ref for the hidden color input

  // Helper to get image path for dot types
  const getDotShapeImage = (type) => {
    return `/images/${type}.png`;
  };

  // Helper to get image path for corner types
  const getCornerShapeImage = (type) => {
    return `/images/${type}Corner.png`;
  };
  const getCornerInternalShapeImage = (type) => {
    return `/images/cornorInternal${type}.png`;
  };

  const dotTypes = [
    "square",
    "dots",
    "rounded",
    "extra-rounded",
    "classy",
    "classy-rounded",
  ];
  const cornerTypes = ["square", "dot", "extra-rounded"];

  return (
    <Box sx={{ pb: "6px" }}>
      <Button
        fullWidth
        variant="contained"
        sx={{
          bgcolor: "#f7f7f7",
          color: "#fff",
          fontWeight: 700,
          fontSize: "12px",
          textTransform: "uppercase",
          borderRadius: 0,
          justifyContent: "space-between",
          px: 2,
          py: "1px",
          "&:hover": {
            bgcolor: "#f7f7f7",
            boxShadow: "none",
          },
          boxShadow: "none",
          mt: "10px",
          borderTopLeftRadius: "6px",
          borderTopRightRadius: "6px",
        }}
        onClick={() => setOpenShapeAndColor((openShape) => !openShape)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "16px",
              color: openShapeAndColor ? "#616568" : "#a4a6a7",
            }}
          >
            SHAPE & COLOR
          </Typography>
        </Box>
        {openShapeAndColor ? (
          <KeyboardArrowUpIcon
            sx={{ color: openShapeAndColor ? "#616568" : "#a4a6a7" }}
          />
        ) : (
          <KeyboardArrowDownIcon
            sx={{ color: openShapeAndColor ? "#616568" : "#a4a6a7" }}
          />
        )}
      </Button>
      {openShapeAndColor && (
        <Box sx={{ p: "10px", bgcolor: "#f7f7f7" }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
            Dot Shape
          </Typography>
          <Stack direction="row" sx={{ gap: "8px", flexWrap: "wrap", mb: 2 }}>
            {dotTypes.map((type, i) => {
              const isActive = dotType === type;
              return (
                <Button
                  key={i}
                  sx={{
                    p: "4px",
                    border: isActive
                      ? "2px solid #09123a"
                      : "1px solid #96b5c6",
                    minWidth: "auto",
                    width: "42px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      border: "1px solid #09123a",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => setDotType(type)}
                >
                  <img
                    src={getDotShapeImage(type)}
                    alt={`${type} dot shape`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Button>
              );
            })}
          </Stack>

          <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
            Corner Square Shape
          </Typography>
          <Stack direction="row" sx={{ gap: "8px", flexWrap: "wrap", mb: 2 }}>
            {cornerTypes.map((type, i) => {
              const isActive = cornerSquareType === type;
              return (
                <Button
                  key={i}
                  sx={{
                    p: "4px",
                    border: isActive
                      ? "2px solid #09123a"
                      : "1px solid #96b5c6",
                    minWidth: "auto",
                    width: "42px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      border: "1px solid #09123a",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => setCornerSquareType(type)}
                >
                  <img
                    src={getCornerShapeImage(type)}
                    alt={`${type} corner square shape`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Button>
              );
            })}
          </Stack>

          <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
            Corner Dot Shape
          </Typography>
          <Stack direction="row" sx={{ gap: "8px", flexWrap: "wrap", mb: 2 }}>
            {cornerTypes.map((type, i) => {
              const isActive = cornerDotType === type;
              return (
                <Button
                  key={i}
                  sx={{
                    p: "4px",
                    border: isActive
                      ? "2px solid #09123a"
                      : "1px solid #96b5c6",
                    minWidth: "auto",
                    width: "42px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      border: "1px solid #09123a",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => setCornerDotType(type)}
                >
                  <img
                    src={getCornerInternalShapeImage(type)}
                    alt={`${type} corner dot shape`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Button>
              );
            })}
          </Stack>

          <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
            QR Code Color
          </Typography>
          <Button
            variant="outlined"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              py: "8px",
              px: "12px",
              borderRadius: "8px",
              borderColor: "#adf2fa", // Match TextField border color
              "&:hover": {
                borderColor: "#adf2fa", // Keep consistent hover
              },
              color: "#61698b", // Text color
              textTransform: "none",
              position: "relative", // Needed for absolute positioning of the input
              overflow: "hidden", // Hide parts of the input if it overflows
            }}
          >
            <Typography variant="body2">{dotColor}</Typography>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "4px",
                bgcolor: dotColor,
                border: "1px solid #ccc",
              }}
            />
            {/* Hidden input to trigger native color picker, positioned over the button */}
            <input
              type="color"
              ref={colorInputRef}
              value={dotColor}
              onChange={(e) => setDotColor(e.target.value)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0, // Make it completely transparent
                cursor: "pointer", // Indicate it's clickable
              }}
            />
          </Button>
        </Box>
      )}
    </Box>
  );
}

// LogoPart Component
function LogoPart({ qrLogo, setQrLogo }) {
  const [openLogo, setOpenLogo] = useState(false);
  const [customLogoFile, setCustomLogoFile] = useState(null);
  const fileInputRef = useRef(null);
  const sampleLogos = [
    "/images/socialPngs/google.png",
    "/images/socialPngs/facebook.png",
    "/images/socialPngs/instagram.png",
    "/images/socialPngs/watsapp.png",
    "/images/socialPngs/youtube.png",
    "/images/socialPngs/twitter.png",
    "/images/socialPngs/tiktok.png",
    "/images/socialPngs/snapchat.png",
    "/images/socialPngs/telegram.png",
  ];

  const handleCustomLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrLogo(reader.result); // Set qrLogo to base64 or object URL
        setCustomLogoFile(file); // Store the file for displaying its name
      };
      reader.readAsDataURL(file); // Read file as Data URL
    } else {
      setQrLogo("");
      setCustomLogoFile(null);
    }
  };

  return (
    <Box sx={{ pb: "6px" }}>
      <Button
        fullWidth
        variant="contained"
        sx={{
          bgcolor: "#f7f7f7",
          color: "#fff",
          fontWeight: 700,
          fontSize: "12px",
          textTransform: "uppercase",
          borderRadius: 0,
          justifyContent: "space-between",
          px: 2,
          py: "1px",
          "&:hover": {
            bgcolor: "#f7f7f7",
            boxShadow: "none",
          },
          boxShadow: "none",
          mt: "10px",
          borderTopLeftRadius: "6px",
          borderTopRightRadius: "6px",
        }}
        onClick={() => setOpenLogo((openLogo) => !openLogo)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "16px",
              color: openLogo ? "#616568" : "#a4a6a7",
            }}
          >
            Logo
          </Typography>
        </Box>
        {openLogo ? (
          <KeyboardArrowUpIcon
            sx={{ color: openLogo ? "#616568" : "#a4a6a7" }}
          />
        ) : (
          <KeyboardArrowDownIcon
            sx={{ color: openLogo ? "#616568" : "#a4a6a7" }}
          />
        )}
      </Button>
      {openLogo && (
        <Box sx={{ p: "10px", bgcolor: "#f7f7f7" }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
            Select a Logo
          </Typography>
          <Stack direction="row" sx={{ gap: "8px", flexWrap: "wrap", mb: 2 }}>
            {/* Clear Logo Button */}
            <Button
              sx={{
                p: "8px",
                border:
                  qrLogo === "" ? "2px solid #09123a" : "1px solid #96b5c6",
                minWidth: "auto",
                width: "42px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  border: "1px solid #96b5c6",
                },
                cursor: "pointer",
                color: "#000",
                textTransform: "none",
                fontSize: "12px",
              }}
              onClick={() => {
                setQrLogo("");
                setCustomLogoFile(null); // Clear custom file when clearing logo
              }}
            >
              <ClearIcon />
            </Button>
            {/* Sample Logos */}
            {sampleLogos.map((logoUrl, i) => {
              const isActive = qrLogo === logoUrl;
              return (
                <Button
                  key={i}
                  sx={{
                    p: "4px", // Adjusted padding for images
                    border: isActive
                      ? "2px solid #09123a"
                      : "1px solid #96b5c6",
                    minWidth: "auto",
                    width: "42px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      border: "1px solid #96b5c6",
                    },
                    cursor: "pointer",
                    color: "#000",
                    textTransform: "none",
                  }}
                  onClick={() => {
                    setQrLogo(logoUrl);
                    setCustomLogoFile(null); // Clear custom file when selecting sample
                  }}
                >
                  <img
                    src={logoUrl}
                    alt={`Logo ${i + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Button>
              );
            })}
          </Stack>
          {/* Custom Logo Upload */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
              Upload Your Logo (Optional)
            </Typography>
            <input
              type="file"
              accept="image/*"
              id="custom-logo-upload"
              ref={fileInputRef} // Attach the ref here
              style={{ display: "none" }}
              onChange={handleCustomLogoUpload}
            />
            <label htmlFor="custom-logo-upload">
              <Button
                component="span"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{
                  bgcolor: theme.palette.primary.main, // A distinct color for upload
                  color: theme.palette.secondary.secondMain,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: theme.palette.primary.main,
                    boxShadow: "none",
                  },
                  borderRadius: "8px",
                  px: "15px",
                  py: "8px",
                }}
              >
                Upload Logo
              </Button>
            </label>
            {customLogoFile && (
              <Typography
                variant="body2"
                sx={{ ml: 2, display: "inline-block" }}
              >
                {customLogoFile.name}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
