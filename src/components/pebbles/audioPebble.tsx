import { Button, Center, Flex, Link, Text } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import {
    audioPlayerType,
    setHoveringType,
    songOverlayInfo,
} from "../../utils/types/state";
import Image from "next/image";
import { motion } from "framer-motion";
import AudioControls from "../other/audioControls";
import { useEffect, useState } from "react";
import { wrapNames } from "../../utils/other/wrapNames";

export default function AudioPebble(props: {
    info: pebblePhysics;
    setHovering: setHoveringType;
    audioPlayer: audioPlayerType;
}) {
    const [HU, setHU] = useState(props.info.dims.height / 8);
    const [WU, setWU] = useState(props.info.dims.width / 8);

    useEffect(() => {
        setHU(props.info.dims.height / 8);
        setWU(props.info.dims.width / 8);
    }, [props.info.dims.height, props.info.dims.width]);

    const [mode, setMode] = useState<"wide" | "normal">("normal");
    const [currentSong, setCurrentSong] = useState<songOverlayInfo>({
        song: "No Song Playing",
        artist: "",
        album: "",
    });

    useEffect(() => {
        if (WU > 1.1 * HU) {
            setMode("wide");
        } else {
            setMode("normal");
        }
    }, [HU, WU]);

    useEffect(() => {
        setCurrentSong(wrapNames(props.audioPlayer, 25));
    }, [props.audioPlayer.playing]);

    function openHover() {
        props.setHovering({
            hovering: true,
            type: "text",
            text: "Click to go to Spotify",
            x: "right",
            y: "top",
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
            top={`${props.info.pos.y}px`}
            left={`${props.info.pos.x}px`}
            borderRadius={"15px"}
            overflow={"hidden"}
            bg={"blackAlpha.600"}
            pos={"absolute"}
            transition={"0.1s ease-in-out"}
            flexDir={"column"}
        >
            <Center
                width={`${WU * 7.5}px`}
                height={`${HU * 7.5}px`}
                fontSize={"xs"}
                borderRadius={"10px"}
            >
                {props.audioPlayer.playing !== undefined ? (
                    <Center
                        flexDir={mode === "normal" ? "column" : "row"}
                        w={"100%"}
                        h={"100%"}
                    >
                        <Flex
                            w={
                                mode === "normal"
                                    ? `${HU * 4}px`
                                    : `${WU * 2}px`
                            }
                            h={
                                mode === "normal"
                                    ? `${HU * 4}px`
                                    : `${WU * 3}px`
                            }
                            pos={"relative"}
                            flexDir={"column"}
                            onMouseOver={openHover}
                            onMouseLeave={closeHover}
                            onClick={redirectToSpotify}
                        >
                            <Image
                                src={
                                    props.audioPlayer.playing.album.images[0]
                                        .url
                                }
                                className={"object-contain"}
                                alt={"Currently playing song"}
                                fill
                            />
                        </Flex>
                        <Flex
                            flexDir={"column"}
                            w={
                                mode === "normal"
                                    ? `${WU * 7}px`
                                    : `${WU * 5}px`
                            }
                            h={
                                mode === "normal"
                                    ? `${HU * 2.7}px`
                                    : `${HU * 6.5}px`
                            }
                            px={mode === "wide" ? `${WU * 0.25}px` : ""}
                            justifyContent={"center"}
                            alignItems={mode === "normal" ? "center" : ""}
                        >
                            <Flex
                                w={
                                    mode === "normal"
                                        ? `${WU * 7}px`
                                        : `${WU * 5}px`
                                }
                                h={
                                    mode === "normal"
                                        ? `${HU * 3}px`
                                        : `${HU * 3.5}px`
                                }
                                overflow={"hidden"}
                                my={1}
                                justifyContent={"center"}
                            >
                                <Flex h={`${HU}px`} hidden={mode === "wide"}>
                                    <motion.div
                                        className={"flex w-fit-content h-fit"}
                                        initial={{ x: "90%" }}
                                        animate={{ x: ["90%", "-90%"] }}
                                        transition={{
                                            duration: 15,
                                            repeatDelay: 0,
                                            ease: "linear",
                                            repeat: Infinity,
                                        }}
                                    >
                                        <Text
                                            w={"fit-content"}
                                            h={"fit-content"}
                                            whiteSpace={"nowrap"}
                                            textAlign={"center"}
                                            fontSize={`${HU * 0.5}px`}
                                        >
                                            {`${props.audioPlayer.playing.name} - ${props.audioPlayer.playing.album.name} - ${props.audioPlayer.playing.artists[0].name}`}
                                        </Text>
                                    </motion.div>
                                </Flex>
                                <Flex
                                    w={"100%"}
                                    h={"100%"}
                                    hidden={mode === "normal"}
                                    flexDir={"column"}
                                    pb={`${HU * 0.5}px`}
                                    fontSize={`${HU * 0.7}px`}
                                >
                                    <Text>{currentSong.song}</Text>
                                    <Text color={"whiteAlpha.700"}>
                                        {currentSong.album}
                                    </Text>
                                    <Text>{currentSong.artist}</Text>
                                </Flex>
                            </Flex>
                            <AudioControls
                                audioPlayer={props.audioPlayer}
                                HU={mode === "normal" ? HU * 1.5 : HU * 1.75}
                                WU={mode === "normal" ? WU * 6 : WU * 5}
                            />
                        </Flex>
                    </Center>
                ) : (
                    <Center textAlign={"center"}>No Song Playing</Center>
                )}
            </Center>
        </Center>
    );
}
