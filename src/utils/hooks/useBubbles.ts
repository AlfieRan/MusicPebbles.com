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

            if (bubbleContextItem.type === "artist") {
                const newBubble: bubbleType = {
                    details: {
                        type: "artist",
                        artist: { ...bubbleContextItem.artist, ranking: i + 1 },
                    },
                    physics: {
                        velocity: { x: 0, y: 0 },
                        pos: getNewPos(100, newBubblesState, screen),
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

    function tick() {
        const newBubblesState = [...bubblesState];
        for (let i = 0; i < newBubblesState.length; i++) {
            if (newBubblesState[i].details.type === "profile") {
                continue;
            }

            const bubble = newBubblesState[i];
            const Forces = {
                x: 0,
                y: 0,
            };

            // Attract to center
            Forces.x += bubble.physics.pos.x > 0 ? -0.0001 : 0.0001;
            Forces.y += bubble.physics.pos.y > 0 ? -0.0001 : 0.0001;

            // Repel from collided bubbles
            const closestBubble = getClosest(
                bubble.physics.pos,
                newBubblesState,
                bubble
            );

            if (
                closestBubble.dist <
                bubble.physics.radius + closestBubble.bubble.physics.radius
            ) {
                // is currently colliding, so repel
                // get angle to closest bubble
                const angle = Math.atan2(
                    closestBubble.bubble.physics.pos.y - bubble.physics.pos.y,
                    closestBubble.bubble.physics.pos.x - bubble.physics.pos.x
                );
                // apply force
                Forces.x += Math.cos(angle);
                Forces.y += Math.sin(angle);
            }

            // if collided with edges, repel
            if (bubble.physics.pos.x < -screen.width / 2) {
                Forces.x += 1;
            } else if (bubble.physics.pos.x > screen.width / 2) {
                Forces.x -= 1;
            }

            if (bubble.physics.pos.y < -screen.height / 2) {
                Forces.y += 1;
            } else if (bubble.physics.pos.y > screen.height / 2) {
                Forces.y -= 1;
            }

            // apply forces
            bubble.physics.velocity.x += Forces.x;
            bubble.physics.velocity.y += Forces.y;

            // update position
            bubble.physics.pos.x +=
                bubble.physics.velocity.x / (1000000 * tickrate);
            bubble.physics.pos.y +=
                bubble.physics.velocity.y / (1000000 * tickrate);

            // set new state
            newBubblesState[i] = bubble;
        }
        setBubblesState(newBubblesState);
    }

    // const interval = setInterval(tick, 1000 / tickrate);

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
    const closestBubble = getClosest(pos, bubbleState, skipBubble);
    return closestBubble.dist < radius + closestBubble.bubble.physics.radius;
}

function getNewPos(
    radius: number,
    bubbleState: bubbleType[],
    screen: { width: number; height: number }
): bubblePosType {
    const maxTries = 1000;
    let tries = 0;
    let newPos = { x: 0, y: 0 };
    while (willCollide(newPos, radius, bubbleState)) {
        newPos = getRandomPos(screen, radius);
        tries++;
        if (tries > maxTries) {
            console.log("Failed to find new position for bubble.");
            break;
        }
    }
    return newPos;
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

function getClosest(
    pos: bubblePosType,
    bubbleState: bubbleType[],
    skipBubble?: bubbleType
): { bubble: bubbleType; dist: number } {
    let closestBubble = bubbleState[0];
    let closestDist = 100000;
    for (let i = 0; i < bubbleState.length; i++) {
        const bubble = bubbleState[i];

        if (skipBubble?.details === bubble.details) {
            continue;
        }

        const dist = Math.sqrt(
            Math.pow(pos.x - bubble.physics.pos.x, 2) +
                Math.pow(pos.y - bubble.physics.pos.y, 2)
        );
        if (dist < closestDist) {
            closestBubble = bubble;
            closestDist = dist;
        }
    }
    return { bubble: closestBubble, dist: closestDist };
}
