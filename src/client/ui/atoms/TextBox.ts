/**
 * @file TextBox.ts
 * @module TextBox
 * @layer Client/UI/Atoms
 * @description Reusable text input component with validation, theming, and state management.
 * 
 * This component provides a comprehensive text input solution with built-in validation,
 * focus states, error handling, and theme integration. It supports both single-line and
 * multiline input modes with customizable styling.
 *
 * @example
 * // Simple text input
 * const nameInput = TextBox({
 *   placeholder: "Enter your name...",
 *   onChanged: (text) => setPlayerName(text)
 * });
 * 
 * @example
 * // Password input with validation
 * const passwordInput = TextBox({
 *   placeholder: "Password",
 *   validate: (text) => text.length >= 8,
 *   variant: "error", // Shows red border if validation fails
 *   onFocusLost: (enterPressed) => {
 *     if (enterPressed) submitForm();
 *   }
 * });
 * 
 * @example
 * // Multiline text area
 * const messageBox = TextBox({
 *   placeholder: "Enter your message...",
 *   multiline: true,
 *   maxLength: 500,
 *   size: "large"
 * });
 *
 * @author Soul Steel Alpha Development Team
 * @since 1.0.0
 */

import Fusion, { Children, Computed, New, OnEvent, Value } from "@rbxts/fusion";
import { defaultColorScheme, spacing } from "../utils/theme";

/**
 * Props interface for the TextBox component.
 * Provides comprehensive text input configuration with validation and theming.
 */
export interface TextBoxProps extends Fusion.PropertyTable<Frame> {
	/** 
	 * Placeholder text shown when the input is empty.
	 * Helps users understand what kind of input is expected.
	 * @example "Enter your username...", "Search items..."
	 */
	placeholder?: string;

	/** 
	 * Current text value (reactive state object).
	 * If provided, the TextBox will be controlled by this state.
	 * @example playerNameState, searchQueryState
	 */
	value?: Fusion.Value<string>;

	/** 
	 * Whether this is a multiline text input.
	 * Multiline inputs allow line breaks and are taller by default.
	 * @default false
	 */
	multiline?: boolean;

	/** 
	 * Maximum number of characters allowed.
	 * Input will be truncated if it exceeds this limit.
	 * @default 200
	 */
	maxLength?: number;

	/** 
	 * Whether to clear existing text when the input gains focus.
	 * Useful for search boxes or temporary input fields.
	 * @default false
	 */
	clearTextOnFocus?: boolean;

	/** 
	 * Whether the text input is disabled.
	 * Disabled inputs cannot be edited and have muted styling.
	 * Can be reactive for dynamic disable states.
	 * @default false
	 */
	disabled?: Fusion.Value<boolean> | boolean;

	/** 
	 * Input validation function.
	 * Called on every text change to determine if input is valid.
	 * Invalid input will show error styling.
	 * @param text - Current input text
	 * @returns true if valid, false if invalid
	 * @example (text) => text.length >= 3
	 */
	validate?: (text: string) => boolean;

	/** 
	 * Text change handler called whenever input text changes.
	 * @param text - New text value
	 */
	onChanged?: (text: string) => void;

	/** 
	 * Focus gained handler called when input becomes focused.
	 * Useful for showing additional UI or clearing errors.
	 */
	onFocused?: () => void;

	/** 
	 * Focus lost handler called when input loses focus.
	 * @param enterPressed - true if focus was lost due to Enter key
	 */
	onFocusLost?: (enterPressed: boolean) => void;

	/** 
	 * Visual variant affecting border color and styling.
	 * - default: Standard input styling
	 * - error: Red border for validation errors
	 * - success: Green border for successful validation
	 * @default "default"
	 */
	variant?: "default" | "error" | "success";

	/** 
	 * Size variant affecting height and font size.
	 * - small: 32px height, 14px font
	 * - medium: 40px height, 16px font
	 * - large: 48px height, 18px font
	 * @default "medium"
	 */
	size?: "small" | "medium" | "large";
}

/**
 * Creates a text input component with validation and theming support.
 * 
 * This component wraps a TextBox in a styled Frame container to provide
 * proper theming, padding, and border styling. It handles both controlled
 * and uncontrolled modes, with built-in validation and error states.
 * 
 * @param props - Configuration object for the text input
 * @returns A Frame containing the styled TextBox with interaction handling
 * 
 * @example
 * // Basic text input
 * const input = TextBox({
 *   placeholder: "Type here...",
 *   onChanged: (text) => handleTextChange(text)
 * });
 * 
 * @example
 * // Validated email input
 * const emailInput = TextBox({
 *   placeholder: "Email address",
 *   validate: (text) => text.includes("@"),
 *   variant: "error", // Will show if validation fails
 *   onFocusLost: (enterPressed) => {
 *     if (enterPressed) submitEmail();
 *   }
 * });
 */
