import { Children, New, Value } from "@rbxts/fusion";
import { Players } from "@rbxts/services";
import { ImageConstants } from "shared/image-assets";
import { CooldownButton } from "./ui/molecules";
import { Badge, Label } from "./ui/atoms";
import { CharacterInfoCard } from "./ui/organisms";
import { AutoGrid } from "./ui/layout/Grid";
import { PlayerResources, playerProgress } from "./states/resources";

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
const badge = Badge({
    text: "New",
    variant: "success",
    size: "small",
})
const autogrid = AutoGrid({
    children: [cooldownButton, badge]
})


const testScreen = New("ScreenGui")({
    Name: "TestScreen", 
    ResetOnSpawn: false,
    Parent: playerGui,
    [Children]: {
        AutoGrid: autogrid,
        CharacterInfo: (() => {
            // demo values
            const cur1 = PlayerResources.health.current;
            const max1 = PlayerResources.health.max;
            const cur2 = PlayerResources.mana.current;
            const max2 = PlayerResources.mana.max;
            const cur3 = PlayerResources.stamina.current;
            const max3 = PlayerResources.stamina.max;
            const curExp = playerProgress.experience;
            const maxExp = playerProgress.maxExperience;
            return CharacterInfoCard({
                Name: "CharacterInfoDemo",
                Position: new UDim2(0, 20, 0, 20),
                Size: new UDim2(0, 380, 0, 120),
                nameLabel: Players.LocalPlayer.Name,
                bar1: { currentValue: cur1, maxValue: max1, fillColor: Color3.fromRGB(220,60,60) },
                bar2: { currentValue: cur2, maxValue: max2, fillColor: Color3.fromRGB(60,120,255) },
                bar3: { currentValue: cur3, maxValue: max3, fillColor: Color3.fromRGB(245,180,60) },
                levelBar: { currentValue: curExp, maxValue: maxExp, fillColor: Color3.fromRGB(150,90,250), showLabel: true },
            });
        })(),
    },
});

task.spawn(() => {
    while (true) {
        wait(1);
        PlayerResources.health.current.set(PlayerResources.health.current.get() - 1);
        PlayerResources.mana.current.set(PlayerResources.mana.current.get() - 1);
        PlayerResources.stamina.current.set(PlayerResources.stamina.current.get() - 1);
        playerProgress.experience.set(playerProgress.experience.get() + 10);
    }
});
