/**
 * @file CharacterInfoCard.ts
 * @module CharacterInfoCard
 * @layer Client/UI/Organisms
 * @description Composite UI card showing a player's avatar, three stacked resource bars,
 * and a large bottom progress bar with a value indicator (e.g., player level/XP).
 */

import Fusion, { Children, New } from "@rbxts/fusion";
import { Avatar, Label, ProgressBar } from "client/ui/atoms";
import { HStack, VStack } from "client/ui/layout/Stack";
import { defaultColorScheme, spacing } from "client/ui/utils/theme";

export interface ResourceBarProps {
  currentValue: Fusion.Value<number>;
  maxValue: Fusion.Value<number>;
  fillColor?: Color3;
  labelText?: Fusion.Value<string> | Fusion.Computed<string>;
}

export interface CharacterInfoCardProps extends Fusion.PropertyTable<Frame> {
  /** Avatar user id (defaults to LocalPlayer if omitted) */
  userId?: Fusion.Value<number> | number;

  /** Three stacked small resource bars (e.g., health/mana/stamina). */
  bar1: ResourceBarProps;
  bar2: ResourceBarProps;
  bar3: ResourceBarProps;

  /** Large bottom bar (e.g., level/XP) */
  levelBar: ResourceBarProps & { showLabel?: boolean };
  nameLabel: Fusion.Value<string> | string;

  /** Optional avatar size in pixels (square). Defaults to 72. */
  avatarPx?: number;
}

export function CharacterInfoCard(props: CharacterInfoCardProps): Frame {
  const avatarPx = props.avatarPx ?? 72;

  // Safe defaults for colors
  const bar1Color = props.bar1.fillColor ?? defaultColorScheme.Error; // health-like
  const bar2Color = props.bar2.fillColor ?? defaultColorScheme.Primary; // mana-like
  const bar3Color = props.bar3.fillColor ?? defaultColorScheme.Warning; // stamina-like
  const levelColor = props.levelBar.fillColor ?? defaultColorScheme.Accent; // xp-like

  // Small bar factory to keep sizes consistent
  const SmallBar = (name: string, b: ResourceBarProps) =>
    ProgressBar({
      Name: name,
      Size: new UDim2(1, 0, 0, 12),
      currentValue: b.currentValue,
      maxValue: b.maxValue,
      fillColor: b.fillColor ?? defaultColorScheme.Primary,
      showLabel: b.labelText !== undefined,
      labelText: b.labelText,
      BorderSizePixel: 0,
      BackgroundColor3: Color3.fromRGB(30, 30, 30),
    });

  // Top row: avatar + three stacked bars
  const topRow = HStack({
    Name: "TopRow",
    gap: spacing.md,
    children: [
      Avatar({
        Name: "Avatar",
        userId: props.userId,
        Size: new UDim2(0, avatarPx, 0, avatarPx),
        showBorder: true,
        borderColor: defaultColorScheme.Surface,
        backgroundColor: Color3.fromRGB(0, 0, 0),
      }),
      VStack({
        Name: "BarsStack",
        gap: spacing.sm,
  // Fill remaining width: total - avatarPx - horizontal gap between avatar and bars
  Size: new UDim2(1, -(2*avatarPx + spacing.md), 0, avatarPx),
        children: [
            New("UIFlexItem")({
                FlexMode: Enum.UIFlexMode.Shrink
            }),
            SmallBar("Bar1", { ...props.bar1, fillColor: bar1Color }),
            SmallBar("Bar2", { ...props.bar2, fillColor: bar2Color }),
            SmallBar("Bar3", { ...props.bar3, fillColor: bar3Color }),
            Label({
                text: props.nameLabel,
                variant: 'caption',
            })
        ],
      }),
    ],
  });

  // Bottom large bar with optional label overlay
  const bottomBar = ProgressBar({
    Name: "LevelBar",
    Size: new UDim2(1, 0, 0, 18),
    currentValue: props.levelBar.currentValue,
    maxValue: props.levelBar.maxValue,
    fillColor: levelColor,
    showLabel: props.levelBar.showLabel ?? true,
    labelText: props.levelBar.labelText,
    BorderSizePixel: 0,
    BackgroundColor3: Color3.fromRGB(30, 30, 30),
  });


  // Card container with simple styling
  return New("Frame")({
    Name: props.Name ?? "CharacterInfoCard",
    Size: props.Size ?? new UDim2(0, 360, 0, avatarPx + 18 + 3* spacing.md),
    BackgroundColor3: Color3.fromRGB(25, 25, 25),
    BorderSizePixel: 0,
    Position: props.Position,
    AnchorPoint: props.AnchorPoint,
    ZIndex: props.ZIndex,
    LayoutOrder: props.LayoutOrder,
    [Children]: [
      New("UICorner")({ CornerRadius: new UDim(0, 8) }),
      New("UIStroke")({ Color: Color3.fromRGB(60, 60, 60), Thickness: 1, Transparency: 0.2 }),
      New("UIPadding")({
        PaddingTop: new UDim(0, spacing.md),
        PaddingBottom: new UDim(0, spacing.md),
        PaddingLeft: new UDim(0, spacing.md),
        PaddingRight: new UDim(0, spacing.md),
      }),
      // Vertical arrangement: top row then bottom bar
      New("UIListLayout")({
        FillDirection: Enum.FillDirection.Vertical,
        Padding: new UDim(0, spacing.md),
        SortOrder: Enum.SortOrder.LayoutOrder,
        VerticalFlex: Enum.UIFlexAlignment.SpaceEvenly
      }),

      topRow,
      bottomBar,
    ],
  });
}
