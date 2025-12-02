"use client";
import { Box, Collapse, IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import SectionMainHeading from "../../components/common/SectionMainHeading";
import SectionMainPara from "../../components/common/SectionMainPara";
import theme from "../../styles/theme";
import FaqQuestionMarkIcon from "../_components/icons/FaqQuestionMarkIcon";
import FaqDownIcon from "../_components/icons/FaqDownIcon";
import FaqLeftIcon from "../_components/icons/FaqLeftArrow";
const FAQsCards = [
  {
    q: "What is ToolsHub?",
    a: "ToolsHub is an online platform that offers many helpful tools in one place, such as converters, generators, editors, and utilities.",
  },
  {
    q: "Are all the tools free to use?",
    a: "Yes, all tools on ToolsHub are completely free and can be used without any charges.",
  },
  {
    q: "Do I need to create an account to use the tools?",
    a: "No, you can use every tool without creating an account. Extra features may be added in the future for logged-in users.",
  },
  {
    q: "What types of tools does ToolsHub offer?",
    a: "ToolsHub includes PDF tools, image tools, text utilities, converters, generators, minifiers, beautifiers, and many more.",
  },
  {
    q: "Is ToolsHub safe to use?",
    a: "Yes, ToolsHub does not collect personal data, and most tools work directly in your browser for better privacy.",
  },
  {
    q: "Will more tools be added in the future?",
    a: "Yes, new tools are added regularly based on user needs and feedback.",
  },
  {
    q: "Can I suggest a new tool?",
    a: "Yes, you can send your suggestions through the contact form or feedback page.",
  },
  {
    q: "Is ToolsHub mobile-friendly?",
    a: "Yes, ToolsHub works smoothly on both mobile and desktop devices.",
  },
  {
    q: "Do you store any uploaded files?",
    a: "No, ToolsHub does not store your uploaded files. They are processed locally or deleted immediately after use.",
  },
  {
    q: "Do ToolsHub tools reduce file quality?",
    a: "No, the tools are designed to maintain the highest possible quality unless you choose to compress or reduce size.",
  },
  {
    q: "Can I use ToolsHub tools offline?",
    a: "Some tools may work offline after loading once, but most require an internet connection.",
  },
  {
    q: "Are there limits on file size or usage?",
    a: "Most tools have no strict limits, but some features may have size restrictions depending on browser capability.",
  },
  {
    q: "Do I need to install anything to use the tools?",
    a: "No installation is required. All tools run directly in your browser.",
  },
  {
    q: "Can I use ToolsHub on any browser?",
    a: "Yes, ToolsHub works on all major browsers including Chrome, Firefox, Safari, and Edge.",
  },
  {
    q: "Is ToolsHub suitable for students and professionals?",
    a: "Yes, ToolsHub offers tools useful for students, designers, developers, office workers, and general users.",
  },
  {
    q: "Are there ads on ToolsHub?",
    a: "ToolsHub may show small ads to keep the service free, but tools remain fully accessible.",
  },
  {
    q: "Can I use ToolsHub tools for commercial work?",
    a: "Yes, you can use all ToolsHub tools for personal or commercial projects.",
  },
  {
    q: "Does ToolsHub offer customer support?",
    a: "Yes, you can contact the support team through the contact page if you face any issues.",
  },
  {
    q: "Do ToolsHub tools work on low-end devices?",
    a: "Yes, most tools are lightweight and work well even on devices with low performance.",
  },
  {
    q: "Does ToolsHub plan to launch mobile apps?",
    a: "A mobile app may be released in the future depending on user demand.",
  },
];

export default function ToolshubFaqsSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };
  return (
    <Stack
      sx={{
        px: { lg: "30px", md: "40px", sm: "100px", xs: "50px", mob: "0px" },
        py: "180px",

        position: "relative",
        alignItems: "center",
      }}
    >
      <SectionMainHeading>Tools hub FAQs</SectionMainHeading>
      <SectionMainPara pt="10px">
        Explore quick answers to the most common questions about Tools Hub.
      </SectionMainPara>
      <Stack
        direction="column"
        sx={{
          justifyContent: "center",
          alignItems: "center",
          pb: "100px",
          maxWidth: { lg: "75%", md: "80%", sm: "80%", xs: "90%", mob: "96%" },
        }}
      >
        <Stack
          direction="column"
          id="faq-cards"
          sx={{
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            alignItems: "start",
            pt: "60px",
          }}
        >
          {FAQsCards.map((card, i) => (
            <Stack
              component="div"
              role="button"
              key={i}
              sx={{
                borderRadius: "30px",
                minWidth: "100%",
                p: "40px",

                // background:
                //   "linear-gradient(180deg, #FFFFFF 0%, rgba(213, 234, 234, 0.8) 50%, rgba(170, 213, 213, 0.7) 100%) padding-box padding-box, linear-gradient(180deg, rgba(128, 192, 192, 0.57) 0%, rgba(128, 192, 192, 0.68) 100%) border-box border-box",

                border: "1px solid #09123aad",
                boxShadow: "0px 4px 20px -4px #00000040", // Your specified box shadow
                cursor: "pointer",
              }}
              onClick={() => handleClick(i)}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: {
                      xl: "22px",
                      lg: "24px",
                      md: "24px",
                      sm: "22px",
                      xs: "22px",
                      mob: "20px",
                    },
                    lineHeight: "130%",
                    color: theme.palette.primary.main,
                    pb: openIndex === i ? "8px" : "0px",
                    fontWeight: "400",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  {<FaqQuestionMarkIcon />} {card.q}
                </Typography>
                <IconButton
                  sx={{
                    p: "0px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent triggering the parent Stack
                    handleClick(i);
                  }}
                >
                  {openIndex === i ? <FaqDownIcon /> : <FaqLeftIcon />}
                </IconButton>
              </Box>

              <Collapse in={openIndex === i} timeout="auto">
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: {
                      xl: "22px",
                      lg: "20px",
                      md: "20px",
                      sm: "20px",
                      xs: "16px",
                      mob: "16px",
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
                    fontWeight: "300",
                    // width: "580px",

                    borderLeft: "8px solid #09123ACC",
                    borderRadius: "10px",
                    pl: "16px",
                    ml: "60px",
                    mt: "20px",
                    pr: "40px",
                  }}
                >
                  {card.a}
                </Typography>
              </Collapse>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
