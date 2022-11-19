import { Flex, Text } from "@chakra-ui/react";

export default function ArtistOverlay(props: { HU: number; WU: number }) {
    return (
        <Flex
            flexDir={"column"}
            bg={"MidGrey"}
            px={4}
            py={3}
            borderRadius={"10px"}
            w={`${props.WU * 8}px`}
            key={"ProfileOverlay"}
        >
            <Text fontSize={"xl"}>Hi, this is not implemented yet!</Text>
        </Flex>
    );
}
