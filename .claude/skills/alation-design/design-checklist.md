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

### 3. Open every matching `usage.md` (MANDATORY — non-skippable)
For every intent in the request, **open the matching `usage.md`** listed in the SKILL.md redirection table. Reading `Example.tsx` alone is **not** sufficient — `Example.tsx` shows a pattern but does not encode Prohibitions, Conditions, or "do not use when" rules. Almost every contract violation in this codebase has been caused by skipping `usage.md` and trusting the Example.

If you skip this step you will violate prohibitions you didn't know existed (e.g. `subtitle1` vs `subtitle2` labels inside a Dialog, multi-step flows belonging on a page not a Dialog, `size="xsmall"` on Chip not being supported by the local theme override). The Contract Audit in §6 below is what proves you actually did this read.

### 4. Open the sibling `Example.tsx`
After `usage.md`, open the matching `Example.tsx` for each reference. That is the canonical, runnable starting point — copy it as the baseline and deviate only when the request demands.

### 5. Handle missing references
If a redirection-table entry exists but the reference file is missing, OR the request involves an element not covered by the table, **flag it** in your response and stop. Do not invent tokens, components, or named styles. The fallback is *to ask*, not *to improvise*.

### 6. Pre-flight Contract Audit (MANDATORY visible output)
Before writing any code, **emit this audit block in your response to the user**. This is not optional commentary — it is the proof-of-work for steps 3–5 and the gate that prevents silent prohibition violations.

```
Contract Audit
References opened (usage.md):
  - <intent>: <path/to/usage.md>
    Prohibitions that apply: <list — or "none triggered">
    Conditions that apply:   <list — or "none triggered">
  - <intent>: <path/to/usage.md>
    Prohibitions that apply: …
    Conditions that apply:   …
References opened (Example.tsx): <list of paths>
Theme prerequisites:             <list of references/theme/MuiX.overrides.ts files the request depends on — or "none">
Named styles selected:           <e.g. Button: Primary; Chip: Label>
Conflicts with the request:      <e.g. "request asks for multi-step flow in Dialog; dialog/usage.md §3 steers to a page"> — or "none"
```

Rules for the audit:
- One entry per `usage.md` you opened. If you cannot list at least one Prohibition or Condition for a reference, you have not actually read its Contract Block — go back and read it.
- "Theme prerequisites" lists every override file the request depends on (per the bundle mapping in `references/theme/_index.md`). For each one:
  1. **Find the consumer's REAL theme.** Trace the `<ThemeProvider theme={...}>` import in the app's root layout (typically `app/layout.tsx`, `app/client-layout.tsx`, or `src/main.tsx`). Do NOT assume from folder structure — a `packages/ui/componentOverrides/` barrel may be dead scaffolding if the app actually imports from `packages/fabric-theme-morpheus/` or another path. Mirroring into the wrong barrel is silent; only the import trace tells the truth. See `references/theme/_index.md` §1 for the three consumer shapes.
  2. **Verify the override is wired into THAT theme**, not a presumed one. For production-shape themes, the file should appear under `src/lib/Mui*.overrides.{ts,tsx}` AND be imported in the package's `src/index.ts` `components` map.
  3. **If you cannot verify** (no running app, no app source visible, ambiguous wiring), flag the prerequisite under "Conflicts" — do not silently improvise call-site `sx` workarounds. Verification by reading source is necessary but not sufficient — only a runtime computed-style check (see `_index.md` §3) confirms the override actually applies. Whenever you cannot run that check, say so.
- "Conflicts with the request" must call out any tension between what the user asked for and what a Contract Block forbids — surfacing it here gives the user the chance to redirect *before* you write code that you'll have to undo.
- The audit can be terse (one line per Prohibition is fine), but every applicable Prohibition must be named.
- If the audit is empty, you skipped the work. The audit is the work.

### 7. Check named styles
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
7. **Theme bundle** — every theme prerequisite listed in the Contract Audit is mirrored into **the theme actually wired to `<ThemeProvider>`** (verified by tracing the import, not by checking a presumed `componentOverrides` path). When a runtime is available, computed-style on a rendered instance matches the contract (e.g. `MuiStepIcon` → `fontSize`/`width`/`height` all `"24px"`). If a runtime check wasn't possible, the response says so under "Conflicts" rather than claiming verification it didn't perform. If any prerequisite is not mirrored, the response flags it (not silently substituted with inline `sx`).
8. **Usage tracking** — IMPORTANT: append one JSONL entry to `.design-usage.jsonl` at the consumer project root, per the spec in `references/_usage-tracking.md`. List only components, patterns, and foundation tokens you actually used (see §4 of that spec — accuracy rule). Populate `net_new` with anything the user asked for that does not exist in `references/`. If the write fails, mention it briefly and continue.

---

## Response style

This skill is used by designers, not engineers. Default response shape:

- **Open with the Contract Audit** (Pre-flight §6) — short and structured. This is the only required structured block; everything else stays conversational.
- **Then the output** (the generated UI / code / markup).
- **Follow with designer-style commentary** — short, plain-language reflection on what you built and any choices that are worth noticing. Think of how a designer would hand off the work: "I leaned on the Primary Button here because this is the main commit action; I kept the header borderless because tabs sit under it." Call out any **concerns, trade-offs, or suggestions** — e.g. "the form is long enough that I'd consider splitting it into steps", "the table could use an empty state when there's no data yet", "I wasn't sure which avatar tone to use — happy to revisit."
- **Flag conflicts with a warning, not a block** — if the request pushes against the design system (forbidden prop, undocumented component, missing token), surface the warning clearly in the Contract Audit's "Conflicts" line *and* in the commentary, explain the trade-off, and let the user decide whether to proceed.
- Apart from the Contract Audit, keep it human — no rigid tables or verification blocks by default.

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
