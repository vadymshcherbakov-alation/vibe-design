# Documentation Templates — v2

One skeleton, five category bodies. Every documented unit in the design system (component, pattern, page template, foundation) is a single Markdown file that follows its category template, with an `Example.tsx` alongside.

## Files

| File | Purpose |
|---|---|
| [`_skeleton.md`](./_skeleton.md) | Matrix reference. Do not fill in directly. |
| [`base-component.md`](./base-component.md) | Atomic MUI-backed components (Button, TextField, Chip, …). |
| [`composite-component.md`](./composite-component.md) | Components assembled from base components (Dialog, Card, Form, Table, …). |
| [`foundation.md`](./foundation.md) | Token-based foundations (Colour, Typography, Spacing, Layout, Shape, Iconography). |
| [`pattern.md`](./pattern.md) | Placeholder — redesign pending. |
| [`page-template.md`](./page-template.md) | Placeholder — redesign pending. |

## Per-category section set

### Base component
1. Classification · 2. Purpose · 3. When / When not · 4. **Contract** (Guarantees / Prohibitions / Conditions) · 5. Variants · 6. Anatomy · 7. States · 10. UX Copy (optional) · 11. Example

### Composite component
1. Classification · 2. Purpose · 3. When / When not · 4. **Contract** · 5. Anatomy & Composed of · 6. **Custom** (component-specific H3s) · 7. **Mock data content** · 11. Example

### Foundation
1. Classification · 2. Purpose · 3. **How to use** · 4. **Contract** · 5. Inventory · 11. Example

### Pattern / Page template
Placeholders until first pilot lands.

## What changed vs v1

- **Contract moved up.** Contract Block (§4) now sits above Variants / Anatomy. Readers see the prohibitions before the menu.
- **Accessibility absorbed into Contract.** The old §7 Accessibility section is gone across every template. A11y rules live inside Contract (Guarantees / Prohibitions / Conditions) instead of a parallel section that drifted.
- **Decision Tree dropped.** Rules in When/not + Contract cover the choice; a separate decision tree was redundant.
- **Related dropped.** Cross-references belong inside the rule where they matter (e.g. "pair Destructive with ConfirmDialog" inside a Condition), not in a trailing section.
- **Foundations get §3 How to use + §4 Contract.** Aligns with the component Contract Block and replaces the old v1 §8 "How tokens may / may not be used" paragraph.
- **Composites get §6 Custom + §7 Mock data content.** Custom is a named placeholder where the author adds H3s specific to the composite (validation, column behaviour, focus management). Mock data is reserved for Alation-domain fill.

## Frontmatter

```yaml
name: {{kebab-case-name}}
title: {{Display Name}}
category: {{base-component | composite-component | pattern | page-template | foundation}}
last_updated: YYYY-MM-DD

description: >
  {{One sentence: what it is + when to use + when NOT to use.}}
tags: [{{tag}}, {{tag}}]

figma_url: {{https://...}}
code_reference: {{package/path/within/package.ts or free-form string}}
example_path: ./Example.tsx

mui_base: {{MuiComponentName or palette / typography / none}}
depends_on_tokens: [{{token.path}}]
depends_on_components: [{{ComponentName}}]
```

## How to author a doc

1. Pick the category template that matches the unit.
2. Copy it to the right folder in the skill:
   - Base component → `skills/alation-design/references/components/base/{{name}}.md`
   - Composite component → `skills/alation-design/references/components/composite/{{name}}.md`
   - Foundation → `skills/alation-design/references/foundations/{{name}}.md`
3. Create a sibling `Example.tsx` with the canonical, runnable source.
4. Fill top-to-bottom. Prefer terse, structured entries over prose.
5. Use exhaustive phrasing where the template asks for it: **"Nothing outside this list is valid."** This is the AI-enforcement lever.
6. For composites, author specific H3s under §6 Custom that match the component's unique rules.

## Authoring rules

- **Single source of truth.** One Markdown per unit. No human/AI split.
- **Inline example ≤ ~20 lines.** Full runnable code lives in `Example.tsx`.
- **Never hard-code values in examples.** Consume via theme / tokens.
- **Third-person, imperative voice** in `description` and Contract Block.
- **Keep it under ~500 lines.** If you need more, something belongs in a referenced sibling file.
- **No meta-commentary.** No parenthetical asides about authoring history or section placement.

## Source decisions

Decision records live in the sibling Design System Assist working repo under `decisions/`. Relevant entries: 003 (Template approach), 005 (Final skeleton), 006 (Foundations scope), 010 (Skills architecture + template v2).
