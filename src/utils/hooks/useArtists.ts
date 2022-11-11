import { useEffect, useState } from "react";
import { artistType } from "../types/spotify";
import { wrapImages } from "../spotify/other";

export function useArtists(): [artistType[], () => void] {
    const [artists, setArtists] = useState<artistType[]>([]);

    async function getArtists() {
        const response = await fetch("/api/user/artists");
        const data = await response.json();
        let newArtists: artistType[] = [];

        for (let artist of data) {
            newArtists.push({
                id: artist.id,
                name: artist.name,
                popularity: artist.popularity,
                genres: artist.genres,
                images: await wrapImages(artist.images),
                followers: artist.followers,
                external_urls: artist.external_urls,
                href: artist.href,
                uri: artist.uri,
                type: artist.type,
            });
        }

        setArtists(newArtists);
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
    }, 1000 * 60 * 15);

    return [artists, forceUpdate];
}
