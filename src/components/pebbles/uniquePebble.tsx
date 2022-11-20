import { Flex, Text } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import { profileHookType, setHoveringType } from "../../utils/types/state";
import { useUniqueness } from "../../utils/hooks/useUniqueness";
import Image from "next/image";
import {
    artistApiResponseType,
    timeFrameType,
} from "../../utils/types/spotify";
import { Dispatch, SetStateAction, useEffect } from "react";
import { overlayStateType } from "../../utils/types/overlay";

export default function UniquePebble(props: {
    info: pebblePhysics;
    setHovering: setHoveringType;
    time: timeFrameType;
    profile: profileHookType;
    setOverlay: Dispatch<SetStateAction<overlayStateType>>;
}) {
    const uniqueness = useUniqueness();

    const HU = props.info.dims.height / 10; // Height Unit
    const WU = props.info.dims.width / 10; // Width Unit

    useEffect(() => {
        if (props.profile.profile.artists !== undefined) {
            uniqueness.setArtists(props.profile.profile.artists);
        }
    }, [props.profile.profile.artists]);

    function openUniqueOverlay() {
        props.setOverlay({
            hidden: false,
            type: "unique",
        });
        console.log("open song overlay");
    }

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
            py={`${HU * 0.5}px`}
            px={`${WU * 0.5}px`}
            flexDir={"column"}
            cursor={"pointer"}
            _hover={{ bg: "blackAlpha.700", transform: "scale(1.01)" }}
            transition={"0.1s ease-in-out"}
            onMouseOver={() => {
                props.setHovering({
                    hovering: true,
                    type: "text",
                    text: "Uniqueness",
                    x: "left",
                    y: "bottom",
                });
            }}
            onMouseOut={() => {
                props.setHovering({ hovering: false });
            }}
            onClick={openUniqueOverlay}
        >
            <Text
                h={`${HU * 1.2}px`}
                w={`${WU * 9}px`}
                fontSize={`${HU * 1.2}px`}
                fontWeight={"bold"}
                color={"white"}
                textAlign={"center"}
                mb={2}
            >
                Your Uniqueness
            </Text>
            {!uniqueness.loading[props.time] ? (
                <Flex
                    flexDir={"row"}
                    alignItems={"center"}
                    h={`${HU * 6.5}px`}
                    w={`${WU * 9}px`}
                >
                    <Flex
                        h={`${HU * 6.5}px`}
                        py={`${HU * 0.25}px`}
                        alignItems={"center"}
                    >
                        <Flex
                            flexDir={"row"}
                            w={`${WU * 2.5}px`}
                            h={`${WU * 2.55}px`}
                            borderRadius={"full"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            borderColor={
                                uniqueness.uniqueness[props.time].colour
                            }
                            borderWidth={`${WU * 0.1}px`}
                        >
                            <Flex justifyContent={"center"} flexDir={"column"}>
                                <Text textAlign={"center"} fontSize={`${WU}px`}>
                                    {uniqueness.uniqueness[
                                        props.time
                                    ].rating.toString()}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex
                        ml={`${WU * 0.5}px`}
                        w={`${WU * 6}px`}
                        h={`${HU * 2}px`}
                        flexDir={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <Flex flexDir={"row"} justifyContent={"space-evenly"}>
                            {uniqueness.uniqueness[props.time].artists
                                .slice(0, 3)
                                .map((artist, index) => (
                                    <Flex
                                        h={`${HU * 4}px`}
                                        w={`${WU * 2}px`}
                                        px={`${WU * 0.1}px`}
                                        py={`${HU * 0.1}px`}
                                        key={
                                            artist.artist.name +
                                            "uniquePreview" +
                                            Math.random()
                                        }
                                        flexDir={"column"}
                                    >
                                        <Image
                                            src={artist.artist.images[0].url}
                                            alt={artist.artist.name}
                                            width={
                                                artist.artist.images[0].width *
                                                WU *
                                                1.8
                                            }
                                            height={
                                                artist.artist.images[0].height *
                                                HU *
                                                3.6
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
            <Text
                h={`${HU * 0.65}px`}
                w={`${WU * 9}px`}
                fontSize={`${HU * 0.65}px`}
                fontWeight={"semibold"}
                color={"whiteAlpha.500"}
                textAlign={"center"}
                mb={2}
            >
                Click for more info
            </Text>
        </Flex>
    );
}
