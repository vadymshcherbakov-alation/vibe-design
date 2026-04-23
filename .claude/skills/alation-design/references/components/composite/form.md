---
name: form
title: Form
category: composite-component
last_updated: 2026-04-21

description: >
  A vertical stack of labeled fields for creating or editing an entity — single-line text, multiline textarea, select, and user-search autocomplete — composed from Form Field + TextField + Autocomplete.
tags: [form, stack, create, edit]

figma_url: ""
code_reference: "no shared `<Form>` wrapper in @alation/alation-ui — production composes `<Stack>` + `FormControl` / `InputLabel` / `TextField` / `Autocomplete` ad-hoc"
example_path: ./Example.tsx

mui_base: none
depends_on_tokens: [typography.subtitle1, spacing]
depends_on_components: [FormField, TextField, Autocomplete, Stack, MenuItem, Typography]
---

# Form

## 1. Classification

- **Type:** Composite component — **composition pattern, not a shared wrapper**
- **MUI base:** none (composition of `Stack` + `FormControl` / `InputLabel` / `TextField` / `Autocomplete`)
- **Figma:** Form — to be linked
- **Code:** There is **no shared `<Form>` component** in `@alation/alation-ui`. Production forms compose `<Stack>` + the Form Field pattern ([form-field.md](./form-field.md)) directly at the call site. This reference documents that composition.

## 2. Purpose

A vertical stack of labeled fields for creating or editing an entity. Canonical shape: a `Stack spacing={3}` of [Form Field](./form-field.md) wrappers, each containing a `TextField` (text, multiline, or select) or an `Autocomplete` for user/entity search.

## 3. When to use / When not to use

**Use when**
- You are creating or editing an entity in a page, panel, or dialog body.
- You need a vertical stack of labeled fields.

**Do not use when**
- You need a single inline field inside a toolbar → use [TextField](../base/text-field.md) directly.
- You need a search box in a page header → use [TextField](../base/text-field.md) with an `InputAdornment` icon.
- You need a confirm/destructive flow → wrap the form inside a [Dialog](./dialog.md) if applicable.

## 4. Contract

### Guarantees
- Every field uses [`FormField`](./form-field.md) — labels render as `Typography variant="subtitle1"`.
- Fields stack vertically with `spacing={3}`.
- Form container clamps to `maxWidth: 680` (or tighter) to keep readable on wide viewports.
- Every input uses [`TextField`](../base/text-field.md) or `Autocomplete` — no bare `<input>`, no bare MUI `Select`.

### Prohibitions
- Never use a bare `Select` — use `TextField` with `select` prop.
- Never override font properties on labels (`fontSize`, `fontWeight`) — the `subtitle1` variant is the contract.
- Never use `height` override on multiline TextFields — let `rows` control height.
- Never add `componentsProps={{ paper: ... }}` to a `TextField select` — the dropdown styling lives in the `MuiMenu` theme override.
- Never render a form wider than the content allows — default clamp is `maxWidth: 680`.
- Never use `variant="filled"` / `variant="standard"` on TextField — only `outlined` (MUI default with morpheus theme).

### Conditions
- When the field is multi-user / multi-entity → use `Autocomplete` with `multiple`.
- When the field is single-line text or select → apply `sx={{ '& .MuiOutlinedInput-root': { height: 40 } }}` for vertical rhythm.
- When the field accepts free-text outside the options list → use `Autocomplete freeSolo` (only when intentional).
- When the form is inside a Dialog → the outer `Stack` still owns spacing; do not add padding on children.

## 5. Anatomy & Composed of

**Anatomy**
```
Stack spacing={3} maxWidth=680
 ├─ FormField (label: "Standard Name")
 │    └─ TextField single-line, height 40
 ├─ FormField (label: "Description")
 │    └─ TextField multiline, rows=4
 ├─ FormField (label: "Column Data Type")
 │    └─ TextField select + MenuItem[]
 └─ FormField (label: "Edit Access")
      └─ Autocomplete multiple + TextField renderInput
```

