import {Text} from "@chakra-ui/react";
import useApi from "../utils/hooks/useApi";

const Api = () => {
    console.log("Setting up the API component")
    const api = useApi();

    return (
        <Text color={api.apiError ? "red.500" : "green.500"} fontSize={"sm"}>Api {api.apiError ? "Failed" : "Succeeded"}: {api.apiData}</Text>
    )
}

export default Api;