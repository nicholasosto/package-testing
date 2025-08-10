/**
 * @file Label.ts
 * @module Label
 * @layer Client/UI/Atoms
 * @description Reusable text label component with consistent theming and typography.
 * 
 * This component provides a standardized way to display text with proper theming,
 * typography variants, and accessibility features. It handles both static and
 * reactive text content.
 *
 * @example
 * // Simple heading
 * const title = Label({
 *   text: "Welcome to SS-Fusion",
 *   variant: "heading"
 * });
 * 
 * @example
 * // Reactive body text
 * const status = Label({
 *   text: statusText, // Value<string>
 *   variant: "body",
 *   textColor: Color3.fromRGB(100, 255, 100)
 * });
 * 
 * @example
 * // Caption with text stroke
 * const caption = Label({
 *   text: "Level 25 Warrior",
 *   variant: "caption",
 *   textStroke: true,
 *   textStrokeColor: Color3.fromRGB(0, 0, 0)
 * });
 *
 * @author Soul Steel Alpha Development Team
 * @since 1.0.0
 */

import Fusion, { Computed, New } from "@rbxts/fusion";
import { defaultColorScheme, fontSizes } from "../utils/theme";

/**
 * Props interface for the Label component.
 * Provides comprehensive text styling and typography options.
 */
export interface LabelProps extends Fusion.PropertyTable<TextLabel> {
	/** 
	 * The text content to display.
	 * Can be static string or reactive StateObject for dynamic content.
	 * @example "Hello World", playerNameState
	 */
	text: Fusion.Value<string> | string;

	/** 
	 * Typography variant affecting size and weight.
	 * - heading: Large text for titles (24px)
	 * - body: Standard text for content (16px)
	 * - caption: Medium text for descriptions (14px)
	 * - small: Small text for details (12px)
	 * @default "body"
	 */
	variant?: "heading" | "body" | "caption" | "small";

	/** 
	 * Text color override.
	 * If not provided, uses theme-appropriate OnSurface color.
	 * @default Theme OnSurface color
	 */
	textColor?: Color3;

	/** 
	 * Whether text should scale to fit the container.
	 * When true, text size adjusts to fit available space.
	 * @default false
	 */
	textScaled?: boolean;

	/** 
	 * Font family to use for the text.
	 * @default Enum.Font.Gotham
	 */
	font?: Enum.Font;

	/** 
	 * Horizontal text alignment within the container.
	 * @default Enum.TextXAlignment.Center
	 */
	textXAlignment?: Enum.TextXAlignment;

	/** 
	 * Vertical text alignment within the container.
	 * @default Enum.TextYAlignment.Center
	 */
	textYAlignment?: Enum.TextYAlignment;

	/** 
	 * Whether text should wrap to new lines when too long.
	 * @default false
	 */
	textWrapped?: boolean;

	/** 
	 * Enable text stroke (outline) for better visibility.
	 * Useful for text over complex backgrounds.
	 * @default false
	 */
	textStroke?: boolean;

	/** 
	 * Color of the text stroke outline.
	 * Only used when textStroke is true.
	 * @default Color3.fromRGB(0, 0, 0) (black)
	 */
	textStrokeColor?: Color3;

	/** 
	 * Transparency of the text stroke (0 = opaque, 1 = transparent).
	 * Only used when textStroke is true.
	 * @default 0.5
	 * @range 0 to 1
	 */
	textStrokeTransparency?: number;
}

/**
 * Creates a text label with consistent theming and typography.
 * 
 * This component handles both static and reactive text content, automatically
 * applying appropriate styling based on the selected variant. It integrates
 * with the theme system for consistent colors and spacing.
 * 
 * @param props - Configuration object for the label
 * @returns A TextLabel instance with proper styling applied
 * 
 * @example
 * // Basic usage
 * const welcomeText = Label({
 *   text: "Welcome, Player!",
 *   variant: "heading"
 * });
 * 
 * @example
 * // Reactive text with custom styling
 * const scoreLabel = Label({
 *   text: scoreState,
 *   variant: "body",
 *   textColor: Color3.fromRGB(255, 215, 0),
 *   textStroke: true
 * });
 */
export function Label(props: LabelProps): TextLabel {
	// Default values based on variant
	const variant = props.variant ?? "body";
	const textColor = props.textColor ?? defaultColorScheme.OnSurface;
	const textScaled = props.textScaled ?? false;
	const font = props.font ?? Enum.Font.Gotham;
	const textXAlignment = props.textXAlignment ?? Enum.TextXAlignment.Center;
	const textYAlignment = props.textYAlignment ?? Enum.TextYAlignment.Center;
	const textWrapped = props.textWrapped ?? false;
	const textStroke = props.textStroke ?? false;
	const textStrokeColor = props.textStrokeColor ?? Color3.fromRGB(0, 0, 0);
	const textStrokeTransparency = props.textStrokeTransparency ?? 0.5;

	// Get text size based on variant
	const getTextSize = (variant: string): number => {
		switch (variant) {
			case "heading":
				return fontSizes.xxl;
			case "body":
				return fontSizes.md;
			case "caption":
				return fontSizes.sm;
			case "small":
				return fontSizes.xs;
			default:
				return fontSizes.md;
		}
	};

	// Compute text content
	const displayText = Computed(() => {
		if (typeIs(props.text, "string")) {
			return props.text;
		} else {
			return props.text.get();
		}
	});

	return New("TextLabel")({
		Name: props.Name ?? "Label",
		Size: props.Size ?? new UDim2(1, 0, 0, getTextSize(variant) + 8), // Add padding
		Position: props.Position,
		AnchorPoint: props.AnchorPoint,
		BackgroundTransparency: props.BackgroundTransparency ?? 1,
		BackgroundColor3: props.BackgroundColor3,
		BorderSizePixel: props.BorderSizePixel ?? 0,
		ZIndex: props.ZIndex,
		LayoutOrder: props.LayoutOrder,

		// Text properties
		Text: displayText,
		TextColor3: textColor,
		TextSize: textScaled ? 14 : getTextSize(variant),
		TextScaled: textScaled,
		Font: font,
		TextXAlignment: textXAlignment,
		TextYAlignment: textYAlignment,
		TextWrapped: textWrapped,

		// Text stroke
		TextStrokeTransparency: textStroke ? textStrokeTransparency : 1,
		TextStrokeColor3: textStrokeColor,

		// Optional properties passthrough
		Visible: props.Visible,
		ClipsDescendants: props.ClipsDescendants,
	});
}
