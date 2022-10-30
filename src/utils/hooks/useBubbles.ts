import { bubbleContextType, bubbleType } from "../types/bubbles";
import { useEffect, useState } from "react";
import { useScreen } from "./useScreen";
import { min } from "../basics";
import { useArtists } from "./useArtists";

export function useBubbles(numToDisplay: number = 10) {
    const screen = useScreen();
    const [bubbleContext, setBubbleContext] = useState<bubbleContextType[]>([]);
    const [bubblesState, setBubblesState] = useState<bubbleType[]>([]);
    const artists = useArtists();

    const profileBubble: bubbleType = {
        type: "profile",
        pos: { x: 0, y: 0 },
        radius: min(screen.width, screen.height) / 7,
        updatePos: () => {
            console.log(
                "Attempted to update profile bubble position, but it is not movable."
            );
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
        const curBubbles: bubbleType[] = bubbleContext.flatMap((cur) => {
            if (cur.type === "artist") {
                const p = {
                    x: Math.random() * screen.width - screen.width / 2,
                    y: Math.random() * screen.height - screen.height / 2,
                };
                return [
                    {
                        type: "artist",
                        artist: cur.artist,
                        pos: {
                            x: p.x > 0 ? p.x - 100 : p.x + 100,
                            y: p.y > 0 ? p.y - 100 : p.y + 100,
                        },
                        radius: min(screen.width, screen.height) / 13,
                        updatePos: () => {
                            console.log(
                                "Attempted to update artist bubble position, but it is not movable."
                            );
                        },
                    },
                ];
            } else {
                console.log("Unknown bubble type: " + cur.type);
                return [];
            }
        });
        console.log("curBubbles: " + curBubbles);
        setBubblesState([profileBubble, ...curBubbles].slice(0, numToDisplay));
    }, [bubbleContext]);

    return {
        bubbles: bubblesState,
        updateContext: setBubbleContext,
    };
}
