import { Center, Flex, Text, Image, Link } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { profileHookType } from "../../utils/types/state";
import {
    artistsType,
    artistType,
    imageType,
    timeFrameType,
} from "../../utils/types/spotify";
import { overlayStateType } from "../../utils/types/overlay";

export default function ArtistPebble(props: {
    info: pebblePhysics;
    time: timeFrameType;
    profile: profileHookType;
    setOverlay: Dispatch<SetStateAction<overlayStateType>>;
}) {
    const [loaded, setLoaded] = useState(false);
    const [artists, setArtists] = useState<artistsType>([]);
    const [topArtistImage, setTopArtistImage] = useState<imageType>({
        width: 1,
        height: 1,
        url: "/unknown.png",
    });

    useEffect(() => {
        if (props.profile.profile.artists !== undefined) {
            setLoaded(false);
            const currentArtists = props.profile.profile.artists[props.time];
            if (currentArtists) {
                setArtists(currentArtists);
            }
        }
    }, [props.profile.profile.artists, props.time]);

    useEffect(() => {
        console.log("Rendering song pebble");
        if (artists.length > 4) {
            setLoaded(true);
        }

        if (artists.length > 0) {
            setTopArtistImage(
                artists[0].images.length > 0
                    ? artists[0].images[0]
                    : { width: 1, height: 1, url: "/unknown.png" }
            );
        } else {
            setTopArtistImage({ width: 1, height: 1, url: "/unknown.png" });
        }
    }, [artists]);

    const HU = props.info.dims.height / 10; // Height Unit
    const WU = props.info.dims.width / 10; // Width Unit

    function openArtistOverlay() {
        props.setOverlay({
            hidden: false,
            type: "artists",
            artists: props.profile.profile.artists ?? {
                short_term: false,
                medium_term: false,
                long_term: false,
            },
        });
        console.log("open artist overlay");
    }

    return (
        <Flex
            zIndex={5}
            w={`${props.info.dims.width}px`}
            h={`${props.info.dims.height}px`}
            top={`${props.info.pos.y}px`}
            left={`${props.info.pos.x}px`}
            borderRadius={`${HU * 0.375}px`}
            boxShadow={"#000 2px 2px 10px"}
            py={`${HU * 0.25}px`}
            px={`${WU * 0.25}px`}
            flexDir={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            overflow={"hidden"}
            bg={"blackAlpha.600"}
            pos={"absolute"}
            cursor={"pointer"}
            _hover={{ bg: "blackAlpha.700", transform: "scale(1.01)" }}
            transition={"0.1s ease-in-out"}
            onClick={openArtistOverlay}
        >
            <Text
                h={`${HU * 0.75}px`}
                w={`${WU * 9.5}px`}
                textAlign={"center"}
                fontWeight={"bold"}
                fontSize={`${HU * 0.6}px`}
                p={0}
                m={0}
            >
                Your Top Artists
            </Text>
            {loaded ? (
                <Flex
                    flexDir={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    h={`${HU * 8.5}px`}
                    w={`${WU * 9.5}px`}
                >
                    <Flex
                        flexDir={"column"}
                        justifyContent={"space-evenly"}
                        h={`${HU * 8.5}px`}
                        w={`${WU * 9.5}px`}
                    >
                        <Flex
                            flexDir={"row"}
                            mx={"10px"}
                            my={"5px"}
                            justifyContent={"space-between"}
                        >
                            <Flex h={"fit-content"} overflow={"hidden"}>
                                <Image
                                    src={topArtistImage.url}
                                    alt={"Artist Image"}
                                    width={topArtistImage.width * HU * 2.4}
                                    height={topArtistImage.height * HU * 2.4}
                                />
                            </Flex>
                            <Flex
                                ml={0.3 * WU}
                                flexDir={{ base: "column", md: "row" }}
                                h={2.4 * HU}
                                w={`${9 * WU - 2.4 * HU - 10}px`}
                                px={`${0.2 * WU}px`}
                                pb={0.1 * HU}
                                justifyContent={{
                                    base: "space-around",
                                    md: "space-between",
                                }}
                                overflow={"hidden"}
                            >
                                <Flex flexDir={"column"}>
                                    <Text fontSize={`${HU * 0.45}px`}>
                                        1. {artists[0].name}
                                    </Text>
                                    <Text
                                        fontSize={`${WU * 0.33}px`}
                                        color={"whiteAlpha.500"}
                                    >
                                        {getArtistGenres(artists[0])}
                                    </Text>
                                </Flex>
                                <Flex
                                    flexDir={"row"}
                                    alignItems={"center"}
                                    justifyContent={{
                                        base: "center",
                                        md: "flex-end",
                                    }}
                                >
                                    <Link
                                        href={artists[0].external_urls.spotify}
                                        _hover={{
                                            transform: "scale(1.1)",
                                        }}
                                        _active={{
                                            transform: "scale(0.9)",
                                        }}
                                        h={{
                                            base: `${0}px`,
                                            md: `${WU * 0.6}px`,
                                        }}
                                        w={{
                                            base: `${0}px`,
                                            md: `${WU * 0.6}px`,
                                        }}
                                        minH={{ base: "0px", md: "21px" }}
                                        minW={{ base: "0px", md: "21px" }}
                                        isExternal
                                    >
                                        <Image
                                            src={
                                                "/spotifyBranding/icons/white.png"
                                            }
                                            alt={"Spotify Icon"}
                                        />
                                    </Link>
                                    <Link
                                        href={artists[0].external_urls.spotify}
                                        _hover={{ transform: "scale(1.02)" }}
                                        _active={{ transform: "scale(0.98)" }}
                                        transition={"all 0.1s ease-in-out"}
                                        isExternal
                                    >
                                        <Flex
                                            w={{
                                                base: `${WU * 2.5}px`,
                                                md: "0px",
                                            }}
                                            h={{
                                                base: `${WU}px`,
                                                md: "0px",
                                            }}
                                            minW={{ base: "70px", md: "0px" }}
                                            minH={{ base: "21px", md: "0px" }}
                                            pos={"relative"}
                                            justifyContent={"center"}
                                            alignItems={"center"}
                                        >
                                            <Image
                                                src={
                                                    "/spotifyBranding/logos/white.png"
                                                }
                                                className={"object-contain"}
                                                alt={"Spotify Logo"}
                                                boxSize={"full"}
                                            />
                                        </Flex>
                                    </Link>
                                </Flex>
                            </Flex>
                        </Flex>
                        {artists.slice(1, 5).map((artist, index) => {
                            const artistImage =
                                artist.images.length > 0
                                    ? artist.images[0]
                                    : {
                                          url: "/unknown.png",
                                          width: 1,
                                          height: 1,
                                      };

                            return (
                                <Flex
                                    key={index}
                                    flexDir={"row"}
                                    justifyContent={"space-between"}
                                    mx={`${WU * 0.2}px`}
                                    my={`${HU * 0.025}px`}
                                    h={`${HU * 1.2}px`}
                                    w={`${WU * 9.1}px`}
                                >
                                    <Flex h={"fit-content"} overflow={"hidden"}>
                                        <Image
                                            src={artistImage.url}
                                            alt={"Artist Image"}
                                            width={artistImage.width * HU * 1.2}
                                            height={
                                                artistImage.height * HU * 1.2
                                            }
                                        />
                                    </Flex>
                                    <Flex
                                        ml={"5px"}
                                        flexDir={"column"}
                                        maxW={"80%"}
                                        maxH={"100%"}
                                        h={`${HU}px`}
                                        w={{
                                            base: `${WU * 6}px`,
                                            md: `${WU * 7}px`,
                                        }}
                                        justifyContent={"center"}
                                        overflow={"hidden"}
                                    >
                                        <Text fontSize={`${HU * 0.35}px`}>
                                            {index + 2}. {artist.name}
                                        </Text>

                                        <Text
                                            fontSize={`${WU * 0.3}px`}
                                            color={"whiteAlpha.500"}
                                        >
                                            {getArtistGenres(artist)}
                                        </Text>
                                    </Flex>
                                    <Flex
                                        h={"100%"}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                    >
                                        <Link
                                            href={artist.external_urls.spotify}
                                            _hover={{
                                                transform: "scale(1.1)",
                                            }}
                                            _active={{
                                                transform: "scale(0.9)",
                                            }}
                                            h={{
                                                base: `${WU * 0.75}px`,
                                                md: `${WU * 0.5}px`,
                                            }}
                                            w={{
                                                base: `${WU * 0.75}px`,
                                                md: `${WU * 0.5}px`,
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
                                </Flex>
                            );
                        })}
                    </Flex>
                </Flex>
            ) : (
                <Center w={"100%"} h={"100%"}>
                    Loading your artists...
                </Center>
            )}
            <Text
                h={`${HU * 0.32}px`}
                w={`${WU * 9}px`}
                fontSize={`${HU * 0.32}px`}
                fontWeight={"semibold"}
                color={"whiteAlpha.800"}
                textAlign={"center"}
                mb={2}
            >
                Click for more info
            </Text>
        </Flex>
    );
}

export function getArtistGenres(artist: artistType) {
    let genreString = "";
    if (artist.genres.length === 0) {
        return "This artist has no known genres";
    } else if (artist.genres.length < 4) {
        genreString = artist.genres.join(", ");
    } else {
        genreString = artist.genres.slice(0, 3).join(", ") + "...";
    }

    if (genreString.length > 30) {
        genreString = genreString.substring(0, 30) + "...";
    }

    return genreString;
}
