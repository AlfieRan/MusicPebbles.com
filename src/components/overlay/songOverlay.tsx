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
import { shortString } from "../../utils/other/basics";

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
            className={
                "flex-col items-center bg-black-500 rounded-lg overflow-y-scroll"
            }
            px={{ base: `${props.WU * 0.25}px`, md: `${props.WU * 0.1}px` }}
            py={{ base: `${props.WU * 0.25}px`, md: `${props.WU * 0.1}px` }}
            w={{
                base: `${props.WU * 9.5}px`,
                md: `${props.WU * 8}px`,
            }}
            maxH={`${props.HU * 9}px`}
            key={"SongOverlay"}
        >
            <Flex
                className={
                    "flex-row justify-between rounded-md md:rounded-lg items-center md:items-start"
                }
                w={{
                    base: `${props.WU * 9}px`,
                    md: `${props.WU * 7.8}px`,
                }}
            >
                <Flex className={"h-full items-center"}>
                    <Flex
                        className={
                            "relative flex-col justify-center items-center overflow-hidden"
                        }
                        w={{
                            base: `${props.WU * 2}px`,
                            md: `${props.WU * 1.3}px`,
                        }}
                        onClick={() => {
                            if (props.audioPlayer.playing !== undefined) {
                                window.open(
                                    props.audioPlayer.playing.external_urls
                                        .spotify,
                                    "_blank"
                                );
                            } else {
                                console.error(
                                    "Song clicked, with none playing."
                                );
                            }
                        }}
                    >
                        <Image
                            src={
                                (props.audioPlayer.playing?.album.images ?? [])
                                    .length > 0
                                    ? props.audioPlayer.playing?.album.images[0]
                                          .url
                                    : "/unknown.png"
                            }
                            className={"object-contain"}
                            alt={"Currently playing song"}
                        />
                    </Flex>
                </Flex>
                <Flex
                    w={{
                        base: `${props.WU * 6.8}px`,
                        md: `${props.WU * 6.4}px`,
                    }}
                    flexDir={"column"}
                >
                    <Flex
                        className={
                            "flex-row w-full justify-between items-center mb-0.5"
                        }
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
                            my={"1px"}
                        >
                            <Text
                                fontSize={{
                                    base: `${props.WU * 0.4}px`,
                                    sm: `${props.WU * 0.25}px`,
                                    md: `${props.WU * 0.16}px`,
                                }}
                            >
                                {currentSong.song}
                            </Text>
                            <Text
                                fontSize={{
                                    base: `${props.WU * 0.4}px`,
                                    sm: `${props.WU * 0.25}px`,
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
                                    sm: `${props.WU * 0.25}px`,
                                    md: `${props.WU * 0.14}px`,
                                }}
                                hidden={currentSong.artist === ""}
                            >
                                {currentSong.artist}
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <div
                style={{ display: "grid" }}
                className={"w-full h-fit max-h-full"}
            >
                <div
                    className={
                        "grid grid-cols-1 md:grid-cols-2 w-full max-h-full flex-wrap justify-around items-center md:items-start " +
                        "rounded-md md:rounded-lg gap-3 mt-2"
                    }
                >
                    {songs.slice(0, 20).map((song, songIndex) => {
                        const songImage =
                            song.album.images.length > 0
                                ? song.album.images[0]
                                : { width: 1, height: 1, url: "/unknown.png" };

                        const songData = {
                            name: shortString(song.name),
                            album: shortString(song.album.name),
                            artist: shortString(
                                song.artists
                                    .map((artist) => artist.name)
                                    .join(", ")
                            ),
                        };

                        return (
                            <div
                                className={
                                    "col-span-1 flex w-full h-fit min-h-full justify-between items-center bg-black-400 rounded-md overflow-hidden"
                                }
                                key={
                                    "SongOverlay" + songIndex + "Song" + song.id
                                }
                            >
                                <div
                                    className={
                                        "flex items-center justify-start w-full h-fit rounded-l-md"
                                    }
                                >
                                    <Flex
                                        className={"overflow-hidden"}
                                        w={{
                                            base: `${
                                                props.WU * 2 * songImage.width
                                            }px`,
                                            md: `${
                                                props.WU * 0.5 * songImage.width
                                            }px`,
                                        }}
                                        h={{
                                            base: `${
                                                props.WU * 2 * songImage.width
                                            }px`,
                                            md: `${
                                                props.WU *
                                                0.5 *
                                                songImage.height
                                            }px`,
                                        }}
                                    >
                                        <Image
                                            src={songImage.url}
                                            alt={
                                                "Album Cover for " +
                                                songData.name
                                            }
                                        />
                                    </Flex>
                                    <Flex
                                        ml={`${props.WU / 10}px`}
                                        maxW={{
                                            base: `${props.WU * 4.75}px`,
                                            md: `${props.WU * 2.7}px`,
                                        }}
                                        flexDir={"column"}
                                    >
                                        <Text
                                            fontSize={{
                                                base: `${props.WU / 3.2}px`,
                                                md: `${props.WU / 9}px`,
                                            }}
                                        >
                                            {`${songIndex + 1}. ${
                                                songData.name
                                            }`}
                                        </Text>
                                        <Text
                                            fontSize={{
                                                base: `${props.WU / 3.5}px`,
                                                md: `${props.WU / 10}px`,
                                            }}
                                            color={"whiteAlpha.700"}
                                        >
                                            {songData.album}
                                        </Text>
                                        <Text
                                            fontSize={{
                                                base: `${props.WU / 3.5}px`,
                                                md: `${props.WU / 10}px`,
                                            }}
                                        >
                                            {songData.artist}
                                        </Text>
                                    </Flex>
                                </div>
                                <Flex
                                    className={
                                        "flex-col pr-1 h-full min-w-fit items-center justify-center pb-[3px]"
                                    }
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
                                            src={
                                                "/spotifyBranding/icons/white.png"
                                            }
                                            alt={"Spotify Icon"}
                                        />
                                    </Link>
                                </Flex>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Flex>
    );
}
