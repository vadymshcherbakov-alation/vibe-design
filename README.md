# Vibe-Design

A prototyping workspace for Alation UI. Sketch, iterate, and demo new pages and flows using the real Alation design system — same components, same tokens, same theme as production.

Every UI generated in this project is routed through the Alation design system skill, so prototypes stay on-brand and in-spec by default.

## Getting started

**Prerequisites:** Node.js 18+, pnpm 9+ (or use `npx pnpm@9`).

```sh
git clone git@github.com:vadymshcherbakov-alation/vibe-design.git
cd vibe-design
pnpm install
pnpm dev
```

All apps boot in parallel. Open whichever one you're working on:

| App | URL | Stack |
|-----|-----|-------|
| `alation-base-ui` | http://localhost:4200 | Next.js 16 — main app shell, most prototyping happens here |
| `ai-doc` | http://localhost:4201 | Next.js 16 — documentation (Fumadocs) |
| `alation-ai-components` | http://localhost:4202 | Vite + Tailwind — AI component prototypes |
| `design-bridge` | http://localhost:4203 | Next.js 16 — bridge / demo app |

Run a single app: `pnpm --filter alation-base-ui dev`.

## Project structure

Monorepo managed by [Turborepo](https://turborepo.dev/) and [pnpm workspaces](https://pnpm.io/workspaces).

```
apps/
  alation-base-ui/        # Core shell — start here for most work
  ai-doc/                 # Fumadocs documentation site
  alation-ai-components/  # AI component sandbox (Vite)
  design-bridge/          # Bridge / demo app

packages/
  ui/                     # Shared component library (@repo/ui)
  ai-ui/                  # Shared AI UI utilities
  fabric-theme-morpheus/  # Alation theme (MUI overrides, tokens)
  fabric-types/           # Shared type definitions
  icons-neo/              # Icon library
  util/                   # Utilities
  eslint-config/          # Shared ESLint config
  typescript-config/      # Shared TypeScript config

alation-design-system/    # Design system skill + reference docs
```

### `alation-base-ui`

The primary shell. All routes live under `app/app/` (the nested `app` is intentional — it represents the authenticated product). Studio, compose, analytics, governance, data quality, marketplace, add-ons, and cde-hub sections are all here. New prototypes typically land under `app/app/<section>/`.

### `packages/ui`

Shared component library imported as `@repo/ui`. Two key areas:

- **Theme** (`src/theme/`): `ThemeProvider` wraps MUI with Alation tokens — a 12-family × 9-shade palette plus semantic tokens for border, background, text, and icon across all interactive states. Access via `theme.tokens.color.text.primary`, `theme.tokens.palette.neutral[800]`, etc.
- **Common layout** (`src/common/`): `AlationLayout` provides the full shell (sidebar, header, sub-nav, content area).

### `alation-design-system/`

The canonical Alation design system — foundations, base components, composite components, patterns, and page templates — along with the Claude skill that enforces them. Browse it locally by opening `alation-design-system/index.html`, or see the live version at [alation-design-system](https://github.com/vadymshcherbakov-alation/alation-design-system).

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

If you need a fresh playground app instead, create it under `apps/`:

```sh
mkdir apps/my-prototype
cd apps/my-prototype
pnpm init
```

It'll be picked up by the workspace automatically. Import `@repo/ui`, `@repo/ai-ui`, or `@alation/fabric-theme-morpheus` just like the other apps do.

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
