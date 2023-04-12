import { Center, Flex, Image, Text } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import {
    audioPlayerType,
    setHoveringType,
    songOverlayInfo,
} from "../../utils/types/state";
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

    const [currentSong, setCurrentSong] = useState<songOverlayInfo>({
        song: "No Song Playing",
        artist: "",
        album: "",
    });

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
            borderRadius={`${HU * 0.75}px`}
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
                    (() => {
                        const playingImage =
                            props.audioPlayer.playing.album.images.length > 0
                                ? props.audioPlayer.playing.album.images[0].url
                                : "/unknown.png";

                        return (
                            <Center flexDir={"row"} w={"100%"} h={"100%"}>
                                <Flex
                                    w={`${WU * 2}px`}
                                    h={`${WU * 3}px`}
                                    pos={"relative"}
                                    flexDir={"column"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    overflow={"hidden"}
                                    onMouseOver={openHover}
                                    onMouseLeave={closeHover}
                                    onClick={redirectToSpotify}
                                >
                                    <Image
                                        src={playingImage}
                                        className={"object-contain"}
                                        alt={"Currently playing song"}
                                    />
                                </Flex>
                                <Flex
                                    flexDir={"column"}
                                    w={`${WU * 5}px`}
                                    h={`${HU * 6.5}px`}
                                    px={`${WU * 0.25}px`}
                                    justifyContent={"center"}
                                    alignItems={""}
                                >
                                    <Flex
                                        w={`${WU * 5}px`}
                                        h={`${HU * 3.5}px`}
                                        overflow={"hidden"}
                                        my={1}
                                        justifyContent={"center"}
                                    >
                                        <Flex
                                            w={"100%"}
                                            h={"100%"}
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
                                        HU={HU * 1.75}
                                        WU={WU * 5}
                                    />
                                </Flex>
                            </Center>
                        );
                    })()
                ) : (
                    <Center textAlign={"center"}>No Song Playing</Center>
                )}
            </Center>
        </Center>
    );
}
