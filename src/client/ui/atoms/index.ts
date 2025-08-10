/**
 * @fileoverview SS-Fusion Atoms - Foundational UI Components
 * @description Exports all atomic components for the SS-Fusion design system.
 * 
 * Atoms are the smallest, most basic UI components that serve as building blocks
 * for more complex molecules, organisms, and templates. This library includes:
 * 
 * - **Avatar**: User profile images, player thumbnails, and fallback displays
 * - **Button**: Unified text and icon button with multiple variants
 * - **Label**: Typography component with consistent theming
 * - **TextBox**: Input component with validation and focus states
 * - **ProgressBar**: Progress visualization for various metrics
 * - **SlicedImage**: Generic 9-slice image component for panels
 * 
 * All components are built with:
 * ✅ Fusion reactive state integration
 * ✅ Comprehensive TypeScript interfaces
 * ✅ Consistent theming system
 * ✅ Full JSDoc documentation
 * ✅ Performance optimizations
 * 
 * @example Basic Usage
 * ```typescript
 * import { Avatar, Button, Label, TextBox } from "ss-fusion/atoms";
 * 
 * // Create a user profile header
 * const userProfile = [
 *   Avatar({ UserId: 123456, Size: UDim2.fromOffset(64, 64) }),
 *   Label({ text: "Welcome back!", variant: "heading" }),
 *   Button({ text: "View Profile", variant: "primary" })
 * ];
 * ```
 * 
 * @see {@link ./README.md} For detailed usage documentation
 * @see {@link ./CHANGELOG.md} For version history and migration guides
 * @see {@link ./atoms.d.ts} For complete API reference
 */

export * from "./Button";
export * from "./Label";
export * from "./TextBox";
export * from "./ProgressBar";
export * from "./SlicedImage";
export * from "./TabButton";
export * from "./Badge";
export * from "./Avatar";
export * from "./IconButton";
export * from "./CloseButton";
export * from "./MessageBox";
