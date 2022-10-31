import { Center, Text } from "@chakra-ui/react";
import { profileType } from "../../utils/types/oauth";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { hoveringType } from "../../utils/types/state";
import Hovering from "../hovering";
import { Settings } from "./settings";
import { artistsType } from "../../utils/types/spotify";
import { useBubbles } from "../../utils/hooks/useBubbles";
import { Bubble } from "../bubbles/master";
import { useArtists } from "../../utils/hooks/useArtists";

// Here's the plan:
// 1. Create an array of "bubbles"
// 2. These bubbles should include a name, an image and context for the hover window
// 3. The bubbles should be able to be dragged around the screen - except for the profile bubble
// 4. Some function should then be able to take the bubbles and give each of them a position
// 5. The bubbles should then be displayed with those positions.

export function Main(props: { profile: profileType }) {
    const [hovering, setHovering] = useState<hoveringType>({ hovering: false });
    const [showingSettings, setShowingSettings] = useState<boolean>(false);
    const bubbles = useBubbles();

    function changeHidden() {
        setShowingSettings(!showingSettings);
    }

    return (
        <Center
            h={"full"}
            w={"full"}
            flexDir={"column"}
            overflowX={"hidden"}
            overflowY={"scroll"}
        >
            <Hovering hoveringState={hovering} />
            <Settings hidden={!showingSettings} changeHidden={changeHidden} />
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={"my-20 min-h-0"}
            >
                <motion.div
                    className={
                        "flex overflow-hidden border-white bg-gray-600 h-48 w-48 justify-center items-center"
                    }
                    animate={{
                        scale: [1.3, 1.5, 1.5, 0],
                        borderRadius: ["0%", "50%", "50%", "50%"],
                    }}
                    transition={{
                        duration: 1.7,
                        delay: 0.5,
                        ease: "easeInOut",
                        times: [0, 0.3, 0.4, 1],
                        borderWidth: {
                            duration: 0.1,
                        },
                    }}
                    initial={{ borderRadius: "0%" }}
                    onClick={changeHidden}
                >
                    <Text>Bubbles</Text>
                </motion.div>
            </motion.div>
            <motion.div
                className={
                    "flex absolute w-fit h-fit justify-center items-center"
                }
                animate={{
                    scale: [0, 1.1, 1],
                    opacity: [0, 1, 1],
                }}
                transition={{
                    duration: 1,
                    ease: "easeInOut",
                    times: [0, 0.6, 1],
                    delay: 2,
                }}
            >
                {bubbles.bubbles.map((bubble) => (
                    <Bubble
                        setHovering={setHovering}
                        context={bubble}
                        key={
                            bubble.type === "artist"
                                ? bubble.artist.id
                                : "profile"
                        }
                        changeSettings={changeHidden}
                    />
                ))}
            </motion.div>
        </Center>
    );
}
