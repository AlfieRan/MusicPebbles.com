import { Flex, Text, Image } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import { audioPlayerType, profileHookType } from "../../utils/types/state";
import { songType, timeFrameType } from "../../utils/types/spotify";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { overlayStateType } from "../../utils/types/overlay";

export default function SongPebble(props: {
    info: pebblePhysics;
    time: timeFrameType;
    setOverlay: Dispatch<SetStateAction<overlayStateType>>;
    audioPlayer: audioPlayerType;
    profile: profileHookType;
}) {
    // TODO: Add links to spotify everywhere lol
    const [loaded, setLoaded] = useState(true);
    const [songs, setSongs] = useState<songType[]>([]);
    const HU = props.info.dims.height / 10;
    const WU = props.info.dims.width / 10;

    useEffect(() => {
        if (props.profile.profile.songs !== undefined) {
            setLoaded(false);
            const current = props.profile.profile.songs[props.time];
            if (current) {
                setSongs(current);
            }
        }
    }, [props.profile.profile.songs, props.time]);

    useEffect(() => {
        console.log("Rendering song pebble");
        if (songs.length > 4) {
            setLoaded(true);
        } else {
            console.log("Not enough songs, songs: " + songs);
        }
    }, [songs]);

    function openSongOverlay() {
        props.setOverlay({
            hidden: false,
            type: "songs",
            songs: props.profile.profile.songs ?? {
                short_term: false,
                medium_term: false,
                long_term: false,
            },
        });
        console.log("open song overlay");
    }

    return (
        <Flex
            w={`${props.info.dims.width}px`}
            h={`${props.info.dims.height}px`}
            top={`${props.info.pos.y}px`}
            left={`${props.info.pos.x}px`}
            borderRadius={`${HU * 0.375}px`}
            boxShadow={"#333 2px 4px 8px"}
            overflow={"hidden"}
            bg={"blackAlpha.600"}
            pos={"absolute"}
            flexDir={"column"}
            py={`${HU * 0.25}px`}
            px={`${WU * 0.25}px`}
            justifyContent={"center"}
            alignItems={"center"}
            zIndex={5}
            _hover={{ bg: "blackAlpha.700", transform: "scale(1.01)" }}
            transition={"0.1s ease-in-out"}
            cursor={"pointer"}
            onClick={openSongOverlay}
        >
            <Text
                h={`${HU * 0.75}px`}
                w={`${WU * 9.5}px`}
                textAlign={"center"}
                fontWeight={"bold"}
                fontSize={`${HU * 0.6}px`}
                p={0}
                m={0}
            >
                Your Top Songs
            </Text>
            {loaded ? (
                <Flex
                    flexDir={"column"}
                    justifyContent={"center"}
                    h={`${HU * 8.5}px`}
                    w={`${WU * 9.5}px`}
                >
                    <Flex
                        flexDir={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        h={`${HU * 8.5}px`}
                        w={`${WU * 9.5}px`}
                    >
                        {songs.slice(0, 5).map((song, i) => (
                            <Flex
                                flexDir={"row"}
                                key={`${song.name}_preview`}
                                mx={`${WU * 0.25}px`}
                                my={`${HU * 0.05}px`}
                                h={`${HU * 1.5}px`}
                                w={`${WU * 9}px`}
                            >
                                <Flex
                                    alignItems={"center"}
                                    borderRadius={`${Math.min(WU * 0.1, 5)}px`}
                                    overflow={"hidden"}
                                >
                                    <Image
                                        src={
                                            song.album.images[0].url ??
                                            "/unknown.png"
                                        }
                                        alt={`${song.name} album art`}
                                        width={
                                            song.album.images[0].width *
                                            HU *
                                            1.4
                                        }
                                        height={
                                            song.album.images[0].width *
                                            HU *
                                            1.4
                                        }
                                    />
                                </Flex>

                                <Flex
                                    flexDir={"column"}
                                    ml={2}
                                    maxW={`${WU * 9 - HU * 1.5}px`}
                                >
                                    <Text
                                        fontSize={
                                            song.name.length < 35
                                                ? `${
                                                      HU === WU
                                                          ? WU * 0.35
                                                          : HU * 0.27
                                                  }px`
                                                : `${
                                                      HU === WU
                                                          ? WU * 0.3
                                                          : HU * 0.23
                                                  }px`
                                        }
                                    >
                                        {`${i + 1}. ${song.name}`.substring(
                                            0,
                                            45
                                        )}
                                    </Text>

                                    <Text
                                        fontSize={
                                            song.album.name.length < 35
                                                ? `${
                                                      HU === WU
                                                          ? WU * 0.3
                                                          : HU * 0.22
                                                  }px`
                                                : `${
                                                      HU === WU
                                                          ? WU * 0.25
                                                          : HU * 0.2
                                                  }px`
                                        }
                                        color={"whiteAlpha.500"}
                                    >
                                        {song.album.name}
                                    </Text>
                                    <Text
                                        fontSize={`${
                                            HU === WU ? WU * 0.3 : HU * 0.23
                                        }px`}
                                    >
                                        {song.artists
                                            .map((artist) => artist.name)
                                            .join(", ")}
                                    </Text>
                                </Flex>
                            </Flex>
                        ))}
                    </Flex>
                </Flex>
            ) : (
                <Text fontSize={`${HU * 0.4}px`}>Loading...</Text>
            )}
            <Text
                h={`${HU * 0.32}px`}
                w={`${WU * 9}px`}
                fontSize={`${HU * 0.32}px`}
                fontWeight={"semibold"}
                color={"whiteAlpha.800"}
                textAlign={"center"}
                mb={2}
            >
                Click for more info
            </Text>
        </Flex>
    );
}
