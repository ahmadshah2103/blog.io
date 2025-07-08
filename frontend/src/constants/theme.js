// src/constants/theme.js
import { brandColors } from "./colors";
import { createTheme } from "@mantine/core";

export const theme = createTheme({
  colorScheme: "light",
  primaryColor: "brand",
  colors: {
    secondary: [brandColors.secondary],
    primaryText: [brandColors.primaryText],
    secondaryText: [brandColors.secondaryText],
    darkText: [brandColors.darkText],
    brand: [
      "#E6E8F0", // Lightest shade (50)
      "#CCD1E0", // 100
      "#B3B9D1", // 200
      "#99A2C1", // 300
      "#808BB2", // 400
      "#6674A3", // 500
      "#4D5D93", // 600
      "#334684", // 700
      "#1A2F75", // 800
      "#0F172B", // 900
    ],
  },
  primaryShade: 9,
  fontFamily: '"Inter", sans-serif',
  defaultRadius: "md",
  transitions: {
    fast: "0.18s cubic-bezier(.4,0,.2,1)",
    medium: "0.3s cubic-bezier(.4,0,.2,1)",
    slow: "0.5s cubic-bezier(.4,0,.2,1)",
  },
});
