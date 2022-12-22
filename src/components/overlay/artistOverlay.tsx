import { Flex, Text, Link, Image } from "@chakra-ui/react";
import ExitButton from "./utils/exitButton";
import { profileHookType } from "../../utils/types/state";
import { useEffect, useState } from "react";
import {
    artistsType,
    artistType,
    timeFrameType,
} from "../../utils/types/spotify";
import { getArtistGenres } from "../pebbles/artistPebble";

export default function ArtistOverlay(props: {
    HU: number;
    WU: number;
    exit: () => void;
    profile: profileHookType;
    timeFrame: timeFrameType;
}) {
    const [artists, setArtists] = useState<artistsType>([]);

    useEffect(() => {
        const allArtists = props.profile.profile.artists;
        if (allArtists !== undefined) {
            const newArtists = allArtists[props.timeFrame];
            if (newArtists !== false) {
                setArtists(newArtists);
            }
        }
    }, [props.profile.profile.artists, props.timeFrame]);

    return (
        <Flex
            flexDir={"column"}
            bg={"MidGrey"}
            px={`${props.WU * 0.05}px`}
            py={3}
            borderRadius={"10px"}
            w={`${props.WU * 9.5}px`}
            key={"ProfileOverlay"}
            alignItems={"center"}
        >
            <Flex
                flexDir={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                w={"100%"}
                px={`${props.WU * 0.1}px`}
                mb={3}
            >
                <Text
                    fontSize={{
                        base: `${props.WU * 0.6}px`,
                        md: `${props.WU * 0.2}px`,
                    }}
                >
                    Your Top Artists
                </Text>
                <ExitButton fn={props.exit} size={props.HU * 0.5} />
            </Flex>
            <Flex
                flexDir={"row"}
                wrap={"wrap"}
                w={`${props.WU * 9.4}px`}
                maxH={`${props.HU * 8}px`}
                overflowY={"scroll"}
                justifyContent={"space-around"}
            >
                {artists.slice(0, 20).map((artist, index) => (
                    <ArtistObject
                        artist={artist}
                        rating={index + 1}
                        key={artist.id}
                        WU={props.WU}
                    />
                ))}
            </Flex>
        </Flex>
    );
}

function ArtistObject(props: {
    artist: artistType;
    rating: number;
    WU: number;
}) {
    return (
        <Flex
            flexDir={"row"}
            bg={"whiteAlpha.200"}
            w={{ base: `${props.WU * 9.2}px`, md: `${props.WU * 4.5}px` }}
            borderRadius={{ base: "2px", md: "5px" }}
            px={{ base: `${props.WU * 0.15}px`, md: `${props.WU * 0.075}px` }}
            py={{ base: `${props.WU * 0.1}px`, md: `${props.WU * 0.05}px` }}
            my={{ base: `${props.WU * 0.075}px`, md: `${props.WU * 0.025}px` }}
            mx={`${props.WU * 0.05}px`}
            justifyContent={"space-between"}
        >
            <Flex>
                <Flex
                    overflow={"hidden"}
                    mr={`${props.WU * 0.1}px`}
                    w={{
                        base: `${
                            props.WU * 2 * props.artist.images[0].width
                        }px`,
                        md: `${
                            props.WU * 0.5 * props.artist.images[0].width
                        }px`,
                    }}
                    h={{
                        base: `${
                            props.WU * 2 * props.artist.images[0].height
                        }px`,
                        md: `${
                            props.WU * 0.5 * props.artist.images[0].height
                        }px`,
                    }}
                >
                    <Image
                        src={props.artist.images[0].url ?? "/unknown.png"}
                        alt={"Artist Image of " + props.artist.name}
                    />
                </Flex>
                <Flex
                    flexDir={"column"}
                    py={`${props.WU * 0.03}px`}
                    maxW={{
                        base: `${props.WU * 5}px`,
                        md: `${props.WU * 6}px`,
                    }}
                >
                    <Text
                        fontSize={{
                            base: `${props.WU * 0.4}px`,
                            md: `${props.WU * 0.15}px`,
                        }}
                    >
                        {props.rating}. {props.artist.name}
                    </Text>
                    <Text
                        color={"whiteAlpha.600"}
                        fontSize={{
                            base: `${props.WU * 0.3}px`,
                            md: `${props.WU * 0.1}px`,
                        }}
                    >
                        {getArtistGenres(props.artist)}
                    </Text>
                </Flex>
            </Flex>
            <Flex
                h={"full"}
                alignItems={"center"}
                w={`${Math.max(props.WU * 0.8, 70)}px`}
            >
                <Link
                    href={props.artist.external_urls.spotify}
                    _hover={{ transform: "scale(1.02)" }}
                    _active={{ transform: "scale(0.98)" }}
                    transition={"all 0.1s ease-in-out"}
                    isExternal
                >
                    <Flex
                        w={`${props.WU * 0.8}px`}
                        h={`${props.WU * 0.25}px`}
                        minW={"70px"}
                        minH={"21px"}
                        pos={"relative"}
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <Image
                            src={"/spotifyBranding/logos/white.png"}
                            className={"object-contain"}
                            alt={"Spotify Logo"}
                            boxSize={"full"}
                        />
                    </Flex>
                </Link>
            </Flex>
        </Flex>
    );
}
