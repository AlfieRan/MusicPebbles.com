import { Flex, Text } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import Image from "next/image";
import { setHoveringType } from "../../utils/types/state";

export default function InfoPebble(props: { info: pebblePhysics }) {
    const HU = props.info.dims.height / 10;
    const WU = props.info.dims.width / 10;
    return (
        <Flex
            w={`${props.info.dims.width}px`}
            h={`${props.info.dims.height}px`}
            boxShadow={"#333 2px 4px 8px"}
            top={`${props.info.pos.y}px`}
            left={`${props.info.pos.x}px`}
            borderRadius={"15px"}
            overflow={"hidden"}
            bg={"blackAlpha.600"}
            pos={"absolute"}
            flexDir={"column"}
            transition={"0.1s ease-in-out"}
            justifyContent={"space-between"}
            alignItems={"center"}
            p={`${HU * 0.5}px`}
        >
            <Text fontSize={`${HU}px`}>
                Click on a pebble to learn more about it!
            </Text>
            <Flex
                flexDir={"row"}
                bg={"MidGrey"}
                h={`${HU * 4}px`}
                p={`${HU * 0.5}px`}
                borderRadius={{ base: "5px", md: "15px" }}
            >
                <Flex
                    maxW={`${WU * 5}px`}
                    h={"100%"}
                    alignItems={"center"}
                    pr={`${WU * 0.2}px`}
                >
                    <Text fontSize={`${HU * 0.75}px`}>
                        Click on any Spotify logo to open Spotify.
                    </Text>
                </Flex>
                <Flex
                    w={{ base: `${WU * 2}px`, md: `${WU * 1.5}px` }}
                    pos={"relative"}
                    _hover={{ transform: "scale(1.05)" }}
                    _active={{ transform: "scale(0.95)" }}
                    transition={"0.1s ease-in-out"}
                    cursor={"pointer"}
                    onClick={() => {
                        window.open("https://open.spotify.com/", "_blank");
                    }}
                >
                    <Image
                        src={"/spotifyBranding/icons/white.png"}
                        className={"object-contain"}
                        alt={"Spotify Logo"}
                        fill
                    />
                </Flex>
            </Flex>
            <Flex flexDir={"column"} h={`${HU * 2}px`} textAlign={"center"}>
                <Text fontSize={`${HU * 0.7}px`}>
                    An Alfie Ranstead Project
                </Text>
                <Text fontSize={`${HU * 0.5}px`}>
                    Not affiliated with Spotify
                </Text>
            </Flex>
        </Flex>
    );
}
