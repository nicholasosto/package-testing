/**
 * @file CooldownButton.ts
 * @module CooldownButton
 * @layer Client/UI/Molecules
 * @description Enhanced button component with integrated cooldown timer and progress visualization.
 *
 * Combines an IconButton with a ProgressBar to create a complete cooldown system
 * suitable for abilities, actions, or any time-based interactions. Fully integrated
 * with the ss-fusion theme system.
 *
 * @example
 * // Basic cooldown button
 * const button = CooldownButton({
 *   icon: "rbxassetid://123456789",
 *   cooldown: 5, // 5 seconds
 *   onClick: () => castSpell()
 * });
 *
 * @example
 * // Themed cooldown button
 * const button = CooldownButton({
 *   icon: "rbxassetid://123456789",
 *   cooldown: 10,
 *   variant: "primary",
 *   size: "large",
 *   onClick: () => performAction()
 * });
 *
 * @author SS-Fusion Development Team
 * @since 2.1.0
 */

import Fusion, { Value, New, Computed, OnEvent, Children, Observer } from "@rbxts/fusion";
import { defaultColorScheme, spacing } from "../utils/theme";
import { SizeVariant, ColorVariant, BaseProps, InteractableProps } from "../types/common";
import { ProgressBar } from "../atoms/ProgressBar";
import { ImageConstants } from "../types";

export interface CooldownButtonProps extends BaseProps, InteractableProps {
	/** Icon asset ID to display */
	icon: string;
	/** Cooldown duration in seconds */
	cooldown: number;
	/** Button size variant */
	size?: SizeVariant;
	/** Color theme variant */
	variant?: ColorVariant;
	/** Click handler */
	onClick?: () => void;
	/** Hover handler */
	onHover?: () => void;
	/** Callback when cooldown completes */
	onCooldownComplete?: () => void;
	/** Whether the button is initially disabled */
	initiallyDisabled?: boolean;
	/** Whether to show a label on the cooldown progress bar */
	showCooldownLabel?: boolean;
	/** Optional custom label text for the cooldown bar */
	cooldownLabelText?: Fusion.Value<string> | Fusion.Computed<string>;
	/** Optional label color for the cooldown bar */
	cooldownLabelColor?: Color3;
}

/**
 * Size configuration mapping
 */
const sizeConfig = {
	small: {
		container: new UDim2(0, 40, 0, 50),
		button: new UDim2(1, 0, 0, 32),
		progressBar: new UDim2(1, 0, 0, 6),
	},
	medium: {
		container: new UDim2(0, 56, 0, 70),
		button: new UDim2(1, 0, 0, 48),
		progressBar: new UDim2(1, 0, 0, 8),
	},
	large: {
		container: new UDim2(0, 72, 0, 90),
		button: new UDim2(1, 0, 0, 64),
		progressBar: new UDim2(1, 0, 0, 10),
	},
} as const;

/**
 * Get theme colors for variant
 */
function getVariantColors(variant: ColorVariant) {
	switch (variant) {
		case "primary":
			return {
				button: defaultColorScheme.Primary,
				progress: defaultColorScheme.Primary.Lerp(Color3.fromRGB(255, 255, 255), 0.3),
				disabled: defaultColorScheme.Primary.Lerp(Color3.fromRGB(128, 128, 128), 0.5),
			};
		case "secondary":
			return {
				button: defaultColorScheme.Secondary,
				progress: defaultColorScheme.Secondary.Lerp(Color3.fromRGB(255, 255, 255), 0.3),
				disabled: defaultColorScheme.Secondary.Lerp(Color3.fromRGB(128, 128, 128), 0.5),
			};
		case "accent":
			return {
				button: defaultColorScheme.Accent,
				progress: defaultColorScheme.Accent.Lerp(Color3.fromRGB(255, 255, 255), 0.3),
				disabled: defaultColorScheme.Accent.Lerp(Color3.fromRGB(128, 128, 128), 0.5),
			};
		case "error":
			return {
				button: defaultColorScheme.Error,
				progress: defaultColorScheme.Error.Lerp(Color3.fromRGB(255, 255, 255), 0.3),
				disabled: defaultColorScheme.Error.Lerp(Color3.fromRGB(128, 128, 128), 0.5),
			};
		case "success":
			return {
				button: defaultColorScheme.Success,
				progress: defaultColorScheme.Success.Lerp(Color3.fromRGB(255, 255, 255), 0.3),
				disabled: defaultColorScheme.Success.Lerp(Color3.fromRGB(128, 128, 128), 0.5),
			};
		case "warning":
			return {
				button: defaultColorScheme.Warning,
				progress: defaultColorScheme.Warning.Lerp(Color3.fromRGB(255, 255, 255), 0.3),
				disabled: defaultColorScheme.Warning.Lerp(Color3.fromRGB(128, 128, 128), 0.5),
			};
		default:
			return {
				button: defaultColorScheme.Surface,
				progress: defaultColorScheme.OnSurface,
				disabled: defaultColorScheme.OnSurface.Lerp(Color3.fromRGB(128, 128, 128), 0.5),
			};
	}
}

