// @/components/converter/Favorites.js
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import theme from "@/styles/theme";
import { useEffect, useState } from "react";

export default function Favorites({ onSelect }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("unit_favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    localStorage.setItem("unit_favorites", JSON.stringify(updated));
  };

  return (
    <Box
      sx={{ mt: 4, p: 3, bgcolor: "#fff", borderRadius: "16px", boxShadow: 1 }}
    >
      <Typography
        sx={{ color: theme.palette.primary.main, fontWeight: "bold", mb: 2 }}
      >
        Favorite Converters
      </Typography>
      {favorites.length === 0 ? (
        <Typography color="text.secondary" fontSize="14px">
          No favorites yet. Click star on any converter.
        </Typography>
      ) : (
        <List>
          {favorites.map((fav) => (
            <ListItem
              key={fav.id}
              secondaryAction={
                <Button
                  size="small"
                  onClick={() => removeFavorite(fav.id)}
                  sx={{ color: theme.palette.ui.delete }}
                >
                  Remove
                </Button>
              }
              sx={{ cursor: "pointer", borderRadius: "8px", mb: 1 }}
              onClick={() => onSelect(fav)}
            >
              <ListItemText primary={fav.name} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
