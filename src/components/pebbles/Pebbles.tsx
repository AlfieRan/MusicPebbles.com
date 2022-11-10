import ProfilePebble from "./profilePebble";
import ArtistPebble from "./artistPebble";
import SongPebble from "./songPebble";
import UniquePebble from "./uniquePebble";
import GenrePebble from "./genrePebble";
import TimePebble from "./timePebble";
import { usePebbles } from "../../utils/hooks/usePebbles";
import { Flex } from "@chakra-ui/react";
import { useScreen } from "../../utils/hooks/useScreen";
import { useEffect } from "react";

export default function Pebbles() {
    const { pebbleState, componentHeight } = usePebbles();
    const screen = useScreen();

    useEffect(() => {
        console.log(componentHeight);
    }, [componentHeight]);

    return (
        <Flex
            pos={"relative"}
            w={screen.width}
            h={componentHeight || screen.height}
            overflowX={"hidden"}
            overflowY={"scroll"}
        >
            <ProfilePebble {...pebbleState.profile} />
            <SongPebble {...pebbleState.song} />
            <ArtistPebble {...pebbleState.artist} />
            <UniquePebble {...pebbleState.unique} />
            <GenrePebble {...pebbleState.genre} />
            <TimePebble {...pebbleState.time} />
        </Flex>
    );
}
