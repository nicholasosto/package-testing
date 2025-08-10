import Fusion, { Children, Computed, ForPairs, New } from "@rbxts/fusion";
import { TabSpec } from "../types/tabs";

export interface TabPanelsProps {
	tabs: TabSpec[];
	active: Fusion.Value<string>;
	mountOnlyActive?: boolean;
}

function KeepMountedPanels(tabs: TabSpec[], active: Fusion.Value<string>) {
	return New("Frame")({
		Name: "Panels",
		BackgroundTransparency: 1,
		Size: UDim2.fromScale(1, 1),
		[Children]: [
			ForPairs(tabs, (_i, tab) => {
				const visible = Computed(() => active.get() === tab.id);
				return $tuple(
					`${tab.id}_PanelWrap`,
					New("Frame")({
						Name: `${tab.id}_Wrap`,
						BackgroundTransparency: 1,
						Size: UDim2.fromScale(1, 1),
						Visible: visible,
						[Children]: [tab.panel()],
					})
				);
			}),
		],
	});
}

function MountOnlyActivePanels(tabs: TabSpec[], active: Fusion.Value<string>) {
	const byId = new Map<string, () => Instance>();
	for (const t of tabs) byId.set(t.id, t.panel);

	return New("Frame")({
		Name: "Panels",
		BackgroundTransparency: 1,
		Size: UDim2.fromScale(1, 1),
		[Children]: Computed(() => {
			const id = active.get();
			const create = byId.get(id);
			const child = create ? create() : undefined;
			return child ? [child] : [] as Instance[];
		}),
	});
}

export function TabPanels(props: TabPanelsProps) {
	return props.mountOnlyActive
		? MountOnlyActivePanels(props.tabs, props.active)
		: KeepMountedPanels(props.tabs, props.active);
}
