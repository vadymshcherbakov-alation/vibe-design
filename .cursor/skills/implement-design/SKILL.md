---
name: implement-design
description: Implement UI/UX designs following Alation's architecture, design system, accessibility, and i18n standards
---

# UI/UX Design Implementation Skill

## Core Principles

1. **Documentation First**: Read relevant docs BEFORE coding
2. **Accessibility by Default**: Every component must be accessible
3. **Translation Always**: Zero hardcoded text strings
4. **Design System Consistency**: MUI components with proper patterns
5. **Quality Gates**: Verify before finishing

### Pre-Implementation Reading

- [ ] [LLM Best Practices](../../prompts/llm-best-practices-template.md) - **Org-level reference** for all development guidelines. For deeper detail, see:
  - [Design System Guide](../../docs/design-system.md) - MUI v6 patterns & styling
  - [i18n Guide](../../docs/i18n-guide.md) - Translation requirements & patterns
  - [Project Structure](../../docs/project-structure.md) - Where to place code
  - [Testing Strategy](../../docs/testing/) - How to test components

---

## Environment Flags for E2E Test Safety

**CRITICAL**: UI changes can break existing e2e tests. Gate breaking changes behind environment flags.

### Changes that break e2e tests (use flag)

- Text changes (button labels, headings, user-facing text)
- Component structure changes (adding/removing elements)
- Layout changes (moving components, reordering)
- Element replacements (swapping one component for another)

### Changes that don't break e2e tests (no flag needed)

- Pure styling (colors, spacing, borders)
- Internal logic (calculations, data processing)
- New optional features that don't modify existing UI

### Pattern

Use `/createEnvFlag` to create the flag, then gate changes:

```tsx
import {environment} from '@alation/core';

const MyComponent: FC = () => {
  const {t} = useTranslation('namespace');

  return (
    <Box>
      {environment.enableMyNewFeature ? (
        <Typography>{t('newTitle', 'New Title Text')}</Typography>
      ) : (
        <Typography>{t('oldTitle', 'Original Title')}</Typography>
      )}
    </Box>
  );
};
```

### Flag naming

- TypeScript: `enableAdvancedSearchFilters` (camelCase, "enable" prefix)
- Environment file: `VITE_ENABLE_ADVANCED_SEARCH_FILTERS`

### Workflow

1. Identify breaking changes
2. Create flag with `/createEnvFlag`
3. Implement gated behind flag
4. Test in development (flag = `true`)
5. E2E tests still pass (flag = `false` in production)
6. Update e2e tests for new UI
7. Enable flag in production
8. Remove flag after stable

---

## Design System

### Component Selection Priority

1. **MUI components** FIRST
2. **Fabric components** when MUI needs augmentation
3. **Custom components** only when necessary

### Styling

```tsx
// PREFERRED: sx prop
<Box
  sx={{
    display: 'flex',
    gap: 2, // 16px (8px spacing system)
    color: 'primary.main', // Theme-aware
    p: 3, // 24px
    borderRadius: 1, // 4px
    backgroundColor: 'background.paper',
  }}>
  {children}
</Box>;

// ACCEPTABLE: styled components for complex/repeated patterns
import {styled} from '@mui/material/styles';

const StyledCard = styled(Card)(({theme}) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  '&:hover': {boxShadow: theme.shadows[4]},
}));

// NEVER: Inline styles or direct emotion imports
<div style={{color: 'red'}}>Bad</div>; // Wrong!
import styled from '@emotion/styled'; // Wrong!
```

### Responsive design

```tsx
<Box
  sx={{
    display: {xs: 'block', md: 'flex'},
    flexDirection: {xs: 'column', md: 'row'},
    p: {xs: 2, sm: 3, md: 4},
  }}>
  {children}
</Box>
```

### Spacing reference

| Value | Result | Value | Result |
| ----- | ------ | ----- | ------ |
| `1`   | 8px    | `3`   | 24px   |
| `1.5` | 12px   | `4`   | 32px   |
| `2`   | 16px   | `5`   | 40px   |

### Typography

```tsx
// Use variant and color PROPS — not sx for font styling
<Typography variant="h1">Main Heading</Typography>
<Typography variant="body1" color="text.secondary">Body text</Typography>
<Typography variant="caption">Caption text</Typography>

// sx ONLY for layout: mb, mt, spacing, textAlign, width, maxWidth
<Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
  {t('subtitle', 'Subtitle text')}
</Typography>

// Bold text: use <strong> tag (theme-aware), not fontWeight in sx
<Typography variant="body2">
  Normal text with <strong>bold text</strong> inside.
</Typography>

// Truncation: use noWrap prop
<Typography noWrap sx={{ maxWidth: '20rem' }}>{longText}</Typography>

// DON'T put fontSize, color, fontWeight, lineHeight in sx
```

