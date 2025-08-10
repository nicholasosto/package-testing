/**
 * @fileoverview SS-Fusion Atoms Documentation
 * @description Complete API reference and usage guide for all atomic components.
 * 
 * This file provides a comprehensive overview of all atoms in the SS-Fusion
 * component library, including their interfaces, usage patterns, and examples.
 */

export * from "./Button";
export * from "./Label";
export * from "./TextBox";
export * from "./ProgressBar";
export * from "./SlicedImage";
export * from "./Avatar";

/**
 * @namespace SS-Fusion Atoms
 * @description Foundational UI components for building interfaces.
 * 
 * Atoms are the smallest, most basic UI components in the SS-Fusion library.
 * They follow atomic design principles and provide:
 * 
 * - Single responsibility focus
 * - Consistent theming integration
 * - Reactive state support via Fusion
 * - Comprehensive TypeScript interfaces
 * - Excellent composability for larger components
 * 
 * @example Basic Usage
 * ```typescript
 * import { Button, Label, TextBox, ProgressBar } from "ss-fusion";
 * 
 * // Create a simple form
 * const form = [
 *   Label({ text: "Login Form", variant: "heading" }),
 *   TextBox({ placeholder: "Username" }),
 *   TextBox({ placeholder: "Password" }),
 *   Button({ text: "Login", variant: "primary" })
 * ];
 * ```
 * 
 * @example Reactive State
 * ```typescript
 * import { Value, Computed } from "@rbxts/fusion";
 * import { Button, ProgressBar } from "ss-fusion";
 * 
 * const health = Value(100);
 * const maxHealth = Value(100);
 * const isAlive = Computed(() => health.get() > 0);
 * 
 * const healthBar = ProgressBar({
 *   progress: health,
 *   maxValue: maxHealth,
 *   fillColor: Color3.fromRGB(255, 100, 100)
 * });
 * 
 * const healButton = Button({
 *   text: "Heal",
 *   disabled: Computed(() => !isAlive.get()),
 *   onClick: () => health.set(maxHealth.get())
 * });
 * ```
 * 
 * @see {@link ./README.md} For detailed usage guide
 * @see {@link ../examples/ExampleUsage.ts} For complete working examples
 */

/**
 * @interface AtomProps
 * @description Common properties shared by all atom components.
 * 
 * All atoms extend Fusion.PropertyTable and include standard Roblox GUI properties
 * along with custom theming and behavior options.
 */
export interface AtomProps {
  /** Component name for debugging and identification */
  Name?: string;
  
  /** Size of the component */
  Size?: UDim2;
  
  /** Position of the component */
  Position?: UDim2;
  
  /** Anchor point for positioning */
  AnchorPoint?: Vector2;
  
  /** Z-index for layering */
  ZIndex?: number;
  
  /** Layout order for automatic layouts */
  LayoutOrder?: number;
  
  /** Whether the component is visible */
  Visible?: boolean;
}

/**
 * @type ComponentVariants
 * @description Standard visual variants used across components.
 */
export type ComponentVariants = 
  | "primary"     // Main action (blue theme)
  | "secondary"   // Secondary action (gray theme)  
  | "accent"      // Special highlight (purple theme)
  | "danger"      // Destructive action (red theme)
  | "ghost"       // Transparent with border
  | "success"     // Success state (green theme)
  | "warning"     // Warning state (yellow theme);

/**
 * @type ComponentSizes
 * @description Standard size variants used across components.
 */
export type ComponentSizes = 
  | "small"       // Compact sizing
  | "medium"      // Default sizing
  | "large";      // Spacious sizing

/**
 * @namespace ThemeIntegration
 * @description How atoms integrate with the theme system.
 * 
 * All atoms automatically use colors from the defaultColorScheme but allow
 * for custom overrides when needed. This ensures visual consistency while
 * maintaining flexibility.
 * 
 * @example Theme Usage
 * ```typescript
 * // Uses theme colors automatically
 * const button = Button({ text: "Save", variant: "primary" });
 * 
 * // Override specific colors while keeping theme integration
 * const customButton = Button({
 *   text: "Custom",
 *   variant: "primary",
 *   // Background still uses theme, but we override icon color
 *   iconColor: Color3.fromRGB(255, 100, 100)
 * });
 * ```
 */

/**
 * @namespace ReactivePatterns
 * @description Common patterns for using atoms with reactive state.
 * 
 * Atoms are designed to work seamlessly with Fusion's reactive state system.
 * Use Values for mutable state and Computed for derived values.
 * 
 * @example Reactive Patterns
 * ```typescript
 * import { Value, Computed } from "@rbxts/fusion";
 * 
 * // Mutable state
 * const playerName = Value("Anonymous");
 * const isOnline = Value(false);
 * 
 * // Derived state
 * const displayName = Computed(() => 
 *   isOnline.get() ? playerName.get() : "Offline"
 * );
 * 
 * const statusLabel = Label({
 *   text: displayName,
 *   textColor: Computed(() => 
 *     isOnline.get() 
 *       ? Color3.fromRGB(100, 255, 100)
 *       : Color3.fromRGB(150, 150, 150)
 *   )
 * });
 * ```
 */

/**
 * @namespace AccessibilityConsiderations
 * @description Accessibility features built into atoms.
 * 
 * Atoms include several accessibility features:
 * - Proper focus management
 * - Keyboard navigation support
 * - Screen reader compatible text
 * - High contrast theming options
 * - Consistent interaction patterns
 */

/**
 * @namespace PerformanceOptimizations
 * @description Performance considerations for atoms.
 * 
 * Atoms are optimized for performance through:
 * - Minimal re-renders via Fusion's reactive system
 * - Efficient event handling with proper cleanup
 * - Lightweight component structure
 * - Smart default values to avoid unnecessary computations
 */
