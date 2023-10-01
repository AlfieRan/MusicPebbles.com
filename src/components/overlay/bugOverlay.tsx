import { Button, Flex, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import ExitButton from "./utils/exitButton";

export default function BugOverlay(props: {
    HU: number;
    WU: number;
    exit: () => void;
}) {
    const [bugReport, setBugReport] = useState("");
    const [error, setError] = useState<false | string>(false);
    const [success, setSuccess] = useState(false);

    async function sendBugReport() {
        setError(false);
        if (bugReport.length < 10 || bugReport.length > 1000) {
            setError("Please enter a report between 10 and 1000 characters.");
            return;
        }

        const data = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bugReport),
        };
        try {
            const response = await fetch("/api/admin/reports", data);
            if (response.status) {
                setSuccess(true);
            } else {
                console.error(response.statusText);
                setError(
                    `Something went wrong, please try again later. (code: ${response.status})`
                );
            }
        } catch (e) {
            setError("Something went wrong while sending the report.");
            console.error(e);
            return;
        }
        console.log("Bug report sent.");
    }

    return (
        <Flex
            className={"flex-col bg-black-500 py-3 rounded-lg"}
            px={`${props.WU * 0.2}px`}
            w={`${props.WU * 9.4}px`}
            key={"ProfileOverlay"}
        >
            <Flex
                flexDir={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                <Text fontSize={"xl"}>Report a Bug</Text>
                <ExitButton fn={props.exit} size={props.HU * 0.5} />
            </Flex>
            {!success ? (
                <Flex flexDir={"column"} w={`${props.WU * 9}px`} mt={3}>
                    {error !== false && (
                        <Flex
                            flexDir={"row"}
                            justifyContent={"center"}
                            w={"full"}
                            mb={"5px"}
                        >
                            <Text
                                color={"red"}
                                maxW={`${props.WU * 7}px`}
                                fontSize={"md"}
                                textAlign={"center"}
                            >
                                Error: {error}
                            </Text>
                        </Flex>
                    )}
                    <textarea
                        className={
                            "w-full h-full bg-black-400 text-sm px-2 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        }
                        style={{
                            minHeight: `${props.HU * 2}px`,
                            maxHeight: `${props.HU * 5}px`,
                        }}
                        placeholder={"What went wrong?"}
                        value={bugReport}
                        onChange={(e) => setBugReport(e.target.value)}
                        maxLength={1000}
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
                            _hover={{
                                bg: "blue.600",
                                transform: "scale(1.05)",
                            }}
                            _active={{
                                bg: "blue.700",
                                transform: "scale(0.95)",
                            }}
                            onClick={sendBugReport}
                        >
                            Submit
                        </Button>
                    </Flex>
                </Flex>
            ) : (
                <Flex
                    flexDir={"column"}
                    w={`${props.WU * 9}px`}
                    alignItems={"center"}
                >
                    <Text
                        color={"white"}
                        maxW={`${props.WU * 7}px`}
                        fontSize={{
                            base: `${props.WU * 0.4}px`,
                            md: `${props.WU * 0.2}px`,
                        }}
                        textAlign={"center"}
                        mb={`${props.WU * 0.4}px`}
                        mt={`${props.WU * 0.3}px`}
                    >
                        Thank you for helping to improve Pebbles!
                    </Text>
                    <Flex flexDir={"row"}>
                        <Button
                            minW={`${props.WU * 2}px`}
                            mx={`${props.WU * 0.2}px`}
                            fontSize={`${{
                                base: "sm",
                                md: "md",
                            }}`}
                            bg={"blue.500"}
                            _hover={{
                                bg: "blue.600",
                                transform: "scale(1.05)",
                            }}
                            _active={{
                                bg: "blue.700",
                                transform: "scale(0.95)",
                            }}
                            onClick={() => {
                                setSuccess(false);
                            }}
                        >
                            New Report
                        </Button>
                        <Button
                            minW={`${props.WU * 2}px`}
                            mx={`${props.WU * 0.2}px`}
                            fontSize={`${{
                                base: "sm",
                                md: "md",
                            }}`}
                            bg={"red.500"}
                            _hover={{
                                bg: "red.600",
                                transform: "scale(1.05)",
                            }}
                            _active={{
                                bg: "red.700",
                                transform: "scale(0.95)",
                            }}
                            onClick={props.exit}
                        >
                            Close
                        </Button>
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
}
