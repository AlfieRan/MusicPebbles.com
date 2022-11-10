import { Center, Text } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import { setHoveringType } from "../../utils/types/state";

export default function GenrePebble(props: {
    info: pebblePhysics;
    setHovering: setHoveringType;
}) {
    return (
        <Center
            w={`${props.info.dims.width}px`}
            h={`${props.info.dims.height}px`}
            boxShadow={"#333 2px 4px 8px"}
            bottom={`${props.info.pos.y}px`}
            left={`${props.info.pos.x}px`}
            borderRadius={"15px"}
            overflow={"hidden"}
            bg={"blackAlpha.600"}
            pos={"absolute"}
            _hover={{ bg: "blackAlpha.700", transform: "scale(1.01)" }}
            transition={"0.1s ease-in-out"}
            onMouseOver={() => {
                props.setHovering({
                    hovering: true,
                    type: "text",
                    text: "Genres",
                });
            }}
            onMouseOut={() => {
                props.setHovering({ hovering: false });
            }}
        >
            <Text>Genre and Mood</Text>
        </Center>
    );
}
