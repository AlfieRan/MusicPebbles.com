import { audioPlayerType } from "../../utils/types/state";
import { Button, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";

export default function AudioControls(props: {
    audioPlayer: audioPlayerType;
    WU: number;
    HU: number;
}) {
    function redirectToSpotify() {
        window.open(
            props.audioPlayer.playing !== undefined
                ? props.audioPlayer.playing.external_urls.spotify
                : "https://open.spotify.com/",
            "_blank"
        );
    }

    return (
        <Flex
            flexDir={"row"}
            h={`${props.HU}px`}
            w={`${props.WU}px`}
            justifyContent={"space-between"}
            alignItems={"center"}
        >
            <Button
                bg={"blackAlpha.600"}
                _hover={{ bg: "blackAlpha.500", transform: "scale(1.05)" }}
                _active={{ bg: "blackAlpha.700", transform: "scale(0.95)" }}
                onClick={redirectToSpotify}
                fontSize={`${props.WU * 0.12}px`}
                w={`${props.WU * 0.31}px`}
                h={`${props.HU}px`}
                size={"0"}
                minW={0}
                minH={0}
            >
                <Flex w={"75%"} h={"75%"} pos={"relative"}>
                    <Image
                        src={"/spotifyBranding/icons/white.png"}
                        className={"object-contain"}
                        alt={"Spotify Logo"}
                        fill
                    />
                </Flex>
            </Button>
            <Button
                bg={"blackAlpha.600"}
                _hover={{ bg: "blackAlpha.500", transform: "scale(1.05)" }}
                _active={{ bg: "blackAlpha.700", transform: "scale(0.95)" }}
                onClick={props.audioPlayer.playPause}
                fontSize={`${props.WU * 0.15}px`}
                w={`${props.WU * 0.31}px`}
                h={`${props.HU}px`}
                size={"0"}
                minW={0}
                minH={0}
            >
                <Text>{props.audioPlayer.paused ? "▶︎" : "⏸︎"}</Text>
            </Button>
            <Button
                bg={"blackAlpha.600"}
                _hover={{ bg: "blackAlpha.500", transform: "scale(1.05)" }}
                _active={{ bg: "blackAlpha.700", transform: "scale(0.95)" }}
                onClick={props.audioPlayer.nextSong}
                fontSize={`${props.WU * 0.12}px`}
                w={`${props.WU * 0.31}px`}
                h={`${props.HU}px`}
                size={"0"}
                minW={0}
                minH={0}
            >
                <Text>{"⏭︎"}</Text>
            </Button>
        </Flex>
    );
}
