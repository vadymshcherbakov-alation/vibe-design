# Design System Spacing Guide

Based on the NEO Fabric Design System, this application now uses a systematic spacing approach that follows the principle: **External spacing is always greater than internal spacing.**

## Spacing Hierarchy

### Micro Spacing (Within Components)
- **`xxs: 2px`** - Micro spacing within components, icon-to-text gaps
- **`xs: 4px`** - Small spacing within components, between related elements

### Component-Level Spacing  
- **`sm: 8px`** - Separate related elements, small padding
  - Use for: Related form elements, button groups, small cards padding

### Element Separation
- **`md: 16px`** - Separate unrelated elements or groups, normal padding  
  - Use for: Form sections, card padding, button spacing

### Content Sections
- **`lg: 24px`** - Separate sub-sections of content
  - Use for: Between different content blocks, major component spacing

### Major Sections
- **`xl: 32px`** - Separate sections of content
  - Use for: Page sections, major layout divisions

### Layout Spacing
- **`2xl: 48px`** - Major layout sections
- **`3xl: 64px`** - Page-level sections

## Usage in Components

### Via MUI Spacing Function
```tsx
// These map directly to design system values
sx={{ 
  p: 1,    // 8px padding (sm)
  m: 2,    // 16px margin (md)  
  gap: 3,  // 24px gap (lg)
  py: 4,   // 32px top/bottom padding (xl)
}}
```

### Via Design Tokens
```tsx
sx={{ 
  padding: `${theme.tokens.spacing.md}px`,     // 16px
  marginBottom: `${theme.tokens.spacing.lg}px`, // 24px
  gap: `${theme.tokens.spacing.sm}px`,          // 8px
}}
```

### Semantic Usage Examples

```tsx
// Form field spacing
<Box sx={{ gap: 1 }}>           {/* 8px between related fields */}

// Section separation  
<Box sx={{ mb: 3 }}>            {/* 24px below content sections */}

// Page layout
<Box sx={{ p: 2, gap: 4 }}>    {/* 16px padding, 32px between sections */}

// Component internal spacing
<Button sx={{ px: 1.5, py: 0.5 }}> {/* 12px horizontal, 4px vertical */}
```

## Design Principles

1. **Hierarchical Spacing**: Spacing increases as you move outward from component center
2. **Consistent Relationships**: Use the predefined values to maintain visual rhythm  
3. **Semantic Usage**: Choose spacing based on content relationships, not arbitrary values
4. **Progressive Disclosure**: Larger spacing creates clearer content boundaries

## Available Throughout App

The spacing system is now available via:
- `theme.spacing(factor)` - MUI's spacing function
- `theme.tokens.spacing.*` - Direct access to design tokens
- Component overrides automatically use the new system