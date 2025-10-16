"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

const BpIcon = styled("span")(() => ({
  border: "2px solid #D9D9D9",
  borderRadius: "50%",
  width: 18,
  height: 18,
}));

const BpCheckedIcon = styled(BpIcon)({
  border: "7px solid #74bdfe",
  "&::before": {
    display: "block",
    width: 18,
    height: 18,
  },
});

function BpRadio(props) {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
}

export default function CustomizedRadios({ lables = [], value, onChange }) {
  const [internalValue, setInternalValue] = React.useState("");

  const handleChange = (e) => {
    const newVal = e.target.value;
    setInternalValue(newVal);
    if (onChange) onChange(newVal); // 🔑 notify parent
  };

  return (
    <FormControl>
      <RadioGroup
        row
        name="customized-radios"
        value={value ?? internalValue} // ✅ controlled (via parent) or fallback to local state
        onChange={handleChange}
        sx={{
          pl: "4px",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {lables.map((radioButton, i) => (
          <FormControlLabel
            key={i}
            value={radioButton}
            control={<BpRadio />}
            label={radioButton}
            sx={{
              fontSize: "16px",
              fontWeight: "400",
              lineHeight: "19.36px",
            }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
