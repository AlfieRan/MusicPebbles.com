import {
    artistBubbleContextType,
    bubbleContextType,
    bubblePosType,
    bubbleType,
    dimensionType,
} from "../types/bubbles";
import { useEffect, useState } from "react";
import { useScreen } from "./useScreen";
import { min } from "../other/basics";
import { useArtists } from "./useArtists";
import { imageType } from "../types/spotify";
import { getImageSize } from "../other/imageSize";

const padding = 0;
export const pebblePadding = 5;

export function useBubbles() {
    const screen = useScreen();
    const [bubbleContext, setBubbleContext] = useState<bubbleContextType[]>([]);
    const [bubblesState, setBubblesState] = useState<bubbleType[]>([]);
    const artists = useArtists();

    const profileBubble: bubbleType = (() => {
        const area = min(screen.width, screen.height) * 50 + 10000;
        const length = Math.sqrt(area);
        return {
            details: {
                type: "profile",
            },
            physics: {
                pos: { x: 0, y: 0 },
                area,
                dimensions: { width: length, height: length },
                points: getPoints(
                    { width: length, height: length },
                    { x: 0, y: 0 }
                ),
            },
        };
    })();

    const otherContexts: bubbleContextType[] = [{ type: "niche" }];

    useEffect(() => {
        const artistContexts: artistBubbleContextType[] = artists.map(
            (artist) => ({
                type: "artist",
                artist,
            })
        );
        setBubbleContext([...otherContexts, ...artistContexts]);
    }, [artists]);

    useEffect(() => {
        (async () => {
            console.log("Rendering Bubbles...");
            const newBubblesState: bubbleType[] = [profileBubble];
            let unusedAngles: number[] = (() => {
                const angles = [];
                for (let i = 0; i < 36; i++) {
                    angles.push((i * Math.PI) / 18);
                }
                return angles;
            })();

            for (let i = 0; i < bubbleContext.length; i++) {
                const bubbleContextItem = bubbleContext[i];
                if (!bubbleContextItem) {
                    continue;
                }

                if (bubbleContextItem.type === "artist") {
                    const area =
                        (min(screen.width, screen.height) * 15) / (1 + i / 25) +
                        2000;
                    const image: imageType = bubbleContextItem.artist.images[0];
                    const imageSize = await getImageSize(image.url, {
                        width: image.width,
                        height: image.height,
                    });

                    const multiplier = Math.sqrt(
                        area / (imageSize.width * imageSize.height)
                    );

                    const dimensions = {
                        width: imageSize.width * multiplier + pebblePadding,
                        height: imageSize.height * multiplier + pebblePadding,
                    };

                    const pos = getNewPos(
                        dimensions,
                        newBubblesState,
                        screen,
                        unusedAngles
                    );

                    if (!pos) {
                        continue;
                    }

                    unusedAngles = pos.unusedAngles;

                    const newBubble: bubbleType = {
                        details: {
                            type: "artist",
                            artist: {
                                ...bubbleContextItem.artist,
                                ranking: i + 1 - otherContexts.length,
                            },
                        },
                        physics: {
                            pos: pos.pos,
                            area,
                            dimensions,
                            points: getPoints(dimensions, pos.pos),
                        },
                    };
                    newBubblesState.push(newBubble);
                } else {
                    const area = min(screen.width, screen.height) * 25 + 1500;
                    const side = Math.sqrt(area);

                    const dimensions = {
                        width: side,
                        height: side,
                    };

                    const pos = getNewPos(
                        dimensions,
                        newBubblesState,
                        screen,
                        unusedAngles
                    );

                    if (!pos) {
                        continue;
                    }

                    unusedAngles = pos.unusedAngles;

                    const newBubble: bubbleType = {
                        details: {
                            type: "niche",
                        },
                        physics: {
                            pos: pos.pos,
                            dimensions,
                            area,
                            points: getPoints(dimensions, pos.pos),
                        },
                    };
                    newBubblesState.push(newBubble);
                }
            }

            setBubblesState(newBubblesState);
        })();
    }, [bubbleContext, screen]);

    return {
        bubbles: bubblesState,
        updateContext: setBubbleContext,
    };
}

function willCollide(
    pos: bubblePosType,
    dimensions: dimensionType,
    bubbleState: bubbleType[],
    skipBubble?: bubbleType
) {
    for (let i = 0; i < bubbleState.length; i++) {
        const bubble = bubbleState[i];
        if (bubble === skipBubble) {
            continue;
        }

        if (
            bubble.physics.points.left <
                pos.x + padding + dimensions.width / 2 && // left of A is to the left of right of B
            bubble.physics.points.right >
                pos.x - padding - dimensions.width / 2 && // right of A is to the right of left of B
            bubble.physics.points.top <
                pos.y + padding + dimensions.height / 2 && // top of A is above bottom of B
            bubble.physics.points.bottom >
                pos.y - padding - dimensions.height / 2 // bottom of A is below top of B
        ) {
            return true;
        }
    }

    return false;
}

function getNewPos(
    dimensions: dimensionType,
    bubbleState: bubbleType[],
    screen: { width: number; height: number },
    unusedAngles?: number[]
): { pos: bubblePosType; unusedAngles: number[] } | undefined {
    // get the center profile bubble
    const profileBubble = bubbleState[0];

    let tries = 0;
    while (tries < 100) {
        // choose a random angle, have to use a weird method to get a uniform distribution, since Math.random() is not uniform enough
        let angle = 0;
        if (unusedAngles && unusedAngles.length > 0) {
            const i = Math.floor(Math.random() * unusedAngles.length);
            angle = unusedAngles[i];
            unusedAngles.splice(i, 1);
        } else {
            angle = Math.random() * 2 * Math.PI;
        }

        // place the bubble at the closest point on this angle that doesn't collide with any other bubbles
        let dist = profileBubble.physics.dimensions.width / 2;
        let pos = {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
        };
        let keepGoing = true;
        while (keepGoing) {
            dist += 1;
            pos = {
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
            };
            keepGoing = willCollide(pos, dimensions, bubbleState);
        }

        // if the bubble is too close to the edge, call this function again
        const edgeDist = 75;
        if (
            !(
                pos.x < -screen.width / 2 + edgeDist ||
                pos.x > screen.width / 2 - edgeDist ||
                pos.y < -screen.height / 2 + edgeDist ||
                pos.y > screen.height / 2 - edgeDist
            )
        ) {
            return { pos, unusedAngles: unusedAngles ?? [] };
        }

        tries++;
    }

    // if we've tried 100 times and still haven't found a good spot, return undefined
    console.log("Failed to find a spot for bubble.");
    return undefined;
}

function getRandomPos(
    screen: {
        width: number;
        height: number;
    },
    radius?: number
): bubblePosType {
    const altered = {
        width: screen.width - (radius ?? 0) * 2,
        height: screen.height - (radius ?? 0) * 2,
    };
    return {
        x: Math.random() * altered.width - altered.width / 2,
        y: Math.random() * altered.height - altered.height / 2,
    };
}

function getPoints(dimensions: dimensionType, pos: bubblePosType) {
    return {
        top: pos.y - dimensions.height / 2,
        bottom: pos.y + dimensions.height / 2,
        left: pos.x - dimensions.width / 2,
        right: pos.x + dimensions.width / 2,
    };
}
