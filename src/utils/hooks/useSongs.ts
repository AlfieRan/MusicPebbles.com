import { useEffect, useState } from "react";
import { songApiResponseType, songType } from "../types/spotify";
import { wrapSongs } from "../spotify/wrappers";

export function useSongs(): [songApiResponseType, () => void] {
    const [songs, setSongs] = useState<songApiResponseType>({
        short_term: false,
        medium_term: false,
        long_term: false,
    });

    async function getSongs() {
        const response = await fetch("/api/user/songs");
        const data = (await response.json()) as songApiResponseType;
        setSongs({
            short_term: await wrapSongs(data.short_term),
            medium_term: await wrapSongs(data.medium_term),
            long_term: await wrapSongs(data.long_term),
        });
    }

    function forceUpdate() {
        getSongs().catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getSongs().catch((err) => console.error(err));
    }, []);

    setInterval(() => {
        getSongs().catch((err) => console.error(err));
    }, 1000 * 60 * 60);

    return [songs, forceUpdate];
}
