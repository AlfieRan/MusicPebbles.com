import { Box, Center, Text} from "@chakra-ui/react";
import Api from "../components/api";

const Page = () => {
    console.log("Any code put here will be executed before rendering the page");

    return (
        <Box h={"100vh"} w={"100%"}>
            <Center h={"full"} w={"full"} flexDir={"column"}>
                <Text>This is your index page :)</Text>
                <Api />
            </Center>
        </Box>
    );
};

export default Page;