import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  breakpoints: {
    values: {
      mob: 0,
      xs: 640,
      sm: 768,
      md: 1000,
      lg: 1250,
      xl: 1536,
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
      fourthMain: "#ffffff",
    },
    secondary: {
      main: "#e9fbfd",
      secondMain: "#96b5c6",
      thirdMain: "#61698b",
    },
    ui: {
      delete: "#FF386A",
      pageBackground:
        "radial-gradient(425.23% 208% at -81.08% -22.7%, rgba(255, 255, 255, 0.870588) 0%, rgba(175, 236, 255, 0.785294) 65.51%, rgba(204, 230, 230, 0.93) 100%)",
      cardBackground:
        "linear-gradient(180deg, rgba(175, 236, 255, 0.157059) 0%, rgba(204, 230, 230, 0.186) 50%, rgba(128, 192, 192, 0.2) 100%)",
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
