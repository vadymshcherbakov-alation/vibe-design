---
name: _usage-tracking
title: Usage tracking
category: meta
last_updated: 2026-04-20

description: >
  Every AI-generated UI request appends one JSONL entry to a local usage log.
  The log feeds Phase II prioritisation (which docs to write next) and Phase III
  maintenance (which components need the most attention).
tags: [meta, tracking, telemetry, logging]
---

# Usage tracking

Meta-instruction for AI agents using this design system. Not a component doc.

## 1. What you log

One line per UI-generation request, appended to the log file (see §3).

## 2. Fields

```json
{
  "ts": "2026-04-20T14:32:00Z",
  "tool": "claude-code",
  "prompt_summary": "Create a delete-connection confirm dialog",
  "components": ["Button", "ConfirmDialog"],
  "variants": ["Button:Destructive"],
  "patterns_used": ["ConfirmDialog"],
  "foundations_used": ["palette.error.main", "palette.text.primary"],
  "net_new": ["ConfirmDialog"]
}
```

| Field | Type | Rule |
|---|---|---|
| `ts` | ISO 8601 UTC string | Time of generation, not time of prompt |
| `tool` | string | `claude-code` / `cursor` / `other` |
| `prompt_summary` | string, ≤ 120 chars | One-line paraphrase of the request. Do not copy raw prompt text — it may be sensitive |
| `components` | array of strings | Names matching `references/components/**/*.md` filenames (title-cased). List **only** components whose doc file you actually opened this session — see §4 |
| `variants` | array of strings | `<Component>:<NamedStyle>` format, e.g. `Button:Destructive`, `FormField:Checkbox` |
| `patterns_used` | array of strings | Names matching `references/patterns/*.md` filenames |
| `foundations_used` | array of strings | Token paths actually referenced, e.g. `palette.error.main`, `spacing.md`, `typography.body0` |
| `net_new` | array of strings | Components / patterns the user asked for that do **not** exist in `references/`. This is the gap signal |

## 3. Where to write

Path: **`.design-usage.jsonl`** at the root of the consumer project (the project where the generated UI will live — not the design system repo).

Behaviour:

- Append-only. Never rewrite or reorder existing lines.
- Create the file if it does not exist.
- One JSON object per line, followed by `\n`. No trailing comma, no array wrapper.

If you cannot determine a consumer-project root (e.g. you are working outside a workspace), skip the write silently rather than guessing.

## 4. Accuracy rule

List only components / patterns / foundations whose `references/` doc file you **actually opened this session**. Do not list a component because you "probably would have used" its rules — the log is a behavioural trace, not an intent declaration.

For `foundations_used`, list only token paths you actually wrote into the output code. A token you read but did not use does not count.

For `net_new`, list anything the user asked for by name (or by obvious intent — "a confirm dialog") that you could not find in `references/`. If you reported a blocker under the checklist's §Escalation, include it here too.

## 5. Privacy

- `.design-usage.jsonl` should be **git-ignored** by default in consumer projects. `prompt_summary` may contain sensitive roadmap or customer information.
- Do not copy raw prompt text into `prompt_summary`. Paraphrase into ≤ 120 characters.
- Do not include PII, credentials, or customer names in any field.

## 6. Failure mode

If writing the log fails (permission, disk, path), do **not** block the response. Note the write failure in the reporting summary (one short line) and continue. Usage tracking is advisory; the UI output is the primary deliverable.

## 7. Example entries

```jsonl
{"ts":"2026-04-20T14:32:00Z","tool":"claude-code","prompt_summary":"Delete-connection confirm dialog","components":["Button"],"variants":["Button:Destructive"],"patterns_used":[],"foundations_used":["palette.error.main","palette.text.primary"],"net_new":["ConfirmDialog"]}
{"ts":"2026-04-20T15:10:00Z","tool":"cursor","prompt_summary":"Sign-in form with email + password","components":["Button","FormField"],"variants":["Button:Primary","FormField:Text Input"],"patterns_used":[],"foundations_used":["palette.primary.main","typography.body0","spacing.md"],"net_new":[]}
```
