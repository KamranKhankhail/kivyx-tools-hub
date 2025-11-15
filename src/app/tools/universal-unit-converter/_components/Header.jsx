// @/components/converter/Header.js
import ToolsHubsIcon from "@/icons/ToolsHubsIcon";
import theme from "@/styles/theme";
import { Box, Stack, Tooltip } from "@mui/material";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

export default function Header({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(query);
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-4 fixed z-[1000]">
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Box component={Link} href="/" sx={{ cursor: "pointer" }}>
          <ToolsHubsIcon width="147" />
        </Box>
        <h1
          className="text-2xl font-semibold"
          style={{ color: theme.palette.primary.main, minWidth: "240px" }}
        >
          Universal Unit Converter
        </h1>
        <Tooltip title="Try: 5 kg to g, 100 USD to PKR, 25°C to °F">
          <div
            className="flex items-center bg-gray-100 rounded-xl px-4 py-2 w-80"
            style={{ border: `1px solid ${theme.palette.primary.main}` }}
          >
            <SearchIcon sx={{ color: theme.palette.primary.main }} />
            <input
              type="text"
              placeholder="Search or convert: 5 kg to g"
              className="ml-2 flex-1 outline-none bg-transparent"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </Tooltip>
      </Stack>
    </div>
  );
}
