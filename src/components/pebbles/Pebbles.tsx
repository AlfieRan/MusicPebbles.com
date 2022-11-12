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

export default function Pebbles() {
    const { pebbleState, componentHeight } = usePebbles();
    const screen = useScreen();
    const [hoveringState, setHoveringState] = useState<hoveringType>({
        hovering: false,
    });
    const [time, setTime] = useState<timeFrameType>("medium_term");

    // TODO: add a loading system between time changes

    return (
        <Flex
            w={screen.width}
            h={componentHeight || screen.height}
            overflowX={"hidden"}
            overflowY={"scroll"}
            zIndex={1}
        >
            <Hovering {...hoveringState} />
            <ProfilePebble
                info={pebbleState.profile}
                setHovering={setHoveringState}
            />
            <SongPebble
                info={pebbleState.song}
                setHovering={setHoveringState}
                time={time}
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
