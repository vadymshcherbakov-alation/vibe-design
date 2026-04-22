<!--
FOUNDATION TEMPLATE — v2

Sections:
  1. Classification
  2. Purpose
  3. How to use        (where it lives, codebase path, general intro)
  4. Contract          (Guarantees / Prohibitions / Conditions)
  5. Inventory         (tokens, or breakpoints/other axes for non-token foundations)
  11. Example

Dropped from v1: When/not, Token groups, Accessibility, Decision Tree, Related.
§3 and §4 replace the v1 §8 "How tokens may / may not be used" block.

Authoring rules:
  - §1 Classification format is fixed — Type, MUI base, Figma, Code — each
    with a visible Name plus a clickable link where one exists. For foundations,
    "MUI base" is the theme primitive (palette, typography, spacing, shape, breakpoints).
  - No meta-commentary.
-->

---
name: {{kebab-case-name}}
title: {{Foundation Name}}
category: foundation
last_updated: YYYY-MM-DD

description: >
  {{One sentence: what this foundation governs + how it should / should not be used.}}
tags: [foundation, {{tag}}]

figma_url: {{https://... or empty}}
code_reference: {{package/path/within/package.ts}}
example_path: ./Example.tsx

mui_base: {{palette | typography | spacing | breakpoints | shape | none}}
depends_on_tokens: []
depends_on_components: []
---

# {{Title}}

## 1. Classification

- **Type:** Foundation
- **MUI base:** `{{palette | typography | spacing | breakpoints | shape | none}}`
- **Figma:** {{Variables file · Collection}} — [Link]({{figma_url}})
- **Code:** `{{package-name}}` — `{{path/within/package.ts}}`

## 2. Purpose

{{One-sentence narrative: what this foundation governs and why it matters.}}

## 3. How to use

{{General introduction — what this foundation is in code, where it lives, and
how consumers read it. Include: the theme key it hangs off (e.g. `theme.palette.*`,
`theme.spacing(n)`), the package path, and the reading pattern (semantic layer
vs raw shades, `sx` string notation, etc). Two to four short paragraphs or a
bulleted list.}}

## 4. Contract

### Guarantees
- {{What this foundation always provides when consumed correctly.}}

### Prohibitions
- {{Never hard-code values — always consume via token path.}}
- {{Never introduce new values in component code; add to the foundation first.}}
- {{Nothing outside the Inventory (§5) is valid.}}

### Conditions
- {{If a new role is needed, open a proposal — do not alias existing tokens.}}
- {{If a component needs a one-off, document the exception here before shipping.}}

## 5. Inventory

Exhaustive. Nothing outside this list is valid.

{{For token-carrying foundations — one or more tables of tokens with paths, values, and role.
For non-token foundations (e.g. layout breakpoints, iconography libraries), use whatever axis
is natural: breakpoint table, library list, etc. Split into sub-tables by group when needed
(e.g. Brand / Semantic / Neutral for colour).}}

| Token | Value | Role |
|---|---|---|
| `{{token.path}}` | {{value}} | {{semantic role}} |

## 11. Example

```tsx
// Consumption via theme — never hard-code
const styles = {
  color: theme.palette.{{…}},
  padding: theme.spacing({{n}}),
  borderRadius: theme.shape.{{…}},
};
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
