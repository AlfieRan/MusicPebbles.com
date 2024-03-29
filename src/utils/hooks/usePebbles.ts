import { useEffect, useState } from "react";
import { emptyPebblePhysics, pebbleObjType } from "../types/pebbles";
import { useScreen } from "./useScreen";

// There are 2 screen sizes: small and large.
// Small is for mobile devices and large is for desktops.
// The grid in small is 2x8, and in large it is 5x3.
// TODO: add additional screen size for ultra-wide monitors: 8x2.

const pebbleSizesLarge = {
    profile: {
        width: 1,
        height: 1,
    },
    song: {
        width: 2,
        height: 2,
    },
    artist: {
        width: 2,
        height: 2,
    },
    unique: {
        width: 2,
        height: 1,
    },
    genre: {
        width: 1,
        height: 1,
    },
    playing: {
        width: 2,
        height: 1,
    },
    time: {
        width: 1,
        height: 1,
    },
};

const pebbleOverridesSmall = {
    song: {
        width: 2,
        height: 3,
    },
    artist: {
        width: 2,
        height: 3,
    },
    genre: {
        width: 2,
        height: 1,
    },
};

const pebbleOverridesMedium = {
    artist: {
        width: 2,
        height: 2,
    },
};

// TODO: make this work for any screen size, currently only works well on desktop
export function usePebbles() {
    const [pebbleState, setPebbleState] = useState<pebbleObjType>({
        profile: emptyPebblePhysics,
        artist: emptyPebblePhysics,
        song: emptyPebblePhysics,
        unique: emptyPebblePhysics,
        genre: emptyPebblePhysics,
        time: emptyPebblePhysics,
        playing: emptyPebblePhysics,
    });
    const screenHook = useScreen();
    const [componentHeight, setComponentHeight] = useState<number>(
        screenHook.height
    );

    useEffect(() => {
        let gridSize = { w: 5, h: 3 };
        let sizingMode: "width" | "height" = "width";
        let overflow = false;
        let pebbleSizes = pebbleSizesLarge;
        const padding = Math.max(screenHook.width / 50, 10);

        if (screenHook.width * 1.5 < screenHook.height) {
            overflow = true;
            gridSize = { w: 2, h: 10 };
            pebbleSizes = { ...pebbleSizesLarge, ...pebbleOverridesSmall };
        } else if (screenHook.width < screenHook.height) {
            overflow = true;
            gridSize = { w: 3, h: 6 };
            pebbleSizes = { ...pebbleSizesLarge, ...pebbleOverridesMedium };
        }
        let gridItemSize =
            (screenHook.width - padding * (gridSize.w + 1)) / gridSize.w;

        if (screenHook.height / gridSize.h < screenHook.width / gridSize.w) {
            sizingMode = "height";
        }

        if (
            gridSize.h * (gridItemSize + padding) + padding >
                screenHook.height &&
            !overflow
        ) {
            gridItemSize =
                (screenHook.height - padding * (gridSize.h + 1)) / gridSize.h;
        }

        function getGridItemPosition(
            gridItem: { width: number; height: number },
            gridPos: { x: number; y: number }
        ) {
            let additionalPadding = { x: 0, y: 0 };

            if (sizingMode === "width") {
                additionalPadding.y =
                    (screenHook.height -
                        (gridSize.h * (gridItemSize + padding) + padding)) /
                    2;
            } else {
                additionalPadding.x =
                    (screenHook.width -
                        (gridSize.w * (gridItemSize + padding) + padding)) /
                    2;
            }

            const x =
                gridPos.x * (gridItemSize + padding) +
                padding +
                additionalPadding.x;
            const y =
                gridPos.y * (gridItemSize + padding) +
                padding +
                additionalPadding.y;
            const width =
                gridItem.width * gridItemSize + padding * (gridItem.width - 1);
            const height =
                gridItem.height * gridItemSize +
                padding * (gridItem.height - 1);

            return { dims: { width, height }, pos: { x, y } };
        }

        if (gridSize.w === 5) {
            const newPebbleState: pebbleObjType = {
                profile: getGridItemPosition(pebbleSizes.profile, {
                    x: 2,
                    y: 1,
                }),
                artist: getGridItemPosition(pebbleSizes.artist, { x: 0, y: 0 }),
                song: getGridItemPosition(pebbleSizes.song, { x: 3, y: 1 }),
                unique: getGridItemPosition(pebbleSizes.unique, { x: 2, y: 0 }),
                genre: getGridItemPosition(pebbleSizes.genre, { x: 0, y: 2 }),
                playing: getGridItemPosition(pebbleSizes.playing, {
                    x: 1,
                    y: 2,
                }),
                time: getGridItemPosition(pebbleSizes.time, { x: 4, y: 0 }),
            };
            setPebbleState(newPebbleState);
            setComponentHeight(screenHook.height);
        } else if (gridSize.w === 2) {
            const newPebbleState: pebbleObjType = {
                profile: getGridItemPosition(pebbleSizes.profile, {
                    x: 0,
                    y: 0,
                }),
                artist: getGridItemPosition(pebbleSizes.artist, { x: 0, y: 2 }),
                song: getGridItemPosition(pebbleSizes.song, { x: 0, y: 6 }),
                unique: getGridItemPosition(pebbleSizes.unique, { x: 0, y: 5 }),
                genre: getGridItemPosition(pebbleSizes.genre, { x: 0, y: 9 }),
                playing: getGridItemPosition(pebbleSizes.playing, {
                    x: 0,
                    y: 1,
                }),
                time: getGridItemPosition(pebbleSizes.time, { x: 1, y: 0 }),
            };
            setPebbleState(newPebbleState);
            setComponentHeight(gridSize.h * (padding + gridItemSize) + padding);
        } else if (gridSize.w === 3) {
            const newPebbleState: pebbleObjType = {
                profile: getGridItemPosition(pebbleSizes.profile, {
                    x: 2,
                    y: 0,
                }),
                artist: getGridItemPosition(pebbleSizes.artist, { x: 0, y: 1 }),
                song: getGridItemPosition(pebbleSizes.song, { x: 0.5, y: 4 }),
                unique: getGridItemPosition(pebbleSizes.unique, { x: 0, y: 0 }),
                genre: getGridItemPosition(pebbleSizes.genre, { x: 2, y: 2 }),
                playing: getGridItemPosition(pebbleSizes.playing, {
                    x: 0.5,
                    y: 3,
                }),
                time: getGridItemPosition(pebbleSizes.time, { x: 2, y: 1 }),
            };
            setPebbleState(newPebbleState);
            setComponentHeight(screenHook.height);
        } else {
            console.error("Invalid grid size");
        }
    }, [screenHook]);

    return { pebbleState, componentHeight };
}
