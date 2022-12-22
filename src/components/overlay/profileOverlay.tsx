import { Button, Flex, Link, Text, Grid, GridItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { profileHookType } from "../../utils/types/state";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ExitButton from "./utils/exitButton";
import {
    overlayStateType,
    profileOverlayButtonType,
} from "../../utils/types/overlay";

export default function ProfileOverlay(props: {
    HU: number;
    WU: number;
    profile: profileHookType;
    setOverlay: Dispatch<SetStateAction<overlayStateType>>;
    exit: () => void;
}) {
    const [sizes, setSizes] = useState({
        WU: props.WU,
        HU: props.HU,
    });

    const buttons: profileOverlayButtonType[] = [
        {
            type: "link",
            text: "Donate 🔥",
            href: "https://www.buymeacoffee.com/alfieranstead",
            color: "blue-highlight",
        },
        {
            type: "link",
            text: "Contact 💬",
            href: "https://alfieranstead.com",
            color: "blue-highlight",
        },
        {
            type: "button",
            text: "Reset Storage 🔄",
            color: "red-highlight",
            onClick: () => {
                localStorage.clear();
                router.reload();
            },
        },
        {
            type: "button",
            text: "Report Bug ⚠️",
            color: "red-highlight",
            onClick: () => {
                props.setOverlay({
                    hidden: false,
                    type: "bug",
                });
            },
        },
        {
            type: "button",
            text: "Logout 🚪",
            color: "red",
            onClick: () => {
                fetch("/api/oauth/logout")
                    .then(() => {
                        router.push("/").catch(console.error);
                    })
                    .catch(console.error);
            },
        },
    ];

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
                    {buttons.map((button, i) => {
                        const bg =
                            button.color === "blue-highlight"
                                ? {
                                      main: "blackAlpha.100",
                                      hover: "blue.800",
                                      active: "blue.900",
                                  }
                                : button.color === "red-highlight"
                                ? {
                                      main: "blackAlpha.100",
                                      hover: "red.800",
                                      active: "red.900",
                                  }
                                : {
                                      main: "red.500",
                                      hover: "red.600",
                                      active: "red.700",
                                  };

                        return (
                            <GridItem
                                rowSpan={1}
                                minH={`${sizes.HU * 0.6}px`}
                                py={`${sizes.WU * 0.1}px`}
                                key={"profileOverlayButton" + i}
                            >
                                <Link
                                    hidden={button.type === "button"}
                                    my={2}
                                    h={"100%"}
                                    w={"100%"}
                                    display={"flex"}
                                    bg={bg.main}
                                    borderRadius={"lg"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    boxShadow={"#444 0.5px 0.5px 3px"}
                                    _hover={{
                                        bg: bg.hover,
                                        transform: "scale(1.02)",
                                    }}
                                    _active={{
                                        bg: bg.active,
                                        transform: "scale(0.98)",
                                    }}
                                    href={
                                        button.type === "link"
                                            ? button.href
                                            : "https://alfieranstead.com"
                                    }
                                    isExternal
                                >
                                    <Text textAlign={"center"}>
                                        {button.text}
                                    </Text>
                                </Link>
                                <Button
                                    hidden={button.type === "link"}
                                    my={2}
                                    p={0}
                                    fontSize={`${sizes.WU * 0.45}px`}
                                    boxShadow={"#444 0.5px 0.5px 3px"}
                                    fontWeight={"normal"}
                                    h={"100%"}
                                    w={"100%"}
                                    bg={bg.main}
                                    borderRadius={"lg"}
                                    _hover={{
                                        bg: bg.hover,
                                        transform: "scale(1.02)",
                                    }}
                                    _active={{
                                        bg: bg.active,
                                        transform: "scale(0.98)",
                                    }}
                                    onClick={
                                        button.type === "button"
                                            ? button.onClick
                                            : () => {
                                                  console.error(
                                                      "Button with no function clicked."
                                                  );
                                              }
                                    }
                                >
                                    <Text h={"fit-content"}>{button.text}</Text>
                                </Button>
                            </GridItem>
                        );
                    })}
                </Grid>
            </Flex>
        </Flex>
    );
}
