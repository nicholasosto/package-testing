/**
 * @file IconButton.ts
 * @module IconButton
 * @layer Client/UI/Atoms
 * @description Enhanced icon button component with selection states, hover effects, and configurable styling.
 *
 * This button supports both simple icon display and advanced interaction states including
 * selection tracking, hover effects, and customizable background images. Fully integrated
 * with the ss-fusion theme system.
 *
 * @example
 * // Simple icon button
 * const button = IconButton({
 *   icon: "rbxassetid://123456789",
 *   onClick: () => print("Clicked!")
 * });
 *
 * @example
 * // Styled button with theme variant
 * const styledButton = IconButton({
 *   icon: "rbxassetid://123456789", 
 *   variant: "primary",
 *   size: "large",
 *   onClick: handleClick
 * });
 *
 * @author SS-Fusion Development Team
 * @since 2.1.0
 */

import Fusion, { Value, Children, New, Computed, OnEvent } from "@rbxts/fusion";
import { defaultColorScheme, spacing, borderRadiusValues } from "../utils/theme";
import { SizeVariant, ColorVariant, BaseProps, InteractableProps } from "../types/common";

export interface IconButtonProps extends BaseProps, InteractableProps {
	/** Icon asset ID to display */
	icon: string;
	
	/** Optional background image asset ID */
	backgroundImage?: string;
	
	/** Button size variant */
	size?: SizeVariant;
	
	/** Color theme variant */
	variant?: ColorVariant;
	
	/** Whether the button starts selected */
	initialSelected?: boolean;
	
	/** Click handler */
	onClick?: () => void;
	
	/** Selection change handler */
	onSelectionChanged?: (selected: boolean) => void;
	
	/** Whether the button can be toggled */
	toggleable?: boolean;
}

/**
 * Size configuration mapping
 */
const sizeConfig = {
	small: UDim2.fromOffset(32, 32),
	medium: UDim2.fromOffset(48, 48),
	large: UDim2.fromOffset(64, 64),
} as const;

/**
 * Get theme colors for variant
 */
function getVariantColors(variant: ColorVariant) {
	switch (variant) {
		case "primary":
			return {
				background: defaultColorScheme.Primary,
				text: defaultColorScheme.OnPrimary,
			};
		case "secondary":
			return {
				background: defaultColorScheme.Secondary,
				text: defaultColorScheme.OnSecondary,
			};
		case "accent":
			return {
				background: defaultColorScheme.Accent,
				text: defaultColorScheme.OnPrimary,
			};
		case "error":
			return {
				background: defaultColorScheme.Error,
				text: defaultColorScheme.OnPrimary,
			};
		case "success":
			return {
				background: defaultColorScheme.Success,
				text: defaultColorScheme.OnPrimary,
			};
		case "warning":
			return {
				background: defaultColorScheme.Warning,
				text: defaultColorScheme.OnPrimary,
			};
		default:
			return {
				background: defaultColorScheme.Surface,
				text: defaultColorScheme.OnSurface,
			};
	}
}

export function IconButton(props: IconButtonProps) {
	const isSelected = Value(props.initialSelected ?? false);
	const isHovered = Value(false);
	const isPressed = Value(false);

	// Configuration
	const size = props.size ?? "medium";
	const variant = props.variant ?? "secondary";
	const toggleable = props.toggleable ?? false;
	const themeColors = getVariantColors(variant);

	// Default background image (Roblox placeholder)
	const defaultBackground = "rbxasset://textures/ui/GuiImagePlaceholder.png";

	// Icon Image
	const IconImage = New("ImageLabel")({
		Name: "IconImage",
		Size: UDim2.fromScale(0.7, 0.7),
		AnchorPoint: new Vector2(0.5, 0.5),
		Position: UDim2.fromScale(0.5, 0.5),
		Image: props.icon,
		ImageColor3: Computed(() => {
			if (isSelected.get()) {
				return themeColors.text;
			} else if (isPressed.get()) {
				return themeColors.text.Lerp(Color3.fromRGB(0, 0, 0), 0.2);
			} else if (isHovered.get()) {
				return themeColors.text;
			} else {
				return themeColors.text.Lerp(Color3.fromRGB(128, 128, 128), 0.3);
			}
		}),
		BackgroundTransparency: 1,
		ZIndex: 2,
	});

	// Selection highlight
	const SelectionHighlight = New("Frame")({
		Name: "SelectionHighlight",
		Size: UDim2.fromScale(1, 1),
		BackgroundColor3: themeColors.background,
		BackgroundTransparency: Computed(() => {
			if (isSelected.get()) {
				return 0.1;
			} else if (isPressed.get()) {
				return 0.3;
			} else if (isHovered.get()) {
				return 0.5;
			} else {
				return 1;
			}
		}),
		BorderSizePixel: 0,
		ZIndex: 1,
		[Children]: {
			Corner: New("UICorner")({
				CornerRadius: new UDim(0, borderRadiusValues.small),
			}),
		},
	});

	const BackgroundTransparency = Computed(() => {
		if (isPressed.get()) {
			return 0.3;
		} else if (isHovered.get()) {
			return 0.5;
		} else {
			return 1;
		}
	});

	const backgroundColor = Computed(() => {
		if (isSelected.get()) {
			return themeColors.background;
		} else if (isPressed.get()) {
			return themeColors.background.Lerp(Color3.fromRGB(0, 0, 0), 0.2);
		} else if (isHovered.get()) {
			return themeColors.background;
		} else {
			return themeColors.background.Lerp(Color3.fromRGB(128, 128, 128), 0.3);
		}
	});

	// Main Button Component
	const buttonComponent = New("ImageButton")({
		Name: "IconButton",
		Size: props.Size ?? sizeConfig[size],
		Position: props.Position,
		AnchorPoint: props.AnchorPoint,
		LayoutOrder: props.LayoutOrder,
		ZIndex: props.ZIndex,
		Visible: props.Visible,
		Image: props.backgroundImage ?? defaultBackground,
		ImageTransparency: props.backgroundImage ? 0 : 1,
		BackgroundTransparency: BackgroundTransparency,
		BackgroundColor3: backgroundColor,
		AutoButtonColor: false,
		[Children]: {
			SelectionHighlight: SelectionHighlight,
			IconImage: IconImage,
			AspectRatioConstraint: New("UIAspectRatioConstraint")({
				AspectRatio: 1,
			}),
		},
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
			if (toggleable) {
				const newSelected = !isSelected.get();
				isSelected.set(newSelected);
				props.onSelectionChanged?.(newSelected);
			}
			props.onClick?.();
			props.OnActivated?.();
		},
	});

	return buttonComponent;
}
