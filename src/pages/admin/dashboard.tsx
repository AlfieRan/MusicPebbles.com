import { useEffect, useState } from "react";
import { Center, Flex, Table, Text } from "@chakra-ui/react";
import { ApiError } from "../../utils/types/errors";
import { useScreen } from "../../utils/hooks/useScreen";

const Page = () => {
    const [errors, setErrors] = useState<ApiError[]>([]);
    const [failed, setFailed] = useState<{ failed: boolean; error: string }>({
        failed: false,
        error: "",
    });
    const screenHook = useScreen();

    useEffect(() => {
        const fetchErrors = async () => {
            const res = await fetch("/api/admin/errors");
            const errors = await res.json();

            if (res.status !== 200) {
                setFailed({ failed: true, error: errors.error });
                return;
            }

            setErrors(errors);
        };

        fetchErrors().catch((err) => {
            setFailed({ failed: true, error: err.message });
        });
    }, []);

    return (
        <Center
            flexDir={"column"}
            w={"full"}
            h={`${screenHook.height}px`}
            minH={"70vh"}
        >
            {failed.failed ? (
                <Flex direction="column" align="center" pt={"xl"}>
                    <Text fontSize={"xl"}>Something went wrong :(</Text>
                    <Text textColor={"red.500"} fontSize={"sm"}>
                        {JSON.stringify(failed.error)}
                    </Text>
                </Flex>
            ) : (
                <Flex flexDir={"column"}>
                    <Text fontSize={"2xl"} textAlign={"center"}>
                        Api Errors
                    </Text>
                    <Flex
                        mx={"xl"}
                        maxW={"80vw"}
                        maxH={"70vh"}
                        flexDir={"column"}
                        overflowY={"scroll"}
                        borderWidth={1}
                        borderRadius={"lg"}
                    >
                        {errors.map((error, index) => (
                            <Flex
                                key={JSON.stringify(error.error) + error.api}
                                flexDir={"column"}
                                px={3}
                                py={2}
                                bg={index % 2 === 0 ? "DarkGrey" : "MidGrey"}
                                maxW={"inherit"}
                                overflow={"visible"}
                            >
                                <Table>
                                    <tr>
                                        <td className={"pr-5 py-1"}>
                                            Timestamp:
                                        </td>
                                        <td className={"py-1"}>
                                            {new Date(error.time).getTime()}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={"pr-5 py-1"}>Api:</td>
                                        <td className={"py-1"}>{error.api}</td>
                                    </tr>
                                    <tr>
                                        <td className={"pr-5 py-1"}>Status:</td>
                                        <td className={"py-1"}>
                                            {error.statusCode}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={"pr-5 py-1 align-top"}>
                                            Error:
                                        </td>
                                        <td className={"break-words py-1"}>
                                            <Text maxW={"60vw"}>
                                                {error.error}
                                            </Text>
                                        </td>
                                    </tr>
                                    {error.api === "spotify" && (
                                        <tr>
                                            <td
                                                className={
                                                    "pr-5 py-1 align-top"
                                                }
                                            >
                                                Raw:
                                            </td>
                                            <td
                                                className={
                                                    "break-words py-1 text-xs"
                                                }
                                            >
                                                <Text maxW={"60vw"}>
                                                    {error.apiResponse}
                                                </Text>
                                            </td>
                                        </tr>
                                    )}
                                </Table>
                            </Flex>
                        ))}
                    </Flex>
                    <Text fontSize={"md"} hidden={errors.length > 0}>
                        There are currently no error reports!
                    </Text>
                </Flex>
            )}
        </Center>
    );
};

export default Page;
