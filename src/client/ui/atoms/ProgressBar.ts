/**
 * @file ProgressBar.ts
 * @module ProgressBar
 * @layer Client/UI/Atoms
 * @description Reusable progress bar component for health, mana, cooldowns, experience, and other progress indicators.
 *
 * This component provides a flexible progress visualization that can work with both
 * percentage values (0-1) and absolute values (current/max). It supports horizontal
 * and vertical orientations with optional text labels.
 *
 * @example
 * // Health bar with current/max values
 * const healthBar = ProgressBar({
 *   progress: currentHealth,
 *   maxValue: maxHealth,
 *   fillColor: Color3.fromRGB(255, 100, 100),
 *   showLabel: true
 * });
 * 
 * @example
 * // Experience bar with percentage
 * const xpBar = ProgressBar({
 *   progress: expPercentage, // 0.0 to 1.0
 *   fillColor: Color3.fromRGB(100, 255, 100),
 *   direction: "horizontal",
 *   showLabel: true,
 *   labelText: customExpText
 * });
 * 
 * @example
 * // Vertical mana bar
 * const manaBar = ProgressBar({
 *   progress: currentMana,
 *   maxValue: maxMana,
 *   fillColor: Color3.fromRGB(100, 100, 255),
 *   direction: "vertical",
 *   minSize: 8
 * });
 *
 * @author Soul Steel Alpha Development Team
 * @since 1.0.0
 */

import Fusion, { Children, Computed, New, Value } from "@rbxts/fusion";
import { defaultColorScheme } from "../utils/theme";

/**
 * Props interface for the ProgressBar component.
 * Supports both percentage-based and absolute value progress tracking.
 */
export interface ProgressBarProps extends Fusion.PropertyTable<Frame> {
	/** 
	 * Current progress value.
	 * - If maxValue is provided: actual current value (e.g., 75 health)
	 * - If maxValue is not provided: percentage from 0-1 (e.g., 0.75 = 75%)
	 * @example currentHealth, expPercentage
	 */
	currentValue: Fusion.Value<number>;

	/** 
	 * Maximum value for calculating percentage.
	 * When provided, progress is treated as current/max instead of percentage.
	 * @example maxHealth, maxMana
	 */
	maxValue: Fusion.Value<number>;

	/** 
	 * Color of the progress fill bar.
	 * @default Theme Primary color
	 * @example Color3.fromRGB(255, 100, 100) for health
	 */
	fillColor?: Color3;

	/** 
	 * Background color of the progress bar container.
	 * @default Color3.fromRGB(40, 40, 40)
	 */
	backgroundColor?: Color3;

	/** 
	 * Border color of the progress bar container.
	 * @default Color3.fromRGB(100, 100, 100)
	 */
	borderColor?: Color3;

	/** 
	 * Direction of progress fill animation.
	 * - horizontal: Fills left to right
	 * - vertical: Fills bottom to top
	 * @default "horizontal"
	 */
	direction?: "horizontal" | "vertical";

	/** 
	 * Whether to show a text label overlay.
	 * Label shows current/max or percentage based on configuration.
	 * @default false
	 */
	showLabel?: boolean;

	/** 
	 * Custom label text override.
	 * If not provided, shows "current/max" or "percentage%" automatically.
	 * @example "Level 25", "75% Complete"
	 */
	labelText?: Fusion.Value<string> | Fusion.Computed<string>;

	/** 
	 * Color of the label text.
	 * @default Color3.fromRGB(255, 255, 255) (white)
	 */
	labelColor?: Color3;

	/** 
	 * Minimum size in pixels.
	 * - For horizontal bars: minimum height
	 * - For vertical bars: minimum width
	 * @default 4
	 */
	minSize?: number;
}

