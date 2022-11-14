import { Button, Center, Flex, Link, Text } from "@chakra-ui/react";
import { audioPlayerType } from "../../utils/types/state";
import { songType, timeFrameType } from "../../utils/types/spotify";
import { useSongs } from "../../utils/hooks/useSongs";
import { useEffect, useState } from "react";
import AudioControls from "../other/audioControls";
import Image from "next/image";

export default function SongOverlay(props: {
    audioPlayer: audioPlayerType;
    time: timeFrameType;
    HU: number;
    WU: number;
}) {
    const [allSongs] = useSongs();
    const [songs, setSongs] = useState<songType[]>([]);
    const [currentSong, setCurrentSong] = useState<string>("No Song Playing");
    const [currentArtist, setCurrentArtist] = useState<string>("");

    useEffect(() => {
        const CurrentSongs = allSongs[props.time];
        if (CurrentSongs !== false) {
            setSongs(CurrentSongs);
        }
    }, [allSongs, props.time]);

    useEffect(() => {
        if (props.audioPlayer.playing !== undefined) {
            let newString = `${props.audioPlayer.playing.name} - ${props.audioPlayer.playing.album.name}`;
            if (newString.length > 70) {
                newString = newString.substring(0, 70) + "...";
            }
            setCurrentSong(newString);

            let newArtist = props.audioPlayer.playing.artists
                .map((artist) => artist.name)
                .join(", ");
            if (newArtist.length > 50) {
                newArtist = newArtist.substring(0, 50) + "...";
            }
            setCurrentArtist(newArtist);
        }
    }, [props.audioPlayer.playing]);

    return (
        <Flex
            flexDir={"column"}
            bg={"MidGrey"}
            px={5}
            py={4}
            borderRadius={"10px"}
            maxW={props.WU * 8}
            maxH={props.HU * 8}
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
                    maxH={`${props.HU * 2}px`}
                >
                    <Flex w={`${props.WU * 6.5}px`} alignItems={"center"}>
                        <AudioControls
                            audioPlayer={props.audioPlayer}
                            WU={props.WU / 4}
                            HU={props.HU / 4}
                        />
                        <Flex
                            maxH={`${props.HU}px`}
                            w={`${props.WU * 5}px`}
                            justifyContent={"center"}
                            flexDir={"column"}
                        >
                            <Text fontSize={`${props.WU / 8}px`}>
                                {currentSong}
                            </Text>
                            <Text
                                fontSize={`${props.WU / 10}px`}
                                hidden={currentArtist === ""}
                            >
                                {currentArtist}
                            </Text>
                        </Flex>
                    </Flex>
                    <Link
                        _hover={{ transform: "scale(1.05)" }}
                        _active={{ transform: "scale(0.95)" }}
                        mr={2}
                        maxW={`${props.WU}px`}
                        href={
                            props.audioPlayer.playing !== undefined
                                ? props.audioPlayer.playing.external_urls
                                      .spotify
                                : "https://open.spotify.com/"
                        }
                        isExternal
                    >
                        <Flex
                            maxW={`${props.WU}px`}
                            h={"100%"}
                            alignItems={"center"}
                        >
                            <Image
                                src={"/spotifyBranding/logos/white.png"}
                                alt={"Spotify Icon"}
                                width={props.WU * 0.8}
                                height={props.WU * 0.8}
                            />
                        </Flex>
                    </Link>
                </Flex>
            </Flex>
            <Flex
                flexDir={"row"}
                justifyContent={"space-around"}
                w={`${props.WU * 7.5}px`}
                maxH={`${props.HU * 6}px`}
                mt={2}
                bg={"whiteAlpha.300"}
                borderRadius={"10px"}
                overflowY={"scroll"}
            >
                {[songs.slice(0, 10), songs.slice(10, 20)].map(
                    (songPacket, packetIndex) => (
                        <Flex
                            key={packetIndex + "SongOverlayPacket"}
                            w={`${props.WU * 3.5}px`}
                            h={"fit-content"}
                            py={"5px"}
                            mb={"10px"}
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
