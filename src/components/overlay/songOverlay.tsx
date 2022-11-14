import { Button, Center, Flex, Link, Text } from "@chakra-ui/react";
import { audioPlayerType, songOverlayInfo } from "../../utils/types/state";
import { songType, timeFrameType } from "../../utils/types/spotify";
import { useSongs } from "../../utils/hooks/useSongs";
import { useEffect, useState } from "react";
import AudioControls from "../other/audioControls";
import Image from "next/image";
import { wrapNames } from "../../utils/other/wrapNames";

export default function SongOverlay(props: {
    audioPlayer: audioPlayerType;
    time: timeFrameType;
    HU: number;
    WU: number;
}) {
    const [allSongs] = useSongs();
    const [songs, setSongs] = useState<songType[]>([]);
    const [currentSong, setCurrentSong] = useState<songOverlayInfo>({
        song: "No Song Playing",
        artist: "",
        album: "",
    });

    useEffect(() => {
        const CurrentSongs = allSongs[props.time];
        if (CurrentSongs !== false) {
            setSongs(CurrentSongs);
        }
    }, [allSongs, props.time]);

    useEffect(() => {
        setCurrentSong(wrapNames(props.audioPlayer));
    }, [props.audioPlayer.playing]);

    return (
        <Flex
            flexDir={"column"}
            alignItems={"center"}
            bg={"MidGrey"}
            px={`${props.WU * 0.25}px`}
            py={4}
            borderRadius={"10px"}
            maxW={`${props.WU * 8}px`}
            maxH={`${props.HU * 8}px`}
            key={"SongOverlay"}
        >
            <Flex w={"100%"} justifyContent={"center"}>
                <Flex
                    py={2}
                    overflow={"hidden"}
                    bg={"whiteAlpha.300"}
                    borderRadius={"10px"}
                    justifyContent={"space-between"}
                    w={`${props.WU * 7.5}px`}
                    px={`${props.WU * 0.25}px`}
                    maxH={`${props.HU * 2}px`}
                >
                    <Flex
                        w={`${props.WU * 5}px`}
                        alignItems={{ base: "flex-start", md: "center" }}
                        flexDir={{ base: "column", md: "row" }}
                    >
                        <Flex
                            w={{
                                base: `${props.WU * 3}px`,
                                md: `${(props.WU / 2) * 3}px`,
                            }}
                            maxH={{
                                base: `${props.HU * 2}px`,
                                md: `${props.HU}px`,
                            }}
                            justifyContent={"center"}
                            alignItems={"center"}
                        >
                            <AudioControls
                                audioPlayer={props.audioPlayer}
                                WU={props.WU / 4}
                                HU={props.HU / 4}
                            />
                        </Flex>
                        <Flex
                            maxH={`${props.HU}px`}
                            w={`${props.WU * 4}px`}
                            justifyContent={"center"}
                            flexDir={"column"}
                        >
                            <Text fontSize={`${props.WU / 8}px`}>
                                {currentSong.song}
                            </Text>
                            <Text
                                fontSize={`${props.WU / 10}px`}
                                hidden={currentSong.artist === ""}
                            >
                                {currentSong.artist}
                            </Text>
                        </Flex>
                    </Flex>
                    <Link
                        _hover={{ transform: "scale(1.05)" }}
                        _active={{ transform: "scale(0.95)" }}
                        maxW={{
                            base: `${props.WU * 2}px`,
                            md: `${props.WU}px`,
                        }}
                        href={
                            props.audioPlayer.playing !== undefined
                                ? props.audioPlayer.playing.external_urls
                                      .spotify
                                : "https://open.spotify.com/"
                        }
                        isExternal
                    >
                        <Flex
                            w={{
                                base: `${props.WU * 2}px`,
                                md: `${props.WU}px`,
                            }}
                            h={"100%"}
                            justifyContent={"flex-start"}
                            alignItems={"center"}
                            pos={"relative"}
                        >
                            <Image
                                src={"/spotifyBranding/logos/white.png"}
                                alt={"Spotify Icon"}
                                className={"object-contain"}
                                fill
                            />
                        </Flex>
                    </Link>
                </Flex>
            </Flex>
            <Flex
                flexDir={{ base: "column", md: "row" }}
                justifyContent={{ base: "flex-start", md: "space-around" }}
                alignItems={{ base: "center", md: "flex-start" }}
                w={`${props.WU * 7.5}px`}
                maxH={`${props.HU * 7.5}px`}
                mt={2}
                bg={"whiteAlpha.300"}
                borderRadius={"10px"}
                overflowY={"scroll"}
            >
                {[songs.slice(0, 10), songs.slice(10, 20)].map(
                    (songPacket, packetIndex) => (
                        <Flex
                            key={packetIndex + "SongOverlayPacket"}
                            w={{
                                base: `${props.WU * 7}px`,
                                md: `${props.WU * 3.5}px`,
                            }}
                            h={"fit-content"}
                            py={"5px"}
                            mb={{ base: "0px", md: "10px" }}
                            flexDir={"column"}
                        >
                            {songPacket.map((song, songIndex) => (
                                <Flex
                                    key={
                                        "SongOverlayPacket" +
                                        packetIndex +
                                        "Song" +
                                        song.id
                                    }
                                    bg={"blackAlpha.400"}
                                    borderRadius={"10px"}
                                    my={1}
                                    py={2}
                                    px={3}
                                    flexDir={"row"}
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                >
                                    <Flex>
                                        <Flex
                                            overflow={"hidden"}
                                            borderRadius={"5px"}
                                            width={"auto"}
                                            height={"auto"}
                                        >
                                            <Image
                                                src={song.album.images[0].url}
                                                alt={
                                                    "Album Cover for " +
                                                    song.name
                                                }
                                                width={
                                                    props.WU *
                                                    0.5 *
                                                    song.album.images[0].width
                                                }
                                                height={
                                                    props.WU *
                                                    0.5 *
                                                    song.album.images[0].height
                                                }
                                            />
                                        </Flex>
                                        <Flex
                                            ml={`${props.WU / 10}px`}
                                            flexDir={"column"}
                                        >
                                            <Text
                                                fontSize={`${props.WU / 9}px`}
                                            >
                                                {`${
                                                    packetIndex * 10 +
                                                    songIndex +
                                                    1
                                                }. ${song.name}`}
                                            </Text>
                                            <Text
                                                fontSize={`${props.WU / 10}px`}
                                                color={"whiteAlpha.700"}
                                            >
                                                {song.album.name}
                                            </Text>
                                            <Text
                                                fontSize={`${props.WU / 10}px`}
                                            >
                                                {song.artists
                                                    .map(
                                                        (artist) => artist.name
                                                    )
                                                    .join(", ")}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                    <Flex flexDir={"column"}>
                                        <Center
                                            bg={""}
                                            p={0}
                                            h={`${props.WU * 0.2}px`}
                                            w={`${props.WU * 0.2}px`}
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
                                                fontSize={`${props.WU * 0.2}px`}
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
                                            isExternal
                                        >
                                            <Image
                                                src={
                                                    "/spotifyBranding/icons/white.png"
                                                }
                                                alt={"Spotify Icon"}
                                                width={props.WU * 0.2}
                                                height={props.WU * 0.2}
                                            />
                                        </Link>
                                    </Flex>
                                </Flex>
                            ))}
                        </Flex>
                    )
                )}
            </Flex>
        </Flex>
    );
}