### Colors — string notation

```tsx
// ALWAYS: String dot notation (in sx, props, everywhere)
<Box sx={{ bgcolor: 'grey.800', color: 'primary.main' }}>
<Typography color="text.secondary">Text</Typography>
<Chip color="error" sx={{ color: 'text.primary' }} />

// NEVER: theme.palette syntax
<Box sx={{ bgcolor: theme.palette.grey[800] }}>       // Wrong!
<Typography color={theme.palette.text.secondary}>     // Wrong!

// Common color tokens:
// 'grey.50' through 'grey.900'
// 'primary.main', 'error.main', 'success.main'
// 'text.primary', 'text.secondary', 'text.disabled'
// 'background.default', 'background.paper'
// 'divider', 'action.hover', 'action.selected'
```

### Size units & size prop

```tsx
// PRIORITY: Use size prop when component supports it
<Button size="small">Click</Button>
<TextField size="small" />
<CircularProgress size="small" />
<Chip size="small" label="Tag" />

// Use rem for explicit sizes (not px numbers)
<Box sx={{ width: '4rem', height: '4rem' }}>
<Icon sx={{ fontSize: '2rem' }} />

// DON'T use fontSize in sx when size prop exists
<Button sx={{ fontSize: '1.4rem' }}>  // Wrong — use size="small"

// DON'T use pixel numbers
<Box sx={{ width: 20, height: 20 }}>  // Wrong — use '2.5rem'

// Priority: size prop > fontSize with rem > spacing tokens > rem for dimensions
```

### DataGrid columns

```tsx
// Use width and minWidth — NEVER flex (breaks column resizing)
const columns: GridColDef[] = [
  {field: 'name', headerName: 'Name', width: 200, minWidth: 150},
  {field: 'email', headerName: 'Email', width: 250},
];
```

### Icons priority

```tsx
// 1. @alation/icons-neo — wrap with SvgIcon + use MuiIconButton from fabric-ui
import {SearchIcon, SettingsIcon} from '@alation/icons-neo';
import {SvgIcon} from '@mui/material';
import {MuiIconButton} from '@alation/fabric-ui';

<MuiIconButton aria-label={t('search', 'Search')}>
  <SvgIcon component={SearchIcon} />
</MuiIconButton>;

// 2. lucide-react — wrap with LucideIcon from fabric-ui
import {Filter, Download} from 'lucide-react';
import {LucideIcon} from '@alation/fabric-ui';

<LucideIcon component={Filter} />;

// 3. MUI icons (fallback)
import SearchIcon from '@mui/icons-material/Search';

// 4. Custom SVG (last resort)
import CustomIcon from './CustomIcon.svg';
```

---

## Internationalization (i18n)

**Zero hardcoded text strings. Every user-facing text must use `useTranslation`.**

### Pattern

```tsx
import {useTranslation} from 'react-i18next';

const MyComponent: FC = () => {
  const {t} = useTranslation('dataMarketplace', {
    keyPrefix: 'components.myComponent',
  });

  return (
    <Box>
      <Typography variant='h2'>{t('title', 'Default Title')}</Typography>
      <Typography variant='body1'>{t('description', 'Default description.')}</Typography>
      <Button>{t('actions.submit', 'Submit')}</Button>
      <Typography>{t('userGreeting', 'Hello, {{name}}!', {name: user.name})}</Typography>
    </Box>
  );
};
```

### Translation file

```json
// apps/alation/src/assets/locales/en/dataMarketplace.json
{
  "components": {
    "myComponent": {
      "actions": {"cancel": "Cancel", "submit": "Submit"},
      "description": "Default description.",
      "title": "Default Title",
      "userGreeting": "Hello, {{name}}!"
    }
  }
}
```

### Key naming

```
namespace.section.component.element
dataMarketplace → components → wizard → actions → next
```

With `keyPrefix: 'components.wizard'`, use `t('actions.next', 'Next')`.

### Rules

- Descriptive keys (`dataProduct.wizard.step1.title`), not generic (`title`, `text1`)
- Always provide fallback text: `t('key', 'Fallback')`
- Translate ARIA labels: `aria-label={t('actions.close', 'Close dialog')}`
- Handle plurals: `t('itemCount', '{{count}} item', { count })`

---

## Accessibility

### ARIA attributes

```tsx
// Dialog
<Dialog open={open} onClose={onClose}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <DialogTitle id="dialog-title">{t('dialog.title', 'Confirm Action')}</DialogTitle>
  <DialogContent id="dialog-description">{t('dialog.message', 'Are you sure?')}</DialogContent>
</Dialog>

// Icon button
<IconButton aria-label={t('actions.delete', 'Delete item')}><DeleteIcon /></IconButton>

// Form field
<TextField
  id="email-input"
  label={t('form.email', 'Email Address')}
  aria-describedby="email-helper-text"
  helperText={<span id="email-helper-text">{t('form.emailHelper', 'Enter your work email')}</span>}
/>
```

