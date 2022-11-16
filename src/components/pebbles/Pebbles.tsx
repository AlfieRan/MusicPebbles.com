import ProfilePebble from "./profilePebble";
import ArtistPebble from "./artistPebble";
import SongPebble from "./songPebble";
import UniquePebble from "./uniquePebble";
import GenrePebble from "./genrePebble";
import TimePebble from "./timePebble";
import { usePebbles } from "../../utils/hooks/usePebbles";
import { Center, Flex } from "@chakra-ui/react";
import { useScreen } from "../../utils/hooks/useScreen";
import { useEffect, useState } from "react";
import { hoveringType } from "../../utils/types/state";
import Hovering from "../hovering";
import { timeFrameType } from "../../utils/types/spotify";
import { overlayStateType } from "../../utils/types/overlay";
import { Overlay } from "../overlay/overlay";
import { useAudio } from "../../utils/hooks/useAudio";
import { useSongs } from "../../utils/hooks/useSongs";
import AudioPebble from "./audioPebble";

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
    const [songs] = useSongs();
    const audioPlayer = useAudio();

    useEffect(() => {
        const currentSongs = songs[time];
        if (currentSongs !== false && currentSongs.length > 0) {
            console.log(`Adding ${currentSongs.length} songs to audio player`);
            audioPlayer.addSongs(currentSongs);
        }
    }, [time, songs]);

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
            >
                <Hovering {...hoveringState} />
                <Overlay
                    info={overlayState}
                    hide={hideOverlay}
                    audioPlayer={audioPlayer}
                    time={time}
                />
                <ProfilePebble
                    info={pebbleState.profile}
                    setHovering={setHoveringState}
                    setOverlay={setOverlayState}
                />
                <SongPebble
                    info={pebbleState.song}
                    setHovering={setHoveringState}
                    time={time}
                    setOverlay={setOverlayState}
                    audioPlayer={audioPlayer}
                />
                <ArtistPebble
                    info={pebbleState.artist}
                    setHovering={setHoveringState}
                    time={time}
                />
                <UniquePebble
                    info={pebbleState.unique}
                    setHovering={setHoveringState}
                    time={time}
                />
                <GenrePebble
                    info={pebbleState.genre}
                    setHovering={setHoveringState}
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
