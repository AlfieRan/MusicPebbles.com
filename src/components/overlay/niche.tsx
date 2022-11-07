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
            maxW={"600px"}
            boxShadow={"#555 0px 0px 15px"}
            px={5}
            py={4}
        >
            <Flex flexDir={"row"} justifyContent={"space-between"} mb={2}>
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
                    textAlign={"center"}
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
                <Flex justifyContent={"space-between"} mb={1}>
                    <Text>Most Niche Artists</Text>
                    <Text>Niche Rating</Text>
                </Flex>
                {uniqueness.artists.slice(0, 5).map((artist, index) => (
                    <Flex
                        key={artist.artist.id}
                        bg={
                            index % 2 === 0
                                ? "blackAlpha.400"
                                : "blackAlpha.100"
                        }
                        borderRadius={"md"}
                        mb={index !== 4 ? 1.5 : 0}
                        mt={index !== 0 ? 1.5 : 0}
                        justifyContent={"space-between"}
                    >
                        <Flex h={"full"}>
                            <Flex
                                width={"75px"}
                                height={"75px"}
                                borderLeftRadius={"md"}
                                overflow={"hidden"}
                            >
                                <Image
                                    src={artist.artist.images[0].url}
                                    alt={"image of" + artist.artist.name}
                                    width={75}
                                    height={75}
                                />
                            </Flex>
                            <Flex
                                flexDir={"column"}
                                alignSelf={"center"}
                                borderRightRadius={"md"}
                            >
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
