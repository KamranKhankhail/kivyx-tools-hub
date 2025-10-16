import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  breakpoints: {
    values: {
      mob: 0, // custom
      xs: 640,
      sm: 768,
      md: 1000,
      lg: 1250,
      xl: 1536, // you can keep xl as default or set your own
    },
  },
  palette: {
    background: {
      default:
        "radial-gradient(235.53% 235.53% at 4.6% 4.14%, #FFFFFF 0%, #CCE6E6 33.29 #AAD5D5 59.74%, #80C0C0 85.16%)",
    },
    primary: {
      main: "#09123A",
      secondMain: "#000000",
      thirdMain: "#DDFDFDED",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: [
      "Jaro",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

export default theme;
