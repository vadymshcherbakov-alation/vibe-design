# Design Checklist

IMPORTANT: Run this checklist for every UI request. Execute all pre-flight steps before writing anything, and all post-flight steps before returning your output.

## When this applies

Apply this checklist whenever you receive a prompt to:

- Generate, modify, or prototype a UI (page, screen, component, flow)
- Apply styles, tokens, or layout to existing markup
- Compose multiple components into a pattern or page
- Translate a design (Figma node, screenshot, description) into code

If the prompt does not involve producing visual output, skip this checklist.

---

## Pre-flight

Complete every step before writing code, markup, or design output.

### 1. Restate the request
In one sentence, summarise what you are being asked to produce. If you cannot, ask for clarification — do not proceed.

### 2. Classify the work
Tag the request as one of:

| Category | Examples |
|----------|----------|
| Base component | Button, Input, Checkbox, Icon |
| Composite component | Form Field, Card, Toolbar |
| Pattern | Destructive action flow, login flow, empty state |
| Page template | List page, detail page, dashboard |
| Foundation usage | Colour, typography, spacing, layout, shape, iconography |

A request can involve multiple categories. List all that apply.

### 3. Redirect via SKILL.md
For every intent in the request, open the matching reference file listed in the `SKILL.md` redirection table. Read the file's Contract Block before generating.

### 4. Handle missing references
If a redirection-table entry exists but the reference file is missing, OR the request involves an element not covered by the table, **flag it** in your response and stop. Do not invent tokens, components, or named styles. The fallback is *to ask*, not *to improvise*.

### 5. Read the Contract Block
Every component, pattern, foundation, and page-template doc contains a Contract Block with three fields:

- **Guarantees** — behaviours the element always provides
- **Prohibitions** — explicit "never do this" rules
- **Conditions** — when additional rules or adjacent components apply (e.g., destructive action → ConfirmDialog)

List every Prohibition and Condition that applies to your task.

### 6. Check named styles
For any component with a named-style axis (e.g., Button: Primary / Blue secondary / Grey outlined / Text / Destructive / Gradient), confirm which named style applies.

IMPORTANT: Do not invent new styles or combine styles outside those documented.

---

## Production rules

While producing output:

- IMPORTANT: Use only components documented under `references/components/`. Do not invent new components.
- IMPORTANT: Use only tokens documented in `references/foundations/`. Do not hardcode colours, sizes, spacing, or typography values.
- IMPORTANT: Use named styles (e.g., `variant="primary"`). Do not use forbidden props (e.g., `color="secondary"` on Button).
- IMPORTANT: Obey every Prohibition in the Contract Block of each reference you used.
- Use the `code_reference` path from each doc when writing import statements.

---

## Post-flight verification

Before returning your output, verify each item. If any check fails, fix the output; if you cannot fix it, flag the issue in your response and let the user decide.

1. **Components** — every component used is documented in `references/`. No undocumented components remain.
2. **Tokens** — every value (colour, size, spacing, typography) uses a token from `references/foundations/`. No hardcoded values remain.
3. **Prohibitions** — no Prohibition from any Contract Block is violated.
4. **Conditions** — every Condition that applies has been honoured (e.g., destructive action wrapped in ConfirmDialog).
5. **Named styles** — only documented named styles are used; no invented variants or combinations.
6. **Missing references** — any element that did not map to a reference is flagged in the response (not silently substituted).
7. **Usage tracking** — IMPORTANT: append one JSONL entry to `.design-usage.jsonl` at the consumer project root, per the spec in `references/_usage-tracking.md`. List only components, patterns, and foundation tokens you actually used (see §4 of that spec — accuracy rule). Populate `net_new` with anything the user asked for that does not exist in `references/`. If the write fails, mention it briefly and continue.

---

## Response style

This skill is used by designers, not engineers. Default response shape:

- **Lead with the output** (the generated UI / code / markup).
- **Follow with designer-style commentary** — short, plain-language reflection on what you built and any choices that are worth noticing. Think of how a designer would hand off the work: "I leaned on the Primary Button here because this is the main commit action; I kept the header borderless because tabs sit under it." Call out any **concerns, trade-offs, or suggestions** — e.g. "the form is long enough that I'd consider splitting it into steps", "the table could use an empty state when there's no data yet", "I wasn't sure which avatar tone to use — happy to revisit."
- **Flag conflicts with a warning, not a block** — if the request pushes against the design system (forbidden prop, undocumented component, missing token), surface the warning clearly, explain the trade-off, and let the user decide whether to proceed.
- Keep it human — no rigid tables or verification blocks by default.

### Structured report (only when asked)

If the user explicitly asks for a "design system references report" (or equivalent — "show the token list", "list components used", "give me the reference summary"), append a structured block in this format:

```
Components used:     Button (Primary), FormField (Text Input)
Tokens used:         palette.primary.main, spacing.md, typography.body1
Prohibitions:        no color="secondary", no hardcoded hex — checked
Conditions:          none triggered
References missing:  —
Usage log:           appended 1 entry to .design-usage.jsonl (net_new: none)
```

Otherwise, keep the response conversational.

---

## Escalation

If a request conflicts with the design system — a forbidden prop is needed, an undocumented component is requested, a token does not exist — **warn the user**: name the conflict, explain the trade-off, and suggest the in-system alternative. Then **let the user decide** whether to proceed as requested, pick the alternative, or rethink the approach. Do not silently bend the rules, and do not hard-stop either — the user has context you don't.
