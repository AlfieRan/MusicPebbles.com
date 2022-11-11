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
import { useSongs } from "../../utils/hooks/useSongs";
import { useArtists } from "../../utils/hooks/useArtists";

export default function Pebbles() {
    const { pebbleState, componentHeight } = usePebbles();
    const screen = useScreen();
    const [hoveringState, setHoveringState] = useState<hoveringType>({
        hovering: false,
    });
    const [songs, updateSongs] = useSongs();
    const [artists, updateArtists] = useArtists();

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
                songs={songs}
            />
            <ArtistPebble
                info={pebbleState.artist}
                setHovering={setHoveringState}
                artists={artists}
            />
            <UniquePebble
                info={pebbleState.unique}
                setHovering={setHoveringState}
            />
            <GenrePebble
                info={pebbleState.genre}
                setHovering={setHoveringState}
            />
            <TimePebble
                info={pebbleState.time}
                setHovering={setHoveringState}
                updateArtists={updateArtists}
                updateSongs={updateSongs}
            />
        </Flex>
    );
}
