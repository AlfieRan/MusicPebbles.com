import { Box, Center, Link, Text } from "@chakra-ui/react";
import { UseProfile } from "../utils/hooks/useProfile";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Page = () => {
    const useProfile = UseProfile();
    const router = useRouter();

    useEffect(() => {
        if (useProfile.profile) {
            router.push("/dashboard").catch(console.error);
        }
    }, [useProfile]);

    return (
        <Box h={"100vh"} w={"100%"}>
            <Center h={"full"} w={"full"} flexDir={"column"}>
                <Text my={5}>Bubbles :)</Text>
                <Link
                    href={"/api/oauth/login"}
                    borderWidth={2}
                    borderRadius={"xl"}
                    fontWeight={"semibold"}
                    px={10}
                    py={1}
                    bg={"blue.600"}
                    _hover={{ bg: "blue.400", transform: "scale(1.03)" }}
                    _active={{ bg: "blue.700", transform: "scale(0.97)" }}
                >
                    Login using Spotify
                </Link>
            </Center>
        </Box>
    );
};

export default Page;