export function TextBox(props: TextBoxProps): Frame {
	// State management
	const isFocused = Value(false);
	const hasError = Value(false);
	const currentText = props.value ?? Value("");

	// Default values
	const placeholder = props.placeholder ?? "";
	const multiline = props.multiline ?? false;
	const maxLength = props.maxLength ?? 200;
	const clearTextOnFocus = props.clearTextOnFocus ?? false;
	const variant = props.variant ?? "default";
	const size = props.size ?? "medium";

	// Compute disabled state
	const isDisabled = Computed(() => {
		if (typeIs(props.disabled, "boolean")) {
			return props.disabled;
		} else if (props.disabled) {
			return props.disabled.get();
		}
		return false;
	});

	// Get size values
	const getSizeValues = () => {
		switch (size) {
			case "small":
				return { height: 32, paddingX: spacing.sm, fontSize: 14 };
			case "medium":
				return { height: 40, paddingX: spacing.md, fontSize: 16 };
			case "large":
				return { height: 48, paddingX: spacing.lg, fontSize: 18 };
			default:
				return { height: 40, paddingX: spacing.md, fontSize: 16 };
		}
	};

	const sizeValues = getSizeValues();

	// Get colors based on variant and state
	const getBorderColor = (): Color3 => {
		if (isDisabled.get()) {
			return Color3.fromRGB(150, 150, 150);
		}
		if (variant === "error" || hasError.get()) {
			return defaultColorScheme.Error;
		}
		if (variant === "success") {
			return defaultColorScheme.Success;
		}
		if (isFocused.get()) {
			return defaultColorScheme.Primary;
		}
		return defaultColorScheme.Secondary;
	};

	const getBackgroundColor = (): Color3 => {
		if (isDisabled.get()) {
			return Color3.fromRGB(240, 240, 240);
		}
		return defaultColorScheme.Surface;
	};

	const getTextColor = (): Color3 => {
		if (isDisabled.get()) {
			return Color3.fromRGB(150, 150, 150);
		}
		return defaultColorScheme.OnSurface;
	};

	// Computed styles
	const borderColor = Computed(() => getBorderColor());
	const backgroundColor = Computed(() => getBackgroundColor());
	const textColor = Computed(() => getTextColor());
	const placeholderColor = Computed(() => 
		isDisabled.get() 
			? Color3.fromRGB(180, 180, 180)
			: Color3.fromRGB(120, 120, 120)
	);

	// Text validation
	const validateText = (text: string): boolean => {
		if (props.validate) {
			return props.validate(text);
		}
		return true;
	};

	// Create the actual TextBox instance
	const textBoxInstance = New("TextBox")({
		Name: "TextInput",
		Size: new UDim2(1, -sizeValues.paddingX * 2, 1, 0),
		Position: new UDim2(0, sizeValues.paddingX, 0, 0),
		BackgroundTransparency: 1,
		BorderSizePixel: 0,

		// Text properties
		Text: Computed(() => currentText.get()),
		PlaceholderText: placeholder,
		TextColor3: textColor,
		PlaceholderColor3: placeholderColor,
		TextSize: sizeValues.fontSize,
		Font: Enum.Font.Gotham,
		TextXAlignment: Enum.TextXAlignment.Left,
		TextYAlignment: multiline ? Enum.TextYAlignment.Top : Enum.TextYAlignment.Center,
		TextWrapped: multiline,
		MultiLine: multiline,

		// Input properties
		MaxVisibleGraphemes: maxLength,
		ClearTextOnFocus: clearTextOnFocus,
		TextEditable: Computed(() => !isDisabled.get()),

		[OnEvent("Focused")]: () => {
			isFocused.set(true);
			props.onFocused?.();
		},

		[OnEvent("FocusLost")]: (enterPressed: boolean) => {
			isFocused.set(false);
			props.onFocusLost?.(enterPressed);
		},
	});

	// Handle text changes
	textBoxInstance.GetPropertyChangedSignal("Text").Connect(() => {
		const newText = textBoxInstance.Text;
		
		// Validate text
		const isValid = validateText(newText);
		hasError.set(!isValid);
		
		// Update state if it's our internal state
		if (!props.value && "set" in currentText) {
			(currentText as Fusion.Value<string>).set(newText);
		}
		
		// Call change handler
		props.onChanged?.(newText);
	});

	// Return container frame with TextBox inside
	return New("Frame")({
		Name: props.Name ?? "TextBox",
		Size: props.Size ?? new UDim2(1, 0, 0, multiline ? sizeValues.height * 3 : sizeValues.height),
		Position: props.Position,
		AnchorPoint: props.AnchorPoint,
		BackgroundColor3: backgroundColor,
		BackgroundTransparency: 0,
		BorderSizePixel: 2,
		BorderColor3: borderColor,
		ZIndex: props.ZIndex,
		LayoutOrder: props.LayoutOrder,

		[Children]: [textBoxInstance],

		// Optional properties passthrough
		Visible: props.Visible,
		ClipsDescendants: props.ClipsDescendants,
	});
}
