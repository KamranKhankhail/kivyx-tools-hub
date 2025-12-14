import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import React from "react";

import YoutubeFooterIcon from "@/icons/YoutubeFooterIcon";
import TiktokIcon from "@/icons/TiktokIcon";
import FacebookFooterIcon from "@/icons/FacebookFooterIcon";
import InstagramFooterIcon from "@/icons/InstagramFooterIcon";
import FooterMailIcon from "@/icons/FooterMailIcon";
import FooterPhoneIcon from "@/icons/FooterPhoneIcon";

import Link from "next/link";
import ToolsHubsIcon from "@/icons/ToolsHubsIcon";
import theme from "@/styles/theme";
const teamSocialIcons = [
  {
    icon: YoutubeFooterIcon,
    href: "http://www.youtube.com/@IslamEncyclo",
  },

  {
    icon: FacebookFooterIcon,
    href: "https://www.facebook.com/share/1GvYWNTVsC/",
  },
  {
    icon: InstagramFooterIcon,
    href: "https://www.instagram.com/islamencycloofficial?igsh=c2oxMzN5YXd2Z3hh",
  },
  { icon: TiktokIcon, href: "#" },
  // { icon: SnapchatFooterIcon, href: "#" },
];
const companyLinksData = [
  {
    title: "",
    linksTitle: [
      { title: "Home", href: "/" },
      { title: "tools", href: "/tools" },
      // { title: "What's New ", href: "/whats-new" },
    ],
  },

  {
    // minWidthExist: true,
    title: "",
    linksTitle: [
      {
        title: "Nature Color Palette",
        href: "/tools/nature-color-palette",
      },
      // {
      //   title: "Disclaimer",
      //   href: "/disclaimer",
      // },
    ],
  },
  {
    title: "Contact Us",
    linksTitle: [
      { icon: FooterMailIcon, title: "support@kivyx.com" },
      { icon: FooterPhoneIcon, title: "+92-300-3932-002" },
    ],
  },
];

