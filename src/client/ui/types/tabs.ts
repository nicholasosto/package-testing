import type Fusion from "@rbxts/fusion";
import type { CanBeState, Value } from "@rbxts/fusion";

/** Describes an individual tab in a TabGroup */
export interface TabSpec {
	/** Unique, stable key (e.g. "Inventory") */
	id: string;
	/** Button text */
	label: string;
	/** Optional icon asset id for ImageLabel/ImageButton */
	icon?: string;
	/** Disable flag (static or reactive) */
	disabled?: CanBeState<boolean>;
	/** Factory that returns the panel Instance for this tab */
	panel: () => Instance;
}

/** Props to configure a TabGroup organism */
export interface TabGroupProps extends Fusion.PropertyTable<Frame> {
	/** External source of truth for active tab id */
	active: Value<string>;
	/** All tab specifications */
	tabs: TabSpec[];
	/** Optional layout orientation */
	layout?: "Top" | "Left";
	/** If true, only the active panel is mounted to the tree */
	mountOnlyActive?: boolean;
}
