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

    return (
        <Center
            w={`${props.info.dims.width}px`}
            h={`${props.info.dims.height}px`}
            bottom={`${props.info.pos.y}px`}
            left={`${props.info.pos.x}px`}
            borderRadius={"15px"}
            boxShadow={"#333 2px 4px 8px"}
            overflow={"hidden"}
            bg={"blackAlpha.600"}
            pos={"absolute"}
            _hover={{ bg: "blackAlpha.700" }}
            transition={"0.1s ease-in-out"}
        >
            <Flex
                flexDir={"column"}
                w={"100%"}
                h={"100%"}
                p={2}
                px={4}
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
