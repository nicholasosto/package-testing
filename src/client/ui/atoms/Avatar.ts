/**
 * @file Avatar.ts
 * @module Avatar
 * @layer Client/UI/Atoms
 * @description User avatar/thumbnail component that fetches a player's image via GetUserThumbnailAsync.
 *
 * - Defaults to the local player's UserId when none is provided
 * - Supports shape (circle/rounded/square), size variants, and optional border
 * - Provides a placeholder image while loading or on failure
 */

import Fusion, { Children, New, Value, Observer } from "@rbxts/fusion";
import { defaultColorScheme } from "../utils/theme";
import { ImageConstants } from "../types/image-assets";

const Players = game.GetService("Players");

export type AvatarShape = "circle" | "rounded" | "square";
export type AvatarVariantSize = "small" | "medium" | "large";

export interface AvatarProps extends Fusion.PropertyTable<Frame> {
  /** User id to fetch thumbnail for; defaults to LocalPlayer.UserId */
  userId?: Fusion.Value<number> | number;
  /** Size preset; ignored if explicit Size is provided */
  size?: AvatarVariantSize;
  /** Visual shape for the avatar mask */
  shape?: AvatarShape;
  /** Display a border stroke around the avatar */
  showBorder?: boolean;
  /** Border color (used when showBorder is true) */
  borderColor?: Color3;
  /** Thumbnail type; defaults to HeadShot */
  thumbnailType?: Enum.ThumbnailType;
  /** Placeholder image id while loading or on failure */
  placeholderImage?: string;
  /** Optional background color behind the image */
  backgroundColor?: Color3;
}

function sizePresetToPixels(size: AvatarVariantSize) {
  switch (size) {
    case "small":
      return 48;
    case "large":
      return 180;
    case "medium":
    default:
      return 100;
  }
}

function sizePresetToThumbnail(size: AvatarVariantSize): Enum.ThumbnailSize {
  switch (size) {
    case "small":
      return Enum.ThumbnailSize.Size48x48;
    case "large":
      return Enum.ThumbnailSize.Size180x180;
    case "medium":
    default:
      return Enum.ThumbnailSize.Size100x100;
  }
}

/**
 * Create an Avatar component that displays a user's Roblox thumbnail.
 */
export function Avatar(props: AvatarProps): Frame {
  // Defaults
  const shape = props.shape ?? "circle";
  const sizePreset = props.size ?? "medium";
  const showBorder = props.showBorder ?? false;
  const borderColor = props.borderColor ?? defaultColorScheme.Surface;
  const backgroundColor = props.backgroundColor ?? Color3.fromRGB(0, 0, 0);
  const placeholder = props.placeholderImage ?? ImageConstants.DefaultUnassigned;
  const thumbType = props.thumbnailType ?? Enum.ThumbnailType.HeadShot;

  const px = sizePresetToPixels(sizePreset);
  const thumbSize = sizePresetToThumbnail(sizePreset);

  // Unify userId into a state for observation
  const userIdState: Fusion.Value<number> = typeIs(props.userId, "number")
    ? Value(props.userId as number)
    : (props.userId as Fusion.Value<number>) ?? Value(Players.LocalPlayer?.UserId ?? 0);

  // Image state
  const imageState = Value<string>(placeholder);

  // Fetch function
  const fetchThumbnail = (uid: number) => {
    task.spawn(() => {
      if (uid && uid > 0) {
        const [url, isReady] = Players.GetUserThumbnailAsync(uid, thumbType, thumbSize);
        imageState.set(isReady && url !== "" ? url : placeholder);
      } else {
        imageState.set(placeholder);
      }
    });
  };

  // Initial fetch and re-fetch on userId change
  fetchThumbnail(userIdState.get());
  Observer(userIdState).onChange(() => fetchThumbnail(userIdState.get()));

  // Visual nodes
  const image = New("ImageLabel")({
    Name: "AvatarImage",
    BackgroundColor3: backgroundColor,
    BackgroundTransparency: 0,
    Size: new UDim2(1, 0, 1, 0),
    Image: imageState,
    ScaleType: Enum.ScaleType.Fit,
    ClipsDescendants: true,
    ZIndex: 2,
  });

  // Corner radius for shape
  const corner = New("UICorner")({
    CornerRadius:
      shape === "circle" ? new UDim(1, 0) : shape === "rounded" ? new UDim(0, 8) : new UDim(0, 0),
  });
  corner.Parent = image;

  // Optional border
  if (showBorder) {
    const stroke = New("UIStroke")({
      Color: borderColor,
      Thickness: 2,
      Transparency: 0,
      ApplyStrokeMode: Enum.ApplyStrokeMode.Border,
    });
    stroke.Parent = image;
  }

  // Container (allows external sizing via props.Size or preset fallback)
  const container = New("Frame")({
    Name: props.Name ?? "Avatar",
    Size: props.Size ?? new UDim2(0, px, 0, px),
    Position: props.Position,
    AnchorPoint: props.AnchorPoint,
    BackgroundTransparency: 1,
    BorderSizePixel: 0,
    ZIndex: props.ZIndex,
    LayoutOrder: props.LayoutOrder,
    [Children]: [image],
    Visible: props.Visible,
    ClipsDescendants: props.ClipsDescendants,
  });

  // Keep square aspect if externally resized
  const aspect = New("UIAspectRatioConstraint")({ AspectRatio: 1 });
  aspect.Parent = container;

  return container;
}
