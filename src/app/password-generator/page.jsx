"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Slider,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  InputAdornment,
  IconButton,
  Tooltip,
  Switch,
  useTheme,
  useMediaQuery,
  Fade,
  Stack,
} from "@mui/material";
import {
  ContentCopy,
  Refresh,
  Security,
  CheckCircle,
} from "@mui/icons-material";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  const [easyToSay, setEasyToSay] = useState(false);
  const [easyToRead, setEasyToRead] = useState(false);
  const [allCharacters, setAllCharacters] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Character sets
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const similarChars = "il1Lo0O";
  const ambiguousChars = "{}[]()/\\'\"`~,;:.<>";

  // Handle checkbox changes to ensure mutual exclusivity
  useEffect(() => {
    if (easyToSay) {
      setIncludeNumbers(false);
      setIncludeSymbols(false);
      setExcludeSimilar(true);
      setEasyToRead(false);
      setAllCharacters(false);
    }
  }, [easyToSay]);

  useEffect(() => {
    if (easyToRead) {
      setExcludeSimilar(true);
      setEasyToSay(false);
      setAllCharacters(false);
    }
  }, [easyToRead]);

  useEffect(() => {
    if (allCharacters) {
      setIncludeUppercase(true);
      setIncludeLowercase(true);
      setIncludeNumbers(true);
      setIncludeSymbols(true);
      setExcludeSimilar(false);
      setEasyToSay(false);
      setEasyToRead(false);
    }
  }, [allCharacters]);

  // Generate password function
  const generatePassword = () => {
    let charset = "";
    if (includeLowercase) charset += lowercaseChars;
    if (includeUppercase) charset += uppercaseChars;
    if (includeNumbers) charset += numberChars;
    if (includeSymbols) charset += symbolChars;

    if (!charset) {
      setPassword("Select at least one option");
      return;
    }

    // Apply easy-to-read filter if enabled
    if (easyToRead) {
      charset = charset.replace(new RegExp(`[${similarChars}]`, "g"), "");
    }

    let generatedPassword = "";
    const charsetLength = charset.length;

    // Create array with crypto-safe random values
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      // Use crypto-safe random index
      const randomIndex = randomValues[i] % charsetLength;
      let char = charset[randomIndex];

      // Exclude similar characters if enabled (and not already filtered by easyToRead)
      if (excludeSimilar && !easyToRead) {
        let attempts = 0;
        while (similarChars.includes(char) && attempts < 10) {
          const newIndex = Math.floor(Math.random() * charsetLength);
          char = charset[newIndex];
          attempts++;
        }
      }

      generatedPassword += char;
    }

    setPassword(generatedPassword);
  };

  // Copy to clipboard with notification
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  // Calculate password strength
  const calculateStrength = () => {
    if (!password || password === "Select at least one option") return 0;

    let strength = 0;
    // Length factor
    strength += Math.min(password.length / 4, 5);

    // Character variety factor
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const varietyCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(
      Boolean
    ).length;
    strength += (varietyCount - 1) * 2;

    return Math.min(Math.floor(strength), 10);
  };

  // Strength indicators
  const strength = calculateStrength();
  const strengthLabels = [
    "Very Weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
    "Very Strong",
  ];
  const strengthColors = [
    "#f44336",
    "#ff5722",
    "#ff9800",
    "#ffc107",
    "#4caf50",
    "#2e7d32",
  ];
  const strengthLevel = strengthLabels[Math.floor(strength / 2)] || "Very Weak";
  const strengthColor = strengthColors[Math.floor(strength / 2)] || "#f44336";

  // Generate password on initial load and when settings change
  useEffect(() => {
    generatePassword();
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeSimilar,
    easyToSay,
    easyToRead,
    allCharacters,
  ]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",

        position: "relative",
      }}
    >
      {/* Notification */}
      <Fade in={showNotification}>
        <Box
          sx={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            backgroundColor: "#4caf50",
            color: "white",
            px: 2,
            py: 1,
            borderRadius: 1,
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.013)",
          }}
        >
          <CheckCircle sx={{ mr: 1 }} />
          <Typography variant="body2">Password copied to clipboard!</Typography>
        </Box>
      </Fade>

      <Paper
        elevation={24}
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: "0px 10px 50px 0px #00000040",
          width: "80%",
          display: "flex",
          flexDirection: "column",
          my: "50px",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Security sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            Secure Password Generator
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create strong and secure passwords instantly
          </Typography>
        </Box>

        {/* Password Output */}
        <TextField
          fullWidth
          value={password}
          variant="outlined"
          InputProps={{
            readOnly: true,
            sx: { fontSize: "1.1rem", fontWeight: "medium", py: 1 },
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Copy password">
                  <IconButton
                    onClick={copyToClipboard}
                    edge="end"
                    color="primary"
                  >
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Generate new password">
                  <IconButton
                    onClick={generatePassword}
                    edge="end"
                    color="primary"
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Stack direction="row" spacing={4}>
          <Box sx={{ pr: isSmallScreen ? 0 : 1, flex: 1 }}>
            {/* Password Length */}
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom variant="body2" fontWeight="medium">
                Password Length: {length}
              </Typography>
              <Slider
                value={length}
                onChange={(e, newValue) => setLength(newValue)}
                min={6}
                max={32}
                valueLabelDisplay="auto"
                sx={{ color: "primary.main" }}
              />
            </Box>

            {/* Character Options */}
            <Typography variant="body2" gutterBottom fontWeight="medium">
              Character Types:
            </Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeUppercase}
                      onChange={(e) => setIncludeUppercase(e.target.checked)}
                      color="primary"
                      disabled={easyToSay}
                    />
                  }
                  label="Uppercase"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeLowercase}
                      onChange={(e) => setIncludeLowercase(e.target.checked)}
                      color="primary"
                      disabled={easyToSay}
                    />
                  }
                  label="Lowercase"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      color="primary"
                      disabled={easyToSay}
                    />
                  }
                  label="Numbers"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeSymbols}
                      onChange={(e) => setIncludeSymbols(e.target.checked)}
                      color="primary"
                      disabled={easyToSay}
                    />
                  }
                  label="Symbols"
                />
              </Grid>
            </Grid>

            {/* Advanced Options */}
            <FormControlLabel
              control={
                <Switch
                  checked={excludeSimilar}
                  onChange={(e) => setExcludeSimilar(e.target.checked)}
                  color="primary"
                  disabled={easyToRead || allCharacters}
                />
              }
              label="Exclude Similar Characters"
              sx={{ mb: 1 }}
            />

            {/* New Checkboxes */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={easyToSay}
                  onChange={(e) => setEasyToSay(e.target.checked)}
                  color="primary"
                />
              }
              label="Easy to Say (avoid numbers and symbols)"
              sx={{ mb: 1, display: "block" }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={easyToRead}
                  onChange={(e) => setEasyToRead(e.target.checked)}
                  color="primary"
                />
              }
              label="Easy to Read (avoid ambiguous characters)"
              sx={{ mb: 1, display: "block" }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={allCharacters}
                  onChange={(e) => setAllCharacters(e.target.checked)}
                  color="primary"
                />
              }
              label="All Characters (include everything)"
              sx={{ mb: 2, display: "block" }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              pl: isSmallScreen ? 0 : 1,
            }}
          >
            {/* Password Strength Indicator */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom fontWeight="medium">
                Password Strength:
              </Typography>
              <Box
                sx={{
                  height: 10,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 5,
                  overflow: "hidden",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${strength * 10}%`,
                    backgroundColor: strengthColor,
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                fontWeight="bold"
                color={strengthColor}
              >
                {strengthLevel} ({strength}/10)
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Button
                variant="contained"
                onClick={generatePassword}
                startIcon={<Refresh />}
                fullWidth
                size="small"
                color="primary"
              >
                Generate
              </Button>
              <Button
                variant="outlined"
                onClick={copyToClipboard}
                startIcon={<ContentCopy />}
                fullWidth
                size="small"
                color="primary"
              >
                Copy
              </Button>
            </Box>

            {/* Security Tips */}
            <Box
              sx={{
                p: 1.5,
                bgcolor: "grey.50",
                borderRadius: 2,
                flexGrow: 1,
                overflow: "auto",
              }}
            >
              <Typography variant="body2" gutterBottom fontWeight="medium">
                <Security
                  sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                />
                Password Tips:
              </Typography>
              <Box
                component="ul"
                sx={{
                  pl: 2,
                  m: 0,
                  "& li": {
                    mb: 0.5,
                    fontSize: "0.75rem",
                    lineHeight: 1.3,
                  },
                }}
              >
                <Typography component="li">
                  Use at least 12 characters
                </Typography>
                <Typography component="li">
                  Include different character types
                </Typography>
                <Typography component="li">Avoid dictionary words</Typography>
                <Typography component="li">
                  Use unique passwords for each account
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default PasswordGenerator;
