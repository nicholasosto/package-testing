/**
 * @file CloseButton.ts
 * @module CloseButton
 * @layer Client/UI/Atoms
 * @description Minimalist close button component with hover effects and consistent theming.
 *
 * A simple, reusable close button that integrates with the ss-fusion theme system.
 * Perfect for dialogs, modals, and any interface that needs a close control.
 *
 * @example
 * // Basic close button
 * const closeBtn = CloseButton({
 *   onClick: () => closeDialog()
 * });
 *
 * @example
 * // Styled close button
 * const styledCloseBtn = CloseButton({
 *   size: "large",
 *   variant: "error",
 *   onClick: () => closeWithWarning()
 * });
 *
 * @author SS-Fusion Development Team
 * @since 2.1.0
 */

import Fusion, { New, OnEvent, Value, Computed } from "@rbxts/fusion";
import { defaultColorScheme, borderRadiusValues } from "../utils/theme";
import { SizeVariant, ColorVariant, BaseProps, InteractableProps } from "../types/common";

export interface CloseButtonProps extends BaseProps, InteractableProps {
	/** Click handler */
	onClick?: () => void;
	/** Button size variant */
	size?: SizeVariant;
	/** Color theme variant */
	variant?: ColorVariant;
	/** Custom close icon (defaults to X) */
	closeIcon?: string;
	/** Tooltip text for accessibility */
	tooltip?: string;
}

/**
 * Size configuration mapping
 */
const sizeConfig = {
	small: new UDim2(0, 24, 0, 24),
	medium: new UDim2(0, 32, 0, 32),
	large: new UDim2(0, 40, 0, 40),
} as const;

/**
 * Default close icon (Unicode X)
 */
const DEFAULT_CLOSE_TEXT = "✕";

/**
 * Get theme colors for variant
 */
function getVariantColors(variant: ColorVariant) {
	switch (variant) {
		case "error":
			return {
				normal: defaultColorScheme.Error,
				hover: defaultColorScheme.Error.Lerp(Color3.fromRGB(255, 255, 255), 0.2),
			};
		case "warning":
			return {
				normal: defaultColorScheme.Warning,
				hover: defaultColorScheme.Warning.Lerp(Color3.fromRGB(255, 255, 255), 0.2),
			};
		case "primary":
			return {
				normal: defaultColorScheme.Primary,
				hover: defaultColorScheme.Primary.Lerp(Color3.fromRGB(255, 255, 255), 0.2),
			};
		default:
			return {
				normal: defaultColorScheme.OnSurface,
				hover: defaultColorScheme.OnSurface.Lerp(Color3.fromRGB(255, 255, 255), 0.3),
			};
	}
}

/**
 * CloseButton component
 */
export function CloseButton(props: CloseButtonProps): ImageButton | TextButton {
	const isHovered = Value(false);
	const isPressed = Value(false);

	// Configuration
	const size = props.size ?? "medium";
	const variant = props.variant ?? "secondary";
	const themeColors = getVariantColors(variant);

	// If a custom icon is provided, use ImageButton, otherwise use TextButton
	if (props.closeIcon) {
		return New("ImageButton")({
			Name: "CloseButton",
			Size: props.Size ?? sizeConfig[size],
			Position: props.Position ?? new UDim2(1, 0, 0, 0),
			AnchorPoint: props.AnchorPoint ?? new Vector2(0.5, 0.5),
			LayoutOrder: props.LayoutOrder,
			ZIndex: props.ZIndex,
			Visible: props.Visible,
			BackgroundTransparency: Computed(() => {
				if (isPressed.get()) {
					return 0.7;
				} else if (isHovered.get()) {
					return 0.8;
				} else {
					return 1;
				}
			}),
			BackgroundColor3: themeColors.normal,
			BorderSizePixel: 0,
			AutoButtonColor: false,
			Image: props.closeIcon,
			ImageColor3: Computed(() => {
				if (isPressed.get()) {
					return themeColors.normal.Lerp(Color3.fromRGB(0, 0, 0), 0.3);
				} else if (isHovered.get()) {
					return themeColors.hover;
				} else {
					return themeColors.normal;
				}
			}),
			ImageTransparency: 0,
			[OnEvent("MouseEnter")]: () => {
				isHovered.set(true);
				props.OnMouseEnter?.();
			},
			[OnEvent("MouseLeave")]: () => {
				isHovered.set(false);
				isPressed.set(false);
				props.OnMouseLeave?.();
			},
			[OnEvent("MouseButton1Down")]: () => {
				isPressed.set(true);
			},
			[OnEvent("MouseButton1Up")]: () => {
				isPressed.set(false);
			},
			[OnEvent("Activated")]: () => {
				props.onClick?.();
				props.OnActivated?.();
			},
		});
	} else {
		// Text-based close button
		return New("TextButton")({
			Name: "CloseButton",
			Size: props.Size ?? sizeConfig[size],
			Position: props.Position,
			AnchorPoint: props.AnchorPoint ?? new Vector2(1, 0),
			LayoutOrder: props.LayoutOrder,
			ZIndex: props.ZIndex,
			Visible: props.Visible,
			BackgroundTransparency: Computed(() => {
				if (isPressed.get()) {
					return 0.7;
				} else if (isHovered.get()) {
					return 0.8;
				} else {
					return 1;
				}
			}),
			BackgroundColor3: themeColors.normal,
			BorderSizePixel: 0,
			AutoButtonColor: false,
			Text: DEFAULT_CLOSE_TEXT,
			TextColor3: Computed(() => {
				if (isPressed.get()) {
					return themeColors.normal.Lerp(Color3.fromRGB(0, 0, 0), 0.3);
				} else if (isHovered.get()) {
					return themeColors.hover;
				} else {
					return themeColors.normal;
				}
			}),
			TextScaled: true,
			Font: Enum.Font.SourceSansBold,
			[OnEvent("MouseEnter")]: () => {
				isHovered.set(true);
				props.OnMouseEnter?.();
			},
			[OnEvent("MouseLeave")]: () => {
				isHovered.set(false);
				isPressed.set(false);
				props.OnMouseLeave?.();
			},
			[OnEvent("MouseButton1Down")]: () => {
				isPressed.set(true);
			},
			[OnEvent("MouseButton1Up")]: () => {
				isPressed.set(false);
			},
			[OnEvent("Activated")]: () => {
				props.onClick?.();
				props.OnActivated?.();
			},
		});
	}
}
