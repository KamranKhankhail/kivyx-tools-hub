// import React from "react";
// import {
//   Box,
//   Stack,
//   TextField,
//   Typography,
//   Tooltip,
//   tooltipClasses,
// } from "@mui/material";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { styled } from "@mui/material/styles"; // Import styled

// // Styled tooltip (copied from UrlScreen.jsx with red background and gray arrow)
// const ErrorTooltip = styled(({ className, ...props }) => (
//   <Tooltip
//     {...props}
//     classes={{ popper: className }}
//     slotProps={{
//       popper: {
//         sx: { zIndex: 1500 }, // Transferred zIndex from original Tooltip
//         modifiers: [
//           {
//             name: "offset",
//             options: {
//               offset: [0, 0], // Adjust offset for better alignment
//             },
//           },
//         ],
//       },
//       arrow: {
//         sx: {
//           color: "#e53935", // Gray color for the arrow
//         },
//       },
//     }}
//   />
// ))(() => ({
//   [`& .${tooltipClasses.tooltip}`]: {
//     backgroundColor: "#e53935",
//     color: "#fff",
//     fontSize: "13px",
//     fontWeight: 500,
//     padding: "6px 12px",
//     borderRadius: "8px",
//     boxShadow: "0px 2px 8px rgba(0,0,0,0.25)",
//     maxWidth: 300,
//     textAlign: "center",
//   },
// }));

// const vCardTextFieldsData = [
//   {
//     title: "Your Name:",
//     placeholders: ["First Name", "Last Name"],
//     keys: ["firstName", "lastName"],
//   },
//   { title: "Contact:", placeholders: ["Mobile"], keys: ["mobile"] },
//   { title: "", placeholders: ["Phone", "Fax"], keys: ["phone", "fax"] },
//   { title: "Email:", placeholders: ["your@email.com"], keys: ["email"] },
//   {
//     title: "Company:",
//     placeholders: ["Company", "Your Job"],
//     keys: ["company", "job"],
//   },
//   { title: "Street:", placeholders: ["Street"], keys: ["street"] },
//   { title: "City:", placeholders: ["City", "ZIP"], keys: ["city", "zip"] },
//   { title: "State:", placeholders: ["State"], keys: ["state"] },
//   { title: "Country:", placeholders: ["Country"], keys: ["country"] },
//   {
//     title: "Website:",
//     placeholders: ["www.your-website.com"],
//     keys: ["website"],
//   },
// ];

// // helper to allow optional matches (so empty string doesn't fail)
// const optionalMatch = (regex, msg) =>
//   yup
//     .string()
//     .test("optional-match", msg, (val) => {
//       if (!val || val === "") return true;
//       return regex.test(val);
//     })
//     .nullable();

// // Validation schema
// const schema = yup.object().shape({
//   firstName: yup
//     .string()
//     .matches(/^[A-Za-z ]+$/, "Only letters allowed")
//     .required("First name required"),
//   lastName: yup
//     .string()
//     .matches(/^[A-Za-z ]+$/, "Only letters allowed")
//     .required("Last name required"),
//   mobile: yup
//     .string()
//     .matches(/^[0-9+ ]+$/, "Only numbers, + and spaces allowed")
//     .test("digit-count", "At least 7 digits required", (v) =>
//       v ? v.replace(/\D/g, "").length >= 7 : false
//     )
//     .required("Mobile required"),
//   phone: optionalMatch(/^[0-9+ ]+$/, "Only numbers, + and spaces allowed").test(
//     "phone-digits",
//     "At least 7 digits required",
//     (v) => !v || v.replace(/\D/g, "").length >= 7
//   ),
//   fax: optionalMatch(/^[0-9+ ]+$/, "Only numbers, + and spaces allowed"),
//   email: yup.string().email("Enter a valid email").required("Email required"),
//   company: optionalMatch(
//     /^[A-Za-z0-9 ]+$/,
//     "Only letters, numbers and spaces allowed"
//   ),
//   job: optionalMatch(/^[A-Za-z ]+$/, "Only letters and spaces allowed"),
//   street: yup.string().nullable(),
//   city: optionalMatch(/^[A-Za-z ]+$/, "Only letters and spaces allowed"),
//   zip: optionalMatch(/^[0-9]+$/, "Only numbers allowed"),
//   state: optionalMatch(/^[A-Za-z ]+$/, "Only letters and spaces allowed"),
//   country: optionalMatch(/^[A-Za-z ]+$/, "Only letters and spaces allowed"),
//   website: optionalMatch(
//     /^(https?:\/\/|www\.)[^\s]+$/,
//     "Enter a valid website (www. or http(s)://)"
//   ),
// });

