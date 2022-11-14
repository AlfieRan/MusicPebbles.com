import { audioPlayerType } from "../../utils/types/state";
import { Button, Flex, Text } from "@chakra-ui/react";

export default function AudioControls(props: {
    audioPlayer: audioPlayerType;
    WU: number;
    HU: number;
}) {
    return (
        <Flex
            flexDir={"row"}
            mx={`${props.WU}px`}
            maxH={`${props.HU * 2}px`}
            maxW={`${props.WU * 3}px`}
            justifyContent={"center"}
            alignItems={"center"}
            fontSize={`${props.WU * 0.75}px`}
        >
            <Button
                bg={"blackAlpha.600"}
                _hover={{ bg: "blackAlpha.500", transform: "scale(1.05)" }}
                _active={{ bg: "blackAlpha.700", transform: "scale(0.95)" }}
                onClick={props.audioPlayer.prevSong}
                px={`${props.WU * 0.5}px`}
                py={0}
            >
                <Text>{"⏮︎"}</Text>
            </Button>
            <Button
                bg={"blackAlpha.600"}
                _hover={{ bg: "blackAlpha.500", transform: "scale(1.05)" }}
                _active={{ bg: "blackAlpha.700", transform: "scale(0.95)" }}
                mx={1}
                onClick={props.audioPlayer.playPause}
                px={`${props.WU * 0.5}px`}
                py={0}
            >
                <Text>{props.audioPlayer.paused ? "▶︎" : "⏸︎"}</Text>
            </Button>
            <Button
                bg={"blackAlpha.600"}
                _hover={{ bg: "blackAlpha.500", transform: "scale(1.05)" }}
                _active={{ bg: "blackAlpha.700", transform: "scale(0.95)" }}
                onClick={props.audioPlayer.nextSong}
                px={`${props.WU * 0.5}px`}
                py={0}
            >
                <Text>{"⏭︎"}</Text>
            </Button>
        </Flex>
    );
}
