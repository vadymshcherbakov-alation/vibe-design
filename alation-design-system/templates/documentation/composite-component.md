<!--
COMPOSITE COMPONENT TEMPLATE — v2

Sections:
  1. Classification
  2. Purpose
  3. When to use / When not to use
  4. Contract            (Guarantees / Prohibitions / Conditions — moved above Anatomy)
  5. Anatomy & Composed of
  6. Custom              (component-specific H3s — validation, column behaviour, etc.)
  7. Mock data content   (placeholder for future Alation-context fill)
  11. Example

Dropped from v1: Variants, States, Accessibility, Decision Tree, UX Copy, Related.
Composites carry their state / variance through their base components and their
component-specific sections in §6 Custom.

Authoring rules:
  - §1 Classification format is fixed — Type, MUI base, Figma, Code — each
    with a visible Name plus a clickable link where one exists.
  - No meta-commentary.
  - §6 Custom replaces the old Variants/States boilerplate with guidance
    specific to this composite — author adds H3s that match the component
    (e.g. "Validation rules", "Column behaviour", "Focus management").
-->

---
name: {{kebab-case-name}}
title: {{Display Name}}
category: composite-component
last_updated: YYYY-MM-DD

description: >
  {{One sentence: what it is + when to use + when NOT to use.}}
tags: [{{tag}}, {{tag}}]

figma_url: {{https://... or empty}}
code_reference: {{package/path or block/Example.tsx}}
example_path: ./Example.tsx

mui_base: {{MuiComponentName or none}}
depends_on_tokens: [{{token.path}}]
depends_on_components: [{{BaseComponentA}}, {{BaseComponentB}}]
---

# {{Title}}

## 1. Classification

- **Type:** Composite component
- **MUI base:** `{{MuiExportName or none}}`
- **Figma:** {{Display name · Library · Version}} — [Link]({{figma_url}})
- **Code:** `{{package-name}}` — `{{path/within/package.ts or src/lib/ cluster}}`

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
- {{Focus is managed correctly on open/close (dialogs, menus).}}
- {{All subcomponents use theme tokens.}}
- {{Every subcomponent's own contract is honoured.}}

### Prohibitions
- {{Never compose from raw MUI when an Alation base exists.}}
- {{Never override the subcomponent's contract from here.}}
- {{No hard-coded hex / px / font values.}}
- {{Nothing outside the Custom (§6) rules is valid.}}

### Conditions
- {{If modal-like, focus trap is required.}}
- {{If dismissible, Escape must close and return focus.}}
- {{Component-specific conditions — e.g. "destructive submit must wrap in ConfirmDialog".}}

## 5. Anatomy & Composed of

**Anatomy** (labeled regions)
- {{Header}} — {{role}}
- {{Body / content area}} — {{role}}
- {{Footer / actions}} — {{role}}

**Composed of** (subcomponents used)
- [{{BaseComponentA}}](../base/{{name}}.md) — {{where it appears}}
- [{{BaseComponentB}}](../base/{{name}}.md) — {{where it appears}}

## 6. Custom

<!--
Component-specific sections go here. Add H3s that match the component. Examples:
  - For Form       → "Field ordering", "Validation rules", "Submit behaviour"
  - For Dialog     → "Sizing", "Focus management", "Action order"
  - For Table      → "Column behaviour", "Sort + filter", "Empty / loading states"
  - For Card       → "Padding + radius", "Title typography", "Action slot"
  - For PageHeader → "Breadcrumb rules", "Title + subtitle", "Action slot order"

Each H3 carries rules specific to this composite that do not fit elsewhere in
the template. If no custom rules apply, leave this section as:
  "No component-specific rules beyond the Contract (§4)."
-->

### {{H3 A}}

{{Rules specific to this composite.}}

### {{H3 B}}

{{Rules specific to this composite.}}

## 7. Mock data content

<!--
Placeholder for Alation-context fill. To be populated with realistic mock data
once this composite is wired into the playground / skill dogfood.

Examples of what lands here:
  - For Table → column names, row values that reflect real Alation domain objects
  - For Card  → metric labels, nav targets, content summaries
  - For Form  → sample field labels/placeholders from real flows
-->

{{Placeholder — fill with Alation-domain mock data when this composite is used in a pilot.}}

## 11. Example

```tsx
<{{Component}} {{...requiredProps}}>
  {{content}}
</{{Component}}>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
