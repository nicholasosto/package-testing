import { ColorScheme, BorderRadius } from "../types/common";

/**
 * Default color scheme for the component library
 */
export const defaultColorScheme: ColorScheme = {
	Primary: Color3.fromRGB(59, 130, 246), // Blue-500
	Secondary: Color3.fromRGB(107, 114, 128), // Gray-500
	Accent: Color3.fromRGB(168, 85, 247), // Purple-500
	Background: Color3.fromRGB(255, 255, 255), // White
	Surface: Color3.fromRGB(249, 250, 251), // Gray-50
	OnPrimary: Color3.fromRGB(255, 255, 255), // White
	OnSecondary: Color3.fromRGB(255, 255, 255), // White
	OnBackground: Color3.fromRGB(17, 24, 39), // Gray-900
	OnSurface: Color3.fromRGB(55, 65, 81), // Gray-700
	Error: Color3.fromRGB(239, 68, 68), // Red-500
	Success: Color3.fromRGB(34, 197, 94), // Green-500
	Warning: Color3.fromRGB(245, 158, 11), // Amber-500
};

/**
 * Border radius values in pixels
 */
export const borderRadiusValues: Record<BorderRadius, number> = {
	none: 0,
	small: 4,
	medium: 8,
	large: 16,
	full: 9999,
};

/**
 * Standard spacing values following 4px grid
 */
export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	xxl: 48,
	xxxl: 64,
} as const;

/**
 * Standard font sizes
 */
export const fontSizes = {
	xs: 12,
	sm: 14,
	md: 16,
	lg: 18,
	xl: 20,
	xxl: 24,
	xxxl: 32,
} as const;

/**
 * Standard z-index values for layering
 */
export const zIndex = {
	background: -1,
	base: 0,
	dropdown: 1000,
	sticky: 1020,
	fixed: 1030,
	modal: 1040,
	popover: 1050,
	tooltip: 1060,
	toast: 1070,
} as const;