// // Function to generate a vCard string
// const generateVcardString = (values) => {
//   const {
//     firstName = "",
//     lastName = "",
//     email = "",
//     mobile = "",
//     phone = "",
//     fax = "",
//     company = "",
//     job = "",
//     street = "",
//     city = "",
//     zip = "",
//     state = "",
//     country = "",
//     website = "",
//   } = values;

//   const vcardLines = ["BEGIN:VCARD", "VERSION:3.0"];

//   const fullName = `${firstName} ${lastName}`.trim();
//   if (fullName) {
//     vcardLines.push(`FN:${fullName}`);
//     vcardLines.push(`N:${lastName};${firstName};;;`);
//   }

//   if (mobile) {
//     vcardLines.push(`TEL;TYPE=CELL:${mobile}`);
//   }
//   if (phone) {
//     vcardLines.push(`TEL;TYPE=WORK:${phone}`);
//   }
//   if (fax) {
//     vcardLines.push(`TEL;TYPE=FAX:${fax}`);
//   }
//   if (email) {
//     vcardLines.push(`EMAIL:${email}`);
//   }
//   if (company) {
//     vcardLines.push(`ORG:${company}`);
//   }
//   if (job) {
//     vcardLines.push(`TITLE:${job}`);
//   }

//   const addressComponents = [null, null, street, city, state, zip, country]; // ADR components (POBox; Ext; Street; City; Region; PostalCode; Country)
//   // Only add ADR if at least one address component is present
//   if (street || city || state || zip || country) {
//     vcardLines.push(`ADR;TYPE=WORK:${addressComponents.join(";")}`);
//   }

//   if (website) {
//     vcardLines.push(`URL:${website}`);
//   }

//   vcardLines.push("END:VCARD");
//   return vcardLines.join("\n");
// };

// export default function VcardScreen({ setValue }) {
//   const { control, watch, formState } = useForm({
//     resolver: yupResolver(schema),
//     mode: "onChange", // validate while typing
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       mobile: "",
//       phone: "",
//       fax: "",
//       email: "",
//       company: "",
//       job: "",
//       street: "",
//       city: "",
//       zip: "",
//       state: "",
//       country: "",
//       website: "",
//     },
//   });

//   const values = watch();
//   const isValid = formState.isValid;

//   // build aligned formatted string (monospace-friendly) for IN-APP PREVIEW
//   const formatted = React.useMemo(() => {
//     const {
//       firstName = "",
//       lastName = "",
//       email = "",
//       mobile = "",
//       phone = "",
//       fax = "",
//       company = "",
//       job = "",
//       street = "",
//       city = "",
//       zip = "",
//       state = "",
//       country = "",
//       website = "",
//     } = values || {};

//     const formatLine = (label, value) => label.padEnd(14, " ") + (value || "—");

//     return [
//       formatLine("Name:", `${firstName} ${lastName}`.trim() || "—"),
//       formatLine("Email:", email || "—"),
//       formatLine("Mobile:", mobile || "—"), // Changed "Telephone" to "Mobile" for clarity
//       formatLine("Phone No.:", phone || "—"),
//       formatLine("Fax:", fax || "—"),
//       formatLine("Company:", company || "—"),
//       formatLine("Job:", job || "—"),
//       formatLine("Street:", street || "—"),
//       formatLine("City:", city || "—"),
//       formatLine("Zip Code:", zip || "—"),
//       formatLine("State:", state || "—"),
//       formatLine("Country:", country || "—"),
//       formatLine("Website:", website || "—"),
//     ].join("\n");
//   }, [values]);

//   // send proper vCard string up to parent when valid (otherwise clear parent value)
//   React.useEffect(() => {
//     if (isValid) {
//       const vcard = generateVcardString(values);
//       setValue(vcard);
//     } else {
//       setValue("");
//     }
//   }, [isValid, values, setValue]); // Depend on 'values' to regenerate vCard when any input changes

//   return (
//     <Stack sx={{ flex: "1" }}>
//       <Typography
//         variant="body2"
//         sx={{
//           fontSize: "20px",
//           fontWeight: "500",
//           lineHeight: "21.78px",
//           color: "#253164",
//           pb: "20px",
//         }}
//       >
//         vCard QR Code
//       </Typography>

