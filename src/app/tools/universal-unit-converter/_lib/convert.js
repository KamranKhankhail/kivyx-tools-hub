export const convertValue = (value, from, to, category) => {
  const factors = {
    "Length / Distance": {
      m: 1,
      cm: 0.01,
      mm: 0.001,
      km: 1000,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.34,
    },

    "Weight / Mass": {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      t: 1000,
      lb: 0.453592,
      oz: 0.0283495,
    },

    Temperature: {
      K: 1,
      C: (v) => v + 273.15, // °C → K
      F: (v) => ((v - 32) * 5) / 9 + 273.15, // °F → K
    },

    // AREA -- removed m², cm² etc. → replaced with m2, cm2, km2 etc.
    Area: {
      m2: 1,
      cm2: 0.0001,
      km2: 1e6,
      ha: 10000,
      ac: 4046.86,
      ft2: 0.092903,
      in2: 0.00064516,
    },

    // VOLUME — removed m³ → m3
    Volume: {
      L: 1,
      mL: 0.001,
      m3: 1000,
      gal: 3.78541,
      qt: 0.946353,
      pt: 0.473176,
      floz: 0.0295735,
    },

    Speed: {
      "m/s": 1,
      "km/h": 0.277778,
      mph: 0.44704,
      kn: 0.514444,
      "ft/s": 0.3048,
    },

    Time: {
      s: 1,
      ms: 0.001,
      min: 60,
      h: 3600,
      day: 86400,
      week: 604800,
      year: 31536000,
    },

    Pressure: {
      Pa: 1,
      kPa: 1000,
      bar: 100000,
      atm: 101325,
      psi: 6894.76,
      mmHg: 133.322,
    },

    "Energy / Heat": {
      J: 1,
      kJ: 1000,
      cal: 4.184,
      kcal: 4184,
      Wh: 3600,
      kWh: 3600000,
      BTU: 1055.06,
    },

    Power: {
      W: 1,
      kW: 1000,
      MW: 1000000,
      hp: 745.7,
      BTUph: 0.293071,
    },

    Force: {
      N: 1,
      kN: 1000,
      lbf: 4.44822,
      dyn: 0.00001,
    },

    Angle: {
      rad: 1,
      deg: Math.PI / 180,
      grad: Math.PI / 200,
      rev: 2 * Math.PI,
    },

    Density: {
      "kg/m3": 1,
      "g/cm3": 1000,
      "lb/ft3": 16.0185,
    },

    Torque: {
      Nm: 1,
      lbft: 1.35582,
      lbin: 0.112985,
    },

    Acceleration: {
      "m/s2": 1,
      g: 9.80665,
      "ft/s2": 0.3048,
    },

    "Data Storage": {
      B: 1,
      KB: 1024,
      MB: 1024 ** 2,
      GB: 1024 ** 3,
      TB: 1024 ** 4,
      PB: 1024 ** 5,
    },

    "Data Transfer Rate": {
      bps: 1,
      Kbps: 1000,
      Mbps: 1000000,
      Gbps: 1000000000,
      MBps: 8000000,
    },

    Frequency: {
      Hz: 1,
      kHz: 1000,
      MHz: 1000000,
      GHz: 1000000000,
    },

    "Bit/Byte Converter": {
      bit: 1,
      byte: 8,
    },

    "Electric Voltage": {
      V: 1,
      mV: 0.001,
      kV: 1000,
    },

    "Electric Current": {
      A: 1,
      mA: 0.001,
      kA: 1000,
    },

    "Electric Resistance": {
      Ohm: 1,
      kOhm: 1000,
      MOhm: 1000000,
    },

    "Electric Power": {
      W: 1,
      kW: 1000,
      MW: 1000000,
    },

    Capacitance: {
      F: 1,
      uF: 0.000001,
      pF: 0.000000000001,
    },

    Inductance: {
      H: 1,
      mH: 0.001,
      uH: 0.000001,
    },

    "Electric Charge": {
      C: 1,
      mAh: 0.0036,
    },

    "Magnetic Field Strength": {
      T: 1,
      G: 0.0001,
    },

    Illuminance: {
      lx: 1,
      lm: 1, // placeholder
    },

    "Specific Heat Capacity": {
      "J/kgK": 1,
      "cal/gC": 4.184,
    },

    "Fuel Efficiency": {
      "km/l": 1,
      mpg: 0.425144,
    },

    "Pace / Running Speed Converter": {
      "km/h": 1,
      "min/km": (v) => 60 / v,
      "min/mi": (v) => 96.5606 / v,
      mph: 1.60934,
    },

    "Cooking Volume": {
      ml: 1,
      cup: 236.588,
      tbsp: 14.7868,
      tsp: 4.92892,
      L: 1000,
    },

    "Cooking Weight": {
      g: 1,
      oz: 28.3495,
      lb: 453.592,
    },

    "Oven Temperature": {
      C: 1,
      F: (v) => (v * 9) / 5 + 32,
      GasMark: (v) => (v - 121) / 14,
    },

    "Engine Power": {
      kW: 1,
      HP: 0.7457,
    },

    Concentration: {
      molL: 1,
      percent: (v) => v / 100,
      ppm: 0.000001,
    },

    "Radiation Units": {
      Gy: 1,
      Sv: 1,
    },

    "Shoe Size Converter": {
      US: 1,
      EU: (v) => v + 33,
      UK: (v) => v - 1,
      Asia: (v) => v * 2.54 + 15,
    },

    "Clothing Size Converter": {
      US: 1,
      EU: (v) => v + 32,
      UK: (v) => v + 4,
    },
  };

  const map = factors[category];
  if (!map) return value;

  // FUNCTION → BASE
  if (typeof map[from] === "function") {
    const toBase = map[from](value);

    if (typeof map[to] === "function") {
      return map[to].inverse ? map[to].inverse(toBase) : toBase;
    }

    return toBase / (map[to] || 1);
  }

  // NORMAL conversion
  const toBase = value * (map[from] || 1);
  return toBase / (map[to] || 1);
};

