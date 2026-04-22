# Vibe-Design

A prototyping workspace for Alation UI. Use this project to sketch, iterate, and demo new pages and flows using the real Alation design system — same components, same tokens, same theme as production.

## Stack

Turborepo + pnpm monorepo. Apps under `apps/`, shared packages under `packages/` (theme, UI components, icons, types). React 19 + TypeScript + MUI 7 (Alation theme) + Inter / JetBrains Mono.

## Running locally

```bash
pnpm install
pnpm dev
```

Dev ports:

| App | Port |
|-----|------|
| `alation-base-ui` (Next.js) | http://localhost:4200 |
| `ai-doc` (Next.js) | http://localhost:4201 |
| `alation-ai-components` (Vite) | http://localhost:4202 |
| `design-bridge` (Next.js) | http://localhost:4203 |

Scoped runs: `pnpm --filter alation-base-ui dev`.

## Generating UI with Claude

This project uses the Alation design system skill for all UI generation. For any prompt that asks to create, modify, or prototype UI — a page, a screen, a component, a flow — follow the skill first. It handles components, tokens, typography, spacing, and the full design-system rulebook via a redirection table: the right reference file for every design intent.

@alation-design-system/CLAUDE.md

Do not invent components or tokens outside the skill's references. If the skill flags a missing reference, surface it and stop — do not improvise.

## Architecture overview

### `apps/alation-base-ui`

The primary Next.js 16 App Router shell. All routes live under `app/app/` (nested `app` is intentional — it represents the authenticated app shell). Sections include studio (agents, tools, flows, models, MCP, logs, settings), compose, analytics, governance, data quality, marketplace, add-ons, and cde-hub. The root layout wraps everything with `ThemeProvider` and `AlationLayout` from `@repo/ui`.

### `packages/ui`

Shared component library imported as `@repo/ui`. Two key areas:

- **Theme system** (`src/theme/`): `ThemeProvider` extends MUI's theme with custom `tokens`. A 12-family × 9-shade palette plus semantic tokens for border, background, text, and icon across default/hover/disabled/focused/error/warning/success states. 37+ component overrides in `componentOverrides/`. Access via `theme.tokens.color.text.primary`, `theme.tokens.palette.neutral[800]`.
- **Common layout** (`src/common/`): `AlationLayout` provides the full-viewport shell (sidebar, header, sub-nav, content area).

### Other apps

- `ai-doc` — documentation with Fumadocs
- `alation-ai-components` — AI component prototypes (Vite + Tailwind)
- `design-bridge` — bridge/demo app

### Key dependencies

MUI 7, Zustand 5, TanStack Table 8, Recharts 3, Lexical, React Markdown. Prefer MUI components and `sx` prop over custom CSS.

## Conventions

- Always consult the design system skill before producing UI.
- Use MUI components only; no raw HTML elements for UI structure.
- No visual `sx` overrides on MUI components — layout `sx` on `<Box>` only.
- All text uses `<Typography variant="…">`.
- Sentence case for UI text (exceptions: product / module proper names).
- `lucide-react` for UI icons; Alation SVG assets for nav rail only.

There are no tests in this codebase.