### Keyboard navigation

```tsx
<Box
  role='button'
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  aria-label={t('actions.openMenu', 'Open menu')}>
  {content}
</Box>
```

### Color contrast

```tsx
// Use theme colors (automatically meet WCAG standards)
<Typography sx={{ color: 'text.primary' }}>Primary text</Typography>
<Typography sx={{ color: 'text.secondary' }}>Secondary text</Typography>

// Avoid custom colors without verification
```

### Focus management

```tsx
const MyDialog: FC<{open: boolean}> = ({open}) => {
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogActions>
        <Button ref={firstFocusableRef}>{t('actions.confirm', 'Confirm')}</Button>
      </DialogActions>
    </Dialog>
  );
};
```

---

## Theme Support (Classic & Morpheus)

```tsx
// Use theme-aware colors — adapts automatically
<Box
  sx={{
    backgroundColor: 'background.paper',
    color: 'text.primary',
    borderColor: 'divider',
  }}>
  {content}
</Box>;

// Access theme directly when needed
const theme = useTheme();
<Box
  sx={{
    backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
  }}>
  {content}
</Box>;
```

---

## Component Architecture

### File structure

```
libs/my-domain/ui/src/lib/MyComponent/
├── MyComponent.tsx          # Main component (one per file)
├── MyComponent.test.tsx     # Integration tests
├── MyComponent.stories.tsx  # Storybook stories
└── index.ts                 # Barrel export
```

### Component template

```tsx
import {type FC} from 'react';
import {Box, Typography, Button} from '@mui/material';
import {useTranslation} from 'react-i18next';

// Alphabetize properties in interfaces and objects
export interface MyComponentProps {
  description?: string;
  disabled?: boolean;
  onSubmit: () => void;
  title: string;
}

export const MyComponent: FC<MyComponentProps> = ({title, description, onSubmit, disabled = false}) => {
  const {t} = useTranslation('namespace', {keyPrefix: 'components.myComponent'});

  return (
    <Box sx={{p: 3, backgroundColor: 'background.paper', borderRadius: 1}}>
      <Typography variant='h3' sx={{mb: 2}}>
        {title}
      </Typography>
      {description && (
        <Typography variant='body1' sx={{mb: 3, color: 'text.secondary'}}>
          {description}
        </Typography>
      )}
      <Button
        variant='contained'
        onClick={onSubmit}
        disabled={disabled}
        aria-label={t('actions.submit', 'Submit form')}>
        {t('actions.submit', 'Submit')}
      </Button>
    </Box>
  );
};
```

### Export pattern

```tsx
// index.ts — named exports only
export {MyComponent} from './MyComponent';
export type {MyComponentProps} from './MyComponent';

// NEVER: export default MyComponent;
```

---

## Forms & Validation

```tsx
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
});

const MyForm: FC = () => {
  const {t} = useTranslation('forms');

  return (
    <Formik
      initialValues={{email: '', name: ''}}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}>
      {({errors, touched}) => (
        <Form>
          <Field
            as={TextField}
            name='email'
            label={t('email.label', 'Email Address')}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
            fullWidth
            sx={{mb: 2}}
          />
          <Button type='submit' variant='contained'>
            {t('actions.submit', 'Submit')}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
```

---

## Nested Interactive Components

```tsx
<Card sx={{position: 'relative', cursor: 'pointer'}} onClick={handleCardClick}>
  <CardContent>
    <Typography variant='h6'>Card Title</Typography>
  </CardContent>
  <IconButton
    sx={{position: 'absolute', top: 8, right: 8}}
    onClick={(e) => {
      e.stopPropagation(); // Prevent card click
      handleDeleteClick();
    }}
    aria-label={t('actions.delete', 'Delete item')}>
    <DeleteIcon />
  </IconButton>
</Card>
```

---

## Notifications

```tsx
import {useToastV2} from '@alation/core-ui'; // NOT useToast

const {showToast} = useToastV2();

showToast({message: t('success.saved', 'Changes saved successfully'), severity: 'success'});
showToast({message: t('error.failed', 'Failed to save changes'), severity: 'error'});
```

---

## Common UI States

