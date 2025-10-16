import { InputAdornment, Stack, TextField, Typography } from "@mui/material";
import SectionMainHeading from "../../components/common/SectionMainHeading";
import SearchIcon from "../_components/icons/SearchIcon";
import theme from "../../styles/theme";
export default function HeaderSection() {
  return (
    <Stack
      direction="column"
      sx={{
        justifyContent: "center",
        alignItems: "center",
        pt: "60px",
        px: "100px",
      }}
    >
      <SectionMainHeading>Frequently Asked Questions</SectionMainHeading>
      <Typography
        component="p"
        variant="body2"
        sx={{
          fontSize: {
            xl: "28px",
            lg: "26px",
            md: "24px",
            sm: "22px",
            xs: "20px",
            mob: "18px",
          },
          fontWeight: "300",
          lineHeight: {
            lg: "130%",
            md: "120%",
            sm: "110%",
            xs: "100%",
            mob: "100%",
          },
          color: theme.palette.primary.secondMain,
          textAlign: "center",
          zIndex: "5",
          pb: "40px",
          pt: "24px",
        }}
      >
        Islam Encyclo brings you a complete learning experience from
        understanding the Quran and Sunnah to step-by-step Wudu guides,
        authentic Duas, and practical guidance for Umrah and Hajj and everything
        you need to grow in faith, all in one place.
      </Typography>

      <TextField
        variant="outlined" // Use outlined variant for the border
        placeholder="Search..."
        sx={{
          mx: {
            lg: "300px",
            md: "200px",
            sm: "50px",
            xs: "40px",
            mob: "16px",
          },
          mb: "80px",
          mt: "60px",
          minWidth: "60%",

          "& .MuiOutlinedInput-root": {
            borderRadius: "50px",
            px: "40px",
            background:
              "linear-gradient(180deg, rgba(128, 192, 192, 0.2) 0%, rgba(213, 234, 234, 0.136) 50%, rgba(37, 49, 100, 0.174118) 100%)",

            backgroundColor: "transparent",
            border: "none",
            "& fieldset": {
              // border: "3px solid transparent",
              // borderRadius: "50px",
              // borderImageSource:
              //   "linear-gradient(180deg, #80C0C0 0%, rgba(204, 230, 230, 0.93) 50%, #80C0C0 100%)",
              // borderImageSlice: 5,
              "&:hover": {
                borderImageSource:
                  "linear-gradient(180deg, #80C0C0 0%, rgba(204, 230, 230, 0.93) 50%, #80C0C0 100%)",
              },
              "&.Mui-focused": {
                borderImageSource:
                  "linear-gradient(180deg, #80C0C0 0%, rgba(204, 230, 230, 0.93) 50%, #80C0C0 100%)",
              },
            },
          },
          "& .MuiInputBase-input": {
            backgroundColor: "transparent",
            py: "20px",
            px: "10px",
            fontSize: "28px",
            color: "#2424249C", // Text color
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon /> {/* Grey search icon */}
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
