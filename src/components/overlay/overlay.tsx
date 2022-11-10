import { artistEmptyObject, artistType } from "../../utils/types/spotify";
import { infoOverlayType } from "../../utils/types/overlay";
import { AnimatePresence, motion } from "framer-motion";
import { ArtistOverlay } from "./artist";
import { NicheOverlay } from "./niche";
import BlurredBackground from "./blurredBackground";
import { useEffect } from "react";
import { setupKeyPresses } from "../../utils/other/usability";

export function Overlay(props: {
    changeHidden: (artistInfo: artistType, value?: boolean) => void;
    changeNicheHidden: () => void;
    info: infoOverlayType;
}) {
    return (
        <>
            <AnimatePresence>
                <BlurredBackground
                    hidden={props.info.hidden}
                    hide={() => {
                        props.changeHidden(artistEmptyObject, true);
                    }}
                />
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
