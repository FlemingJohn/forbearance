type ColorTriplet = [number, number, number];

const deepTeal: ColorTriplet = [
  0.011764705882352941, 0.10980392156862745, 0.14901960784313725,
];
const oceanBlue: ColorTriplet = [
  0.10588235294117647, 0.4235294117647059, 0.6588235294117647,
];
const brightCyan: ColorTriplet = [
  0.35294117647058826, 0.8235294117647058, 0.9568627450980393,
];
const iceWhite: ColorTriplet = [
  0.9176470588235294, 0.9764705882352941, 1,
];

export const SHADER_UNIFORMS = {
  colors: [
    deepTeal,
    oceanBlue,
    brightCyan,
    iceWhite,
    iceWhite,
    iceWhite,
    iceWhite,
    iceWhite,
  ] as ColorTriplet[],
  colorCount: 4,
  scale: 1.3,
  intensity: 0.56,
  paramA: 0.67,
  warp: 0.192,
  detail: 2.016,
  contrast: 1.167,
  brightness: 0,
  saturation: 1,
  hue: 0,
  vignette: 0.15,
  blur: 0.0072,
  grain: 0.098,
  seed: 5069,
  rotate: 2.7227,
  offsetX: 0.09,
  offsetY: 0.15,
  drift: 0.148,
  oklab: 0,
  timeScale: -1.373,
};
