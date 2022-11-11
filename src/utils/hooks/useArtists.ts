import { useEffect, useState } from "react";
import { artistApiResponseType } from "../types/spotify";
import { wrapArtists } from "../spotify/wrappers";

export function useArtists(): [artistApiResponseType, () => void] {
    const [artists, setArtists] = useState<artistApiResponseType>({
        short_term: false,
        medium_term: false,
        long_term: false,
    });

    async function getArtists() {
        const response = await fetch("/api/user/artists");
        const data = (await response.json()) as artistApiResponseType;
        setArtists({
            short_term: await wrapArtists(data.short_term),
            medium_term: await wrapArtists(data.medium_term),
            long_term: await wrapArtists(data.long_term),
        });
    }

    function forceUpdate() {
        getArtists().catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getArtists().catch((err) => console.error(err));
    }, []);

    setInterval(() => {
        getArtists().catch((err) => console.error(err));
    }, 1000 * 60 * 60);

    return [artists, forceUpdate];
}
