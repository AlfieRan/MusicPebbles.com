import { useEffect, useState } from "react";
import { Center, Flex, Table, Text, Button } from "@chakra-ui/react";
import { ApiError, errorReports } from "../../utils/types/errors";
import { useScreen } from "../../utils/hooks/useScreen";

type selectionViews = "errors" | "reports";

const Page = () => {
    const [errors, setErrors] = useState<ApiError[]>([]);
    const [bugReports, setBugReports] = useState<errorReports>([]);
    const [failed, setFailed] = useState<{ failed: boolean; error: string }>({
        failed: false,
        error: "",
    });
    const screenHook = useScreen();
    const selectionOptions: selectionViews[] = ["errors", "reports"];
    const [selected, setSelected] = useState<selectionViews>("errors");

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

        const fetchReports = async () => {
            const res = await fetch("/api/admin/reports");
            const reports = await res.json();

            if (res.status !== 200) {
                setFailed({ failed: true, error: reports.error });
                return;
            }

            setBugReports(reports);
        };

        fetchErrors().catch((err) => {
            setFailed({ failed: true, error: err.message });
        });
        fetchReports().catch((err) => {
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
                <Flex
                    flexDir={"column"}
                    alignItems={"center"}
                    justifyContent={"flex-start"}
                >
                    <Flex
                        flexDir={"row"}
                        w={"90vw"}
                        justifyContent={"space-around"}
                    >
                        {selectionOptions.map((option) => (
                            <Button
                                onClick={() => setSelected(option)}
                                key={option}
                                bg={
                                    selected === option
                                        ? "blue.700"
                                        : "blue.500"
                                }
                                cursor={"pointer"}
                                p={"md"}
                                _hover={{
                                    bg: "blue.600",
                                    transform: "scale(1.05)",
                                }}
                                _active={{
                                    bg: "blue.700",
                                    transform: "scale(0.95)",
                                }}
                            >
                                <Text fontSize={"xl"}>{option}</Text>
                            </Button>
                        ))}
                    </Flex>
                    {selected === "errors" && (
                        <ErrorComponent errors={errors} />
                    )}
                    {selected === "reports" && (
                        <BugReports reports={bugReports} />
                    )}
                </Flex>
            )}
        </Center>
    );
};

function ErrorComponent(props: { errors: ApiError[] }) {
    return (
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
                {props.errors.map((error, index) => (
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
                            <tbody>
                                <tr>
                                    <td className={"pr-5 py-1"}>Timestamp:</td>
                                    <td className={"py-1"}>
                                        {new Date(error.time).toUTCString()}
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
                                        <Text maxW={"60vw"}>{error.error}</Text>
                                    </td>
                                </tr>
                                {error.api === "spotify" && (
                                    <tr>
                                        <td className={"pr-5 py-1 align-top"}>
                                            Raw:
                                        </td>
                                        <td
                                            className={
                                                "break-words py-1 text-xs"
                                            }
                                        >
                                            <Flex
                                                maxW={"60vw"}
                                                maxH={"50vh"}
                                                overflowX={"hidden"}
                                                overflowY={"scroll"}
                                            >
                                                <Text maxW={"60vw"}>
                                                    {error.apiResponse}
                                                </Text>
                                            </Flex>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Flex>
                ))}
            </Flex>
            <Text fontSize={"md"} hidden={props.errors.length > 0}>
                There are currently no error reports!
            </Text>
        </Flex>
    );
}

function BugReports(props: { reports: errorReports }) {
    return (
        <Flex flexDir={"column"}>
            <Text fontSize={"2xl"} textAlign={"center"}>
                Bug Reports
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
                {props.reports.map((report, index) => (
                    <Flex
                        key={
                            JSON.stringify(report.error) +
                            report.time +
                            report.ip
                        }
                        flexDir={"column"}
                        px={3}
                        py={2}
                        bg={index % 2 === 0 ? "DarkGrey" : "MidGrey"}
                        maxW={"inherit"}
                        overflow={"visible"}
                    >
                        <Table className={"min-w-[60vw]"}>
                            <tbody>
                                <tr>
                                    <td className={"pr-5 py-1"}>Timestamp:</td>
                                    <td className={"py-1"}>
                                        {new Date(report.time).toUTCString()}
                                    </td>
                                </tr>
                                <tr>
                                    <td className={"pr-5 py-1"}>Ip:</td>
                                    <td className={"py-1"}>{report.ip}</td>
                                </tr>
                                <tr>
                                    <td className={"pr-5 py-1 align-top"}>
                                        Error:
                                    </td>
                                    <td className={"break-words py-1"}>
                                        <Text maxW={"60vw"}>
                                            {report.error}
                                        </Text>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Flex>
                ))}
            </Flex>
            <Text fontSize={"md"} hidden={props.reports.length > 0}>
                There are currently no bug reports!
            </Text>
        </Flex>
    );
}

export default Page;
