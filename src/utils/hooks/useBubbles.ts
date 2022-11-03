import { bubbleContextType, bubblePosType, bubbleType } from "../types/bubbles";
import { useEffect, useState } from "react";
import { useScreen } from "./useScreen";
import { min } from "../basics";
import { useArtists } from "./useArtists";

export function useBubbles(tickrate: number = 24) {
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
            radius: min(screen.width, screen.height) / 7,
        },
    };

    useEffect(() => {
        setBubbleContext(
            artists.map((artist) => ({
                type: "artist",
                artist: artist,
            }))
        );
    }, [artists]);

    useEffect(() => {
        console.log("useBubbles useEffect");
        const newBubblesState: bubbleType[] = [profileBubble];

        for (let i = 0; i < bubbleContext.length; i++) {
            const bubbleContextItem = bubbleContext[i];
            if (!bubbleContextItem) {
                continue;
            }

            console.log("bubbleContextItem: ", i);
            if (bubbleContextItem.type === "artist") {
                const newBubble: bubbleType = {
                    details: {
                        type: "artist",
                        artist: { ...bubbleContextItem.artist, ranking: i + 1 },
                    },
                    physics: {
                        velocity: { x: 0, y: 0 },
                        pos: getNewPos(100, newBubblesState, screen, i),
                        radius:
                            min(screen.width, screen.height) /
                            (13 * (1 + i / 25)),
                    },
                };
                newBubblesState.push(newBubble);
            } else {
                console.log("Unknown bubble type.");
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
        if (dist < (radius + bubble.physics.radius) * 0.75) {
            return true;
        }
    }
    return false;
}

function getNewPos(
    radius: number,
    bubbleState: bubbleType[],
    screen: { width: number; height: number },
    index?: number
): bubblePosType {
    // get the center profile bubble
    const profileBubble = bubbleState[0];

    let tries = 0;
    while (tries < 100) {
        // choose a random angle
        let angle = 0;
        if (index) {
            angle =
                index % 4 === 0
                    ? (Math.random() * Math.PI) / 2
                    : (index + 1) % 4 === 0
                    ? (Math.random() * Math.PI) / 2 + Math.PI / 2
                    : (index + 2) % 4 === 0
                    ? (Math.random() * Math.PI) / 2 + Math.PI
                    : (Math.random() * Math.PI) / 2 + (3 * Math.PI) / 2;
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
        const edgeDist = 50;
        if (
            !(
                pos.x < -screen.width / 2 + edgeDist ||
                pos.x > screen.width / 2 - edgeDist ||
                pos.y < -screen.height / 2 + edgeDist ||
                pos.y > screen.height / 2 - edgeDist
            )
        ) {
            return pos;
        }

        tries++;
    }

    // if we've tried 100 times and still haven't found a good spot, just put it somewhere random
    tries = 0;
    let pos = getRandomPos(screen, radius);
    while (willCollide(pos, radius, bubbleState)) {
        pos = getRandomPos(screen, radius);
        tries++;
        if (tries > 100) {
            return pos;
        }
    }
    console.log("Failed to find a spot for bubble.");
    return pos;
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