**Composed of**
- [Form Field](./form-field.md) — label + helper wrapper
- [TextField](../base/text-field.md) — single-line, multiline, select
- `Autocomplete` — search / multi-select
- `Stack`, `MenuItem`, `Typography` — MUI primitives

## 6. Custom

### Field label

```tsx
<Typography variant="subtitle1" sx={{ mb: 1, display: 'block' }}>
  Field label
</Typography>
```

- `variant="subtitle1"` — 1.4rem / fontWeight 500
- `display: 'block'` — needed when rendering Typography as inline by default
- No `component="label"` needed unless the field requires semantic HTML association

### Single-line text field

```tsx
<TextField
  fullWidth
  value={value}
  onChange={(e) => setValue(e.target.value)}
  sx={{ '& .MuiOutlinedInput-root': { height: 40 } }}
/>
```

`height: 40` on `MuiOutlinedInput-root` is a **layout** override — not a font override — and is allowed under the Contract.

### Multiline textarea

```tsx
<TextField
  fullWidth
  multiline
  rows={4}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Describe the purpose and scope of this standard"
/>
```

- No height override — let `rows` control the height.
- `placeholder` for empty-state guidance.

### Select (dropdown)

```tsx
<TextField
  fullWidth
  select
  value={value}
  onChange={(e) => setValue(e.target.value)}
  sx={{ '& .MuiOutlinedInput-root': { height: 40 } }}
>
  <MenuItem value="all">All</MenuItem>
  <MenuItem value="string">String</MenuItem>
</TextField>
```

- Use `TextField` with `select` — not a bare `Select` component.
- The dropdown paper styling is handled by `MuiMenu` theme overrides — no inline `componentsProps` needed.

### Autocomplete (user search)

```tsx
<Autocomplete
  multiple
  options={userList}
  renderInput={(params) => (
    <TextField {...params} placeholder="Search users to grant edit access" />
  )}
/>
```

- Pass `componentsProps={{ paper: { sx: { border: 1, borderColor: 'divider', boxShadow: 1, borderRadius: 1 } } }}` to match the Select dropdown appearance — the core theme does not override Autocomplete paper.
- Use `multiple` when selecting more than one user.
- Pass real options from your data source; use `freeSolo` only when free-text entry is intentional.

### Full form layout

```tsx
<Stack spacing={3} sx={{ maxWidth: 680 }}>
  <FormField label="Standard Name">
    <TextField fullWidth value={name} onChange={…}
      sx={{ '& .MuiOutlinedInput-root': { height: 40 } }} />
  </FormField>

  <FormField label="Description">
    <TextField fullWidth multiline rows={4} value={description} onChange={…}
      placeholder="Describe the purpose and scope of this standard" />
  </FormField>

  <FormField label="Column Data Type">
    <TextField fullWidth select value={dataType} onChange={…}
      sx={{ '& .MuiOutlinedInput-root': { height: 40 } }}>
      <MenuItem value="all">All</MenuItem>
    </TextField>
  </FormField>

  <FormField label="Edit Access">
    <Autocomplete multiple options={users}
      renderInput={(params) => <TextField {...params} placeholder="Search users…" />} />
  </FormField>
</Stack>
```

### Validation rules

Placeholder. Alation-specific validation messages (required fields, character limits, uniqueness constraints) will be filled during pilots.

## 7. Mock data content

Placeholder — fill with Alation-domain mock data when this composite is used in a pilot. Candidates: Standard Name / Description / Column Data Type / Edit Access (Data Standards flow); Source Name / Connection URL / Credentials (Data Source creation); Monitor Name / Schedule / Recipients (Monitor creation).

## 11. Example

```tsx
<Stack spacing={3} sx={{ maxWidth: 680 }}>
  <FormField label="Standard Name">
    <TextField fullWidth value={name} onChange={handleName}
      sx={{ '& .MuiOutlinedInput-root': { height: 40 } }} />
  </FormField>
  <FormField label="Description">
    <TextField fullWidth multiline rows={4} value={description} onChange={handleDescription} />
  </FormField>
</Stack>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source — the full four-field form.
