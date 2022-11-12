import { Button, Center, Flex, Text } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import { setHoveringType } from "../../utils/types/state";
import Image from "next/image";
import { useScreen } from "../../utils/hooks/useScreen";
import { songType, timeFrameType } from "../../utils/types/spotify";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSongs } from "../../utils/hooks/useSongs";
import { overlayStateType } from "../../utils/types/overlay";
import { useAudio } from "../../utils/hooks/useAudio";

export default function SongPebble(props: {
    info: pebblePhysics;
    setHovering: setHoveringType;
    time: timeFrameType;
    setOverlay: Dispatch<SetStateAction<overlayStateType>>;
}) {
    const screenHook = useScreen();
    const [loaded, setLoaded] = useState(true);
    const [songs, setSongs] = useState<songType[]>([]);
    const [allSongs] = useSongs();
    const audioPlayer = useAudio();

    useEffect(() => {
        setLoaded(false);
        const current = allSongs[props.time];
        if (current) {
            setSongs(current);
        }
    }, [allSongs, props.time]);

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
            component: (
                <Flex
                    flexDir={"column"}
                    bg={"MidGrey"}
                    px={4}
                    py={4}
                    borderRadius={"10px"}
                    maxW={"80%"}
                >
                    <Text mb={"10px"}>This is an audio preview demo</Text>
                    <Flex flexDir={"row"} wrap={"wrap"} maxW={"95%"}>
                        {songs.slice(0, 20).map((song, index) => (
                            <Button
                                bg={"blackAlpha.400"}
                                _hover={{
                                    bg: "blackAlpha.600",
                                    transform: "scale(1.02)",
                                }}
                                _active={{
                                    bg: "blackAlpha.800",
                                    transform: "scale(0.98)",
                                }}
                                m={1}
                                onClick={() => {
                                    audioPlayer.setSrc(song.preview_url);
                                    audioPlayer.play();
                                }}
                                key={song.name + "Preview Button" + index}
                            >
                                <Flex wrap={"wrap"} flexDir={"column"}>
                                    <Text>{song.name}</Text>
                                    <Text
                                        fontSize={"xs"}
                                        color={"whiteAlpha.400"}
                                    >
                                        By {song.artists[0].name ?? "unknown"}
                                    </Text>
                                </Flex>
                            </Button>
                        ))}
                    </Flex>
                </Flex>
            ),
        });
        console.log("open song overlay");
    }

    function openSongHovering() {
        props.setHovering({
            hovering: true,
            type: "text",
            text: "Songs",
        });
    }

    function closeHovering() {
        props.setHovering({
            hovering: false,
        });
    }

    return (
        <Flex
            w={`${props.info.dims.width}px`}
            h={`${props.info.dims.height}px`}
            bottom={`${props.info.pos.y}px`}
            left={`${props.info.pos.x}px`}
            borderRadius={"15px"}
            boxShadow={"#333 2px 4px 8px"}
            overflow={"hidden"}
            bg={"blackAlpha.600"}
            pos={"absolute"}
            flexDir={"column"}
            py={2}
            px={10}
            justifyContent={"center"}
            zIndex={5}
            _hover={{ bg: "blackAlpha.700", transform: "scale(1.01)" }}
            transition={"0.1s ease-in-out"}
            cursor={"pointer"}
            onClick={openSongOverlay}
            onMouseOver={openSongHovering}
            onMouseLeave={closeHovering}
        >
            {loaded ? (
                <Flex flexDir={"column"} justifyContent={"center"}>
                    <Flex flexDir={"column"}>
                        {songs.slice(0, 5).map((song, i) => (
                            <Flex
                                flexDir={"row"}
                                key={`${song.name}_preview`}
                                my={1}
                            >
                                <Image
                                    src={
                                        song.album.images[0].url ??
                                        "/unknown.png"
                                    }
                                    alt={`${song.name} album art`}
                                    width={
                                        Math.min(screenHook.height / 10, 75) *
                                        (song.album.images[0].width ?? 1)
                                    }
                                    height={
                                        Math.min(screenHook.height / 10, 75) *
                                        (song.album.images[0].height ?? 1)
                                    }
                                />

                                <Flex flexDir={"column"} ml={2}>
                                    <Text
                                        fontSize={
                                            song.name.length < 35 ? "sm" : "xs"
                                        }
                                    >
                                        {i + 1}. {song.name}
                                    </Text>
                                    <Text fontSize={"xs"}>
                                        {song.artists
                                            .map((artist) => artist.name)
                                            .join(", ")}
                                    </Text>
                                    <Text
                                        fontSize={"xs"}
                                        color={"whiteAlpha.500"}
                                    >
                                        {song.album.name}
                                    </Text>
                                </Flex>
                            </Flex>
                        ))}
                    </Flex>
                </Flex>
            ) : (
                <Text fontSize={"sm"}>Loading...</Text>
            )}
        </Flex>
    );
}
