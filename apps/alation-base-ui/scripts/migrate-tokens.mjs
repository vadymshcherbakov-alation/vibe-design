/**
 * Codemod: replace theme.tokens.* with theme.palette.* equivalents
 * Usage: node scripts/migrate-tokens.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const APP_DIR = new URL("../app", import.meta.url).pathname;

// Ordered replacements — longest/most-specific patterns first to avoid partial matches
// Each entry is [searchString | RegExp, replacement]
const REPLACEMENTS = [
  // --- Bracket-notation keys (hyphenated) ---
  [`theme.tokens.color.background.control["secondary-hover"]`, `theme.palette.neutral[200]`],
  [`theme.tokens.color.background.button["primary-hover"]`,    `theme.palette.blue[700]`],
  [`theme.tokens.color.background.button["secondary-hover"]`,  `theme.palette.blue[100]`],
  [`theme.tokens.color.background.button["error-hover"]`,      `theme.palette.red[700]`],
  [`theme.tokens.color.background.button["error-secondary-hover"]`, `theme.palette.red[100]`],
  [`theme.tokens.color.background.chip["gray-strong"]`,        `theme.palette.neutral[600]`],
  [`theme.tokens.color.background.chip["blue-strong"]`,        `theme.palette.blue[600]`],
  [`theme.tokens.color.background.chip["red-strong"]`,         `theme.palette.red[600]`],
  [`theme.tokens.color.background.chip["amber-strong"]`,       `theme.palette.amber[600]`],
  [`theme.tokens.color.background.chip["green-strong"]`,       `theme.palette.green[600]`],
  [`theme.tokens.color.background.chip["teal-strong"]`,        `theme.palette.teal[600]`],
  [`theme.tokens.color.background.chip["purple-strong"]`,      `theme.palette.purple[600]`],
  [`theme.tokens.color.background.chip["pink-strong"]`,        `theme.palette.pink[600]`],
  [`theme.tokens.color.background.chip["orange-strong"]`,      `theme.palette.orange[600]`],
  [`theme.tokens.color.text["error-disabled"]`,                `theme.palette.red[400]`],
  [`theme.tokens.color.icon["error-disabled"]`,                `theme.palette.red[400]`],
  [`theme.tokens.color["transparent-001"]`,                    `"rgba(255, 255, 255, 0.010)"`],
  [`theme.tokens.spacing["2xl"]`,                              `"48px"`],
  [`theme.tokens.spacing["3xl"]`,                              `"64px"`],

  // --- Palette direct access (regex) ---
  [/theme\.tokens\.palette\.(\w+)\[(\d+)\]/g, (_, color, shade) => `theme.palette.${color}[${shade}]`],

  // --- Semantic text tokens (most specific first) ---
  [`theme.tokens.color.text.button.primary`,    `theme.palette.blue[600]`],
  [`theme.tokens.color.text.chip.gray`,         `theme.palette.neutral[600]`],
  [`theme.tokens.color.text.chip.blue`,         `theme.palette.blue[600]`],
  [`theme.tokens.color.text.chip.red`,          `theme.palette.red[600]`],
  [`theme.tokens.color.text.chip.amber`,        `theme.palette.amber[600]`],
  [`theme.tokens.color.text.chip.green`,        `theme.palette.green[600]`],
  [`theme.tokens.color.text.chip.teal`,         `theme.palette.teal[600]`],
  [`theme.tokens.color.text.chip.purple`,       `theme.palette.purple[600]`],
  [`theme.tokens.color.text.chip.pink`,         `theme.palette.pink[600]`],
  [`theme.tokens.color.text.chip.orange`,       `theme.palette.orange[600]`],
  [`theme.tokens.color.text.primary`,           `theme.palette.text.primary`],
  [`theme.tokens.color.text.secondary`,         `theme.palette.text.secondary`],
  [`theme.tokens.color.text.disabled`,          `theme.palette.text.disabled`],
  [`theme.tokens.color.text.warning`,           `theme.palette.warning.dark`],
  [`theme.tokens.color.text.error`,             `theme.palette.error.main`],
  [`theme.tokens.color.text.information`,       `theme.palette.info.main`],
  [`theme.tokens.color.text.success`,           `theme.palette.success.main`],
  [`theme.tokens.color.text.inverted`,          `theme.palette.neutral[50]`],

  // --- Semantic border tokens ---
  [`theme.tokens.color.border.button.primary`,        `theme.palette.blue[600]`],
  [`theme.tokens.color.border.button.focus`,          `theme.palette.blue[900]`],
  [`theme.tokens.color.border.button.error`,          `theme.palette.error.main`],
  [`theme.tokens.color.border.misc.placeholder`,      `theme.palette.pink[500]`],
  [`theme.tokens.color.border.default`,               `theme.palette.neutral[300]`],
  [`theme.tokens.color.border.hover`,                 `theme.palette.neutral[400]`],
  [`theme.tokens.color.border.disabled`,              `theme.palette.neutral[200]`],
  [`theme.tokens.color.border.focused`,               `theme.palette.primary.main`],
  [`theme.tokens.color.border.error`,                 `theme.palette.error.main`],
  [`theme.tokens.color.border.warning`,               `theme.palette.warning.dark`],
  [`theme.tokens.color.border.information`,           `theme.palette.info.main`],
  [`theme.tokens.color.border.success`,               `theme.palette.success.main`],
  [`theme.tokens.color.border.table`,                 `"rgb(240, 240, 240)"`],
  [`theme.tokens.color.border.selected`,              `theme.palette.neutral[500]`],

  // --- Semantic background tokens (most specific first) ---
  [`theme.tokens.color.background.surface.modal.backdrop`, `"rgba(39, 39, 42, 0.700)"`],
  [`theme.tokens.color.background.surface.default`,        `"#ffffff"`],
  [`theme.tokens.color.background.surface.secondary`,      `theme.palette.neutral[50]`],
  [`theme.tokens.color.background.control.default`,        `"#ffffff"`],
  [`theme.tokens.color.background.control.warning`,        `theme.palette.amber[200]`],
  [`theme.tokens.color.background.control.error`,          `theme.palette.red[200]`],
  [`theme.tokens.color.background.control.information`,    `theme.palette.blue[200]`],
  [`theme.tokens.color.background.control.success`,        `theme.palette.green[200]`],
  [`theme.tokens.color.background.control.disabled`,       `theme.palette.neutral[50]`],
  [`theme.tokens.color.background.control.hover`,          `theme.palette.neutral[100]`],
  [`theme.tokens.color.background.control.secondary`,      `theme.palette.neutral[100]`],
  [`theme.tokens.color.background.control.selected`,       `theme.palette.neutral[100]`],
  [`theme.tokens.color.background.control.inverted`,       `theme.palette.neutral[800]`],
  [`theme.tokens.color.background.scrollbar.default`,      `theme.palette.neutral[300]`],
  [`theme.tokens.color.background.scrollbar.hover`,        `theme.palette.neutral[400]`],
  [`theme.tokens.color.background.accent.gray`,            `theme.palette.neutral[200]`],
  [`theme.tokens.color.background.accent.blue`,            `theme.palette.blue[200]`],
  [`theme.tokens.color.background.accent.red`,             `theme.palette.red[200]`],
  [`theme.tokens.color.background.accent.amber`,           `theme.palette.amber[200]`],
  [`theme.tokens.color.background.accent.green`,           `theme.palette.green[200]`],
  [`theme.tokens.color.background.accent.teal`,            `theme.palette.teal[200]`],
  [`theme.tokens.color.background.accent.purple`,          `theme.palette.purple[200]`],
  [`theme.tokens.color.background.accent.pink`,            `theme.palette.pink[200]`],
  [`theme.tokens.color.background.accent.orange`,          `theme.palette.orange[200]`],
  [`theme.tokens.color.background.chip.gray`,              `theme.palette.neutral[200]`],
  [`theme.tokens.color.background.chip.blue`,              `theme.palette.blue[200]`],
  [`theme.tokens.color.background.chip.red`,               `theme.palette.red[200]`],
  [`theme.tokens.color.background.chip.amber`,             `theme.palette.amber[200]`],
  [`theme.tokens.color.background.chip.green`,             `theme.palette.green[200]`],
  [`theme.tokens.color.background.chip.teal`,              `theme.palette.teal[200]`],
  [`theme.tokens.color.background.chip.purple`,            `theme.palette.purple[200]`],
  [`theme.tokens.color.background.chip.pink`,              `theme.palette.pink[200]`],
  [`theme.tokens.color.background.chip.orange`,            `theme.palette.orange[200]`],
  [`theme.tokens.color.background.button.primary`,         `theme.palette.blue[600]`],
  [`theme.tokens.color.background.button.error`,           `theme.palette.error.main`],
  [`theme.tokens.color.background.avatar.default`,         `theme.palette.blue[600]`],
  [`theme.tokens.color.background.avatar.subtle`,          `theme.palette.neutral[300]`],
  [`theme.tokens.color.background.progress.primary`,       `theme.palette.primary.main`],
  [`theme.tokens.color.background.misc.placeholder`,       `theme.palette.pink[100]`],

  // --- Semantic icon tokens (most specific first) ---
  [`theme.tokens.color.icon.button.primary`,  `theme.palette.blue[600]`],
  [`theme.tokens.color.icon.primary`,         `theme.palette.text.primary`],
  [`theme.tokens.color.icon.secondary`,       `theme.palette.text.secondary`],
  [`theme.tokens.color.icon.disabled`,        `theme.palette.text.disabled`],
  [`theme.tokens.color.icon.information`,     `theme.palette.info.main`],
  [`theme.tokens.color.icon.success`,         `theme.palette.success.main`],
  [`theme.tokens.color.icon.error`,           `theme.palette.error.main`],
  [`theme.tokens.color.icon.warning`,         `theme.palette.warning.dark`],
  [`theme.tokens.color.icon.inverted`,        `theme.palette.neutral[50]`],

  // --- Special / literal values ---
  [`theme.tokens.color.white`,        `"#ffffff"`],
  [`theme.tokens.color.transparent`,  `"transparent"`],

  // --- Spacing ---
  [`theme.tokens.spacing.xxs`,  `"2px"`],
  [`theme.tokens.spacing.xs`,   `"4px"`],
  [`theme.tokens.spacing.sm`,   `"8px"`],
  [`theme.tokens.spacing.md`,   `"16px"`],
  [`theme.tokens.spacing.lg`,   `"24px"`],
  [`theme.tokens.spacing.xl`,   `"32px"`],

  // --- Radius ---
  [`theme.tokens.radius.xs`,     `"2px"`],
  [`theme.tokens.radius.sm`,     `"4px"`],
  [`theme.tokens.radius.md`,     `"6px"`],
  [`theme.tokens.radius.lg`,     `"12px"`],
  [`theme.tokens.radius.xlarge`, `"24px"`],
  [`theme.tokens.radius.full`,   `"999px"`],

  // --- Other ---
  [`theme.tokens.transition.fast`, `"150ms"`],
  [`theme.tokens.shadow.hover`,    `"rgba(87, 84, 91, 0.06) 0px 0px 0px 2px"`],

  // --- Typography ---
  [`theme.tokens.typography.body.base.size`,        `13`],
  [`theme.tokens.typography.body.body1.size`,        `13`],
  [`theme.tokens.typography.body.body1.weight`,      `400`],
  [`theme.tokens.typography.body.body1.lineHeight`,  `1.54`],
  [`theme.tokens.typography.body.body2.size`,        `12`],
  [`theme.tokens.typography.body.body2.weight`,      `400`],
  [`theme.tokens.typography.body.body2.lineHeight`,  `1.21`],
  [`theme.tokens.typography.heading.h1.size`,        `22`],
  [`theme.tokens.typography.heading.h1.weight`,      `600`],
  [`theme.tokens.typography.heading.h1.lineHeight`,  `1.21`],
  [`theme.tokens.typography.heading.h2.size`,        `18`],
  [`theme.tokens.typography.heading.h2.weight`,      `600`],
  [`theme.tokens.typography.heading.h2.lineHeight`,  `1.21`],
  [`theme.tokens.typography.heading.h3.size`,        `16`],
  [`theme.tokens.typography.heading.h3.weight`,      `500`],
  [`theme.tokens.typography.heading.h3.lineHeight`,  `1.21`],
  [`theme.tokens.typography.subtitle1.size`,         `14`],
  [`theme.tokens.typography.subtitle1.weight`,       `500`],
  [`theme.tokens.typography.subtitle1.lineHeight`,   `1.21`],
  [`theme.tokens.typography.subtitle2.size`,         `13`],
  [`theme.tokens.typography.subtitle2.weight`,       `500`],
  [`theme.tokens.typography.subtitle2.lineHeight`,   `1.21`],
  [`theme.tokens.typography.iconSize.xs`,            `12`],
  [`theme.tokens.typography.iconSize.sm`,            `16`],
  [`theme.tokens.typography.iconSize.md`,            `20`],
  [`theme.tokens.typography.iconSize.lg`,            `24`],
  [`theme.tokens.typography.fontFamily`,             `'"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'`],

  // --- Optional-chaining variants (?.  access) ---
  // Full optional chains (theme.tokens?.color?....)
  [`theme.tokens?.color?.background?.surface?.default`,    `"#ffffff"`],
  [`theme.tokens?.color?.background?.surface?.secondary`,  `theme.palette.neutral[50]`],
  [`theme.tokens?.color?.background?.control?.default`,    `"#ffffff"`],
  [`theme.tokens?.color?.background?.control?.secondary`,  `theme.palette.neutral[100]`],
  [`theme.tokens?.color?.background?.control?.hover`,      `theme.palette.neutral[100]`],
  [`theme.tokens?.color?.background?.control?.selected`,   `theme.palette.neutral[100]`],
  [`theme.tokens?.color?.text?.primary`,                   `theme.palette.text.primary`],
  [`theme.tokens?.color?.text?.secondary`,                 `theme.palette.text.secondary`],
  [`theme.tokens?.color?.text?.disabled`,                  `theme.palette.text.disabled`],
  [`theme.tokens?.color?.border?.default`,                 `theme.palette.neutral[300]`],
  // Partial optional chains (last segment has ?.)
  [`theme.tokens.color.background.surface?.default`,       `"#ffffff"`],
  [`theme.tokens.color.background.surface?.secondary`,     `theme.palette.neutral[50]`],
  [`theme.tokens.color.background.control?.default`,       `"#ffffff"`],
  [`theme.tokens.color.background.control?.secondary`,     `theme.palette.neutral[100]`],
  [`theme.tokens.color.background.control?.hover`,         `theme.palette.neutral[100]`],
  [`theme.tokens.color.border.button?.focus`,              `theme.palette.blue[900]`],
  [`theme.tokens.color.border.button?.primary`,            `theme.palette.blue[600]`],
  [`theme.tokens.color.border.button?.error`,              `theme.palette.error.main`],
];

function applyReplacements(content) {
  let result = content;
  for (const [search, replacement] of REPLACEMENTS) {
    if (search instanceof RegExp) {
      result = result.replace(search, replacement);
    } else {
      // Literal string — replace all occurrences
      while (result.includes(search)) {
        result = result.replace(search, replacement);
      }
    }
  }
  return result;
}

/**
 * After token replacement, some files may have `const theme = useTheme();`
 * where `theme` is no longer referenced. Remove those lines.
 */
