import { useEffect, useState } from "react";
import { songType } from "../types/spotify";
import { wrapImages } from "../spotify/other";

export function useSongs(): [songType[], () => void] {
    const [songs, setSongs] = useState<songType[]>([]);

    async function getSongs() {
        const response = await fetch("/api/user/songs");
        const data = await response.json();
        let newSongs: songType[] = [];

        for (let i = 0; i < data.length; i++) {
            const song = data[i];
            newSongs.push({
                ranking: song.ranking,
                album: {
                    name: song.album.name,
                    images: await wrapImages(song.album.images),
                    release_date: song.album.release_date,
                },
                artists: song.artists,
                duration_ms: song.duration_ms,
                explicit: song.explicit,
                external_urls: song.external_urls,
                href: song.href,
                name: song.name,
                popularity: song.popularity,
                preview_url: song.preview_url,
            });
        }

        setSongs(newSongs);
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
    }, 1000 * 60 * 15);

    return [songs, forceUpdate];
}
