# SS-Fusion Utils Documentation

This document covers the utility functions, constants, and theming system that powers SS-Fusion components.

## Theme System

### Color Scheme

The default color scheme provides a comprehensive set of colors for consistent theming across all components.

```typescript
export const defaultColorScheme: ColorScheme = {
  Primary: Color3.fromRGB(59, 130, 246),    // Blue-500
  Secondary: Color3.fromRGB(107, 114, 128),  // Gray-500
  Accent: Color3.fromRGB(168, 85, 247),     // Purple-500
  Background: Color3.fromRGB(255, 255, 255), // White
  Surface: Color3.fromRGB(249, 250, 251),   // Gray-50
  OnPrimary: Color3.fromRGB(255, 255, 255), // White
  OnSecondary: Color3.fromRGB(255, 255, 255), // White
  OnBackground: Color3.fromRGB(17, 24, 39), // Gray-900
  OnSurface: Color3.fromRGB(55, 65, 81),    // Gray-700
  Error: Color3.fromRGB(239, 68, 68),       // Red-500
  Success: Color3.fromRGB(34, 197, 94),     // Green-500
  Warning: Color3.fromRGB(245, 158, 11),    // Amber-500
};
```

**Color Usage Guidelines:**

- **Primary**: Main action buttons, important UI elements
- **Secondary**: Less prominent buttons, secondary actions
- **Accent**: Special highlights, call-to-action elements
- **Background**: Main canvas color
- **Surface**: Cards, panels, elevated surfaces
- **On*** Colors**: Text colors that provide proper contrast
- **Error/Success/Warning**: Status indicators and feedback

### Design Tokens

#### Spacing System

Consistent spacing values following a 4px grid system:

```typescript
export const spacing = {
  xs: 4,    // Extra small - minimal gaps
  sm: 8,    // Small - compact layouts
  md: 16,   // Medium - standard spacing (default)
  lg: 24,   // Large - generous spacing
  xl: 32,   // Extra large - section spacing
  xxl: 48,  // Double extra large - major sections
  xxxl: 64, // Triple extra large - page-level spacing
} as const;
```

**Usage Examples:**

```typescript
// Using spacing in components
const container = New("Frame")({
  Size: new UDim2(1, -spacing.md * 2, 1, -spacing.md * 2), // Account for padding
  Position: new UDim2(0, spacing.md, 0, spacing.md),
});

// Layout with consistent spacing
const layout = LAYOUTS.Vertical(spacing.sm); // 8px between items
```

#### Typography Scale

Semantic font sizes for different content types:

```typescript
export const fontSizes = {
  xs: 12,   // Fine print, captions
  sm: 14,   // Small text, secondary labels
  md: 16,   // Body text (default)
  lg: 18,   // Emphasized text
  xl: 20,   // Subheadings
  xxl: 24,  // Section headings
  xxxl: 32, // Page titles, hero text
} as const;
```

**Typography Hierarchy:**

- **xxxl/xxl**: Page titles and major headings
- **xl/lg**: Section headings and emphasized content
- **md**: Standard body text and UI labels
- **sm/xs**: Secondary information and fine print

#### Border Radius Values

Consistent corner rounding for different UI elements:

```typescript
export const borderRadiusValues: Record<BorderRadius, number> = {
  none: 0,     // Sharp corners
  small: 4,    // Subtle rounding
  medium: 8,   // Standard rounding (default)
  large: 16,   // Pronounced rounding
  full: 9999,  // Fully rounded (pills, circles)
};
```

#### Z-Index System

Standardized layering for proper UI stacking:

```typescript
export const zIndex = {
  background: -1,   // Background elements
  base: 0,          // Standard UI elements (default)
  dropdown: 1000,   // Dropdown menus
  sticky: 1020,     // Sticky elements
  fixed: 1030,      // Fixed position elements
  modal: 1040,      // Modal dialogs
  popover: 1050,    // Popover content
  tooltip: 1060,    // Tooltip overlays
  toast: 1070,      // Notification toasts
} as const;
```

