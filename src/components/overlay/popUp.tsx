import { Button, Flex, Link, Text } from "@chakra-ui/react";
import ExitButton from "./utils/exitButton";
import Image from "next/image";

export default function PopUp(props: {
    HU: number;
    WU: number;
    exit: () => void;
}) {
    return (
        <Flex
            flexDir={"column"}
            bg={"MidGrey"}
            px={`${props.WU * 0.3}px`}
            py={3}
            borderRadius={"10px"}
            key={"PopUpOverlay"}
        >
            <Flex
                flexDir={"column"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Flex flexDir={"column"}>
                    <Text
                        fontSize={{
                            base: `${props.WU * 0.45}px`,
                            md: `${props.WU * 0.22}px`,
                        }}
                        textAlign={"center"}
                    >
                        Pebbles is an{" "}
                        <Link
                            href={"https://www.alfieranstead.com/"}
                            color={"blue.200"}
                        >
                            {" "}
                            Alfie Ranstead
                        </Link>{" "}
                        Project.
                    </Text>
                    <Flex
                        flexDir={"row"}
                        my={4}
                        alignItems={"center"}
                        justifyContent={"center"}
                        bg={"whiteAlpha.200"}
                        py={2}
                        px={3}
                        borderRadius={{ base: "7px", md: "15px" }}
                    >
                        <Text
                            fontSize={{
                                base: `${props.WU * 0.3}px`,
                                md: `${props.WU * 0.14}px`,
                            }}
                            mr={2}
                            maxW={{
                                base: `${props.WU * 6.5}px`,
                                md: `${props.WU * 3}px`,
                            }}
                        >
                            It is built to work with Spotify and as such you can
                            travel to Spotify using any Spotify icon or logo as
                            displayed on the right.
                        </Text>
                        <Link
                            href={"https://open.spotify.com/"}
                            color={"blue.200"}
                            _hover={{ transform: "scale(1.05)" }}
                            _active={{ transform: "scale(0.95)" }}
                            isExternal
                        >
                            <Flex
                                w={{
                                    base: `${props.WU * 2}px`,
                                    md: `${props.WU * 0.5}px`,
                                }}
                                h={{
                                    base: `${props.WU * 2}px`,
                                    md: `${props.WU * 0.5}px`,
                                }}
                                justifyContent={"center"}
                                alignItems={"center"}
                            >
                                <Flex>
                                    <Image
                                        src={"/spotifyBranding/icons/white.png"}
                                        alt={"Spotify Icon"}
                                        width={props.WU}
                                        height={props.WU}
                                    />
                                </Flex>
                            </Flex>
                        </Link>
                    </Flex>
                    <Text
                        fontSize={{
                            base: `${props.WU * 0.35}px`,
                            md: `${props.WU * 0.12}px`,
                        }}
                        textAlign={"center"}
                        color={"red.400"}
                    >
                        Pebbles is currently in Beta, please be patient with
                        bugs/errors.
                    </Text>
                </Flex>
                <Flex
                    w={"full"}
                    justifyContent={"center"}
                    mt={`${props.HU * 0.25}px`}
                    mb={`${props.HU * 0.1}px`}
                >
                    <Button
                        w={`${{
                            base: `${props.WU * 3}px`,
                            md: `${props.WU * 2}px`,
                        }}px`}
                        fontSize={`${{
                            base: `${props.WU * 0.5}px`,
                            md: `${props.WU * 0.2}px`,
                        }}`}
                        bg={"blue.500"}
                        _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                        _active={{ bg: "blue.700", transform: "scale(0.95)" }}
                        onClick={props.exit}
                    >
                        Confirm
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
}
