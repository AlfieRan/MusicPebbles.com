import { Center, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { hoveringType } from "../../utils/types/state";
import Hovering from "../hovering";
import { Settings } from "../overlay/settings";
import { useScreen } from "../../utils/hooks/useScreen";
import { artistEmptyObject, artistType } from "../../utils/types/spotify";
import { Overlay } from "../overlay/overlay";
import { infoOverlayType } from "../../utils/types/overlay";
import Tutorial from "../tutorial";
import { useTutorial } from "../../utils/hooks/useTutorial";
import ProfilePebble from "../pebbles/profilePebble";
import ArtistPebble from "../pebbles/artistPebble";
import SongPebble from "../pebbles/songPebble";
import UniquePebble from "../pebbles/uniquePebble";
import GenrePebble from "../pebbles/genrePebble";
import TimePebble from "../pebbles/timePebble";
import Pebbles from "../pebbles/Pebbles";

export function Main() {
    // state hooks
    const [hovering, setHovering] = useState<hoveringType>({ hovering: false });
    const [showingSettings, setShowingSettings] = useState<boolean>(false);
    const [showingOverlay, setShowingOverlay] = useState<infoOverlayType>({
        hidden: true,
        info: { type: "artist", artist: artistEmptyObject },
    });
    const [showNum, setShowNum] = useState<number>(50);

    // custom hooks
    const screen = useScreen();
    const tutorial = useTutorial();

    useEffect(() => {
        if (screen.width && screen.height) {
            setShowNum(
                Math.min(Math.floor((screen.width * screen.height) / 10000), 47)
            );
            console.log("Showing " + showNum + " pebbles");
        }
    }, [screen]);

    function changeHidden(value?: boolean) {
        if (value === undefined) {
            setShowingSettings(!showingSettings);
        } else {
            setShowingSettings(value);
        }
    }

    function changeArtistHidden(artistInfo: artistType, value?: boolean) {
        if (value === undefined) {
            setShowingOverlay({
                hidden: !showingOverlay.hidden,
                info: { type: "artist", artist: artistInfo },
            });
        } else {
            setShowingOverlay({
                hidden: value,
                info: { type: "artist", artist: artistInfo },
            });
        }
    }

    function changeNicheHidden() {
        setShowingOverlay({
            hidden: !showingOverlay.hidden,
            info: { type: "niche" },
        });
    }

    return (
        <Center h={"full"} w={"full"} flexDir={"column"} overflow={"hidden"}>
            <Hovering hoveringState={hovering} />
            <Tutorial hidden={!tutorial.showTutorial} skip={tutorial.skip} />
            <Settings hidden={!showingSettings} changeHidden={changeHidden} />
            <Overlay
                changeHidden={changeArtistHidden}
                changeNicheHidden={changeNicheHidden}
                info={showingOverlay}
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
                <Text>Pebbles</Text>
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
                <Pebbles />
            </motion.div>
        </Center>
    );
}