export default function Footer() {
  return (
    <Stack
      sx={{
        // background:
        //   "radial-gradient(278.82% 508.63% at -133.28% -141.92%, rgba(204, 230, 230, 0.93) 18.95%, #80C0C0 48.4%, #09123a 82.88%)",
        px: { lg: "80px", md: "70px", sm: "70px", xs: "60px", mob: "40px" },
        pt: "80px",
        pb: "40px",
        bgcolor: "#09123a",
      }}
    >
      <Box
        sx={{
          alignSelf: {
            lg: "start",
            md: "start",
            sm: "start",
            xs: "start",
            mob: "center",
          },
        }}
      >
        {" "}
        <ToolsHubsIcon
          toolsColor="#8fafc1"
          fourDotsColor="#09123A"
          hubBgColor="#8fafc1"
          width="100px"
          height="100px"
          hubColor="#09123A"
          hubOpacity="1"
        />
      </Box>

      <Grid
        container
        py="10px"
        spacing={{ lg: 10, md: 6, sm: 5, xs: 5, mob: 7 }}
        sx={{ pt: "50px" }}
      >
        <Grid
          item
          size={{ lg: 5, md: 5, sm: 12, xs: 12, mob: 12 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: {
              lg: "start",
              md: "start",
              sm: "start",
              xs: "start",
              mob: "center",
            },
          }}
        >
          <Typography
            variant="body2"
            component="button"
            sx={{
              fontSize: "26px",
              fontWeight: "500",
              lineHeight: "130%",
              color: theme.palette.primary.fourthMain,
              cursor: "pointer",
              pb: "16px",
              textAlign: {
                lg: "start",
                md: "start",
                sm: "start",
                xs: "start",
                mob: "center",
              },
            }}
          >
            About Toolshub
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "18px",
              fontWeight: "300",
              lineHeight: "130%",
              color: theme.palette.primary.fourthMain,
              textAlign: {
                lg: "start",
                md: "start",
                sm: "start",
                xs: "start",
                mob: "center",
              },
            }}
          >
            Our mission is to empower creators, professionals, and learners
            worldwide with accessible tools that enhance productivity and
            creativity.
          </Typography>
          {/* <Box sx={{ pt: "20px" }}>
            {" "}
            <Typography
              variant="body2"
              // component="button"
              sx={{
                fontSize: "26px",
                fontWeight: "500",
                lineHeight: "130%",
                color: theme.palette.primary.fourthMain,
                cursor: "pointer",
                pb: "10px",
                textAlign: {
                  lg: "start",
                  md: "start",
                  sm: "start",
                  xs: "start",
                  mob: "center",
                },
              }}
            >
              Follow us
            </Typography>
            <Stack
              direction="row"
              spacing={{ lg: 3, md: 3, sm: 3, xs: 3, mob: 2 }}
              sx={{
                justifyContent: {
                  lg: "start",
                  md: "start",
                  sm: "start",
                  xs: "start",
                  mob: "center",
                },
                pt: {
                  mob: "10px",
                  xs: "10px",
                  sm: "10px",
                  md: "10px",
                  lg: "10px",
                },
                flexWrap: "wrap",
                alignItems: "center",
                rowGap: "10px",
              }}
            >
              {teamSocialIcons.map((social, i) => (
                <Box
                  key={i}
                  component={Link}
                  href={social.href}
                  sx={{
                    p: "0px",

                    borderRadius: "50px",
                    cursor: "pointer",

                    bgcolor: "#8fafc1",
                    transition: "color 0.3s, border 0.3s, transform 0.3s",
                    "&:hover": {
                      transform: "translateY(-3px)", // slight upward slide
                    },
                  }}
                >
                  <social.icon
                    color={theme.palette.primary.main}
                    width={22}
                    height={22}
                  />
                </Box>
              ))}
            </Stack>
          </Box> */}
        </Grid>
        <Grid
          item
          size={{ lg: 6.5, md: 7, sm: 12, xs: 12, mob: 12 }}
          px={{
            lg: "0px",
            md: "0px",
            sm: "20px",
            xs: "0px",
            mob: "0px",
          }}
        >
          <Stack
            direction="row"
            // spacing={10}
            sx={{
              justifyContent: {
                lg: "space-between",
                md: "space-between",
                sm: "space-between",
                xs: "space-between",
                mob: "space-evenly",
              },
              pb: "45px",
              flexWrap: "wrap",
              rowGap: "40px",
              columnGap: {
                lg: "0px",
                md: "0px",
                sm: "0px",
                xs: "0px",
                mob: "45px",
              },
              // alignItems: {
              //   lg: "start",
              //   md: "start",
              //   sm: "start",
              //   xs: "start",
              //   mob: "center",
              // },
            }}
          >
            {companyLinksData.map((linkService, i) => {
              return (
                <Stack key={i} direction="column" spacing={3}>
                  {linkService.title.length !== 0 && (
                    <Typography
                      variant="body2"
                      // component="button"
                      sx={{
                        fontSize: "24px",
                        fontWeight: "500",
                        lineHeight: "130%",
                        color: theme.palette.primary.fourthMain,

                        textAlign: {
                          lg: "start",
                          md: "start",
                          sm: "start",
                          xs: "start",
                          mob: "center",
                        },
                        // "&:hover": {
                        //   color: "#0056b3",
                        // },
                      }}
                    >
                      {linkService.title}
                    </Typography>
                  )}

                  {linkService.linksTitle.map((linkTitle, i) =>
                    linkTitle?.href ? (
                      <Typography
                        key={i}
                        variant="body2"
                        component={Link}
                        href={linkTitle.href}
                        sx={{
                          fontSize: "20px",
                          fontWeight: "500",
                          lineHeight: "130%",
                          color: theme.palette.primary.fourthMain,
                          cursor: "pointer",
                          textAlign: {
                            lg: "start",
                            md: "start",
                            sm: "start",
                            xs: "start",
                            mob: "center",
                          },
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            color: "#008081",
                          },
                        }}
                      >
                        {linkTitle.title}
                      </Typography>
                    ) : (
                      <Stack
                        direction="row"
                        key={i}
                        spacing={2}
                        sx={{ alignItems: "center" }}
                      >
                        <linkTitle.icon />
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "18px",
                            fontWeight: "300",
                            lineHeight: "130%",
                            color: theme.palette.primary.fourthMain,
                          }}
                        >
                          {linkTitle.title}
                        </Typography>
                      </Stack>
                    )
                  )}
                </Stack>
              );
            })}
          </Stack>
        </Grid>
      </Grid>
      <Divider
        orientation="horizontal"
        sx={{
          height: "1.5px",
          bgcolor: "#8fafc1",
          my: "40px",
          border: "none",
        }}
      ></Divider>
      <Stack
        id="Copyright @"
        direction={{
          lg: "row",
          md: "row",
          sm: "row",
          xs: "row",
          mob: "column",
        }}
        justifyContent="space-between"
        px={{
          lg: "0px",
          md: "0px",
          sm: "10px",
          xs: "0px",
        }}
        gap={{ lg: "50px", md: "50px", sm: "50px", xs: "50px", mob: "20px" }}
        alignItems={{ lg: "space-between", mob: "center" }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: "18px",
            fontWeight: "300",
            lineHeight: "130%",
            color: theme.palette.primary.fourthMain,
            textAlign: {
              lg: "start",
              md: "start",
              sm: "start",
              xs: "start",
              mob: "center",
            },
          }}
        >
          2025 Kivyx Technologies. All rights reserved
        </Typography>
        <Typography
          variant="body2"
          component={Link}
          href="/privacy-policy"
          sx={{
            fontSize: "18px",
            fontWeight: "300",
            lineHeight: "130%",
            color: theme.palette.primary.fourthMain,
            cursor: "pointer",
            textAlign: "start",
            "&:hover": {
              color: "#8fafc1",
            },
          }}
        >
          Privacy and Policy
        </Typography>
      </Stack>
    </Stack>
  );
}
