// @/components/converter/History.js
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import theme from "@/styles/theme";
import { useEffect, useState } from "react";

export default function History({ onSelect }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("unit_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  return (
    <Box
      sx={{ mt: 4, p: 3, bgcolor: "#fff", borderRadius: "16px", boxShadow: 1 }}
    >
      <Typography
        sx={{ color: theme.palette.primary.main, fontWeight: "bold", mb: 2 }}
      >
        Recent Conversions
      </Typography>
      {history.length === 0 ? (
        <Typography color="text.secondary" fontSize="14px">
          Your history will appear here.
        </Typography>
      ) : (
        <List>
          {history
            .slice(-10)
            .reverse()
            .map((entry, i) => (
              <ListItem
                key={i}
                sx={{ cursor: "pointer", borderRadius: "8px", mb: 1 }}
                onClick={() => onSelect(entry.converter)}
              >
                <ListItemText
                  primary={entry.query}
                  secondary={`${entry.result} ${entry.to}`}
                />
              </ListItem>
            ))}
        </List>
      )}
    </Box>
  );
}
