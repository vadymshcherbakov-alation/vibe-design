<!--
MASTER SKELETON — v2. Do not fill this file in directly.

Use it as the reference for the 5 per-category templates:
  - base-component.md       (§1–4, 5 Variants, 6 Anatomy, 7 States, 10 UX, 11 Example)
  - composite-component.md  (§1–4, 5 Anatomy+Composed, 6 Custom, 7 Mock data, 11 Example)
  - foundation.md           (§1–2, 3 How to use, 4 Contract, 5 Inventory, 11 Example)
  - pattern.md              (placeholder)
  - page-template.md        (placeholder)

Per-category section matrix:

  | Section                 | Base | Composite | Foundation | Pattern | Page tpl |
  |-------------------------|:----:|:---------:|:----------:|:-------:|:--------:|
  | 1 Classification        |  ✓   |     ✓     |     ✓      | placeh. |  placeh. |
  | 2 Purpose               |  ✓   |     ✓     |     ✓      | placeh. |  placeh. |
  | 3 When / When not       |  ✓   |     ✓     |     —      |   —     |    —     |
  | 3 How to use            |  —   |     —     |     ✓      |   —     |    —     |
  | 4 Contract (G/P/C)      |  ✓   |     ✓     |     ✓      |   —     |    —     |
  | 5 Variants              |  ✓   |     —     |     —      |   —     |    —     |
  | 5 Anatomy + Composed    |  —   |     ✓     |     —      |   —     |    —     |
  | 5 Inventory             |  —   |     —     |     ✓      |   —     |    —     |
  | 6 Anatomy (base only)   |  ✓   |     —     |     —      |   —     |    —     |
  | 6 Custom                |  —   |     ✓     |     —      |   —     |    —     |
  | 7 States                |  ✓   |     —     |     —      |   —     |    —     |
  | 7 Mock data             |  —   |     ✓     |     —      |   —     |    —     |
  | 10 UX Copy              | opt  |     —     |     —      |   —     |    —     |
  | 11 Example              |  ✓   |     ✓     |     ✓      |   —     |    —     |

Dropped from v1 (everywhere): Accessibility (§7), Decision Tree (§9), Related (§12).
Accessibility rules now live inside Contract (Guarantees / Prohibitions / Conditions).

Authoring rules:
  - Exhaustive lists use "Nothing outside this list is valid." Keep strict by default.
  - Single source of truth per unit. No human/AI split.
  - Inline example ≤ ~20 lines; full runnable code lives in Example.tsx alongside the .md.
  - §1 Classification format is fixed — Type, MUI base (or "none" for patterns /
    page templates), Figma, Code — each with a visible Name plus (where
    applicable) a clickable link. Never drop the Name or hide the link behind a
    bare "Link" label.
  - No meta-commentary. Do not add parenthetical asides that reference the
    authoring process, prior drafts, or section-placement decisions. The
    published doc speaks only to the reader using the component; process notes
    belong in the PR description.
-->

---
name: {{kebab-case-name}}
title: {{Display Name}}
category: {{base-component | composite-component | pattern | page-template | foundation}}
last_updated: YYYY-MM-DD

description: >
  {{One sentence: what it is + when to use + when NOT to use.}}
tags: [{{tag}}, {{tag}}]

figma_url: {{https://... or empty}}
code_reference: {{URL, repo path, package name, or short note — free-form string}}
example_path: ./Example.tsx

mui_base: {{MuiComponentName or palette / typography / none}}
depends_on_tokens: [{{token.path}}]
depends_on_components: [{{ComponentName}}]
---

# {{Title}}

See the per-category template for the actual section bodies. This skeleton is
a matrix, not a copy-paste source.
