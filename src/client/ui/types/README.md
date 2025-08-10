# SS-Fusion Types Documentation

This document provides comprehensive information about the TypeScript interfaces and type definitions used throughout the SS-Fusion component library.

## Core Interfaces

### BaseProps

The foundational interface that all SS-Fusion components extend from.

```typescript
export interface BaseProps {
  /** Optional children elements */
  Children?: Instance[];
  /** Whether the component is visible */
  Visible?: CanBeState<boolean>;
  /** CSS-like positioning and sizing */
  Size?: CanBeState<UDim2>;
  Position?: CanBeState<UDim2>;
  AnchorPoint?: CanBeState<Vector2>;
  /** Z-index for layering */
  ZIndex?: CanBeState<number>;
  /** Layout order for automatic layouts */
  LayoutOrder?: CanBeState<number>;
}
```

**Usage Example:**
```typescript
const myComponent = SomeComponent({
  Size: new UDim2(0, 200, 0, 50),
  Position: new UDim2(0.5, -100, 0.5, -25),
  AnchorPoint: new Vector2(0.5, 0.5),
  Visible: Value(true), // Reactive visibility
  ZIndex: 5
});
```

### InteractableProps

Extended interface for components that respond to user interaction.

```typescript
export interface InteractableProps extends BaseProps {
  /** Whether the component can be interacted with */
  Interactable?: CanBeState<boolean>;
  /** Callback for when the component is activated */
  OnActivated?: () => void;
  /** Callback for when the component is hovered */
  OnMouseEnter?: () => void;
  /** Callback for when the component stops being hovered */
  OnMouseLeave?: () => void;
}
```

## Component-Specific Interfaces

### ButtonProps

Comprehensive interface for the unified Button component.

```typescript
export interface ButtonProps extends Fusion.PropertyTable<Frame> {
  text?: Fusion.StateObject<string> | string;
  icon?: string;
  backgroundImage?: string;
  variant?: "primary" | "secondary" | "accent" | "danger" | "ghost" | "icon";
  size?: "small" | "medium" | "large";
  disabled?: Fusion.StateObject<boolean> | boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children?: Instance[];
  iconColor?: Color3;
  iconSize?: number;
}
```

**Key Properties:**

- **`text`**: Button text content (for text buttons)
  - Can be static string or reactive StateObject
  - Example: `"Save"`, `Value("Dynamic Text")`

- **`icon`**: Icon asset ID (for icon buttons)
  - Should be valid Roblox asset ID string
  - Example: `"rbxassetid://123456789"`

- **`variant`**: Visual styling variant
  - `primary`: Main action button (blue theme)
  - `secondary`: Secondary action (gray theme)
  - `accent`: Special highlight (purple theme)
  - `danger`: Destructive actions (red theme)
  - `ghost`: Transparent with border
  - `icon`: Optimized for icon-only buttons

- **`size`**: Button dimensions and font size
  - `small`: 32px height, 14px font
  - `medium`: 40px height, 16px font (default)
  - `large`: 48px height, 18px font

### LabelProps

Interface for the typography Label component.

```typescript
export interface LabelProps extends Fusion.PropertyTable<TextLabel> {
  text: Fusion.StateObject<string> | string;
  variant?: "heading" | "subheading" | "body" | "caption";
  textColor?: Color3;
  textStroke?: boolean;
  textStrokeColor?: Color3;
  textStrokeTransparency?: number;
  textWrapped?: boolean;
  richText?: boolean;
}
```

**Typography Variants:**

- **`heading`**: Large, bold text for titles (24px)
- **`subheading`**: Medium emphasis text (20px)
- **`body`**: Standard content text (16px, default)
- **`caption`**: Small descriptive text (14px)

### TextBoxProps

Interface for the input TextBox component.

```typescript
export interface TextBoxProps extends Fusion.PropertyTable<Frame> {
  placeholder?: string;
  value?: Fusion.StateObject<string>;
  multiline?: boolean;
  maxLength?: number;
  clearTextOnFocus?: boolean;
  disabled?: Fusion.StateObject<boolean> | boolean;
  validate?: (text: string) => boolean;
  variant?: "default" | "error" | "success";
  size?: "small" | "medium" | "large";
  onChanged?: (newText: string) => void;
  onFocused?: () => void;
  onFocusLost?: (enterPressed: boolean) => void;
}
```

**Key Features:**

- **Validation**: Built-in validation with visual feedback
- **Reactive State**: Controlled by external state objects
- **Multi-line Support**: For longer text input
- **Character Limits**: Automatic truncation

### ProgressBarProps

Interface for progress visualization components.

