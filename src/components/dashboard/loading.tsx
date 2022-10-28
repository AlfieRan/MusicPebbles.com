import { Center, Text } from "@chakra-ui/react";

export function Loading() {
    return (
        <Center h={"full"} w={"full"} flexDir={"column"}>
            <Text>Loading...</Text>
            <Text fontSize={"sm"} maxW={"min(90vw, 600px)"}>
                We&apos;re just taking a minute to set you up.
            </Text>
        </Center>
    );
}
