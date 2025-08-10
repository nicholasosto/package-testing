import { Children, New, Value } from "@rbxts/fusion";
import { Players } from "@rbxts/services";
import { IconButton, CloseButton, Avatar, AutoGrid, CooldownButton  } from "@trembus/ss-fusion";
import { ImageConstants } from "shared/image-assets";

const localPlayer = Players.LocalPlayer;
const playerGui = localPlayer.WaitForChild("PlayerGui");

// Mount a simple playground to verify wiring
const cooldownButton = CooldownButton({
    icon: ImageConstants.Ability.Blood_Elemental,
    
    cooldown: 5,
    variant: 'primary',
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
