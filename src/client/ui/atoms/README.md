# SS-Fusion Atoms

Atoms are the foundational building blocks of the SS-Fusion component library. They represent the smallest, most basic UI elements that can be combined to create more complex components.

## Overview

Each atom is designed to:
- ✅ **Single Responsibility**: Handle one specific UI concern
- ✅ **Theme Integration**: Use consistent colors and styling
- ✅ **Type Safety**: Provide comprehensive TypeScript interfaces
- ✅ **Reactive**: Support Fusion's reactive state system
- ✅ **Composable**: Work well together in larger components

## Available Atoms

### Avatar
Roblox user thumbnails with shape and border options. Defaults to the local player's UserId when not provided.

```typescript
import { Avatar } from "ss-fusion/atoms";

// Local player, circular, medium preset (~100x100)
const me = Avatar({ size: "medium", shape: "circle" });

// Specific user, square, border, explicit 64px
const other = Avatar({
  userId: 123456,
  shape: "square",
  showBorder: true,
  borderColor: Color3.fromRGB(200, 200, 200),
  Size: UDim2.fromOffset(64, 64)
});

// Rounded, large preset, with custom placeholder
const withPlaceholder = Avatar({
  size: "large",
  shape: "rounded",
  placeholderImage: ImageConstants.DefaultUnassigned,
});
```

**Shapes**: `circle` | `square` | `rounded`

**Sizes**: `small` (48) | `medium` (100) | `large` (180)

### �🔘 Button
Unified button component supporting both text and icon modes with multiple variants.

```typescript
import { Button } from "ss-fusion";

// Text button
const saveButton = Button({
  text: "Save",
  variant: "primary",
  onClick: () => saveData()
});

// Icon button
const settingsButton = Button({
  icon: "rbxassetid://123456789",
  variant: "icon",
  size: "medium",
  onClick: () => openSettings()
});
```

**Variants**: `primary` | `secondary` | `accent` | `danger` | `ghost` | `icon`

**Sizes**: `small` | `medium` | `large`

### 📝 Label
Text display component with typography variants and theming.

```typescript
import { Label } from "ss-fusion";

// Heading text
const title = Label({
  text: "Welcome to SS-Fusion",
  variant: "heading"
});

// Body text with custom color
const description = Label({
  text: playerDescription,
  variant: "body",
  textColor: Color3.fromRGB(200, 200, 200)
 
});
```

**Variants**: `heading` | `body` | `caption` | `small`

### 📊 ProgressBar
Progress visualization for health, mana, experience, and other metrics.

```typescript
import { ProgressBar } from "ss-fusion";

// Health bar
const healthBar = ProgressBar({
  progress: currentHealth,
  maxValue: maxHealth,
  fillColor: Color3.fromRGB(255, 100, 100),
  showLabel: true
});

// Experience bar (percentage mode)
const xpBar = ProgressBar({
  progress: expPercentage, // 0.0 to 1.0
  fillColor: Color3.fromRGB(100, 255, 100),
  showLabel: true
});
```
 

**Modes**: Percentage (0-1) or Absolute (current/max)

**Directions**: `horizontal` | `vertical`

### ✏️ TextBox
Text input component with validation and theming.

```typescript
import { TextBox } from "ss-fusion";

// Simple input
const nameInput = TextBox({
  placeholder: "Enter your name...",
  onChanged: (text) => setPlayerName(text)
});

// Validated input
const emailInput = TextBox({
  placeholder: "Email address",
  validate: (text) => text.includes("@"),
  variant: "error" // Shows red border if validation fails
});
 
```

**Variants**: `default` | `error` | `success`
**Sizes**: `small` | `medium` | `large`

### 🖼️ SlicedImage
9-slice scaled images for scalable borders and panels.

```typescript
import { SlicedImage } from "ss-fusion";

// Border frame
const border = SlicedImage({
  imageId: "rbxassetid://80375133768026",
  sliceCenter: new Rect(130, 130, 130, 130),
  sliceScale: 0.5
});

// Colored panel
const panel = SlicedImage({
  imageId: ImageConstants.Borders.GothicMetal,
  imageColor: Color3.fromRGB(100, 150, 255)
});
```

## Usage Patterns
 

### Reactive State
All atoms support Fusion's reactive state system:

```typescript
import { Value } from "@rbxts/fusion";

const playerHealth = Value(100);
const maxHealth = Value(100);

const healthBar = ProgressBar({
  progress: playerHealth,
  maxValue: maxHealth,
  fillColor: Color3.fromRGB(255, 100, 100)
});

// Health bar automatically updates when values change
playerHealth.set(75); // Bar immediately reflects the change
```

