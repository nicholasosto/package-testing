import { CanBeState } from "@rbxts/fusion";

/**
 * Base props that all components should extend from
 */
export interface BaseProps {
	/** Optional children elements */
	Children?: Instance[];
	/** Whether the component is visible */
	Visible?: CanBeState<boolean>;
	/** CSS-like positioning and sizing */
	Size?: CanBeState<UDim2>;
	Position?: CanBeState<UDim2>;
	AnchorPoint?: CanBeState<Vector2>;
	/** Z-index for layering */
	ZIndex?: CanBeState<number>;
	/** Layout order for automatic layouts */
	LayoutOrder?: CanBeState<number>;
}

/**
 * Props for components that can be interacted with
 */
export interface InteractableProps extends BaseProps {
	/** Whether the component can be interacted with */
	Interactable?: CanBeState<boolean>;
	/** Callback for when the component is activated */
	OnActivated?: () => void;
	/** Callback for when the component is hovered */
	OnMouseEnter?: () => void;
	/** Callback for when the component stops being hovered */
	OnMouseLeave?: () => void;
}

/**
 * Common color scheme for theming
 */
export interface ColorScheme {
	Primary: Color3;
	Secondary: Color3;
	Accent: Color3;
	Background: Color3;
	Surface: Color3;
	OnPrimary: Color3;
	OnSecondary: Color3;
	OnBackground: Color3;
	OnSurface: Color3;
	Error: Color3;
	Success: Color3;
	Warning: Color3;
}

/**
 * Size variants for components
 */
export type SizeVariant = "small" | "medium" | "large";

/**
 * Color variants for components
 */
export type ColorVariant = "primary" | "secondary" | "accent" | "error" | "success" | "warning";

/**
 * Border radius presets
 */
export type BorderRadius = "none" | "small" | "medium" | "large" | "full";