/**
 * Creates a progress bar component for visualizing completion or resource levels.
 * 
 * This component automatically handles the math for both percentage-based progress
 * (0-1 range) and absolute value progress (current/max). It provides smooth
 * visual feedback with optional text labels and supports both orientations.
 * 
 * @param props - Configuration object for the progress bar
 * @returns A Frame containing the progress bar with fill and optional label
 * 
 * @example
 * // Simple percentage progress
 * const loadingBar = ProgressBar({
 *   progress: loadingProgress, // StateObject with 0-1 values
 *   fillColor: Color3.fromRGB(100, 200, 255),
 *   showLabel: true
 * });
 * 
 * @example
 * // Health bar with current/max
 * const healthBar = ProgressBar({
 *   progress: playerHealth,    // StateObject with current health
 *   maxValue: playerMaxHealth, // StateObject with max health
 *   fillColor: Color3.fromRGB(255, 100, 100),
 *   showLabel: true,
 *   labelColor: Color3.fromRGB(255, 255, 255)
 * });
 */
export function ProgressBar(props: ProgressBarProps): Frame {
	// Default values
	const direction = props.direction ?? "horizontal";
	const showLabel = props.showLabel ?? false;
	const labelColor = props.labelColor ?? Color3.fromRGB(255, 255, 255);
	const minSize = props.minSize ?? 4;
	const fillColor = props.fillColor ?? defaultColorScheme.Primary;
	const backgroundColor = props.backgroundColor ?? Color3.fromRGB(40, 40, 40);
	const borderColor = props.borderColor ?? Color3.fromRGB(100, 100, 100);

	// Calculate fill percentage
	const fillPercentage = Computed(() => {
		const progress = props.currentValue.get();
		const maxValue = props.maxValue?.get();

		if (maxValue !== undefined) {
			// Progress is actual value, calculate percentage
			return maxValue > 0 ? math.clamp(progress / maxValue, 0, 1) : 0;
		} else {
			// Progress is already a percentage (0-1)
			return math.clamp(progress, 0, 1);
		}
	});

	// Calculate fill size based on direction
	const fillSize = Computed(() => {
		const percentage = fillPercentage.get();

		if (direction === "horizontal") {
			return new UDim2(percentage, 0, 1, 0);
		} else {
			// Vertical - fill from bottom up
			return new UDim2(1, 0, percentage, 0);
		}
	});

	// Calculate fill position for vertical bars (anchor to bottom)
	const fillPosition = Computed(() => {
		if (direction === "vertical") {
			const percentage = fillPercentage.get();
			return new UDim2(0, 0, 1 - percentage, 0);
		} else {
			return new UDim2(0, 0, 0, 0);
		}
	});

	// Generate label text
	const displayText = Computed(() => {
		if (props.labelText) {
			return props.labelText.get();
		}

		const progress = props.currentValue.get();
		const maxValue = props.maxValue?.get();

		if (maxValue !== undefined) {
			// Show current/max format
			return `${math.floor(progress)}/${math.floor(maxValue)}`;
		} else {
			// Show percentage format
			const percentage = math.floor(fillPercentage.get() * 100);
			return `${percentage}%`;
		}
	});

	return New("Frame")({
		Name: props.Name ?? "ProgressBar",
		Size: props.Size ?? new UDim2(1, 0, 0, minSize),
		Position: props.Position,
		AnchorPoint: props.AnchorPoint,
		BackgroundColor3: backgroundColor,
		BorderColor3: borderColor,
		BorderSizePixel: props.BorderSizePixel ?? 1,
		ZIndex: props.ZIndex,
		LayoutOrder: props.LayoutOrder,

		[Children]: [
			// Background fill
			New("Frame")({
				Name: "Background",
				Size: new UDim2(1, 0, 1, 0),
				BackgroundColor3: defaultColorScheme.Surface,
				BorderSizePixel: 0,
			}),

			// Progress fill
			New("Frame")({
				Name: "Fill",
				Size: fillSize,
				Position: fillPosition,
				BackgroundColor3: fillColor,
				BorderSizePixel: 0,
				ZIndex: 2,
			}),

			// Conditional label
			showLabel
				? New("TextLabel")({
						Name: "ResourceLabel",
						BackgroundTransparency: 1,
						Text: displayText,
						TextColor3: labelColor,
						TextScaled: true,
						TextStrokeTransparency: 0,
						TextStrokeColor3: Color3.fromRGB(0, 0, 0),
						Size: new UDim2(1, 0, 1, 0),
						Font: Enum.Font.GothamBold,
						ZIndex: 3,
					})
				: undefined,
		],
	});
}
