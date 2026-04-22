# License Overview Interface Specification

## Overview

The License Overview page provides administrators with a clear, actionable view of their Alation license consumption across all feature categories. The interface addresses key usability issues from the previous implementation by eliminating confusing donut charts, implementing proper threshold-based warnings, and organizing information into scannable categories.

## Core Design Principles

### 1. **Threshold-Based Warnings**
- Visual warnings only appear when genuinely needed (≥95% utilization)
- Prevents "alert fatigue" by avoiding false alarms
- Uses minimal color coding: blue (healthy) → red (critical only)

### 2. **Clear License vs Role Distinction** 
- Licenses = what you purchase (billing concern)
- Roles = what you assign to users (permission concern)
- Educational content bridges this gap for administrators

### 3. **Scannable Information Hierarchy**
- Contract information in header (always visible)
- Organized by functional categories
- Clean metric cards without visual clutter

### 4. **Minimal Color Strategy**
- Neutral gray for unlimited badges and secondary elements
- Blue for healthy progress states (good contrast, not alarming)
- Red reserved exclusively for critical alerts (95%+ usage)
- Eliminates intermediate warning colors that create visual noise

---

## Data Structure

### LicenseMetric Interface
```typescript
interface LicenseMetric {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  type: "unlimited" | "limited"; // License type
  category: "core" | "data-products" | "automation" | "users";
  current?: number;              // Current usage
  allocated?: number;            // Allocated amount (limited only)
  unit: string;                  // Display unit
  description?: string;          // Optional description for user licenses
}
```

### Category Organization
- **Data Catalog**: Core platform features (Standard Objects, AI Descriptions, Data Quality)
- **Data Products Starter**: Product-related features (Data Products, Chat, Conversations)
- **Curation Automation**: AI and automation tools (AI Actions, Pack Purchases)
- **User Licenses**: License types with role explanations

---

## Visual Design Specifications

### Layout Structure
1. **Fixed Header**: Sticky header with contract information and alerts
2. **Max Width**: 1200px centered container for content area
3. **Card Grid**: Responsive grid (320-400px cards, centered)
4. **Category Sections**: Clear section headers with contextual actions

### Typography Hierarchy
- **Page Title**: H1, 28px, 600 weight
- **Section Headers**: 11px uppercase, 700 weight, letter-spacing 0.8px
- **Card Titles**: 14px, 600 weight
- **Metric Values**: 18px, 600 weight (not overwhelming the page title)
- **Utilization Percentages**: 14px, 600 weight