## UI Constants

### Component Sizes

Predefined sizes for common UI components:

```typescript
export const UI_SIZES = {
  BUTTON_COOLDOWN: new UDim2(0, 70, 0, 90), // Default size for cooldown button
  BUTTON_ICON: new UDim2(0, 50, 0, 50),     // Default size for icon button
  PROGRESS_BAR: new UDim2(0, 70, 0, 20),    // Default size for progress bar
};
```

### Flex Layout Helpers

Utility functions for creating flexible layout components:

```typescript
export const UI_FLEX_SIZES = {
  FLEX_SHRINK: () => {
    const flexItem = new Instance("UIFlexItem");
    flexItem.FlexMode = Enum.UIFlexMode.Shrink;
    return flexItem;
  },
  FLEX_GROW: () => {
    const flexItem = new Instance("UIFlexItem");
    flexItem.FlexMode = Enum.UIFlexMode.Grow;
    return flexItem;
  }
};
```

**Usage:**

```typescript
// Create a flexible container
const container = New("Frame")({
  Children: [
    UI_FLEX_SIZES.FLEX_GROW(), // This frame will grow to fill space
    someContent
  ]
});
```

### Layout Generators

Factory functions for common layout patterns:

```typescript
export const LAYOUTS = {
  Vertical: (spacing: number = 0) => {
    const layout = new Instance("UIListLayout");
    layout.FillDirection = Enum.FillDirection.Vertical;
    layout.SortOrder = Enum.SortOrder.LayoutOrder;
    layout.Padding = new UDim(0, spacing);
    return layout;
  },
  
  Horizontal: (spacing: number = 0) => {
    const layout = new Instance("UIListLayout");
    layout.FillDirection = Enum.FillDirection.Horizontal;
    layout.SortOrder = Enum.SortOrder.LayoutOrder;
    layout.Padding = new UDim(0, spacing);
    return layout;
  },
  
  Grid: (cellSize: UDim2, spacing: number = 0) => {
    const layout = new Instance("UIGridLayout");
    layout.CellSize = cellSize;
    layout.SortOrder = Enum.SortOrder.LayoutOrder;
    layout.CellPadding = UDim2.fromOffset(spacing, spacing);
    return layout;
  }
};
```

**Layout Examples:**

```typescript
// Vertical list with spacing
const verticalContainer = New("Frame")({
  Children: [
    LAYOUTS.Vertical(spacing.sm), // 8px spacing between items
    item1, item2, item3
  ]
});

// Horizontal toolbar
const toolbar = New("Frame")({
  Children: [
    LAYOUTS.Horizontal(spacing.xs), // 4px spacing between buttons
    button1, button2, button3
  ]
});

// Grid layout for inventory
const inventoryGrid = New("Frame")({
  Children: [
    LAYOUTS.Grid(new UDim2(0, 64, 0, 64), spacing.xs), // 64x64 cells with 4px spacing
    ...inventoryItems
  ]
});
```

## Utility Functions

### Theme Utilities

#### Color Manipulation

```typescript
// Helper function to create color variations
function darkenColor(color: Color3, amount: number): Color3 {
  const h, s, v = color:ToHSV();
  return Color3.fromHSV(h, s, math.max(0, v - amount));
}

function lightenColor(color: Color3, amount: number): Color3 {
  const h, s, v = color:ToHSV();
  return Color3.fromHSV(h, s, math.min(1, v + amount));
}
```

#### Responsive Sizing

```typescript
// Calculate responsive sizes based on screen dimensions
function getResponsiveSize(baseSize: UDim2, screenSize: Vector2): UDim2 {
  const scale = math.min(screenSize.X / 1920, screenSize.Y / 1080);
  return new UDim2(
    baseSize.X.Scale,
    baseSize.X.Offset * scale,
    baseSize.Y.Scale,
    baseSize.Y.Offset * scale
  );
}
```

