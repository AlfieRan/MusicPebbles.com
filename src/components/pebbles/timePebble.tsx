import { Center, Text } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";

export default function TimePebble(props: pebblePhysics) {
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
            <Text>Time Period</Text>
        </Center>
    );
}
