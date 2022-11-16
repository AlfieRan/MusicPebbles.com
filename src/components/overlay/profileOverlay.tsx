import { Button, Flex, Text } from "@chakra-ui/react";
import { useProfile } from "../../utils/hooks/useProfile";

export default function ProfileOverlay(props: { HU: number; WU: number }) {
    const profile = useProfile();
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
            <Text>Hi {profile.profile?.display_name || ""}!</Text>
            <Text fontSize={"md"}>What do you want to do?</Text>
            <Flex flexDir={"column"}>
                <Button
                    bg={"red.500"}
                    _hover={{ bg: "red.600", transform: "scale(1.02)" }}
                    _active={{ bg: "red.700", transform: "scale(0.98)" }}
                >
                    Log Out
                </Button>
            </Flex>
        </Flex>
    );
}
