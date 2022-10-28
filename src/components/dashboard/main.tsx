import { Center } from "@chakra-ui/react";
import Image from "next/image";
import { profileType } from "../../utils/types/oauth";
import { motion } from "framer-motion";
import { useState } from "react";
import { hoveringType } from "../../utils/types/state";
import Hovering from "../hovering";
import { Settings } from "./settings";

export function Main(props: { profile: profileType }) {
    const [hovering, setHovering] = useState<hoveringType>({ hovering: false });
    const [showingSettings, setShowingSettings] = useState<boolean>(false);

    function changeHidden() {
        setShowingSettings(!showingSettings);
    }

    return (
        <Center h={"full"} w={"full"} flexDir={"column"}>
            <Hovering hoveringState={hovering} />
            <Settings hidden={!showingSettings} changeHidden={changeHidden} />
            <motion.div
                className={"overflow-hidden border-white"}
                animate={{
                    scale: [1.3, 1.5, 1.5, 1],
                    borderRadius: ["0%", "50%", "50%", "50%"],
                }}
                transition={{
                    duration: 1.7,
                    ease: "easeInOut",
                    times: [0, 0.3, 0.4, 1],
                    borderWidth: {
                        duration: 0.1,
                    },
                }}
                initial={{ borderRadius: "0%" }}
                whileHover={{ borderWidth: 2 }}
                onClick={changeHidden}
            >
                <Image
                    className={"z-0 scale-105 hover:scale-110 active:scale-100"}
                    src={props.profile.image_url}
                    alt={"Profile Picture of user"}
                    onMouseOver={() =>
                        setHovering({ hovering: true, type: "profile" })
                    }
                    onMouseLeave={() => setHovering({ hovering: false })}
                    width={200}
                    height={200}
                />
            </motion.div>
        </Center>
    );
}
