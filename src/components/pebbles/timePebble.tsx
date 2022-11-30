import { Button, Center, Text, Flex } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import { setHoveringType } from "../../utils/types/state";
import { timeFrameType } from "../../utils/types/spotify";
import { Dispatch, SetStateAction } from "react";

export default function TimePebble(props: {
    info: pebblePhysics;
    setHovering: setHoveringType;
    setTime: Dispatch<SetStateAction<timeFrameType>>;
    time: timeFrameType;
}) {
    const timeOptions: timeFrameType[] = [
        "short_term",
        "medium_term",
        "long_term",
    ];

    const WU = props.info.dims.width / 10; // Width Unit
    const HU = props.info.dims.height / 10; // Height Unit

    return (
        <Center
            w={`${WU * 10}px`}
            h={`${HU * 10}px`}
            top={`${props.info.pos.y}px`}
            left={`${props.info.pos.x}px`}
            borderRadius={`${HU * 0.75}px`}
            boxShadow={"#333 2px 4px 8px"}
            overflow={"hidden"}
            bg={"blackAlpha.600"}
            pos={"absolute"}
            transition={"0.1s ease-in-out"}
        >
            <Flex
                flexDir={"column"}
                w={"100%"}
                h={"100%"}
                py={`${HU * 0.5}px`}
                px={`${HU * 1}px`}
                justifyContent={"center"}
            >
                {timeOptions.map((timeOption) => (
                    <Button
                        key={timeOption + " button"}
                        my={1}
                        bg={props.time === timeOption ? "MidBlue" : "MidGrey"}
                        _hover={{ bg: "MidDarkBlue" }}
                        _active={{ bg: "DarkBlue" }}
                        onClick={() => props.setTime(timeOption)}
                        fontSize={`${WU * 0.9}`}
                        borderRadius={`${HU * 0.5}px`}
                    >
                        <Text>{wrapTimeString(timeOption)}</Text>
                    </Button>
                ))}
            </Flex>
        </Center>
    );
}

function wrapTimeString(time: timeFrameType) {
    return time === "short_term"
        ? "Last 4 Weeks"
        : time === "medium_term"
        ? "Last 6 Months"
        : "All Time";
}
