import { Center, Flex, Link, Text } from "@chakra-ui/react";
import { useProfile } from "../utils/hooks/useProfile";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Page = () => {
    const profile = useProfile();
    const router = useRouter();

    useEffect(() => {
        if (profile.profile) {
            router.push("/dashboard").catch(console.error);
        }
    }, [profile]);

    return (
        <Flex
            h={"100%"}
            w={"100%"}
            flexDir={"column"}
            justifyContent={"space-between"}
        >
            <Flex
                w={"full"}
                h={"55%"}
                flexDir={"column"}
                alignSelf={"center"}
                alignItems={"center"}
                justifyContent={"flex-end"}
            >
                <Flex
                    flexDir={"column"}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                    textAlign={"center"}
                    bg={"blackAlpha.400"}
                    px={8}
                    py={5}
                    borderRadius={"20px"}
                >
                    <Text fontSize={"3xl"} fontWeight={"semibold"}>
                        Welcome to Pebbles
                    </Text>
                    <Text fontSize={"md"}>
                        The Spotify dashboard that&apos;s actually useful.
                    </Text>
                    <Text
                        fontSize={"sm"}
                        maxW={"800px"}
                        textAlign={"center"}
                        color={"red.300"}
                        mt={2}
                        hidden={true}
                    >
                        Pebbles is currently in developer-only mode, to use it
                        you must be whitelisted. Please email{" "}
                        <Link href={"mailto:hi@alfieranstead.com"}>
                            hi@alfieranstead.com
                        </Link>{" "}
                        to request access.
                    </Text>
                    <Link
                        href={"/api/oauth/login"}
                        borderRadius={"xl"}
                        boxShadow={"#333 2px 4px 8px"}
                        fontWeight={"semibold"}
                        px={10}
                        py={1}
                        mt={2}
                        mb={1}
                        bg={"blue.600"}
                        w={"fit-content"}
                        _hover={{ bg: "blue.500", transform: "scale(1.03)" }}
                        _active={{ bg: "blue.700", transform: "scale(0.97)" }}
                    >
                        Login with Spotify
                    </Link>
                    <Text fontSize={"sm"} color={"whiteAlpha.600"}>
                        Pebbles is not affiliated with Spotify
                    </Text>
                </Flex>
            </Flex>
            <Flex
                justifySelf={"flex-end"}
                w={"100%"}
                h={"10%"}
                flexDir={"column"}
                textAlign={"center"}
                justifyContent={"center"}
            >
                <Link href={"https://alfieranstead.com/"} isExternal>
                    An Alfie Ranstead Project
                </Link>
            </Flex>
        </Flex>
    );
};

export default Page;
