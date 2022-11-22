import { Button, Text } from "@chakra-ui/react";

export default function ExitButton(props: { fn: () => void; size: number }) {
    return (
        <Button
            w={`${props.size}px`}
            h={`${props.size}px`}
            minH={0}
            minW={0}
            onClick={props.fn}
            bg={"red.500"}
            _hover={{ bg: "red.600", transform: "scale(1.05)" }}
            _active={{ bg: "red.700", transform: "scale(0.95)" }}
        >
            <Text fontSize={`${props.size * 0.75}px`}>X</Text>
        </Button>
    );
}