//       <Stack spacing={2}>
//         {vCardTextFieldsData.map((row, i) => (
//           <Box
//             key={i}
//             sx={{
//               display: "flex",
//               flexDirection: "row",
//               gap: "20px",
//               alignItems: "center",
//             }}
//           >
//             <Typography
//               variant="body2"
//               sx={{
//                 fontWeight: "400",
//                 fontSize: "18px",
//                 lineHeight: "21.78px",
//                 color: "#253164",
//                 minWidth: "120px",
//               }}
//             >
//               {row.title}
//             </Typography>

//             <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
//               {row.keys.map((fieldKey, idx) => (
//                 <Controller
//                   key={fieldKey}
//                   name={fieldKey}
//                   control={control}
//                   render={({ field, fieldState: { error } }) => (
//                     <ErrorTooltip // Changed from Tooltip to ErrorTooltip
//                       title={error ? error.message : ""}
//                       open={!!error}
//                       placement="top"
//                       arrow
//                     >
//                       <TextField
//                         {...field}
//                         variant="outlined"
//                         placeholder={row.placeholders[idx] || ""}
//                         fullWidth
//                         error={!!error}
//                         sx={{
//                           flex: 1,
//                           input: {
//                             bgcolor: "#ffffff",
//                             color: "#61698b",
//                             fontSize: "14px",
//                             px: "4px",
//                             py: "10px",
//                           },
//                           "& .MuiOutlinedInput-root": {
//                             px: "8px",
//                             borderRadius: "8px",
//                             bgcolor: "#ffffff",
//                             "& fieldset": {
//                               border: !!error
//                                 ? "2px solid #e53935"
//                                 : "2px solid #adf2fa",
//                             },
//                             "&:hover fieldset": {
//                               border: !!error
//                                 ? "2px solid #e53935"
//                                 : "1.5px solid #adf2fa",
//                             },
//                             "&.Mui-focused fieldset": {
//                               border: !!error
//                                 ? "2px solid #e53935"
//                                 : "1.5px solid #adf2fa",
//                             },
//                           },
//                         }}
//                       />
//                     </ErrorTooltip>
//                   )}
//                 />
//               ))}
//             </Stack>
//           </Box>
//         ))}

//         {/* Preview box (monospace, preserves spaces/lines) */}
//         <Box
//           sx={{
//             mt: 4,
//             p: 3,
//             border: "2px solid #adf2fa",
//             borderRadius: "12px",
//             bgcolor: "#ffffff",
//             color: "#253164",
//             fontSize: "15px",
//             fontFamily: "monospace",
//             whiteSpace: "pre",
//           }}
//         >
//           {formatted}
//         </Box>
//       </Stack>
//     </Stack>
//   );
// }

import React from "react";
import {
  Box,
  Stack,
  TextField,
  Typography,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { styled } from "@mui/material/styles"; // Import styled

// Styled tooltip (copied from UrlScreen.jsx with red background and gray arrow)
const ErrorTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    slotProps={{
      popper: {
        sx: { zIndex: 1500 }, // Transferred zIndex from original Tooltip
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 0], // Adjust offset for better alignment
            },
          },
        ],
      },
      arrow: {
        sx: {
          color: "#e53935", // Gray color for the arrow
        },
      },
    }}
  />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#e53935",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 500,
    padding: "6px 12px",
    borderRadius: "8px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.25)",
    maxWidth: 300,
    textAlign: "center",
  },
}));

const vCardTextFieldsData = [
  {
    title: "Your Name:",
    placeholders: ["First Name", "Last Name"],
    keys: ["firstName", "lastName"],
  },
  { title: "Contact:", placeholders: ["Mobile"], keys: ["mobile"] },
  { title: "", placeholders: ["Phone", "Fax"], keys: ["phone", "fax"] },
  { title: "Email:", placeholders: ["your@email.com"], keys: ["email"] },
  {
    title: "Company:",
    placeholders: ["Company", "Your Job"],
    keys: ["company", "job"],
  },
  { title: "Street:", placeholders: ["Street"], keys: ["street"] },
  { title: "City:", placeholders: ["City", "ZIP"], keys: ["city", "zip"] },
  { title: "State:", placeholders: ["State"], keys: ["state"] },
  { title: "Country:", placeholders: ["Country"], keys: ["country"] },
  {
    title: "Website:",
    placeholders: ["www.your-website.com"],
    keys: ["website"],
  },
];

