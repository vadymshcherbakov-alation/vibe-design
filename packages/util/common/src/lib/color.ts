import chroma from 'chroma-js';

export function getContrastScore(backgroundColor: string, accentColor: string): number {
  return chroma.contrast(backgroundColor, accentColor);
}

/**
 * Check if the contrast between two colors passes the WCAG AA standard.
 * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
 * 1.4.3 Contrast (Minimum): The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for the following: (Level AA)
 *
 * Large Text: Large-scale text and images of large-scale text have a contrast ratio of at least 3:1;
 *
 * Incidental: Text or images of text that are part of an inactive user interface component, that are pure decoration, that are not visible to anyone, or that are part of a picture that contains significant other visual content, have no contrast requirement.
 *
 * Logotypes: Text that is part of a logo or brand name has no minimum contrast requirement.
 *
 * 1.4.4 Resize text: Except for captions and images of text, text can be resized without assistive technology up to 200 percent without loss of content or functionality. (Level AA)
 *
 * 1.4.5 Images of Text: If the technologies being used can achieve the visual presentation, text is used to convey information rather than images of text except for the following: (Level AA)
 *
 * Customizable: The image of text can be visually customized to the user's requirements;
 *
 * Essential: A particular presentation of text is essential to the information being conveyed.
 *
 * Note: Logotypes (text that is part of a logo or brand name) are considered essential.
 * @param backgroundColor
 * @param accentColor
 */
export function isContrastWcagAaCompliant(backgroundColor: string, accentColor: string): boolean {
  return getContrastScore(backgroundColor, accentColor) >= 4.5;
}
export function isContrastWcagAaLargeTextCompliant(backgroundColor: string, accentColor: string): boolean {
  return getContrastScore(backgroundColor, accentColor) >= 3;
}

/**
 * Check if the contrast between two colors passes the WCAG AAA standard.
 * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
 * 1.4.6 Contrast (Enhanced): The visual presentation of text and images of text has a contrast ratio of at least 7:1, except for the following: (Level AAA)
 *
 * Large Text: Large-scale text and images of large-scale text have a contrast ratio of at least 4.5:1;
 *
 * Incidental: Text or images of text that are part of an inactive user interface component, that are pure decoration, that are not visible to anyone, or that are part of a picture that contains significant other visual content, have no contrast requirement.
 *
 * Logotypes: Text that is part of a logo or brand name has no minimum contrast requirement.
 *
 * @param backgroundColor
 * @param accentColor
 */
export function isContrastWcagAaaCompliant(backgroundColor: string, accentColor: string): boolean {
  return getContrastScore(backgroundColor, accentColor) >= 7;
}
export function isContrastWcagLargeTextAaaCompliant(backgroundColor: string, accentColor: string): boolean {
  return getContrastScore(backgroundColor, accentColor) >= 4.5;
}

export function isLightColor(hexColor: string): boolean {
  return chroma(hexColor).luminance() > 0.4;
}

/**
 * Get the shell drawer color from hex code, if the color is light subtract 5 from the colors lightness at 80% saturation
 * If it is a dark color use hsl and add lightness of 5 at 80% saturation
 */
export function getShellDrawerColor(primaryHexColor: string): string {
  const color = chroma(primaryHexColor);
  const [hue, saturation, lightness] = color.hsl();
  return chroma.hsl(hue, saturation * 0.8, color.luminance() > 0.5 ? lightness - 0.05 : lightness + 0.05).hex();
}

/**
 * Get the shell app bar color from hex code, convert to hsl and set lightness to 0.15
 * @param primaryHexColor
 */
export function getShellPageGutterColor(primaryHexColor: string): string {
  const color = chroma(primaryHexColor);
  const [hue, saturation] = color.hsl();
  return chroma.hsl(hue, saturation, 0.15).hex();
}

export function getShellAppBarInputColor(primaryHexColor: string): string {
  return chroma(getShellDrawerColor(primaryHexColor)).hex();
}

export function getTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
}
