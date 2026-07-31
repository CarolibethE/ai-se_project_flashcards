const colorMap = {
  green: "#64d583",
  blue: "#91a8f9",
  orange: "#ee955e",
  pink: "#ee92d7",
  purple: "#aa8ef0",
  yellow: "#f5d770",
  default: "#64d583",
};
 
 
 
/**
 * Convert a named color to its hex value.
 *
 * @param {string} colorName - The named color key.
 * @returns {string} The hex color value.
 */
function stringToHex(colorName) {
  const color = colorMap[colorName];
 
  return color || colorMap.default;
}
 
 
/**
 * Convert a hex color value to its named color key.
 *
 * @param {string} hexValue - The hex color string.
 * @returns {string|null} The named color key or null if not found.
 */
function hexToString(hexValue) {
  const colorString = Object.keys(colorMap).find((key) => {
    return colorMap[key] === hexValue;
  });
 
  return colorString || null;
}
 
 
/**
 * Remove any color-related utility classes from an element.
 *
 * @param {HTMLElement} element - The element to clean.
 * @returns {void}
 */
function removeColorClasses(element) {
  [...element.classList].forEach((cls) => {
    if (cls.includes("_color_")) {
      element.classList.remove(cls);
    }
  });
}
 
export { stringToHex, hexToString, removeColorClasses };