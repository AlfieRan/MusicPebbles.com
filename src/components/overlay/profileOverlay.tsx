import { Button, Flex, Text } from "@chakra-ui/react";
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
            px={`${props.WU * 0.1}px`}
            py={4}
            borderRadius={"10px"}
            maxW={`${props.WU * 4}px`}
            maxH={`${props.HU * 4}px`}
            minW={`${props.WU * 2.5}px`}
            key={"ProfileOverlay"}
        >
            <Text>Hi {props.profile.profile?.display_name || ""}!</Text>
            <Text fontSize={"md"}>What do you want to do?</Text>
            <Flex flexDir={"column"}>
                <Button
                    mt={2}
                    bg={"red.500"}
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
                    Log Out
                </Button>
            </Flex>
        </Flex>
    );
}
