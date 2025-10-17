import React from "react";

export default function YoutubeFooterIcon({ color = "white" }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="47"
        height="47"
        rx="23.5"
        stroke="white"
        strokeOpacity="0.08"
      />
      <path
        d="M29 16H19C16 16 14 18 14 21V27C14 30 16 32 19 32H29C32 32 34 30 34 27V21C34 18 32 16 29 16ZM25.89 25.03L23.42 26.51C22.42 27.11 21.6 26.65 21.6 25.48V22.51C21.6 21.34 22.42 20.88 23.42 21.48L25.89 22.96C26.84 23.54 26.84 24.46 25.89 25.03Z"
        fill={color}
      />
    </svg>
  );
}
