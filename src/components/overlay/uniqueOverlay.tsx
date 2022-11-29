import {
    CircularProgress,
    CircularProgressLabel,
    Flex,
    Text,
} from "@chakra-ui/react";
import ExitButton from "./utils/exitButton";
import { useUniquenessType } from "../../utils/hooks/useUniqueness";
import { timeFrameType } from "../../utils/types/spotify";
import { profileHookType } from "../../utils/types/state";
import Image from "next/image";

export default function UniqueOverlay(props: {
    HU: number;
    WU: number;
    exit: () => void;
    uniqueness: useUniquenessType;
    timeFrame: timeFrameType;
    profile: profileHookType;
}) {
    return (
        <Flex
            flexDir={"column"}
            bg={"MidGrey"}
            px={{ base: `${props.WU * 0.2}px`, md: `${props.WU * 0.1}px` }}
            py={3}
            borderRadius={"10px"}
            w={`${props.WU * 9.5}px`}
            maxH={`${props.HU * 8}px`}
            overflowY={"scroll"}
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
                                value={
                                    props.uniqueness.uniqueness[props.timeFrame]
                                        .rating
                                }
                                color={
                                    props.uniqueness.uniqueness[props.timeFrame]
                                        .colour
                                }
                                trackColor={"whiteAlpha.400"}
                                size={"full"}
                                thickness={"8px"}
                            >
                                <CircularProgressLabel>
                                    {
                                        props.uniqueness.uniqueness[
                                            props.timeFrame
                                        ].rating
                                    }
                                </CircularProgressLabel>
                            </CircularProgress>
                        </Flex>
                        <Flex
                            width={{
                                base: `${props.WU * 6}px`,
                                md: `${props.WU * 4}px`,
                            }}
                            h={"full"}
                            justifyContent={"center"}
                            ml={`${props.WU * 0.1}px`}
                            flexDir={"column"}
                        >
                            <Text
                                fontSize={{
                                    base: `${props.WU * 0.4}px`,
                                    md: `${props.WU * 0.2}px`,
                                }}
                                fontWeight={"bold"}
                            >
                                {props.profile.profile.profile !== undefined
                                    ? props.profile.profile.profile
                                          .display_name + "'s"
                                    : "Your"}{" "}
                                Uniqueness Rating
                            </Text>
                            <Text
                                fontSize={{
                                    base: `${props.WU * 0.35}px`,
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
                            base: `${props.WU * 3}px`,
                            md: `${props.WU * 1.5}px`,
                        }}
                        height={{
                            base: `${props.WU * 3}px`,
                            md: `${props.WU * 1.5}px`,
                        }}
                        overflow={"hidden"}
                        borderRadius={{ base: "5px", md: "10px" }}
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
                            width={props.WU * 3}
                            height={props.WU * 3}
                        />
                    </Flex>
                </Flex>
                <Flex flexDir={"column"}></Flex>
            </Flex>
        </Flex>
    );
}
