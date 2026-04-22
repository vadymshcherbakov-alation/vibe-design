import { colorPalette } from "./palette";
import { layoutTokens } from "./layout";
import { semanticColorTokens } from "./semanticTokens";
import { typographyTokens } from "./typography";

export const designTokens = {
  palette: colorPalette,
  color: {
    ...semanticColorTokens.color,
  },
  radius: layoutTokens.radius,
  spacing: layoutTokens.spacing,
  size: layoutTokens.size,
  transition: layoutTokens.transition,
  shadow: layoutTokens.shadow,
  typography: typographyTokens.typography,
} as const;
