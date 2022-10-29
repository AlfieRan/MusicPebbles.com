import { Center, Box } from "@chakra-ui/react";
import Image from "next/image";
import { profileType } from "../../utils/types/oauth";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { hoveringType } from "../../utils/types/state";
import Hovering from "../hovering";
import { Settings } from "./settings";
import { artistsType } from "../../utils/types/spotify";
import { ArtistBubbleWrap } from "../bubbles/artist";

export function Main(props: { profile: profileType }) {
    const [hovering, setHovering] = useState<hoveringType>({ hovering: false });
    const [showingSettings, setShowingSettings] = useState<boolean>(false);
    const [artists, setArtists] = useState<artistsType>([]);

    function changeHidden() {
        setShowingSettings(!showingSettings);
    }

    useEffect(() => {
        (async () => {
            const res = await fetch("/api/user/getArtists", { method: "GET" });
            const data = await res.json();
            if (res.status === 200) {
                setArtists(data);
            } else {
                console.log(data);
            }
        })();
    }, []);

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
                    className={"overflow-hidden border-white"}
                    animate={{
                        scale: [1.3, 1.5, 1.5, 1],
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
                    <Image
                        className={"z-0"}
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
            </motion.div>
            <Box minH={0}>
                <ArtistBubbleWrap artists={artists} setHovering={setHovering} />
            </Box>
        </Center>
    );
}
