import { Flex, Text } from "@chakra-ui/react";
import ExitButton from "./utils/exitButton";
import { profileHookType } from "../../utils/types/state";
import { useEffect, useState } from "react";
import { artistsType, timeFrameType } from "../../utils/types/spotify";

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
            px={4}
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
                mb={3}
            >
                <Text fontSize={"xl"}>Your Top Artists</Text>
                <ExitButton fn={props.exit} size={props.HU * 0.5} />
            </Flex>
            <Flex
                flexDir={{ base: "column", md: "row" }}
                w={`${props.WU * 9}px`}
                maxH={`${props.HU * 8}px`}
                overflowY={"scroll"}
            >
                <Flex flexDir={"column"} px={`${props.WU * 0.1}px`}>
                    {artists.slice(0, 10).map((artist, index) => (
                        <ArtistObject
                            artist={artist}
                            rating={index + 1}
                            key={artist.id}
                            WU={props.WU}
                        />
                    ))}
                </Flex>
                <Flex flexDir={"column"} px={`${props.WU * 0.1}px`}>
                    {artists.slice(10, 20).map((artist, index) => (
                        <ArtistObject
                            artist={artist}
                            rating={index + 11}
                            key={artist.id}
                            WU={props.WU}
                        />
                    ))}
                </Flex>
            </Flex>
        </Flex>
    );
}

function ArtistObject(props: {
    artist: artistsType[0];
    rating: number;
    key: string;
    WU: number;
}) {
    return (
        <Flex
            flexDir={"row"}
            key={props.key}
            bg={"whiteAlpha.200"}
            w={{ base: `${props.WU * 8.5}px`, md: `${props.WU * 4.3}px` }}
            borderRadius={{ base: "5px", md: "10px" }}
            px={`${props.WU * 0.1}px`}
            py={`${props.WU * 0.05}px`}
            my={`${props.WU * 0.02}px`}
        >
            <Text>
                {props.rating}. {props.artist.name}
            </Text>
        </Flex>
    );
}
