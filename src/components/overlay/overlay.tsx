import { overlayStateType } from "../../utils/types/overlay";
import { AnimatePresence, motion } from "framer-motion";
import BlurredBackground from "./blurredBackground";
import SongOverlay from "./songOverlay";
import { audioPlayerType, profileHookType } from "../../utils/types/state";
import { timeFrameType } from "../../utils/types/spotify";
import { useScreen } from "../../utils/hooks/useScreen";
import ProfileOverlay from "./profileOverlay";
import UniqueOverlay from "./uniqueOverlay";
import ArtistOverlay from "./artistOverlay";

export function Overlay(props: {
    info: overlayStateType;
    hide: () => void;
    audioPlayer: audioPlayerType;
    time: timeFrameType;
    profile: profileHookType;
}) {
    const screenHook = useScreen();
    const HU = screenHook.height / 10;
    const WU = screenHook.width / 10;

    return (
        <>
            <AnimatePresence>
                <BlurredBackground
                    hidden={props.info.hidden}
                    hide={props.hide}
                />
                {!props.info.hidden && (
                    <motion.div
                        key={"overlayMain"}
                        className={
                            "fixed flex z-50 w-fit h-full md:h-fit max-w-[100%] max-h-[100%] top-0 p-2 md:p-0 md:top-auto items-center"
                        }
                        exit={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        initial={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        {props.info.type === "songs" && (
                            <SongOverlay
                                audioPlayer={props.audioPlayer}
                                time={props.time}
                                allSongs={props.info.songs}
                                HU={HU}
                                WU={WU}
                                exit={props.hide}
                            />
                        )}
                        {props.info.type === "profile" && (
                            <ProfileOverlay
                                WU={WU}
                                HU={HU}
                                profile={props.profile}
                                exit={props.hide}
                            />
                        )}
                        {props.info.type === "unique" && (
                            <UniqueOverlay WU={WU} HU={HU} exit={props.hide} />
                        )}
                        {props.info.type === "artists" && (
                            <ArtistOverlay WU={WU} HU={HU} exit={props.hide} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
