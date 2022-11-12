import { Button, Center, Flex, Text } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import { audioPlayerType, setHoveringType } from "../../utils/types/state";
import Image from "next/image";
import { useScreen } from "../../utils/hooks/useScreen";

export default function AudioPebble(props: {
    info: pebblePhysics;
    setHovering: setHoveringType;
    audioPlayer: audioPlayerType;
}) {
    const screenHook = useScreen();

    const HU = props.info.dims.height / 8; // Height Unit
    const WU = props.info.dims.width / 8; // Width Unit

    return (
        <Center
            w={`${props.info.dims.width}px`}
            h={`${props.info.dims.height}px`}
            boxShadow={"#333 2px 4px 8px"}
            bottom={`${props.info.pos.y}px`}
            left={`${props.info.pos.x}px`}
            borderRadius={"15px"}
            overflow={"hidden"}
            bg={"blackAlpha.600"}
            pos={"absolute"}
            transition={"0.1s ease-in-out"}
            flexDir={"column"}
        >
            <Center
                width={`${WU * 4}px`}
                height={`${HU * 4}px`}
                fontSize={"xs"}
                bg={"MidGrey"}
                borderRadius={"10px"}
            >
                {props.audioPlayer.playing !== undefined ? (
                    <Flex>
                        <Image
                            src={props.audioPlayer.playing.album.images[0].url}
                            alt={"Currently playing song"}
                            width={
                                props.audioPlayer.playing.album.images[0]
                                    .width *
                                WU *
                                4
                            }
                            height={
                                props.audioPlayer.playing.album.images[0]
                                    .height *
                                HU *
                                4
                            }
                        />
                    </Flex>
                ) : (
                    <Center textAlign={"center"}>No Song Playing</Center>
                )}
            </Center>
            <Flex
                flexDir={"row"}
                mt={2}
                mx={`${WU}px`}
                h={`${HU * 2}px`}
                w={`${WU * 7}px`}
                justifyContent={"center"}
                fontSize={`${HU * 0.75}px`}
            >
                <Button
                    bg={"blackAlpha.600"}
                    _hover={{ bg: "blackAlpha.500", transform: "scale(1.05)" }}
                    _active={{ bg: "blackAlpha.700", transform: "scale(0.95)" }}
                    onClick={props.audioPlayer.prevSong}
                >
                    {"⏮︎"}
                </Button>
                <Button
                    bg={"blackAlpha.600"}
                    _hover={{ bg: "blackAlpha.500", transform: "scale(1.05)" }}
                    _active={{ bg: "blackAlpha.700", transform: "scale(0.95)" }}
                    mx={1}
                    onClick={props.audioPlayer.playPause}
                >
                    {props.audioPlayer.paused ? "▶︎" : "⏸︎"}
                </Button>
                <Button
                    bg={"blackAlpha.600"}
                    _hover={{ bg: "blackAlpha.500", transform: "scale(1.05)" }}
                    _active={{ bg: "blackAlpha.700", transform: "scale(0.95)" }}
                    onClick={props.audioPlayer.nextSong}
                >
                    {"⏭︎"}
                </Button>
            </Flex>
        </Center>
    );
}
