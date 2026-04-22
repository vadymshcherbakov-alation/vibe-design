import { designTokens } from "./index";

type TokenValue = string | number;

/**
 * Recursively flattens a nested object into CSS variable names
 * Example: { color: { border: { default: "#000" } } }
 * becomes: { "--color-border-default": "#000" }
 */
function flattenTokens(
  obj: Record<string, any>,
  prefix = "",
  result: Record<string, TokenValue> = {}
): Record<string, TokenValue> {
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}-${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Check if it's a nested object with numeric keys (like palette colors)
      const hasNumericKeys = Object.keys(value).some((k) => !isNaN(Number(k)));

      if (hasNumericKeys) {
        // For objects with numeric keys (like palette.blue[100]), create individual variables
        for (const subKey in value) {
          const subValue = value[subKey];
          if (typeof subValue === "string" || typeof subValue === "number") {
            result[`--${newKey}-${subKey}`] = subValue;
          }
        }
      } else {
        // Recursively flatten nested objects
        flattenTokens(value, newKey, result);
      }
    } else if (typeof value === "string" || typeof value === "number") {
      result[`--${newKey}`] = value;
    }
  }
  return result;
}

/**
 * Gets all CSS variables as a flat object for programmatic access
 */
export function getCSSVariables(): Record<string, TokenValue> {
  return flattenTokens(designTokens);
}

/**
 * Injects CSS variables into the document at runtime
 */
export function injectCSSVariables(): void {
  if (typeof document === "undefined") return;

  const variables = getCSSVariables();
  const styleId = "design-tokens-css-variables";

  // Remove existing style element if it exists
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create style element
  const style = document.createElement("style");
  style.id = styleId;

  // Generate CSS variables
  const cssText = Object.entries(variables)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case for CSS variable names
      const cssKey = key
        .replace(/^--/, "") // Remove leading -- if present
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase();
      // Handle numeric values - add 'px' for spacing/size/radius, keep numbers for others
      const cssValue =
        typeof value === "number" &&
        (key.includes("spacing") ||
          key.includes("size") ||
          key.includes("radius"))
          ? `${value}px`
          : value;
      return `  --${cssKey}: ${cssValue};`;
    })
    .join("\n");

  style.textContent = `:root {\n${cssText}\n}`;

  // Inject into document head
  document.head.appendChild(style);
}




