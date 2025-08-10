import { Children, New, Value } from "@rbxts/fusion";
import { Players } from "@rbxts/services";
import { ImageConstants } from "shared/image-assets";
import { CooldownButton } from "./ui/molecules";

const localPlayer = Players.LocalPlayer;
const playerGui = localPlayer.WaitForChild("PlayerGui");

// Mount a simple playground to verify wiring
const cooldownButton = CooldownButton({
    icon: ImageConstants.Ability.Blood_Elemental,
    cooldown: 5,
    variant: 'primary',
    size: 'large',
    onClick: () => print("Cooldown clicked"),
    showCooldownLabel: true,
    cooldownLabelText: Value("Auto"),
})

const testScreen = New("ScreenGui")({
    Name: "TestScreen",
    ResetOnSpawn: false,
    Parent: playerGui,
    [Children]: {
        CooldownButton: cooldownButton,
    },
});
