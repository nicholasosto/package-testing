import { Value } from "@rbxts/fusion";

export const PlayerResources = {
    health: {
        current: Value(100),
        max: Value(100)
    },
    mana: {
        current: Value(50),
        max: Value(50)
    },
    stamina: {
        current: Value(75),
        max: Value(75)
    }
};

export const playerProgress = {
    level: Value(1),
    experience: Value(0),
    maxExperience: Value(100)
};
