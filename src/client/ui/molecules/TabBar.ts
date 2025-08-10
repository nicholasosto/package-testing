import Fusion, { Children, ForPairs, New } from "@rbxts/fusion";
import { TabSpec } from "../types/tabs";
import { TabButton } from "../atoms/TabButton";
import { HStack, VStack } from "../layout/Stack";

export interface TabBarProps {
	tabs: TabSpec[];
	active: Fusion.Value<string>;
	vertical?: boolean;
}

export function TabBar(props: TabBarProps) {
	const size = props.vertical ? new UDim2(0, 140, 1, 0) : new UDim2(1, 0, 0, 36);
	const StackComp = props.vertical ? VStack : HStack;
	return StackComp({
		Name: "TabBar",
		BackgroundTransparency: 1,
		Size: size,
		AutomaticSize: props.vertical ? Enum.AutomaticSize.X : Enum.AutomaticSize.Y,
		gap: 6,
		align: props.vertical ? "start" : "center",
		justify: "start",
		children: [ForPairs(props.tabs, (_i, tab) => $tuple(tab.id, TabButton(tab, props.active))) as unknown as Instance],
	});
}
