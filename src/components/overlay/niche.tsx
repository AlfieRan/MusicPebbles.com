import { useUniqueness } from "../../utils/hooks/useUniqueness";
import { Button, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { parseRating } from "../../utils/basics";

export function NicheOverlay(props: { changeHidden: () => void }) {
    const uniqueness = useUniqueness();
    return (
        <Flex
            overflow={"hidden"}
            zIndex={10}
            key={"nicheOverlay"}
            bg={"MidGrey"}
            flexDir={"column"}
            borderRadius={"lg"}
            borderWidth={2}
            maxW={"600px"}
            px={3}
            py={2}
        >
            <Flex flexDir={"row"} justifyContent={"space-between"} my={2}>
                <Text
                    textAlign={"start"}
                    verticalAlign={"bottom"}
                    fontSize={"2xl"}
                    mr={5}
                >
                    Uniqueness: {uniqueness.rating}/100
                </Text>
                <Button
                    scale={0.9}
                    bg={"blackAlpha.400"}
                    _hover={{
                        bg: "blackAlpha.600",
                        transform: "scale(1.05)",
                    }}
                    _active={{
                        bg: "blackAlpha.800",
                        transform: "scale(0.95)",
                    }}
                    transition={"all 0.15s ease-in-out"}
                    onClick={props.changeHidden}
                >
                    X
                </Button>
            </Flex>
            <Flex flexDir={"column"} fontSize={"md"}>
                <Text>{uniqueness.details}</Text>
            </Flex>
            <Flex
                mt={5}
                mb={1}
                flexDir={"column"}
                fontSize={"xl"}
                fontWeight={"semibold"}
            >
                <Flex justifyContent={"space-between"}>
                    <Text>Most Niche Artists</Text>
                    <Text>Niche Rating</Text>
                </Flex>
                {uniqueness.artists.slice(0, 5).map((artist, index) => (
                    <Flex
                        key={artist.artist.id}
                        borderWidth={1}
                        borderTopRadius={index === 0 ? "md" : ""}
                        borderBottomRadius={index === 4 ? "md" : ""}
                        justifyContent={"space-between"}
                    >
                        <Flex h={"full"}>
                            <Flex
                                width={"75px"}
                                height={"75px"}
                                borderTopLeftRadius={index === 0 ? "md" : ""}
                                borderBottomLeftRadius={index === 4 ? "md" : ""}
                                overflow={"hidden"}
                            >
                                <Image
                                    src={artist.artist.images[0].url}
                                    alt={"image of" + artist.artist.name}
                                    width={75}
                                    height={75}
                                />
                            </Flex>
                            <Flex flexDir={"column"} alignSelf={"center"}>
                                <Text
                                    mx={2}
                                    fontWeight={"semibold"}
                                    fontSize={"lg"}
                                >
                                    {artist.artist.name}
                                </Text>
                                <Text mx={2} fontSize={"sm"}>
                                    Your {parseRating(artist.userRating)} Artist
                                </Text>
                            </Flex>
                        </Flex>
                        <Text mx={2} alignSelf={"center"}>
                            {Math.floor(artist.uniqueness)}/100
                        </Text>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    );
}
