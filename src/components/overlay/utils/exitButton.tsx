import { Button } from "@chakra-ui/react";

export default function ExitButton(props: { fn: () => void; size: number }) {
    return (
        <Button
            w={`${props.size}px`}
            h={`${props.size}px`}
            minH={"10px"}
            minW={"10px"}
            p={`${props.size * 0.2}px`}
            onClick={props.fn}
            bg={"red.500"}
            _hover={{ bg: "red.600", transform: "scale(1.05)" }}
            _active={{ bg: "red.700", transform: "scale(0.95)" }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                width={`${props.size * 0.6}`}
                height={`${props.size * 0.6}`}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </Button>
    );
}
