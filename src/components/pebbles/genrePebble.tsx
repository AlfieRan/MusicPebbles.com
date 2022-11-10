import { Center, Text } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";

export default function GenrePebble(props: pebblePhysics) {
    return (
        <Center
            w={`${props.dims.width}px`}
            h={`${props.dims.height}px`}
            boxShadow={"#333 2px 4px 8px"}
            bottom={`${props.pos.y}px`}
            left={`${props.pos.x}px`}
            borderRadius={"15px"}
            overflow={"hidden"}
            bg={"MidGrey"}
            pos={"absolute"}
        >
            <Text>Genre and Mood</Text>
        </Center>
    );
}