### Color Usage
- **Progress Bars**: Blue (#0072DD) for healthy state → Red (#F04438) at 95%+ critical
- **Percentage Text**: Primary text color → Red at 95%+ critical
- **Warning Icons**: Red (#F04438) triangle, appears at 95%+ only
- **Unlimited Badges**: Neutral gray (#6B7280) for minimal visual impact

---

## Utilization Thresholds

### Threshold Logic
```typescript
const getThresholdStatus = (percentage: number) => {
  if (percentage >= 95) return "critical";  // Red indicators
  return "healthy";                         // Blue/default indicators
}
```

### Visual Indicators by Threshold
- **0-94%**: Blue progress bar, primary text color, no warning icon
- **95%+**: Red progress bar, red text, warning triangle icon

### Header Alert Logic
- No alert chips shown in header for cleaner visual design
- Critical warnings appear directly on affected license cards at 95%+
- Simplified approach eliminates header visual clutter

---

## License Type Rendering

### Unlimited Features
```typescript
// Visual indicators:
// - Infinity icon (14px) in neutral gray (#6B7280)
// - "Unlimited" text badge (neutral gray)
// - Usage count with unit
// - No progress bars or percentages
// - Role descriptions shown for user licenses (consistent across all license types)
```

### Limited Features
```typescript
// Visual indicators:
// - Usage count and allocation
// - Percentage with threshold-based coloring (red at 95%+)
// - Progress bar with threshold-based coloring (blue → red at 95%+)
// - Warning icon only if ≥95%
// - "X remaining" helper text
// - Role descriptions shown for user licenses (consistent with unlimited)
```

### Special Cases
- **Pack Purchases**: Shows empty state message when count = 0
- **User Licenses**: Include role descriptions consistently across unlimited and limited types
  - Creator Licenses: "For admin and content creation roles: Server Admin, Catalog Admin, Source Admin, Steward, Composer"
  - Explorer Licenses: "For analysis roles: Explorer (run query forms, analyze data)"
  - Viewer Licenses: "For read-only access: Viewer (browse, search, participate in conversations)"

---

## Modal Specifications

### Object Breakdown Modal
**Triggers**: "View breakdown" on Standard Objects and Data Quality Starter
**Content**: 
- Sortable table by count (descending)
- Standard Objects: All catalog object types with counts
- Data Quality: Objects with DQ checks applied (Tables, Columns)
- Running total at bottom

### Compare User Roles Modal
**Trigger**: "Compare User Roles" button in User Licenses section
**Content**:
- Permissions matrix (roles × permissions)
- License type indicators on each role
- Detailed permission descriptions behind info icons
- No redundant legend (license colors are self-evident)

### Modal Design Pattern
- **Header**: H2 title (20px, left-aligned), X button (right-aligned)
- **Content**: No description header, content starts immediately
- **Styling**: Consistent with design system modal patterns

---

## Responsive Behavior

### Grid Responsiveness
- **Desktop**: Auto-fit grid, 320-400px cards, centered within max-width
- **Tablet**: 2-column grid when space permits
- **Mobile**: Single column stack

### Header Responsiveness
- Contract information may wrap on smaller screens
- Alert chips stack vertically if needed
- Core information always visible

### Button Behavior
- User management buttons use `whiteSpace: "nowrap"` to prevent internal wrapping
- Buttons may wrap to new line as container group

---

## Edge Cases and States

### Empty/Zero States
- **Pack Purchases**: "No packs purchased yet. Packs expand your AI Action allotment."
- **Zero Usage**: Show "—" with "no usage yet" subtitle
- **Missing Data**: Graceful fallbacks, don't break calculations

### High Usage States
- **100%+ Usage**: Progress bar caps at 100% visual width
- **Critical Thresholds**: Red coloring takes precedence
- **Multiple Warnings**: Header shows total count

### Contract Status
- **Active Contract**: Green dot indicator
- **Expiring Soon**: Could add warning states (not implemented in prototype)
- **Long-term Contracts**: Handle display gracefully (don't show 197-year warnings)

---

## Implementation Notes

### Data Fetching
- License metrics should be fetched with current usage and allocations
- Object breakdown data fetched on-demand (modal open)
- Role permissions can be static configuration

### State Management
- Threshold calculations performed client-side for responsiveness
- Modal state managed locally per component
- Production implementation uses mixed state data directly (no scenario switching)

### Performance Considerations
- Lazy load modal content
- Debounce threshold recalculations if data updates frequently
- Consider virtualization for large object breakdown tables

### Accessibility
- Proper heading hierarchy (H1 → H2 for modals)
- Color is not the only indicator (icons accompany color changes)
- Tooltips have proper ARIA labels
- Modal focus management

---

## Key Differences from Original

### Eliminated Problems
- **Confusing donut charts**: Replaced with clear progress bars and infinity indicators
- **Always-on warnings**: Implemented proper 95% critical-only threshold
- **Poor visual hierarchy**: Cleaned up typography scale and spacing
- **Unclear unlimited vs limited**: Clear visual distinction with appropriate indicators
- **Visual clutter**: Simplified to minimal color palette with strategic red for critical alerts only

### Enhanced Functionality
- **Breakdown modals**: Detailed object type analysis
- **Role comparison**: Educational tool bridging license/role gap
- **Threshold intelligence**: Warnings only when genuinely needed (95%+ critical)
- **Consistent user education**: Role descriptions shown across all user license types
- **Responsive layout**: Proper mobile/tablet behavior
- **Minimal visual design**: Clean interface focused on essential information

### Architectural Improvements
- **Component modularity**: Reusable modal and card components  
- **Type safety**: Strong TypeScript interfaces
- **Consistent design**: Follows established design system patterns
- **Maintainable thresholds**: Centralized logic for easy adjustment

---

## Future Considerations

### Potential Enhancements
- Historical usage trends in modals
- License renewal workflow integration
- Bulk user management from license page
- Advanced threshold customization
- Export functionality for compliance reporting

### Monitoring Integration
- Real-time usage updates
- Alert system integration for approaching limits
- Analytics on license utilization patterns
- Automated recommendations for license optimization

## Production Implementation Updates

### Key Changes from Original Specification
- **Simplified threshold logic**: Only 95%+ shows critical warnings (eliminated 85% orange state)
- **Minimal color palette**: Gray unlimited badges, blue progress bars, red critical alerts only
- **Consistent user education**: Role descriptions shown on all user license types regardless of unlimited/limited status
- **Clean header design**: Removed alert chips for minimal visual clutter
- **Single warning state**: Eliminated intermediate warning colors and icons

### Critical Implementation Notes
```typescript
// Updated threshold logic - single critical state only
const getActualStatus = (percentage: number) => {
  if (percentage >= 95) return "critical";  // Red indicators
  return "healthy";                         // Blue/default indicators
}

// Unlimited badge styling - neutral gray
const unlimitedBadgeStyle = {
  color: "#6B7280",  // Gray text and icon
  backgroundColor: "transparent"
}

// User license descriptions - consistent across types
const showUserLicenseDescription = (metric) => {
  return metric.category === "users" && metric.description;
}
```

This specification provides the complete blueprint for the production License Overview interface with simplified visual design, focused warning system, and consistent user education patterns.