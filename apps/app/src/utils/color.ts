import chroma from "chroma-js";

const contrastThreshold = 4.5; // Minimum recommended contrast ratio

export function getContrastColor(background: string) {
  const contrastColor = chroma.contrast(background, "#fff") >= contrastThreshold ? "#fff" : "#000";
  return contrastColor;
}

export function lightenColor(color: string) {
  const chromaColor = chroma(color);
  const lightenedColor = chromaColor.brighten(0.5);
  return lightenedColor.hex();
}

export function getColorMode(hexColor: string) {
  // Convert the hex color to a Chroma.js color object
  const color = chroma(hexColor);

  // Get the contrast ratio between the color and white (light mode)
  const lightContrast = chroma.contrast(color, "white");

  // Get the contrast ratio between the color and black (dark mode)
  const darkContrast = chroma.contrast(color, "black");

  // Determine whether the color is suitable for light or dark mode
  if (lightContrast >= 4.5) {
    return "dark";
  } else if (darkContrast >= 4.5) {
    return "light";
  } else {
    return "dark";
  }
}
