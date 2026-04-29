# Vibe-Design

A prototyping workspace for Alation UI. Use this project to sketch, iterate, and demo new pages and flows using the real Alation design system — same components, same tokens, same theme as production.

## Stack

pnpm monorepo. The only prototype app is `apps/alation-base-ui`; shared packages under `packages/` (theme, UI components, icons, types). React 19 + TypeScript + MUI 7 (Alation theme) + Inter / JetBrains Mono.

## Running locally

```bash
pnpm install
pnpm --filter alation-base-ui dev
```

App runs at `http://localhost:4300` (vibe-design's reserved port — avoids clashing with `cdm-design-demo` on 3000, `design-playground` on 4100, and `alation-ui` on 4200 so all four can run simultaneously).

## Generating UI with Claude

This project uses the Alation design system skill for all UI generation. For any prompt that asks to create, modify, or prototype UI — a page, a screen, a component, a flow — follow the skill first. It handles components, tokens, typography, spacing, and the full design-system rulebook via a redirection table: the right reference file for every design intent.

@.claude/skills/alation-design/SKILL.md

Do not invent components or tokens outside the skill's references. If the skill flags a missing reference, surface it and stop — do not improvise.

## Architecture overview

### `apps/alation-base-ui`

The primary Next.js 16 App Router shell. All routes live under `app/app/` (nested `app` is intentional — it represents the authenticated app shell). Sections include studio (agents, tools, flows, models, MCP, logs, settings), compose, analytics, governance, data quality, marketplace, add-ons, and cde-hub. The root layout wraps everything with `ThemeProvider` and `AlationLayout` from `@repo/ui`.

### `packages/ui`

Shared component library imported as `@repo/ui`. Two key areas:

- **Theme system** (`src/theme/`): `ThemeProvider` extends MUI's theme with custom `tokens`. A 12-family × 9-shade palette plus semantic tokens for border, background, text, and icon across default/hover/disabled/focused/error/warning/success states. 37+ component overrides in `componentOverrides/`. Access via `theme.tokens.color.text.primary`, `theme.tokens.palette.neutral[800]`.

  **Runtime theme ↔ skill bundle protocol.** The alation-design skill ships a reference bundle at `.claude/skills/alation-design/references/theme/` with verbatim mirrors of production morpheus overrides. That folder is **reference only** — Claude reads it, the app does not import it.

  **The runtime theme this app uses is `@alation/fabric-theme-morpheus`** (workspace package at `packages/fabric-theme-morpheus/`). `apps/alation-base-ui/app/client-layout.tsx` wires `<ThemeProvider theme={fabricThemeMorpheus}>` directly from that package. The override files MUI actually evaluates live at `packages/fabric-theme-morpheus/src/lib/Mui*.overrides.{ts,tsx}` and are wired into the `components` map in `packages/fabric-theme-morpheus/src/index.ts`. **This makes vibe-design a production-shape consumer** in the skill's protocol (`references/theme/_index.md` §1, case b — vendored morpheus).

  The parallel `packages/ui/src/theme/componentOverrides/` barrel is leftover scaffolding from an earlier prototype shape and is **NOT wired to MUI in this app**. Anything mirrored into that folder is silently dead code. Always trace the `<ThemeProvider>` import to find the real destination.

  When the skill's Contract Audit flags a missing theme prerequisite, mirror that single override file from the bundle into `packages/fabric-theme-morpheus/src/lib/` AND wire it into `packages/fabric-theme-morpheus/src/index.ts`. Note morpheus sets `html { font-size: '62.5%' }` (1rem = 10px), so px values from the bundle are safest — convert to `2.4rem` if you want morpheus-style rem consistency. After wiring, **verify with computed style** in the running app (DevTools → `getComputedStyle(el).fontSize` on a rendered instance). **Don't bulk-mirror** — surgical, as-needed only.
- **Common layout** (`src/common/`): `AlationLayout` provides the full-viewport shell (sidebar, header, sub-nav, content area). These are **prototype-only scaffolding** — not production components.

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
