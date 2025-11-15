import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import theme from "@/styles/theme";

export default function ResultsTable({ data }) {
  if (!data) return null;

  if (data.all) {
    return (
      <Paper
        sx={{
          p: 2,
          borderRadius: "12px",
          boxShadow: 1,
          flex: 1,
          overflowY: "auto",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          "&::WebkitScrollbar": {
            display: "none",
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.secondary.main }}>
              <TableCell
                sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
              >
                Unit
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
              >
                Value
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.all.map((row) => (
              <TableRow
                key={row.unit}
                sx={{ "&:hover": { bgcolor: theme.palette.secondary.main } }}
              >
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.value.toFixed(6)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  } else {
    return (
      <Paper sx={{ p: 2, borderRadius: "12px", boxShadow: 1, flex: 1 }}>
        <Typography
          sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
        >
          Result: {data.result}
        </Typography>
      </Paper>
    );
  }
}
