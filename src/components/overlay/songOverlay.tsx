import { Center, Flex, Link, Text, Image } from "@chakra-ui/react";
import { audioPlayerType, songOverlayInfo } from "../../utils/types/state";
import {
    songApiResponseType,
    songType,
    timeFrameType,
} from "../../utils/types/spotify";
import { useEffect, useState } from "react";
import AudioControls from "../other/audioControls";
import { wrapNames } from "../../utils/other/wrapNames";
import ExitButton from "./utils/exitButton";

export default function SongOverlay(props: {
    audioPlayer: audioPlayerType;
    time: timeFrameType;
    HU: number;
    WU: number;
    allSongs: songApiResponseType;
    exit: () => void;
}) {
    const [songs, setSongs] = useState<songType[]>([]);
    const [currentSong, setCurrentSong] = useState<songOverlayInfo>({
        song: "No Song Playing",
        artist: "",
        album: "",
    });

    useEffect(() => {
        const CurrentSongs = props.allSongs[props.time];
        if (CurrentSongs !== false) {
            setSongs(CurrentSongs);
        }
    }, [props.allSongs, props.time]);

    useEffect(() => {
        setCurrentSong(wrapNames(props.audioPlayer));
    }, [props.audioPlayer.playing]);

    return (
        <Flex
            flexDir={"column"}
            alignItems={"center"}
            bg={"MidGrey"}
            px={{ base: `${props.WU * 0.25}px`, md: `${props.WU * 0.1}px` }}
            py={4}
            borderRadius={"10px"}
            w={{
                base: `${props.WU * 9.5}px`,
                md: `${props.WU * 8}px`,
            }}
            maxH={`${props.HU * 9}px`}
            key={"SongOverlay"}
        >
            <Flex
                w={"100%"}
                flexDir={"column"}
                bg={"whiteAlpha.300"}
                p={{ base: `${props.WU * 0.25}px`, md: `${props.WU * 0.1}px` }}
                borderRadius={{ base: "5px", md: "10px" }}
            >
                <Flex
                    flexDir={"row"}
                    w={"100%"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    mb={2}
                >
                    <AudioControls
                        audioPlayer={props.audioPlayer}
                        WU={Math.min(props.HU, props.WU * 1.2, 65) * 3.2}
                        HU={Math.min(props.HU, props.WU * 1.2, 65)}
                    />
                    <ExitButton
                        fn={props.exit}
                        size={Math.min(props.HU, props.WU * 1.2, 65)}
                    />
                </Flex>
                <Flex flexDir={"row"} w={"100%"}>
                    <Flex
                        maxH={`${props.HU}px`}
                        w={{
                            base: `${props.WU * 8.8}px`,
                            md: `${props.WU * 7.4}px`,
                        }}
                        justifyContent={"center"}
                        flexDir={"column"}
                        my={1}
                    >
                        <Text
                            fontSize={{
                                base: `${props.WU * 0.4}px`,
                                md: `${props.WU * 0.16}px`,
                            }}
                        >
                            {currentSong.song}
                        </Text>
                        <Text
                            fontSize={{
                                base: `${props.WU * 0.4}px`,
                                md: `${props.WU * 0.12}px`,
                            }}
                            hidden={currentSong.album === ""}
                            color={"whiteAlpha.700"}
                        >
                            {currentSong.album}
                        </Text>
                        <Text
                            fontSize={{
                                base: `${props.WU * 0.4}px`,
                                md: `${props.WU * 0.14}px`,
                            }}
                            hidden={currentSong.artist === ""}
                        >
                            {currentSong.artist}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>

            <Flex
                flexDir={"row"}
                wrap={"wrap"}
                justifyContent={"space-around"}
                alignItems={{ base: "center", md: "flex-start" }}
                w={{
                    base: `${props.WU * 9}px`,
                    md: `${props.WU * 7.8}px`,
                }}
                maxH={`${props.HU * 7.5}px`}
                mt={`${props.HU * 0.1}px`}
                py={`${props.HU * 0.1}px`}
                bg={"whiteAlpha.300"}
                borderRadius={{ base: "5px", md: "10px" }}
                overflowY={"scroll"}
            >
                {songs.slice(0, 20).map((song, songIndex) => (
                    <Flex
                        key={"SongOverlay" + songIndex + "Song" + song.id}
                        bg={"blackAlpha.400"}
                        borderRadius={"10px"}
                        w={{
                            base: `${props.WU * 9}px`,
                            md: `${props.WU * 3.75}px`,
                        }}
                        px={{
                            base: `${props.WU * 0.15}px`,
                            md: `${props.WU * 0.075}px`,
                        }}
                        py={{
                            base: `${props.WU * 0.15}px`,
                            md: `${props.WU * 0.075}px`,
                        }}
                        my={{
                            base: `${props.WU * 0.075}px`,
                            md: `${props.WU * 0.025}px`,
                        }}
                        mx={`${props.WU * 0.05}px`}
                        flexDir={"row"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <Flex w={`${props.WU * 7}px`}>
                            <Flex
                                overflow={"hidden"}
                                borderRadius={"2px"}
                                height={"auto"}
                                w={{
                                    base: `${
                                        props.WU *
                                        2 *
                                        song.album.images[0].width
                                    }px`,
                                    md: `${
                                        props.WU *
                                        0.5 *
                                        song.album.images[0].width
                                    }px`,
                                }}
                                h={{
                                    base: `${
                                        props.WU *
                                        2 *
                                        song.album.images[0].width
                                    }px`,
                                    md: `${
                                        props.WU *
                                        0.5 *
                                        song.album.images[0].height
                                    }px`,
                                }}
                            >
                                <Image
                                    src={song.album.images[0].url}
                                    alt={"Album Cover for " + song.name}
                                />
                            </Flex>
                            <Flex
                                ml={`${props.WU / 10}px`}
                                maxW={{
                                    base: `${props.WU * 4.75}px`,
                                    md: `${props.WU * 5}px`,
                                }}
                                flexDir={"column"}
                            >
                                <Text
                                    fontSize={{
                                        base: `${props.WU / 3.2}px`,
                                        md: `${props.WU / 9}px`,
                                    }}
                                >
                                    {`${songIndex + 1}. ${song.name}`}
                                </Text>
                                <Text
                                    fontSize={{
                                        base: `${props.WU / 3.5}px`,
                                        md: `${props.WU / 10}px`,
                                    }}
                                    color={"whiteAlpha.700"}
                                >
                                    {song.album.name}
                                </Text>
                                <Text
                                    fontSize={{
                                        base: `${props.WU / 3.5}px`,
                                        md: `${props.WU / 10}px`,
                                    }}
                                >
                                    {song.artists
                                        .map((artist) => artist.name)
                                        .join(", ")}
                                </Text>
                            </Flex>
                        </Flex>
                        <Flex
                            flexDir={"column"}
                            w={{
                                base: `${props.WU * 0.75}px`,
                                md: `${props.WU * 0.2}px`,
                            }}
                        >
                            <Center
                                bg={""}
                                p={0}
                                h={{
                                    base: `${props.WU * 0.75}px`,
                                    md: `${props.WU * 0.2}px`,
                                }}
                                w={{
                                    base: `${props.WU * 0.75}px`,
                                    md: `${props.WU * 0.2}px`,
                                }}
                                mb={`${props.WU * 0.05}px`}
                                _hover={{
                                    transform: "scale(1.1)",
                                }}
                                _active={{
                                    transform: "scale(0.9)",
                                }}
                                cursor={"pointer"}
                                onClick={() => {
                                    props.audioPlayer.setSong(song);
                                }}
                            >
                                <Text
                                    fontSize={{
                                        base: `${props.WU * 0.75}px`,
                                        md: `${props.WU * 0.2}px`,
                                    }}
                                >
                                    {"▶︎"}
                                </Text>
                            </Center>
                            <Link
                                href={song.external_urls.spotify}
                                _hover={{
                                    transform: "scale(1.1)",
                                }}
                                _active={{
                                    transform: "scale(0.9)",
                                }}
                                h={{
                                    base: `${props.WU * 0.75}px`,
                                    md: `${props.WU * 0.2}px`,
                                }}
                                w={{
                                    base: `${props.WU * 0.75}px`,
                                    md: `${props.WU * 0.2}px`,
                                }}
                                minH={"21px"}
                                minW={"21px"}
                                isExternal
                            >
                                <Image
                                    src={"/spotifyBranding/icons/white.png"}
                                    alt={"Spotify Icon"}
                                />
                            </Link>
                        </Flex>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    );
}
