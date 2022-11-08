import {
    artistBubbleContextType,
    bubbleContextType,
    bubblePosType,
    bubbleType,
} from "../types/bubbles";
import { useEffect, useState } from "react";
import { useScreen } from "./useScreen";
import { min } from "../basics";
import { useArtists } from "./useArtists";

export function useBubbles() {
    const screen = useScreen();
    const [bubbleContext, setBubbleContext] = useState<bubbleContextType[]>([]);
    const [bubblesState, setBubblesState] = useState<bubbleType[]>([]);
    const artists = useArtists();

    const profileBubble: bubbleType = {
        details: {
            type: "profile",
        },
        physics: {
            pos: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 },
            radius: min(screen.width, screen.height) / 7 + 35,
        },
    };

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
                const radius =
                    min(screen.width, screen.height) / (13 * (1 + i / 25)) + 10;
                const pos = getNewPos(
                    radius,
                    newBubblesState,
                    screen,
                    unusedAngles
                );
                if (pos === undefined) {
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
                        velocity: { x: 0, y: 0 },
                        pos: pos.pos,
                        radius,
                    },
                };
                newBubblesState.push(newBubble);
            } else {
                const radius = profileBubble.physics.radius * 0.6;
                const pos = getNewPos(
                    radius,
                    newBubblesState,
                    screen,
                    unusedAngles
                );
                if (pos === undefined) {
                    continue;
                }
                unusedAngles = pos.unusedAngles;
                const newBubble: bubbleType = {
                    details: {
                        type: "niche",
                    },
                    physics: {
                        velocity: { x: 0, y: 0 },
                        pos: pos.pos,
                        radius,
                    },
                };
                newBubblesState.push(newBubble);
            }
        }

        setBubblesState(newBubblesState);
    }, [bubbleContext, screen]);

    return {
        bubbles: bubblesState,
        updateContext: setBubbleContext,
    };
}

function willCollide(
    pos: bubblePosType,
    radius: number,
    bubbleState: bubbleType[],
    skipBubble?: bubbleType
) {
    for (let i = 0; i < bubbleState.length; i++) {
        const bubble = bubbleState[i];
        if (bubble === skipBubble) {
            continue;
        }
        const dist = Math.sqrt(
            (pos.x - bubble.physics.pos.x) ** 2 +
                (pos.y - bubble.physics.pos.y) ** 2
        );
        if (dist < radius + bubble.physics.radius) {
            return true;
        }
    }
    return false;
}

function getNewPos(
    radius: number,
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
        let dist = (profileBubble.physics.radius + radius) * 0.85;
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
            keepGoing = willCollide(pos, radius, bubbleState);
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
