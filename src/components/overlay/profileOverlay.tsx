import { Button, Flex, Link, Text } from "@chakra-ui/react";
import { useProfile } from "../../utils/hooks/useProfile";
import { useRouter } from "next/router";
import { profileHookType } from "../../utils/types/oauth";

export default function ProfileOverlay(props: {
    HU: number;
    WU: number;
    profile: profileHookType;
}) {
    const router = useRouter();
    return (
        <Flex
            flexDir={"column"}
            bg={"MidGrey"}
            px={4}
            py={3}
            borderRadius={"10px"}
            w={{
                base: `${props.WU * 8}px`,
                md: "400px",
            }}
            key={"ProfileOverlay"}
        >
            <Text fontSize={"xl"}>
                Hi {props.profile.profile?.display_name || ""}!
            </Text>
            <Text fontSize={"md"}>What do you want to do?</Text>
            <Flex flexDir={"column"} mt={2}>
                <Link
                    my={1}
                    p={2}
                    bg={"whiteAlpha.200"}
                    borderRadius={"lg"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    fontSize={"md"}
                    boxShadow={"#333 1px 1px 6px"}
                    _hover={{ bg: "whiteAlpha.300", transform: "scale(1.02)" }}
                    _active={{ bg: "whiteAlpha.100", transform: "scale(0.98)" }}
                    href={"https://monzo.me/alfieranstead"}
                    isExternal
                >
                    <Text textAlign={"center"}>Donate 🔥</Text>
                </Link>
                <Link
                    my={1}
                    p={2}
                    bg={"whiteAlpha.200"}
                    borderRadius={"lg"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    fontSize={"md"}
                    boxShadow={"#333 1px 1px 6px"}
                    _hover={{ bg: "whiteAlpha.300", transform: "scale(1.02)" }}
                    _active={{ bg: "whiteAlpha.100", transform: "scale(0.98)" }}
                    href={"https://alfieranstead.com"}
                    isExternal
                >
                    <Text textAlign={"center"}>Contact the Dev 👋</Text>
                </Link>
                <Button
                    mt={1}
                    bg={"red.500"}
                    borderRadius={"lg"}
                    _hover={{ bg: "red.600", transform: "scale(1.02)" }}
                    _active={{ bg: "red.700", transform: "scale(0.98)" }}
                    onClick={() => {
                        fetch("/api/oauth/logout")
                            .then(() => {
                                router.push("/").catch(console.error);
                            })
                            .catch(console.error);
                    }}
                >
                    Log Out 🚪
                </Button>
            </Flex>
        </Flex>
    );
}
