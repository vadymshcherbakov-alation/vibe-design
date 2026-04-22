import { baseTheme } from "./createBaseTheme";
import { componentOverrides } from "../componentOverrides";

baseTheme.components = componentOverrides as typeof baseTheme.components;

export { baseTheme };
export { injectCSSVariables } from "../tokens/generateCSSVariables";
export { ThemeProvider } from "../theme-provider";