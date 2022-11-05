import { useEffect, useState } from "react";
import { Center, Flex, Text } from "@chakra-ui/react";
import { ApiError } from "../../utils/types/errors";

const Page = () => {
    const [errors, setErrors] = useState<ApiError[]>([]);
    const [failed, setFailed] = useState<{ failed: boolean; error: string }>({
        failed: false,
        error: "",
    });

    useEffect(() => {
        const fetchErrors = async () => {
            const res = await fetch("/api/admin/errors");
            const errors = await res.json();

            if (!res.ok) {
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
        <Center flexDir={"column"} w={"full"} h={"full"}>
            {failed.failed ? (
                <Flex direction="column" align="center" pt={"xl"}>
                    <Text fontSize={"xl"}>Something went wrong :(</Text>
                    <Text textColor={"red.500"} fontSize={"sm"}>
                        {failed.error}
                    </Text>
                </Flex>
            ) : (
                <Flex flexDir={"column"}>
                    <Text fontSize={"2xl"} textAlign={"center"}>
                        Api Errors
                    </Text>
                    <Flex mx={"xl"} maxW={"80vw"}>
                        {errors.map((error) => (
                            <Flex
                                key={error.error + error.api}
                                flexDir={"column"}
                                mx={"lg"}
                                my={"md"}
                                borderWidth={1}
                                borderRadius={"lg"}
                                px={"lg"}
                                py={"md"}
                            >
                                <Text fontSize={"sm"}>Api: {error.api}</Text>
                                <Text
                                    fontSize={"sm"}
                                    hidden={
                                        !(
                                            error.api === "internal" ||
                                            error.api === "spotify"
                                        )
                                    }
                                >
                                    {error.api === "internal" ||
                                    error.api === "spotify"
                                        ? "Status:" + error.statusCode
                                        : 500}
                                </Text>
                                <Text mx={"sm"} fontSize={"sm"}>
                                    Error: {error.error}
                                </Text>
                                <Text hidden={error.api !== "spotify"}>
                                    {error.api === "spotify"
                                        ? "Raw response: " + error.apiResponse
                                        : ""}
                                </Text>
                            </Flex>
                        ))}
                    </Flex>
                    <Text fontSize={"md"}>
                        There are currently no error reports!
                    </Text>
                </Flex>
            )}
        </Center>
    );
};

export default Page;
