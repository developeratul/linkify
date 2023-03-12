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
