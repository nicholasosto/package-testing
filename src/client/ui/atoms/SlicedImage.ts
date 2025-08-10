/**
 * @file SlicedImage.ts
 * @module SlicedImage
 * @layer Client/UI/Atoms
 * @description Reusable 9-slice image component for scalable borders, panels, and decorative UI elements.
 * 
 * This component provides a clean interface for using 9-slice scaling images, which maintain
 * proper corner and edge proportions when scaled to different sizes. Perfect for creating
 * scalable UI panels, borders, and decorative frames.
 *
 * @example
 * // Gothic border frame
 * const borderFrame = SlicedImage({
 *   imageId: "rbxassetid://80375133768026",
 *   sliceCenter: new Rect(130, 130, 130, 130),
 *   sliceScale: 0.5
 * });
 * 
 * @example
 * // Colored panel background
 * const panel = SlicedImage({
 *   imageId: "rbxassetid://123456789",
 *   imageColor: Color3.fromRGB(100, 150, 255),
 *   backgroundColor: Color3.fromRGB(50, 50, 50),
 *   backgroundTransparency: 0.2
 * });
 * 
 * @example
 * // Button background with custom slice
 * const buttonBg = SlicedImage({
 *   imageId: ImageConstants.Borders.CommonSet,
 *   sliceCenter: new Rect(64, 64, 64, 64),
 *   Size: new UDim2(0, 200, 0, 50)
 * });
 *
 * @author Soul Steel Alpha Development Team
 * @since 1.0.0
 */

import Fusion, { New } from "@rbxts/fusion";
import { defaultColorScheme } from "../utils/theme";

/**
 * Props interface for the SlicedImage component.
 * Provides comprehensive configuration for 9-slice image scaling and styling.
 */
export interface SlicedImageProps extends Fusion.PropertyTable<ImageLabel> {
	/** 
	 * The image asset ID to display.
	 * Should be a valid Roblox asset ID string for a 9-slice compatible image.
	 * @example "rbxassetid://80375133768026"
	 */
	imageId: string;

	/** 
	 * The slice center rectangle defining the 9-slice boundaries.
	 * Defines which part of the image should stretch vs. stay fixed.
	 * Format: Rect(left, top, right, bottom) in pixels from image edges.
	 * @default new Rect(64, 64, 64, 64)
	 * @example new Rect(130, 130, 130, 130)
	 */
	sliceCenter?: Rect;

	/** 
	 * Scale factor for the slice boundaries.
	 * Affects how thick the borders appear when scaled.
	 * @default 1
	 * @range 0.1 to 2.0
	 * @example 0.5 for thinner borders, 1.5 for thicker borders
	 */
	sliceScale?: number;

	/** 
	 * Image color tint applied to the entire image.
	 * Useful for theming or creating color variations.
	 * @default Color3.fromRGB(255, 255, 255) (no tint)
	 * @example Color3.fromRGB(100, 150, 255) for blue tint
	 */
	imageColor?: Color3;

	/** 
	 * Background color behind the image.
	 * Only visible if the image has transparency or doesn't fill the frame.
	 * @default Theme Surface color
	 */
	backgroundColor?: Color3;

	/** 
	 * Background transparency (0 = opaque, 1 = transparent).
	 * Controls visibility of the background color.
	 * @default 1 (fully transparent)
	 * @range 0 to 1
	 */
	backgroundTransparency?: number;
}

/**
 * Creates a 9-slice scaled image component for scalable UI elements.
 * 
 * This component handles the complexity of 9-slice scaling, allowing images
 * to be resized while maintaining proper corner and edge proportions. Perfect
 * for creating panels, borders, and decorative elements that need to scale.
 * 
 * @param props - Configuration object for the sliced image
 * @returns An ImageLabel configured for 9-slice scaling
 * 
 * @example
 * // Basic border frame
 * const border = SlicedImage({
 *   imageId: "rbxassetid://80375133768026",
 *   Size: new UDim2(1, 0, 1, 0)
 * });
 * 
 * @example
 * // Colored panel with custom slice settings
 * const panel = SlicedImage({
 *   imageId: ImageConstants.Borders.GothicMetal,
 *   sliceCenter: new Rect(130, 130, 130, 130),
 *   sliceScale: 0.5,
 *   imageColor: Color3.fromRGB(200, 200, 255),
 *   Size: new UDim2(0, 300, 0, 200)
 * });
 */
export function SlicedImage(props: SlicedImageProps): ImageLabel {
	// Default values
	const sliceCenter = props.sliceCenter ?? new Rect(64, 64, 64, 64);
	const sliceScale = props.sliceScale ?? 1;
	const imageColor = props.imageColor ?? Color3.fromRGB(255, 255, 255);
	const backgroundColor = props.backgroundColor ?? defaultColorScheme.Surface;
	const backgroundTransparency = props.backgroundTransparency ?? 1;

	return New("ImageLabel")({
		Name: props.Name ?? "SlicedImage",
		Size: props.Size ?? new UDim2(1, 0, 1, 0),
		Position: props.Position,
		AnchorPoint: props.AnchorPoint,
		BackgroundColor3: backgroundColor,
		BackgroundTransparency: backgroundTransparency,
		BorderSizePixel: props.BorderSizePixel ?? 0,
		ZIndex: props.ZIndex ?? 1,
		LayoutOrder: props.LayoutOrder,

		// Image properties
		Image: props.imageId,
		ImageColor3: imageColor,
		SliceCenter: sliceCenter,
		SliceScale: sliceScale,
		ScaleType: Enum.ScaleType.Slice,

		// Optional properties passthrough
		Visible: props.Visible,
		ClipsDescendants: props.ClipsDescendants,
	});
}
