---
name: metric-card
title: Metric Card
category: composite-component
last_updated: 2026-04-21

description: >
  A stat surface showing a headline value, supporting detail, and optional progress toward a cap. Used for usage quotas, billing counters, health metrics, and any dashboard tile where the number is the point.
tags: [card, metric, stat, quota, dashboard]

figma_url: ""
code_reference: "no shared `<MetricCard>` wrapper in @alation/alation-ui — production composes `<Paper variant=\"outlined\">` + `<Typography variant=\"hero\">` + `<LinearProgress>` ad-hoc"
example_path: ./metric-card-preview.html

mui_base: Paper
depends_on_tokens:
  - palette.primary.main
  - palette.error.main
  - palette.neutral[200]
  - palette.neutral[300]
  - palette.text.secondary
  - shape.borderRadius
  - typography.subtitle1
  - typography.body2
  - typography.hero
depends_on_components:
  - Paper
  - Box
  - Typography
  - LinearProgress
  - Button
---

# Metric Card

## 1. Classification

- **Type:** Composite component — **composition pattern, not a shared wrapper**
- **MUI base:** `Paper` (via the [Card Wrapper](../base/card.md) primitive)
- **Figma:** Metric card — to be linked
- **Code:** There is **no shared `<MetricCard>` component** in `@alation/alation-ui`. Production composes `<Paper variant="outlined">` + `<Typography variant="hero">` + `<LinearProgress>` directly at the call site. This reference defines the composition contract so metric tiles across dashboards read consistently.

## 2. Purpose

A Metric card puts a single headline number front and centre — an object count, a credit balance, a quota, a health score — with just enough context around it to read without a caption. It communicates "here's where this number stands right now, and (optionally) how close to a limit." Reach for a Metric card on dashboards, billing pages, usage panels, and anywhere the user needs to scan several numbers quickly and act on the ones that need attention.

## 3. When to use / When not to use

**Use when**
- A dashboard or panel shows several measured quantities and each deserves its own surface.
- The number has a cap or target and a progress bar adds information (quotas, billing credits, adoption %).
- A threshold matters — the card should shift to an error state when the number crosses a critical line.

**Do not use when**
- The number is a one-off inline stat → use a plain `<Typography variant="hero">` in a `<Paper>` or inline in flowing content.
- The surface is a clickable entity tile → use [Nav Card](./nav-card.md).
- The data is a list or comparison across time → use a chart (not yet documented).

## 4. Contract

### Guarantees
- Headline value uses `<Typography variant="hero">` — no `h1`, no `h4`, no `sx` font overrides.
- Every supporting Typography node uses a theme variant (`subtitle1`, `body2`).
- Shell uses `<Paper variant="outlined">` at `borderRadius: 2`, `p: 2`, with a vertical flex layout at `gap: 1.5`.
- Progress bar height, radius, and track colour are theme-consistent across every Metric card.

### Prohibitions
- Never use `variant="h1"` / `"h4"` for the headline value — always `variant="hero"`.
- Never hardcode progress bar colour — use `color="primary"` or `color="error"` on `<LinearProgress>`.
- Never hardcode hex anywhere — all colour comes from `theme.palette.*`.
- Never invent a bespoke badge pill — use the [Chip](../base/chip.md) pattern (`<Chip variant="filledLight" color="…" size="xsmall" />`).
- Never put more than one primary action on a Metric card — additional actions belong behind a menu or on the page chrome.

### Conditions
- When the metric crosses a critical threshold, flip `LinearProgress color` to `"error"` **and** add a right-side stat in the value row with an `AlertTriangle` (lucide) icon + `color="error.main"`.
- When a "critical" convention is unclear, treat ≥ 95 % of cap as critical (adjustable per metric).
- When a card has an action button, use the **Grey outlined** named style (`variant="outlined"` + `color="inherit"`) at `size="small"` — secondary ceremony, not primary.
- When the card contains a destructive action, the destructive Button must follow the [Button](../base/button.md) destructive contract (ConfirmDialog required for irreversible actions).

## 5. Anatomy

```
┌─────────────────────────────────────────┐
│  Metric title              [badge]      │
│                                         │
│  21,265,450                    85%      │
│  of 25,000,000 objects                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░    │
│  3,734,550 remaining                    │
│  [View breakdown]                       │
└─────────────────────────────────────────┘
```

- **Title row** — `subtitle1` title + optional right-aligned [Chip](../base/chip.md) (e.g. `<Chip label="This quarter" variant="outlined" size="xsmall" />`).
- **Value row** — `hero` value on the left + `body2` subtitle below + optional right-aligned stat (percent, status).
- **Progress bar** — `LinearProgress` at `color="primary"` (or `"error"` when critical).
- **Remaining line** — `body2`, `text.secondary`, one line describing what's left (e.g. "3,734,550 remaining").
- **Action** *(optional)* — Grey outlined small Button (e.g. "View breakdown").

## 6. Custom

### Shell rule

```tsx
<Paper
  variant="outlined"
  sx={{ p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}
>
  {/* ... */}
</Paper>
```

### Title row

```tsx
<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <Typography variant="subtitle1">{title}</Typography>
  {badge && <Chip label={badge} variant="outlined" size="xsmall" />}
</Box>
```

### Value row

Large headline value uses `variant="hero"`. For critical thresholds, mount a right-side stat with `AlertTriangle` + `color="error.main"`:

```tsx
<Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
  <Box>
    <Typography variant="hero">{value}</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>
  </Box>
  {isCritical ? (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
      <AlertTriangle size={14} color={theme.palette.error.main} />
      <Typography variant="subtitle1" color="error.main">{percent}%</Typography>
    </Box>
  ) : (
    <Typography variant="subtitle1" sx={{ mt: 0.25 }}>{percent}%</Typography>
  )}
</Box>
```

### Progress bar

```tsx
<LinearProgress
  variant="determinate"
  value={85}
  color={isCritical ? 'error' : 'primary'}
  sx={{ height: 6, borderRadius: 4, bgcolor: theme.palette.neutral[200] }}
/>
```

### Remaining line

```tsx
<Typography variant="body2" color="text.secondary">{remainingLabel}</Typography>
```

### Action

```tsx
<Button variant="outlined" color="inherit" size="small">View breakdown</Button>
```

## 7. Mock data content

Placeholder — fill with Alation-domain metrics when this composite is used in a pilot. Candidates:
- **Catalog objects** — "21,265,450 of 25,000,000 objects" (85 %, normal).
- **Query credits** — "960,000 of 1,000,000 credits" (96 %, critical).
- **Active agents** — "12 of 25 seats" (48 %, normal).
- **Catalog adoption** — "34 % of business units onboarded" (no cap).

## 11. Example

```tsx
<Paper
  variant="outlined"
  sx={{ p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}
>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Typography variant="subtitle1">Catalog objects</Typography>
    <Chip label="This quarter" variant="outlined" size="xsmall" />
  </Box>

  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
    <Box>
      <Typography variant="hero">21,265,450</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        of 25,000,000 objects
      </Typography>
    </Box>
    <Typography variant="subtitle1" sx={{ mt: 0.25 }}>85%</Typography>
  </Box>

  <LinearProgress
    variant="determinate"
    value={85}
    color="primary"
    sx={{ height: 6, borderRadius: 4, bgcolor: theme.palette.neutral[200] }}
  />
  <Typography variant="body2" color="text.secondary">3,734,550 remaining</Typography>

  <Button variant="outlined" color="inherit" size="small">View breakdown</Button>
</Paper>
```

See [`metric-card-preview.html`](./metric-card-preview.html) for a static visual preview.
