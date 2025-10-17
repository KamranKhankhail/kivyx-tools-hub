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
    q: "What is Islam Encyclo?",
    a: "Islam Encyclo is a comprehensive Islamic guide that provides authentic information, step-by-step guidelines, and easy references for daily practices.",
  },
  {
    q: "Does the app provide Wudu guidelines?",
    a: "Yes, the app provides complete step-by-step Wudu guidelines with clear illustrations for both men and women.",
  },
  {
    q: "Are the guidelines separate for men and women?",
    a: "Yes, the app offers separate Islamic guidelines for men and women to ensure accuracy and clarity.",
  },
  {
    q: "Which languages are available in Islam Encyclo?",
    a: "The app is available in three languages: Arabic, English, and Urdu for easy accessibility.",
  },
  {
    q: "Are the contents authentic?",
    a: "Yes, all guidelines and references are taken from the Quran and authentic Hadith collections.",
  },
  {
    q: "Can I use the app offline?",
    a: "Yes, most of the content can be accessed offline once downloaded.",
  },
  {
    q: "Does the app include step-by-step Salah guidance?",
    a: "Yes, the app provides complete Salah guidelines, including actions, recitations, and conditions.",
  },
  {
    q: "Can children use this app?",
    a: "Yes, the app is designed in a simple and interactive way, making it easy for children to understand Islamic practices.",
  },
  {
    q: "Is the app free to use?",
    a: "Yes, the basic features of Islam Encyclo are free. Premium features may be added in the future.",
  },
  {
    q: "How often is the content updated?",
    a: "The content is regularly updated to ensure accuracy, authenticity, and new additions to Islamic topics.",
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
