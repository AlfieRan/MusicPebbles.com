import { Box, Button, Center, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Page = () => {
    const router = useRouter();
    const [error, setError] = useState<string | undefined>(undefined);

    function goHome() {
        router.push("/").catch(console.error);
    }

    useEffect(() => {
        setError(router.query.error as string);
    }, [router]);

    return (
        <Center h={"100%"} w={"100%"}>
            <Center
                h={"full"}
                w={"full"}
                flexDir={"column"}
                maxW={"600px"}
                m={"5%"}
            >
                <Text mb={3}>An Error has occurred.</Text>
                <Button
                    onClick={goHome}
                    bg={""}
                    borderWidth={1}
                    _hover={{ transform: "scale(1.05)" }}
                    _active={{ transform: "scale(0.95)" }}
                >
                    Go Back Home
                </Button>
                <Text hidden={error === undefined} mt={5} textColor={"red.400"}>
                    Error: {error}
                </Text>
            </Center>
        </Center>
    );
};

export default Page;