// helper to allow optional matches (so empty string doesn't fail)
const optionalMatch = (regex, msg) =>
  yup
    .string()
    .test("optional-match", msg, (val) => {
      if (!val || val === "") return true;
      return regex.test(val);
    })
    .nullable();

// Validation schema
const schema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^[A-Za-z ]+$/, "Only letters allowed")
    .required("First name required"),
  lastName: yup
    .string()
    .matches(/^[A-Za-z ]+$/, "Only letters allowed")
    .required("Last name required"),
  mobile: yup
    .string()
    .matches(/^[0-9+ ]+$/, "Only numbers, + and spaces allowed")
    .test("digit-count", "At least 7 digits required", (v) =>
      v ? v.replace(/\D/g, "").length >= 7 : false
    )
    .required("Mobile required"),
  phone: optionalMatch(/^[0-9+ ]+$/, "Only numbers, + and spaces allowed").test(
    "phone-digits",
    "At least 7 digits required",
    (v) => !v || v.replace(/\D/g, "").length >= 7
  ),
  fax: optionalMatch(/^[0-9+ ]+$/, "Only numbers, + and spaces allowed"),
  email: yup.string().email("Enter a valid email").required("Email required"),
  company: optionalMatch(
    /^[A-Za-z0-9 ]+$/,
    "Only letters, numbers and spaces allowed"
  ),
  job: optionalMatch(/^[A-Za-z ]+$/, "Only letters and spaces allowed"),
  street: yup.string().nullable(),
  city: optionalMatch(/^[A-Za-z ]+$/, "Only letters and spaces allowed"),
  zip: optionalMatch(/^[0-9]+$/, "Only numbers allowed"),
  state: optionalMatch(/^[A-Za-z ]+$/, "Only letters and spaces allowed"),
  country: optionalMatch(/^[A-Za-z ]+$/, "Only letters and spaces allowed"),
  website: optionalMatch(
    /^(https?:\/\/|www\.)[^\s]+$/,
    "Enter a valid website (www. or http(s)://)"
  ),
});

// Function to generate a vCard string
const generateVcardString = (values) => {
  const {
    firstName = "",
    lastName = "",
    email = "",
    mobile = "",
    phone = "",
    fax = "",
    company = "",
    job = "",
    street = "",
    city = "",
    zip = "",
    state = "",
    country = "",
    website = "",
  } = values;

  const vcardLines = ["BEGIN:VCARD", "VERSION:3.0"];

  const fullName = `${firstName} ${lastName}`.trim();
  if (fullName) {
    vcardLines.push(`FN:${fullName}`);
    vcardLines.push(`N:${lastName};${firstName};;;`);
  }

  if (mobile) {
    vcardLines.push(`TEL;TYPE=CELL:${mobile}`);
  }
  if (phone) {
    vcardLines.push(`TEL;TYPE=WORK:${phone}`);
  }
  if (fax) {
    vcardLines.push(`TEL;TYPE=FAX:${fax}`);
  }
  if (email) {
    vcardLines.push(`EMAIL:${email}`);
  }
  if (company) {
    vcardLines.push(`ORG:${company}`);
  }
  if (job) {
    vcardLines.push(`TITLE:${job}`);
  }

  const addressComponents = [null, null, street, city, state, zip, country]; // ADR components (POBox; Ext; Street; City; Region; PostalCode; Country)
  // Only add ADR if at least one address component is present
  if (street || city || state || zip || country) {
    vcardLines.push(`ADR;TYPE=WORK:${addressComponents.join(";")}`);
  }

  if (website) {
    vcardLines.push(`URL:${website}`);
  }

  vcardLines.push("END:VCARD");
  return vcardLines.join("\n");
};