### Animation Helpers

Common animation patterns for UI transitions:

```typescript
// Smooth value transitions
function animateToValue(
  stateObject: Fusion.StateObject<number>, 
  targetValue: number, 
  duration: number = 0.3
): void {
  const startValue = stateObject.get();
  const startTime = tick();
  
  const connection = RunService.RenderStepped.Connect(() => {
    const elapsed = tick() - startTime;
    const progress = math.min(elapsed / duration, 1);
    
    // Smooth easing function
    const easedProgress = 1 - math.pow(1 - progress, 3);
    const currentValue = startValue + (targetValue - startValue) * easedProgress;
    
    stateObject.set(currentValue);
    
    if (progress >= 1) {
      connection.Disconnect();
    }
  });
}
```

### Layout Helpers

#### Auto-sizing Containers

```typescript
// Create containers that auto-size to content
function createAutoSizingFrame(direction: "X" | "Y" | "XY"): Frame {
  const frame = new Instance("Frame");
  const constraint = new Instance("UISizeConstraint");
  
  if (direction === "X" || direction === "XY") {
    constraint.MaxSize = new Vector2(math.huge, constraint.MaxSize.Y);
  }
  if (direction === "Y" || direction === "XY") {
    constraint.MaxSize = new Vector2(constraint.MaxSize.X, math.huge);
  }
  
  constraint.Parent = frame;
  return frame;
}
```

#### Padding Utilities

```typescript
// Quick padding creation
function createPadding(all: number): UIPadding;
function createPadding(vertical: number, horizontal: number): UIPadding;
function createPadding(top: number, right: number, bottom: number, left: number): UIPadding;
function createPadding(...args: number[]): UIPadding {
  const padding = new Instance("UIPadding");
  
  if (args.length === 1) {
    // All sides
    const value = new UDim(0, args[0]);
    padding.PaddingTop = value;
    padding.PaddingRight = value;
    padding.PaddingBottom = value;
    padding.PaddingLeft = value;
  } else if (args.length === 2) {
    // Vertical, horizontal
    const vertical = new UDim(0, args[0]);
    const horizontal = new UDim(0, args[1]);
    padding.PaddingTop = vertical;
    padding.PaddingBottom = vertical;
    padding.PaddingRight = horizontal;
    padding.PaddingLeft = horizontal;
  } else if (args.length === 4) {
    // Top, right, bottom, left
    padding.PaddingTop = new UDim(0, args[0]);
    padding.PaddingRight = new UDim(0, args[1]);
    padding.PaddingBottom = new UDim(0, args[2]);
    padding.PaddingLeft = new UDim(0, args[3]);
  }
  
  return padding;
}
```

## Best Practices

### Theme Consistency

Always use theme values instead of hardcoded values:

```typescript
// ✅ Good - uses theme colors
const button = Button({
  text: "Save",
  // Uses theme color automatically
});

// ❌ Bad - hardcoded colors
const button = New("TextButton")({
  BackgroundColor3: Color3.fromRGB(100, 150, 200), // Inconsistent
});
```

### Spacing Consistency

Use the spacing system for all measurements:

```typescript
// ✅ Good - consistent spacing
const container = New("Frame")({
  Size: new UDim2(1, -spacing.md * 2, 1, -spacing.md * 2),
  Position: new UDim2(0, spacing.md, 0, spacing.md),
});

// ❌ Bad - arbitrary values
const container = New("Frame")({
  Size: new UDim2(1, -25, 1, -18), // Inconsistent values
});
```

### Performance Considerations

- Use computed values for derived state
- Minimize the number of state objects
- Clean up connections when components are destroyed
- Use appropriate z-index values to avoid overdraw

### Accessibility

- Ensure sufficient color contrast using "On" colors
- Provide text alternatives for icon-only buttons
- Use semantic sizes and spacing for touch targets
- Test with different screen sizes and orientations

---

For more information about using these utilities, see the [main documentation](../README.md) and component examples.
