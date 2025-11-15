// @/components/converter/Sidebar.js
import { converterCategories } from "@/app/tools/universal-unit-converter/_data/units-data";
import { Box, Typography, Button, Collapse } from "@mui/material";
import theme from "@/styles/theme";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function Sidebar({ onSelect }) {
  const [openGroups, setOpenGroups] = useState({});

  const toggleGroup = (groupName) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  return (
    <Box
      sx={{
        p: 2,
        minWidth: "23%",
        bgcolor: "#fff",
        borderRadius: "16px",
        boxShadow: 1,
        height: "100%",
        maxHeight: "100%",
        overflowY: "auto",
        msOverflowStyle: "none",
        scrollbarWidth: "none",
        "&::WebkitScrollbar": {
          display: "none",
        },
      }}
    >
      {converterCategories.map((group) => (
        <div key={group.group} className="mb-4">
          <Button
            fullWidth
            onClick={() => toggleGroup(group.group)}
            sx={{
              justifyContent: "space-between",
              textTransform: "none",
              color: theme.palette.primary.main,
              fontWeight: "bold",
              py: 1.5,
              borderRadius: "12px",
              bgcolor: theme.palette.secondary.main,
              "&:hover": { bgcolor: theme.palette.secondary.secondMain },
            }}
          >
            {group.group}
            {openGroups[group.group] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Button>
          <Collapse in={openGroups[group.group]} timeout="auto" unmountOnExit>
            <Box sx={{ pt: 1 }}>
              {group.items.map((item) => (
                <Button
                  key={item.id}
                  fullWidth
                  variant="text"
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    color: theme.palette.primary.secondMain,
                    py: 1,
                    fontSize: "14px",
                    "&:hover": {
                      bgcolor: theme.palette.secondary.main,
                      color: theme.palette.primary.main,
                    },
                  }}
                  onClick={() => onSelect(item)}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          </Collapse>
        </div>
      ))}
    </Box>
  );
}
