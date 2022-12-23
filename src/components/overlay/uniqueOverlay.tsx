import {
    CircularProgress,
    CircularProgressLabel,
    Flex,
    Link,
    Text,
    Image,
} from "@chakra-ui/react";
import ExitButton from "./utils/exitButton";
import { useUniquenessType } from "../../utils/hooks/useUniqueness";
import { timeFrameType } from "../../utils/types/spotify";
import { profileHookType } from "../../utils/types/state";
import { useEffect, useState } from "react";
import { sleep } from "../../utils/other/time";
import { fadeBetween } from "../../utils/other/Colours";
import { parseRating } from "../../utils/other/basics";

const timeQuadraticAdjustment = 2; // must be between 0 and 2
const timeQuadraticAdjustment2 = (1 - timeQuadraticAdjustment) / 100;

export default function UniqueOverlay(props: {
    HU: number;
    WU: number;
    exit: () => void;
    uniqueness: useUniquenessType;
    timeFrame: timeFrameType;
    profile: profileHookType;
}) {
    const [ratingNum, setRatingNum] = useState<number>(0);

    function calcSleepTime(a: number, b: number) {
        // inversed normalised difference
        const dif = Math.abs(a - b);
        const alteredDif =
            dif * timeQuadraticAdjustment + dif ** 2 * timeQuadraticAdjustment2;
        return 1 - alteredDif / 100;
    }

    async function changeRating(target: number, time: number) {
        let continueLoop = true;
        let sleepTime = 0;
        while (continueLoop) {
            setRatingNum((prev) => {
                sleepTime = calcSleepTime(prev, target) * time;
                if (prev < target) {
                    return prev + 1;
                } else if (prev > target) {
                    return prev - 1;
                } else {
                    continueLoop = false;
                    return prev;
                }
            });
            await sleep(sleepTime);
        }
    }

    function shortString(str: string, limit: number = 30) {
        if (str.length > limit) {
            return str.substring(0, limit) + "...";
        }
        return str;
    }

    useEffect(() => {
        sleep(250).then(() => {
            const newRating =
                props.uniqueness.uniqueness[props.timeFrame].rating;
            changeRating(newRating, 150).catch(console.error);
        });
    }, [props.uniqueness.uniqueness]);

    return (
        <Flex
            flexDir={"column"}
            bg={"MidGrey"}
            px={{ base: `${props.WU * 0.2}px`, md: `${props.WU * 0.1}px` }}
            py={3}
            borderRadius={"10px"}
            w={`${props.WU * 9.5}px`}
            maxH={`${props.HU * 8}px`}
            overflowY={"hidden"}
            key={"ProfileOverlay"}
        >
            <Flex
                flexDir={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                <Text fontSize={"xl"}>Uniqueness</Text>
                <ExitButton fn={props.exit} size={props.HU * 0.5} />
            </Flex>
            <Flex
                flexDir={"column"}
                alignItems={"center"}
                w={{ base: `${props.WU * 9.1}px`, md: `${props.WU * 9.3}px` }}
                mt={2}
                p={{ base: `${props.WU * 0.2}px`, md: `${props.WU * 0.1}px` }}
                borderRadius={{ base: "5px", md: "10px" }}
                bg={"whiteAlpha.300"}
                overflowY={"scroll"}
                overflowX={"hidden"}
            >
                <Flex
                    flexDir={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    w={{ base: `${props.WU * 8.8}px`, md: `${props.WU * 9}px` }}
                >
                    <Flex alignItems={"center"}>
                        <Flex
                            width={{
                                base: `${props.WU * 3}px`,
                                md: `${props.WU * 1.5}px`,
                            }}
                            height={{
                                base: `${props.WU * 3}px`,
                                md: `${props.WU * 1.5}px`,
                            }}
                            fontSize={{
                                base: `${props.WU * 4}px`,
                                md: `${props.WU * 2}px`,
                            }}
                        >
                            <CircularProgress
                                value={ratingNum}
                                color={
                                    props.uniqueness.uniqueness[props.timeFrame]
                                        .colour
                                }
                                trackColor={"whiteAlpha.400"}
                                size={"full"}
                                thickness={"8px"}
                                transition={"all 0.01s ease-in-out"}
                            >
                                <CircularProgressLabel>
                                    {ratingNum}
                                </CircularProgressLabel>
                            </CircularProgress>
                        </Flex>
                        <Flex
                            width={{
                                base: `${props.WU * 5.8}px`,
                                md: `${props.WU * 4}px`,
                            }}
                            h={"full"}
                            justifyContent={"center"}
                            ml={`${props.WU * 0.1}px`}
                            flexDir={"column"}
                        >
                            <Flex
                                flexDir={{ base: "column", md: "row" }}
                                fontSize={{
                                    base: `${props.WU * 0.45}px`,
                                    md: `${props.WU * 0.2}px`,
                                }}
                                fontWeight={"bold"}
                            >
                                <Text mr={`${props.WU * 0.05}px`}>
                                    {props.profile.profile.profile !== undefined
                                        ? props.profile.profile.profile
                                              .display_name + "'s"
                                        : "Your"}{" "}
                                </Text>
                                <Text>Uniqueness Rating</Text>
                            </Flex>
                            <Text
                                fontSize={{
                                    base: `${props.WU * 0.36}px`,
                                    md: `${props.WU * 0.15}px`,
                                }}
                                fontWeight={"semibold"}
                                color={"whiteAlpha.800"}
                            >
                                {
                                    props.uniqueness.uniqueness[props.timeFrame]
                                        .details
                                }
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex
                        width={{
                            base: `${0}px`,
                            md: `${props.WU * 1.5}px`,
                        }}
                        height={{
                            base: `${0}px`,
                            md: `${props.WU * 1.5}px`,
                        }}
                        overflow={"hidden"}
                        borderRadius={{ base: "5px", md: "10px" }}
                        bg={"whiteAlpha.400"}
                    >
                        <Image
                            src={
                                props.profile.profile?.profile?.image_url ??
                                "/unknown.png"
                            }
                            alt={
                                "Profile picture of " +
                                props.profile.profile?.profile?.display_name
                            }
                        />
                    </Flex>
                </Flex>
                <Flex
                    flexDir={"row"}
                    wrap={"wrap"}
                    justifyContent={"center"}
                    w={{
                        base: `${props.WU * 9.1}px`,
                        md: `${props.WU * 9.3}px`,
                    }}
                    p={{
                        base: `${props.WU * 0.2}px`,
                        md: `${props.WU * 0.1}px`,
                    }}
                >
                    {props.uniqueness.uniqueness[props.timeFrame].artists
                        .slice(0, 10)
                        .map((artist, index) => (
                            <Flex
                                key={"UniquenessOverlay" + artist.artist.id}
                                bg={"blackAlpha.500"}
                                borderRadius={{ base: "2px", md: "5px" }}
                                p={{ base: "1px", md: "2.5px" }}
                                m={{
                                    base: `${props.WU * 0.1}px`,
                                    md: `${props.WU * 0.03}px`,
                                }}
                                pos={"relative"}
                                overflow={"hidden"}
                                flexDir={"row"}
                            >
                                <Flex
                                    pos={"absolute"}
                                    p={{
                                        base: `${props.WU * 0.15}px`,
                                        md: `${props.WU * 0.05}px`,
                                    }}
                                >
                                    <Link
                                        href={
                                            artist.artist.external_urls.spotify
                                        }
                                        _hover={{
                                            transform: "scale(1.1)",
                                        }}
                                        _active={{
                                            transform: "scale(0.9)",
                                        }}
                                        h={{
                                            base: `${props.WU * 0.6}px`,
                                            md: `${props.WU * 0.15}px`,
                                        }}
                                        w={{
                                            base: `${props.WU * 0.6}px`,
                                            md: `${props.WU * 0.15}px`,
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
                                <Flex
                                    flexDir={"row"}
                                    justifyContent={"space-between"}
                                    w={"full"}
                                >
                                    <Flex
                                        h={"full"}
                                        minW={{
                                            base: `${props.WU * 6}px`,
                                            md: `${props.WU * 1.5}px`,
                                        }}
                                        maxW={{
                                            base: `${props.WU * 6}px`,
                                            md: `${props.WU * 2}px`,
                                        }}
                                        flexDir={"column"}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        pl={{
                                            base: `${props.WU * 0.5}px`,
                                            md: `${props.WU * 0.25}px`,
                                        }}
                                        pr={{
                                            base: `${props.WU * 0.2}px`,
                                            md: `${props.WU * 0.1}px`,
                                        }}
                                        py={{
                                            base: `${props.WU * 0.1}px`,
                                            md: `${props.WU * 0.05}px`,
                                        }}
                                    >
                                        <Text
                                            fontSize={{
                                                base: `${props.WU * 0.4}px`,
                                                md: `${props.WU * 0.13}px`,
                                            }}
                                            maxW={{
                                                base: `${props.WU * 4.5}px`,
                                                md: `${props.WU * 11}px`,
                                            }}
                                            fontWeight={"semibold"}
                                            textAlign={"center"}
                                        >
                                            {shortString(
                                                artist.artist.name,
                                                25
                                            )}
                                        </Text>
                                        <Text
                                            color={fadeBetween(
                                                "#ff0000",
                                                "#11ff00",
                                                100,
                                                artist.uniqueness
                                            )}
                                            fontSize={{
                                                base: `${props.WU * 0.33}px`,
                                                md: `${props.WU * 0.12}px`,
                                            }}
                                        >
                                            {artist.uniqueness.toFixed(2)}%
                                            Niche
                                        </Text>
                                        <Text
                                            fontSize={{
                                                base: `${props.WU * 0.35}px`,
                                                md: `${props.WU * 0.13}px`,
                                            }}
                                        >
                                            {parseRating(artist.userRating)}{" "}
                                            Most Listened
                                        </Text>
                                    </Flex>
                                    <Flex
                                        flexDir={"column"}
                                        justifyContent={"center"}
                                        ml={`${props.WU * 0.1}px`}
                                        w={{
                                            base: `${props.WU * 2.5}px`,
                                            md: `${props.WU}px`,
                                        }}
                                        h={{
                                            base: `${props.WU * 2.5}px`,
                                            md: `${props.WU}px`,
                                        }}
                                        bg={"blackAlpha.500"}
                                    >
                                        <Image
                                            src={
                                                artist.artist.images.length > 0
                                                    ? artist.artist.images[0]
                                                          .url
                                                    : "/unknown.png"
                                            }
                                            alt={artist.artist.name}
                                        />
                                    </Flex>
                                </Flex>
                            </Flex>
                        ))}
                </Flex>
            </Flex>
        </Flex>
    );
}
