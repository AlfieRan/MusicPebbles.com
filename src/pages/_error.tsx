import { Center, Flex, Link, Text } from "@chakra-ui/react";

export default function Error(error: any) {
    return (
        <Center w={"100vw"} h={"100vh"}>
            <Flex flexDir={"column"} alignItems={"center"}>
                <Flex flexDir={"column"} textAlign={"center"}>
                    <Text fontSize={{ base: "xl", md: "3xl" }}>
                        Something Unexpected Happened
                    </Text>
                    <Text fontSize={{ base: "sm", md: "md" }}>
                        The error code is {error.statusCode ?? 500}.
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
