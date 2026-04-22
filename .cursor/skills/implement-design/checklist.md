# Design Implementation Checklist

Pure checkbox reference. See [SKILL.md](./SKILL.md) for code examples and detailed patterns.

## Before Starting

- [ ] Read [Design System Guide](../../docs/design-system.md)
- [ ] Read [i18n Guide](../../docs/i18n-guide.md)
- [ ] Read [Project Structure](../../docs/project-structure.md)
- [ ] Understand component requirements and props

## Environment Flags (E2E Safety)

> See SKILL.md > [Environment Flags](./SKILL.md#environment-flags-for-e2e-test-safety)

- [ ] Assessed if changes will break e2e tests (text, layout, component moves, element replacements)
- [ ] If yes: created flag with `/createEnvFlag` and gated changes behind it
- [ ] If yes: verified flag is `false` in production, `true` in development

## Component Structure

- [ ] One component per file
- [ ] Named export only (no default export)
- [ ] TypeScript interface for props (exported)
- [ ] JSDoc comment with description and example
- [ ] Proper import order: React/external > MUI > @alation/ > relative > hooks

## Internationalization

> See SKILL.md > [Internationalization](./SKILL.md#internationalization-i18n)

- [ ] `useTranslation` hook with namespace and keyPrefix
- [ ] Zero hardcoded text strings — all text uses `t()`
- [ ] Descriptive translation keys (not generic like `title`, `text1`)
- [ ] Fallback text provided for every `t()` call
- [ ] Translation JSON file updated in `apps/alation/src/assets/locales/en/`
- [ ] Interpolation for dynamic content: `t('key', 'Text {{var}}', { var })`
- [ ] ARIA labels translated

## Design System & Styling

> See SKILL.md > [Design System](./SKILL.md#design-system)

- [ ] MUI components used first (not custom)
- [ ] Styling via `sx` prop (not inline styles)
- [ ] Theme-aware colors: `'primary.main'`, `'text.primary'`, `'background.paper'`
- [ ] System spacing (multiples of 8px): `p: 2`, `mt: 3`, `gap: 1.5`
- [ ] Typography uses variants: `<Typography variant="h1">`
- [ ] No `flex` in DataGrid columns (use `width` and `minWidth`)
- [ ] Icons priority: @alation/icons-neo > lucide-react > MUI > custom SVG
- [ ] Works in both Classic and Morpheus themes

## Accessibility

> See SKILL.md > [Accessibility](./SKILL.md#accessibility)

### ARIA

- [ ] Dialogs have `aria-labelledby` and `aria-describedby`
- [ ] Icon buttons have `aria-label`
- [ ] Custom interactive elements have `role` and `aria-label`
- [ ] Form inputs have proper labels and `aria-describedby` for helpers
- [ ] Loading states have `aria-label` on spinner

### Keyboard

- [ ] All interactive elements keyboard accessible
- [ ] Custom interactive elements handle Enter and Space keys
- [ ] Tab order is logical
- [ ] Focus trapped in modals/dialogs
- [ ] Focus restored after modal closes

### Visual

- [ ] Color contrast meets WCAG (use theme colors)
- [ ] Information not conveyed by color alone
- [ ] Focus indicators clearly visible

## Corner Cases

> See SKILL.md > [Corner Cases](./SKILL.md#corner-cases)

- [ ] Properties alphabetized in interfaces and object literals
- [ ] React keys use stable unique IDs (not array index)
- [ ] Props interface exported and named (not inline types)
- [ ] Event handlers have proper React types
- [ ] No `console.log` in committed code
- [ ] Colors use string notation (`'grey.800'`), not `theme.palette`
- [ ] Sizes use `size` prop when available, `rem` units otherwise (not px numbers)
- [ ] Typography styling uses `variant`/`color` props, not `fontSize`/`color` in sx
- [ ] Icons wrapped correctly: `SvgIcon` + `MuiIconButton` for @alation/icons-neo, `LucideIcon` for lucide-react

## Interactive Components

- [ ] Forms use Formik + Yup validation
- [ ] Nested interactive elements positioned absolutely with `e.stopPropagation()`
- [ ] Notifications use `useToastV2` (not `useToast`)

## Testing

> See SKILL.md > [Testing](./SKILL.md#testing)

- [ ] Test file created: `ComponentName.test.tsx`
- [ ] Role-based selectors: `getByRole`, `getByLabelText`
- [ ] User interactions tested with `userEvent`
- [ ] Async operations use `waitFor` (not `setTimeout`)
- [ ] Edge cases tested (loading, error, empty states)
- [ ] Accessibility test with `axe` included

## Storybook

> See SKILL.md > [Storybook](./SKILL.md#storybook)

- [ ] Story file created: `ComponentName.stories.tsx`
- [ ] Default story + additional states (loading, error, empty, disabled)
- [ ] Meta uses `satisfies Meta<typeof Component>`
- [ ] Tags include `['autodocs']`

## File Structure

```
libs/domain/ui/src/lib/ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx
├── ComponentName.stories.tsx
└── index.ts
```

- [ ] All files created
- [ ] Named exports in `index.ts`
- [ ] Component exported from library barrel file

## Quality Gates

```bash
NX_TUI=false nx lint <project> --fix      # 1. Lint
NX_TUI=false nx typecheck <project>        # 2. Type check
NX_TUI=false nx test <project>             # 3. Tests
```

- [ ] IDE diagnostics clean (no TypeScript or lint errors)
- [ ] All commands pass
- [ ] No `any` types
- [ ] Keyboard navigation verified
- [ ] Both themes verified
