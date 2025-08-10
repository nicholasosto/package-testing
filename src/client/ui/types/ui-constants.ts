import { spacing } from "../utils/theme";

export const UI_SIZES = {
    BUTTON_COOLDOWN: new UDim2(0, 70, 0, 90), // Default size for cooldown button
    BUTTON_ICON: new UDim2(0, 50, 0, 50), // Default size for icon button
    PROGRESS_BAR: new UDim2(0, 70, 0, 20), // Default size for progress bar
};

export const UI_FLEX_SIZES = {
    FLEX_SHRINK: () => {
        const flexItem = new Instance("UIFlexItem");
        flexItem.FlexMode = Enum.UIFlexMode.Shrink;
        return flexItem;
    },
    FLEX_GROW: () => {
        const flexItem = new Instance("UIFlexItem");
        flexItem.FlexMode = Enum.UIFlexMode.Grow;
        return flexItem;
    }
};

export const LAYOUTS = {
    Vertical: (spacing: number = 0) => {
        const layout = new Instance("UIListLayout");
        layout.FillDirection = Enum.FillDirection.Vertical;
        layout.SortOrder = Enum.SortOrder.LayoutOrder;
        layout.Padding = new UDim(0, spacing);
        return layout;
    },
    Horizontal: (spacing: number = 0) => {
        const layout = new Instance("UIListLayout");
        layout.FillDirection = Enum.FillDirection.Horizontal;
        layout.SortOrder = Enum.SortOrder.LayoutOrder;
        layout.Padding = new UDim(0, spacing);
        return layout;
    },
    Grid: (cellSize: UDim2, spacing: number = 0) => {
        const layout = new Instance("UIGridLayout");
        layout.CellSize = cellSize;
        layout.SortOrder = Enum.SortOrder.LayoutOrder;
        layout.CellPadding =  UDim2.fromOffset(0, spacing);
        return layout;
    }
}