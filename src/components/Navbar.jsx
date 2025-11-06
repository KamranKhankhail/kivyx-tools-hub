// "use client";
// import {
//   AppBar as MuiAppBar,
//   Toolbar,
//   Typography,
//   Box,
//   Stack,
//   IconButton,
//   Drawer,
//   Button,
//   Container,
//   Collapse,
//   TextField,
//   InputAdornment,
// } from "@mui/material";
// import { useState, useEffect } from "react";
// import MenuIcon from "@mui/icons-material/Menu";
// import CloseIcon from "@mui/icons-material/Close";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import ToolsHubIcon from "../icons/ToolsHubsIcon";
// import NavbarButton from "./common/NavbarButton";
// import SearchIcon from "@/app/_components/icons/SearchIcon";
// const navItems = [
//   { title: "Home", href: "/" },
//   { title: "Tools", href: "/tools" },
//   { title: "What's New", href: "/whats-new" },
// ];

// const scrollSections = ["products", "team", "locations", "contact"];

// export default function Navbar() {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [activeSection, setActiveSection] = useState("home");
//   const [acitveButton, setActiveButton] = useState(0);
//   const pathname = usePathname();

//   const normalizedPath = pathname.replace(/\/$/, "");
//   const isSpecialPage =
//     normalizedPath === "/careers" || normalizedPath === "/blogs";

//   const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

//   // Detect scroll for homepage section highlighting
//   useEffect(() => {
//     if (pathname !== "/") return;

//     const handleScroll = () => {
//       const scrollPosition = window.scrollY + window.innerHeight / 3;
//       let currentSection = "home"; // default when near top

//       scrollSections.forEach((id) => {
//         const el = document.getElementById(id);
//         if (el) {
//           const rect = el.getBoundingClientRect();
//           const offsetTop = rect.top + window.scrollY;
//           const offsetBottom = offsetTop + el.offsetHeight;
//           if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
//             currentSection = id;
//           }
//         }
//       });

//       setActiveSection(currentSection);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [pathname]);

//   // Detect background change on scroll
//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 0);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <Box
//       sx={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         right: 0,
//         zIndex: 20000,
//         transition: "all 0.3s ease",
//         pt: isScrolled ? "28px" : "48px",
//         px: { lg: "30px", md: "20px", sm: "16px", xs: "10px", mob: "10px" },
//         bgcolor: "transparent",
//         // backdropFilter: isScrolled ? "blur(6px)" : "none",
//       }}
//     >
//       <Container maxWidth={false} disableGutters>
//         <MuiAppBar
//           position="static"
//           sx={{
//             // backgroundColor: isScrolled ? "#ffffffcc" : "#ffffff8d",
//             bgcolor: "transparent",
//             border: "3px solid #CCE6E6",
//             borderRadius: "100px",
//             py: { md: "0px", sm: "6px", xs: "6px", mob: "6px" },
//             transition: "all 0.3s ease",
//             backdropFilter: isScrolled ? "blur(10px)" : "none",
//             boxShadow: isScrolled
//               ? "0px 0px 70px 30px rgba(0, 0, 0, 0.07)"
//               : "none",
//           }}
//         >
//           <Toolbar
//             disableGutters
//             sx={{
//               px: "32px",
//               py: "10px",
//               justifyContent: "space-between",
//             }}
//           >
//             {/* <Typography
//               variant="body2"
//               component={Link}
//               href="/"
//               sx={{
//                 fontSize: "20px",
//                 fontWeight: "700",
//                 lineHeight: "25px",
//                 color: isSpecialPage
//                   ? isScrolled
//                     ? "#004d40"
//                     : "#ffffff"
//                   : "#004d40",
//                 cursor: "pointer",

//                 transition: "all 0.3s ease-in-out",
//                 "&:hover": { color: "#009688" },
//               }}
//             >
//               Islam Encyclo
//             </Typography> */}
//             <Box component={Link} href="/" sx={{ cursor: "pointer" }}>
//               <ToolsHubIcon />
//             </Box>

//             <TextField
//               variant="outlined" // Use outlined variant for the border
//               placeholder="Search..."
//               sx={{
//                 flex: "1",
//                 display: { mob: "none", xs: "none", sm: "none", md: "flex" },
//                 mx: "50px",
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "50px",
//                   px: "40px",
//                   background:
//                     "linear-gradient(180deg, rgba(128, 192, 192, 0.2) 0%, rgba(213, 234, 234, 0.136) 50%, rgba(37, 49, 100, 0.174118) 100%)",

