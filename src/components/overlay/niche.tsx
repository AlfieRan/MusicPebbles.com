import { useUniqueness } from "../../utils/hooks/useUniqueness";
import { Button, Flex, Text } from "@chakra-ui/react";

export function NicheOverlay(props: { changeHidden: () => void }) {
    const uniqueness = useUniqueness();
    return (
        <Flex
            overflow={"hidden"}
            zIndex={10}
            key={"nicheOverlay"}
            bg={"MidGrey"}
            flexDir={"column"}
            borderRadius={"lg"}
            borderWidth={2}
            maxW={"600px"}
            px={3}
            py={2}
        >
            <Flex flexDir={"row"} justifyContent={"space-between"} my={2}>
                <Text
                    textAlign={"start"}
                    verticalAlign={"bottom"}
                    fontSize={"2xl"}
                    mr={5}
                >
                    Uniqueness: {uniqueness.rating}/100
                </Text>
                <Button
                    scale={0.9}
                    bg={"blackAlpha.400"}
                    _hover={{
                        bg: "blackAlpha.600",
                        transform: "scale(1.05)",
                    }}
                    _active={{
                        bg: "blackAlpha.800",
                        transform: "scale(0.95)",
                    }}
                    transition={"all 0.15s ease-in-out"}
                    onClick={props.changeHidden}
                >
                    X
                </Button>
            </Flex>
            <Flex flexDir={"column"} fontSize={"md"}>
                <Text>{uniqueness.details}</Text>
            </Flex>
            {/*TODO: change this to show top 5 artists */}
            <Flex mt={3}>Balls</Flex>
        </Flex>
    );
}
