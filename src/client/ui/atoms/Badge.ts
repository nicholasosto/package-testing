/**
 * Badge.ts
 * Lightweight status/count label with theme variants, sizes, and optional icon or dot mode.
 */
import Fusion, { Children, Computed, New } from "@rbxts/fusion";
import { defaultColorScheme, spacing, fontSizes } from "../utils/theme";

export type BadgeVariant =
	| "primary"
	| "secondary"
	| "accent"
	| "success"
	| "warning"
	| "danger"
	| "neutral";

export type BadgeSize = "small" | "medium" | "large";
export type BadgeShape = "square" | "rounded" | "pill";

export interface BadgeProps extends Fusion.PropertyTable<Frame> {
	/** Text to display (used if provided; combined with value when both exist) */
	text?: Fusion.Value<string> | string;
	/** Numeric value to display (e.g., notification count) */
	value?: Fusion.Value<number> | number;
	/** Cap for numeric values; 99 -> "99+" */
	maxValue?: number;
	/** Visual color variant */
	variant?: BadgeVariant;
	/** Size preset */
	size?: BadgeSize;
	/** Corner style */
	shape?: BadgeShape;
	/** Optional icon id to show before text */
	icon?: string;
	/** If true, render as a small color dot without text */
	dot?: boolean;
	/** Explicit text color override */
	textColor?: Color3;
}

function variantToBackground(variant: BadgeVariant): Color3 {
	switch (variant) {
		case "primary":
			return defaultColorScheme.Primary;
		case "secondary":
			return defaultColorScheme.Secondary;
		case "accent":
			return defaultColorScheme.Accent;
		case "success":
			return defaultColorScheme.Success;
		case "warning":
			return defaultColorScheme.Warning;
		case "danger":
			return defaultColorScheme.Error;
		case "neutral":
		default:
			return defaultColorScheme.Surface;
	}
}

function variantToText(variant: BadgeVariant): Color3 {
	switch (variant) {
		case "secondary":
			return defaultColorScheme.OnSecondary;
		case "neutral":
			return defaultColorScheme.OnSurface;
		default:
			return defaultColorScheme.OnPrimary; // good contrast on solid backgrounds
	}
}

function sizeConfig(size: BadgeSize) {
	switch (size) {
		case "small":
			return { height: 18, padX: spacing.xs, iconScale: 0.6, font: fontSizes.xs, dot: 8 };
		case "large":
			return { height: 28, padX: spacing.md, iconScale: 0.7, font: fontSizes.lg, dot: 12 };
		case "medium":
		default:
			return { height: 22, padX: spacing.sm, iconScale: 0.65, font: fontSizes.sm, dot: 10 };
	}
}

function shapeCorner(shape: BadgeShape, heightPx: number) {
	if (shape === "pill") return heightPx / 2;
	if (shape === "rounded") return 8;
	return 0;
}

export function Badge(props: BadgeProps) {
	const variant = props.variant ?? "primary";
	const size = props.size ?? "medium";
	const shape = props.shape ?? "pill";
	const maxValue = props.maxValue ?? 99;

	const cfg = sizeConfig(size);
	const bg = variantToBackground(variant);
	const fg = props.textColor ?? variantToText(variant);

	// Dot mode: render a small circle only
	if (props.dot) {
		return New("Frame")({
			Name: props.Name ?? "BadgeDot",
			Size: props.Size ?? new UDim2(0, cfg.dot, 0, cfg.dot),
			Position: props.Position,
			AnchorPoint: props.AnchorPoint,
			BackgroundColor3: bg,
			BackgroundTransparency: 0,
			BorderSizePixel: 0,
			ZIndex: props.ZIndex,
			LayoutOrder: props.LayoutOrder,
			Visible: props.Visible,
			[Children]: [New("UICorner")({ CornerRadius: new UDim(0, cfg.dot / 2) })],
		});
	}

	// Compute display text from text/value
	const textState = props.text;
	const valueState = props.value;
	const display = Computed(() => {
		let label = "";
		if (typeIs(textState, "string")) label = textState as string;
	else if (textState) label = (textState as Fusion.Value<string>).get();

		let countStr = "";
		if (typeIs(valueState, "number")) {
			const v = valueState as number;
			countStr = v > maxValue ? `${maxValue}+` : tostring(v);
		} else if (valueState) {
			const v = (valueState as Fusion.Value<number>).get();
			countStr = v > maxValue ? `${maxValue}+` : tostring(v);
		}

		if (label !== "" && countStr !== "") return `${label} ${countStr}`;
		return label !== "" ? label : countStr;
	});

	const container = New("Frame")({
		Name: props.Name ?? "Badge",
		Size: props.Size ?? new UDim2(0, 0, 0, cfg.height),
		Position: props.Position,
		AnchorPoint: props.AnchorPoint,
		AutomaticSize: Enum.AutomaticSize.X,
		BackgroundColor3: bg,
		BorderSizePixel: 0,
		ZIndex: props.ZIndex,
		LayoutOrder: props.LayoutOrder,
		Visible: props.Visible,
		[Children]: [
			New("UIListLayout")({
				FillDirection: Enum.FillDirection.Horizontal,
				VerticalAlignment: Enum.VerticalAlignment.Center,
				HorizontalAlignment: Enum.HorizontalAlignment.Center,
				Padding: new UDim(0, 4),
			}),
			New("UIPadding")({
				PaddingLeft: new UDim(0, cfg.padX),
				PaddingRight: new UDim(0, cfg.padX),
			}),
		],
	});

	// Optional icon
	if (props.icon) {
		const icon = New("ImageLabel")({
			Name: "Icon",
			BackgroundTransparency: 1,
			Image: props.icon,
			ImageColor3: fg,
			Size: new UDim2(0, math.floor(cfg.height * cfg.iconScale), 0, math.floor(cfg.height * cfg.iconScale)),
		});
		icon.Parent = container;
	}

	// Label text
	const label = New("TextLabel")({
		Name: "Text",
		BackgroundTransparency: 1,
		Text: display,
		TextColor3: fg,
		TextSize: cfg.font,
		Font: Enum.Font.GothamMedium,
		AutomaticSize: Enum.AutomaticSize.X,
		Size: new UDim2(0, 0, 1, 0),
		TextXAlignment: Enum.TextXAlignment.Center,
		TextYAlignment: Enum.TextYAlignment.Center,
	});
	label.Parent = container;

	// Shape
	const corner = New("UICorner")({ CornerRadius: new UDim(0, shapeCorner(shape, cfg.height)) });
	corner.Parent = container;

	return container;
}
