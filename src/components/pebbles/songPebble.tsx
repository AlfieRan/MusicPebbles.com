import { Center, Flex, Text } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import { setHoveringType } from "../../utils/types/state";
import Image from "next/image";
import { useScreen } from "../../utils/hooks/useScreen";
import { songType } from "../../utils/types/spotify";

export default function SongPebble(props: {
    info: pebblePhysics;
    setHovering: setHoveringType;
    songs: songType[];
}) {
    const screenHook = useScreen();

    function openSongOverlay() {
        console.log("open song overlay");
    }

    function openSongHovering() {
        props.setHovering({
            hovering: true,
            type: "text",
            text: "Open song",
        });
    }

    function closeHovering() {
        props.setHovering({
            hovering: false,
        });
    }

    return (
        <Center
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
            p={2}
            zIndex={5}
            _hover={{ bg: "blackAlpha.700", transform: "scale(1.01)" }}
            transition={"0.1s ease-in-out"}
            cursor={"pointer"}
            onClick={openSongOverlay}
            onMouseOver={openSongHovering}
            onMouseLeave={closeHovering}
        >
            <Flex flexDir={"column"}>
                {props.songs.slice(0, 5).map((song, i) => (
                    <Flex flexDir={"row"} key={`${song.name}_preview`} my={1}>
                        <Flex>
                            <Image
                                src={song.album.images[0].url ?? "/unknown.png"}
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
                        </Flex>
                        <Flex flexDir={"column"} ml={2}>
                            <Text fontSize={"sm"}>
                                {i + 1}. {song.name}
                            </Text>
                            <Text fontSize={"xs"}>
                                {song.artists
                                    .map((artist) => artist.name)
                                    .join(", ")}
                            </Text>
                            <Text fontSize={"xs"} color={"whiteAlpha.500"}>
                                {song.album.name}
                            </Text>
                        </Flex>
                    </Flex>
                ))}
            </Flex>
        </Center>
    );
}
