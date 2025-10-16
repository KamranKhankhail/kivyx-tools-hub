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
} from "@mui/material";
import { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ToolsHubIcon from "./icons/ToolsHubsIcon";
import NavbarButton from "./common/NavbarButton";

const navItems = [
  { title: "Home", href: "/" },
  { title: "Tools", href: "/tools" },
  { title: "What's New", href: "/features" },
];

const scrollSections = ["products", "team", "locations", "contact"];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [acitveButton, setActiveButton] = useState(0);
  const pathname = usePathname();

  const normalizedPath = pathname.replace(/\/$/, "");
  const isSpecialPage =
    normalizedPath === "/careers" || normalizedPath === "/blogs";

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

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
        pt: isScrolled ? "28px" : "48px",
        px: { lg: "90px", md: "20px", sm: "16px", xs: "10px", mob: "10px" },
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
              py: "10px",
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
            <ToolsHubIcon />
            {/* Desktop Nav */}
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
