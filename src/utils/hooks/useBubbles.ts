import { bubbleContextType, bubblePosType, bubbleType } from "../types/bubbles";
import { useEffect, useState } from "react";
import { useScreen } from "./useScreen";
import { min } from "../basics";
import { useArtists } from "./useArtists";
import { useInterval } from "@chakra-ui/react";

export function useBubbles(numToDisplay: number = 10, tickrate: number = 24) {
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
            updatePos: () => {
                console.log(
                    "Attempted to update profile bubble position, but it is not movable."
                );
            },
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

        for (let i = 0; i < numToDisplay; i++) {
            const bubbleContextItem = bubbleContext[i];
            if (!bubbleContextItem) {
                continue;
            }

            if (bubbleContextItem.type === "artist") {
                const newBubble: bubbleType = {
                    details: {
                        type: "artist",
                        artist: bubbleContextItem.artist,
                    },
                    physics: {
                        velocity: { x: 0, y: 0 },
                        pos: getNewPos(100, newBubblesState, screen),
                        radius: min(screen.width, screen.height) / 13,
                        updatePos: (pos) => {
                            const newBubblesState = [...bubblesState];
                            newBubblesState[i + 1].physics.pos = pos;
                            setBubblesState(newBubblesState);
                        },
                    },
                };
                newBubblesState.push(newBubble);
            } else {
                console.log("Unknown bubble type.");
            }
        }

        setBubblesState(newBubblesState.slice(0, numToDisplay));
    }, [bubbleContext]);

    function tick() {
        const newBubblesState = [...bubblesState];
        for (let i = 0; i < newBubblesState.length; i++) {
            const bubble = newBubblesState[i];
            if (bubble.details.type === "profile") {
                continue;
            }

            const newVelocity = {
                x: bringCloser(
                    bubble.physics.velocity.x,
                    -bubble.physics.pos.x / 100,
                    1 / tickrate
                ),
                y: bringCloser(
                    bubble.physics.velocity.y,
                    -bubble.physics.pos.y / 100,
                    1 / tickrate
                ),
            };

            const newPos = {
                x: bubble.physics.pos.x + newVelocity.x,
                y: bubble.physics.pos.y + newVelocity.y,
            };

            // Check if bubble is out of bounds
            if (newPos.x > screen.width / 2 - bubble.physics.radius) {
                newPos.x = screen.width / 2 - bubble.physics.radius - 5;
                newVelocity.x *= -1;
            } else if (newPos.x < -screen.width / 2 + bubble.physics.radius) {
                newPos.x = -screen.width / 2 + bubble.physics.radius + 5;
                newVelocity.x *= -1;
            }

            if (newPos.y > screen.height / 2 - bubble.physics.radius) {
                newPos.y = screen.height / 2 - bubble.physics.radius - 5;
                newVelocity.y *= -1;
            } else if (newPos.y < -screen.height / 2 + bubble.physics.radius) {
                newPos.y = -screen.height / 2 + bubble.physics.radius + 5;
                newVelocity.y *= -1;
            }

            if (
                willCollide(
                    newPos,
                    bubble.physics.radius,
                    newBubblesState,
                    bubble
                )
            ) {
                if (
                    willCollide(
                        { x: newPos.x, y: bubble.physics.pos.y },
                        bubble.physics.radius,
                        newBubblesState,
                        bubble
                    )
                ) {
                    newVelocity.x *= -1;
                    newPos.x = bubble.physics.pos.x + newVelocity.x;
                }
                if (
                    willCollide(
                        { x: bubble.physics.pos.x, y: newPos.y },
                        bubble.physics.radius,
                        newBubblesState,
                        bubble
                    )
                ) {
                    newVelocity.y *= -1;
                    newPos.y = bubble.physics.pos.y + newVelocity.y;
                }
            }

            bubble.physics.pos = newPos;
            bubble.physics.velocity = newVelocity;
            newBubblesState[i] = bubble;
        }
        setBubblesState(newBubblesState);
    }

    useInterval(tick, 1000 / tickrate);

    return {
        bubbles: bubblesState,
        updateContext: setBubbleContext,
    };
}

function willCollide(
    pos: bubblePosType,
    radius: number,
    bubbleState: bubbleType[],
    bubblePassed?: bubbleType
) {
    for (let i = 0; i < bubbleState.length; i++) {
        const bubble = bubbleState[i];

        if (bubblePassed?.details === bubble.details) {
            continue;
        }

        const dist = Math.sqrt(
            Math.pow(pos.x - bubble.physics.pos.x, 2) +
                Math.pow(pos.y - bubble.physics.pos.y, 2)
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
    screen: { width: number; height: number }
): bubblePosType {
    const maxTries = 100;
    let tries = 0;
    let newPos = { x: 0, y: 0 };
    while (willCollide(newPos, radius, bubbleState)) {
        const pos = getRandomPos(screen);
        newPos = {
            x: pos.x > 0 ? pos.x - 100 : pos.x + 100,
            y: pos.y > 0 ? pos.y - 100 : pos.y + 100,
        };
        tries++;
        if (tries > maxTries) {
            console.log("Failed to find new position for bubble.");
            break;
        }
    }
    return newPos;
}

function getRandomPos(screen: { width: number; height: number }) {
    return {
        x: Math.random() * screen.width - screen.width / 2,
        y: Math.random() * screen.height - screen.height / 2,
    };
}

function bringCloser(num: number, aim: number, strength: number) {
    if (num > aim) {
        return num - diff(num, aim) * strength;
    }
    return num + diff(num, aim) * strength;
}

function diff(a: number, b: number) {
    return Math.abs(a - b);
}