```typescript
export interface ProgressBarProps extends Fusion.PropertyTable<Frame> {
  progress: Fusion.StateObject<number>;
  maxValue?: Fusion.StateObject<number>;
  fillColor?: Color3;
  backgroundColor?: Color3;
  direction?: "horizontal" | "vertical";
  showLabel?: boolean;
  labelText?: Fusion.StateObject<string> | string;
  labelColor?: Color3;
  minSize?: number;
  animate?: boolean;
  animationDuration?: number;
}
```

**Progress Calculation:**

- **With maxValue**: `progress.get() / maxValue.get()` (e.g., 75/100 = 0.75)
- **Without maxValue**: `progress.get()` as percentage (0.0 to 1.0)

### SlicedImageProps

Interface for 9-slice scalable image components.

```typescript
export interface SlicedImageProps extends Fusion.PropertyTable<ImageLabel> {
  imageId: string;
  sliceCenter?: Rect;
  sliceScale?: number;
  imageColor?: Color3;
  backgroundColor?: Color3;
  backgroundTransparency?: number;
}
```

### CooldownButtonProps

Interface for the composite CooldownButton molecule.

```typescript
export interface CooldownButtonProps extends Fusion.PropertyTable<Frame> {
  icon: string;
  cooldown: number;
  onClick?: () => void;
  onHover?: () => void;
}
```

## Theming Interfaces

### ColorScheme

Comprehensive color scheme interface for theming.

```typescript
export interface ColorScheme {
  Primary: Color3;
  Secondary: Color3;
  Accent: Color3;
  Background: Color3;
  Surface: Color3;
  OnPrimary: Color3;
  OnSecondary: Color3;
  OnBackground: Color3;
  OnSurface: Color3;
  Error: Color3;
  Success: Color3;
  Warning: Color3;
}
```

**Color Usage Guidelines:**

- **Primary/Secondary/Accent**: Main brand colors for components
- **Background/Surface**: Canvas and card colors
- **On*** Colors**: Text colors that contrast with background colors
- **Error/Success/Warning**: Semantic state colors

### BorderRadius

Type definition for consistent border radius values.

```typescript
export type BorderRadius = "none" | "small" | "medium" | "large" | "full";
```

## Utility Types

### State Management

SS-Fusion leverages Fusion's reactive state system:

```typescript
// Fusion state object for reactive values
const reactiveText = Value("Initial Text");
const computedValue = Computed(() => `Count: ${counter.get()}`);

// Components accept both static and reactive values
const label = Label({
  text: "Static Text",        // Static string
  // OR
  text: reactiveText,         // Reactive state
  // OR  
  text: computedValue         // Computed reactive value
});
```

### Event Handlers

Standard event handler patterns:

```typescript
// Simple callback functions
onClick?: () => void;
onChanged?: (newValue: string) => void;
onFocusLost?: (enterPressed: boolean) => void;

// Usage example
const button = Button({
  text: "Click Me",
  onClick: () => {
    print("Button clicked!");
    // Handle button click
  }
});
```

## Type Safety Best Practices

### Generic Component Creation

When creating new components, follow these patterns:

```typescript
// Extend the appropriate Fusion PropertyTable
export interface MyComponentProps extends Fusion.PropertyTable<Frame> {
  // Component-specific props
  customProp: string;
  // Support both static and reactive values
  dynamicProp?: Fusion.StateObject<boolean> | boolean;
}

// Return the correct Roblox instance type
export function MyComponent(props: MyComponentProps): Frame {
  // Implementation
}
```

### Reactive State Handling

Handle both static and reactive props safely:

```typescript
// In component implementation
const isEnabled = Computed(() => {
  if (typeIs(props.enabled, "boolean")) {
    return props.enabled;
  } else if (props.enabled) {
    return props.enabled.get();
  }
  return true; // default value
});
```

### Type Guards

Use TypeScript type guards for runtime safety:

```typescript
function isStateObject<T>(value: T | Fusion.StateObject<T>): value is Fusion.StateObject<T> {
  return typeIs(value, "table") && "get" in (value as any);
}
```

## Import Patterns

### Recommended Imports

```typescript
// Import specific components
import { Button, Label, ProgressBar } from "@trembus/ss-fusion";

// Import types when needed
import type { ButtonProps, ColorScheme } from "@trembus/ss-fusion";

// Import Fusion for state management
import Fusion, { Value, Computed } from "@rbxts/fusion";
```

### Type-Only Imports

For better tree-shaking and cleaner builds:

```typescript
import type { 
  ButtonProps, 
  LabelProps, 
  ColorScheme 
} from "@trembus/ss-fusion";
```

This documentation provides the complete type reference for SS-Fusion. For usage examples and component guides, see the main [README](../README.md) and component-specific documentation.
