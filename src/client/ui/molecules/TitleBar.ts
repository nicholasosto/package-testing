/**
 * @file TitleBar.ts
 * @module TitleBar
 * @layer Client/UI/Molecules
 * @description Window title bar component with title text and optional close button.
 *
 * A reusable title bar component that combines a title label with an optional close button.
 * Perfect for dialogs, modals, and any interface that needs a header with close functionality.
 * Fully integrated with the ss-fusion theme system.
 *
 * @example
 * // Basic title bar
 * const titleBar = TitleBar({
 *   title: "Settings",
 *   onClose: () => closeDialog()
 * });
 *
 * @example
 * // Customized title bar
 * const titleBar = TitleBar({
 *   title: "Advanced Options",
 *   variant: "primary",
 *   height: 40,
 *   showCloseButton: true,
 *   onClose: () => handleClose()
 * });
 *
 * @author SS-Fusion Development Team
 * @since 2.1.0
 */

import Fusion, { Children, New, Value, Computed } from "@rbxts/fusion";
import { defaultColorScheme, spacing, borderRadiusValues, fontSizes } from "../utils/theme";
import { ColorVariant, BaseProps } from "../types/common";
import { CloseButton } from "../atoms/CloseButton";

export interface TitleBarProps extends BaseProps {
	/** Title text to display */
	title: string | Value<string>;
	/** Close button click handler */
	onClose?: () => void;
	/** Height in pixels */
	height?: number;
	/** Color theme variant */
	variant?: ColorVariant;
	/** Whether to show the close button */
	showCloseButton?: boolean;
	/** Custom background color override */
	backgroundColor?: Color3;
	/** Custom text color override */
	textColor?: Color3;
}

/**
 * Get theme colors for variant
 */
function getVariantColors(variant: ColorVariant) {
	switch (variant) {
		case "primary":
			return {
				background: defaultColorScheme.Primary,
				text: defaultColorScheme.OnPrimary,
				border: defaultColorScheme.Primary.Lerp(Color3.fromRGB(0, 0, 0), 0.2),
			};
		case "secondary":
			return {
				background: defaultColorScheme.Secondary,
				text: defaultColorScheme.OnSecondary,
				border: defaultColorScheme.Secondary.Lerp(Color3.fromRGB(0, 0, 0), 0.2),
			};
		case "accent":
			return {
				background: defaultColorScheme.Accent,
				text: defaultColorScheme.OnPrimary,
				border: defaultColorScheme.Accent.Lerp(Color3.fromRGB(0, 0, 0), 0.2),
			};
		default:
			return {
				background: defaultColorScheme.Surface,
				text: defaultColorScheme.OnSurface,
				border: defaultColorScheme.OnSurface.Lerp(Color3.fromRGB(255, 255, 255), 0.8),
			};
	}
}

/**
 * TitleBar component
 */
export function TitleBar(props: TitleBarProps): Frame {
	const height = props.height ?? 32;
	const variant = props.variant ?? "secondary";
	const showCloseButton = props.showCloseButton ?? true;
	const themeColors = getVariantColors(variant);

	// Get title text (handle both string and Value<string>)
	const titleText = Computed(() => {
		if (typeIs(props.title, "string")) {
			return props.title;
		} else {
			return props.title.get();
		}
	});

	// Title label
	const TitleLabel = New("TextLabel")({
		Name: "TitleLabel",
		Size: new UDim2(1, showCloseButton ? -height : -spacing.md, 1, 0),
		Position: new UDim2(0, spacing.md, 0, 0),
		BackgroundTransparency: 1,
		Text: titleText,
		TextColor3: props.textColor ?? themeColors.text,
		TextSize: fontSizes.md,
		TextXAlignment: Enum.TextXAlignment.Left,
		TextYAlignment: Enum.TextYAlignment.Center,
		TextTruncate: Enum.TextTruncate.AtEnd,
		Font: Enum.Font.SourceSansSemibold,
	});

	// Close button (optional)
	const closeButton = showCloseButton && props.onClose ? CloseButton({
		Size: new UDim2(0, height - spacing.xs, 0, height - spacing.xs),
		Position: new UDim2(1, -spacing.sm, 0.5, 0),
		AnchorPoint: new Vector2(1, 0.5),
		variant: variant === "primary" || variant === "accent" ? "secondary" : variant,
		onClick: props.onClose,
	}) : undefined;

	// Main title bar container
	const titleBarContainer = New("Frame")({
		Name: "TitleBar",
		Size: props.Size ?? new UDim2(1, 0, 0, height),
		Position: props.Position,
		AnchorPoint: props.AnchorPoint,
		LayoutOrder: props.LayoutOrder,
		ZIndex: props.ZIndex,
		Visible: props.Visible,
		BackgroundColor3: props.backgroundColor ?? themeColors.background,
		BorderSizePixel: 1,
		BorderColor3: themeColors.border,
		BorderMode: Enum.BorderMode.Inset,
		[Children]: {
			Corner: New("UICorner")({
				CornerRadius: new UDim(0, borderRadiusValues.small),
			}),
			TitleLabel: TitleLabel,
			CloseButton: closeButton,
		},
	});

	return titleBarContainer;
}
