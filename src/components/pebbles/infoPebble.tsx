import { Flex, Text, Button, Grid, GridItem } from "@chakra-ui/react";
import { pebblePhysics } from "../../utils/types/pebbles";
import { setHoveringType } from "../../utils/types/state";
import { Dispatch, SetStateAction } from "react";
import { overlayStateType } from "../../utils/types/overlay";

export default function InfoPebble(props: {
    info: pebblePhysics;
    setHovering: setHoveringType;
    setOverlay: Dispatch<SetStateAction<overlayStateType>>;
}) {
    const HU = props.info.dims.height / 10;
    const WU = props.info.dims.width / 10;

    return (
        <Flex
            w={`${props.info.dims.width}px`}
            h={`${props.info.dims.height}px`}
            boxShadow={"#333 2px 4px 8px"}
            top={`${props.info.pos.y}px`}
            left={`${props.info.pos.x}px`}
            borderRadius={`${HU * 0.75}px`}
            overflow={"hidden"}
            bg={"blackAlpha.600"}
            pos={"absolute"}
            flexDir={"column"}
            transition={"0.1s ease-in-out"}
            justifyContent={"space-around"}
            alignItems={"center"}
            p={`${HU * 0.5}px`}
        >
            <Flex flexDir={"column"}>
                <Text
                    fontSize={`${HU * 0.85}px`}
                    textAlign={"center"}
                    fontWeight={"semibold"}
                >
                    MusicPebbles.com
                </Text>
            </Flex>
            <Grid autoRows={"1fr"}>
                <GridItem
                    rowSpan={1}
                    minH={`${HU * 0.6}px`}
                    py={`${WU * 0.1}px`}
                    key={"OpenShareButton"}
                >
                    <Button
                        bg={"blue.500"}
                        h={`${HU * 2}px`}
                        w={`${WU === HU ? HU * 7 : WU * 6}px`}
                        boxShadow={"#33c 0px 1px 8px"}
                        borderRadius={{ base: "5px", md: "15px" }}
                        _hover={{ transform: "scale(1.02)", bg: "blue.600" }}
                        _active={{
                            transform: "scale(0.98)",
                            bg: "blue.700",
                        }}
                        onClick={() => {
                            props.setOverlay({
                                hidden: false,
                                type: "share",
                            });
                        }}
                    >
                        <Flex
                            h={`${HU * 2.5}px`}
                            w={`${HU * 6}px`}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            <Text
                                fontSize={{
                                    base: `${HU * 0.8}px`,
                                    md: `${HU * 0.9}px`,
                                }}
                                textAlign={"center"}
                                fontWeight={"semibold"}
                            >
                                Share 📢
                            </Text>
                        </Flex>
                    </Button>
                </GridItem>
                <GridItem
                    rowSpan={1}
                    minH={`${HU * 0.6}px`}
                    py={`${WU * 0.1}px`}
                    key={"OpenSettingsButton"}
                >
                    <Button
                        bg={"red.500"}
                        h={`${HU * 2}px`}
                        w={`${WU === HU ? HU * 7 : WU * 6}px`}
                        boxShadow={"#c33 0px 1px 8px"}
                        borderRadius={{ base: "5px", md: "15px" }}
                        _hover={{ transform: "scale(1.02)", bg: "red.600" }}
                        _active={{
                            transform: "scale(0.98)",
                            bg: "red.700",
                        }}
                        onClick={() => {
                            props.setOverlay({
                                hidden: false,
                                type: "profile",
                            });
                        }}
                    >
                        <Flex
                            h={`${HU * 2.5}px`}
                            w={`${HU * 6}px`}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            <Text
                                fontSize={{
                                    base: `${HU * 0.8}px`,
                                    md: `${HU * 0.9}px`,
                                }}
                                textAlign={"center"}
                                fontWeight={"semibold"}
                            >
                                Settings ⚙️
                            </Text>
                        </Flex>
                    </Button>
                </GridItem>
            </Grid>
            <Flex flexDir={"column"} h={`${HU * 2}px`} textAlign={"center"}>
                <Text fontSize={{ base: `${HU * 0.9}px`, md: `${HU * 0.7}px` }}>
                    An Alfie Ranstead Project
                </Text>
                <Text
                    fontSize={{ base: `${HU * 0.65}px`, md: `${HU * 0.5}px` }}
                >
                    Not affiliated with Spotify
                </Text>
            </Flex>
        </Flex>
    );
}
