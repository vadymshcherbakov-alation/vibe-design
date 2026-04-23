# Vibe-Design

A prototyping workspace for Alation UI. Sketch, iterate, and demo new pages and flows using the real Alation design system — same components, same tokens, same theme as production.

Every UI generated in this project is routed through the Alation design system skill at `.claude/skills/alation-design/`, so prototypes stay on-brand and in-spec by default.

## Getting started

**Prerequisites:** Node.js 18+, pnpm 9+ (or use `npx pnpm@9`).

```sh
git clone git@github.com:vadymshcherbakov-alation/vibe-design.git
cd vibe-design
pnpm install
pnpm --filter alation-base-ui dev
```

Open `http://localhost:4200`.

## Project structure

pnpm workspace.

```
apps/
  alation-base-ui/        # Next.js 16 — the only prototype app

packages/
  ui/                     # Shared component library (@repo/ui) — theme + prototype layout
  fabric-theme-morpheus/  # Alation theme (MUI overrides, tokens)
  fabric-types/           # Shared type definitions
  icons-neo/              # Icon library
  eslint-config/          # Shared ESLint config
  typescript-config/      # Shared TypeScript config

.claude/
  skills/alation-design/  # Design system skill + reference docs (synced from the canonical alation-design-system repo)
```

### `alation-base-ui`

The primary shell. All routes live under `app/app/` (the nested `app` is intentional — it represents the authenticated product). New prototypes typically land under `app/app/<section>/`.

### `packages/ui`

Shared component library imported as `@repo/ui`. Two key areas:

- **Theme** (`src/theme/`): `ThemeProvider` wraps MUI with Alation tokens — a 12-family × 9-shade palette plus semantic tokens for border, background, text, and icon across all interactive states. Access via `theme.tokens.color.text.primary`, `theme.tokens.palette.neutral[800]`, etc.
- **Common layout** (`src/common/`): `AlationLayout` provides the full shell (sidebar, header, sub-nav, content area). Everything here is **prototype-only scaffolding** — not production components.

### `.claude/skills/alation-design/`

The Alation design system skill — foundations, base components, composite components, patterns, and page templates — synced from the canonical `alation-design-system` repo. When a reference changes there, re-sync the `references/` tree into this folder.

## Generating UI with Claude

Open the project in Claude Code or Cursor and describe what you want to build. The Alation design system skill intercepts every UI request, redirects to the right reference file (button, table, dialog, form field, page header, and so on), applies tokens from the foundations (colour, typography, spacing, layout, shape, iconography), and flags anything that falls outside the documented design system.

Example prompts that work well:

- "Build a page where data stewards can review and triage incoming data-quality issues."
- "Design a modal for confirming a destructive data source deletion."
- "Compose a settings page with a form on the left and a live preview on the right."

The skill guarantees:

- Only MUI components documented in the reference tree — no invented components.
- Only named styles (e.g., Button Primary, Button Destructive) — no ad-hoc variants.
- Only tokens from the foundations — no hardcoded colours, spacing, or typography.
- Prohibitions and conditions from each component's Contract Block are honoured.

When a request needs something the design system doesn't cover yet, the skill flags it rather than improvising.

## Creating a new prototype

Add a new page under `apps/alation-base-ui/app/app/<your-section>/page.tsx`, wire it into the sub-nav if needed, and import from `@repo/ui`:

```tsx
import { Box, Typography } from "@mui/material";
import { Button } from "@repo/ui";
```

## Scripts

```sh
pnpm dev            # Start all apps in development mode
pnpm build          # Build all apps and packages
pnpm lint           # Lint everything
pnpm check-types    # TypeScript type-check
pnpm format         # Prettier across .ts, .tsx, .md
```

## Conventions

- MUI components only — no raw HTML for UI structure.
- All text uses `<Typography variant="…">`.
- Layout `sx` on `<Box>` only; no visual `sx` overrides on components.
- `lucide-react` for UI icons; Alation SVG assets for the nav rail only.
- Sentence case for UI text, except product / module proper names.

These are enforced by the design system skill on every UI generation.