// ----------------------
//      CALCULATORS
// ----------------------

export const calculate = (category, inputs) => {
  switch (category) {
    case "File Size Calculator":
      return (inputs.duration * inputs.bitrate) / 8 / 1024;

    case "Loan / EMI Calculator": {
      const r = inputs.rate / 12 / 100;
      const n = inputs.time * 12;
      return (
        (inputs.principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      );
    }

    case "Interest Rate Calculator": {
      const r = Math.pow(inputs.amount / inputs.principal, 1 / inputs.time) - 1;
      return r * 100;
    }

    case "Discount Calculator":
      return inputs.price * (1 - inputs.discount / 100);

    case "Sales Tax / VAT Calculator":
      return inputs.price * (1 + inputs.tax / 100);

    case "Investment Return Calculator (ROI)":
      return ((inputs.return - inputs.investment) / inputs.investment) * 100;

    case "Fuel Consumption Cost Calculator":
      return (inputs.distance / inputs.efficiency) * inputs.price;

    case "Concrete Volume Calculator":
      return inputs.length * inputs.width * inputs.height;

    case "Lumber / Wood Board Feet":
      return (inputs.thickness * inputs.width * inputs.length) / 12;

    case "Steel Weight Calculator":
      return Math.PI * (inputs.diameter / 2000) ** 2 * inputs.length * 7850;

    case "Tile & Flooring Calculator":
      return Math.ceil(inputs.area / inputs.tile_size);

    case "Paint Coverage Calculator":
      return inputs.area / inputs.coverage;

    case "BMI Calculator":
      return inputs.weight / inputs.height ** 2;

    case "Body Fat Calculator":
      return (
        1.2 * (inputs.weight / (inputs.height / 100) ** 2) +
        0.23 * inputs.age -
        10.8 * (inputs.gender === "male" ? 1 : 0) -
        5.4
      );

    case "Calorie Burn Calculator":
      return (
        inputs.duration *
        inputs.weight *
        (inputs.activity === "running" ? 0.13 : 0.05)
      );

    case "Water Intake Calculator":
      return (
        inputs.weight * 0.033 + (inputs.activity_level === "high" ? 0.5 : 0)
      );

    case "Mileage / Distance Calculator":
      return inputs.fuel * inputs.efficiency;

    case "Tire Size Converter":
      return `${inputs.width}/${inputs.aspect} R${inputs.rim}`;

    case "Fuel Economy Cost":
      return (inputs.distance / inputs.efficiency) * inputs.price;

    case "Age Calculator":
      return (
        (new Date() - new Date(inputs.birthdate)) / (365.25 * 24 * 3600 * 1000)
      );

    case "Date Difference Calculator":
      return (
        Math.abs(new Date(inputs.date1) - new Date(inputs.date2)) /
        (24 * 3600 * 1000)
      );

    case "Work Hour Calculator":
      return inputs.hours_per_day * inputs.days;

    case "Countdown Calculator":
      return (new Date(inputs.target_date) - new Date()) / (24 * 3600 * 1000);

    default:
      return 0;
  }
};

// ----------------------
//   CURRENCY API
// ----------------------

export const convertCurrency = async (value, from, to) => {
  const res = await fetch(
    `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${value}`
  );
  const data = await res.json();
  return data.result;
};
