import { useEffect, useState } from "react";
import {
    emptyPebblePhysics,
    pebbleObjType,
    screenType,
} from "../types/pebbles";
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
        width: 3,
        height: 1,
    },
    time: {
        width: 1,
        height: 1,
    },
};

const pebbleSizesSmall = {
    ...pebbleSizesLarge,
    genre: { width: 2, height: 2 },
};

const maxHeight = 5;

// TODO: make this work for any screen size, currently only works well on desktop
export function usePebbles() {
    const [pebbleState, setPebbleState] = useState<pebbleObjType>({
        profile: emptyPebblePhysics,
        artist: emptyPebblePhysics,
        song: emptyPebblePhysics,
        unique: emptyPebblePhysics,
        genre: emptyPebblePhysics,
        time: emptyPebblePhysics,
    });
    const screenHook = useScreen();
    const [componentHeight, setComponentHeight] = useState<number | undefined>(
        undefined
    );

    useEffect(() => {
        let gridSize = { w: 5, h: 3 };
        let sizingMode: "width" | "height" = "width";
        let pebbleSizes = pebbleSizesLarge;
        const padding = Math.max(screenHook.width / 50, 10);

        if (screenHook.width < 600) {
            gridSize = { w: 2, h: 8 };
            pebbleSizes = pebbleSizesSmall;
        }
        const gridItemSize = (() => {
            if (
                screenHook.height / gridSize.h >
                screenHook.width / gridSize.w
            ) {
                return (
                    (screenHook.width - padding * (gridSize.w + 1)) / gridSize.w
                );
            }
            sizingMode = "height";
            const h = Math.min(maxHeight, gridSize.h);
            return (screenHook.height - padding * (h + 1)) / h;
        })();

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
            const pebbleState: pebbleObjType = {
                profile: getGridItemPosition(pebbleSizes.profile, {
                    x: 2,
                    y: 1,
                }),
                artist: getGridItemPosition(pebbleSizes.artist, { x: 0, y: 1 }),
                song: getGridItemPosition(pebbleSizes.song, { x: 3, y: 0 }),
                unique: getGridItemPosition(pebbleSizes.unique, { x: 2, y: 2 }),
                genre: getGridItemPosition(pebbleSizes.genre, { x: 0, y: 0 }),
                time: getGridItemPosition(pebbleSizes.time, { x: 4, y: 2 }),
            };
            setPebbleState(pebbleState);
            setComponentHeight(screenHook.height);
        } else {
            const pebbleState: pebbleObjType = {
                profile: getGridItemPosition(pebbleSizes.profile, {
                    x: 0,
                    y: 5,
                }),
                artist: getGridItemPosition(pebbleSizes.artist, { x: 0, y: 6 }),
                song: getGridItemPosition(pebbleSizes.song, { x: 0, y: 3 }),
                unique: getGridItemPosition(pebbleSizes.unique, { x: 0, y: 2 }),
                genre: getGridItemPosition(pebbleSizes.genre, { x: 0, y: 0 }),
                time: getGridItemPosition(pebbleSizes.time, { x: 1, y: 5 }),
            };
            setPebbleState(pebbleState);
            setComponentHeight(
                gridItemSize * gridSize.h + padding * (gridSize.h + 1)
            );
        }
    }, [screenHook]);

    return { pebbleState, componentHeight };
}
