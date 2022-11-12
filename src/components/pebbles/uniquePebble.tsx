import { Center, Flex, Text } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import { setHoveringType } from "../../utils/types/state";
import { useUniqueness } from "../../utils/hooks/useUniqueness";
import Image from "next/image";
import { timeFrameType } from "../../utils/types/spotify";

export default function UniquePebble(props: {
    info: pebblePhysics;
    setHovering: setHoveringType;
    time: timeFrameType;
}) {
    const [uniqueness, loading] = useUniqueness();

    return (
        <Flex
            w={`${props.info.dims.width}px`}
            h={`${props.info.dims.height}px`}
            bottom={`${props.info.pos.y}px`}
            left={`${props.info.pos.x}px`}
            borderRadius={"15px"}
            boxShadow={"#333 2px 4px 8px"}
            overflow={"hidden"}
            bg={"blackAlpha.600"}
            pos={"absolute"}
            py={3}
            px={5}
            _hover={{ bg: "blackAlpha.700", transform: "scale(1.01)" }}
            transition={"0.1s ease-in-out"}
            onMouseOver={() => {
                props.setHovering({
                    hovering: true,
                    type: "text",
                    text: "Uniqueness",
                });
            }}
            onMouseOut={() => {
                props.setHovering({ hovering: false });
            }}
        >
            {!loading[props.time] ? (
                <Flex flexDir={"row"} alignItems={"center"}>
                    <Flex
                        flexDir={"row"}
                        w={`${props.info.dims.width * 0.27}px`}
                        h={`${props.info.dims.width * 0.27}px`}
                        borderRadius={"full"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        borderColor={uniqueness[props.time].colour}
                        borderWidth={"5px"}
                    >
                        <Flex justifyContent={"center"} flexDir={"column"}>
                            <Text
                                textAlign={"center"}
                                h={"fit-content"}
                                fontSize={"5xl"}
                                mb={1}
                            >
                                {uniqueness[props.time].rating.toString()}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex w={"65%"} ml={5} flexDir={"column"}>
                        <Text
                            fontSize={"2xl"}
                            fontWeight={"bold"}
                            color={"white"}
                            textAlign={"center"}
                            mb={2}
                        >
                            Uniqueness
                        </Text>
                        <Flex pb={5}>
                            {uniqueness[props.time].artists
                                .slice(0, 3)
                                .map((artist, index) => (
                                    <Flex
                                        mx={2}
                                        key={
                                            artist.artist.name +
                                            "uniquePreview" +
                                            Math.random()
                                        }
                                    >
                                        <Image
                                            src={artist.artist.images[0].url}
                                            alt={artist.artist.name}
                                            width={
                                                artist.artist.images[0].width *
                                                100
                                            }
                                            height={
                                                artist.artist.images[0].height *
                                                100
                                            }
                                        />
                                    </Flex>
                                ))}
                        </Flex>
                    </Flex>
                </Flex>
            ) : (
                <Text>Loading...</Text>
            )}
        </Flex>
    );
}
