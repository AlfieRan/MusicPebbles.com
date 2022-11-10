import { artistType } from "../../utils/types/spotify";
import { Button, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { parseRating } from "../../utils/other/basics";

export function ArtistOverlay(props: {
    artistInfo: artistType;
    changeHidden: (artistInfo: artistType) => void;
}) {
    return (
        <Flex
            bg={"MidGrey"}
            borderRadius={"lg"}
            boxShadow={"#555 0px 0px 15px"}
            flexDir={{ base: "column", lg: "row" }}
            overflow={"hidden"}
            key={props.artistInfo.id + "overlay"}
        >
            <Flex
                overflow={"hidden"}
                zIndex={10}
                maxW={"400px"}
                maxH={"400px"}
                p={3}
            >
                <Image
                    src={props.artistInfo.images[0].url}
                    alt={props.artistInfo.name}
                    width={props.artistInfo.images[0].width * 400}
                    height={props.artistInfo.images[0].height * 400}
                    className={"shadow-outline"}
                />
            </Flex>
            <Flex flexDir={"column"} maxW={"400px"} maxH={"400px"}>
                <Flex flexDir={"column"} zIndex={20} mx={3}>
                    <Flex justifyContent={"space-between"} my={2}>
                        <Text
                            textAlign={"start"}
                            verticalAlign={"bottom"}
                            fontSize={"2xl"}
                            mr={5}
                        >
                            {props.artistInfo.name}
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
                            onClick={() => {
                                props.changeHidden(props.artistInfo);
                            }}
                        >
                            X
                        </Button>
                    </Flex>
                    <Flex>
                        <Text
                            fontSize={"sm"}
                            hidden={props.artistInfo.ranking === undefined}
                        >
                            This is your{" "}
                            {parseRating(props.artistInfo.ranking ?? 1)} most
                            listened to artist recently.
                        </Text>
                    </Flex>
                </Flex>
                <Flex flexDir={"column"} zIndex={20} mx={3} my={2}>
                    <Flex
                        flexDir={"column"}
                        hidden={props.artistInfo.genres.length === 0}
                        my={2}
                    >
                        <Text fontSize={"lg"}>Genres</Text>
                        <Flex
                            flexDir={"row"}
                            wrap={"wrap"}
                            fontSize={"sm"}
                            opacity={0.7}
                        >
                            {props.artistInfo.genres
                                .slice(
                                    0,
                                    props.artistInfo.genres.length > 3
                                        ? 3
                                        : props.artistInfo.genres.length
                                )
                                .map((genre) => (
                                    <Text key={genre + Math.random()} mr={1}>
                                        {genre};
                                    </Text>
                                ))}
                        </Flex>
                    </Flex>
                    <Flex
                        flexDir={"column"}
                        hidden={props.artistInfo.genres.length !== 0}
                        my={2}
                    >
                        <Text fontSize={"sm"}>
                            This artist has no available genres, either spotify
                            has messed up or your taste is really niche!
                        </Text>
                    </Flex>
                    <Flex
                        flexDir={"column"}
                        hidden={props.artistInfo.followers.total === 0}
                        my={2}
                    >
                        <Flex
                            flexDir={"row"}
                            wrap={"wrap"}
                            fontSize={"sm"}
                            opacity={0.7}
                        >
                            They have{" "}
                            {props.artistInfo.followers.total.toLocaleString()}{" "}
                            followers and have an overall spotify popularity of{" "}
                            {props.artistInfo.popularity}
                            /100.
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}
