import React from "react";
import { Box } from "@mui/material";

export default function Frame1({
  children,
  qrCodeSize, // NEW PROP: Pass the desired QR code size
  frameColor = "#000000",
  textColor = "#FFFFFF",
}) {
  // Original intrinsic viewBox dimensions (constant from your SVG)
  const intrinsicViewBoxWidth = 279.1;
  const intrinsicViewBoxHeight = 346.6;

  // Original QR code cutout area dimensions and position within the intrinsic viewBox (constant)
  const originalQrCodeX = 10.6;
  const originalQrCodeY = 17.9;
  const originalQrCodeWidth = 243.2; // This is the width of the cutout in the original SVG
  const originalQrCodeHeight = 243.3; // This is the height of the cutout in the original SVG

  // Calculate fixed pixel padding based on the original SVG design.
  // These are the "frame thickness" values on each side, relative to the intrinsic SVG.
  // We need to maintain these ratios as the QR code scales.
  const fixedLeftPadding = originalQrCodeX;
  const fixedTopPadding = originalQrCodeY;
  const fixedRightPadding =
    intrinsicViewBoxWidth - (originalQrCodeX + originalQrCodeWidth);
  const fixedBottomPadding =
    intrinsicViewBoxHeight - (originalQrCodeY + originalQrCodeHeight);

  // Calculate the overall rendering dimensions of the entire frame (SVG + QR Code)
  // This is the size the Frame1 component's root Box will take.
  // The frame scales to wrap the new qrCodeSize + its fixed original padding
  const totalRenderWidth = qrCodeSize + fixedLeftPadding + fixedRightPadding;
  const totalRenderHeight = qrCodeSize + fixedTopPadding + fixedBottomPadding;

  // Calculate scaling factors for the SVG content within its new rendered size
  // This helps us convert intrinsic coordinates/offsets to rendered pixel coordinates
  const scaleX = totalRenderWidth / intrinsicViewBoxWidth;
  const scaleY = totalRenderHeight / intrinsicViewBoxHeight;

  // Calculate the scaled offsets for the QR code container
  const scaledQrCodeOffsetX = fixedLeftPadding * scaleX;
  const scaledQrCodeOffsetY = fixedTopPadding * scaleY;

  return (
    <Box
      sx={{
        position: "relative",
        // The root Box of Frame1 now directly dictates its size based on calculated totalRender,
        // so it expands to correctly wrap the QR code plus the fixed frame padding.
        width: totalRenderWidth,
        height: totalRenderHeight,
        display: "flex", // Keep display flex for centering children if needed
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden", // Ensure frame doesn't overflow
      }}
    >
      <svg
        // The SVG element itself scales to fill 100% of its parent Box (Frame1's root Box).
        // The viewBox defines the internal coordinate system, ensuring paths scale correctly.
        width="100%"
        height="100%"
        viewBox={`0 0 ${intrinsicViewBoxWidth} ${intrinsicViewBoxHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute", // Position SVG within the root Box
          top: 0,
          left: 0,
          pointerEvents: "none", // Allow clicks to pass through to QR code
          zIndex: 0, // Ensure SVG frame is behind the QR code content
          // IMPORTANT: SVG's content will scale according to width/height + viewBox
          // We need to ensure the QR code container positioning accounts for this scaling.
        }}
      >
        {/* Frame Body path */}
        <path
          id="FrameBody"
          d="M13.7,346.6h251.7c7.6,0,13.7-6.2,13.7-13.7V13.7c0-7.6-6.2-13.7-13.7-13.7H13.8C6.2,0,0.1,6.2,0,13.7
	v319.2C0,340.5,6.2,346.6,13.7,346.6z M10.6,17.9c0-4.1,3.3-7.4,7.4-7.4h243.2c4.1,0,7.4,3.3,7.4,7.4v243.3c0,4.1-3.3,7.4-7.4,7.4
	H18c-4.1,0-7.4-3.3-7.4-7.4V17.9z"
          fill={frameColor}
        />
        {/* Call To Action Text path */}
        <path
          id="CallToAction"
          d="M54.9,320.2c4.6-0.1,7-1.7,7-5c0-2.7-1.5-4.2-4.6-4.8c-1.4-0.2-3-0.4-4.7-0.7
	c-3.1-0.5-5.4-1.6-7-3.4s-2.5-4-2.5-6.6c0-3.1,1-5.6,3.1-7.5c2-1.9,4.8-2.8,8.5-2.9c4.4,0.1,8.3,1.3,11.5,3.7l-3,4.4
	c-2.7-1.8-5.6-2.7-8.8-2.7c-1.7,0-3,0.4-4.2,1.2c-1.2,0.9-1.8,2.1-1.8,3.9c0,1,0.4,2,1.2,2.8s2.1,1.4,3.8,1.8c1,0.2,2.3,0.4,4,0.6
	c3.3,0.5,5.8,1.7,7.4,3.6s2.4,4.1,2.4,6.6c-0.2,6.8-4.3,10.3-12.5,10.4c-5.3,0-9.8-1.6-13.6-4.9l3.5-4.1
	C47.6,319,51,320.2,54.9,320.2z M96.9,315.4c-0.8,3.3-2.3,5.8-4.5,7.6c-2.3,1.8-4.9,2.6-8,2.6c-2.8-0.1-5.1-0.7-7-2.1
	c-1.9-1.3-3.3-2.7-4.2-4.3c-0.3-0.5-0.5-1-0.7-1.5s-0.4-1.1-0.5-1.9c-0.2-1.4-0.4-4.2-0.4-8.3c0-4.1,0.1-6.9,0.4-8.3
	s0.7-2.5,1.2-3.4c0.9-1.6,2.2-3.1,4.2-4.4c1.9-1.3,4.2-2,7-2c3.4,0,6.2,1,8.4,3.1c2.2,2,3.5,4.5,4.1,7.5h-5.7
	c-0.4-1.4-1.2-2.7-2.4-3.7s-2.7-1.5-4.4-1.5c-1.3,0-2.4,0.3-3.3,0.8s-1.7,1.1-2.2,1.8c-0.7,0.8-1.2,1.8-1.4,3
	c-0.3,1.3-0.4,3.7-0.4,7.2s0.1,5.9,0.4,7.1c0.2,1.2,0.7,2.2,1.4,3c0.6,0.7,1.3,1.3,2.2,1.8s2,0.8,3.3,0.8c3,0,5.3-1.6,6.8-4.9
	L96.9,315.4L96.9,315.4z M119.1,317.4h-13.5l-2.7,8h-5.7l12.9-35.6h4.5l12.9,35.6h-5.7L119.1,317.4z M117.4,312.6l-5.2-15.6h-0.1
	l-5.2,15.6H117.4z M131.2,289.7h5.1l16.1,25.3h0.1v-25.3h5.4v35.6h-5.1l-16-25.3h-0.1v25.3h-5.4v-35.6H131.2z M177.4,289.7h5.1
	l10.2,23.2l10-23.2h5.1v35.6h-5.4v-22.2h-0.1l-7.4,17.1h-4.5l-7.4-17.1h0v22.2h-5.4v-35.6H177.4z M215.3,289.7H238v5.1h-17.3V305
	h14.8v4.8h-14.8v10.4H238v5.1h-22.7V289.7z"
          fill={textColor}
        />
      </svg>
      {/* This is the container for the actual QR code, positioned in pixels
          relative to the Frame1's root Box. It is given the exact qrCodeSize. */}
      <Box
        sx={{
          position: "absolute",
          top: scaledQrCodeOffsetY,
          left: scaledQrCodeOffsetX,
          width: qrCodeSize,
          height: qrCodeSize,
          zIndex: 1, // Ensure QR code is above the SVG frame
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
