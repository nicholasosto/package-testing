import Fusion, { Children, Computed, New, OnEvent, Value } from "@rbxts/fusion";
import { defaultColorScheme } from "../utils/theme";
import { TabSpec } from "../types/tabs";

/** Simple tab button atom that toggles active tab via external state */
export function TabButton(tab: TabSpec, active: Fusion.Value<string>) {
	const isActive = Computed(() => active.get() === tab.id);
	const isDisabled = typeOf(tab.disabled) === "boolean"
		? Value(tab.disabled as boolean)
		: (tab.disabled as Fusion.Value<boolean> | undefined) ?? Value(false);

	return New("TextButton")({
		Name: `Tab_${tab.id}`,
		AutomaticSize: Enum.AutomaticSize.XY,
		AutoButtonColor: false,
		Text: tab.label,
		Font: Enum.Font.GothamBold,
		TextSize: 14,
		TextColor3: Computed(() => isActive.get() ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(210, 210, 210)),
		BackgroundColor3: Computed(() => isActive.get() ? defaultColorScheme.Primary : defaultColorScheme.Surface),
		BackgroundTransparency: Computed(() => isDisabled.get() ? 0.4 : 0),
		BorderSizePixel: 0,
		[OnEvent("Activated")]: () => {
			if (!isDisabled.get()) active.set(tab.id);
		},
		[Children]: [
			// Optionally place an icon here using tab.icon if provided
		],
	});
}