export function CooldownButton(props: CooldownButtonProps) {
	// State values
	const cooldownRemaining = Value(0);
	const isHovered = Value(false);
	const isPressed = Value(false);
	const isDisabled = Value(props.initiallyDisabled ?? false);

	// Configuration
	const size = props.size ?? "medium";
	const variant = props.variant ?? "primary";
	const themeColors = getVariantColors(variant);
	const sizes = sizeConfig[size];

	// Computed values
	const cooldownProgress = Computed(() => 
		props.cooldown > 0 ? cooldownRemaining.get() / props.cooldown : 0
	);
	const isOnCooldown = Computed(() => cooldownProgress.get() > 0);
	const canClick = Computed(() => !isOnCooldown.get() && !isDisabled.get());

	// Cooldown management
	function startCooldown() {
		if (props.cooldown <= 0) return;
		
		cooldownRemaining.set(props.cooldown);
		const interval = 0.1; // Update every 100ms
		
		const updateTask = task.spawn(() => {
			while (cooldownRemaining.get() > 0) {
				task.wait(interval);
				const newValue = math.max(0, cooldownRemaining.get() - interval);
				cooldownRemaining.set(newValue);
				
				if (newValue <= 0) {
					props.onCooldownComplete?.();
					break;
				}
			}
		});
		
		return updateTask;
	}

	// Icon button
	const IconButtonComponent = New("ImageButton")({
		Name: "CooldownButtonIconX",
		Size: sizes.button,
		Position: new UDim2(0, 0, 0, 0),
		BackgroundColor3: Computed(() => {
			if (!canClick.get()) {
				return themeColors.disabled;
			} else if (isPressed.get()) {
				return themeColors.button.Lerp(Color3.fromRGB(0, 0, 0), 0.2);
			} else if (isHovered.get()) {
				return themeColors.button.Lerp(Color3.fromRGB(255, 255, 255), 0.1);
			} else {
				return themeColors.button;
			}
		}),
		BackgroundTransparency: 0.1,
		BorderSizePixel: 0,
		AutoButtonColor: false,
		Image: ImageConstants.Ability.Background,
		ImageColor3: Computed(() => 
			canClick.get() ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(160, 160, 160)
		),
		ImageTransparency: Computed(() => canClick.get() ? 0 : 0.5),
		[Children]: {
			Icon: New("ImageLabel")({
				Size: UDim2.fromScale(0.8, 0.8),
				Position: UDim2.fromScale(0.5, 0.5),
				AnchorPoint: new Vector2(0.5, 0.5),
				Image: props.icon,
				ImageColor3: Computed(() => canClick.get() ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(160, 160, 160)),
				ImageTransparency: Computed(() => canClick.get() ? 0 : 0.5),
				[Children]: {
					AspectRatio: New("UIAspectRatioConstraint")({
						AspectRatio: 1,
					}),
				},
			}),
		},
		[OnEvent("MouseEnter")]: () => {
			if (canClick.get()) {
				isHovered.set(true);
				props.onHover?.();
				props.OnMouseEnter?.();
			}
		},
		[OnEvent("MouseLeave")]: () => {
			isHovered.set(false);
			isPressed.set(false);
			props.OnMouseLeave?.();
		},
		[OnEvent("MouseButton1Down")]: () => {
			if (canClick.get()) {
				isPressed.set(true);
			}
		},
		[OnEvent("MouseButton1Up")]: () => {
			isPressed.set(false);
		},
		[OnEvent("Activated")]: () => {
			if (canClick.get()) {
				props.onClick?.();
				props.OnActivated?.();
				startCooldown();
			}
		},
	});

	// Progress bar for cooldown
	const baseBarHeight = sizes.progressBar.Y.Offset;
	const effectiveBarHeight = props.showCooldownLabel ? math.max(baseBarHeight, 14) : baseBarHeight;
	const CooldownProgressBar = ProgressBar({
		Size: new UDim2(1, 0, 0, effectiveBarHeight),
		Position: new UDim2(0, 0, 1, -effectiveBarHeight - spacing.xs),
		currentValue: cooldownRemaining,
		maxValue: Value(props.cooldown),
		fillColor: themeColors.progress,
		direction: "horizontal",
		showLabel: props.showCooldownLabel ?? false,
		labelText: props.cooldownLabelText,
		labelColor: props.cooldownLabelColor,
	});

	// Main container
	const cooldownButtonContainer = New("Frame")({
		Name: "CooldownButton",
		Size: props.Size ?? sizes.container,
		Position: props.Position,
		AnchorPoint: props.AnchorPoint,
		LayoutOrder: props.LayoutOrder,
		ZIndex: props.ZIndex,
		Visible: props.Visible,
		BackgroundTransparency: 1,
		[Children]: {
			IconButton: IconButtonComponent,
			ProgressBar: CooldownProgressBar,
		},
	});

	return cooldownButtonContainer;
}
