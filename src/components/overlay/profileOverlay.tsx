import { Button, Flex, Link, Text, Grid, GridItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { profileHookType } from "../../utils/types/state";
import { useEffect, useState } from "react";
import ExitButton from "./utils/exitButton";

export default function ProfileOverlay(props: {
    HU: number;
    WU: number;
    profile: profileHookType;
    exit: () => void;
}) {
    const [sizes, setSizes] = useState({
        WU: props.WU,
        HU: props.HU,
    });

    useEffect(() => {
        if (props.WU > 60) {
            setSizes({
                WU: 60,
                HU: 60,
            });
        }
    }, [props.WU]);

    const router = useRouter();
    return (
        <Flex
            flexDir={"column"}
            bg={"MidGrey"}
            px={`${sizes.WU * 0.4}px`}
            py={`${sizes.WU * 0.25}px`}
            borderRadius={"10px"}
            w={`${sizes.WU * 9}px`}
            key={"ProfileOverlay"}
        >
            <Flex
                w={`${sizes.WU * 8.2}px`}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Flex flexDir={"column"} w={`${sizes.WU * 6}px`}>
                    <Text fontSize={`${sizes.WU * 0.6}px`}>
                        Hi{" "}
                        {props.profile.profile?.profile?.display_name ||
                            "Loading..."}
                        !
                    </Text>
                    <Text fontSize={`${sizes.WU * 0.4}px`}>
                        What do you want to do?
                    </Text>
                </Flex>
                <ExitButton
                    fn={props.exit}
                    size={Math.min(sizes.WU, sizes.HU)}
                />
            </Flex>
            <Flex
                flexDir={"column"}
                my={2}
                fontSize={`${sizes.WU * 0.45}px`}
                w={`${sizes.WU * 8.2}px`}
            >
                <Grid autoRows={"1fr"}>
                    <GridItem
                        rowSpan={1}
                        minH={`${sizes.HU * 0.6}px`}
                        py={`${sizes.WU * 0.1}px`}
                    >
                        <Link
                            my={2}
                            h={"100%"}
                            w={"100%"}
                            display={"flex"}
                            bg={"whiteAlpha.200"}
                            borderRadius={"lg"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            boxShadow={"#333 1px 1px 6px"}
                            _hover={{
                                bg: "whiteAlpha.300",
                                transform: "scale(1.02)",
                            }}
                            _active={{
                                bg: "whiteAlpha.100",
                                transform: "scale(0.98)",
                            }}
                            href={"https://www.buymeacoffee.com/alfieranstead"}
                            isExternal
                        >
                            <Text textAlign={"center"}>Donate 🔥</Text>
                        </Link>
                    </GridItem>
                    <GridItem rowSpan={1} py={`${sizes.WU * 0.1}px`}>
                        <Link
                            my={2}
                            h={"100%"}
                            w={"100%"}
                            display={"flex"}
                            bg={"whiteAlpha.200"}
                            borderRadius={"lg"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            boxShadow={"#333 1px 1px 6px"}
                            _hover={{
                                bg: "whiteAlpha.300",
                                transform: "scale(1.02)",
                            }}
                            _active={{
                                bg: "whiteAlpha.100",
                                transform: "scale(0.98)",
                            }}
                            href={"https://alfieranstead.com"}
                            isExternal
                        >
                            <Text textAlign={"center"}>Contact the Dev 👋</Text>
                        </Link>
                    </GridItem>
                    <GridItem rowSpan={1} py={`${sizes.WU * 0.1}px`}>
                        <Button
                            my={2}
                            p={0}
                            fontSize={`${sizes.WU * 0.45}px`}
                            fontWeight={"normal"}
                            h={"100%"}
                            w={"100%"}
                            bg={"whiteAlpha.200"}
                            borderRadius={"lg"}
                            _hover={{
                                bg: "whiteAlpha.300",
                                transform: "scale(1.02)",
                            }}
                            _active={{
                                bg: "whiteAlpha.100",
                                transform: "scale(0.98)",
                            }}
                            onClick={() => {
                                localStorage.clear();
                                router.reload();
                            }}
                        >
                            <Text h={"fit-content"}>Reset Storage 🔄</Text>
                        </Button>
                    </GridItem>
                    <GridItem rowSpan={1} py={`${sizes.WU * 0.1}px`}>
                        <Button
                            my={2}
                            p={0}
                            fontSize={`${sizes.WU * 0.45}px`}
                            h={"100%"}
                            w={"100%"}
                            bg={"red.500"}
                            borderRadius={"lg"}
                            _hover={{ bg: "red.600", transform: "scale(1.02)" }}
                            _active={{
                                bg: "red.700",
                                transform: "scale(0.98)",
                            }}
                            onClick={() => {
                                fetch("/api/oauth/logout")
                                    .then(() => {
                                        router.push("/").catch(console.error);
                                    })
                                    .catch(console.error);
                            }}
                        >
                            <Text h={"fit-content"}>Log Out 🚪</Text>
                        </Button>
                    </GridItem>
                </Grid>
            </Flex>
        </Flex>
    );
}
