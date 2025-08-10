/**
 * @file MessageBox.ts
 * @module MessageBox
 * @layer Client/UI/Atoms
 * @description Notification/message display component with automatic styling based on message type.
 *
 * A reactive message box that displays temporary messages to users with appropriate
 * color coding and theming. Integrates with the ss-fusion theme system.
 *
 * @example
 * // Basic message box
 * const messageBox = MessageBox({
 *   message: "Operation completed successfully!",
 *   messageType: "success",
 *   visible: true
 * });
 *
 * @example
 * // Reactive message box with state
 * const messageState = Value("Loading...");
 * const messageBox = MessageBox({
 *   message: messageState,
 *   messageType: "info",
 *   autoHide: true,
 *   duration: 3
 * });
 *
 * @author SS-Fusion Development Team
 * @since 2.1.0
 */

import Fusion, { Children, Computed, New, Value } from "@rbxts/fusion";
import { defaultColorScheme, spacing, borderRadiusValues, fontSizes } from "../utils/theme";
import { BaseProps } from "../types/common";

export type MessageType = "info" | "success" | "warning" | "error";

export interface MessageBoxProps extends BaseProps {
	/** Message text to display */
	message: Fusion.Value<string> | string;
	/** Type of message for color coding */
	messageType?: MessageType;
	/** Whether to auto-hide the message */
	autoHide?: boolean;
	/** Duration in seconds before auto-hiding */
	duration?: number;
	/** Custom background color override */
	backgroundColor?: Color3;
	/** Custom text color override */
	textColor?: Color3;
	/** Callback when message is dismissed */
	onDismiss?: () => void;
}

/**
 * Get theme colors for message type
 */
function getMessageTypeColors(messageType: MessageType) {
	switch (messageType) {
		case "error":
			return {
				background: defaultColorScheme.Error,
				text: defaultColorScheme.OnPrimary,
				border: defaultColorScheme.Error.Lerp(Color3.fromRGB(0, 0, 0), 0.2),
			};
		case "warning":
			return {
				background: defaultColorScheme.Warning,
				text: defaultColorScheme.OnBackground,
				border: defaultColorScheme.Warning.Lerp(Color3.fromRGB(0, 0, 0), 0.2),
			};
		case "success":
			return {
				background: defaultColorScheme.Success,
				text: defaultColorScheme.OnPrimary,
				border: defaultColorScheme.Success.Lerp(Color3.fromRGB(0, 0, 0), 0.2),
			};
		case "info":
		default:
			return {
				background: defaultColorScheme.Primary,
				text: defaultColorScheme.OnPrimary,
				border: defaultColorScheme.Primary.Lerp(Color3.fromRGB(0, 0, 0), 0.2),
			};
	}
}

/**
 * MessageBox component
 */
export function MessageBox(props: MessageBoxProps): Frame {
	const messageType = props.messageType ?? "info";
	const themeColors = getMessageTypeColors(messageType);
	const isVisible = Value(true);

	// Get message text (handle both string and Value<string>)
	const messageText = Computed(() => {
		if (typeIs(props.message, "string")) {
			return props.message;
		} else {
			return props.message.get();
		}
	});

	// Auto-hide functionality
	if (props.autoHide) {
		const duration = props.duration ?? 3;
		task.delay(duration, () => {
			isVisible.set(false);
			props.onDismiss?.();
		});
	}

	// Message icon based on type
	const getMessageIcon = (messageType: MessageType): string => {
		switch (messageType) {
			case "error":
				return "⚠";
			case "warning":
				return "⚠";
			case "success":
				return "✓";
			case "info":
			default:
				return "ℹ";
		}
	};

	// Icon element
	const IconLabel = New("TextLabel")({
		Name: "MessageIcon",
		Size: new UDim2(0, 24, 1, 0),
		Position: new UDim2(0, spacing.sm, 0, 0),
		BackgroundTransparency: 1,
		Text: getMessageIcon(messageType),
		TextColor3: props.textColor ?? themeColors.text,
		TextScaled: true,
		Font: Enum.Font.SourceSansBold,
		TextXAlignment: Enum.TextXAlignment.Center,
		TextYAlignment: Enum.TextYAlignment.Center,
	});

	// Message text label
	const TextLabel = New("TextLabel")({
		Name: "MessageText",
		Size: new UDim2(1, -64, 1, 0), // Account for icon and padding
		Position: new UDim2(0, 40, 0, 0),
		BackgroundTransparency: 1,
		Text: messageText,
		TextColor3: props.textColor ?? themeColors.text,
		TextSize: fontSizes.md,
		TextWrapped: true,
		TextXAlignment: Enum.TextXAlignment.Left,
		TextYAlignment: Enum.TextYAlignment.Center,
		Font: Enum.Font.SourceSans,
	});

	// Main message container
	const messageContainer = New("Frame")({
		Name: "MessageBox",
		Size: props.Size ?? new UDim2(0.6, 0, 0, 60),
		Position: props.Position ?? new UDim2(0.5, 0, 0.1, 0),
		AnchorPoint: props.AnchorPoint ?? new Vector2(0.5, 0),
		LayoutOrder: props.LayoutOrder,
		ZIndex: props.ZIndex ?? 1000, // High z-index for overlay
		Visible: Computed(() => {
			if (props.Visible !== undefined) {
				if (typeIs(props.Visible, "boolean")) {
					return props.Visible && isVisible.get();
				} else {
					return props.Visible.get() && isVisible.get();
				}
			}
			return isVisible.get();
		}),
		BackgroundColor3: props.backgroundColor ?? themeColors.background,
		BorderSizePixel: 1,
		BorderColor3: themeColors.border,
		[Children]: {
			Corner: New("UICorner")({
				CornerRadius: new UDim(0, borderRadiusValues.medium),
			}),
			Padding: New("UIPadding")({
				PaddingTop: new UDim(0, spacing.sm),
				PaddingBottom: new UDim(0, spacing.sm),
				PaddingLeft: new UDim(0, spacing.sm),
				PaddingRight: new UDim(0, spacing.sm),
			}),
			Icon: IconLabel,
			Text: TextLabel,
			// Drop shadow effect
			DropShadow: New("ImageLabel")({
				Name: "DropShadow",
				Size: new UDim2(1, 6, 1, 6),
				Position: new UDim2(0, 3, 0, 3),
				AnchorPoint: new Vector2(0, 0),
				BackgroundTransparency: 1,
				Image: "rbxasset://textures/ui/Controls/DropShadow.png",
				ImageColor3: Color3.fromRGB(0, 0, 0),
				ImageTransparency: 0.5,
				ScaleType: Enum.ScaleType.Slice,
				SliceCenter: new Rect(12, 12, 244, 244),
				ZIndex: -1,
			}),
		},
	});

	return messageContainer;
}