//                   backgroundColor: "transparent",
//                   border: "none",
//                   "& fieldset": {
//                     // border: "3px solid transparent",
//                     // borderRadius: "50px",
//                     // borderImageSource:
//                     //   "linear-gradient(180deg, #80C0C0 0%, rgba(204, 230, 230, 0.93) 50%, #80C0C0 100%)",
//                     // borderImageSlice: 5,
//                     "&:hover": {
//                       borderImageSource:
//                         "linear-gradient(180deg, #80C0C0 0%, rgba(204, 230, 230, 0.93) 50%, #80C0C0 100%)",
//                     },
//                     "&.Mui-focused": {
//                       borderImageSource:
//                         "linear-gradient(180deg, #80C0C0 0%, rgba(204, 230, 230, 0.93) 50%, #80C0C0 100%)",
//                     },
//                   },
//                 },
//                 "& .MuiInputBase-input": {
//                   backgroundColor: "transparent",
//                   py: "20px",
//                   px: "10px",
//                   fontSize: "22px",
//                   color: "#2424249C", // Text color
//                 },
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon width="24px" height="24px" />{" "}
//                     {/* Grey search icon */}
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <Stack
//               direction="row"
//               sx={{
//                 alignItems: "center",
//                 gap: "30px",
//                 display: { mob: "none", xs: "none", md: "none", lg: "flex" },
//               }}
//             >
//               {navItems.map((item, i) => {
//                 const activeIndex = acitveButton === i;

//                 return (
//                   <Button
//                     key={i}
//                     component={Link}
//                     href={item.href}
//                     variant="text"
//                     sx={{
//                       color: activeIndex ? "#626677" : "#09123A",
//                       fontSize: "16px",
//                       fontWeight: 500,
//                       lineHeight: "30px",
//                       textTransform: "none",
//                       "&:hover": { color: "#626677" },
//                       py: "0px",
//                     }}
//                     onClick={() => setActiveButton(i)}
//                   >
//                     {item.title}
//                   </Button>
//                 );
//               })}
//               <NavbarButton />
//             </Stack>
//             {/* Mobile Menu Icon */}
//             <IconButton
//               sx={{
//                 display: { mob: "flex", xs: "flex", md: "flex", lg: "none" },
//                 color: "#09123A",
//               }}
//               onClick={handleDrawerToggle}
//             >
//               {mobileOpen ? <CloseIcon /> : <MenuIcon />}
//             </IconButton>
//           </Toolbar>
//         </MuiAppBar>

//         {/* Mobile Nav */}
//         <Collapse in={mobileOpen} timeout="auto" unmountOnExit>
//           <Box
//             sx={{
//               backgroundColor: "#ffffff",
//               mt: 1,
//               // padding: "20px",
//               display: { lg: "none" },
//             }}
//           >
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//               {navItems.map((item, i) => {
//                 const activeIndex = acitveButton === i;

//                 return (
//                   <Button
//                     key={i}
//                     component={item.title === "Contact Us" ? "button" : Link}
//                     href={item.title === "Contact Us" ? undefined : item.href}
//                     variant="text"
//                     onClick={
//                       item.title === "Contact Us"
//                         ? (e) => {
//                             e.preventDefault();
//                             document
//                               .getElementById("contact")
//                               ?.scrollIntoView({ behavior: "smooth" });
//                           }
//                         : handleDrawerToggle
//                     }
//                     sx={{
//                       color: activeIndex ? "#626677" : "#09123A",
//                       fontSize: "16px",
//                       fontWeight: 700,
//                       lineHeight: "30px",
//                       textTransform: "none",
//                       "&:hover": { color: "#626677" },
//                     }}
//                   >
//                     {item.title}
//                   </Button>
//                 );
//               })}
//             </Box>
//           </Box>
//         </Collapse>
//       </Container>
//     </Box>
//   );
// }

"use client";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Box,
  Stack,
  IconButton,
  Drawer,
  Button,
  Container,
  Collapse,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ToolsHubIcon from "../icons/ToolsHubsIcon";
import NavbarButton from "./common/NavbarButton";
import SearchIcon from "@/app/_components/icons/SearchIcon";

const navItems = [
  { title: "Home", href: "/" },
  { title: "Tools", href: "/tools" },
  { title: "What's New", href: "/whats-new" },
];

