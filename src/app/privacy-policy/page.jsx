import { Stack, Typography, Box } from "@mui/material";

export const metadata = {
  title: "Privacy Policy | ToolsHub by Kivyx Technologies",
  description:
    "Read the Privacy Policy for ToolsHub, outlining how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <Stack
      sx={{
        px: { lg: "80px", md: "70px", sm: "70px", xs: "60px", mob: "40px" },
        py: "50px",
        // bgcolor: "#f9f9f9", // Light background for the page
        color: "#333", // Darker text for readability
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#09123a" }}
      >
        Privacy Policy
      </Typography>
      <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", mb: 4 }}>
        Effective Date: December 5, 2025
      </Typography>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "medium", color: "#09123a" }}
      >
        1. Introduction
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to Toolshub (https://toolshub.kivyx.com/). We respect your
        privacy and are committed to protecting your personal information. This
        Privacy Policy explains how Kivyx Technologies collects, uses,
        discloses, and safeguards your information when you visit our website
        and use our tools.
      </Typography>
      <Typography variant="body1" paragraph>
        Please read this Privacy Policy carefully. If you do not agree with the
        terms of this Privacy Policy, please do not access the site.
      </Typography>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "medium", color: "#09123a" }}
      >
        2. Information We Collect
      </Typography>
      <Typography
        variant="h6"
        component="h3"
        gutterBottom
        sx={{ fontWeight: "normal", mt: 2 }}
      >
        2.1 Personal Data
      </Typography>
      <Typography variant="body1" paragraph>
        We do not typically collect personally identifiable information from
        users who simply browse our website or use our basic tools. However, we
        may collect personal data if you voluntarily provide it to us, such as
        when you:
      </Typography>
      <Box component="ul" sx={{ ml: 3, mb: 2 }}>
        <Typography component="li" variant="body1">
          Contact us via email or contact forms.
        </Typography>
        <Typography component="li" variant="body1">
          Subscribe to our newsletter (if applicable).
        </Typography>
        <Typography component="li" variant="body1">
          Provide feedback or participate in surveys.
        </Typography>
      </Box>
      <Typography variant="body1" paragraph>
        This information may include your name, email address, and any other
        details you choose to provide.
      </Typography>

      <Typography
        variant="h6"
        component="h3"
        gutterBottom
        sx={{ fontWeight: "normal", mt: 2 }}
      >
        2.2 Non-Personal Data
      </Typography>
      <Typography variant="body1" paragraph>
        When you access our website, we may automatically collect certain
        non-personal data, including:
      </Typography>
      <Box component="ul" sx={{ ml: 3, mb: 2 }}>
        <Typography component="li" variant="body1">
          Browser type and version.
        </Typography>
        <Typography component="li" variant="body1">
          Operating system.
        </Typography>
        <Typography component="li" variant="body1">
          IP address.
        </Typography>
        <Typography component="li" variant="body1">
          Pages viewed and links clicked.
        </Typography>
        <Typography component="li" variant="body1">
          Time and date of visit.
        </Typography>
        <Typography component="li" variant="body1">
          Referring website addresses.
        </Typography>
        <Typography component="li" variant="body1">
          Usage data related to our tools (e.g., type of tool used, duration of
          use, but not the content processed by the tool).
        </Typography>
      </Box>
      <Typography variant="body1" paragraph>
        This information is collected through cookies, web beacons, and other
        tracking technologies.
      </Typography>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "medium", color: "#09123a" }}
      >
        3. How We Use Your Information
      </Typography>
      <Typography variant="body1" paragraph>
        We use the information we collect for various purposes, including:
      </Typography>
      <Box component="ul" sx={{ ml: 3, mb: 2 }}>
        <Typography component="li" variant="body1">
          To operate and maintain our website and tools.
        </Typography>
        <Typography component="li" variant="body1">
          To improve our website, tools, products, and services.
        </Typography>
        <Typography component="li" variant="body1">
          To understand and analyze how you use our website and tools.
        </Typography>
        <Typography component="li" variant="body1">
          To communicate with you, respond to your inquiries, and provide
          customer support.
        </Typography>
        <Typography component="li" variant="body1">
          To send you newsletters, marketing, or promotional materials (if you
          opt-in).
        </Typography>
        <Typography component="li" variant="body1">
          To detect and prevent fraud and other illegal activities.
        </Typography>
        <Typography component="li" variant="body1">
          To comply with legal obligations.
        </Typography>
      </Box>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "medium", color: "#09123a" }}
      >
        4. How We Share Your Information
      </Typography>
      <Typography variant="body1" paragraph>
        We do not sell, trade, rent, or otherwise transfer your personal
        information to third parties without your consent, except as described
        below:
      </Typography>
      <Box component="ul" sx={{ ml: 3, mb: 2 }}>
        <Typography component="li" variant="body1">
          <Typography component="span" sx={{ fontWeight: "bold" }}>
            Service Providers:
          </Typography>{" "}
          We may share your information with third-party service providers who
          perform services on our behalf, such as website hosting, data
          analysis, email delivery, and marketing assistance. These service
          providers are obligated to protect your information and use it only
          for the purposes for which it was disclosed.
        </Typography>
        <Typography component="li" variant="body1">
          <Typography component="span" sx={{ fontWeight: "bold" }}>
            Legal Requirements:
          </Typography>{" "}
          We may disclose your information if required to do so by law or in
          response to valid requests by public authorities (e.g., a court order
          or government agency).
        </Typography>
        <Typography component="li" variant="body1">
          <Typography component="span" sx={{ fontWeight: "bold" }}>
            Business Transfers:
          </Typography>{" "}
          In the event of a merger, acquisition, or sale of all or a portion of
          our assets, your information may be transferred to the acquiring
          entity.
        </Typography>
      </Box>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "medium", color: "#09123a" }}
      >
        5. Data Security
      </Typography>
      <Typography variant="body1" paragraph>
        We implement reasonable security measures to protect your information
        from unauthorized access, alteration, disclosure, or destruction.
        However, no method of transmission over the Internet or electronic
        storage is 100% secure, and we cannot guarantee absolute security.
      </Typography>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "medium", color: "#09123a" }}
      >
        6. Third-Party Websites
      </Typography>
      <Typography variant="body1" paragraph>
        Our website may contain links to third-party websites. This Privacy
        Policy does not apply to the practices of third-party websites that we
        do not own or control. We encourage you to review the privacy policies
        of any third-party websites you visit.
      </Typography>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "medium", color: "#09123a" }}
      >
        7. Cookies and Tracking Technologies
      </Typography>
      <Typography variant="body1" paragraph>
        We use cookies and similar tracking technologies to track the activity
        on our website and hold certain information. Cookies are files with a
        small amount of data that are stored on your device. You can instruct
        your browser to refuse all cookies or to indicate when a cookie is being
        sent. However, if you do not accept cookies, you may not be able to use
        some portions of our service.
      </Typography>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "medium", color: "#09123a" }}
      >
        8. Children's Privacy
      </Typography>
      <Typography variant="body1" paragraph>
        Our website is not intended for children under the age of 13. We do not
        knowingly collect personally identifiable information from children
        under 13. If we become aware that we have collected personal data from
        children without verification of parental consent, we take steps to
        remove that information from our servers.
      </Typography>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "medium", color: "#09123a" }}
      >
        9. Your Choices
      </Typography>
      <Box component="ul" sx={{ ml: 3, mb: 2 }}>
        <Typography component="li" variant="body1">
          <Typography component="span" sx={{ fontWeight: "bold" }}>
            Opt-Out:
          </Typography>{" "}
          You can opt-out of receiving promotional communications from us by
          following the unsubscribe link in those communications.
        </Typography>
        <Typography component="li" variant="body1">
          <Typography component="span" sx={{ fontWeight: "bold" }}>
            Cookies:
          </Typography>{" "}
          You can manage your cookie preferences through your browser settings.
        </Typography>
      </Box>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "medium", color: "#09123a" }}
      >
        10. Changes to This Privacy Policy
      </Typography>
      <Typography variant="body1" paragraph>
        We may update our Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on this page and
        updating the "Effective Date" at the top of this Privacy Policy. You are
        advised to review this Privacy Policy periodically for any changes.
      </Typography>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "medium", color: "#09123a" }}
      >
        11. Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        If you have any questions about this Privacy Policy, please contact us
        at:
      </Typography>
      <Typography variant="body1" paragraph>
        Email: support@kivyx.com
      </Typography>
      <Typography variant="body1" paragraph>
        Website: https://toolshub.kivyx.com/
      </Typography>
    </Stack>
  );
}
