import { Flex, Text } from "@chakra-ui/react";
import ExitButton from "./utils/exitButton";

export default function UniqueOverlay(props: {
    HU: number;
    WU: number;
    exit: () => void;
}) {
    return (
        <Flex
            flexDir={"column"}
            bg={"MidGrey"}
            px={4}
            py={3}
            borderRadius={"10px"}
            w={`${props.WU * 9.5}px`}
            key={"ProfileOverlay"}
        >
            <Flex
                flexDir={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                <Text fontSize={"xl"}>Uniqueness</Text>
                <ExitButton fn={props.exit} size={props.HU * 0.5} />
            </Flex>
        </Flex>
    );
}
