import { Center, Flex, Text } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import { useArtists } from "../../utils/hooks/useArtists";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ArtistPebble(props: pebblePhysics) {
    const artists = useArtists();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (artists.length > 4) {
            setLoaded(true);
        }
    }, [artists]);

    const HU = props.dims.height / 6 - 20; // Height Unit
    const WU = props.dims.width / 6 - 20; // Width Unit

    return (
        <Center
            w={`${props.dims.width}px`}
            h={`${props.dims.height}px`}
            bottom={`${props.pos.y}px`}
            left={`${props.pos.x}px`}
            borderRadius={"15px"}
            boxShadow={"#333 2px 4px 8px"}
            overflow={"hidden"}
            bg={"MidGrey"}
            pos={"absolute"}
        >
            {loaded ? (
                <Flex flexDir={"column"}>
                    <Flex flexDir={"row"} m={"10px"}>
                        <Flex
                            h={"fit-content"}
                            borderRadius={"10px"}
                            overflow={"hidden"}
                        >
                            <Image
                                src={artists[0].images[0].url}
                                alt={"Artist Image"}
                                width={artists[0].images[0].width * WU * 2}
                                height={artists[0].images[0].height * HU * 2}
                            />
                        </Flex>
                        <Flex
                            ml={3}
                            flexDir={"column"}
                            h={2 * HU}
                            maxW={4 * WU}
                            pb={2}
                            justifyContent={"center"}
                            overflow={"hidden"}
                        >
                            <Text fontSize={"md"}>1. {artists[0].name}</Text>
                            <Text fontSize={"sm"} color={"whiteAlpha.500"}>
                                {artists[0].genres.slice(0, 4).join(", ")}...
                            </Text>
                        </Flex>
                    </Flex>
                    {artists.slice(1, 5).map((artist, index) => (
                        <Flex key={index} flexDir={"row"} m={"10px"} h={HU}>
                            <Flex
                                h={"fit-content"}
                                borderRadius={"10px"}
                                overflow={"hidden"}
                            >
                                <Image
                                    src={artist.images[0].url}
                                    alt={"Artist Image"}
                                    width={artist.images[0].width * WU}
                                    height={artist.images[0].height * HU}
                                />
                            </Flex>
                            <Flex
                                ml={3}
                                flexDir={"column"}
                                maxW={"60%"}
                                h={HU}
                                justifyContent={"center"}
                                overflow={"hidden"}
                            >
                                <Text fontSize={"sm"}>
                                    {index + 2}. {artist.name}
                                </Text>

                                <Text fontSize={"xs"} color={"whiteAlpha.500"}>
                                    {artist.genres.slice(0, 4).join(", ")}...
                                </Text>
                            </Flex>
                        </Flex>
                    ))}
                    <Center
                        pos={"absolute"}
                        bottom={0}
                        right={2}
                        fontSize={"3xl"}
                        cursor={"pointer"}
                    >
                        <Text>ⓘ</Text>
                    </Center>
                </Flex>
            ) : (
                <Center w={"100%"} h={"100%"}>
                    Loading your artists...
                </Center>
            )}
        </Center>
    );
}
