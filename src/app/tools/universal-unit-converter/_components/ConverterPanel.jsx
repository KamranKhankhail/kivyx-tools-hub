import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
} from "@mui/material";
import theme from "@/styles/theme";
import { useState } from "react";
import {
  convertValue,
  calculate,
  convertCurrency,
} from "@/app/tools/universal-unit-converter/_lib/convert";

export default function ConverterPanel({ category, onConvert }) {
  const [values, setValues] = useState({});
  const handleChange = (name, val) =>
    setValues((prev) => ({ ...prev, [name]: val }));

  const handleConvert = async () => {
    let result;
    if (category.type === "unit") {
      const value = values.value || 1;
      const from = values.from || category.units[0];
      const to = values.to || category.units[1];
      if (category.api) {
        result = await convertCurrency(value, from, to);
      } else {
        result = convertValue(value, from, to, category.name);
      }
      onConvert({
        from,
        to,
        value,
        result,
        all: category.units.map((u) => ({
          unit: u,
          value: convertValue(value, from, u, category.name),
        })),
      });
    } else {
      result = calculate(category.name, values);
      onConvert({ result, inputs: values });
    }
  };

  return (
    <Stack
      spacing={3}
      sx={{
        p: 3,
        bgcolor: "#fff",
        borderRadius: "16px",
        boxShadow: 1,
        flex: 1,
        height: "100%",
      }}
    >
      {category.type === "unit" ? (
        <>
          <TextField
            label="Value"
            type="number"
            value={values.value || 1}
            onChange={(e) => handleChange("value", parseFloat(e.target.value))}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>From</InputLabel>
            <Select
              value={values.from || category.units[0]}
              onChange={(e) => handleChange("from", e.target.value)}
            >
              {category.units.map((u) => (
                <MenuItem key={u} value={u}>
                  {u}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>To</InputLabel>
            <Select
              value={values.to || category.units[1]}
              onChange={(e) => handleChange("to", e.target.value)}
            >
              {category.units.map((u) => (
                <MenuItem key={u} value={u}>
                  {u}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      ) : (
        category.inputs.map((input) => (
          <TextField
            key={input.name}
            label={`${input.name} (${input.unit})`}
            type={input.unit.includes("date") ? "date" : "text"}
            onChange={(e) => handleChange(input.name, e.target.value)}
            fullWidth
          />
        ))
      )}
      <Button
        variant="contained"
        sx={{ bgcolor: theme.palette.primary.main, color: "#fff", py: 1.5 }}
        onClick={handleConvert}
      >
        Convert / Calculate
      </Button>
    </Stack>
  );
}
