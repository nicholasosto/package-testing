/**
 * Stack.ts
 * Simple horizontal/vertical stacks using UIListLayout + UIPadding with gap and alignment.
 */
import Fusion, { Children, New } from "@rbxts/fusion";
import { spacing } from "../utils/theme";

export type StackDirection = "row" | "column";
export type Align = "start" | "center" | "end";
export type Justify = "start" | "center" | "end" | "spaceBetween";

export interface StackProps extends Fusion.PropertyTable<Frame> {
  direction?: StackDirection;
  gap?: number;
  padding?: number;
  align?: Align;    // cross-axis alignment
  justify?: Justify; // main-axis distribution
  children?: Instance[];
}

function toHorizontalAlignment(justify: Justify) {
  switch (justify) {
    case "center":
      return Enum.HorizontalAlignment.Center;
    case "end":
      return Enum.HorizontalAlignment.Right;
    // UIListLayout cannot truly implement space-between. Fallback to Left.
    default:
      return Enum.HorizontalAlignment.Left;
  }
}

function toVerticalAlignment(align: Align) {
  switch (align) {
    case "center":
      return Enum.VerticalAlignment.Center;
    case "end":
      return Enum.VerticalAlignment.Bottom;
    default:
      return Enum.VerticalAlignment.Top;
  }
}

function toHorizontalAlignmentFromAlign(align: Align) {
  switch (align) {
    case "center":
      return Enum.HorizontalAlignment.Center;
    case "end":
      return Enum.HorizontalAlignment.Right;
    default:
      return Enum.HorizontalAlignment.Left;
  }
}

function toVerticalAlignmentFromJustify(justify: Justify) {
  switch (justify) {
    case "center":
      return Enum.VerticalAlignment.Center;
    case "end":
      return Enum.VerticalAlignment.Bottom;
    // UIListLayout cannot truly implement space-between. Fallback to Top.
    default:
      return Enum.VerticalAlignment.Top;
  }
}

export function Stack(props: StackProps) {
  const direction = props.direction ?? "row";
  const gap = props.gap ?? spacing.sm;
  const pad = props.padding ?? 0;
  const align = props.align ?? "center";
  const justify = props.justify ?? "start";

  const horizontal = direction === "row";

  const layout = New("UIListLayout")({
    FillDirection: horizontal ? Enum.FillDirection.Horizontal : Enum.FillDirection.Vertical,
    Padding: new UDim(0, gap),
    SortOrder: Enum.SortOrder.LayoutOrder,
    // Main-axis alignment uses `justify`, cross-axis uses `align`
    HorizontalAlignment: horizontal
      ? toHorizontalAlignment(justify)
      : toHorizontalAlignmentFromAlign(align),
    VerticalAlignment: horizontal
      ? toVerticalAlignment(align)
      : toVerticalAlignmentFromJustify(justify),
  });

  const container = New("Frame")({
    Name: props.Name ?? (horizontal ? "HStack" : "VStack"),
    BackgroundTransparency: props.BackgroundTransparency ?? 1,
    BackgroundColor3: props.BackgroundColor3,
    BorderSizePixel: props.BorderSizePixel ?? 0,
    Size: props.Size ?? UDim2.fromScale(1, 0),
    // Auto-size on the CROSS axis by default (doc expectation)
    AutomaticSize: horizontal ? Enum.AutomaticSize.Y : Enum.AutomaticSize.X,
    Position: props.Position,
    AnchorPoint: props.AnchorPoint,
    ZIndex: props.ZIndex,
    LayoutOrder: props.LayoutOrder,
    Visible: props.Visible,
    [Children]: [
      New("UIPadding")({
        PaddingLeft: new UDim(0, pad),
        PaddingRight: new UDim(0, pad),
        PaddingTop: new UDim(0, pad),
        PaddingBottom: new UDim(0, pad),
      }),
      layout,
      ...(props.children ?? []),
    ],
  });

  // Note: true space-between distribution is not supported by UIListLayout.
  // If requested, we gracefully fall back via the alignment mapping above.

  return container;
}

export interface SpacerProps extends Fusion.PropertyTable<Frame> {
  direction?: StackDirection; // match stack for correct axis
  size?: number; // optional fixed px on main axis
}

export function Spacer(props: SpacerProps) {
  const direction = props.direction ?? "row";
  const isRow = direction === "row";
  return New("Frame")({
    Name: props.Name ?? "Spacer",
    BackgroundTransparency: 1,
    BorderSizePixel: 0,
    Size: props.size
      ? (isRow ? new UDim2(0, props.size, 1, 0) : new UDim2(1, 0, 0, props.size))
      : (isRow ? new UDim2(1, 0, 0, 0) : new UDim2(0, 0, 1, 0)),
    AutomaticSize: Enum.AutomaticSize.None,
  });
}

export function HStack(props: Omit<StackProps, "direction">) {
  return Stack({ ...props, direction: "row" });
}

export function VStack(props: Omit<StackProps, "direction">) {
  return Stack({ ...props, direction: "column" });
}
