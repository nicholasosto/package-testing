/**
 * Grid.ts
 * UIGridLayout wrapper for simple uniform grids and optional responsive columns.
 */
import Fusion, { Children, Computed, New, Value } from "@rbxts/fusion";

export interface GridProps extends Fusion.PropertyTable<Frame> {
  // Accept raw UDim2 or any Fusion binding/computed producing UDim2
  cellSize: UDim2 | unknown;
  cellPadding?: UDim2;
  fillDirectionMaxCells?: number; // for wrapping
  fillDirection?: Enum.FillDirection;
  sortOrder?: Enum.SortOrder;
  children?: Instance[];
}

export function Grid(props: GridProps) {
  const grid = New("UIGridLayout")({
  // Fusion will handle bindings at runtime; TS typing kept permissive here
  CellSize: props.cellSize as UDim2,
    CellPadding: props.cellPadding ?? new UDim2(0, 8, 0, 8),
    FillDirectionMaxCells: props.fillDirectionMaxCells ?? 0,
    FillDirection: props.fillDirection ?? Enum.FillDirection.Horizontal,
    SortOrder: props.sortOrder ?? Enum.SortOrder.LayoutOrder,
  });

  const container = New("Frame")({
    Name: props.Name ?? "Grid",
    BackgroundTransparency: props.BackgroundTransparency ?? 1,
    BackgroundColor3: props.BackgroundColor3,
    BorderSizePixel: props.BorderSizePixel ?? 0,
    Size: props.Size ?? UDim2.fromScale(1, 1),
    Position: props.Position,
    AnchorPoint: props.AnchorPoint,
    ZIndex: props.ZIndex,
    LayoutOrder: props.LayoutOrder,
    Visible: props.Visible,
    [Children]: [grid, ...(props.children ?? [])],
  });

  return container;
}

export interface AutoGridProps extends Omit<GridProps, "cellSize"> {
  minCellPx?: number; // default 64
  maxCellPx?: number; // default 128
}

/** AutoGrid picks a column count based on container width and clamps cell size */
export function AutoGrid(props: AutoGridProps) {
  const minPx = props.minCellPx ?? 64;
  const maxPx = props.maxCellPx ?? 128;

  const widthState = Value(0);

  const cellSize = Computed(() => {
    const w = widthState.get();
    if (w <= 0) return new UDim2(0, minPx, 0, minPx);
    const pad = props.cellPadding ? props.cellPadding.X.Offset : 8;
    const cols = math.max(1, math.floor(w / (maxPx + pad)));
    const usable = math.max(1, w - pad * math.max(0, cols - 1));
    const px = math.clamp(math.floor(usable / cols), minPx, maxPx);
    return new UDim2(0, px, 0, px);
  });

  const container = Grid({ ...props, cellSize });

  // Track AbsoluteSize to recompute cell size
  const updateWidth = () => widthState.set(container.AbsoluteSize.X);
  const conn = container.GetPropertyChangedSignal("AbsoluteSize").Connect(updateWidth);
  if ((container as unknown as Instance).Destroying) {
    (container as unknown as Instance).Destroying.Connect(() => conn.Disconnect());
  }
  // Initialize after parented (AbsoluteSize is 0 until mounted); also try now
  task.defer(updateWidth);
  updateWidth();

  return container;
}
