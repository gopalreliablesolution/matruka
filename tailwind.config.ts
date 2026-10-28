import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#078F9C",
          dark: "#066A74",
          light: "#32BDC8",
        },
        accent: {
          DEFAULT: "#F2B632",
          light: "#F7CE6E",
        },
        brand: {
          teal: {
            50: "#F0FBFB",
            100: "#EAF8F8",
            200: "#B9EBEE",
            300: "#76D4DB",
            400: "#32BDC8",
            500: "#05A6B4", // Primary teal
            600: "#078F9C", // Deep teal
            700: "#066A74",
            800: "#09535B",
            900: "#0B464D",
          },
          gold: {
            50: "#FEF9EC",
            100: "#FDF0D0",
            200: "#FBE0A2",
            300: "#F7CE6E",
            400: "#F4BD42",
            500: "#F2B632", // Warm gold
            600: "#D99B16",
            700: "#B0770D",
            800: "#8C5E11",
            900: "#744E12",
          },
          slate: {
            50: "#F6F8F9",
            100: "#EBEFF1",
            200: "#D4DEE2",
            300: "#B2C3C9",
            400: "#8AA3AD",
            500: "#637C85",
            600: "#4D636B",
            700: "#344B53", // Slate text
            800: "#27393F",
            900: "#1A272B",
          },
          aqua: "#EAF8F8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        heading: ["var(--font-poppins)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

