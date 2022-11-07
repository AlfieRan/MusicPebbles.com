import { Button, Flex, Link, Text } from "@chakra-ui/react";
import { useProfile } from "../../utils/hooks/useProfile";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import BlurredBackground from "./blurredBackground";

export function Settings(props: {
    hidden: boolean;
    changeHidden: (value?: boolean) => void;
}) {
    const profile = useProfile();
    const router = useRouter();

    async function logout() {
        await fetch("/api/oauth/logout", {
            method: "POST",
        });
        router.push("/").catch((err) => console.error(err));
    }

    function resetTutorial() {
        localStorage.setItem("skipTutorial", "false");
        router.reload();
    }

    return (
        <AnimatePresence>
            <BlurredBackground
                hidden={props.hidden}
                hide={props.changeHidden}
            />
            {!props.hidden && (
                <motion.div
                    key={"settingsMain"}
                    className={"absolute z-30 w-fit h-fit"}
                    exit={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <Flex
                        bg={"MidGrey"}
                        p={3}
                        minH={"250px"}
                        maxW={"500px"}
                        borderRadius={"lg"}
                        borderWidth={2}
                        flexDir={"column"}
                        justifyContent={"space-between"}
                    >
                        <Flex flexDir={"column"}>
                            <Flex justifyContent={"space-between"} mb={1}>
                                <Text>Settings</Text>
                                <Button
                                    scale={0.9}
                                    bg={"blackAlpha.400"}
                                    _hover={{
                                        bg: "blackAlpha.600",
                                        transform: "scale(1.05)",
                                    }}
                                    _active={{
                                        bg: "blackAlpha.800",
                                        transform: "scale(0.95)",
                                    }}
                                    transition={"all 0.15s ease-in-out"}
                                    onClick={() => {
                                        props.changeHidden();
                                    }}
                                >
                                    X
                                </Button>
                            </Flex>
                        </Flex>
                        <Flex flexDir={"column"}>
                            <Flex>
                                <Text fontSize={"sm"} mt={1}>
                                    You&apos;re currently logged in as{" "}
                                </Text>
                                <Text
                                    fontSize={"sm"}
                                    mt={1}
                                    ml={1}
                                    fontWeight={"bold"}
                                >
                                    {profile.profile?.display_name}
                                </Text>
                            </Flex>
                            <Link
                                fontSize={"sm"}
                                borderWidth={2}
                                borderRadius={"md"}
                                textAlign={"center"}
                                fontWeight={"semibold"}
                                py={2}
                                mt={2}
                                bg={""}
                                _hover={{
                                    transform: "scale(1.02)",
                                }}
                                _active={{
                                    transform: "scale(0.98)",
                                }}
                                href={
                                    "https://github.com/sponsors/AlfieRan?o=esb"
                                }
                                isExternal
                            >
                                Donate 🥳
                            </Link>
                            <Button
                                fontSize={"sm"}
                                borderWidth={2}
                                mt={2}
                                bg={""}
                                _hover={{
                                    transform: "scale(1.02)",
                                }}
                                _active={{
                                    transform: "scale(0.98)",
                                }}
                                onClick={resetTutorial}
                            >
                                Reset Tutorial 🔄
                            </Button>{" "}
                            <Button
                                mt={2}
                                py={1}
                                fontSize={"sm"}
                                bg={"red.500"}
                                _hover={{
                                    bg: "red.600",
                                    transform: "scale(1.02)",
                                }}
                                _active={{
                                    bg: "red.700",
                                    transform: "scale(0.98)",
                                }}
                                onClick={logout}
                            >
                                Log out 👋
                            </Button>
                        </Flex>
                        <Text fontSize={"sm"} mb={1} opacity={0.7}>
                            This site was made by{" "}
                            <Link
                                href={"https://www.alfieranstead.com/"}
                                isExternal
                            >
                                {" "}
                                Alfie Ranstead.{" "}
                            </Link>
                        </Text>
                    </Flex>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