```tsx
// Loading
<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
  <CircularProgress aria-label={t('loading', 'Loading content')} />
</Box>

// Error
<Alert severity="error" sx={{ mb: 2 }}>
  {t('error.message', 'An error occurred while loading data')}
</Alert>

// Empty
<Box sx={{ textAlign: 'center', py: 8 }}>
  <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
    {t('empty.title', 'No items found')}
  </Typography>
  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
    {t('empty.subtitle', 'Try adjusting your filters')}
  </Typography>
</Box>

// Confirmation dialog
<Dialog open={open} onClose={onClose} aria-labelledby="confirm-dialog-title">
  <DialogTitle id="confirm-dialog-title">{t('confirm.title', 'Confirm Action')}</DialogTitle>
  <DialogContent>{t('confirm.message', 'Are you sure you want to proceed?')}</DialogContent>
  <DialogActions>
    <Button onClick={onClose}>{t('actions.cancel', 'Cancel')}</Button>
    <Button onClick={onConfirm} variant="contained" color="error">
      {t('actions.confirm', 'Confirm')}
    </Button>
  </DialogActions>
</Dialog>
```

---

## Testing

```tsx
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('MyComponent', () => {
  it('renders title and handles submit', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<MyComponent title='Test Title' onSubmit={handleSubmit} />);

    expect(screen.getByRole('heading', {name: 'Test Title'})).toBeInTheDocument();

    await user.click(screen.getByRole('button', {name: /submit/i}));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it('is accessible', async () => {
    const {container} = render(<MyComponent title='Test' onSubmit={vi.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## Storybook

```tsx
import type {Meta, StoryObj} from '@storybook/react';
import {MyComponent} from './MyComponent';

const meta = {
  title: 'Domain/MyComponent',
  component: MyComponent,
  parameters: {layout: 'centered'},
  tags: ['autodocs'],
  argTypes: {onSubmit: {action: 'submitted'}},
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {args: {title: 'Welcome', description: 'A description'}};
export const NoDescription: Story = {args: {title: 'Welcome'}};
export const Disabled: Story = {args: {title: 'Welcome', disabled: true}};
```

---

## Corner Cases

### Alphabetize properties

Always alphabetize properties in interfaces and object literals:

```tsx
// GOOD
export interface CardProps {
  description?: string;
  id: string;
  name: string;
  onClick?: (id: string) => void;
}

const styles = {
  alignItems: 'center',
  backgroundColor: 'grey.50',
  display: 'flex',
  padding: '1rem',
};

// BAD — non-alphabetized
export interface CardProps {
  id: string;
  name: string;
  description?: string; // Should be first
  onClick?: (id: string) => void;
}
```

### React keys — stable IDs only

```tsx
// GOOD: stable unique ID
{
  items.map((item) => <ListItem key={item.id}>{item.name}</ListItem>);
}

// BAD: array index causes re-render bugs
{
  items.map((item, index) => <ListItem key={index}>{item.name}</ListItem>);
}
```

### Props interface — always exported, never inline

```tsx
// GOOD
export interface DataProductCardProps {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
}

export function DataProductCard({ id, name }: DataProductCardProps) { ... }

// BAD: inline types
function DataProductCard({ id, name }: { id: string; name: string }) { ... }
```

### Event handler types

```tsx
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => { ... };
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};
```

### Container component pattern (data fetching)

```tsx
export function ProductList() {
  const {data, isLoading, error} = useGetProductsQuery();
  const {t} = useTranslation('namespace');

  if (isLoading) return <CircularProgress aria-label={t('loading', 'Loading')} />;
  if (error) return <Alert severity='error'>{t('error', 'Failed to load')}</Alert>;
  if (!data?.length) return <Typography>{t('empty', 'No items')}</Typography>;

  return (
    <Box>
      {data.map((item) => (
        <ProductCard key={item.id} {...item} />
      ))}
    </Box>
  );
}
```

### No console.log in committed code

Remove all `console.log` statements before committing.

---

## Anti-Patterns

| Don't /                                | Do instead                           |
| -------------------------------------- | ------------------------------------ |
| Hardcoded text strings                 | `useTranslation` with `t()`          |
| `flex` in DataGrid columns             | `width` and `minWidth`               |
| Inline styles / `style` prop           | `sx` prop                            |
| `setTimeout` in tests                  | `waitFor`                            |
| `useToast`                             | `useToastV2` from `@alation/core-ui` |
| Missing ARIA labels                    | `aria-label`, `aria-labelledby`      |
| `any` types                            | Proper TypeScript types              |
| Multiple components per file           | One component per file               |
| Default exports                        | Named exports only                   |
| `@emotion/styled` import               | `styled` from `@mui/material/styles` |
| `theme.palette.grey[800]`              | `'grey.800'` string notation         |
| `fontSize` in sx when size prop exists | `size="small"` prop                  |
| Pixel numbers for sizes (`width: 20`)  | rem units (`width: '2.5rem'`)        |
| `fontWeight`/`color` in Typography sx  | `variant`/`color` props + `<strong>` |
| Non-alphabetized properties            | Alphabetize interface & object props |
| Array index as React key               | Stable unique ID (`item.id`)         |
| Inline type `{ id: string }`           | Exported named interface             |
| `console.log` in committed code        | Remove before committing             |
