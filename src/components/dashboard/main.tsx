import { Center, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { hoveringType } from "../../utils/types/state";
import Hovering from "../hovering";
import { Overlay } from "./overlay";
import { useBubbles } from "../../utils/hooks/useBubbles";
import { Bubble } from "../bubble";
import { useScreen } from "../../utils/hooks/useScreen";
import { artistEmptyObject, artistType } from "../../utils/types/spotify";
import { ArtistOverlay } from "./artistOverlay";

export function Main() {
    const [hovering, setHovering] = useState<hoveringType>({ hovering: false });
    const [showingSettings, setShowingSettings] = useState<boolean>(false);
    const [showingArtist, setShowingArtist] = useState<{
        hidden: boolean;
        artistInfo: artistType;
    }>({
        hidden: true,
        artistInfo: artistEmptyObject,
    });
    const bubbles = useBubbles();
    const screen = useScreen();
    const [showNum, setShowNum] = useState<number>(50);

    useEffect(() => {
        if (screen.width && screen.height) {
            setShowNum(
                Math.min(Math.floor((screen.width * screen.height) / 10000), 47)
            );
            console.log("Showing " + showNum + " bubbles");
        }
    }, [screen]);

    function changeHidden() {
        setShowingSettings(!showingSettings);
    }

    function changeArtistHidden(artistInfo: artistType) {
        setShowingArtist({
            hidden: !showingArtist.hidden,
            artistInfo: artistInfo,
        });
    }

    return (
        <Center h={"full"} w={"full"} flexDir={"column"} overflow={"hidden"}>
            <Hovering hoveringState={hovering} />
            <Overlay hidden={!showingSettings} changeHidden={changeHidden} />
            <ArtistOverlay
                hidden={showingArtist.hidden}
                changeHidden={changeArtistHidden}
                artistInfo={showingArtist.artistInfo}
            />
            <motion.div
                className={
                    "flex overflow-hidden border-white bg-gray-600 h-96 w-96 justify-center items-center"
                }
                animate={{
                    scale: [5, 1.3, 1.5, 1.5, 0],
                    borderRadius: ["0%", "0%", "50%", "50%", "50%"],
                    borderWidth: ["0px", "1px", "2px", "1px", "1px"],
                    background: [
                        "#161616",
                        "#161616",
                        "#4b5563",
                        "#4b5563",
                        "#4b5563",
                    ],
                }}
                transition={{
                    duration: 4,
                    delay: 0.5,
                    ease: "easeInOut",
                    times: [0, 0.3, 0.4, 1],
                    borderWidth: {
                        duration: 0.1,
                    },
                }}
                initial={{ borderRadius: "0%" }}
            >
                <Text>Bubbles</Text>
            </motion.div>
            <motion.div
                className={
                    "flex absolute w-fit h-fit justify-center items-center"
                }
                animate={{
                    scale: [0, 1.05, 1],
                    opacity: [0, 1, 1],
                }}
                transition={{
                    duration: 1,
                    ease: "easeInOut",
                    times: [0, 0.6, 1],
                    delay: 3,
                }}
            >
                {bubbles.bubbles.slice(0, showNum).map((bubble) => (
                    <Bubble
                        setHovering={setHovering}
                        context={bubble}
                        key={
                            bubble.details.type === "artist"
                                ? bubble.details.artist.id
                                : "profile"
                        }
                        changeSettings={changeHidden}
                        changeArtist={changeArtistHidden}
                    />
                ))}
            </motion.div>
        </Center>
    );
}