export default function VcardScreen({ setValue }) {
  const { control, watch, formState } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange", // validate while typing
    defaultValues: {
      firstName: "",
      lastName: "",
      mobile: "",
      phone: "",
      fax: "",
      email: "",
      company: "",
      job: "",
      street: "",
      city: "",
      zip: "",
      state: "",
      country: "",
      website: "",
    },
  });

  const values = watch();
  const isValid = formState.isValid;

  // build aligned formatted string (monospace-friendly) for IN-APP PREVIEW
  const formatted = React.useMemo(() => {
    const {
      firstName = "",
      lastName = "",
      email = "",
      mobile = "",
      phone = "",
      fax = "",
      company = "",
      job = "",
      street = "",
      city = "",
      zip = "",
      state = "",
      country = "",
      website = "",
    } = values || {};

    const formatLine = (label, value) => label.padEnd(14, " ") + (value || "—");

    return [
      formatLine("Name:", `${firstName} ${lastName}`.trim() || "—"),
      formatLine("Email:", email || "—"),
      formatLine("Mobile:", mobile || "—"), // Changed "Telephone" to "Mobile" for clarity
      formatLine("Phone No.:", phone || "—"),
      formatLine("Fax:", fax || "—"),
      formatLine("Company:", company || "—"),
      formatLine("Job:", job || "—"),
      formatLine("Street:", street || "—"),
      formatLine("City:", city || "—"),
      formatLine("Zip Code:", zip || "—"),
      formatLine("State:", state || "—"),
      formatLine("Country:", country || "—"),
      formatLine("Website:", website || "—"),
    ].join("\n");
  }, [values]);

  // send proper vCard string up to parent when valid (otherwise clear parent value)
  React.useEffect(() => {
    if (isValid) {
      const vcard = generateVcardString(values);
      setValue(vcard);
    } else {
      setValue("");
    }
  }, [isValid, values, setValue]); // Depend on 'values' to regenerate vCard when any input changes

  return (
    <Stack sx={{ flex: "1" }}>
      <Typography
        variant="body2"
        sx={{
          fontSize: "20px",
          fontWeight: "500",
          lineHeight: "21.78px",
          color: "#253164",
          pb: "20px",
        }}
      >
        vCard QR Code
      </Typography>

      <Stack spacing={2}>
        {vCardTextFieldsData.map((row, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              flexDirection: {
                lg: "row",
                md: "row",
                sm: "row",
                xs: "row",
                mob: "column",
              }, // Changed from row to column on xs
              gap: "20px",
              alignItems: { lg: "start" }, // Align items to start on xs, center on sm+
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: "400",
                fontSize: "18px",
                lineHeight: "21.78px",
                color: "#253164",
                minWidth: { xs: "120px", sm: "120px" },
                textAlign: {
                  xs: "start",
                  sm: "start",
                  xs: "start",
                  mob: "center",
                },
                // width: { xs: "100%", sm: "auto" },
                width: "auto",
                mb: { xs: 1, sm: 0 }, // Add margin bottom on xs
              }}
            >
              {row.title}
            </Typography>

            <Stack
              direction={{
                lg: "row",
                md: "row",
                sm: "row",
                xs: "column",
                mob: "column",
              }}
              spacing={2}
              sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }} // Take full width on xs if single, auto for multiple
            >
              {row.keys.map((fieldKey, idx) => (
                <Controller
                  key={fieldKey}
                  name={fieldKey}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <ErrorTooltip // Changed from Tooltip to ErrorTooltip
                      title={error ? error.message : ""}
                      open={!!error}
                      placement="top"
                      arrow
                    >
                      <TextField
                        {...field}
                        variant="outlined"
                        placeholder={row.placeholders[idx] || ""}
                        fullWidth // This handles single textfield taking full width
                        error={!!error}
                        sx={{
                          flex: 1,
                          input: {
                            bgcolor: "#ffffff",
                            color: "#61698b",
                            fontSize: "14px",
                            px: "4px",
                            py: "10px",
                          },
                          "& .MuiOutlinedInput-root": {
                            px: "8px",
                            borderRadius: "8px",
                            bgcolor: "#ffffff",
                            "& fieldset": {
                              border: !!error
                                ? "2px solid #e53935"
                                : "2px solid #adf2fa",
                            },
                            "&:hover fieldset": {
                              border: !!error
                                ? "2px solid #e53935"
                                : "1.5px solid #adf2fa",
                            },
                            "&.Mui-focused fieldset": {
                              border: !!error
                                ? "2px solid #e53935"
                                : "1.5px solid #adf2fa",
                            },
                          },
                        }}
                      />
                    </ErrorTooltip>
                  )}
                />
              ))}
            </Stack>
          </Box>
        ))}

        {/* Preview box (monospace, preserves spaces/lines) */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            border: "2px solid #adf2fa",
            borderRadius: "12px",
            bgcolor: "#ffffff",
            color: "#253164",
            fontSize: "15px",
            fontFamily: "monospace",
            whiteSpace: "pre",
          }}
        >
          {formatted}
        </Box>
      </Stack>
    </Stack>
  );
}
