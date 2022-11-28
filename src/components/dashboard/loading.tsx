import { Center, Text } from "@chakra-ui/react";
import { useScreen } from "../../utils/hooks/useScreen";

export function Loading() {
    const screenHook = useScreen();
    return (
        <Center
            h={`${screenHook.height}px`}
            minH={"70vh"}
            w={"full"}
            flexDir={"column"}
        >
            <Text>Loading...</Text>
            <Text fontSize={"sm"} maxW={"min(90vw, 600px)"}>
                We&apos;re just taking a minute to set you up.
            </Text>
        </Center>
    );
}
