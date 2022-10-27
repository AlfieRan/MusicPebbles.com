import {useEffect, useState} from "react";
import {fetcher} from "../fetcher";

export default function useApi() {
    const [apiData, setApiData] = useState<string>("");
    const [apiError, setApiError] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            const response = await fetcher("GET", "/api/info", undefined, true);

            if (response.successful) {
                setApiData(response.data as string); // probably shouldn't be cast to string
            } else {
                setApiError(true);
                setApiData(response.error as string); // probably shouldn't be cast to string
            }
        }

        fetchData().catch(console.error);
    })

    return {apiData, apiError};
}