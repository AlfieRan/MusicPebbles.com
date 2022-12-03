import { Image, Flex, Link, Text } from "@chakra-ui/react";
import { useProfile } from "../utils/hooks/useProfile";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useScreen } from "../utils/hooks/useScreen";

const Page = () => {
    const profile = useProfile();
    const router = useRouter();
    const screenHook = useScreen();
    const [loginLoaded, setLoginLoaded] = useState(false);

    useEffect(() => {
        if (profile.profile.profile) {
            console.log("Redirecting to dashboard, profile: ", profile);
            router.push("/dashboard").catch(console.error);
        } else if (!profile.loading) {
            setLoginLoaded(true);
        }
    }, [profile]);

    return (
        <Flex
            h={`${screenHook.height}px`}
            minH={"70vh"}
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
                        Pebbles
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
                        borderRadius={"10px"}
                        boxShadow={"#333 2px 4px 8px"}
                        px={4}
                        py={2}
                        mt={4}
                        mb={2}
                        bg={"green.500"}
                        color={"white"}
                        w={"100%"}
                        maxH={"60px"}
                        minH={"40px"}
                        _hover={{
                            bg: "green.600",
                            transform: "scale(1.01)",
                        }}
                        _active={{ bg: "green.700", transform: "scale(0.99)" }}
                    >
                        {loginLoaded ? (
                            <Flex
                                flexDir={"row"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                fontWeight={"semibold"}
                            >
                                <Text
                                    w={"60%"}
                                    mr={{ base: "5px", md: 0 }}
                                    fontSize={{ base: "xl", md: "lg" }}
                                >
                                    Login with Spotify
                                </Text>
                                <Flex
                                    maxW={"20%"}
                                    minW={"10%"}
                                    h={"40px"}
                                    w={"40px"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    pos={"relative"}
                                    objectFit={"contain"}
                                >
                                    <Image
                                        src={"/spotifyBranding/icons/white.png"}
                                        alt={"Spotify Logo"}
                                    />
                                </Flex>
                            </Flex>
                        ) : (
                            <Flex
                                flexDir={"row"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                fontWeight={"semibold"}
                            >
                                <Text
                                    w={"60%"}
                                    mr={{ base: "5px", md: 0 }}
                                    fontSize={{ base: "xl", md: "lg" }}
                                >
                                    Loading...
                                </Text>
                            </Flex>
                        )}
                    </Link>
                    <Text fontSize={"xs"} color={"whiteAlpha.600"}>
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