function removeUnusedTheme(content) {
  // Only remove if theme.palette is NOT present (meaning no theme access remains)
  if (content.includes("theme.")) return content;

  // Remove `const theme = useTheme();` line
  const cleaned = content.replace(/^\s*const theme = useTheme\(\);\n/m, "");

  // Remove `useTheme` from import if it's the only import from that specifier
  // Pattern: import { useTheme } from "@mui/material/styles";
  const withoutImport = cleaned
    .replace(/^import \{ useTheme \} from "@mui\/material\/styles";\n/m, "")
    .replace(/^import \{ useTheme \} from '@mui\/material\/styles';\n/m, "")
    // Remove from combined imports like: import { Box, useTheme } from "@mui/material/styles"
    .replace(/, useTheme\b/g, "")
    .replace(/\buseTheme, /g, "");

  return withoutImport;
}

function walkDir(dir, callback) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else if ([".ts", ".tsx"].includes(extname(entry))) {
      callback(fullPath);
    }
  }
}

let filesChanged = 0;
let filesUnchanged = 0;

walkDir(APP_DIR, (filePath) => {
  const original = readFileSync(filePath, "utf8");
  if (!original.includes("theme.tokens")) {
    filesUnchanged++;
    return;
  }

  let updated = applyReplacements(original);
  updated = removeUnusedTheme(updated);

  if (updated !== original) {
    writeFileSync(filePath, updated, "utf8");
    console.log(`✓ ${filePath.replace(APP_DIR, "app")}`);
    filesChanged++;
  } else {
    filesUnchanged++;
  }
});

console.log(`\nDone: ${filesChanged} files updated, ${filesUnchanged} unchanged.`);

// Report any remaining theme.tokens references
let remaining = [];
walkDir(APP_DIR, (filePath) => {
  const content = readFileSync(filePath, "utf8");
  if (content.includes("theme.tokens")) {
    const lines = content.split("\n");
    lines.forEach((line, i) => {
      if (line.includes("theme.tokens")) {
        remaining.push(`  ${filePath.replace(APP_DIR, "app")}:${i + 1}  ${line.trim()}`);
      }
    });
  }
});

if (remaining.length > 0) {
  console.log(`\n⚠️  ${remaining.length} remaining theme.tokens reference(s) — review manually:`);
  remaining.forEach((r) => console.log(r));
} else {
  console.log("\n✅ No remaining theme.tokens references.");
}
