// import { InputAdornment, Stack, TextField, Typography } from "@mui/material";
// import SectionMainHeading from "../../components/common/SectionMainHeading";
// import SearchIcon from "../_components/icons/SearchIcon";
// import theme from "../../styles/theme";
// export default function HeaderSection() {
//   return (
//     <Stack
//       direction="column"
//       sx={{
//         justifyContent: "center",
//         alignItems: "center",
//         pt: "60px",
//         px: "100px",
//       }}
//     >
//       <TextField
//         variant="outlined" // Use outlined variant for the border
//         placeholder="Search..."
//         fullWidth
//         sx={{
//           mb: "80px",
//           mt: "60px",
//           minWidth: "60%",
//           display: {
//             lg: "none",
//             md: "none",
//             sm: "flex",
//             xs: "flex",
//             mob: "flex",
//           },
//           "& .MuiOutlinedInput-root": {
//             borderRadius: "50px",
//             px: "40px",
//             background:
//               "linear-gradient(180deg, rgba(128, 192, 192, 0.2) 0%, rgba(213, 234, 234, 0.136) 50%, rgba(37, 49, 100, 0.174118) 100%)",

//             backgroundColor: "transparent",
//             border: "none",
//             "& fieldset": {
//               // border: "3px solid transparent",
//               // borderRadius: "50px",
//               // borderImageSource:
//               //   "linear-gradient(180deg, #80C0C0 0%, rgba(204, 230, 230, 0.93) 50%, #80C0C0 100%)",
//               // borderImageSlice: 5,
//               "&:hover": {
//                 borderImageSource:
//                   "linear-gradient(180deg, #80C0C0 0%, rgba(204, 230, 230, 0.93) 50%, #80C0C0 100%)",
//               },
//               "&.Mui-focused": {
//                 borderImageSource:
//                   "linear-gradient(180deg, #80C0C0 0%, rgba(204, 230, 230, 0.93) 50%, #80C0C0 100%)",
//               },
//             },
//           },
//           "& .MuiInputBase-input": {
//             backgroundColor: "transparent",
//             py: "20px",
//             px: "10px",
//             fontSize: "28px",
//             color: "#2424249C", // Text color
//           },
//         }}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <SearchIcon /> {/* Grey search icon */}
//             </InputAdornment>
//           ),
//         }}
//       />
//     </Stack>
//   );
// }

"use client"; // Add "use client" directive
import { InputAdornment, Stack, TextField, Typography } from "@mui/material";
import SectionMainHeading from "../../components/common/SectionMainHeading";
import SearchIcon from "../_components/icons/SearchIcon";
import theme from "../../styles/theme";

export default function HeaderSection({ searchTerm, onSearchChange }) {
  return (
    <Stack
      direction="column"
      sx={{
        justifyContent: "center",
        alignItems: "center",
        // pt: { lg: "60px", md: "60px", sm: "0px", xs: "0px", mob: "0px" },
        px: { lg: "100px", md: "100px", sm: "30px", xs: "30px", mob: "30px" },
      }}
    >
      <TextField
        variant="outlined" // Use outlined variant for the border
        placeholder="Search..."
        fullWidth
        sx={{
          mb: "20px",
          mt: "10px",
          minWidth: {
            lg: "60%",
            md: "60%",
            sm: "100%",
            xs: "100%",
            mob: "100%",
          },
          display: {
            lg: "none",
            md: "none",
            sm: "flex",
            xs: "flex",
            mob: "flex",
          },
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
        value={searchTerm}
        onChange={onSearchChange}
      />
    </Stack>
  );
}
