import { Center, Flex, Text, Image } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { profileHookType } from "../../utils/types/state";
import {
    artistsType,
    artistType,
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
            boxShadow={"#333 2px 4px 8px"}
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
                        <Flex flexDir={"row"} mx={"10px"} my={"5px"}>
                            <Flex
                                h={"fit-content"}
                                borderRadius={`${Math.min(WU * 0.1, 5)}px`}
                                overflow={"hidden"}
                            >
                                <Image
                                    src={artists[0].images[0].url}
                                    alt={"Artist Image"}
                                    width={
                                        artists[0].images[0].width * HU * 2.4
                                    }
                                    height={
                                        artists[0].images[0].height * HU * 2.4
                                    }
                                />
                            </Flex>
                            <Flex
                                ml={0.3 * WU}
                                flexDir={"column"}
                                h={2 * HU}
                                maxW={5 * WU}
                                pb={0.1 * HU}
                                justifyContent={"center"}
                                overflow={"hidden"}
                            >
                                <Text fontSize={`${HU * 0.5}px`}>
                                    1. {artists[0].name}
                                </Text>
                                <Text
                                    fontSize={`${WU * 0.33}px`}
                                    color={"whiteAlpha.500"}
                                >
                                    {getArtistGenres(artists[0])}
                                </Text>
                            </Flex>
                        </Flex>
                        {artists.slice(1, 5).map((artist, index) => (
                            <Flex
                                key={index}
                                flexDir={"row"}
                                mx={`${WU * 0.2}px`}
                                my={`${HU * 0.025}px`}
                                h={`${HU * 1.2}px`}
                                w={`${WU * 8.5}px`}
                            >
                                <Flex
                                    h={"fit-content"}
                                    borderRadius={`${Math.min(WU * 0.1, 5)}px`}
                                    overflow={"hidden"}
                                >
                                    <Image
                                        src={artist.images[0].url}
                                        alt={"Artist Image"}
                                        width={
                                            artist.images[0].width * HU * 1.2
                                        }
                                        height={
                                            artist.images[0].height * HU * 1.2
                                        }
                                    />
                                </Flex>
                                <Flex
                                    ml={3}
                                    flexDir={"column"}
                                    maxW={"70%"}
                                    maxH={"100%"}
                                    h={`${HU}px`}
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
                            </Flex>
                        ))}
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
