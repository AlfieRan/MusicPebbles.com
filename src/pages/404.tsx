import { Center, Flex, Link, Text } from "@chakra-ui/react";

export default function NotFound() {
    return (
        <Center h={"100vh"} w={"100vw"}>
            <Flex flexDir={"column"} alignItems={"center"}>
                <Flex flexDir={"column"} textAlign={"center"}>
                    <Text fontSize={{ base: "xl", md: "3xl" }}>404 Error</Text>
                    <Text fontSize={{ base: "sm", md: "md" }}>
                        The page you were looking for does not exist.
                    </Text>
                </Flex>
                <Link
                    href={"/"}
                    mt={"20px"}
                    bg={"blackAlpha.400"}
                    py={"5px"}
                    px={"15px"}
                    borderRadius={"5px"}
                    _hover={{ bg: "blackAlpha.500", transform: "scale(1.02)" }}
                    _active={{ bg: "blackAlpha.600", transform: "scale(0.98)" }}
                >
                    Go Home?
                </Link>
            </Flex>
        </Center>
    );
}
