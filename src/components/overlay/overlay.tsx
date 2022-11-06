import { artistType } from "../../utils/types/spotify";
import { infoOverlayType } from "../../utils/types/overlay";
import { AnimatePresence, motion } from "framer-motion";
import { Flex } from "@chakra-ui/react";
import { ArtistOverlay } from "./artist";
import { NicheOverlay } from "./niche";

export function Overlay(props: {
    changeHidden: (artistInfo: artistType) => void;
    changeNicheHidden: () => void;
    info: infoOverlayType;
}) {
    return (
        <>
            <AnimatePresence>
                {!props.info.hidden && (
                    <motion.div
                        key={"overlayBlur"}
                        className={
                            "w-screen h-screen bg-[rgba(0,0,0,0.5)] top-0 left-0 fixed z-30"
                        }
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        initial={{ opacity: 1, backdropFilter: "blur(10px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
                        transition={{ duration: 0.15 }}
                    >
                        <Flex
                            className={
                                " w-screen h-screen absolute top-0 left-0 z-30"
                            }
                            hidden={props.info.hidden}
                        />
                    </motion.div>
                )}
                {!props.info.hidden && (
                    <motion.div
                        key={"overlayMain"}
                        className={"absolute z-50 w-fit h-fit"}
                        exit={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        initial={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        {props.info.info.type === "artist" && (
                            <ArtistOverlay
                                artistInfo={props.info.info.artist}
                                changeHidden={props.changeHidden}
                            />
                        )}

                        {props.info.info.type === "niche" && (
                            <NicheOverlay
                                changeHidden={props.changeNicheHidden}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
