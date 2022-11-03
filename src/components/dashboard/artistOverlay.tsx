import { Button, Flex, Link, Text } from "@chakra-ui/react";
import { useProfile } from "../../utils/hooks/useProfile";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { artistType } from "../../utils/types/spotify";

export function ArtistOverlay(props: {
    hidden: boolean;
    changeHidden: (artistInfo: artistType) => void;
    artistInfo: artistType;
}) {
    return (
        <AnimatePresence>
            {!props.hidden && (
                <motion.div
                    className={"absolute z-50 w-fit h-fit"}
                    exit={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <Flex
                        bg={"MidGrey"}
                        p={3}
                        minH={"250px"}
                        maxW={"400px"}
                        borderRadius={"lg"}
                        borderWidth={2}
                        flexDir={"column"}
                    >
                        <Flex flexDir={"column"}>
                            <Flex justifyContent={"space-between"} mb={1}>
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
                        </Flex>
                        <Flex flexDir={"column"}>
                            <Flex>
                                <Text
                                    fontSize={"sm"}
                                    hidden={
                                        props.artistInfo.ranking === undefined
                                    }
                                >
                                    This is your{" "}
                                    {parseRating(props.artistInfo.ranking ?? 1)}{" "}
                                    most listened to artist recently.
                                </Text>
                            </Flex>
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
                                            <Text key={genre} mr={1}>
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
                                    This artist has no available genres, either
                                    spotify has messed up or your taste is
                                    really niche!
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
                                    followers and have an overall spotify
                                    popularity of {props.artistInfo.popularity}
                                    /100.
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function parseRating(num: number): string {
    const lastDigit = num % 10;
    let ending = "th";

    if (lastDigit === 1) {
        ending = "st";
    } else if (lastDigit === 2) {
        ending = "nd";
    } else if (lastDigit === 3) {
        ending = "rd";
    }

    return num + ending;
}
