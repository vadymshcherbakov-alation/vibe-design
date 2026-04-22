<!--
BASE COMPONENT TEMPLATE — v2

Sections:
  1. Classification
  2. Purpose
  3. When to use / When not to use
  4. Contract            (Guarantees / Prohibitions / Conditions — moved above Variants)
  5. Variants
  6. Anatomy
  7. States
  10. UX Copy            (optional but encouraged)
  11. Example

Dropped from v1: Accessibility (§7 → absorbed into Contract), Decision Tree, Related.
Contract is now §4 so readers see the prohibitions before the variant menu.

Authoring rules:
  - §1 Classification format is fixed — Type, MUI base, Figma, Code — each
    with a visible Name plus a clickable link where one exists.
  - No meta-commentary.
-->

---
name: {{kebab-case-name}}
title: {{Display Name}}
category: base-component
last_updated: YYYY-MM-DD

description: >
  {{One sentence: what it is + when to use + when NOT to use.}}
tags: [{{tag}}, {{tag}}]

figma_url: {{https://... or empty}}
code_reference: {{package/path/within/package.ts}}
example_path: ./Example.tsx

mui_base: {{MuiComponentName}}
depends_on_tokens: [{{token.path}}]
depends_on_components: []
---

# {{Title}}

## 1. Classification

- **Type:** Base component
- **MUI base:** `{{MuiExportName}}`
- **Figma:** {{Display name · Library · Version}} — [Link]({{figma_url}})
- **Code:** `{{package-name}}` — `{{path/within/package.ts}}`

## 2. Purpose

{{One-sentence narrative definition.}}

## 3. When to use / When not to use

**Use when**
- {{Situation 1}}
- {{Situation 2}}

**Do not use when**
- {{Misuse 1 → use {{alternative}} instead}}
- {{Misuse 2 → use {{alternative}} instead}}

## 4. Contract

### Guarantees
- {{Always renders an accessible name.}}
- {{Always uses theme tokens for colour / radius / spacing.}}
- {{Focus ring is always visible on keyboard focus.}}

### Prohibitions
- {{No hard-coded hex / px / font values.}}
- {{No `sx` overrides of colour / radius — use the named-style system (§5).}}
- {{No forbidden `color` values — e.g. `color="secondary"` where morpheus has no style.}}
- {{Nothing outside the Variants list (§5) is valid.}}

### Conditions
- {{Icon-only form requires `aria-label`.}}
- {{Loading state must disable activation.}}
- {{Destructive commits require a ConfirmDialog wrapper — the component itself is correct; the dialog is the guardrail.}}

## 5. Variants

Exhaustive. Nothing outside the named-styles list is valid.

For multi-axis components (`variant` × `color` × `size`), start with a **Named styles** table
(§5.1) as the source of truth, then expose the underlying props as secondary axis tables
(§5.2–§5.N). For single-axis components, use one table.

### 5.1 Named styles

| Named style | Use for | MUI props | Example |
|---|---|---|---|
| **{{Primary}}** | {{…}} | {{`variant="…"` + `color="…"`}} | "{{…}}" |

### 5.2 `variant` prop

| Variant | Role |
|---|---|
| {{…}} | {{…}} |

### 5.3 `color` prop

| Colour | Role | Notes |
|---|---|---|
| {{…}} | {{…}} | {{…}} |
| ~~{{forbidden}}~~ | ❌ Do not use. {{Reason}} | — |

### 5.4 `size` prop

| Size | Use |
|---|---|
| {{…}} | {{…}} |

## 6. Anatomy

- {{Container}} — {{role}}
- {{Label}} — {{role}}
- {{Icon (optional)}} — {{role}}

## 7. States

| State | Trigger | Visual | Notes |
|---|---|---|---|
| Default | Idle | {{…}} | {{…}} |
| Hover | Pointer over | {{…}} | {{…}} |
| Focus-visible | Keyboard focus | {{focus ring token}} | Required |
| Active / Pressed | Pointer down / Space / Enter | {{…}} | {{…}} |
| Disabled | `disabled` prop | {{…}} | Contrast waiver applies |
| Loading | Async in flight | {{…}} | {{…}} |
| Error | Validation failure | {{…}} | {{…}} |

## 10. UX Copy

| Element | Rule | Example |
|---|---|---|
| Label | Sentence case; verb-first; ≤ 3 words | "Save changes" |
| Disabled reason | Short tooltip on hover/focus | "Complete all required fields" |

## 11. Example

```tsx
<{{Component}} variant="{{primary}}" onClick={{handler}}>
  {{Label}}
</{{Component}}>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
