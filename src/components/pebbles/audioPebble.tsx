import { Button, Center, Flex, Link, Text } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import { audioPlayerType, setHoveringType } from "../../utils/types/state";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

export default function AudioPebble(props: {
    info: pebblePhysics;
    setHovering: setHoveringType;
    audioPlayer: audioPlayerType;
}) {
    const HU = props.info.dims.height / 8; // Height Unit
    const WU = props.info.dims.width / 8; // Width Unit

    function openHover() {
        props.setHovering({
            hovering: true,
            type: "text",
            text: "Click to go to Spotify",
        });
    }

    function closeHover() {
        props.setHovering({ hovering: false });
    }

    function redirectToSpotify() {
        window.open(
            props.audioPlayer.playing !== undefined
                ? props.audioPlayer.playing.external_urls.spotify
                : "https://open.spotify.com/",
            "_blank"
        );
    }

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
                pos={"absolute"}
                right={`${WU * 0.4}px`}
                top={`${WU * 0.4}px`}
                cursor={"pointer"}
                _hover={{ transform: "scale(1.1)" }}
                _active={{ transform: "scale(0.9)" }}
                transition={"0.1s ease-in-out"}
                onClick={redirectToSpotify}
            >
                <Image
                    src={"/spotifyBranding/icons/white.png"}
                    width={WU * 0.8}
                    height={WU * 0.8}
                    alt={"Spotify Icon, click to go to Spotify"}
                />
            </Center>
            <Center
                width={`${WU * 5}px`}
                height={`${HU * 5}px`}
                fontSize={"xs"}
                borderRadius={"10px"}
            >
                {props.audioPlayer.playing !== undefined ? (
                    <Center flexDir={"column"}>
                        <Flex
                            width={`${WU * 4}px`}
                            height={`${HU * 4}px`}
                            bg={"MidGrey"}
                            onMouseOver={openHover}
                            onMouseLeave={closeHover}
                            onClick={redirectToSpotify}
                        >
                            <Image
                                src={
                                    props.audioPlayer.playing.album.images[0]
                                        .url
                                }
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
                        <Flex
                            w={`${WU * 5}px`}
                            h={HU + "px"}
                            overflow={"hidden"}
                            mt={1}
                            justifyContent={"center"}
                        >
                            <Flex w={"fit-content"}>
                                <motion.div
                                    className={"flex w-fit"}
                                    initial={{ x: "100%" }}
                                    animate={{ x: ["100%", "-100%"] }}
                                    transition={{
                                        duration: 7.5,
                                        ease: "linear",
                                        repeat: Infinity,
                                    }}
                                >
                                    <Text
                                        w={"fit-content"}
                                        whiteSpace={"nowrap"}
                                        textAlign={"left"}
                                        fontSize={`${HU * 0.5}px`}
                                    >
                                        {`${props.audioPlayer.playing.name} - ${props.audioPlayer.playing.artists[0].name}`}
                                    </Text>
                                </motion.div>
                            </Flex>
                        </Flex>
                    </Center>
                ) : (
                    <Center textAlign={"center"}>No Song Playing</Center>
                )}
            </Center>
            <Flex
                flexDir={"row"}
                mx={`${WU}px`}
                maxH={`${HU * 2}px`}
                maxW={`${WU * 7}px`}
                justifyContent={"center"}
                alignItems={"center"}
                fontSize={`${HU * 0.75}px`}
            >
                <Button
                    bg={"blackAlpha.600"}
                    _hover={{ bg: "blackAlpha.500", transform: "scale(1.05)" }}
                    _active={{ bg: "blackAlpha.700", transform: "scale(0.95)" }}
                    onClick={props.audioPlayer.prevSong}
                    px={`${WU * 0.5}px`}
                    py={0}
                >
                    {"⏮︎"}
                </Button>
                <Button
                    bg={"blackAlpha.600"}
                    _hover={{ bg: "blackAlpha.500", transform: "scale(1.05)" }}
                    _active={{ bg: "blackAlpha.700", transform: "scale(0.95)" }}
                    mx={1}
                    onClick={props.audioPlayer.playPause}
                    px={`${WU * 0.5}px`}
                    py={0}
                >
                    {props.audioPlayer.paused ? "▶︎" : "⏸︎"}
                </Button>
                <Button
                    bg={"blackAlpha.600"}
                    _hover={{ bg: "blackAlpha.500", transform: "scale(1.05)" }}
                    _active={{ bg: "blackAlpha.700", transform: "scale(0.95)" }}
                    onClick={props.audioPlayer.nextSong}
                    px={`${WU * 0.5}px`}
                    py={0}
                >
                    {"⏭︎"}
                </Button>
            </Flex>
        </Center>
    );
}
