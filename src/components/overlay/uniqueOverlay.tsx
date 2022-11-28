import {
    CircularProgress,
    CircularProgressLabel,
    Flex,
    Text,
} from "@chakra-ui/react";
import ExitButton from "./utils/exitButton";
import { useUniquenessType } from "../../utils/hooks/useUniqueness";
import { timeFrameType } from "../../utils/types/spotify";

export default function UniqueOverlay(props: {
    HU: number;
    WU: number;
    exit: () => void;
    uniqueness: useUniquenessType;
    timeFrame: timeFrameType;
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
                flexDir={{ base: "column", md: "row" }}
                w={{ base: `${props.WU * 9.1}px`, md: `${props.WU * 9.3}px` }}
                mt={2}
                p={{ base: `${props.WU * 0.2}px`, md: `${props.WU * 0.1}px` }}
                borderRadius={{ base: "5px", md: "10px" }}
                bg={"whiteAlpha.300"}
            >
                <Flex flexDir={"row"}>
                    <Flex
                        width={{
                            base: `${props.WU * 3}px`,
                            md: `${props.WU * 2}px`,
                        }}
                        height={{
                            base: `${props.WU * 3}px`,
                            md: `${props.WU * 2}px`,
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
                                    props.uniqueness.uniqueness[props.timeFrame]
                                        .rating
                                }
                            </CircularProgressLabel>
                        </CircularProgress>
                    </Flex>
                    <Flex
                        width={{
                            base: `${props.WU * 6}px`,
                            md: `${props.WU * 2.5}px`,
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
                            Your Uniqueness Rating
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
                <Flex></Flex>
            </Flex>
        </Flex>
    );
}
