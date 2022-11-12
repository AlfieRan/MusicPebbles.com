import ProfilePebble from "./profilePebble";
import ArtistPebble from "./artistPebble";
import SongPebble from "./songPebble";
import UniquePebble from "./uniquePebble";
import GenrePebble from "./genrePebble";
import TimePebble from "./timePebble";
import { usePebbles } from "../../utils/hooks/usePebbles";
import { Flex } from "@chakra-ui/react";
import { useScreen } from "../../utils/hooks/useScreen";
import { useState } from "react";
import { hoveringType } from "../../utils/types/state";
import Hovering from "../hovering";
import { timeFrameType } from "../../utils/types/spotify";
import { overlayStateType } from "../../utils/types/overlay";
import { Overlay } from "../overlay/overlay";

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

    function hideOverlay() {
        setOverlayState({ hidden: true });
    }

    return (
        <Flex
            w={screen.width}
            h={componentHeight || screen.height}
            overflowX={"hidden"}
            overflowY={"scroll"}
            zIndex={1}
        >
            <Hovering {...hoveringState} />
            <Overlay info={overlayState} hide={hideOverlay} />
            <ProfilePebble
                info={pebbleState.profile}
                setHovering={setHoveringState}
            />
            <SongPebble
                info={pebbleState.song}
                setHovering={setHoveringState}
                time={time}
                setOverlay={setOverlayState}
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
        </Flex>
    );
}
