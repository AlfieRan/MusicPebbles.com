import ProfilePebble from "./profilePebble";
import ArtistPebble from "./artistPebble";
import SongPebble from "./songPebble";
import UniquePebble from "./uniquePebble";
import InfoPebble from "./infoPebble";
import TimePebble from "./timePebble";
import { usePebbles } from "../../utils/hooks/usePebbles";
import { Center } from "@chakra-ui/react";
import { useScreen } from "../../utils/hooks/useScreen";
import { useEffect, useState } from "react";
import { hoveringType } from "../../utils/types/state";
import Hovering from "../hovering";
import { timeFrameType } from "../../utils/types/spotify";
import { overlayStateType } from "../../utils/types/overlay";
import { Overlay } from "../overlay/overlay";
import { useAudio } from "../../utils/hooks/useAudio";
import AudioPebble from "./audioPebble";
import { useProfile } from "../../utils/hooks/useProfile";
import { useUniqueness } from "../../utils/hooks/useUniqueness";
import { usePopUp } from "../../utils/hooks/usePopUp";

export default function Pebbles() {
    const { pebbleState, componentHeight } = usePebbles();
    const screen = useScreen();
    const [hoveringState, setHoveringState] = useState<hoveringType>({
        hovering: false,
    });
    const [overlayState, setOverlayState] = useState<overlayStateType>({
        hidden: true,
    });
    const [time, setTime] = useState<timeFrameType>("medium_term");
    const profile = useProfile();
    const audioPlayer = useAudio();
    const uniqueness = useUniqueness();
    const popUp = usePopUp();

    useEffect(() => {
        if (profile.profile.songs !== undefined) {
            const currentSongs = profile.profile.songs[time];
            if (currentSongs !== false && currentSongs.length > 0) {
                console.log(
                    `Adding ${currentSongs.length} songs to audio player`
                );
                audioPlayer.addSongs(currentSongs);
            }
        }
    }, [time, profile.profile.songs]);

    useEffect(() => {
        if (profile.profile.artists !== undefined) {
            uniqueness.setArtists(profile.profile.artists);
        }
    }, [profile.profile.artists]);

    useEffect(() => {
        if (popUp.isPopUpOpen) {
            setOverlayState({ hidden: false, type: "popup" });
        } else {
            if (!overlayState.hidden && overlayState.type === "popup") {
                setOverlayState({ hidden: true });
            }
        }
    }, [popUp]);

    function hideOverlay() {
        setOverlayState({ hidden: true });
    }

    return (
        <Center
            w={screen.width}
            h={Math.min(componentHeight, screen.height)}
            overflowX={"hidden"}
            pos={"relative"}
            overflowY={"scroll"}
            zIndex={1}
        >
            <Center
                minH={Math.max(componentHeight, screen.height)}
                w={screen.width}
                pos={"absolute"}
                top={0}
            >
                <Hovering {...hoveringState} />
                <Overlay
                    info={overlayState}
                    hide={hideOverlay}
                    audioPlayer={audioPlayer}
                    time={time}
                    profile={profile}
                    uniqueness={uniqueness}
                    closePopUp={popUp.closePopUp}
                />
                <ProfilePebble
                    info={pebbleState.profile}
                    setHovering={setHoveringState}
                    setOverlay={setOverlayState}
                    profile={profile}
                />
                <SongPebble
                    info={pebbleState.song}
                    time={time}
                    setOverlay={setOverlayState}
                    audioPlayer={audioPlayer}
                    profile={profile}
                />
                <ArtistPebble
                    info={pebbleState.artist}
                    time={time}
                    setOverlay={setOverlayState}
                    profile={profile}
                />
                <UniquePebble
                    info={pebbleState.unique}
                    setHovering={setHoveringState}
                    time={time}
                    setOverlay={setOverlayState}
                    uniqueness={uniqueness}
                    profile={profile}
                />
                <InfoPebble
                    info={pebbleState.genre}
                    setHovering={setHoveringState}
                    setOverlay={setOverlayState}
                />
                <TimePebble
                    info={pebbleState.time}
                    setHovering={setHoveringState}
                    setTime={setTime}
                    time={time}
                />
                <AudioPebble
                    info={pebbleState.playing}
                    setHovering={setHoveringState}
                    audioPlayer={audioPlayer}
                />
            </Center>
        </Center>
    );
}
