import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0f0a",
        "bg-alt": "#0d140d",
        fg: "#7fff7f",
        "fg-dim": "#3d6b3d",
        "fg-bright": "#b4ffb4",
        accent: "#ff4444",
        "accent-dim": "#7a2222",
        amber: "#ffb000",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        vt: ["VT323", "monospace"],
      },
      animation: {
        blink: "blink 1.1s steps(2) infinite",
        "blink-caret": "blink-caret 0.8s step-end infinite",
      },
      keyframes: {
        blink: {
          "50%": { opacity: "0" },
        },
        "blink-caret": {
          "50%": { borderColor: "transparent" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