const scrollSections = ["products", "team", "locations", "contact"];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [acitveButton, setActiveButton] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const normalizedPath = pathname.replace(/\/$/, "");
  const isSpecialPage =
    normalizedPath === "/careers" || normalizedPath === "/blogs";

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    const currentPath = pathname;
    const currentSearchParams = new URLSearchParams(searchParams.toString());

    if (newSearchTerm) {
      currentSearchParams.set("search", newSearchTerm);
    } else {
      currentSearchParams.delete("search");
    }

    router.replace(`${currentPath}?${currentSearchParams.toString()}`);
    setMobileOpen(false); // Close mobile menu if open during search
  };

  // Detect scroll for homepage section highlighting
  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      let currentSection = "home"; // default when near top

      scrollSections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const offsetTop = rect.top + window.scrollY;
          const offsetBottom = offsetTop + el.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            currentSection = id;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Detect background change on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20000,
        transition: "all 0.3s ease",
        pt: isScrolled ? "2px" : "4px",
        px: { lg: "30px", md: "20px", sm: "16px", xs: "10px", mob: "10px" },
        bgcolor: "transparent",
        // backdropFilter: isScrolled ? "blur(6px)" : "none",
      }}
    >
      <Container maxWidth={false} disableGutters>
        <MuiAppBar
          position="static"
          sx={{
            // backgroundColor: isScrolled ? "#ffffffcc" : "#ffffff8d",
            bgcolor: "transparent",
            border: "3px solid #CCE6E6",
            borderRadius: "100px",
            py: { md: "0px", sm: "6px", xs: "6px", mob: "6px" },
            transition: "all 0.3s ease",
            backdropFilter: isScrolled ? "blur(10px)" : "none",
            boxShadow: isScrolled
              ? "0px 0px 70px 30px rgba(0, 0, 0, 0.07)"
              : "none",
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              px: "32px",
              py: "6px",
              justifyContent: "space-between",
            }}
          >
            {/* <Typography
              variant="body2"
              component={Link}
              href="/"
              sx={{
                fontSize: "20px",
                fontWeight: "700",
                lineHeight: "25px",
                color: isSpecialPage
                  ? isScrolled
                    ? "#004d40"
                    : "#ffffff"
                  : "#004d40",
                cursor: "pointer",

                transition: "all 0.3s ease-in-out",
                "&:hover": { color: "#009688" },
              }}
            >
              Islam Encyclo
            </Typography> */}
            <Box component={Link} href="/" sx={{ cursor: "pointer" }}>
              <ToolsHubIcon width="147" />
            </Box>

            <TextField
              variant="outlined" // Use outlined variant for the border
              placeholder="Search..."
              sx={{
                flex: "1",
                display: { mob: "none", xs: "none", sm: "none", md: "flex" },
                mx: "50px",
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
                  py: "14px",
                  px: "10px",
                  fontSize: "18px",
                  color: "#2424249C", // Text color
                },
              }}
              value={searchTerm}
              onChange={handleSearchChange}
            />

            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                gap: "30px",
                display: { mob: "none", xs: "none", md: "none", lg: "flex" },
              }}
            >
              {navItems.map((item, i) => {
                const activeIndex = acitveButton === i;

                return (
                  <Button
                    key={i}
                    component={Link}
                    href={item.href}
                    variant="text"
                    sx={{
                      color: activeIndex ? "#626677" : "#09123A",
                      fontSize: "16px",
                      fontWeight: 500,
                      lineHeight: "30px",
                      textTransform: "none",
                      "&:hover": { color: "#626677" },
                      py: "0px",
                    }}
                    onClick={() => setActiveButton(i)}
                  >
                    {item.title}
                  </Button>
                );
              })}
              <NavbarButton />
            </Stack>
            {/* Mobile Menu Icon */}
            <IconButton
              sx={{
                display: { mob: "flex", xs: "flex", md: "flex", lg: "none" },
                color: "#09123A",
              }}
              onClick={handleDrawerToggle}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Toolbar>
        </MuiAppBar>

        {/* Mobile Nav */}
        <Collapse in={mobileOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              backgroundColor: "#ffffff",
              mt: 1,
              // padding: "20px",
              display: { lg: "none" },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {navItems.map((item, i) => {
                const activeIndex = acitveButton === i;

                return (
                  <Button
                    key={i}
                    component={item.title === "Contact Us" ? "button" : Link}
                    href={item.title === "Contact Us" ? undefined : item.href}
                    variant="text"
                    onClick={
                      item.title === "Contact Us"
                        ? (e) => {
                            e.preventDefault();
                            document
                              .getElementById("contact")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }
                        : handleDrawerToggle
                    }
                    sx={{
                      color: activeIndex ? "#626677" : "#09123A",
                      fontSize: "16px",
                      fontWeight: 700,
                      lineHeight: "30px",
                      textTransform: "none",
                      "&:hover": { color: "#626677" },
                    }}
                  >
                    {item.title}
                  </Button>
                );
              })}
            </Box>
          </Box>
        </Collapse>
      </Container>
    </Box>
  );
}
