import { Button, Flex, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import ExitButton from "./utils/exitButton";

export default function BugOverlay(props: {
    HU: number;
    WU: number;
    exit: () => void;
}) {
    return (
        <Flex
            flexDir={"column"}
            bg={"MidGrey"}
            px={`${props.WU * 0.2}px`}
            py={3}
            borderRadius={"10px"}
            w={`${props.WU * 9.4}px`}
            key={"ProfileOverlay"}
        >
            <Flex
                flexDir={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                mb={3}
            >
                <Text fontSize={"xl"}>Report a Bug</Text>
                <ExitButton fn={props.exit} size={props.HU * 0.5} />
            </Flex>
            <Flex flexDir={"column"} w={`${props.WU * 9}px`}>
                <Textarea
                    placeholder={"What went wrong?"}
                    value={
                        "Hi, this doesn't work right now and is just a ui placeholder, it will be added soon :)"
                    }
                    onChange={() => {}}
                    variant="filled"
                    bg={"LightGrey"}
                    maxLength={2500}
                />
                <Flex
                    w={"full"}
                    justifyContent={"center"}
                    mt={`${props.HU * 0.25}px`}
                    mb={`${props.HU * 0.1}px`}
                >
                    <Button
                        w={`${props.WU * 2}px`}
                        fontSize={`${{
                            base: "sm",
                            md: "md",
                        }}`}
                        bg={"blue.500"}
                        _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                        _active={{ bg: "blue.700", transform: "scale(0.95)" }}
                    >
                        Submit
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
}