### Theme Integration
Atoms automatically use theme colors but allow overrides:


```typescript

 
// Uses theme colors

const button = Button({
  text: "Default",

  variant: "primary" // Uses theme Primary color
});


// Custom colors

const customButton = Button({
  text: "Custom",

  backgroundImage: "rbxassetid://123",
  iconColor: Color3.fromRGB(255, 100, 100)

});
```



### Composition
Atoms are designed to work well together:

```typescript
// User profile example using multiple atoms
const createUserProfile = (userId: number) => {

  const username = Value("Player123");
  const isOnline = Value(true);

  const health = Value(85);
  const maxHealth = Value(100);

  
  return [
    // Profile header with avatar
    Avatar({
      UserId: userId,
      Size: new UDim2(0, 64, 0, 64),
      Shape: "Circle",
      ShowStatus: true,
      StatusColor: isOnline.get() ? Color3.fromRGB(34, 197, 94) : Color3.fromRGB(156, 163, 175)
    }),
    
    Label({ 
      text: username, 
      variant: "heading" 
    }),
    
    // Health display
    Label({ 
      text: "Health", 
      variant: "caption" 
    }),
    
    ProgressBar({
      progress: health,
      maxValue: maxHealth,
      fillColor: Color3.fromRGB(255, 100, 100),
      showLabel: true
    }),
    
    Button({
      text: "View Profile",
      variant: "primary",
      onClick: () => openProfile(userId)
    })
  ];
};
```

## Best Practices

### 1. Use Appropriate Variants
Choose variants that match the semantic meaning:
- `primary` - Main actions (Save, Submit, Continue)
- `secondary` - Secondary actions (Cancel, Back)
- `danger` - Destructive actions (Delete, Remove)
- `ghost` - Subtle actions (Close, Minimize)

### 2. Maintain Consistency
Use consistent sizing and spacing:

```typescript
// Good - consistent sizing
const buttons = [
  Button({ text: "Save", size: "medium" }),
  Button({ text: "Cancel", size: "medium", variant: "secondary" })
];

// Avoid - inconsistent sizing
const badButtons = [
  Button({ text: "Save", size: "large" }),
  Button({ text: "Cancel", size: "small" })
];
```

### 3. Leverage Reactive State
Use Fusion's reactive system for dynamic UIs:

```typescript
const isLoading = Value(false);
const buttonText = Computed(() => isLoading.get() ? "Loading..." : "Submit");

const submitButton = Button({
  text: buttonText,
  disabled: isLoading,
  onClick: () => handleSubmit()
});
```

### 4. Validate User Input
Always validate user input in TextBox components:

```typescript
const passwordInput = TextBox({
  placeholder: "Password",
  validate: (text) => {
    return text.length >= 8 && /[A-Z]/.test(text) && /[0-9]/.test(text);
  },
  variant: "error" // Will show if validation fails
});
```

## Type Safety

All atoms provide comprehensive TypeScript interfaces:

```typescript
import type { ButtonProps, LabelProps, ProgressBarProps } from "ss-fusion";

// Fully typed component props
const createButton = (props: ButtonProps) => {
  return Button({
    ...props,
    onClick: () => props.onClick?.() // Type-safe optional chaining
  });
};
```

## Performance Considerations

- **Reactive Updates**: Only the necessary parts of atoms update when state changes
- **Event Handling**: Event handlers are properly cleaned up by Fusion
- **Memory Usage**: Atoms are lightweight and don't create excessive instances
- **Rendering**: Use `Computed` for complex calculations to avoid unnecessary recalculations

## Migration Guide

If you're migrating from separate IconButton and Button components:

```typescript
// Old way
import { IconButton, Button } from "./old-atoms";

const textBtn = Button({ text: "Save" });
const iconBtn = IconButton({ icon: "rbxassetid://123" });

// New way
import { Button } from "ss-fusion";

const textBtn = Button({ text: "Save" });
const iconBtn = Button({ icon: "rbxassetid://123", variant: "icon" });
```

## Contributing

When creating new atoms:

1. Follow the single responsibility principle
2. Use theme colors by default with override options
3. Provide comprehensive TypeScript interfaces
4. Include JSDoc documentation with examples
5. Support both static and reactive props where appropriate
6. Write usage examples in the documentation
